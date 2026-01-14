import { NextRequest, NextResponse } from 'next/server'
import { AccountType } from '@prisma/client'
import { getSessionUser } from '@/lib/auth/session'
import { mailboxctl } from '@/lib/mailboxctl'
import { db } from '@/lib/db'
import { setMailPasswordByEmail } from '@/lib/mail-password'

type MailboxUserRow = {
  email: string
  name: string | null
  accountType: AccountType
  mailPasswordEnc: string | null
}

export const runtime = 'nodejs'

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function normalizeEmail(email: string) {
  return String(email || '').trim().toLowerCase()
}

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || sessionUser.role !== 'admin') return jsonError('Forbidden', 403)

    const secret = process.env.MAIL_ADMIN_SECRET || null
    const { stdout } = await mailboxctl('list', [], secret)
    const serverMailboxes = String(stdout ?? '')
      .split('\n')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    const users: MailboxUserRow[] = await db.user.findMany({
      where: { email: { in: serverMailboxes } },
      select: { email: true, name: true, accountType: true, mailPasswordEnc: true },
    })
    const byEmail = new Map(users.map((u) => [String(u.email).toLowerCase(), u]))

    const items = serverMailboxes.map((email) => {
      const u = byEmail.get(email) || null
      const isHuman = u?.accountType === AccountType.human
      return {
        email,
        kind: isHuman ? 'user' : 'shared',
        name: u?.name || null,
        hasPassword: Boolean(u?.mailPasswordEnc),
      }
    })

    return NextResponse.json({ success: true, mailboxes: items }, { status: 200 })
  } catch (e) {
    const err = e as { message?: string }
    return jsonError(err.message || 'Failed to list mailboxes', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || sessionUser.role !== 'admin') return jsonError('Forbidden', 403)

    const body = await request.json().catch(() => ({}))
    const email = normalizeEmail(body.email || '')
    const password = String(body.password || '')
    if (!email || !password) return jsonError('email and password are required', 400)

    const secret = process.env.MAIL_ADMIN_SECRET || null
    await mailboxctl('create', [email, password], secret)

    const existing = await db.user
      .findUnique({
      where: { email },
      select: { accountType: true },
    })
      .catch(() => null)
    const accountType =
      existing?.accountType === AccountType.human ? AccountType.human : AccountType.mailbox
    await setMailPasswordByEmail(email, password, accountType)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    const err = e as { message?: string }
    return jsonError(err.message || 'Failed to create mailbox', 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || sessionUser.role !== 'admin') return jsonError('Forbidden', 403)

    const body = await request.json().catch(() => ({}))
    const email = normalizeEmail(body.email || '')
    const password = String(body.password || '')
    if (!email || !password) return jsonError('email and password are required', 400)

    const secret = process.env.MAIL_ADMIN_SECRET || null
    await mailboxctl('passwd', [email, password], secret)

    const existing = await db.user
      .findUnique({
      where: { email },
      select: { accountType: true },
    })
      .catch(() => null)
    const accountType =
      existing?.accountType === AccountType.human ? AccountType.human : AccountType.mailbox
    await setMailPasswordByEmail(email, password, accountType)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    const err = e as { message?: string }
    return jsonError(err.message || 'Failed to change password', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || sessionUser.role !== 'admin') return jsonError('Forbidden', 403)

    const body = await request.json().catch(() => ({}))
    const email = normalizeEmail(body.email || '')
    if (!email) return jsonError('email is required', 400)

    const secret = process.env.MAIL_ADMIN_SECRET || null
    await mailboxctl('delete', [email], secret)

    const existing = await db.user
      .findUnique({
        where: { email },
        select: { id: true, accountType: true },
      })
      .catch(() => null)

    if (existing) {
      const accountType = existing.accountType
      if (accountType === AccountType.human) {
        await db.user.update({
          where: { id: existing.id },
          data: { mailPasswordEnc: null },
        })
      } else {
        await db.user.delete({ where: { id: existing.id } })
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    const err = e as { message?: string }
    return jsonError(err.message || 'Failed to delete mailbox', 500)
  }
}
