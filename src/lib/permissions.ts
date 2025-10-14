import { User } from "@/data/users"

// Функция для проверки доступа пользователя к разделу
export const hasPermission = (user: User | null, section: string): boolean => {
  if (!user || !user.detailedPermissions) {
    return false
  }

  // Публичные разделы всегда доступны
  const publicSections = ['objects', 'map', 'about', 'contacts', 'blog']
  if (publicSections.includes(section)) {
    return true
  }

  // Проверяем разрешения для настраиваемых разделов
  switch (section) {
    case 'profile':
      return user.detailedPermissions.personalCabinet?.enabled || false
    case 'my-objects':
      return user.detailedPermissions.myObjects?.enabled || false
    case 'email':
      return user.detailedPermissions.email?.enabled || false
    case 'academy':
      return user.detailedPermissions.academy?.enabled || false
    case 'knowledge-base':
      return user.detailedPermissions.knowledgeBase?.enabled || false
    case 'tasks':
      return user.detailedPermissions.taskManager?.enabled || false
    case 'admin':
      return user.detailedPermissions.adminPanel?.enabled || false
    default:
      return false
  }
}

// Функция для получения всех доступных разделов для пользователя
export const getAvailableSections = (user: User | null): string[] => {
  if (!user) {
    return ['objects', 'map', 'about', 'contacts', 'blog'] // Только публичные разделы
  }

  const availableSections: string[] = ['objects', 'map', 'about', 'contacts', 'blog'] // Публичные разделы

  // Добавляем настраиваемые разделы на основе разрешений
  if (hasPermission(user, 'profile')) {
    availableSections.push('profile')
  }
  if (hasPermission(user, 'my-objects')) {
    availableSections.push('my-objects')
  }
  if (hasPermission(user, 'email')) {
    availableSections.push('email')
  }
  if (hasPermission(user, 'academy')) {
    availableSections.push('academy')
  }
  if (hasPermission(user, 'knowledge-base')) {
    availableSections.push('knowledge-base')
  }
  if (hasPermission(user, 'tasks')) {
    availableSections.push('tasks')
  }
  if (hasPermission(user, 'admin')) {
    availableSections.push('admin')
  }

  return availableSections
}

// Функция для проверки конкретного разрешения внутри раздела
export const hasDetailedPermission = (user: User | null, section: string, permission: string): boolean => {
  if (!user || !user.detailedPermissions) {
    return false
  }

  // Сначала проверяем, что раздел включен
  if (!hasPermission(user, section)) {
    return false
  }

  // Проверяем конкретное разрешение
  switch (section) {
    case 'email':
      return user.detailedPermissions.email?.[permission as keyof typeof user.detailedPermissions.email] || false
    case 'academy':
      return user.detailedPermissions.academy?.[permission as keyof typeof user.detailedPermissions.academy] || false
    case 'tasks':
      return user.detailedPermissions.taskManager?.[permission as keyof typeof user.detailedPermissions.taskManager] || false
    case 'admin':
      return user.detailedPermissions.adminPanel?.[permission as keyof typeof user.detailedPermissions.adminPanel] || false
    default:
      return false
  }
}
