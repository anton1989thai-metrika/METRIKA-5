import Imap from 'imap'
import { Prisma } from '@prisma/client'
import { simpleParser } from 'mailparser'
import { db } from './db'
import { initializeEmailUser } from './init-email'
import { storeAttachmentFile, StoredAttachment } from './attachments'
import { getMailPasswordByEmail } from './mail-password'
import { messageIdCandidates, normalizeMessageId } from './imap-message-id'

interface ImapConfig {
  host: string
  port: number
  user: string
  password: string
  tls: boolean
}

export const DEFAULT_IMAP_FOLDERS = ['INBOX', 'Sent', 'Drafts', 'Spam', 'Archive', 'Trash']

type ParsedHeaders = {
  get?: (key: string) => unknown
}

type ParsedAttachment = {
  contentType?: string
  filename?: string
  content?: Buffer | Uint8Array | string | ArrayBuffer
}

function toBuffer(raw: ParsedAttachment['content']): Buffer {
  if (!raw) return Buffer.from([])
  if (Buffer.isBuffer(raw)) return raw
  if (typeof raw === 'string') return Buffer.from(raw)
  if (raw instanceof ArrayBuffer) return Buffer.from(raw)
  if (raw instanceof Uint8Array) return Buffer.from(raw)
  return Buffer.from([])
}

function mailboxNameToSlug(mailboxName: string): string {
  const name = String(mailboxName || '').toLowerCase()
  if (name === 'inbox') return 'inbox'
  if (name === 'sent') return 'sent'
  if (name === 'drafts') return 'drafts'
  if (name === 'spam') return 'spam'
  if (name === 'archive') return 'archive'
  if (name === 'trash') return 'trash'
  return 'inbox'
}

async function resolveFolderId(userId: string, mailboxName: string): Promise<string | null> {
  const slug = mailboxNameToSlug(mailboxName)
  const folder = await db.folder.findFirst({
    where: { userId, slug },
  }).catch(() => null)
  return folder?.id || null
}

function isTrashMailbox(mailboxName: string): boolean {
  return String(mailboxName || '').trim().toLowerCase() === 'trash'
}

function resolveIsDeleted(mailboxName: string, flags: string[]): boolean {
  if (isTrashMailbox(mailboxName)) return true
  return flags.includes('\\Deleted')
}

type ExistingEmail = {
  id: string
  messageId: string
  folderId: string | null
  isRead: boolean
  isStarred: boolean
  isDeleted: boolean
  attachments: Prisma.JsonValue | null
  imapUid: number | null
  imapMailbox: string | null
}

async function findExistingEmailByUid(opts: {
  userId: string
  imapUid?: number | null
  imapMailbox?: string | null
}): Promise<ExistingEmail | null> {
  const { userId, imapUid, imapMailbox } = opts
  if (!imapUid || !imapMailbox) return null
  return db.email.findFirst({
    where: { userId, imapUid, imapMailbox },
    select: {
      id: true,
      messageId: true,
      folderId: true,
      isRead: true,
      isStarred: true,
      isDeleted: true,
      attachments: true,
      imapUid: true,
      imapMailbox: true,
    },
  })
}

async function findExistingEmailByMessageId(opts: {
  userId: string
  messageId: string
  allowFullScan?: boolean
  mailboxName?: string
  folderId?: string | null
}): Promise<ExistingEmail | null> {
  const { userId, messageId, allowFullScan = false, mailboxName, folderId } = opts
  if (!messageId) return null
  const normalized = normalizeMessageId(messageId)
  const candidates = Array.from(new Set(messageIdCandidates(messageId)))
  if (normalized) candidates.push(normalized)
  const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)))

  if (uniqueCandidates.length) {
    const hits = await db.email.findMany({
      where: { userId, messageId: { in: uniqueCandidates } },
      select: {
        id: true,
        messageId: true,
        folderId: true,
        isRead: true,
        isStarred: true,
        isDeleted: true,
        attachments: true,
        imapUid: true,
        imapMailbox: true,
      },
    })
    if (hits.length) {
      const mailboxKey = mailboxName ? mailboxName.toLowerCase() : null
      if (mailboxKey) {
        const mailboxMatches = hits.filter(
          (row) => (row.imapMailbox || '').toLowerCase() === mailboxKey
        )
        if (mailboxMatches.length === 1) return mailboxMatches[0]
        if (mailboxMatches.length > 1) return null
      }
      if (folderId) {
        const folderMatches = hits.filter((row) => row.folderId === folderId)
        if (folderMatches.length === 1) return folderMatches[0]
        if (folderMatches.length > 1) return null
      }
      if (hits.length === 1) return hits[0]
      return null
    }
  }

  if (!allowFullScan || !normalized) return null
  const all = await db.email.findMany({
    where: { userId },
    select: {
      id: true,
      messageId: true,
      folderId: true,
      isRead: true,
      isStarred: true,
      isDeleted: true,
      attachments: true,
      imapUid: true,
      imapMailbox: true,
    },
  })
  const normalizedMatches = all.filter((row) => normalizeMessageId(row.messageId) === normalized)
  if (!normalizedMatches.length) return null
  const mailboxKey = mailboxName ? mailboxName.toLowerCase() : null
  if (mailboxKey) {
    const mailboxMatches = normalizedMatches.filter(
      (row) => (row.imapMailbox || '').toLowerCase() === mailboxKey
    )
    if (mailboxMatches.length === 1) return mailboxMatches[0]
    if (mailboxMatches.length > 1) return null
  }
  if (folderId) {
    const folderMatches = normalizedMatches.filter((row) => row.folderId === folderId)
    if (folderMatches.length === 1) return folderMatches[0]
    if (folderMatches.length > 1) return null
  }
  if (normalizedMatches.length === 1) return normalizedMatches[0]
  return null
}

export async function getImapMailboxUidNext(
  email: string,
  mailboxName: string = 'INBOX',
  config?: ImapConfig
): Promise<{ success: boolean; uidNext?: number; error?: string }> {
  const password =
    config?.password ??
    (await getMailPasswordByEmail(email)) ??
    process.env.IMAP_PASS ??
    ''
  if (!password) {
    return { success: false, error: `Нет пароля для ящика ${email}. Задайте пароль в админ-панели → Email.` }
  }

  const imapConfig: ImapConfig = config || {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    user: email,
    password,
    tls: true,
  }

  return new Promise((resolve) => {
    const imap = new Imap({
      user: imapConfig.user,
      password: imapConfig.password,
      host: imapConfig.host,
      port: imapConfig.port,
      tls: imapConfig.tls,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 10_000,
      authTimeout: 10_000,
      socketTimeout: 20_000,
    })

    const done = (result: { success: boolean; uidNext?: number; error?: string }) => {
      try {
        imap.end()
      } catch {}
      resolve(result)
    }

    imap.once('ready', () => {
      imap.status(mailboxName, (err, box) => {
        if (err) {
          done({ success: false, error: err.message })
          return
        }
        const uidNext = typeof box?.uidnext === 'number' ? box.uidnext : undefined
        done({ success: true, uidNext })
      })
    })

    imap.once('error', (err) => {
      done({ success: false, error: err.message })
    })

    imap.connect()
  })
}

async function syncEmailsFromIMAP(
  email: string,
  name?: string,
  config?: ImapConfig,
  mailboxName: string = 'INBOX',
  limit: number = 50
) {
  // Get or create user
  const user = await initializeEmailUser(email, name)
  const userId = user.id

  // Resolve folderId in DB for this mailbox (best-effort)
  const folderId = await resolveFolderId(userId, mailboxName)

  const password =
    config?.password ??
    (await getMailPasswordByEmail(email)) ??
    process.env.IMAP_PASS ??
    ''
  if (!password) {
    return { success: false, count: 0, error: `Нет пароля для ящика ${email}. Задайте пароль в админ-панели → Email.` }
  }

  // Use config from env or provided config
  const imapConfig: ImapConfig = config || {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    // По умолчанию логинимся именно как целевой ящик (user@domain).
    // Это важно, иначе при наличии IMAP_USER в env можно случайно синхронизировать
    // один ящик в несколько "пользователей" в базе.
    user: email,
    password,
    tls: true,
  }

  return new Promise<{ success: boolean; count: number; error?: string }>(
    (resolve) => {
      const imap = new Imap({
        user: imapConfig.user,
        password: imapConfig.password,
        host: imapConfig.host,
        port: imapConfig.port,
        tls: imapConfig.tls,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 10_000,
        authTimeout: 10_000,
        socketTimeout: 30_000,
        keepalive: {
          interval: 10_000,
          idleInterval: 30_000,
          forceNoop: true,
        },
      })

      let syncedCount = 0
      let errorMessage: string | undefined

      imap.once('ready', () => {
        imap.openBox(mailboxName, false, (err) => {
          if (err) {
            errorMessage = `Ошибка открытия ${mailboxName}: ${err.message}`
            imap.end()
            resolve({ success: false, count: 0, error: errorMessage })
            return
          }

          // Fetch recent emails (last N) to avoid missing messages that are already SEEN
          imap.search(['ALL'], async (err, results) => {
            if (err) {
              errorMessage = `Ошибка поиска писем: ${err.message}`
              imap.end()
              resolve({ success: false, count: 0, error: errorMessage })
              return
            }

            if (!results || results.length === 0) {
              imap.end()
              resolve({ success: true, count: 0 })
              return
            }

            const slice = results.slice(Math.max(0, results.length - Math.max(1, limit)))

            const fetch = imap.fetch(slice, {
              bodies: '',
              struct: true,
              markSeen: false,
            })
            const tasks: Array<Promise<void>> = []

            fetch.on('message', (msg, seqno) => {
              let flags: string[] = []
              let uid: number | undefined
              msg.on('attributes', (attrs: Imap.ImapMessageAttributes) => {
                if (attrs?.flags && Array.isArray(attrs.flags)) {
                  flags = attrs.flags
                }
                if (typeof attrs?.uid === 'number') {
                  uid = attrs.uid
                }
              })

              msg.on('body', (stream) => {
                const task = (async () => {
                  try {
                    const parsed = await simpleParser(stream)
                    const messageId = parsed.messageId || `<${parsed.date?.getTime()}@unknown>`
                    const isReadFlag = flags.includes('\\Seen')
                    const isStarredFlag = flags.includes('\\Flagged')
                    const isDeletedFlag = resolveIsDeleted(mailboxName, flags)

                    // Check if email already exists
                    const existingByUid = await findExistingEmailByUid({
                      userId,
                      imapUid: typeof uid === 'number' ? uid : null,
                      imapMailbox: mailboxName,
                    })
                    let existingEmail = existingByUid
                    if (!existingEmail) {
                      const byMessageId = await findExistingEmailByMessageId({
                        userId,
                        messageId,
                        mailboxName,
                        folderId,
                      })
                      if (
                        byMessageId &&
                        typeof uid === 'number' &&
                        byMessageId.imapMailbox === mailboxName &&
                        byMessageId.imapUid &&
                        byMessageId.imapUid !== uid
                      ) {
                        existingEmail = null
                      } else {
                        existingEmail = byMessageId
                      }
                    }

                    const isBounce = (() => {
                      const from = String(parsed.from?.text || '').toLowerCase()
                      const subject = String(parsed.subject || '').toLowerCase()
                      const headers = parsed.headers as ParsedHeaders | undefined
                      const autoSubmitted = String(headers?.get?.('auto-submitted') ?? '').toLowerCase()
                      if (from.includes('mailer-daemon') || from.includes('postmaster')) return true
                      if (subject.includes('delivery status notification')) return true
                      if (subject.includes('undelivered')) return true
                      if (subject.includes('returned to sender')) return true
                      if (subject.includes('mail delivery subsystem')) return true
                      if (subject.includes('failure notice')) return true
                      if (autoSubmitted.includes('auto-replied') || autoSubmitted.includes('auto-generated')) return true
                      return false
                    })()

                    const textBody = String(parsed.text || '')
                    const bounceRecipientMatch =
                      textBody.match(/Final-Recipient:\s*rfc822;\s*([^\s]+)/i) ||
                      textBody.match(/Original-Recipient:\s*rfc822;\s*([^\s]+)/i) ||
                      textBody.match(/Recipient:\s*([^\s]+)/i)
                    const bounceRecipient = bounceRecipientMatch ? bounceRecipientMatch[1] : null

                    const incomingAttachments = Array.isArray(parsed.attachments)
                      ? (parsed.attachments as ParsedAttachment[])
                      : []
                    const existingAttachments = Array.isArray(existingEmail?.attachments)
                      ? (existingEmail?.attachments as StoredAttachment[])
                      : []
                    const needsBackfill =
                      !!existingEmail &&
                      incomingAttachments.length > 0 &&
                      (existingAttachments.length === 0 ||
                        existingAttachments.some((a) => !a?.path || !a?.id))

                    // Create or find thread
                    let thread = await db.thread.findFirst({
                      where: {
                        userId,
                        subject: parsed.subject || '(без темы)',
                      },
                    })

                    if (!thread) {
                      thread = await db.thread.create({
                        data: {
                          userId,
                          subject: parsed.subject || '(без темы)',
                        },
                      })
                    }

                    // Save email to database
                    try {
                      const storedAttachments = []
                      for (const att of incomingAttachments) {
                        try {
                          const contentType = att.contentType || 'application/octet-stream'
                          const filename = att.filename || 'unknown'
                          const buf = toBuffer(att.content)
                          if (buf.length === 0) continue

                          const stored = await storeAttachmentFile({
                            userId,
                            messageKey: messageId,
                            filename,
                            contentType,
                            content: buf,
                          })
                          storedAttachments.push(stored)
                        } catch {
                          // ignore per-attachment errors
                        }
                      }

                      if (existingEmail && needsBackfill) {
                        await db.email.update({
                          where: { id: existingEmail.id },
                          data: {
                            attachments: storedAttachments.length
                              ? (storedAttachments as Prisma.InputJsonValue)
                              : undefined,
                          },
                        })
                      }

                      if (existingEmail) {
                        const nextFolderId = folderId || null
                        const nextImapUid = typeof uid === 'number' ? uid : existingEmail.imapUid
                        const needsFolderUpdate = existingEmail.folderId !== nextFolderId
                        const needsImapUpdate =
                          (typeof uid === 'number' && existingEmail.imapUid !== uid) ||
                          existingEmail.imapMailbox !== mailboxName

                        if (
                          needsFolderUpdate ||
                          needsImapUpdate ||
                          existingEmail.isRead !== isReadFlag ||
                          existingEmail.isStarred !== isStarredFlag ||
                          existingEmail.isDeleted !== isDeletedFlag
                        ) {
                          await db.email.update({
                            where: { id: existingEmail.id },
                            data: {
                              isRead: isReadFlag,
                              isStarred: isStarredFlag,
                              isDeleted: isDeletedFlag,
                              folderId: nextFolderId,
                              imapUid: nextImapUid ?? null,
                              imapMailbox: mailboxName,
                            },
                          })
                        }
                        if (isBounce && parsed.messageId) {
                          await db.mailDeliveryFailure
                            .create({
                              data: {
                                mailboxEmail: email,
                                userId,
                                messageId: parsed.messageId,
                                recipient: bounceRecipient,
                                subject: parsed.subject || null,
                                error: textBody ? textBody.slice(0, 500) : null,
                                source: 'bounce',
                              },
                            })
                            .catch(() => null)
                        }
                        return // Skip if already exists
                      }

                      await db.email.create({
                        data: {
                          messageId,
                          threadId: thread.id,
                          userId,
                          folderId,
                          from: parsed.from?.text || parsed.from?.value[0]?.address || 'unknown@unknown.com',
                          to: parsed.to?.text || email,
                          cc: parsed.cc?.text || null,
                          bcc: parsed.bcc?.text || null,
                          subject: parsed.subject || '(без темы)',
                          text: parsed.text || null,
                          html: parsed.html || null,
                          date: parsed.date || new Date(),
                          isRead: isReadFlag,
                          isStarred: isStarredFlag,
                          isDeleted: isDeletedFlag,
                          imapUid: typeof uid === 'number' ? uid : null,
                          imapMailbox: mailboxName,
                          attachments: storedAttachments.length
                            ? (storedAttachments as Prisma.InputJsonValue)
                            : undefined,
                        },
                      })

                      if (isBounce && parsed.messageId) {
                        await db.mailDeliveryFailure
                          .create({
                            data: {
                              mailboxEmail: email,
                              userId,
                              messageId: parsed.messageId,
                              recipient: bounceRecipient,
                              subject: parsed.subject || null,
                              error: textBody ? textBody.slice(0, 500) : null,
                              source: 'bounce',
                            },
                          })
                          .catch(() => null)
                      }
                    } catch (e) {
                      // Ignore duplicate inserts (can happen due to concurrency/race during sync)
                      const err = e as { code?: string }
                      if (err?.code !== 'P2002') {
                        throw e
                      }
                    }

                    syncedCount++
                  } catch (error) {
                    console.error(`Ошибка обработки письма ${seqno}:`, error)
                  }
                })()
                tasks.push(task)
              })

              msg.once('end', () => {
                // Message processed
              })
            })

            fetch.once('error', (err) => {
              errorMessage = `Ошибка получения писем: ${err.message}`
            })

            fetch.once('end', () => {
              void (async () => {
                await Promise.allSettled(tasks)
                imap.end()
                resolve({ success: true, count: syncedCount, error: errorMessage })
              })()
            })
          })
        })
      })

      imap.once('error', (err) => {
        errorMessage = `Ошибка IMAP подключения: ${err.message}`
        resolve({ success: false, count: 0, error: errorMessage })
      })

      imap.connect()
    }
  )
}

export async function importMessageByMessageId(opts: {
  mailboxEmail: string
  mailboxName: string
  messageId: string
}) {
  const { mailboxEmail, mailboxName, messageId } = opts
  const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
  const userId = user.id
  const folderId = await resolveFolderId(userId, mailboxName)

  const password =
    (await getMailPasswordByEmail(mailboxEmail)) ??
    process.env.IMAP_PASS ??
    ''
  if (!password) {
    throw new Error(`Нет пароля для ящика ${mailboxEmail}`)
  }

  const imapConfig: ImapConfig = {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    user: mailboxEmail,
    password,
    tls: true,
  }

  return new Promise<{ created: boolean; messageId?: string }>((resolve, reject) => {
    const imap = new Imap({
      user: imapConfig.user,
      password: imapConfig.password,
      host: imapConfig.host,
      port: imapConfig.port,
      tls: imapConfig.tls,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 10_000,
      authTimeout: 10_000,
      socketTimeout: 30_000,
    })

    const done = (err?: unknown, result?: { created: boolean; messageId?: string }) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve(result || { created: false })
    }

    imap.once('ready', () => {
      imap.openBox(mailboxName, false, (err) => {
        if (err) return done(err)

        const candidates = messageIdCandidates(messageId)
        const runSearch = (idx: number) => {
          if (idx >= candidates.length) return done()
          imap.search(['HEADER', 'MESSAGE-ID', candidates[idx]], (err, results) => {
            if (err) return done(err)
            if (!results || results.length === 0) return runSearch(idx + 1)

            const fetch = imap.fetch(results, { bodies: '', struct: true, markSeen: false })
            const tasks: Array<Promise<void>> = []
            let handled = false
            fetch.on('message', (msg) => {
              let flags: string[] = []
              let uid: number | undefined
              msg.on('attributes', (attrs: Imap.ImapMessageAttributes) => {
                if (attrs?.flags && Array.isArray(attrs.flags)) flags = attrs.flags
                if (typeof attrs?.uid === 'number') uid = attrs.uid
              })
              msg.on('body', (stream) => {
                const task = (async () => {
                  const parsed = await simpleParser(stream)
                  const nextMessageId = parsed.messageId || messageId
                  const existingByUid = await findExistingEmailByUid({
                    userId,
                    imapUid: typeof uid === 'number' ? uid : null,
                    imapMailbox: mailboxName,
                  })
                  let existing = existingByUid
                  if (!existing) {
                    const byMessageId = await findExistingEmailByMessageId({
                      userId,
                      messageId: nextMessageId,
                      allowFullScan: true,
                      mailboxName,
                      folderId,
                    })
                    if (
                      byMessageId &&
                      typeof uid === 'number' &&
                      byMessageId.imapMailbox === mailboxName &&
                      byMessageId.imapUid &&
                      byMessageId.imapUid !== uid
                    ) {
                      existing = null
                    } else {
                      existing = byMessageId
                    }
                  }
                  const isReadFlag = flags.includes('\\Seen')
                  const isStarredFlag = flags.includes('\\Flagged')
                  const isDeletedFlag = resolveIsDeleted(mailboxName, flags)

                  if (existing) {
                    const nextFolderId = folderId || null
                    const nextImapUid = typeof uid === 'number' ? uid : existing.imapUid
                    await db.email.update({
                      where: { id: existing.id },
                      data: {
                        isRead: isReadFlag,
                        isStarred: isStarredFlag,
                        isDeleted: isDeletedFlag,
                        folderId: nextFolderId,
                        imapUid: nextImapUid ?? null,
                        imapMailbox: mailboxName,
                      },
                    })
                    handled = true
                    return
                  }

                  let thread = await db.thread.findFirst({
                    where: { userId, subject: parsed.subject || '(без темы)' },
                  })
                  if (!thread) {
                    thread = await db.thread.create({
                      data: { userId, subject: parsed.subject || '(без темы)' },
                    })
                  }

                  const incomingAttachments = Array.isArray(parsed.attachments)
                    ? (parsed.attachments as ParsedAttachment[])
                    : []
                  const storedAttachments = []
                  for (const att of incomingAttachments) {
                    try {
                      const contentType = att.contentType || 'application/octet-stream'
                      const filename = att.filename || 'unknown'
                      const buf = toBuffer(att.content)
                      if (buf.length === 0) continue

                      const stored = await storeAttachmentFile({
                        userId,
                        messageKey: nextMessageId,
                        filename,
                        contentType,
                        content: buf,
                      })
                      storedAttachments.push(stored)
                    } catch {
                      // ignore per-attachment errors
                    }
                  }

                  const emailPayload = {
                    messageId: nextMessageId,
                    threadId: thread.id,
                    userId,
                    folderId,
                    from: parsed.from?.text || parsed.from?.value[0]?.address || 'unknown@unknown.com',
                    to: parsed.to?.text || mailboxEmail,
                    cc: parsed.cc?.text || null,
                    bcc: parsed.bcc?.text || null,
                    subject: parsed.subject || '(без темы)',
                    text: parsed.text || null,
                    html: parsed.html || null,
                    date: parsed.date || new Date(),
                    isRead: isReadFlag,
                    isStarred: isStarredFlag,
                    isDeleted: isDeletedFlag,
                    imapUid: typeof uid === 'number' ? uid : null,
                    imapMailbox: mailboxName,
                    attachments: storedAttachments.length
                      ? (storedAttachments as Prisma.InputJsonValue)
                      : undefined,
                  }

                  try {
                    await db.email.create({ data: emailPayload })
                  } catch (e) {
                    const err = e as { code?: string }
                    if (err?.code === 'P2002' && typeof uid === 'number') {
                      await db.email.updateMany({
                        where: { userId, imapMailbox: mailboxName, imapUid: uid },
                        data: emailPayload,
                      })
                    } else if (err?.code !== 'P2002') {
                      throw e
                    }
                  }

                  handled = true
                })()
                tasks.push(task)
              })
            })

            fetch.once('end', () => {
              void (async () => {
                const results = await Promise.allSettled(tasks)
                const failed = results.find((r) => r.status === 'rejected')
                if (failed && failed.status === 'rejected') {
                  done(failed.reason)
                  return
                }
                done(undefined, { created: handled, messageId })
              })()
            })
            fetch.once('error', (err) => done(err))
          })
        }

        runSearch(0)
      })
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}

export async function importMessageByUid(opts: {
  mailboxEmail: string
  mailboxName: string
  uid: number
  messageId?: string
}) {
  const { mailboxEmail, mailboxName, uid, messageId: fallbackMessageId } = opts
  const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
  const userId = user.id
  const folderId = await resolveFolderId(userId, mailboxName)

  const password =
    (await getMailPasswordByEmail(mailboxEmail)) ??
    process.env.IMAP_PASS ??
    ''
  if (!password) {
    throw new Error(`Нет пароля для ящика ${mailboxEmail}`)
  }

  const imapConfig: ImapConfig = {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    user: mailboxEmail,
    password,
    tls: true,
  }

  return new Promise<{ created: boolean; uid?: number }>((resolve, reject) => {
    const imap = new Imap({
      user: imapConfig.user,
      password: imapConfig.password,
      host: imapConfig.host,
      port: imapConfig.port,
      tls: imapConfig.tls,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 10_000,
      authTimeout: 10_000,
      socketTimeout: 30_000,
    })

    const done = (err?: unknown, result?: { created: boolean; uid?: number }) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve(result || { created: false })
    }

    imap.once('ready', () => {
      imap.openBox(mailboxName, false, (err) => {
        if (err) return done(err)

        const fetch = imap.fetch([uid], { bodies: '', struct: true, markSeen: false })
        const tasks: Array<Promise<void>> = []
        let handled = false
        fetch.on('message', (msg) => {
          let flags: string[] = []
          msg.on('attributes', (attrs: Imap.ImapMessageAttributes) => {
            if (attrs?.flags && Array.isArray(attrs.flags)) flags = attrs.flags
          })
          msg.on('body', (stream) => {
            const task = (async () => {
              const parsed = await simpleParser(stream)
              const nextMessageId =
                parsed.messageId ||
                (fallbackMessageId && fallbackMessageId.trim()) ||
                `<${Date.now()}@unknown>`
              const existingByUid = await findExistingEmailByUid({
                userId,
                imapUid: typeof uid === 'number' ? uid : null,
                imapMailbox: mailboxName,
              })
              let existing = existingByUid
              if (!existing) {
                const byMessageId = await findExistingEmailByMessageId({
                  userId,
                  messageId: nextMessageId,
                  allowFullScan: true,
                  mailboxName,
                  folderId,
                })
                if (
                  byMessageId &&
                  typeof uid === 'number' &&
                  byMessageId.imapMailbox === mailboxName &&
                  byMessageId.imapUid &&
                  byMessageId.imapUid !== uid
                ) {
                  existing = null
                } else {
                  existing = byMessageId
                }
              }
              const isReadFlag = flags.includes('\\Seen')
              const isStarredFlag = flags.includes('\\Flagged')
              const isDeletedFlag = resolveIsDeleted(mailboxName, flags)

              if (existing) {
                const nextFolderId = folderId || null
                await db.email.update({
                  where: { id: existing.id },
                  data: {
                    isRead: isReadFlag,
                    isStarred: isStarredFlag,
                    isDeleted: isDeletedFlag,
                    folderId: nextFolderId,
                    imapUid: uid,
                    imapMailbox: mailboxName,
                  },
                })
                handled = true
                return
              }

              let thread = await db.thread.findFirst({
                where: { userId, subject: parsed.subject || '(без темы)' },
              })
              if (!thread) {
                thread = await db.thread.create({
                  data: { userId, subject: parsed.subject || '(без темы)' },
                })
              }

              const incomingAttachments = Array.isArray(parsed.attachments)
                ? (parsed.attachments as ParsedAttachment[])
                : []
              const storedAttachments = []
              for (const att of incomingAttachments) {
                try {
                  const contentType = att.contentType || 'application/octet-stream'
                  const filename = att.filename || 'unknown'
                  const buf = toBuffer(att.content)
                  if (buf.length === 0) continue

                  const stored = await storeAttachmentFile({
                    userId,
                    messageKey: nextMessageId,
                    filename,
                    contentType,
                    content: buf,
                  })
                  storedAttachments.push(stored)
                } catch {
                  // ignore per-attachment errors
                }
              }

              const emailPayload = {
                messageId: nextMessageId,
                threadId: thread.id,
                userId,
                folderId,
                from: parsed.from?.text || parsed.from?.value[0]?.address || 'unknown@unknown.com',
                to: parsed.to?.text || mailboxEmail,
                cc: parsed.cc?.text || null,
                bcc: parsed.bcc?.text || null,
                subject: parsed.subject || '(без темы)',
                text: parsed.text || null,
                html: parsed.html || null,
                date: parsed.date || new Date(),
                isRead: isReadFlag,
                isStarred: isStarredFlag,
                isDeleted: isDeletedFlag,
                imapUid: uid,
                imapMailbox: mailboxName,
                attachments: storedAttachments.length
                  ? (storedAttachments as Prisma.InputJsonValue)
                  : undefined,
              }

              try {
                await db.email.create({ data: emailPayload })
              } catch (e) {
                const err = e as { code?: string }
                if (err?.code === 'P2002') {
                  await db.email.updateMany({
                    where: { userId, imapMailbox: mailboxName, imapUid: uid },
                    data: emailPayload,
                  })
                } else if (err?.code !== 'P2002') {
                  throw e
                }
              }

              handled = true
            })()
            tasks.push(task)
          })
        })

        fetch.once('end', () => {
          void (async () => {
            const results = await Promise.allSettled(tasks)
            const failed = results.find((r) => r.status === 'rejected')
            if (failed && failed.status === 'rejected') {
              done(failed.reason)
              return
            }
            done(undefined, { created: handled, uid })
          })()
        })
        fetch.once('error', (err) => done(err))
      })
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}

export async function syncMailboxFolders(
  email: string,
  name?: string,
  config?: ImapConfig,
  folders: string[] = DEFAULT_IMAP_FOLDERS,
  limit: number = 50
) {
  const results: Array<{ folder: string; success: boolean; count: number; error?: string }> = []
  let totalSynced = 0

  for (const folder of folders) {
    const r = await syncEmailsFromIMAP(email, name, config, folder, limit)
    results.push({ folder, ...r })
    if (r.success) totalSynced += r.count
  }

  return { email, totalSynced, results }
}

// Sync all configured email accounts
export async function syncAllEmails() {
  // Если указан SYNC_EMAILS в env, используем его.
  // Иначе (пока у нас один ящик) синхронизируем DEFAULT_MAILBOX_EMAIL.
  const emails =
    process.env.SYNC_EMAILS?.split(',').map((e) => e.trim()).filter(Boolean) ??
    [process.env.DEFAULT_MAILBOX_EMAIL || process.env.IMAP_USER || 'info@metrika.direct']

  const results = []

  for (const email of emails) {
    if (!email.trim()) continue

    try {
      const result = await syncMailboxFolders(email.trim())
      results.push(result)
    } catch (error) {
      const err = error as { message?: string }
      results.push({
        email: email.trim(),
        totalSynced: 0,
        results: [],
        error: err.message || 'Unknown error',
      })
    }
  }

  return results
}
