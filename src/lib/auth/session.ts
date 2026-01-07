import 'server-only'

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { SESSION_COOKIE } from '@/lib/auth/constants'

function sha256B64Url(input: string) {
  return createHash('sha256').update(input).digest('base64url')
}

function newToken() {
  return randomBytes(32).toString('base64url')
}

export async function createSession(userId: string, ttlDays = 30) {
  const token = newToken()
  const tokenHash = sha256B64Url(token)
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000)

  await db.session.create({
    data: { tokenHash, userId, expiresAt },
  })

  return { token, tokenHash, expiresAt }
}

export async function getSessionUser(request?: NextRequest) {
  const token =
    request?.cookies.get(SESSION_COOKIE)?.value ?? (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = sha256B64Url(token)
  const session = await db.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })
  if (!session) return null
  if (session.expiresAt.getTime() <= Date.now()) return null

  return session.user
}

export async function destroySession(token: string) {
  const tokenHash = sha256B64Url(token)
  await db.session.delete({ where: { tokenHash } }).catch(() => null)
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
}

export function constantTimeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}


