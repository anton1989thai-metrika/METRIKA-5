import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getEmailUserId } from '@/lib/auth-email'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'
import {
  applyImapFlagsByMessageIds,
  applyImapFlagsByMessageIdsDetailed,
  applyImapFlagsByUidsDetailed,
  getImapMailboxName,
  moveImapMessagesByMessageIds,
  moveImapMessagesByUids,
} from '@/lib/imap-actions'

export const runtime = 'nodejs'

const FALLBACK_MAILBOXES = ['INBOX', 'Sent', 'Drafts', 'Spam', 'Archive', 'Trash']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const action = String(body.action || '')
    const ids = Array.isArray(body.ids) ? body.ids.map((x: unknown) => String(x)) : []
    if (!action || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'action and ids are required' }, { status: 400 })
    }

    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const userId = await getEmailUserId(request, mailboxEmail)

    if (action === 'markUnread') {
      const emails = await db.email.findMany({
        where: { userId, id: { in: ids } },
        select: {
          id: true,
          messageId: true,
          imapUid: true,
          imapMailbox: true,
          folder: { select: { slug: true } },
          isDeleted: true,
        },
      })
      const byBoxMessageId = new Map<string, Map<string, string[]>>()
      const byBoxUid = new Map<string, Map<number, string[]>>()
      const messageIdToIds = new Map<string, string[]>()
      const idToMessageId = new Map<string, string>()
      const updatedIds = new Set<string>()
      const failedIds = new Set<string>()
      const missingMessageIds = new Set<string>()
      for (const e of emails) {
        if (e.messageId) {
          idToMessageId.set(e.id, e.messageId)
          const list = messageIdToIds.get(e.messageId) || []
          list.push(e.id)
          messageIdToIds.set(e.messageId, list)
        }
        const mailboxName = e.imapMailbox || getImapMailboxName({ folderSlug: e.folder?.slug || null, isDeleted: e.isDeleted })
        if (e.imapUid && mailboxName) {
          if (!byBoxUid.has(mailboxName)) byBoxUid.set(mailboxName, new Map())
          const bucket = byBoxUid.get(mailboxName)!
          const list = bucket.get(e.imapUid) || []
          list.push(e.id)
          bucket.set(e.imapUid, list)
          continue
        }
        if (!e.messageId || !mailboxName) {
          failedIds.add(e.id)
          continue
        }
        if (!byBoxMessageId.has(mailboxName)) byBoxMessageId.set(mailboxName, new Map())
        const bucket = byBoxMessageId.get(mailboxName)!
        const list = bucket.get(e.messageId) || []
        list.push(e.id)
        bucket.set(e.messageId, list)
      }

      for (const [mailboxName, buckets] of byBoxUid.entries()) {
        const uids = Array.from(buckets.keys())
        const result = await applyImapFlagsByUidsDetailed({
          mailboxEmail,
          mailboxName,
          uids,
          remove: ['\\Seen'],
        }).catch(() => null)
        if (!result) {
          for (const idsByMessage of buckets.values()) {
            for (const id of idsByMessage) {
              const mid = idToMessageId.get(id)
              if (mid) missingMessageIds.add(mid)
              else failedIds.add(id)
            }
          }
          continue
        }
        for (const uid of result.matchedUids) {
          const list = buckets.get(uid)
          if (list) {
            for (const id of list) updatedIds.add(id)
          }
        }
        for (const uid of result.missingUids) {
          const list = buckets.get(uid)
          if (list) {
            for (const id of list) {
              const mid = idToMessageId.get(id)
              if (mid) missingMessageIds.add(mid)
              else failedIds.add(id)
            }
          }
        }
      }
      for (const [mailboxName, buckets] of byBoxMessageId.entries()) {
        const messageIds = Array.from(buckets.keys())
        const result = await applyImapFlagsByMessageIdsDetailed({
          mailboxEmail,
          mailboxName,
          messageIds,
          remove: ['\\Seen'],
        }).catch(() => null)
        if (!result) {
          for (const idsByMessage of buckets.values()) {
            for (const id of idsByMessage) {
              const mid = idToMessageId.get(id)
              if (mid) missingMessageIds.add(mid)
              else failedIds.add(id)
            }
          }
          continue
        }
        for (const mid of result.matchedIds) {
          const list = buckets.get(mid)
          if (list) {
            for (const id of list) updatedIds.add(id)
          }
        }
        for (const mid of result.missingIds) {
          missingMessageIds.add(mid)
        }
      }

      if (missingMessageIds.size > 0) {
        const pending = new Set(missingMessageIds)
        for (const mailboxName of FALLBACK_MAILBOXES) {
          if (pending.size === 0) break
          const result = await applyImapFlagsByMessageIdsDetailed({
            mailboxEmail,
            mailboxName,
            messageIds: Array.from(pending),
            remove: ['\\Seen'],
          }).catch(() => null)
          if (!result) {
            continue
          }
          for (const mid of result.matchedIds) {
            const list = messageIdToIds.get(mid)
            if (list) {
              for (const id of list) updatedIds.add(id)
            }
            pending.delete(mid)
          }
        }
        for (const mid of pending) {
          const list = messageIdToIds.get(mid)
          if (list) {
            for (const id of list) failedIds.add(id)
          }
        }
      }

      if (updatedIds.size > 0) {
        await db.email.updateMany({
          where: { userId, id: { in: Array.from(updatedIds) } },
          data: { isRead: false },
        })
      }

      return NextResponse.json({
        success: failedIds.size === 0,
        updatedIds: Array.from(updatedIds),
        failedIds: Array.from(failedIds),
      })
    }

    if (action === 'markRead') {
      const emails = await db.email.findMany({
        where: { userId, id: { in: ids } },
        select: {
          id: true,
          messageId: true,
          imapUid: true,
          imapMailbox: true,
          folder: { select: { slug: true } },
          isDeleted: true,
        },
      })
      const byBoxMessageId = new Map<string, Map<string, string[]>>()
      const byBoxUid = new Map<string, Map<number, string[]>>()
      const messageIdToIds = new Map<string, string[]>()
      const idToMessageId = new Map<string, string>()
      const updatedIds = new Set<string>()
      const failedIds = new Set<string>()
      const missingMessageIds = new Set<string>()
      for (const e of emails) {
        if (e.messageId) {
          idToMessageId.set(e.id, e.messageId)
          const list = messageIdToIds.get(e.messageId) || []
          list.push(e.id)
          messageIdToIds.set(e.messageId, list)
        }
        const mailboxName = e.imapMailbox || getImapMailboxName({ folderSlug: e.folder?.slug || null, isDeleted: e.isDeleted })
        if (e.imapUid && mailboxName) {
          if (!byBoxUid.has(mailboxName)) byBoxUid.set(mailboxName, new Map())
          const bucket = byBoxUid.get(mailboxName)!
          const list = bucket.get(e.imapUid) || []
          list.push(e.id)
          bucket.set(e.imapUid, list)
          continue
        }
        if (!e.messageId || !mailboxName) {
          failedIds.add(e.id)
          continue
        }
        if (!byBoxMessageId.has(mailboxName)) byBoxMessageId.set(mailboxName, new Map())
        const bucket = byBoxMessageId.get(mailboxName)!
        const list = bucket.get(e.messageId) || []
        list.push(e.id)
        bucket.set(e.messageId, list)
      }

      for (const [mailboxName, buckets] of byBoxUid.entries()) {
        const uids = Array.from(buckets.keys())
        const result = await applyImapFlagsByUidsDetailed({
          mailboxEmail,
          mailboxName,
          uids,
          add: ['\\Seen'],
        }).catch(() => null)
        if (!result) {
          for (const idsByMessage of buckets.values()) {
            for (const id of idsByMessage) {
              const mid = idToMessageId.get(id)
              if (mid) missingMessageIds.add(mid)
              else failedIds.add(id)
            }
          }
          continue
        }
        for (const uid of result.matchedUids) {
          const list = buckets.get(uid)
          if (list) {
            for (const id of list) updatedIds.add(id)
          }
        }
        for (const uid of result.missingUids) {
          const list = buckets.get(uid)
          if (list) {
            for (const id of list) {
              const mid = idToMessageId.get(id)
              if (mid) missingMessageIds.add(mid)
              else failedIds.add(id)
            }
          }
        }
      }
      for (const [mailboxName, buckets] of byBoxMessageId.entries()) {
        const messageIds = Array.from(buckets.keys())
        const result = await applyImapFlagsByMessageIdsDetailed({
          mailboxEmail,
          mailboxName,
          messageIds,
          add: ['\\Seen'],
        }).catch(() => null)
        if (!result) {
          for (const idsByMessage of buckets.values()) {
            for (const id of idsByMessage) {
              const mid = idToMessageId.get(id)
              if (mid) missingMessageIds.add(mid)
              else failedIds.add(id)
            }
          }
          continue
        }
        for (const mid of result.matchedIds) {
          const list = buckets.get(mid)
          if (list) {
            for (const id of list) updatedIds.add(id)
          }
        }
        for (const mid of result.missingIds) {
          missingMessageIds.add(mid)
        }
      }

      if (missingMessageIds.size > 0) {
        const pending = new Set(missingMessageIds)
        for (const mailboxName of FALLBACK_MAILBOXES) {
          if (pending.size === 0) break
          const result = await applyImapFlagsByMessageIdsDetailed({
            mailboxEmail,
            mailboxName,
            messageIds: Array.from(pending),
            add: ['\\Seen'],
          }).catch(() => null)
          if (!result) {
            continue
          }
          for (const mid of result.matchedIds) {
            const list = messageIdToIds.get(mid)
            if (list) {
              for (const id of list) updatedIds.add(id)
            }
            pending.delete(mid)
          }
        }
        for (const mid of pending) {
          const list = messageIdToIds.get(mid)
          if (list) {
            for (const id of list) failedIds.add(id)
          }
        }
      }

      if (updatedIds.size > 0) {
        await db.email.updateMany({
          where: { userId, id: { in: Array.from(updatedIds) } },
          data: { isRead: true },
        })
      }

      return NextResponse.json({
        success: failedIds.size === 0,
        updatedIds: Array.from(updatedIds),
        failedIds: Array.from(failedIds),
      })
    }

    if (action === 'restore') {
      const emails = await db.email.findMany({
        where: { userId, id: { in: ids } },
        select: {
          id: true,
          messageId: true,
          imapUid: true,
          imapMailbox: true,
          folder: { select: { slug: true } },
          isDeleted: true,
        },
      })
      const restoredIds: string[] = []
      const skippedIds: string[] = []
      const failedIds: string[] = []

      for (const e of emails) {
        if (!e.messageId) {
          failedIds.push(e.id)
          continue
        }
        const originalSlug = String(e.folder?.slug || '').toLowerCase()
        if (originalSlug === 'trash') {
          skippedIds.push(e.id)
          continue
        }
        if (!e.isDeleted) {
          restoredIds.push(e.id)
          continue
        }
        const targetMailbox = getImapMailboxName({ folderSlug: e.folder?.slug || null, isDeleted: false })
        try {
          let moved = 0
          if (e.imapUid && (e.imapMailbox || '').toLowerCase() === 'trash') {
            moved = await moveImapMessagesByUids({
              mailboxEmail,
              sourceMailbox: e.imapMailbox || 'Trash',
              targetMailbox,
              uids: [e.imapUid],
            }).catch(() => 0)
          }
          if (!moved) {
            moved = await moveImapMessagesByMessageIds({
              mailboxEmail,
              sourceMailbox: e.imapMailbox || 'Trash',
              targetMailbox,
              messageIds: [e.messageId],
            }).catch(() => 0)
          }
          const matched = await applyImapFlagsByMessageIds({
            mailboxEmail,
            mailboxName: targetMailbox,
            messageIds: [e.messageId],
            remove: ['\\Deleted'],
          }).catch(() => 0)
          if (!moved && !matched) {
            failedIds.push(e.id)
            continue
          }
          await db.email.update({
            where: { id: e.id },
            data: {
              isDeleted: false,
              imapMailbox: targetMailbox,
              imapUid: null,
            },
          })
          restoredIds.push(e.id)
        } catch (err) {
          console.error('restore failed', err)
          failedIds.push(e.id)
        }
      }

      return NextResponse.json({
        success: failedIds.length === 0,
        restoredIds,
        skippedIds,
        failedIds,
      })
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 })
  } catch (e) {
    console.error('bulk email action error', e)
    const err = e as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}
