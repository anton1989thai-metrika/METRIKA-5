import { db } from './db'

export async function initializeEmailFolders(userId: string) {
  // Create default folders if they don't exist
  const defaultFolders = [
    { name: 'Входящие', slug: 'inbox' },
    { name: 'Отправленные', slug: 'sent' },
    { name: 'Черновики', slug: 'drafts' },
    { name: 'Важные', slug: 'starred' },
    { name: 'Спам', slug: 'spam' },
    { name: 'Архив', slug: 'archive' },
    { name: 'Корзина', slug: 'trash' },
  ]

  for (const folder of defaultFolders) {
    await db.folder.upsert({
      where: {
        userId_slug: {
          userId,
          slug: folder.slug,
        },
      },
      update: {},
      create: {
        userId,
        name: folder.name,
        slug: folder.slug,
      },
    })
  }
}

export async function initializeEmailUser(email: string, name?: string) {
  // Create or get user
  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: name || email.split('@')[0],
    },
  })

  // Initialize folders
  await initializeEmailFolders(user.id)

  return user
}

