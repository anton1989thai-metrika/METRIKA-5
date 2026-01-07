import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, setSessionCookie } from '@/lib/auth/session'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const emailOrLogin = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    if (!emailOrLogin || !password) {
      return NextResponse.json({ success: false, error: 'Email и пароль обязательны' }, { status: 400 })
    }

    const user =
      (await db.user.findUnique({ where: { email: emailOrLogin } })) ||
      (await db.user.findFirst({ where: { login: emailOrLogin } }))
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Неверный логин или пароль' }, { status: 401 })
    }

    if (String((user as any).status || 'active') !== 'active') {
      return NextResponse.json({ success: false, error: 'Пользователь деактивирован' }, { status: 403 })
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Неверный логин или пароль' }, { status: 401 })
    }

    await db.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } }).catch(() => null)

    const { token, expiresAt } = await createSession(user.id, 30)
    await setSessionCookie(token, expiresAt)

    return NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Ошибка авторизации' }, { status: 500 })
  }
}


