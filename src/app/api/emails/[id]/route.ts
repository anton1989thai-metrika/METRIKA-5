import { NextRequest, NextResponse } from 'next/server'
import { getEmailById } from '@/lib/email'
import { getEmailUserId } from '@/lib/auth-email'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'
import {
  applyImapFlagsByMessageIdsDetailed,
  applyImapFlagsByUidsDetailed,
  getImapMailboxName,
} from '@/lib/imap-actions'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const userId = await getEmailUserId(request, mailboxEmail)

    const includeDeleted = request.nextUrl.searchParams.get('includeDeleted') === '1'
    const { email } = await getEmailById(id, userId, { markRead: false, includeDeleted })

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    // Sync read state to IMAP when opening an unread email/thread
    if (email) {
      const allEmails = email.thread?.emails?.length ? email.thread.emails : [email]
      const unread = allEmails.filter((item) => !item.isRead)
      if (unread.length > 0) {
        const uidsByMailbox = new Map<string, Map<number, string[]>>()
        const messageIdsByMailbox = new Map<string, Map<string, string[]>>()
        const fallbackMailbox = getImapMailboxName({
          folderSlug: email.folder?.slug || null,
          isDeleted: email.isDeleted,
        })

        for (const item of unread) {
          const mailboxName = item.imapMailbox || fallbackMailbox
          if (item.imapUid && mailboxName) {
            if (!uidsByMailbox.has(mailboxName)) uidsByMailbox.set(mailboxName, new Map())
            const bucket = uidsByMailbox.get(mailboxName)!
            const list = bucket.get(item.imapUid) || []
            list.push(item.id)
            bucket.set(item.imapUid, list)
            continue
          }
          if (!item.messageId || !mailboxName) continue
          if (!messageIdsByMailbox.has(mailboxName)) messageIdsByMailbox.set(mailboxName, new Map())
          const bucket = messageIdsByMailbox.get(mailboxName)!
          const list = bucket.get(item.messageId) || []
          list.push(item.id)
          bucket.set(item.messageId, list)
        }

        const updatedIds: string[] = []
        for (const [mailboxName, buckets] of uidsByMailbox.entries()) {
          const uids = Array.from(buckets.keys())
          const result = await applyImapFlagsByUidsDetailed({
            mailboxEmail,
            mailboxName,
            uids,
            add: ['\\Seen'],
          }).catch(() => null)
          if (!result) continue
          for (const uid of result.matchedUids) {
            const list = buckets.get(uid)
            if (list) updatedIds.push(...list)
          }
        }

        for (const [mailboxName, buckets] of messageIdsByMailbox.entries()) {
          const messageIds = Array.from(buckets.keys())
          const result = await applyImapFlagsByMessageIdsDetailed({
            mailboxEmail,
            mailboxName,
            messageIds,
            add: ['\\Seen'],
          }).catch(() => null)
          if (!result) continue
          for (const mid of result.matchedIds) {
            const list = buckets.get(mid)
            if (list) updatedIds.push(...list)
          }
        }

        if (updatedIds.length > 0) {
          await db.email.updateMany({
            where: { userId, id: { in: updatedIds } },
            data: { isRead: true },
          })
          const updatedSet = new Set(updatedIds)
          if (updatedSet.has(email.id)) {
            email.isRead = true
          }
          if (email.thread?.emails?.length) {
            email.thread.emails = email.thread.emails.map((item) =>
              updatedSet.has(item.id) ? { ...item, isRead: true } : item
            )
          }
        }
      }
    }

    return NextResponse.json(email)
  } catch (error) {
    console.error('Error fetching email:', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(
      { error: 'Failed to fetch email' },
      { status: 500 }
    )
  }
}
