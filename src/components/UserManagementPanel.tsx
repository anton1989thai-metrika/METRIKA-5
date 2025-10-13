"use client"

import { useState, useEffect } from "react"
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  AlertTriangle,
  Shield,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Search,
  Filter,
  Eye,
  EyeOff,
  Key,
  User,
  UserCheck,
  UserX,
  Settings,
  Lock,
  Unlock,
  Crown,
  Star,
  Clock,
  Activity,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Upload,
  FileText,
  BarChart,
  Home,
  Building,
  LandPlot,
  Store,
  Factory,
  Share,
  MessageCircle,
  Calculator,
  Play,
  QrCode,
  Info,
  Cloud,
  Zap,
  Image,
  Tag,
  Archive,
  Copy,
  Grid,
  List,
  Target,
  Layers,
  MapPin,
  Video,
  Music,
  Folder,
  Cog,
  Link,
  Link2,
  Unlink,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  HardDrive,
  Wifi,
  WifiOff,
  Signal,
  SignalZero,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Sun,
  Moon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'agent' | 'employee'
  status: 'active' | 'inactive' | 'pending'
  permissions: {
    canManageObjects: boolean
    canManageUsers: boolean
    canViewAnalytics: boolean
    canManageTasks: boolean
    canManageMedia: boolean
    canManageContent: boolean
    canManageSettings: boolean
  }
  lastLogin?: string
  createdAt: string
  avatar?: string
  phone?: string
  department?: string
  notes?: string
}

interface UserManagementPanelProps {
  onClose?: () => void
}

export default function UserManagementPanel({ onClose }: UserManagementPanelProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Антон Нехорошков',
      email: 'nekhoroshkov@metrika.direct',
      role: 'admin',
      status: 'active',
      permissions: {
        canManageObjects: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canManageTasks: true,
        canManageMedia: true,
        canManageContent: true,
        canManageSettings: true
      },
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-06-01T00:00:00Z',
      phone: '+7 (999) 123-45-67',
      department: 'Руководство',
      notes: 'Основатель компании'
    },
    {
      id: '2',
      name: 'Иван Сидоров',
      email: 'sidorov@metrika.direct',
      role: 'manager',
      status: 'active',
      permissions: {
        canManageObjects: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canManageTasks: true,
        canManageMedia: true,
        canManageContent: true,
        canManageSettings: false
      },
      lastLogin: '2024-01-15T09:15:00Z',
      createdAt: '2023-08-15T00:00:00Z',
      phone: '+7 (999) 234-56-78',
      department: 'Продажи',
      notes: 'Ведущий менеджер'
    },
    {
      id: '3',
      name: 'Анна Петрова',
      email: 'petrova@metrika.direct',
      role: 'agent',
      status: 'active',
      permissions: {
        canManageObjects: true,
        canManageUsers: false,
        canViewAnalytics: false,
        canManageTasks: true,
        canManageMedia: false,
        canManageContent: false,
        canManageSettings: false
      },
      lastLogin: '2024-01-15T08:45:00Z',
      createdAt: '2023-10-01T00:00:00Z',
      phone: '+7 (999) 345-67-89',
      department: 'Продажи',
      notes: 'Агент по недвижимости'
    },
    {
      id: '4',
      name: 'Мария Козлова',
      email: 'kozlova@metrika.direct',
      role: 'employee',
      status: 'active',
      permissions: {
        canManageObjects: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canManageTasks: false,
        canManageMedia: false,
        canManageContent: false,
        canManageSettings: false
      },
      lastLogin: '2024-01-14T17:30:00Z',
      createdAt: '2023-12-01T00:00:00Z',
      phone: '+7 (999) 456-78-90',
      department: 'Администрация',
      notes: 'Секретарь'
    }
  ])

  const [activeTab, setActiveTab] = useState('list')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'lastLogin' | 'createdAt'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Новый пользователь
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'employee',
    status: 'pending',
    permissions: {
      canManageObjects: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: false,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    phone: '',
    department: '',
    notes: ''
  })

  // Фильтрация и сортировка
  const filteredUsers = users
    .filter(user => {
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filterRole !== 'all' && user.role !== filterRole) return false
      if (filterStatus !== 'all' && user.status !== filterStatus) return false
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'role':
          comparison = a.role.localeCompare(b.role)
          break
        case 'lastLogin':
          comparison = new Date(a.lastLogin || 0).getTime() - new Date(b.lastLogin || 0).getTime()
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Создание пользователя
  const createUser = () => {
    if (!newUser.name || !newUser.email) return

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || 'employee',
      status: newUser.status || 'pending',
      permissions: newUser.permissions || {
        canManageObjects: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canManageTasks: false,
        canManageMedia: false,
        canManageContent: false,
        canManageSettings: false
      },
      createdAt: new Date().toISOString(),
      phone: newUser.phone,
      department: newUser.department,
      notes: newUser.notes
    }

    setUsers(prev => [...prev, user])
    setNewUser({
      name: '',
      email: '',
      role: 'employee',
      status: 'pending',
      permissions: {
        canManageObjects: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canManageTasks: false,
        canManageMedia: false,
        canManageContent: false,
        canManageSettings: false
      },
      phone: '',
      department: '',
      notes: ''
    })
    setIsCreatingUser(false)
  }

  // Обновление пользователя
  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ))
    setIsEditingUser(false)
    setSelectedUser(null)
  }

  // Удаление пользователя
  const deleteUser = (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
    }
  }

  // Переключение статуса
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  // Обновление прав
  const updatePermission = (userId: string, permission: keyof User['permissions'], value: boolean) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            permissions: { ...user.permissions, [permission]: value }
          }
        : user
    ))
  }

  // Получение иконки роли
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-purple-600" />
      case 'manager': return <Star className="w-4 h-4 text-blue-600" />
      case 'agent': return <User className="w-4 h-4 text-green-600" />
      case 'employee': return <UserCheck className="w-4 h-4 text-gray-600" />
      default: return <User className="w-4 h-4 text-gray-600" />
    }
  }

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Управление пользователями</h2>
          <p className="text-gray-600">Управление пользователями и их правами доступа</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Всего: {users.length} • Активных: {users.filter(u => u.status === 'active').length}
          </div>
          <button
            onClick={() => setIsCreatingUser(true)}
            className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Добавить пользователя
          </button>
        </div>
      </div>

      {/* Навигация по вкладкам */}
      <div className="flex border-b border-gray-300">
        {[
          { id: 'list', label: 'Список пользователей', icon: Users },
          { id: 'permissions', label: 'Права доступа', icon: Shield },
          { id: 'activity', label: 'Активность', icon: Activity },
          { id: 'settings', label: 'Настройки', icon: Settings }
        ].map(tab => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Содержимое вкладок */}
      <div className="space-y-6">
        {/* Список пользователей */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Фильтры и поиск */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
              >
                <option value="all">Все роли</option>
                <option value="admin">Администратор</option>
                <option value="manager">Менеджер</option>
                <option value="agent">Агент</option>
                <option value="employee">Сотрудник</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
                <option value="pending">Ожидают</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
              >
                <option value="name">По имени</option>
                <option value="role">По роли</option>
                <option value="lastLogin">По последнему входу</option>
                <option value="createdAt">По дате создания</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Таблица пользователей */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Пользователь</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Роль</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статус</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Последний вход</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Права</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-black">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className="text-sm font-medium text-black capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Активен' :
                           user.status === 'inactive' ? 'Неактивен' : 'Ожидает'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Никогда'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          {user.permissions.canManageObjects && <div className="w-2 h-2 bg-blue-500 rounded-full" title="Может управлять объектами"></div>}
                          {user.permissions.canManageUsers && <div className="w-2 h-2 bg-purple-500 rounded-full" title="Может управлять пользователями"></div>}
                          {user.permissions.canViewAnalytics && <div className="w-2 h-2 bg-orange-500 rounded-full" title="Может просматривать аналитику"></div>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditingUser(true)
                            }}
                            className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                          >
                            <Edit className="w-4 h-4 inline mr-1" />
                            Редактировать
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-3 py-1 rounded text-sm transition-all ${
                              user.status === 'active' 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Деактивировать' : 'Активировать'}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-all"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Права доступа */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Управление правами доступа</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map(user => (
                <div key={user.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-black">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-black">Права доступа:</h4>
                    
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canManageObjects}
                          onChange={(e) => updatePermission(user.id, 'canManageObjects', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может управлять объектами</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canManageUsers}
                          onChange={(e) => updatePermission(user.id, 'canManageUsers', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может управлять пользователями</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canViewAnalytics}
                          onChange={(e) => updatePermission(user.id, 'canViewAnalytics', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может просматривать аналитику</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canManageTasks}
                          onChange={(e) => updatePermission(user.id, 'canManageTasks', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может управлять задачами</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canManageMedia}
                          onChange={(e) => updatePermission(user.id, 'canManageMedia', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может управлять медиа</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canManageContent}
                          onChange={(e) => updatePermission(user.id, 'canManageContent', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может управлять контентом</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.permissions.canManageSettings}
                          onChange={(e) => updatePermission(user.id, 'canManageSettings', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Может управлять настройками</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Активность */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Активность пользователей</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Активных сегодня</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.status === 'active').length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </div>


              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Администраторов</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'admin').length}</p>
                  </div>
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ожидают активации</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.status === 'pending').length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
              <h4 className="font-medium text-black mb-4">Последняя активность</h4>
              <div className="space-y-3">
                {users
                  .filter(u => u.lastLogin)
                  .sort((a, b) => new Date(b.lastLogin || 0).getTime() - new Date(a.lastLogin || 0).getTime())
                  .slice(0, 5)
                  .map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Никогда'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Настройки */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Настройки системы пользователей</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4">Безопасность</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Требовать подтверждение email</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Двухфакторная аутентификация</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Автоматическая блокировка при подозрительной активности</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Уведомления о входе в систему</span>
                  </label>
                </div>
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4">Права по умолчанию</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Новые пользователи могут управлять объектами</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Новые пользователи могут просматривать аналитику</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Новые пользователи могут управлять задачами</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно создания пользователя */}
      {isCreatingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h3 className="text-xl font-semibold text-black">Добавить пользователя</h3>
              <button
                onClick={() => setIsCreatingUser(false)}
                className="p-1 text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Имя</label>
                  <input
                    type="text"
                    value={newUser.name || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Введите имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="user@metrika.direct"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Роль</label>
                  <select
                    value={newUser.role || 'employee'}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="employee">Сотрудник</option>
                    <option value="agent">Агент</option>
                    <option value="manager">Менеджер</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={newUser.phone || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Отдел</label>
                  <input
                    type="text"
                    value={newUser.department || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Продажи"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Статус</label>
                  <select
                    value={newUser.status || 'pending'}
                    onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="pending">Ожидает активации</option>
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Примечания</label>
                <textarea
                  value={newUser.notes || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  rows={3}
                  placeholder="Дополнительная информация о пользователе..."
                />
              </div>

              <div>
                <h4 className="font-medium text-black mb-3">Права доступа:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUser.permissions?.canManageObjects || false}
                      onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions!, canManageObjects: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Управлять объектами</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUser.permissions?.canManageUsers || false}
                      onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions!, canManageUsers: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Управлять пользователями</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUser.permissions?.canViewAnalytics || false}
                      onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions!, canViewAnalytics: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Просматривать аналитику</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-300 bg-gray-50">
              <button
                onClick={() => setIsCreatingUser(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Отмена
              </button>
              <button
                onClick={createUser}
                className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Создать пользователя
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования пользователя */}
      {isEditingUser && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h3 className="text-xl font-semibold text-black">Редактировать пользователя</h3>
              <button
                onClick={() => {
                  setIsEditingUser(false)
                  setSelectedUser(null)
                }}
                className="p-1 text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Имя</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Роль</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, role: e.target.value as any } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="employee">Сотрудник</option>
                    <option value="agent">Агент</option>
                    <option value="manager">Менеджер</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Статус</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="pending">Ожидает активации</option>
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-black mb-3">Права доступа:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageObjects}
                      onChange={(e) => setSelectedUser(prev => prev ? {
                        ...prev,
                        permissions: { ...prev.permissions, canManageObjects: e.target.checked }
                      } : null)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Управлять объектами</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageUsers}
                      onChange={(e) => setSelectedUser(prev => prev ? {
                        ...prev,
                        permissions: { ...prev.permissions, canManageUsers: e.target.checked }
                      } : null)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Управлять пользователями</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canViewAnalytics}
                      onChange={(e) => setSelectedUser(prev => prev ? {
                        ...prev,
                        permissions: { ...prev.permissions, canViewAnalytics: e.target.checked }
                      } : null)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Просматривать аналитику</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-300 bg-gray-50">
              <button
                onClick={() => {
                  setIsEditingUser(false)
                  setSelectedUser(null)
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => updateUser(selectedUser.id, selectedUser)}
                className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                <Save className="w-4 h-4 inline mr-2" />
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
