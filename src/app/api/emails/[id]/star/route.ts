import { NextRequest, NextResponse } from 'next/server'
import { getEmailUserId } from '@/lib/auth-email'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'
import {
  applyImapFlagsByMessageIdsDetailed,
  applyImapFlagsByUidsDetailed,
  getImapMailboxName,
} from '@/lib/imap-actions'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const userId = await getEmailUserId(request, mailboxEmail)

    const record = await db.email.findFirst({
      where: { id, userId },
      select: {
        messageId: true,
        folder: { select: { slug: true } },
        isDeleted: true,
        isStarred: true,
        imapUid: true,
        imapMailbox: true,
      },
    })
    if (!record) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    if (!record.messageId && !record.imapUid) {
      return NextResponse.json({ error: 'Message ID not found' }, { status: 409 })
    }

    const nextIsStarred = !record.isStarred
    const primaryMailbox = getImapMailboxName({
      folderSlug: record.folder?.slug || null,
      isDeleted: record.isDeleted,
    })
    const fallbackMailboxes = Array.from(
      new Set(
        [
          record.imapMailbox,
          primaryMailbox,
          'INBOX',
          'Sent',
          'Drafts',
          'Spam',
          'Archive',
          'Trash',
        ].filter(Boolean)
      )
    ) as string[]

    let matched = false
    let matchedMailbox: string | null = null
    let hadError = false

    if (record.imapUid && record.imapMailbox) {
      try {
        const result = await applyImapFlagsByUidsDetailed({
          mailboxEmail,
          mailboxName: record.imapMailbox,
          uids: [record.imapUid],
          add: nextIsStarred ? ['\\Flagged'] : [],
          remove: nextIsStarred ? [] : ['\\Flagged'],
        })
        if (result.matchedUids.length > 0) {
          matched = true
          matchedMailbox = record.imapMailbox
        }
      } catch {
        hadError = true
      }
    }

    if (!matched && !hadError && record.messageId) {
      for (const mailboxName of fallbackMailboxes) {
        try {
          const result = await applyImapFlagsByMessageIdsDetailed({
            mailboxEmail,
            mailboxName,
            messageIds: [record.messageId],
            add: nextIsStarred ? ['\\Flagged'] : [],
            remove: nextIsStarred ? [] : ['\\Flagged'],
          })
          if (result.matchedIds.length > 0) {
            matched = true
            matchedMailbox = mailboxName
            break
          }
        } catch {
          hadError = true
          break
        }
      }
    }

    if (!matched) {
      return NextResponse.json({ error: 'Не удалось обновить флаг на сервере' }, { status: 409 })
    }

    const updateData: { isStarred: boolean; imapMailbox?: string | null } = { isStarred: nextIsStarred }
    if (matchedMailbox && matchedMailbox !== record.imapMailbox) {
      updateData.imapMailbox = matchedMailbox
    }

    const email = await db.email.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(email)
  } catch (error) {
    console.error('Error toggling star:', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(
      { error: 'Failed to toggle star' },
      { status: 500 }
    )
  }
}
