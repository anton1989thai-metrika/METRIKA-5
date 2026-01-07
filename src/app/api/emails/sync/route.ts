import { NextRequest, NextResponse } from 'next/server'
import { syncAllEmails, syncEmailsFromIMAP } from '@/lib/imap-sync'
import { getSessionUser } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if IMAP is configured
    if (!process.env.IMAP_HOST || !process.env.IMAP_USER || !process.env.IMAP_PASS) {
      return NextResponse.json(
        {
          error: 'IMAP не настроен. Укажите IMAP_HOST, IMAP_USER и IMAP_PASS в .env',
        },
        { status: 400 }
      )
    }

    const url = new URL(request.url)
    const requestedEmail =
      (url.searchParams.get('email') || url.searchParams.get('viewEmail') || '').trim().toLowerCase()

    // Decide what to sync:
    // - normal user: only their mailbox
    // - admin: specific mailbox if provided; otherwise sync all configured mailboxes
    let results: Array<{ email: string; success: boolean; count: number; error?: string }>
    if (sessionUser.role === 'admin') {
      if (requestedEmail) {
        const r = await syncEmailsFromIMAP(requestedEmail, undefined, undefined, 'INBOX', 50)
        results = [{ email: requestedEmail, ...r }]
      } else {
        results = await syncAllEmails()
      }
    } else {
      const r = await syncEmailsFromIMAP(String(sessionUser.email).toLowerCase(), undefined, undefined, 'INBOX', 50)
      results = [{ email: String(sessionUser.email).toLowerCase(), ...r }]
    }

    const totalSynced = results.reduce((sum, r) => sum + r.count, 0)
    const hasErrors = results.some((r) => !r.success)

    return NextResponse.json({
      success: !hasErrors,
      totalSynced,
      results,
    })
  } catch (error: any) {
    console.error('Error syncing emails:', error)
    return NextResponse.json(
      { error: `Ошибка синхронизации: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow manual sync via GET for testing
  return POST(request)
}

