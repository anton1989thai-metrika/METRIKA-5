import { User } from "@/data/users"

// Функция для получения базовых разрешений роли
const getRolePermissions = (role: string): Record<string, boolean> => {
  const permissions: Record<string, boolean> = {
    'profile': false,
    'my-objects': false,
    'email': false,
    'academy': false,
    'knowledge-base': false,
    'tasks': false,
    'admin': false
  }

  switch (role) {
    case 'site-user':
      permissions['profile'] = true
      break
    case 'client':
      permissions['profile'] = true
      permissions['my-objects'] = true
      break
    case 'foreign-employee':
    case 'freelancer':
      permissions['profile'] = true
      permissions['my-objects'] = true
      permissions['email'] = true
      break
    case 'employee':
      permissions['profile'] = true
      permissions['my-objects'] = true
      permissions['email'] = true
      permissions['academy'] = true
      permissions['knowledge-base'] = true
      permissions['tasks'] = true
      break
    case 'manager':
      permissions['profile'] = true
      permissions['my-objects'] = true
      permissions['email'] = true
      permissions['academy'] = true
      permissions['knowledge-base'] = true
      permissions['tasks'] = true
      permissions['admin'] = true
      break
    case 'admin':
      // Администратор видит всё
      Object.keys(permissions).forEach(key => {
        permissions[key] = true
      })
      break
  }

  return permissions
}

// Функция для проверки доступа пользователя к разделу
export const hasPermission = (user: User | null, section: string): boolean => {
  if (!user) {
    return false
  }

  // Публичные разделы всегда доступны
  const publicSections = ['home', 'objects', 'map', 'about', 'contacts', 'blog']
  if (publicSections.includes(section)) {
    return true
  }

  // Администратор видит всё
  if (user.role === 'admin') {
    return true
  }

  // Получаем базовые разрешения роли
  const rolePermissions = getRolePermissions(user.role)

  // Если есть индивидуальные разрешения, они имеют приоритет
  if (user.detailedPermissions) {
    switch (section) {
      case 'profile':
        return user.detailedPermissions.personalCabinet?.enabled ?? rolePermissions['profile']
      case 'my-objects':
        return user.detailedPermissions.myObjects?.enabled ?? rolePermissions['my-objects']
      case 'email':
        return user.detailedPermissions.email?.enabled ?? rolePermissions['email']
      case 'academy':
        return user.detailedPermissions.academy?.enabled ?? rolePermissions['academy']
      case 'knowledge-base':
        return user.detailedPermissions.knowledgeBase?.enabled ?? rolePermissions['knowledge-base']
      case 'tasks':
        return user.detailedPermissions.taskManager?.enabled ?? rolePermissions['tasks']
      case 'admin':
        return user.detailedPermissions.adminPanel?.enabled ?? rolePermissions['admin']
      default:
        return false
    }
  }

  // Если нет индивидуальных разрешений, используем ролевые
  return rolePermissions[section] || false
}

// Функция для получения всех доступных разделов для пользователя
export const getAvailableSections = (user: User | null): string[] => {
  if (!user) {
    return ['home', 'objects', 'map', 'about', 'contacts', 'blog'] // Только публичные разделы
  }

  const availableSections: string[] = ['home', 'objects', 'map', 'about', 'contacts', 'blog'] // Публичные разделы

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

// Функция для проверки, являются ли права стандартными или нестандартными
export const arePermissionsStandard = (user: User | null): boolean => {
  if (!user || !user.detailedPermissions) {
    return true // Если нет индивидуальных разрешений, права стандартные
  }

  const rolePermissions = getRolePermissions(user.role)
  
  // Проверяем каждое разрешение
  const sections = ['profile', 'my-objects', 'email', 'academy', 'knowledge-base', 'tasks', 'admin']
  
  for (const section of sections) {
    const roleHasAccess = rolePermissions[section]
    let individualHasAccess = false
    
    switch (section) {
      case 'profile':
        individualHasAccess = user.detailedPermissions.personalCabinet?.enabled ?? false
        break
      case 'my-objects':
        individualHasAccess = user.detailedPermissions.myObjects?.enabled ?? false
        break
      case 'email':
        individualHasAccess = user.detailedPermissions.email?.enabled ?? false
        break
      case 'academy':
        individualHasAccess = user.detailedPermissions.academy?.enabled ?? false
        break
      case 'knowledge-base':
        individualHasAccess = user.detailedPermissions.knowledgeBase?.enabled ?? false
        break
      case 'tasks':
        individualHasAccess = user.detailedPermissions.taskManager?.enabled ?? false
        break
      case 'admin':
        individualHasAccess = user.detailedPermissions.adminPanel?.enabled ?? false
        break
    }
    
    // Если права отличаются, то они нестандартные
    if (roleHasAccess !== individualHasAccess) {
      return false
    }
  }
  
  return true // Все права совпадают
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

// Функция для получения названия роли на русском языке
export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'site-user': return 'Пользователь сайта'
    case 'client': return 'Клиент Метрики'
    case 'foreign-employee': return 'Иностранный сотрудник'
    case 'freelancer': return 'Внештатный сотрудник'
    case 'employee': return 'Сотрудник'
    case 'manager': return 'Менеджер'
    case 'admin': return 'Администратор'
    default: return role
  }
}
