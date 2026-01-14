import { NextRequest, NextResponse } from 'next/server'
import { getEmailThreads, getFolders } from '@/lib/email'
import { getEmailUserId } from '@/lib/auth-email'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folderSlug = searchParams.get('folder') || 'inbox'
    const searchQuery = searchParams.get('search') || undefined
    const cursorParam = searchParams.get('cursor') || ''
    const limitParam = searchParams.get('limit') || ''
    
    const resolved = await resolveRequestedMailbox(request)
    const targetEmail = resolved.mailboxEmail
    
    const userId = await getEmailUserId(request, targetEmail)

    const take = Math.max(1, Math.min(100, Number(limitParam || 30) || 30))

    let cursor: { date: Date; id: string } | null = null
    if (cursorParam) {
      const [dateIso, id] = cursorParam.split('::')
      if (dateIso && id) {
        const d = new Date(dateIso)
        if (!isNaN(d.getTime())) cursor = { date: d, id }
      }
    }

    const [threadsPage, folders] = await Promise.all([
      getEmailThreads(userId, folderSlug, searchQuery, cursor, take),
      getFolders(userId),
    ])

    // Если админ, добавляем список всех ящиков
    const response: {
      threads: typeof threadsPage.threads
      hasMore: boolean
      nextCursor: string | null
      folders: typeof folders
      mailboxes?: string[]
      selectedMailbox?: string
      isAdmin?: boolean
    } = {
      threads: threadsPage.threads,
      hasMore: threadsPage.hasMore,
      nextCursor: threadsPage.nextCursor ? `${threadsPage.nextCursor.date.toISOString()}::${threadsPage.nextCursor.id}` : null,
      folders,
    }
    
    response.mailboxes = resolved.allowedMailboxes
    response.selectedMailbox = targetEmail
    response.isAdmin = resolved.isAdmin

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching emails:', error)
    const err = error as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (msg === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}
