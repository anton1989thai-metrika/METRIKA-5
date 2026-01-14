import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

function requireAdminSecret(provided: string | null | undefined) {
  const expected = process.env.MAIL_ADMIN_SECRET
  if (!expected) {
    throw new Error('MAIL_ADMIN_SECRET is not set on server')
  }
  if (!provided || provided !== expected) {
    throw new Error('Unauthorized')
  }
}

type MailboxCtlAction = 'list' | 'create' | 'passwd' | 'delete'

export async function mailboxctl(
  action: MailboxCtlAction,
  args: string[],
  adminSecret: string | null | undefined,
): Promise<{ stdout: string; stderr: string }> {
  requireAdminSecret(adminSecret)

  // Requires sudoers rule for user running the app (metrika) to run mailboxctl.
  const { stdout, stderr } = await execFileAsync('sudo', ['/usr/local/sbin/metrika-mailboxctl', action, ...args], {
    env: process.env,
  })
  return { stdout: String(stdout ?? ''), stderr: String(stderr ?? '') }
}

