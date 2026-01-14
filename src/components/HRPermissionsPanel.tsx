"use client"

import { useState } from "react"
import {
  BarChart3,
  Clock,
  DollarSign,
  Edit,
  Key,
  Plus,
  Receipt,
  Save,
  Settings,
  Shield,
  Trash2,
  User,
  UserCheck,
  UserX,
  Users,
  X
} from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  module: string
  isEnabled: boolean
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  userCount: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string
  permissions: string[]
}

export default function HRPermissionsPanel() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Mock данные для ролей
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Администратор',
      description: 'Полный доступ ко всем функциям системы',
      permissions: ['all'],
      isSystem: true,
      userCount: 2
    },
    {
      id: '2',
      name: 'HR Менеджер',
      description: 'Управление кадрами и зарплатами',
      permissions: ['hr_view', 'hr_edit', 'salary_view', 'salary_edit', 'time_view', 'time_edit'],
      isSystem: false,
      userCount: 3
    },
    {
      id: '3',
      name: 'Бухгалтер',
      description: 'Финансовый учёт и отчётность',
      permissions: ['salary_view', 'salary_edit', 'cash_view', 'cash_edit', 'reports_view'],
      isSystem: false,
      userCount: 2
    },
    {
      id: '4',
      name: 'Менеджер',
      description: 'Просмотр данных и создание отчётов',
      permissions: ['hr_view', 'salary_view', 'time_view', 'reports_view'],
      isSystem: false,
      userCount: 5
    },
    {
      id: '5',
      name: 'Сотрудник',
      description: 'Просмотр собственных данных',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own'],
      isSystem: false,
      userCount: 8
    }
  ])

  // Mock данные для пользователей
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Нехорошков Антон',
      email: 'nekhoroshkov@metrika.direct',
      role: 'Администратор',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Сникфайкер',
      email: 'snikfayker@metrika.direct',
      role: 'HR Менеджер',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      permissions: ['hr_view', 'hr_edit', 'salary_view', 'salary_edit', 'time_view', 'time_edit']
    },
    {
      id: '3',
      name: 'Маслова Ирина',
      email: 'maslova@metrika.direct',
      role: 'Агент',
      status: 'active',
      lastLogin: '2024-01-15T08:45:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '4',
      name: 'Ионин Владислав',
      email: 'ionin@metrika.direct',
      role: 'Агент',
      status: 'active',
      lastLogin: '2024-01-15T08:30:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '5',
      name: 'Андрей Широких',
      email: 'shirokikh@metrika.direct',
      role: 'Агент',
      status: 'active',
      lastLogin: '2024-01-15T08:15:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '6',
      name: 'Бердник Вадим',
      email: 'berdnik@metrika.direct',
      role: 'Агент',
      status: 'active',
      lastLogin: '2024-01-15T08:00:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '7',
      name: 'Дерик Олег',
      email: 'derik@metrika.direct',
      role: 'Агент',
      status: 'active',
      lastLogin: '2024-01-15T07:45:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '8',
      name: 'Кан Татьяна',
      email: 'kan@metrika.direct',
      role: 'Сотрудник',
      status: 'active',
      lastLogin: '2024-01-14T17:30:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '9',
      name: 'Поврезнюк Мария',
      email: 'povreznyuk@metrika.direct',
      role: 'Сотрудник',
      status: 'active',
      lastLogin: '2024-01-14T17:15:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '10',
      name: 'Стулина Елена',
      email: 'stulina@metrika.direct',
      role: 'Сотрудник',
      status: 'active',
      lastLogin: '2024-01-14T17:00:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    },
    {
      id: '11',
      name: 'Тамбовцева Екатерина',
      email: 'tambovtseva@metrika.direct',
      role: 'Сотрудник',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      permissions: ['profile_view', 'salary_view_own', 'time_view_own']
    }
  ])

  // Mock данные для разрешений
  const permissions: Permission[] = [
    // HR модуль
    { id: 'hr_view', name: 'Просмотр кадров', description: 'Просмотр списка сотрудников', category: 'HR', module: 'hr', isEnabled: true },
    { id: 'hr_edit', name: 'Редактирование кадров', description: 'Создание и редактирование сотрудников', category: 'HR', module: 'hr', isEnabled: true },
    { id: 'hr_delete', name: 'Удаление кадров', description: 'Удаление сотрудников', category: 'HR', module: 'hr', isEnabled: true },
    
    // Зарплата
    { id: 'salary_view', name: 'Просмотр зарплат', description: 'Просмотр зарплатных данных', category: 'Зарплата', module: 'salary', isEnabled: true },
    { id: 'salary_edit', name: 'Редактирование зарплат', description: 'Расчёт и корректировка зарплат', category: 'Зарплата', module: 'salary', isEnabled: true },
    { id: 'salary_view_own', name: 'Просмотр своей зарплаты', description: 'Просмотр собственной зарплаты', category: 'Зарплата', module: 'salary', isEnabled: true },
    
    // Рабочее время
    { id: 'time_view', name: 'Просмотр времени', description: 'Просмотр рабочего времени всех сотрудников', category: 'Время', module: 'time', isEnabled: true },
    { id: 'time_edit', name: 'Редактирование времени', description: 'Корректировка рабочего времени', category: 'Время', module: 'time', isEnabled: true },
    { id: 'time_view_own', name: 'Просмотр своего времени', description: 'Просмотр собственного рабочего времени', category: 'Время', module: 'time', isEnabled: true },
    
    // Касса
    { id: 'cash_view', name: 'Просмотр кассы', description: 'Просмотр операций кассы', category: 'Касса', module: 'cash', isEnabled: true },
    { id: 'cash_edit', name: 'Редактирование кассы', description: 'Добавление и редактирование операций', category: 'Касса', module: 'cash', isEnabled: true },
    
    // Отчёты
    { id: 'reports_view', name: 'Просмотр отчётов', description: 'Просмотр и создание отчётов', category: 'Отчёты', module: 'reports', isEnabled: true },
    { id: 'reports_export', name: 'Экспорт отчётов', description: 'Экспорт данных в различные форматы', category: 'Отчёты', module: 'reports', isEnabled: true },
    
    // Профиль
    { id: 'profile_view', name: 'Просмотр профиля', description: 'Просмотр собственного профиля', category: 'Профиль', module: 'profile', isEnabled: true },
    { id: 'profile_edit', name: 'Редактирование профиля', description: 'Редактирование собственного профиля', category: 'Профиль', module: 'profile', isEnabled: true },
    
    // Администрирование
    { id: 'admin_users', name: 'Управление пользователями', description: 'Создание и редактирование пользователей', category: 'Админ', module: 'admin', isEnabled: true },
    { id: 'admin_roles', name: 'Управление ролями', description: 'Создание и редактирование ролей', category: 'Админ', module: 'admin', isEnabled: true },
    { id: 'admin_settings', name: 'Настройки системы', description: 'Изменение системных настроек', category: 'Админ', module: 'admin', isEnabled: true },
    
    // Полный доступ
    { id: 'all', name: 'Полный доступ', description: 'Доступ ко всем функциям системы', category: 'Система', module: 'system', isEnabled: true }
  ]

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  })

  const resetRoleForm = () => {
    setNewRole({ name: '', description: '', permissions: [] })
    setEditingRole(null)
  }

  const closeRoleModal = () => {
    setShowRoleModal(false)
    resetRoleForm()
  }

  const resetUserForm = () => {
    setNewUser({ name: '', email: '', role: '', permissions: [] })
    setEditingUser(null)
  }

  const closeUserModal = () => {
    setShowUserModal(false)
    resetUserForm()
  }

  const openCreateRoleModal = () => {
    resetRoleForm()
    setShowRoleModal(true)
  }

  const openCreateUserModal = () => {
    resetUserForm()
    setShowUserModal(true)
  }

  const startEditRole = (role: Role) => {
    setEditingRole(role)
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    })
    setShowRoleModal(true)
  }

  const startEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: [...user.permissions],
    })
    setShowUserModal(true)
  }

  const createRole = () => {
    if (!newRole.name || !newRole.description) return

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      isSystem: false,
      userCount: 0
    }

    setRoles(prev => [...prev, role])
    closeRoleModal()
  }

  const updateRole = () => {
    if (!editingRole) return

    setRoles(prev => prev.map(role => 
      role.id === editingRole.id
        ? { ...role, name: newRole.name, description: newRole.description, permissions: [...newRole.permissions] }
        : role
    ))
    closeRoleModal()
  }

  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId))
  }

  const createUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      permissions: newUser.permissions
    }

    setUsers(prev => [...prev, user])
    closeUserModal()
  }

  const updateUser = () => {
    if (!editingUser) return

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id
        ? { ...user, name: newUser.name, email: newUser.email, role: newUser.role, permissions: [...newUser.permissions] }
        : user
    ))
    closeUserModal()
  }

  const handleSaveRole = () => {
    if (editingRole) {
      updateRole()
      return
    }
    createRole()
  }

  const handleSaveUser = () => {
    if (editingUser) {
      updateUser()
      return
    }
    createUser()
  }

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const getPermissionIcon = (module: string) => {
    switch (module) {
      case 'hr':
        return <Users className="w-4 h-4 text-gray-600" />
      case 'salary':
        return <DollarSign className="w-4 h-4 text-gray-600" />
      case 'time':
        return <Clock className="w-4 h-4 text-gray-600" />
      case 'cash':
        return <Receipt className="w-4 h-4 text-indigo-600" />
      case 'reports':
        return <BarChart3 className="w-4 h-4 text-gray-600" />
      case 'profile':
        return <User className="w-4 h-4 text-gray-600" />
      case 'admin':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'system':
        return <Shield className="w-4 h-4 text-yellow-600" />
      default:
        return <Key className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gray-100 text-gray-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Только что'
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} дн назад`
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Права доступа</h2>
        <div className="flex space-x-2">
          <button
            onClick={openCreateRoleModal}
            className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Создать роль
          </button>
          <button
            onClick={openCreateUserModal}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <UserCheck className="w-4 h-4 inline mr-2" />
            Добавить пользователя
          </button>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'roles' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Роли
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'users' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Пользователи
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'permissions' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Key className="w-4 h-4 inline mr-2" />
          Разрешения
        </button>
      </div>

      {/* Роли */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {roles.map(role => (
            <div key={role.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{role.name}</h3>
                      {role.isSystem && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          Системная
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {role.userCount} пользователей
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{role.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Разрешения:</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map(permissionId => {
                          const permission = permissions.find(p => p.id === permissionId)
                          return permission ? (
                            <span key={permissionId} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {getPermissionIcon(permission.module)}
                              <span className="ml-1">{permission.name}</span>
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditRole(role)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit className="w-3 h-3 inline mr-1" />
                    Редактировать
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => deleteRole(role.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" />
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пользователи */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{user.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Активен' :
                         user.status === 'inactive' ? 'Неактивен' : 'Заблокирован'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {user.role}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div><strong>Email:</strong> {user.email}</div>
                      {user.lastLogin && (
                        <div><strong>Последний вход:</strong> {formatTimeAgo(user.lastLogin)}</div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Разрешения:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map(permissionId => {
                          const permission = permissions.find(p => p.id === permissionId)
                          return permission ? (
                            <span key={permissionId} className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                              {getPermissionIcon(permission.module)}
                              <span className="ml-1">{permission.name}</span>
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      user.status === 'active' 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {user.status === 'active' ? (
                      <>
                        <UserX className="w-3 h-3 inline mr-1" />
                        Заблокировать
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3 inline mr-1" />
                        Активировать
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => startEditUser(user)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit className="w-3 h-3 inline mr-1" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Разрешения */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {Object.entries(
            permissions.reduce((acc, permission) => {
              const category = permission.category
              if (!acc[category]) acc[category] = []
              acc[category].push(permission)
              return acc
            }, {} as Record<string, Permission[]>)
          ).map(([category, categoryPermissions]) => (
            <div key={category} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPermissions.map((permission: Permission) => (
                  <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      {getPermissionIcon(permission.module)}
                      <h4 className="font-semibold text-black">{permission.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{permission.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{permission.module}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        permission.isEnabled ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {permission.isEnabled ? 'Включено' : 'Отключено'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно создания роли */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">
                {editingRole ? 'Редактировать роль' : 'Создать роль'}
              </h3>
              <button
                onClick={closeRoleModal}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название роли
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите название роли"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Описание роли"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Разрешения
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {permissions.map(permission => (
                    <label key={permission.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRole(prev => ({ ...prev, permissions: [...prev.permissions, permission.id] }))
                          } else {
                            setNewRole(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission.id) }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeRoleModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveRole}
                disabled={!newRole.name || !newRole.description}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {editingRole ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания пользователя */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">
                {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
              </h3>
              <button
                onClick={closeUserModal}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Роль
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите роль</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeUserModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveUser}
                disabled={!newUser.name || !newUser.email || !newUser.role}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {editingUser ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
