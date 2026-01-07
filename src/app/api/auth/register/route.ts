import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { createSession, setSessionCookie } from '@/lib/auth/session'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Заполните имя, email и пароль' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Пароль должен быть минимум 6 символов' }, { status: 400 })
    }

    const exists = await db.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ success: false, error: 'Пользователь с таким email уже существует' }, { status: 409 })
    }

    const user = await db.user.create({
      data: {
        email,
        login: email,
        name,
        role: 'site_user' as any,
        status: 'active',
        passwordHash: await hashPassword(password),
      },
    })

    const { token, expiresAt } = await createSession(user.id, 30)
    await setSessionCookie(token, expiresAt)

    return NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: 'site-user' },
    })
  } catch (e: any) {
    console.error('register error', e)
    return NextResponse.json({ success: false, error: 'Ошибка регистрации' }, { status: 500 })
  }
}


