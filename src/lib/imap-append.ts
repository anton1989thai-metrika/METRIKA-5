import Imap from 'imap'
import MailComposer from 'nodemailer/lib/mail-composer'
import fs from 'fs/promises'
import { StoredAttachment, resolveAttachmentPath } from './attachments'
import { getMailPasswordByEmail } from './mail-password'

export async function appendEmailToImap(opts: {
  mailboxEmail: string
  mailboxName: string
  email: {
    messageId?: string | null
    from: string
    to: string
    cc?: string | null
    bcc?: string | null
    subject: string
    text?: string | null
    html?: string | null
    date?: Date | string | null
    isRead?: boolean
    isStarred?: boolean
    attachments?: StoredAttachment[] | null
  }
}) {
  const { mailboxEmail, mailboxName, email } = opts
  const password =
    (await getMailPasswordByEmail(mailboxEmail)) ??
    process.env.IMAP_PASS ??
    ''
  if (!password) {
    throw new Error(`Нет пароля для ящика ${mailboxEmail}`)
  }

  const attachments = []
  const stored = Array.isArray(email.attachments) ? email.attachments : []
  for (const att of stored) {
    const relPath = String(att?.path || '')
    if (!relPath) continue
    try {
      const { absPath } = resolveAttachmentPath(relPath)
      const content = await fs.readFile(absPath)
      attachments.push({
        filename: String(att?.filename || 'attachment'),
        content,
        contentType: String(att?.contentType || 'application/octet-stream'),
      })
    } catch {
      // skip missing/invalid attachments
    }
  }

  const raw = await new MailComposer({
    from: email.from,
    to: email.to,
    cc: email.cc || undefined,
    bcc: email.bcc || undefined,
    subject: email.subject || '(без темы)',
    text: email.text || undefined,
    html: email.html || undefined,
    attachments: attachments.length ? attachments : undefined,
    date: email.date ? new Date(email.date) : new Date(),
    messageId: email.messageId || undefined,
  })
    .compile()
    .build()

  const flags: string[] = []
  if (email.isRead) flags.push('\\Seen')
  if (email.isStarred) flags.push('\\Flagged')

  const imap = new Imap({
    user: mailboxEmail,
    password,
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    connTimeout: 10_000,
    authTimeout: 10_000,
    socketTimeout: 30_000,
  })

  await new Promise<void>((resolve, reject) => {
    const finish = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve()
    }

    imap.once('ready', () => {
      imap.addBox(mailboxName, () => {
        imap.append(raw, { mailbox: mailboxName, flags, date: new Date(email.date || Date.now()) }, (err) => {
          finish(err)
        })
      })
    })
    imap.once('error', (err) => finish(err))
    imap.once('end', () => finish())
    imap.connect()
  })
}
