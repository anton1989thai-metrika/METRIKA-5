import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { listServerMailboxes } from '@/lib/mailbox-access'
import { ImapHeaderInfo, listImapMessageHeaders } from '@/lib/imap-audit'
import {
  applyImapFlagsByMessageIds,
  applyImapFlagsByUids,
  getImapMailboxName,
  moveImapMessagesByMessageIds,
  moveImapMessagesByUids,
} from '@/lib/imap-actions'
import { importMessageByMessageId, importMessageByUid } from '@/lib/imap-sync'
import { getMailPasswordByEmail } from '@/lib/mail-password'
import { initializeEmailUser } from '@/lib/init-email'
import { db } from '@/lib/db'
import { normalizeMessageId } from '@/lib/imap-message-id'
import { appendEmailToImap } from '@/lib/imap-append'
import { StoredAttachment } from '@/lib/attachments'

export const runtime = 'nodejs'

const FOLDERS = ['INBOX', 'Sent', 'Drafts', 'Spam', 'Archive', 'Trash']

type DbEmailRow = {
  id: string
  messageId: string
  subject: string | null
  date: Date | null
  isDeleted: boolean
  isRead: boolean
  isStarred: boolean
  folder?: { slug: string | null } | null
  imapUid?: number | null
  imapMailbox?: string | null
}

type ServerOnlyItem = {
  mailboxEmail: string
  folderName: string
  messageId: string
  uid?: number | null
  subject?: string | null
  date?: string | null
}

type DbOnlyItem = {
  mailboxEmail: string
  folderName: string
  messageId: string
  emailId: string
  subject?: string | null
  date?: string | null
}

type StateMismatchItem = {
  key: string
  mailboxEmail: string
  messageId: string
  uid?: number | null
  subject?: string | null
  date?: string | null
  serverFolderName: string
  dbFolderName: string
  serverIsRead: boolean
  serverIsStarred: boolean
  serverIsDeleted: boolean
  dbIsRead: boolean
  dbIsStarred: boolean
  dbIsDeleted: boolean
  emailId: string
}

type BackfillSummary = {
  mailboxEmail: string
  attempted: number
  updated: number
  missing: number
  conflicts: number
  skipped: number
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

function getMailboxNameFromEmailRow(row: {
  folderSlug?: string | null
  isDeleted?: boolean
}): string {
  if (row.isDeleted) return 'Trash'
  const slug = String(row.folderSlug || '').toLowerCase()
  if (!slug || slug === 'inbox') return 'INBOX'
  if (slug === 'sent') return 'Sent'
  if (slug === 'drafts') return 'Drafts'
  if (slug === 'spam') return 'Spam'
  if (slug === 'archive') return 'Archive'
  if (slug === 'trash') return 'Trash'
  return 'INBOX'
}

async function backfillMailboxUids(opts: {
  mailboxEmail: string
  limit: number
  folders: string[]
}): Promise<BackfillSummary> {
  const { mailboxEmail, limit, folders } = opts
  const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
  const userId = user.id

  const normalizedFolders = folders.length ? folders : FOLDERS
  const serverByFolder = new Map<string, Map<string, ImapHeaderInfo[]>>()

  for (const folderName of normalizedFolders) {
    const serverHeaders: ImapHeaderInfo[] = await listImapMessageHeaders({
      mailboxEmail,
      mailboxName: folderName,
    }).catch(() => [])
    const folderMap = new Map<string, ImapHeaderInfo[]>()
    for (const h of serverHeaders) {
      if (!h.messageId || typeof h.uid !== 'number') continue
      const normalizedId = normalizeMessageId(h.messageId)
      if (!normalizedId) continue
      const list = folderMap.get(normalizedId) || []
      list.push(h)
      folderMap.set(normalizedId, list)
    }
    serverByFolder.set(folderName, folderMap)
  }

  const candidates = await db.email.findMany({
    where: {
      userId,
      OR: [{ imapUid: null }, { imapMailbox: null }],
    },
    select: {
      id: true,
      messageId: true,
      imapUid: true,
      imapMailbox: true,
      isDeleted: true,
      folder: { select: { slug: true } },
    },
    orderBy: { date: 'desc' },
    take: limit,
  })

  const usedKeys = new Set<string>()
  const existing = await db.email.findMany({
    where: { userId, imapUid: { not: null }, imapMailbox: { not: null } },
    select: { id: true, imapUid: true, imapMailbox: true },
  })
  for (const row of existing) {
    if (!row.imapUid || !row.imapMailbox) continue
    usedKeys.add(`${row.imapMailbox}::${row.imapUid}`)
  }

  let updated = 0
  let missing = 0
  let conflicts = 0
  let skipped = 0

  const findMatchInFolder = (folderName: string, normalizedId: string) => {
    const map = serverByFolder.get(folderName)
    if (!map) return null
    const list = map.get(normalizedId)
    if (!list || list.length === 0) return null
    if (list.length > 1) return { conflict: true }
    const entry = list[0]
    if (typeof entry.uid !== 'number') return null
    return { folderName, uid: entry.uid }
  }

  for (const row of candidates) {
    const messageId = String(row.messageId || '').trim()
    const normalizedId = normalizeMessageId(messageId)
    if (!normalizedId) {
      skipped += 1
      continue
    }

    const preferredMailbox =
      row.imapMailbox ||
      getMailboxNameFromEmailRow({
        folderSlug: row.folder?.slug || null,
        isDeleted: row.isDeleted,
      })

    let match: { folderName: string; uid: number } | null = null
    let hasConflict = false

    if (preferredMailbox) {
      const candidate = findMatchInFolder(preferredMailbox, normalizedId)
      if (candidate?.conflict) {
        hasConflict = true
      } else if (candidate?.uid) {
        match = { folderName: candidate.folderName, uid: candidate.uid }
      }
    }

    if (!match && !hasConflict) {
      let found: { folderName: string; uid: number } | null = null
      for (const folderName of normalizedFolders) {
        const candidate = findMatchInFolder(folderName, normalizedId)
        if (candidate?.conflict) {
          hasConflict = true
          break
        }
        if (candidate?.uid) {
          if (found) {
            hasConflict = true
            break
          }
          found = { folderName: candidate.folderName, uid: candidate.uid }
        }
      }
      if (!hasConflict && found) {
        match = found
      }
    }

    if (hasConflict) {
      conflicts += 1
      continue
    }

    if (!match) {
      missing += 1
      continue
    }

    const key = `${match.folderName}::${match.uid}`
    if (usedKeys.has(key)) {
      conflicts += 1
      continue
    }

    await db.email.update({
      where: { id: row.id },
      data: {
        imapMailbox: match.folderName,
        imapUid: match.uid,
      },
    })
    usedKeys.add(key)
    updated += 1
  }

  return {
    mailboxEmail,
    attempted: candidates.length,
    updated,
    missing,
    conflicts,
    skipped,
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const action = String(body.action || '')
    if (action) {
      const mailboxEmail = String(body.mailboxEmail || '').trim().toLowerCase()
      const folderName = String(body.folderName || 'INBOX')
      const serverFolderName = String(body.serverFolderName || folderName)
      const messageId = String(body.messageId || '').trim()
      const uid = Number(body.uid || 0) || null
      const emailId = String(body.emailId || '').trim()
      const serverIsRead = Boolean(body.serverIsRead)
      const serverIsStarred = Boolean(body.serverIsStarred)
      const serverIsDeleted = Boolean(body.serverIsDeleted)

      if (!mailboxEmail) {
        return NextResponse.json({ error: 'mailboxEmail is required' }, { status: 400 })
      }

      const hasImapPassword =
        (await getMailPasswordByEmail(mailboxEmail)) || process.env.IMAP_PASS

      if (action === 'pull') {
        if (!messageId && !uid) return NextResponse.json({ error: 'messageId or uid is required' }, { status: 400 })
        if (!hasImapPassword) {
          return NextResponse.json({ error: `Нет пароля для ящика ${mailboxEmail}` }, { status: 400 })
        }
        let result =
          uid
            ? await importMessageByUid({
                mailboxEmail,
                mailboxName: folderName,
                uid,
                messageId,
              }).catch(() => null)
            : null
        if (!result?.created && messageId) {
          result = await importMessageByMessageId({
            mailboxEmail,
            mailboxName: folderName,
            messageId,
          }).catch(() => null)
        }
        if (!result?.created && messageId) {
          for (const fallback of FOLDERS) {
            if (fallback === folderName) continue
            result = await importMessageByMessageId({
              mailboxEmail,
              mailboxName: fallback,
              messageId,
            }).catch(() => null)
            if (result?.created) break
          }
        }
        if (!result?.created) {
          return NextResponse.json({ error: 'Письмо не найдено на сервере' }, { status: 404 })
        }
        return NextResponse.json({ success: true })
      }

      if (action === 'delete-server') {
        if (!messageId && !uid) return NextResponse.json({ error: 'messageId or uid is required' }, { status: 400 })
        if (!hasImapPassword) {
          return NextResponse.json({ error: `Нет пароля для ящика ${mailboxEmail}` }, { status: 400 })
        }
        let matched = 0
        if (uid) {
          matched = await applyImapFlagsByUids({
            mailboxEmail,
            mailboxName: folderName,
            uids: [uid],
            add: ['\\Deleted'],
            expunge: true,
          }).catch(() => 0)
        }
        if (!matched && messageId) {
          matched = await applyImapFlagsByMessageIds({
            mailboxEmail,
            mailboxName: folderName,
            messageIds: [messageId],
            add: ['\\Deleted'],
            expunge: true,
          }).catch(() => 0)
        }
        if (!matched && messageId) {
          for (const fallback of FOLDERS) {
            if (fallback === folderName) continue
            matched = await applyImapFlagsByMessageIds({
              mailboxEmail,
              mailboxName: fallback,
              messageIds: [messageId],
              add: ['\\Deleted'],
              expunge: true,
            }).catch(() => 0)
            if (matched) break
          }
        }
        if (!matched) {
          return NextResponse.json({ error: 'Письмо не найдено на сервере' }, { status: 404 })
        }
        return NextResponse.json({ success: true })
      }

      if (action === 'delete-db') {
        if (!emailId) return NextResponse.json({ error: 'emailId is required' }, { status: 400 })
        await db.email.deleteMany({ where: { id: emailId } })
        return NextResponse.json({ success: true })
      }

      if (action === 'push-server') {
        if (!emailId) return NextResponse.json({ error: 'emailId is required' }, { status: 400 })
        if (!hasImapPassword) {
          return NextResponse.json({ error: `Нет пароля для ящика ${mailboxEmail}` }, { status: 400 })
        }
        const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
        const email = await db.email.findFirst({
          where: { id: emailId, userId: user.id },
          include: { folder: { select: { slug: true } } },
        })
        if (!email) {
          return NextResponse.json({ error: 'Email not found' }, { status: 404 })
        }
        const mailboxName = getImapMailboxName({
          folderSlug: email.folder?.slug || null,
          isDeleted: email.isDeleted,
        })
        const attachments = Array.isArray(email.attachments)
          ? (email.attachments as StoredAttachment[])
          : null
        await appendEmailToImap({
          mailboxEmail,
          mailboxName,
          email: {
            ...email,
            attachments,
          },
        })
        await db.email.updateMany({
          where: { id: emailId, userId: user.id },
          data: {
            imapMailbox: mailboxName,
            imapUid: null,
          },
        })
        return NextResponse.json({ success: true })
      }

      if (action === 'apply-db') {
        if (!emailId) return NextResponse.json({ error: 'emailId is required' }, { status: 400 })
        const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
        const folderSlug = mailboxNameToSlug(serverFolderName)
        const folder = await db.folder.findFirst({
          where: { userId: user.id, slug: folderSlug },
          select: { id: true },
        })
        const isDeleted = folderSlug === 'trash' || serverIsDeleted
        await db.email.updateMany({
          where: { id: emailId, userId: user.id },
          data: {
            isRead: serverIsRead,
            isStarred: serverIsStarred,
            isDeleted,
            folderId: folder?.id || null,
            imapMailbox: serverFolderName,
            imapUid: uid ?? null,
          },
        })
        return NextResponse.json({ success: true })
      }

      if (action === 'apply-server') {
        if (!emailId) return NextResponse.json({ error: 'emailId is required' }, { status: 400 })
        if (!messageId && !uid) return NextResponse.json({ error: 'messageId or uid is required' }, { status: 400 })
        if (!hasImapPassword) {
          return NextResponse.json({ error: `Нет пароля для ящика ${mailboxEmail}` }, { status: 400 })
        }
        const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
        const email = await db.email.findFirst({
          where: { id: emailId, userId: user.id },
          include: { folder: { select: { slug: true } } },
        })
        if (!email) {
          return NextResponse.json({ error: 'Email not found' }, { status: 404 })
        }

        const targetMailboxName = getMailboxNameFromEmailRow({
          folderSlug: email.folder?.slug || null,
          isDeleted: email.isDeleted,
        })
        const sourceMailboxName = serverFolderName || folderName || 'INBOX'

        const needsMove = targetMailboxName !== sourceMailboxName
        if (needsMove) {
          try {
            if (uid) {
              const moved = await moveImapMessagesByUids({
                mailboxEmail,
                sourceMailbox: sourceMailboxName,
                targetMailbox: targetMailboxName,
                uids: [uid],
              })
              if (!moved) throw new Error('move failed')
            } else {
              const moved = await moveImapMessagesByMessageIds({
                mailboxEmail,
                sourceMailbox: sourceMailboxName,
                targetMailbox: targetMailboxName,
                messageIds: [messageId],
              })
              if (!moved) throw new Error('move failed')
            }
          } catch {
            if (messageId) {
              let moved = await moveImapMessagesByMessageIds({
                mailboxEmail,
                sourceMailbox: sourceMailboxName,
                targetMailbox: targetMailboxName,
                messageIds: [messageId],
              }).catch(() => 0)
              if (!moved) {
                for (const fallback of FOLDERS) {
                  if (fallback === sourceMailboxName) continue
                  moved = await moveImapMessagesByMessageIds({
                    mailboxEmail,
                    sourceMailbox: fallback,
                    targetMailbox: targetMailboxName,
                    messageIds: [messageId],
                  }).catch(() => 0)
                  if (moved) break
                }
              }
              if (!moved) {
                return NextResponse.json({ error: 'Не удалось переместить письмо на сервере' }, { status: 409 })
              }
            } else {
              return NextResponse.json({ error: 'Не удалось переместить письмо на сервере' }, { status: 409 })
            }
          }
        }

        const add: string[] = []
        const remove: string[] = []
        if (email.isRead) add.push('\\Seen')
        else remove.push('\\Seen')
        if (email.isStarred) add.push('\\Flagged')
        else remove.push('\\Flagged')
        if (!email.isDeleted) remove.push('\\Deleted')

        let matched = 0
        if (uid && !needsMove) {
          matched = await applyImapFlagsByUids({
            mailboxEmail,
            mailboxName: targetMailboxName,
            uids: [uid],
            add,
            remove,
          }).catch(() => 0)
        }
        if (!matched) {
          matched = await applyImapFlagsByMessageIds({
            mailboxEmail,
            mailboxName: targetMailboxName,
            messageIds: [email.messageId],
            add,
            remove,
          }).catch(() => 0)
        }
        if (!matched) {
          for (const fallback of FOLDERS) {
            if (fallback === targetMailboxName) continue
            matched = await applyImapFlagsByMessageIds({
              mailboxEmail,
              mailboxName: fallback,
              messageIds: [email.messageId],
              add,
              remove,
            }).catch(() => 0)
            if (matched) break
          }
        }
        if (!matched) {
          return NextResponse.json({ error: 'Не удалось обновить флаги письма на сервере' }, { status: 409 })
        }

        await db.email.updateMany({
          where: { id: emailId, userId: user.id },
          data: {
            imapMailbox: targetMailboxName,
            imapUid: needsMove ? null : (uid ?? null),
          },
        })

        return NextResponse.json({ success: true })
      }

      if (action === 'backfill-uids') {
        const limit = Math.max(1, Math.min(2000, Number(body.limit || 500) || 500))
        const folders = Array.isArray(body.folders) && body.folders.length ? body.folders : FOLDERS
        const mailboxList = Array.isArray(body.mailboxes) && body.mailboxes.length
          ? body.mailboxes
          : [mailboxEmail]

        const results: BackfillSummary[] = []
        for (const mb of mailboxList) {
          const summary = await backfillMailboxUids({
            mailboxEmail: String(mb || '').trim().toLowerCase(),
            limit,
            folders,
          })
          results.push(summary)
        }

        const totals = results.reduce(
          (acc, r) => {
            acc.attempted += r.attempted
            acc.updated += r.updated
            acc.missing += r.missing
            acc.conflicts += r.conflicts
            acc.skipped += r.skipped
            return acc
          },
          { attempted: 0, updated: 0, missing: 0, conflicts: 0, skipped: 0 }
        )

        return NextResponse.json({ success: true, results, totals })
      }

      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    const limit = Math.max(1, Math.min(500, Number(body.limit || 200) || 200))

    const serverMailboxes = await listServerMailboxes().catch(() => [])
    const mailboxes = Array.isArray(body.mailboxes) && body.mailboxes.length
      ? serverMailboxes.filter((m) => body.mailboxes.includes(m))
      : serverMailboxes

    const serverOnly: ServerOnlyItem[] = []
    const dbOnly: DbOnlyItem[] = []
    const stateMismatch: StateMismatchItem[] = []

    for (const mailboxEmail of mailboxes) {
      const user = await initializeEmailUser(mailboxEmail, mailboxEmail.split('@')[0])
      const userId = user.id

      const dbEmails: DbEmailRow[] = await db.email.findMany({
        where: { userId },
        select: {
          id: true,
          messageId: true,
          subject: true,
          date: true,
          isDeleted: true,
          isRead: true,
          isStarred: true,
          folder: { select: { slug: true } },
          imapUid: true,
          imapMailbox: true,
        },
      })

      const dbByFolder = new Map<string, Map<string, DbEmailRow>>()
      const dbByMessageId = new Map<string, { row: DbEmailRow; folderName: string }>()
      const dbByUid = new Map<string, { row: DbEmailRow; folderName: string }>()
      const serverByMessageId = new Map<string, { folderName: string; header: ImapHeaderInfo }>()
      const serverByUid = new Map<string, { folderName: string; header: ImapHeaderInfo }>()
      for (const row of dbEmails) {
        if (!row.messageId) continue
        const normalizedId = normalizeMessageId(row.messageId)
        if (!normalizedId) continue
        const mailboxName = getMailboxNameFromEmailRow({
          folderSlug: row.folder?.slug || null,
          isDeleted: row.isDeleted,
        })
        const uidMailbox = row.imapMailbox || mailboxName
        if (row.imapUid && uidMailbox) {
          dbByUid.set(`${uidMailbox}::${row.imapUid}`, { row, folderName: mailboxName })
        }
        if (!dbByMessageId.has(normalizedId)) {
          dbByMessageId.set(normalizedId, { row, folderName: mailboxName })
        }
        if (!dbByFolder.has(mailboxName)) dbByFolder.set(mailboxName, new Map())
        dbByFolder.get(mailboxName)!.set(normalizedId, row)
      }

      for (const folderName of FOLDERS) {
        const serverHeaders: ImapHeaderInfo[] = await listImapMessageHeaders({
          mailboxEmail,
          mailboxName: folderName,
        }).catch(() => [])

        const serverSet = new Map<string, ImapHeaderInfo>()
        const serverUidSet = new Map<string, ImapHeaderInfo>()
        for (const h of serverHeaders) {
          if (!h.messageId) continue
          const normalizedId = normalizeMessageId(h.messageId)
          if (!normalizedId) continue
          if (!serverSet.has(normalizedId)) serverSet.set(normalizedId, h)
          if (!serverByMessageId.has(normalizedId)) {
            serverByMessageId.set(normalizedId, { folderName, header: h })
          }
          if (typeof h.uid === 'number') {
            const uidKey = `${folderName}::${h.uid}`
            if (!serverUidSet.has(uidKey)) serverUidSet.set(uidKey, h)
            if (!serverByUid.has(uidKey)) {
              serverByUid.set(uidKey, { folderName, header: h })
            }
          }
        }

        const dbSet = dbByFolder.get(folderName) || new Map<string, DbEmailRow>()

        for (const h of serverHeaders) {
          if (!h.messageId) continue
          const normalizedId = normalizeMessageId(h.messageId)
          if (!normalizedId) continue
          let dbEntry = null as { row: DbEmailRow; folderName: string } | null
          if (typeof h.uid === 'number') {
            dbEntry = dbByUid.get(`${folderName}::${h.uid}`) || null
          }
          if (!dbEntry) {
            dbEntry = dbByMessageId.get(normalizedId) || null
          }
          if (!dbEntry) continue
          const serverFlags = Array.isArray(h.flags) ? h.flags : []
          const serverIsRead = serverFlags.includes('\\Seen')
          const serverIsStarred = serverFlags.includes('\\Flagged')
          const serverIsDeleted = folderName === 'Trash' || serverFlags.includes('\\Deleted')
          const dbRow = dbEntry.row
          const dbFolderName = dbEntry.folderName

          const mismatch =
            dbFolderName !== folderName ||
            Boolean(dbRow.isRead) !== serverIsRead ||
            Boolean(dbRow.isStarred) !== serverIsStarred ||
            Boolean(dbRow.isDeleted) !== serverIsDeleted
          if (!mismatch) continue

          const key = typeof h.uid === 'number'
            ? `${mailboxEmail}:${folderName}:${h.uid}`
            : `${mailboxEmail}:${normalizedId}`
          if (stateMismatch.length < limit && !stateMismatch.some((i) => i.key === key)) {
            stateMismatch.push({
              key,
              mailboxEmail,
              messageId: h.messageId,
              uid: h.uid || null,
              subject: h.subject || dbRow.subject || null,
              date: h.date || (dbRow.date ? new Date(dbRow.date).toISOString() : null),
              serverFolderName: folderName,
              dbFolderName,
              serverIsRead,
              serverIsStarred,
              serverIsDeleted,
              dbIsRead: Boolean(dbRow.isRead),
              dbIsStarred: Boolean(dbRow.isStarred),
              dbIsDeleted: Boolean(dbRow.isDeleted),
              emailId: dbRow.id,
            })
          }
        }

        for (const [messageId, info] of serverSet.entries()) {
          const uidKey = typeof info.uid === 'number' ? `${folderName}::${info.uid}` : null
          if (uidKey && dbByUid.has(uidKey)) continue
          if (dbSet.has(messageId)) continue
          if (dbByMessageId.has(messageId)) continue
          serverOnly.push({
            mailboxEmail,
            folderName,
            messageId: info.messageId,
            uid: info.uid || null,
            subject: info.subject || null,
            date: info.date || null,
          })
          if (serverOnly.length >= limit) break
        }

        for (const [messageId, row] of dbSet.entries()) {
          const uidKey = row.imapUid ? `${row.imapMailbox || folderName}::${row.imapUid}` : null
          if (uidKey && serverByUid.has(uidKey)) continue
          if (serverSet.has(messageId)) continue
          if (serverByMessageId.has(messageId)) continue
          dbOnly.push({
            mailboxEmail,
            folderName,
            messageId: row.messageId,
            emailId: row.id,
            subject: row.subject || null,
            date: row.date ? new Date(row.date).toISOString() : null,
          })
          if (dbOnly.length >= limit) break
        }
      }
    }

    return NextResponse.json({
      success: true,
      serverOnly,
      dbOnly,
      stateMismatch,
      limit,
    })
  } catch (e) {
    const err = e as { message?: string }
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 })
  }
}
