export type PermissionSection =
  | 'profile'
  | 'my-objects'
  | 'email'
  | 'academy'
  | 'knowledge-base'
  | 'tasks'
  | 'admin'

export type UiRole =
  | 'site-user'
  | 'client'
  | 'foreign-employee'
  | 'freelancer'
  | 'employee'
  | 'manager'
  | 'admin'

export function prismaRoleToUiRole(role: string): UiRole {
  if (role === 'site_user') return 'site-user'
  if (role === 'foreign_employee') return 'foreign-employee'
  return toUiRole(role)
}

export function toUiRole(role: string): UiRole {
  if (
    role === 'admin' ||
    role === 'manager' ||
    role === 'employee' ||
    role === 'site-user' ||
    role === 'client' ||
    role === 'foreign-employee' ||
    role === 'freelancer'
  )
    return role
  return 'site-user'
}

export function getRolePermissions(role: UiRole): Record<PermissionSection, boolean> {
  const permissions: Record<PermissionSection, boolean> = {
    profile: false,
    'my-objects': false,
    email: false,
    academy: false,
    'knowledge-base': false,
    tasks: false,
    admin: false,
  }

  switch (role) {
    case 'site-user':
      permissions.profile = true
      break
    case 'client':
      permissions.profile = true
      permissions['my-objects'] = true
      break
    case 'foreign-employee':
    case 'freelancer':
      permissions.profile = true
      permissions['my-objects'] = true
      permissions.email = true
      break
    case 'employee':
      permissions.profile = true
      permissions['my-objects'] = true
      permissions.email = true
      permissions.academy = true
      permissions['knowledge-base'] = true
      permissions.tasks = true
      break
    case 'manager':
      permissions.profile = true
      permissions['my-objects'] = true
      permissions.email = true
      permissions.academy = true
      permissions['knowledge-base'] = true
      permissions.tasks = true
      permissions.admin = true
      break
    case 'admin':
      Object.keys(permissions).forEach((key) => {
        permissions[key as PermissionSection] = true
      })
      break
  }

  return permissions
}

type DetailedPermissions = any

export function getSectionEnabledFromDetailed(
  detailedPermissions: DetailedPermissions | null | undefined,
  section: PermissionSection
): boolean | undefined {
  if (!detailedPermissions) return undefined

  switch (section) {
    case 'profile':
      return detailedPermissions.personalCabinet?.enabled
    case 'my-objects':
      return detailedPermissions.myObjects?.enabled
    case 'email':
      return detailedPermissions.email?.enabled
    case 'academy':
      return detailedPermissions.academy?.enabled
    case 'knowledge-base':
      return detailedPermissions.knowledgeBase?.enabled
    case 'tasks':
      return detailedPermissions.taskManager?.enabled
    case 'admin':
      return detailedPermissions.adminPanel?.enabled
    default:
      return undefined
  }
}

export function hasSectionAccess(
  user: { role: string; detailedPermissions?: DetailedPermissions | null } | null | undefined,
  section: PermissionSection
): boolean {
  if (!user) return false

  const uiRole = prismaRoleToUiRole(String(user.role || ''))
  if (uiRole === 'admin') return true

  const base = getRolePermissions(uiRole)[section]
  const override = getSectionEnabledFromDetailed(user.detailedPermissions, section)
  return typeof override === 'boolean' ? override : base
}

