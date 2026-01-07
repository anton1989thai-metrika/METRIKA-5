import Imap from 'imap'
import { simpleParser } from 'mailparser'
import { db } from './db'
import { initializeEmailUser } from './init-email'
import { storeAttachmentFile } from './attachments'

interface ImapConfig {
  host: string
  port: number
  user: string
  password: string
  tls: boolean
}

export async function getImapMailboxUidNext(
  email: string,
  mailboxName: string = 'INBOX',
  config?: ImapConfig
): Promise<{ success: boolean; uidNext?: number; error?: string }> {
  const imapConfig: ImapConfig = config || {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    user: email,
    password: process.env.IMAP_PASS || '',
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
        const uidNext = typeof (box as any)?.uidnext === 'number' ? (box as any).uidnext : undefined
        done({ success: true, uidNext })
      })
    })

    imap.once('error', (err) => {
      done({ success: false, error: err.message })
    })

    imap.connect()
  })
}

export async function syncEmailsFromIMAP(
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
  const normalizedMailbox = mailboxName.toUpperCase() === 'INBOX'
    ? 'inbox'
    : mailboxName.toLowerCase() === 'sent'
      ? 'sent'
      : mailboxName.toLowerCase()
  const folder = await db.folder.findFirst({
    where: { userId, slug: normalizedMailbox },
  }).catch(() => null)
  const folderId = folder?.id || null

  // Use config from env or provided config
  const imapConfig: ImapConfig = config || {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    // По умолчанию логинимся именно как целевой ящик (user@domain).
    // Это важно, иначе при наличии IMAP_USER в env можно случайно синхронизировать
    // один ящик в несколько "пользователей" в базе.
    user: email,
    password: process.env.IMAP_PASS || '',
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
        imap.openBox(mailboxName, false, (err, box) => {
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

            fetch.on('message', (msg, seqno) => {
              let flags: string[] = []
              msg.on('attributes', (attrs: any) => {
                if (attrs?.flags && Array.isArray(attrs.flags)) {
                  flags = attrs.flags
                }
              })

              msg.on('body', async (stream) => {
                try {
                  const parsed = await simpleParser(stream)
                  
                  // Check if email already exists
                  const existingEmail = await db.email.findFirst({
                    where: {
                      messageId: parsed.messageId || `<${parsed.date?.getTime()}@unknown>`,
                      userId,
                    },
                  })

                  const incomingAttachments = Array.isArray(parsed.attachments) ? parsed.attachments : []
                  const needsBackfill =
                    !!existingEmail &&
                    incomingAttachments.length > 0 &&
                    (!existingEmail.attachments ||
                      (Array.isArray(existingEmail.attachments as any) &&
                        (existingEmail.attachments as any).some((a: any) => !a?.path || !a?.id)))

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
                    const messageId = parsed.messageId || `<${parsed.date?.getTime()}@unknown>`

                    const storedAttachments = []
                    for (const att of incomingAttachments) {
                      try {
                        const contentType = (att as any).contentType || 'application/octet-stream'
                        const filename = (att as any).filename || 'unknown'
                        const raw = (att as any).content
                        const buf = Buffer.isBuffer(raw)
                          ? raw
                          : raw
                            ? Buffer.from(raw)
                            : Buffer.from([])
                        if (buf.length === 0) continue

                        const stored = await storeAttachmentFile({
                          userId,
                          messageKey: messageId,
                          filename,
                          contentType,
                          content: buf,
                        })
                        storedAttachments.push(stored)
                      } catch (e) {
                        // ignore per-attachment errors
                      }
                    }

                    if (existingEmail && needsBackfill) {
                      await db.email.update({
                        where: { id: existingEmail.id },
                        data: { attachments: storedAttachments.length ? (storedAttachments as any) : null },
                      })
                      return
                    }

                    if (existingEmail) {
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
                        isRead: flags.includes('\\Seen'),
                        isStarred: false,
                        isDeleted: false,
                        attachments: storedAttachments.length ? (storedAttachments as any) : null,
                      },
                    })
                  } catch (e: any) {
                    // Ignore duplicate inserts (can happen due to concurrency/race during sync)
                    if (e?.code !== 'P2002') {
                      throw e
                    }
                  }

                  syncedCount++
                } catch (error: any) {
                  console.error(`Ошибка обработки письма ${seqno}:`, error)
                }
              })

              msg.once('end', () => {
                // Message processed
              })
            })

            fetch.once('error', (err) => {
              errorMessage = `Ошибка получения писем: ${err.message}`
            })

            fetch.once('end', () => {
              imap.end()
              resolve({ success: true, count: syncedCount, error: errorMessage })
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
      const result = await syncEmailsFromIMAP(email.trim())
      results.push({ email: email.trim(), ...result })
    } catch (error: any) {
      results.push({
        email: email.trim(),
        success: false,
        count: 0,
        error: error.message,
      })
    }
  }

  return results
}

