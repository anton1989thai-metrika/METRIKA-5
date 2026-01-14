import { NextRequest, NextResponse } from 'next/server'
import { deleteEmail, permanentlyDeleteEmail } from '@/lib/email'
import { getEmailUserId } from '@/lib/auth-email'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'
import {
  applyImapFlagsByMessageIdsDetailed,
  applyImapFlagsByUidsDetailed,
  getImapMailboxName,
  moveImapMessagesByMessageIds,
  moveImapMessagesByUids,
} from '@/lib/imap-actions'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const permanent = request.nextUrl.searchParams.get('permanent') === '1'
    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const userId = await getEmailUserId(request, mailboxEmail)

    const record = await db.email.findFirst({
      where: { id, userId },
      select: {
        messageId: true,
        folder: { select: { slug: true } },
        isDeleted: true,
        imapUid: true,
        imapMailbox: true,
      },
    })
    if (!record) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    let imapSuccess = false
    let missingOnServer = false
    let hadError = false

    const deleteByUid = async (mailboxName?: string | null) => {
      if (!record.imapUid || !mailboxName) return false
      try {
        const result = await applyImapFlagsByUidsDetailed({
          mailboxEmail,
          mailboxName,
          uids: [record.imapUid],
          add: ['\\Deleted'],
          expunge: true,
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
      if (!record.messageId) return false
      try {
        const result = await applyImapFlagsByMessageIdsDetailed({
          mailboxEmail,
          mailboxName,
          messageIds: [record.messageId],
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

    if (record?.messageId || record?.imapUid) {
      if (permanent) {
        const primaryMailbox = getImapMailboxName({
          folderSlug: record.folder?.slug || null,
          isDeleted: true,
        })
        const fallbackMailboxes = Array.from(
          new Set([primaryMailbox, record.imapMailbox, 'INBOX', 'Sent', 'Drafts', 'Spam', 'Archive', 'Trash'].filter(Boolean))
        ) as string[]

        let matched = false
        if (record.imapUid && record.imapMailbox) {
          matched = await deleteByUid(record.imapMailbox)
        }
        if (!matched && !hadError) {
          for (const mailboxName of fallbackMailboxes) {
            matched = await deleteByMessageId(mailboxName, mailboxName === primaryMailbox)
            if (matched || hadError) break
          }
        }
        if (hadError) {
          return NextResponse.json(
            { error: 'Не удалось синхронизировать удаление с сервером' },
            { status: 409 }
          )
        }
        missingOnServer = missingOnServer && !matched
        if (matched || missingOnServer) imapSuccess = true
      } else {
        const sourceMailbox = record.imapMailbox || getImapMailboxName({
          folderSlug: record.folder?.slug || null,
          isDeleted: false,
        })
        const fallbackMailboxes = Array.from(
          new Set([sourceMailbox, 'INBOX', 'Sent', 'Drafts', 'Spam', 'Archive', 'Trash'].filter(Boolean))
        ) as string[]

        let moved = 0
        if (record.imapUid && record.imapMailbox) {
          moved = await moveImapMessagesByUids({
            mailboxEmail,
            sourceMailbox: record.imapMailbox,
            targetMailbox: 'Trash',
            uids: [record.imapUid],
          }).catch(() => 0)
        }
        if (!moved) {
          for (const mailboxName of fallbackMailboxes) {
            if (!record.messageId) continue
            moved = await moveImapMessagesByMessageIds({
              mailboxEmail,
              sourceMailbox: mailboxName,
              targetMailbox: 'Trash',
              messageIds: [record.messageId],
            }).catch(() => 0)
            if (moved) break
          }
        }
        imapSuccess = moved > 0
      }
    }

    if (!imapSuccess) {
      return NextResponse.json(
        { error: 'Не удалось синхронизировать удаление с сервером' },
        { status: 409 }
      )
    }

    if (permanent) {
      await permanentlyDeleteEmail(id, userId)
    } else {
      await deleteEmail(id, userId, { imapMailbox: 'Trash', imapUid: null })
    }

    return NextResponse.json({ success: true, missingOnServer: permanent ? missingOnServer : false })
  } catch (error) {
    console.error('Error deleting email:', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    )
  }
}
