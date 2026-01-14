import 'server-only'

import { NextRequest } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

type MailboxPermissions = {
  email?: {
    allowedMailboxes?: string[]
  }
}

type SessionUser = {
  email?: string | null
  role?: string | null
  detailedPermissions?: unknown
}

export async function listServerMailboxes(): Promise<string[]> {
  // relies on sudoers for app user (metrika)
  try {
    const { stdout } = await execFileAsync('sudo', ['/usr/local/sbin/metrika-mailboxctl', 'list'], {
      env: process.env,
    })
    return String(stdout ?? '')
      .split('\n')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  } catch {
    // Dev fallback when sudo/mailboxctl isn't available
    const fromEnv =
      process.env.SYNC_EMAILS?.split(',').map((e) => e.trim()).filter(Boolean) ?? []
    const base = [process.env.DEFAULT_MAILBOX_EMAIL, process.env.IMAP_USER].filter(Boolean) as string[]
    return Array.from(
      new Set([...fromEnv, ...base].map((s) => String(s || '').trim().toLowerCase()).filter(Boolean))
    )
  }
}

function uniqEmails(items: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    const v = String(item || '').trim().toLowerCase()
    if (!v) continue
    if (seen.has(v)) continue
    seen.add(v)
    out.push(v)
  }
  return out
}

export async function getAllowedMailboxEmails(
  request: NextRequest
): Promise<{ userEmail: string; isAdmin: boolean; allowed: string[] }> {
  const sessionUser = (await getSessionUser(request)) as SessionUser | null
  if (!sessionUser) throw new Error('Unauthorized')

  const userEmail = String(sessionUser.email || '').trim().toLowerCase()
  const isAdmin = String(sessionUser.role || '') === 'admin'

  const serverMailboxes = await listServerMailboxes().catch(() => [])
  if (isAdmin) {
    return { userEmail, isAdmin, allowed: uniqEmails([userEmail, ...serverMailboxes]) }
  }

  const detailed = sessionUser.detailedPermissions as MailboxPermissions | null | undefined
  const allowedFromUser = Array.isArray(detailed?.email?.allowedMailboxes)
    ? detailed?.email?.allowedMailboxes
    : []

  const desired = uniqEmails([userEmail, ...allowedFromUser])
  const serverSet = new Set(serverMailboxes)
  const allowed = desired.filter((e) => serverSet.has(e))
  return { userEmail, isAdmin, allowed }
}

export async function resolveRequestedMailbox(
  request: NextRequest
): Promise<{
  sessionUser: SessionUser
  mailboxEmail: string
  allowedMailboxes: string[]
  isAdmin: boolean
}> {
  const sessionUser = (await getSessionUser(request)) as SessionUser | null
  if (!sessionUser) throw new Error('Unauthorized')

  const url = new URL(request.url)
  const requested = String(url.searchParams.get('viewEmail') || url.searchParams.get('email') || '').trim().toLowerCase()

  const { allowed, isAdmin, userEmail } = await getAllowedMailboxEmails(request)
  const mailboxEmail = requested || userEmail

  if (!isAdmin) {
    if (!allowed.includes(mailboxEmail)) throw new Error('Forbidden')
  }

  return { sessionUser, mailboxEmail, allowedMailboxes: allowed, isAdmin }
}
