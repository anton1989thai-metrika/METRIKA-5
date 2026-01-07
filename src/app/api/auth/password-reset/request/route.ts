import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

function sha256B64Url(input: string) {
  return createHash('sha256').update(input).digest('base64url')
}

function newToken() {
  return randomBytes(32).toString('base64url')
}

function getAppOrigin(request: NextRequest) {
  const url = new URL(request.url)
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedProto && forwardedHost) return `${forwardedProto}://${forwardedHost}`
  return url.origin
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = String(body.email || '').trim().toLowerCase()
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email обязателен' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, status: true },
    })

    // Always respond ok to avoid account enumeration.
    const okResponse = NextResponse.json(
      { success: true, message: 'Если такой пользователь существует, мы отправили ссылку для сброса пароля.' },
      { status: 200 }
    )

    if (!user || String(user.status || 'active') !== 'active') return okResponse

    const rawToken = newToken()
    const tokenHash = sha256B64Url(rawToken)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    // Best effort cleanup
    await db.passwordResetToken.deleteMany({ where: { userId: user.id } }).catch(() => null)
    await db.passwordResetToken.create({
      data: { tokenHash, userId: user.id, expiresAt },
    })

    if (!process.env.SMTP_HOST || !process.env.SMTP_PASS) return okResponse

    const fromEmail = (process.env.SMTP_USER || process.env.DEFAULT_MAILBOX_EMAIL || '').trim()
    if (!fromEmail) return okResponse

    const resetUrl = new URL('/auth/reset-password', getAppOrigin(request))
    resetUrl.searchParams.set('token', rawToken)

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: { user: fromEmail, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Сброс пароля — METRIKA',
      text: `Чтобы сбросить пароль, откройте ссылку (действует 30 минут):\n${resetUrl.toString()}\n\nЕсли вы не запрашивали сброс — просто игнорируйте это письмо.`,
    })

    return okResponse
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Ошибка' }, { status: 500 })
  }
}

