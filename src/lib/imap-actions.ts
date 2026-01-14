import Imap from 'imap'
import { getMailPasswordByEmail } from './mail-password'
import { messageIdCandidates } from './imap-message-id'

interface ImapConfig {
  host: string
  port: number
  user: string
  password: string
  tls: boolean
}

function resolveMailboxName(slug?: string | null, isDeleted?: boolean): string {
  if (isDeleted) return 'Trash'
  if (!slug) return 'INBOX'
  const s = String(slug).toLowerCase()
  if (s === 'inbox') return 'INBOX'
  if (s === 'sent') return 'Sent'
  if (s === 'drafts') return 'Drafts'
  if (s === 'spam') return 'Spam'
  if (s === 'archive') return 'Archive'
  if (s === 'trash') return 'Trash'
  if (s === 'starred') return 'INBOX'
  return 'INBOX'
}

export function getImapMailboxName(opts: { folderSlug?: string | null; isDeleted?: boolean }) {
  return resolveMailboxName(opts.folderSlug, opts.isDeleted)
}

async function getImapConfig(email: string, passwordOverride?: string): Promise<ImapConfig> {
  const password =
    passwordOverride ??
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

function openBox(imap: Imap, mailboxName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    imap.openBox(mailboxName, false, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function openBoxEnsure(imap: Imap, mailboxName: string, ensure: boolean): Promise<void> {
  try {
    await openBox(imap, mailboxName)
  } catch (err) {
    if (!ensure) throw err
    await new Promise<void>((resolve) => {
      imap.addBox(mailboxName, () => resolve())
    })
    await openBox(imap, mailboxName)
  }
}

async function searchByMessageId(imap: Imap, messageId: string): Promise<number[]> {
  const candidates = messageIdCandidates(messageId)
  if (!candidates.length) return []

  for (const candidate of candidates) {
    const results = await new Promise<number[]>((resolve, reject) => {
      imap.search(['HEADER', 'MESSAGE-ID', candidate], (err, found) => {
        if (err) return reject(err)
        resolve((found || []) as number[])
      })
    })
    if (results.length) return results
  }
  return []
}

type ImapMessageIdResult = {
  matchedIds: string[]
  missingIds: string[]
}

type ImapUidResult = {
  matchedUids: number[]
  missingUids: number[]
}
function addFlags(imap: Imap, uids: number[], flags: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!uids.length || !flags.length) return resolve()
    imap.addFlags(uids, flags, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function delFlags(imap: Imap, uids: number[], flags: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!uids.length || !flags.length) return resolve()
    imap.delFlags(uids, flags, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function expunge(imap: Imap): Promise<void> {
  return new Promise((resolve) => {
    imap.expunge(() => resolve())
  })
}

export async function applyImapFlagsByMessageIds(opts: {
  mailboxEmail: string
  mailboxName: string
  messageIds: string[]
  add?: string[]
  remove?: string[]
  expunge?: boolean
  ensureMailbox?: boolean
}): Promise<number> {
  const {
    mailboxEmail,
    mailboxName,
    messageIds,
    add = [],
    remove = [],
    expunge: doExpunge = false,
    ensureMailbox = false,
  } = opts
  const config = await getImapConfig(mailboxEmail)

  return new Promise<number>((resolve, reject) => {
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

    let matched = 0

    const done = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve(matched)
    }

    imap.once('ready', async () => {
      try {
        await openBoxEnsure(imap, mailboxName, ensureMailbox)
        for (const mid of messageIds) {
          if (!mid) continue
          const uids = await searchByMessageId(imap, mid)
          if (!uids.length) continue
          matched += uids.length
          if (add.length) await addFlags(imap, uids, add)
          if (remove.length) await delFlags(imap, uids, remove)
        }
        if (doExpunge) await expunge(imap)
        done()
      } catch (err) {
        done(err)
      }
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}

export async function applyImapFlagsByMessageIdsDetailed(opts: {
  mailboxEmail: string
  mailboxName: string
  messageIds: string[]
  add?: string[]
  remove?: string[]
  expunge?: boolean
  ensureMailbox?: boolean
}): Promise<ImapMessageIdResult> {
  const {
    mailboxEmail,
    mailboxName,
    messageIds,
    add = [],
    remove = [],
    expunge: doExpunge = false,
    ensureMailbox = false,
  } = opts
  const uniqueMessageIds = Array.from(new Set(messageIds.filter(Boolean)))
  if (!uniqueMessageIds.length) return { matchedIds: [], missingIds: [] }
  const config = await getImapConfig(mailboxEmail)

  return new Promise<ImapMessageIdResult>((resolve, reject) => {
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

    const matchedIds: string[] = []
    const missingIds: string[] = []

    const done = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve({ matchedIds, missingIds })
    }

    imap.once('ready', async () => {
      try {
        await openBoxEnsure(imap, mailboxName, ensureMailbox)
        for (const mid of uniqueMessageIds) {
          const uids = await searchByMessageId(imap, mid)
          if (!uids.length) {
            missingIds.push(mid)
            continue
          }
          matchedIds.push(mid)
          if (add.length) await addFlags(imap, uids, add)
          if (remove.length) await delFlags(imap, uids, remove)
        }
        if (doExpunge) await expunge(imap)
        done()
      } catch (err) {
        done(err)
      }
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}

export async function applyImapFlagsByUids(opts: {
  mailboxEmail: string
  mailboxName: string
  uids: number[]
  add?: string[]
  remove?: string[]
  expunge?: boolean
  ensureMailbox?: boolean
}): Promise<number> {
  const result = await applyImapFlagsByUidsDetailed(opts)
  return result.matchedUids.length
}

export async function applyImapFlagsByUidsDetailed(opts: {
  mailboxEmail: string
  mailboxName: string
  uids: number[]
  add?: string[]
  remove?: string[]
  expunge?: boolean
  ensureMailbox?: boolean
}): Promise<ImapUidResult> {
  const {
    mailboxEmail,
    mailboxName,
    uids,
    add = [],
    remove = [],
    expunge: doExpunge = false,
    ensureMailbox = false,
  } = opts
  const uniqueUids = Array.from(new Set(uids.filter((uid) => Number.isFinite(uid) && uid > 0)))
  if (!uniqueUids.length) return { matchedUids: [], missingUids: [] }
  const config = await getImapConfig(mailboxEmail)

  return new Promise<ImapUidResult>((resolve, reject) => {
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

    const matchedUids: number[] = []
    const missingUids: number[] = []

    const done = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve({ matchedUids, missingUids })
    }

    imap.once('ready', async () => {
      try {
        await openBoxEnsure(imap, mailboxName, ensureMailbox)
        const criteria = uniqueUids.join(',')
        const found = await new Promise<number[]>((resolve, reject) => {
          imap.search([['UID', criteria]], (err, results) => {
            if (err) return reject(err)
            resolve((results || []) as number[])
          })
        })
        const foundSet = new Set(found)
        for (const uid of uniqueUids) {
          if (foundSet.has(uid)) matchedUids.push(uid)
          else missingUids.push(uid)
        }
        if (!found.length) {
          done()
          return
        }
        if (add.length) await addFlags(imap, found, add)
        if (remove.length) await delFlags(imap, found, remove)
        if (doExpunge) await expunge(imap)
        done()
      } catch (err) {
        done(err)
      }
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}

export async function moveImapMessagesByMessageIds(opts: {
  mailboxEmail: string
  sourceMailbox: string
  targetMailbox: string
  messageIds: string[]
}): Promise<number> {
  const { mailboxEmail, sourceMailbox, targetMailbox, messageIds } = opts
  if (!messageIds.length) return 0
  const config = await getImapConfig(mailboxEmail)

  return new Promise<number>((resolve, reject) => {
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

    let moved = 0

    const done = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve(moved)
    }

    imap.once('ready', async () => {
      try {
        await openBox(imap, sourceMailbox)
        imap.addBox(targetMailbox, async () => {
          for (const mid of messageIds) {
            if (!mid) continue
            const uids = await searchByMessageId(imap, mid)
            if (!uids.length) continue
            await new Promise<void>((resolveMove, rejectMove) => {
              imap.move(uids, targetMailbox, (err) => {
                if (err) return rejectMove(err)
                resolveMove()
              })
            })
            moved += uids.length
          }
          done()
        })
      } catch (err) {
        done(err)
      }
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}

export async function moveImapMessagesByUids(opts: {
  mailboxEmail: string
  sourceMailbox: string
  targetMailbox: string
  uids: number[]
}): Promise<number> {
  const { mailboxEmail, sourceMailbox, targetMailbox, uids } = opts
  const uniqueUids = Array.from(new Set(uids.filter((uid) => Number.isFinite(uid) && uid > 0)))
  if (!uniqueUids.length) return 0
  const config = await getImapConfig(mailboxEmail)

  return new Promise<number>((resolve, reject) => {
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

    let moved = 0

    const done = (err?: unknown) => {
      try {
        imap.end()
      } catch {}
      if (err) reject(err)
      else resolve(moved)
    }

    imap.once('ready', async () => {
      try {
        await openBox(imap, sourceMailbox)
        const criteria = uniqueUids.join(',')
        const found = await new Promise<number[]>((resolve, reject) => {
          imap.search([['UID', criteria]], (err, results) => {
            if (err) return reject(err)
            resolve((results || []) as number[])
          })
        })
        if (!found.length) {
          done()
          return
        }
        imap.addBox(targetMailbox, async () => {
          await new Promise<void>((resolveMove, rejectMove) => {
            imap.move(found, targetMailbox, (err) => {
              if (err) return rejectMove(err)
              resolveMove()
            })
          })
          moved = found.length
          done()
        })
      } catch (err) {
        done(err)
      }
    })

    imap.once('error', (err) => done(err))
    imap.connect()
  })
}
