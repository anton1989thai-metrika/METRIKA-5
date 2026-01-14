import { Prisma } from '@prisma/client'
import { db } from './db'

export async function getEmailThreads(
  userId: string,
  folderSlug: string,
  searchQuery?: string,
  cursor?: { date: Date; id: string } | null,
  take: number = 30
) {
  const normalizedSlug = String(folderSlug || 'inbox').toLowerCase()
  const folders = await db.folder.findMany({
    where: { userId },
    select: { id: true, slug: true },
  })
  const folderBySlug = new Map<string, string>()
  for (const folder of folders) {
    const slug = String(folder.slug || '').toLowerCase()
    if (slug) folderBySlug.set(slug, folder.id)
  }

  const isStandard =
    normalizedSlug === 'inbox' ||
    normalizedSlug === 'sent' ||
    normalizedSlug === 'drafts' ||
    normalizedSlug === 'starred' ||
    normalizedSlug === 'spam' ||
    normalizedSlug === 'archive' ||
    normalizedSlug === 'trash'

  const customFolderId = !isStandard ? folderBySlug.get(normalizedSlug) ?? null : null
  const andFilters: Prisma.EmailWhereInput[] = []

  // Filter by folder
  if (normalizedSlug === 'inbox') {
    // Backward compatible: older emails were stored with folderId = null.
    // Newer sync may store explicit inbox folderId.
    const inboxId = folderBySlug.get('inbox') || null
    const inboxFilter: Prisma.EmailWhereInput = { isDeleted: false }
    if (inboxId) {
      inboxFilter.OR = [{ folderId: null }, { folderId: inboxId }]
    } else {
      inboxFilter.folderId = null
    }
    andFilters.push(inboxFilter)
  } else if (normalizedSlug === 'sent') {
    const sentId = folderBySlug.get('sent') || null
    const sentFilter: Prisma.EmailWhereInput = { isDeleted: false }
    if (sentId) {
      sentFilter.folderId = sentId
    } else {
      // Fallback (older behavior) if folders were not initialized for some reason
      sentFilter.folderId = null
    }
    andFilters.push(sentFilter)
  } else if (normalizedSlug === 'drafts') {
    const draftsId = folderBySlug.get('drafts') || null
    const draftsFilter: Prisma.EmailWhereInput = { isDeleted: false }
    if (draftsId) draftsFilter.folderId = draftsId
    andFilters.push(draftsFilter)
  } else if (normalizedSlug === 'starred') {
    andFilters.push({ isStarred: true, isDeleted: false })
  } else if (normalizedSlug === 'spam') {
    const spamId = folderBySlug.get('spam') || null
    const spamFilter: Prisma.EmailWhereInput = { isDeleted: false }
    if (spamId) spamFilter.folderId = spamId
    andFilters.push(spamFilter)
  } else if (normalizedSlug === 'archive') {
    const archiveId = folderBySlug.get('archive') || null
    const archiveFilter: Prisma.EmailWhereInput = { isDeleted: false }
    if (archiveId) archiveFilter.folderId = archiveId
    andFilters.push(archiveFilter)
  } else if (normalizedSlug === 'trash') {
    andFilters.push({ isDeleted: true })
  } else if (customFolderId) {
    andFilters.push({ folderId: customFolderId, isDeleted: false })
  } else {
    andFilters.push({ isDeleted: false })
  }

  if (searchQuery) {
    // SQLite doesn't support case-insensitive mode directly
    andFilters.push({
      OR: [
        { subject: { contains: searchQuery } },
        { from: { contains: searchQuery } },
        { text: { contains: searchQuery } },
      ],
    })
  }

  // Get emails first, then group by thread
  const safeTake = Math.max(1, Math.min(100, take))

  if (cursor) {
    andFilters.push({
      OR: [
        { date: { lt: cursor.date } },
        { AND: [{ date: cursor.date }, { id: { lt: cursor.id } }] },
      ],
    })
  }

  const where: Prisma.EmailWhereInput = { userId }
  if (andFilters.length > 0) {
    where.AND = andFilters
  }

  const emails = await db.email.findMany({
    where,
    include: {
      thread: true,
      folder: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: safeTake + 1,
  })

  const hasMore = emails.length > safeTake
  const pageEmails = hasMore ? emails.slice(0, safeTake) : emails

  // Group emails by thread
  const threadMap = new Map<string, typeof pageEmails>()
  
  for (const email of pageEmails) {
    if (email.threadId) {
      if (!threadMap.has(email.threadId)) {
        threadMap.set(email.threadId, [])
      }
      threadMap.get(email.threadId)!.push(email)
    } else {
      // Single email thread
      threadMap.set(email.id, [email])
    }
  }

  // Convert to thread format
  const threads = Array.from(threadMap.entries()).map(([threadId, threadEmails]) => {
    // Ensure per-thread emails are ordered oldest->newest for UI, and compute updatedAt from newest
    const sorted = [...threadEmails].sort((a, b) => a.date.getTime() - b.date.getTime())
    const newest = sorted[sorted.length - 1]
    const thread = newest.thread
    
    return {
      id: threadId,
      subject: thread?.subject || newest.subject || '(без темы)',
      updatedAt: newest.date,
      emails: sorted.map(e => ({
        id: e.id,
        from: e.from,
        subject: e.subject,
        date: e.date.toISOString(),
        isRead: e.isRead,
        isStarred: e.isStarred,
        text: e.text,
      })),
    }
  })

  // Sort by updatedAt
  threads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const last = pageEmails[pageEmails.length - 1]
  const nextCursor = last ? { date: last.date, id: last.id } : null

  return { threads, hasMore, nextCursor }
}

export async function getEmailById(
  emailId: string,
  userId: string,
  opts?: { markRead?: boolean; includeDeleted?: boolean }
) {
  const includeDeleted = opts?.includeDeleted === true
  const baseWhere: Prisma.EmailWhereInput = {
    id: emailId,
    userId,
  }
  if (!includeDeleted) {
    baseWhere.isDeleted = false
  }

  const email = await db.email.findFirst({
    where: baseWhere,
    include: {
      thread: {
        include: {
          emails: {
            where: includeDeleted ? {} : { isDeleted: false },
            orderBy: { date: 'asc' },
          },
        },
      },
      folder: true,
    },
  })

  const readMessageIds: string[] = []
  const shouldMarkRead = opts?.markRead !== false
  if (email) {
    // Помечаем письмо (и всю цепочку) как прочитанное
    if (email.threadId) {
      const unreadWhere: Prisma.EmailWhereInput = {
        userId,
        threadId: email.threadId,
        isRead: false,
      }
      if (!includeDeleted) {
        unreadWhere.isDeleted = false
      }
      const unread = await db.email.findMany({
        where: unreadWhere,
        select: { messageId: true },
      })
      for (const u of unread) {
        if (u.messageId) readMessageIds.push(u.messageId)
      }
      if (shouldMarkRead) {
        await db.email.updateMany({
          where: unreadWhere,
          data: { isRead: true },
        })
      }
    } else {
      if (!email.isRead && email.messageId) {
        readMessageIds.push(email.messageId)
      }
      if (shouldMarkRead) {
        await db.email.update({
          where: { id: emailId },
          data: { isRead: true },
        })
      }
    }
  }

  return { email, readMessageIds }
}

export async function getFolders(userId: string) {
  return db.folder.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          emails: {
            where: {
              isDeleted: false,
              isRead: false,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export async function deleteEmail(
  emailId: string,
  userId: string,
  opts?: { imapMailbox?: string | null; imapUid?: number | null }
) {
  const data: { isDeleted: boolean; imapMailbox?: string | null; imapUid?: number | null } = {
    isDeleted: true,
  }
  if (Object.prototype.hasOwnProperty.call(opts || {}, 'imapMailbox')) {
    data.imapMailbox = opts?.imapMailbox ?? null
  }
  if (Object.prototype.hasOwnProperty.call(opts || {}, 'imapUid')) {
    data.imapUid = opts?.imapUid ?? null
  }

  const result = await db.email.updateMany({
    where: {
      id: emailId,
      userId,
    },
    data,
  })
  if (result.count === 0) {
    throw new Error('Email not found')
  }
  return result
}

export async function permanentlyDeleteEmail(emailId: string, userId: string) {
  // Delete only within user's mailbox
  const result = await db.email.deleteMany({
    where: {
      id: emailId,
      userId,
    },
  })
  if (result.count === 0) {
    throw new Error('Email not found')
  }
  return result
}
