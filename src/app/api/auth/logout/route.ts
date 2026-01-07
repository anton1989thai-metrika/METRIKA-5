import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie, destroySession } from '@/lib/auth/session'
import { SESSION_COOKIE } from '@/lib/auth/constants'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (token) await destroySession(token)
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch {
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  }
}


