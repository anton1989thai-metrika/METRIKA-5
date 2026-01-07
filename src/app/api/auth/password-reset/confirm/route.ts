import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'

export const runtime = 'nodejs'

function sha256B64Url(input: string) {
  return createHash('sha256').update(input).digest('base64url')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = String(body.token || '').trim()
    const password = String(body.password || '')
    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'Токен и пароль обязательны' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Пароль должен быть минимум 6 символов' }, { status: 400 })
    }

    const tokenHash = sha256B64Url(token)
    const row = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true },
    })
    if (!row || row.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json({ success: false, error: 'Ссылка недействительна или истекла' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    await db.$transaction(async (tx) => {
      await tx.user.update({ where: { id: row.userId }, data: { passwordHash } })
      await tx.passwordResetToken.delete({ where: { id: row.id } })
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Ошибка' }, { status: 500 })
  }
}

