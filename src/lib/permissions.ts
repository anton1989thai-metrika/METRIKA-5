import {
  PermissionSection,
  getRolePermissions,
  getSectionEnabledFromDetailed,
  hasSectionAccess,
  prismaRoleToUiRole,
} from '@/lib/permissions-core'

type UserLike = {
  id?: string
  role?: string
  detailedPermissions?: unknown
}

const PERMISSION_SECTIONS: PermissionSection[] = [
  'profile',
  'my-objects',
  'email',
  'academy',
  'knowledge-base',
  'tasks',
  'admin',
]

const PERMISSIONS_MODE =
  (process.env.NEXT_PUBLIC_PERMISSIONS_MODE || 'open').toLowerCase()

function isPermissionsOpen() {
  return PERMISSIONS_MODE === 'open' || PERMISSIONS_MODE === 'disabled'
}

function isPermissionSection(section: string): section is PermissionSection {
  return PERMISSION_SECTIONS.includes(section as PermissionSection)
}

export const hasPermission = (user: UserLike | null, section: string): boolean => {
  if (!isPermissionSection(section)) return true
  if (isPermissionsOpen()) return true
  return hasSectionAccess(user, section)
}


// Функция для проверки прав с учетом localStorage (для использования в UI)
export const arePermissionsStandardWithLocalStorage = (user: UserLike | null): boolean => {
  if (!user) {
    return true
  }

  // Получаем сохраненные индивидуальные разрешения из localStorage
  const userPermissionsKey = `userPermissions_${user.id ?? 'unknown'}`
  const savedPermissions = localStorage.getItem(userPermissionsKey)
  
  let individualPermissions = user.detailedPermissions
  if (savedPermissions) {
    try {
      individualPermissions = JSON.parse(savedPermissions)
    } catch (error) {
      console.error('Ошибка загрузки индивидуальных разрешений:', error)
    }
  }

  // Если нет индивидуальных разрешений, права стандартные
  if (!individualPermissions) {
    return true
  }

  const rolePermissions = getRolePermissions(prismaRoleToUiRole(String(user.role || '')))
  
  // Проверяем каждое разрешение
  for (const section of PERMISSION_SECTIONS) {
    const roleHasAccess = rolePermissions[section]
    const individualHasAccess =
      getSectionEnabledFromDetailed(individualPermissions, section) ?? false
    
    // Если права отличаются, то они нестандартные
    if (roleHasAccess !== individualHasAccess) {
      return false
    }
  }
  
  return true // Все права совпадают
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
