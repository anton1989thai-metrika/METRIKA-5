import { NextRequest, NextResponse } from 'next/server'
import { getEmailUserId } from '@/lib/auth-email'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'
import {
  applyImapFlagsByMessageIdsDetailed,
  applyImapFlagsByUidsDetailed,
  getImapMailboxName,
} from '@/lib/imap-actions'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

const FALLBACK_MAILBOXES = ['INBOX', 'Sent', 'Drafts', 'Spam', 'Archive', 'Trash']

export async function POST(request: NextRequest) {
  try {
    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const userId = await getEmailUserId(request, mailboxEmail)

    const trashed = await db.email.findMany({
      where: { userId, isDeleted: true },
      select: { id: true, messageId: true, imapUid: true, imapMailbox: true, folder: { select: { slug: true } } },
    })

    const deletedIds: string[] = []
    const failedIds: string[] = []

    for (const e of trashed) {
      if (!e.messageId && !e.imapUid) {
        failedIds.push(e.id)
        continue
      }
      const primaryMailbox =
        e.imapMailbox || getImapMailboxName({ folderSlug: e.folder?.slug || null, isDeleted: true })
      let matched = false
      let missingOnServer = false
      let hadError = false

      const deleteByUid = async (mailboxName?: string | null, ensureMailbox = false) => {
        if (!e.imapUid || !mailboxName) return false
        try {
          const result = await applyImapFlagsByUidsDetailed({
            mailboxEmail,
            mailboxName,
            uids: [e.imapUid],
            add: ['\\Deleted'],
            expunge: true,
            ensureMailbox,
          })
          if (result.matchedUids.length > 0) return true
          if (result.missingUids.length > 0) missingOnServer = true
          return false
        } catch {
          hadError = true
          return false
        }
      }

      const deleteByMessageId = async (mailboxName: string, ensureMailbox = false) => {
        if (!e.messageId) return false
        try {
          const result = await applyImapFlagsByMessageIdsDetailed({
            mailboxEmail,
            mailboxName,
            messageIds: [e.messageId],
            add: ['\\Deleted'],
            expunge: true,
            ensureMailbox,
          })
          if (result.matchedIds.length > 0) return true
          if (result.missingIds.length > 0) missingOnServer = true
          return false
        } catch {
          hadError = true
          return false
        }
      }

      if (e.imapUid && e.imapMailbox) {
        matched = await deleteByUid(e.imapMailbox, true)
      }
      if (!matched && !hadError) {
        matched = await deleteByMessageId(primaryMailbox, true)
      }
      if (!matched && !hadError) {
        for (const mailboxName of FALLBACK_MAILBOXES) {
          if (mailboxName === primaryMailbox) continue
          matched = await deleteByMessageId(mailboxName, false)
          if (matched || hadError) break
        }
      }

      if (hadError) {
        failedIds.push(e.id)
        continue
      }
      missingOnServer = missingOnServer && !matched
      if (matched || missingOnServer) deletedIds.push(e.id)
      else failedIds.push(e.id)
    }

    if (deletedIds.length) {
      await db.email.deleteMany({
        where: { userId, id: { in: deletedIds } },
      })
    }

    return NextResponse.json({
      success: failedIds.length === 0,
      deleted: deletedIds.length,
      deletedIds,
      failedIds,
    })
  } catch (error) {
    console.error('Error emptying trash:', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to empty trash' }, { status: 500 })
  }
}
