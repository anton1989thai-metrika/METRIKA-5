import { NextRequest, NextResponse } from 'next/server'
import { getImapMailboxUidNext } from '@/lib/imap-sync'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.IMAP_HOST) {
      return NextResponse.json(
        { error: 'IMAP не настроен. Укажите IMAP_HOST в .env' },
        { status: 400 }
      )
    }
    
    const { mailboxEmail: targetEmail } = await resolveRequestedMailbox(request)

    const status = await getImapMailboxUidNext(targetEmail, 'INBOX')
    if (!status.success) {
      return NextResponse.json({ error: status.error || 'IMAP error' }, { status: 502 })
    }

    return NextResponse.json({
      email: targetEmail,
      uidNext: status.uidNext ?? null,
    })
  } catch (error) {
    console.error('watch error', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
