import { NextRequest, NextResponse } from 'next/server'
import { getEmailThreads, getFolders } from '@/lib/email'
import { getEmailUserId, isAdmin, getAllMailboxes } from '@/lib/auth-email'
import { execFile } from 'child_process'
import { promisify } from 'util'

export const runtime = 'nodejs'

const execFileAsync = promisify(execFile)

async function listServerMailboxes(): Promise<string[]> {
  // relies on sudoers for app user (metrika)
  const { stdout } = await execFileAsync('sudo', ['/usr/local/sbin/metrika-mailboxctl', 'list'], {
    env: process.env,
  })
  return String(stdout ?? '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folderSlug = searchParams.get('folder') || 'inbox'
    const searchQuery = searchParams.get('search') || undefined
    const viewEmail = searchParams.get('viewEmail') // Для админа - просмотр чужого ящика
    const cursorParam = searchParams.get('cursor') || ''
    const limitParam = searchParams.get('limit') || ''
    
    const admin = await isAdmin(request)
    
    // Если админ и указан viewEmail, показываем чужой ящик
    let targetEmail: string | undefined
    if (admin && viewEmail) {
      targetEmail = viewEmail
    }
    
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
    const response: any = {
      threads: threadsPage.threads,
      hasMore: threadsPage.hasMore,
      nextCursor: threadsPage.nextCursor ? `${threadsPage.nextCursor.date.toISOString()}::${threadsPage.nextCursor.id}` : null,
      folders,
    }
    
    if (admin) {
      // Prefer real server mailboxes; fallback to static list.
      response.allMailboxes = await listServerMailboxes().catch(() => getAllMailboxes())
      response.isAdmin = true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}

