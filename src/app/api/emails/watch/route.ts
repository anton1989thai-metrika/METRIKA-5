import { NextRequest, NextResponse } from 'next/server'
import { getImapMailboxUidNext } from '@/lib/imap-sync'
import { getSessionUser } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.IMAP_HOST || !process.env.IMAP_PASS) {
      return NextResponse.json(
        { error: 'IMAP не настроен. Укажите IMAP_HOST и IMAP_PASS в .env' },
        { status: 400 }
      )
    }

    const url = new URL(request.url)
    const requestedEmail = (url.searchParams.get('email') || url.searchParams.get('viewEmail') || '')
      .trim()
      .toLowerCase()

    const targetEmail =
      sessionUser.role === 'admin' && requestedEmail
        ? requestedEmail
        : String(sessionUser.email).trim().toLowerCase()

    // Non-admins can only watch their own mailbox
    if (sessionUser.role !== 'admin' && requestedEmail && requestedEmail !== targetEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const status = await getImapMailboxUidNext(targetEmail, 'INBOX')
    if (!status.success) {
      return NextResponse.json({ error: status.error || 'IMAP error' }, { status: 502 })
    }

    return NextResponse.json({
      email: targetEmail,
      uidNext: status.uidNext ?? null,
    })
  } catch (error: any) {
    console.error('watch error', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}


