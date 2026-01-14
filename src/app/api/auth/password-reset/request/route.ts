import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { getMailPasswordByEmail } from '@/lib/mail-password'

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

    if (!process.env.SMTP_HOST) return okResponse

    const fromEmail = (process.env.SMTP_USER || process.env.DEFAULT_MAILBOX_EMAIL || '').trim()
    if (!fromEmail) return okResponse

    const smtpPassword =
      (await getMailPasswordByEmail(fromEmail)) ??
      process.env.SMTP_PASS ??
      process.env.IMAP_PASS ??
      ''
    if (!smtpPassword) return okResponse

    const resetUrl = new URL('/auth/reset-password', getAppOrigin(request))
    resetUrl.searchParams.set('token', rawToken)
    const resetLink = resetUrl.toString()

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 12px;">Сброс пароля — METRIKA</h2>
        <p style="margin: 0 0 16px;">Чтобы сбросить пароль, нажмите кнопку (ссылка действует 30 минут):</p>
        <p style="margin: 0 0 16px;">
          <a href="${resetLink}"
             style="display: inline-block; background: #fff60b; color: #000; text-decoration: none; font-weight: 600; padding: 12px 18px; border-radius: 8px; border: 1px solid #e6d90a;">
            Сбросить пароль
          </a>
        </p>
        <p style="margin: 0 0 16px; color: #555; font-size: 12px;">
          Если кнопка не работает, откройте ссылку вручную:<br/>
          <a href="${resetLink}" style="color: #111; text-decoration: underline;">${resetLink}</a>
        </p>
        <p style="margin: 0; color: #555;">Если вы не запрашивали сброс — просто игнорируйте это письмо.</p>
      </div>
    `.trim()

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: { user: fromEmail, pass: smtpPassword },
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Сброс пароля — METRIKA',
      text: `Чтобы сбросить пароль, откройте ссылку (действует 30 минут):\n${resetLink}\n\nЕсли вы не запрашивали сброс — просто игнорируйте это письмо.`,
      html,
    })

    return okResponse
  } catch (error) {
    console.error('password reset request error', error)
    return NextResponse.json({ success: false, error: 'Ошибка' }, { status: 500 })
  }
}
