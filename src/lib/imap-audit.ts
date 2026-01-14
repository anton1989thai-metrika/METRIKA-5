import Imap from 'imap'
import { getMailPasswordByEmail } from './mail-password'

export type ImapHeaderInfo = {
  messageId: string
  subject?: string
  date?: string
  uid?: number
  flags?: string[]
}

async function getImapConfig(email: string) {
  const password =
    (await getMailPasswordByEmail(email)) ??
    process.env.IMAP_PASS ??
    ''
  if (!password) {
    throw new Error(`Нет пароля для ящика ${email}`)
  }
  return {
    host: process.env.IMAP_HOST || 'mail.metrika.direct',
    port: parseInt(process.env.IMAP_PORT || '993'),
    user: email,
    password,
    tls: true,
  }
}

function parseHeaderValue(headerText: string, key: string): string | undefined {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'im')
  const match = headerText.match(re)
  if (!match) return undefined
  return match[1].trim()
}

export async function listImapMessageHeaders(opts: {
  mailboxEmail: string
  mailboxName: string
}): Promise<ImapHeaderInfo[]> {
  const { mailboxEmail, mailboxName } = opts
  const config = await getImapConfig(mailboxEmail)

  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 10_000,
      authTimeout: 10_000,
      socketTimeout: 30_000,
    })

    const out: ImapHeaderInfo[] = []

    const done = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve(out)
    }

    imap.once('ready', () => {
      imap.openBox(mailboxName, true, (err) => {
        if (err) return done(err)
        imap.search(['ALL'], (err, results) => {
          if (err) return done(err)
          if (!results || results.length === 0) return done()

          const fetch = imap.fetch(results, {
            bodies: 'HEADER.FIELDS (MESSAGE-ID SUBJECT DATE)',
            struct: false,
            markSeen: false,
          })

          fetch.on('message', (msg) => {
            let header = ''
            let uid: number | undefined
            let flags: string[] | undefined
            msg.on('attributes', (attrs: Imap.ImapMessageAttributes) => {
              if (typeof attrs?.uid === 'number') uid = attrs.uid
              if (Array.isArray(attrs?.flags)) flags = attrs.flags
            })
            msg.on('body', (stream) => {
              stream.on('data', (chunk) => {
                header += chunk.toString('utf8')
              })
            })
            msg.once('end', () => {
              const messageId = parseHeaderValue(header, 'Message-ID')
              if (!messageId) return
              out.push({
                messageId,
                subject: parseHeaderValue(header, 'Subject'),
                date: parseHeaderValue(header, 'Date'),
                uid,
                flags,
              })
            })
          })

          fetch.once('error', (err) => done(err))
          fetch.once('end', () => done())
        })
      })
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}
