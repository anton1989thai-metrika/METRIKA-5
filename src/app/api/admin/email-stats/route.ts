import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { listServerMailboxes } from '@/lib/mailbox-access'
import { StoredAttachment } from '@/lib/attachments'

export const runtime = 'nodejs'

const ONE_HOUR_MS = 60 * 60 * 1000

function bytesFromEmailRow(row: {
  text?: string | null
  html?: string | null
  attachments?: unknown
}) {
  let total = 0
  if (row.text) total += Buffer.byteLength(row.text, 'utf8')
  if (row.html) total += Buffer.byteLength(row.html, 'utf8')
  const list = Array.isArray(row.attachments) ? (row.attachments as StoredAttachment[]) : []
  for (const att of list) {
    const sz = Number(att?.size || 0)
    if (!Number.isNaN(sz)) total += sz
  }
  return total
}

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const existing = await db.emailStats.findUnique({ where: { id: 'global' } }).catch(() => null)
    const now = Date.now()
    if (existing && now - new Date(existing.updatedAt).getTime() < ONE_HOUR_MS) {
      return NextResponse.json({ success: true, stats: existing }, { status: 200 })
    }

    const inboxFolders = await db.folder.findMany({
      where: { slug: 'inbox' },
      select: { id: true },
    })
    const inboxFolderIds = inboxFolders.map((f) => f.id)

    const [totalEmails, unreadInbox, deliveryErrors] = await Promise.all([
      db.email.count(),
      db.email.count({
        where: {
          isRead: false,
          isDeleted: false,
          OR: [{ folderId: null }, { folderId: { in: inboxFolderIds } }],
        },
      }),
      db.mailDeliveryFailure.count(),
    ])

    const mailboxCount = (await listServerMailboxes().catch(() => [])).length

    const emails = await db.email.findMany({
      select: { text: true, html: true, attachments: true },
    })
    let storageBytes = 0
    for (const row of emails) {
      storageBytes += bytesFromEmailRow(row)
    }

    const stats = await db.emailStats.upsert({
      where: { id: 'global' },
      update: {
        totalEmails,
        unreadInbox,
        deliveryErrors,
        storageBytes,
        mailboxCount,
      },
      create: {
        id: 'global',
        totalEmails,
        unreadInbox,
        deliveryErrors,
        storageBytes,
        mailboxCount,
      },
    })

    return NextResponse.json({ success: true, stats }, { status: 200 })
  } catch (e) {
    const err = e as { message?: string }
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 })
  }
}
