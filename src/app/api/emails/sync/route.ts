import { NextRequest, NextResponse } from 'next/server'
import { syncAllEmails, syncMailboxFolders, DEFAULT_IMAP_FOLDERS } from '@/lib/imap-sync'
import { getSessionUser } from '@/lib/auth/session'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if IMAP is configured
    if (!process.env.IMAP_HOST) {
      return NextResponse.json(
        {
          error: 'IMAP не настроен. Укажите IMAP_HOST в .env',
        },
        { status: 400 }
      )
    }

    const url = new URL(request.url)
    const requestedEmail = (url.searchParams.get('email') || url.searchParams.get('viewEmail') || '')
      .trim()
      .toLowerCase()

    // If admin calls without mailbox, keep legacy behavior (sync all configured mailboxes).
    if (sessionUser.role === 'admin' && !requestedEmail) {
      const results = (await syncAllEmails()) as Array<{
        totalSynced?: number
        results?: Array<{ success: boolean }>
      }>
      const totalSynced = results.reduce((sum, r) => sum + (r.totalSynced || 0), 0)
      const hasErrors = results.some((r) => r.results?.some((f) => f.success === false))
      return NextResponse.json({
        success: !hasErrors,
        totalSynced,
        results,
      })
    }

    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const r = await syncMailboxFolders(mailboxEmail, undefined, undefined, DEFAULT_IMAP_FOLDERS, 50)
    const results = [r]

    const totalSynced = r.totalSynced || 0
    const hasErrors = r.results.some((f) => f.success === false)

    return NextResponse.json({
      success: !hasErrors,
      totalSynced,
      results,
    })
  } catch (error) {
    console.error('Error syncing emails:', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(
      { error: `Ошибка синхронизации: ${msg || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow manual sync via GET for testing
  return POST(request)
}
