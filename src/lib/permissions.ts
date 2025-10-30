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

// Авторизация отключена - все разделы доступны всем
export const hasPermission = (user: User | null, section: string): boolean => {
  return true; // Все могут видеть всё
}

// Авторизация отключена - все разделы доступны всем
export const getAvailableSections = (user: User | null): string[] => {
  // Все разделы доступны всем
  return ['home', 'objects', 'map', 'about', 'contacts', 'blog', 'profile', 'my-objects', 'email', 'academy', 'knowledge-base', 'tasks', 'admin']
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

// Функция для проверки прав с учетом localStorage (для использования в UI)
export const arePermissionsStandardWithLocalStorage = (user: User | null): boolean => {
  if (!user) {
    return true
  }

  // Получаем сохраненные индивидуальные разрешения из localStorage
  const userPermissionsKey = `userPermissions_${user.id}`;
  const savedPermissions = localStorage.getItem(userPermissionsKey);
  
  let individualPermissions = user.detailedPermissions;
  if (savedPermissions) {
    try {
      individualPermissions = JSON.parse(savedPermissions);
    } catch (error) {
      console.error('Ошибка загрузки индивидуальных разрешений:', error);
    }
  }

  // Если нет индивидуальных разрешений, права стандартные
  if (!individualPermissions) {
    return true
  }

  const rolePermissions = getRolePermissions(user.role)
  
  // Проверяем каждое разрешение
  const sections = ['profile', 'my-objects', 'email', 'academy', 'knowledge-base', 'tasks', 'admin']
  
  for (const section of sections) {
    const roleHasAccess = rolePermissions[section]
    let individualHasAccess = false
    
    switch (section) {
      case 'profile':
        individualHasAccess = individualPermissions.personalCabinet?.enabled ?? false
        break
      case 'my-objects':
        individualHasAccess = individualPermissions.myObjects?.enabled ?? false
        break
      case 'email':
        individualHasAccess = individualPermissions.email?.enabled ?? false
        break
      case 'academy':
        individualHasAccess = individualPermissions.academy?.enabled ?? false
        break
      case 'knowledge-base':
        individualHasAccess = individualPermissions.knowledgeBase?.enabled ?? false
        break
      case 'tasks':
        individualHasAccess = individualPermissions.taskManager?.enabled ?? false
        break
      case 'admin':
        individualHasAccess = individualPermissions.adminPanel?.enabled ?? false
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
