import { db } from './db'
import { Email, Thread, Folder } from '@prisma/client'

export interface EmailWithRelations extends Email {
  thread?: Thread | null
  folder?: Folder | null
}

export async function getEmailsByFolder(
  userId: string,
  folderSlug: string,
  searchQuery?: string
) {
  const folder = await db.folder.findFirst({
    where: {
      userId,
      slug: folderSlug,
    },
  })

  if (!folder) {
    return []
  }

  const where: any = {
    userId,
    folderId: folder.id,
    isDeleted: false,
  }

  if (searchQuery) {
    // SQLite doesn't support case-insensitive mode directly
    where.OR = [
      { subject: { contains: searchQuery } },
      { from: { contains: searchQuery } },
      { text: { contains: searchQuery } },
    ]
  }

  return db.email.findMany({
    where,
    include: {
      thread: true,
      folder: true,
    },
    orderBy: {
      date: 'desc',
    },
  })
}

export async function getEmailThreads(
  userId: string,
  folderSlug: string,
  searchQuery?: string,
  cursor?: { date: Date; id: string } | null,
  take: number = 30
) {
  // Handle special folders
  let folderId: string | null = null
  
  if (folderSlug !== 'inbox' && folderSlug !== 'sent' && folderSlug !== 'drafts' && folderSlug !== 'starred' && folderSlug !== 'spam' && folderSlug !== 'archive' && folderSlug !== 'trash') {
    const folder = await db.folder.findFirst({
      where: {
        userId,
        slug: folderSlug,
      },
    })
    if (folder) {
      folderId = folder.id
    }
  }

  const where: any = {
    userId,
  }

  // Filter by folder
  if (folderSlug === 'inbox') {
    // Backward compatible: older emails were stored with folderId = null.
    // Newer sync may store explicit inbox folderId.
    const inboxFolder = await db.folder.findFirst({
      where: { userId, slug: 'inbox' },
    })
    where.isDeleted = false
    if (inboxFolder) {
      where.OR = [{ folderId: null }, { folderId: inboxFolder.id }]
    } else {
      where.folderId = null
    }
  } else if (folderSlug === 'sent') {
    const sentFolder = await db.folder.findFirst({
      where: { userId, slug: 'sent' },
    })
    where.isDeleted = false
    if (sentFolder) {
      where.folderId = sentFolder.id
    } else {
      // Fallback (older behavior) if folders were not initialized for some reason
      where.folderId = null
    }
  } else if (folderSlug === 'drafts') {
    const draftsFolder = await db.folder.findFirst({
      where: { userId, slug: 'drafts' },
    })
    if (draftsFolder) {
      where.folderId = draftsFolder.id
    }
    where.isDeleted = false
  } else if (folderSlug === 'starred') {
    where.isStarred = true
    where.isDeleted = false
  } else if (folderSlug === 'spam') {
    const spamFolder = await db.folder.findFirst({
      where: { userId, slug: 'spam' },
    })
    if (spamFolder) {
      where.folderId = spamFolder.id
    }
    where.isDeleted = false
  } else if (folderSlug === 'archive') {
    const archiveFolder = await db.folder.findFirst({
      where: { userId, slug: 'archive' },
    })
    if (archiveFolder) {
      where.folderId = archiveFolder.id
    }
    where.isDeleted = false
  } else if (folderSlug === 'trash') {
    where.isDeleted = true
  } else if (folderId) {
    where.folderId = folderId
    where.isDeleted = false
  } else {
    where.isDeleted = false
  }

  if (searchQuery) {
    // SQLite doesn't support case-insensitive mode directly
    const searchOr = [
      { subject: { contains: searchQuery } },
      { from: { contains: searchQuery } },
      { text: { contains: searchQuery } },
    ]
    // Preserve folder OR clause if already used (e.g., inbox)
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchOr }]
      delete where.OR
    } else {
      where.OR = searchOr
    }
  }

  // Get emails first, then group by thread
  const safeTake = Math.max(1, Math.min(100, take))

  if (cursor) {
    const cursorFilter = {
      OR: [
        { date: { lt: cursor.date } },
        { AND: [{ date: cursor.date }, { id: { lt: cursor.id } }] },
      ],
    }
    if (where.AND && Array.isArray(where.AND)) {
      where.AND.push(cursorFilter)
    } else if (where.OR) {
      where.AND = [{ OR: where.OR }, cursorFilter]
      delete where.OR
    } else {
      where.AND = [cursorFilter]
    }
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

export async function getEmailById(emailId: string, userId: string) {
  const email = await db.email.findFirst({
    where: {
      id: emailId,
      userId,
      isDeleted: false,
    },
    include: {
      thread: {
        include: {
          emails: {
            where: { isDeleted: false },
            orderBy: { date: 'asc' },
          },
        },
      },
      folder: true,
    },
  })

  if (email) {
    // Помечаем письмо (и всю цепочку) как прочитанное
    if (email.threadId) {
      await db.email.updateMany({
        where: {
          userId,
          threadId: email.threadId,
          isDeleted: false,
          isRead: false,
        },
        data: { isRead: true },
      })
    } else {
      await db.email.update({
        where: { id: emailId },
        data: { isRead: true },
      })
    }
  }

  return email
}

export async function getThreadById(threadId: string, userId: string) {
  return db.thread.findFirst({
    where: {
      id: threadId,
      userId,
    },
    include: {
      emails: {
        where: { isDeleted: false },
        orderBy: { date: 'asc' },
      },
      folder: true,
    },
  })
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

export async function deleteEmail(emailId: string, userId: string) {
  return db.email.update({
    where: {
      id: emailId,
      userId,
    },
    data: {
      isDeleted: true,
    },
  })
}

export async function permanentlyDeleteEmail(emailId: string, userId: string) {
  // Delete only within user's mailbox
  return db.email.deleteMany({
    where: {
      id: emailId,
      userId,
    },
  })
}

export async function emptyTrash(userId: string) {
  return db.email.deleteMany({
    where: {
      userId,
      isDeleted: true,
    },
  })
}

export async function toggleStarEmail(emailId: string, userId: string) {
  const email = await db.email.findFirst({
    where: {
      id: emailId,
      userId,
    },
  })

  if (!email) {
    throw new Error('Email not found')
  }

  return db.email.update({
    where: { id: emailId },
    data: { isStarred: !email.isStarred },
  })
}

