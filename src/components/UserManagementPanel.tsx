"use client"

import { useState, useEffect } from "react"
import { User as UserType, RoleSettings } from '@/data/users'
import { arePermissionsStandardWithLocalStorage, getRoleDisplayName } from '@/lib/permissions'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  Download,
  Upload,
  RefreshCw,
  User,
  UserCheck,
  Crown,
  Star,
  Settings,
  Eye,
  EyeOff
} from "lucide-react"

interface UserManagementPanelProps {
  onClose?: () => void
}

export default function UserManagementPanel({ onClose }: UserManagementPanelProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('list')
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [isUserCardOpen, setIsUserCardOpen] = useState(false)
  const [selectedUserForCard, setSelectedUserForCard] = useState<UserType | null>(null)
  
  // Глобальное состояние для настроек ролей
  const [roleSettings, setRoleSettings] = useState<Record<string, RoleSettings>>({
    'site-user': {
      'profile': true,
      'my-objects': false,
      'email': false,
      'academy': false,
      'knowledge-base': false,
      'tasks': false,
      'admin': false,
      'hide-in-tasks': true
    },
    'client': {
      'profile': true,
      'my-objects': true,
      'email': false,
      'academy': false,
      'knowledge-base': false,
      'tasks': false,
      'admin': false,
      'hide-in-tasks': false
    },
    'foreign-employee': {
      'profile': true,
      'my-objects': true,
      'email': true,
      'academy': false,
      'knowledge-base': false,
      'tasks': false,
      'admin': false,
      'hide-in-tasks': false
    },
    'freelancer': {
      'profile': true,
      'my-objects': true,
      'email': true,
      'academy': false,
      'knowledge-base': false,
      'tasks': false,
      'admin': false,
      'hide-in-tasks': false
    },
    'employee': {
      'profile': true,
      'my-objects': true,
      'email': true,
      'academy': true,
      'knowledge-base': true,
      'tasks': true,
      'admin': false,
      'hide-in-tasks': false
    },
    'manager': {
      'profile': true,
      'my-objects': true,
      'email': true,
      'academy': true,
      'knowledge-base': true,
      'tasks': true,
      'admin': true,
      'hide-in-tasks': false
    },
    'admin': {
      'profile': true,
      'my-objects': true,
      'email': true,
      'academy': true,
      'knowledge-base': true,
      'tasks': true,
      'admin': true,
      'hide-in-tasks': false
    }
  });
  
  // Состояние для модального окна редактирования роли
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [rolePermissions, setRolePermissions] = useState<RoleSettings>({
    'profile': false,
    'my-objects': false,
    'email': false,
    'academy': false,
    'knowledge-base': false,
    'tasks': false,
    'admin': false,
    'hide-in-tasks': false
  })
  
  // Состояние для модального окна подтверждения удаления роли
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)
  
  // Состояние для модального окна индивидуальных разрешений
  const [isIndividualPermissionsModalOpen, setIsIndividualPermissionsModalOpen] = useState(false)
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<UserType | null>(null)
  const [individualPermissions, setIndividualPermissions] = useState<any>(null)
  
  // Состояние для фильтра задач
  const [hiddenTasksFilter, setHiddenTasksFilter] = useState<{
    users: string[],
    roles: ('executor' | 'curator')[]
  }>({
    users: [],
    roles: []
  })
  
  // Состояние для отслеживания нажатий кнопок
  const [isRoleButtonPressed, setIsRoleButtonPressed] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'lastLogin' | 'createdAt'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Состояние для нового пользователя
  const [newUser, setNewUser] = useState<Partial<UserType>>({
    name: '',
    email: '',
    login: '',
    password: '',
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
    dateOfBirth: '',
    phoneWork: '',
    phonePersonal: '',
    address: '',
    userObjects: [],
    comments: ''
  })

  // Загрузка пользователей при инициализации
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await response.json();
        setUsers(usersData);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error fetching users:', error);
        // Загружаем дефолтных пользователей из файла
        const defaultUsers = await import('@/data/users').then(m => m.defaultUsers);
        setUsers(defaultUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUsers();
    
    // Загружаем сохраненные настройки ролей из localStorage
    const savedRoleSettings = localStorage.getItem('roleSettings');
    if (savedRoleSettings) {
      try {
        const parsedSettings = JSON.parse(savedRoleSettings);
        setRoleSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Ошибка загрузки настроек ролей:', error);
      }
    }
  }, []);

  // Синхронизация пользователей с сервером
  const syncUsersWithServer = async (updatedUsers: UserType[]) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUsers),
      });

      if (!response.ok) {
        throw new Error('Failed to sync users');
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error syncing users:', error);
    }
  };

  // Создание пользователя
  const createUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Пожалуйста, заполните обязательные поля: Имя и Email');
      return;
    }

    // Проверка уникальности email
    if (users.some(user => user.email === newUser.email)) {
      alert('Пользователь с таким email уже существует');
      return;
    }

    // Проверка уникальности логина
    if (newUser.login && users.some(user => user.login === newUser.login)) {
      alert('Пользователь с таким логином уже существует');
      return;
    }

    const user: UserType = {
      id: Date.now().toString(),
      name: newUser.name!,
      email: newUser.email!,
      login: newUser.login || '',
      password: newUser.password || '',
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
      detailedPermissions: {
        personalCabinet: { enabled: true },
        myObjects: { enabled: false },
        email: { 
          enabled: false,
          viewMail: false,
          sendEmails: false,
          manageMailboxes: false,
          mailSettings: false
        },
        academy: { 
          enabled: false,
          dashboard: false,
          courses: false,
          tests: false,
          achievements: false,
          materials: false
        },
        knowledgeBase: { enabled: false },
        taskManager: { 
          enabled: false,
          viewTasks: false,
          createTasks: false,
          assignExecutors: false,
          closeTasks: false,
          editTasks: false,
          changeExecutors: false,
          changeCurators: false,
          editSubtasks: false,
          editChecklists: false,
          viewOtherUsersTasks: false
        },
        adminPanel: { 
          enabled: false,
          dashboard: false,
          email: false,
          content: false,
          objects: false,
          users: false,
          tasks: false,
          media: false,
          hr: false,
          analytics: false,
          settings: false
        },
        otherPermissions: {
          enabled: false,
          canChangeExecutorInOwnTasks: false,
          canChangeCuratorInOwnTasks: false,
          cannotEditTasksFrom: [],
          canCreateHiddenTasks: false,
          canViewHiddenTasks: false,
          hiddenTasksFrom: []
        }
      },
      lastLogin: undefined,
      createdAt: new Date().toISOString(),
      dateOfBirth: newUser.dateOfBirth || '',
      phoneWork: newUser.phoneWork || '',
      phonePersonal: newUser.phonePersonal || '',
      address: newUser.address || '',
      userObjects: newUser.userObjects || [],
      comments: newUser.comments || ''
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    await syncUsersWithServer(updatedUsers);
    setIsCreatingUser(false);
    resetToDefaults();
  }

  // Сброс формы к дефолтным значениям
  const resetToDefaults = () => {
    setNewUser({
      name: '',
      email: '',
      login: '',
      password: '',
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
      dateOfBirth: '',
      phoneWork: '',
      phonePersonal: '',
      address: '',
      userObjects: [],
      comments: ''
    })
  }

  // Обновление пользователя
  const updateUser = async (userId: string, updates: Partial<UserType>) => {
    // Проверка уникальности логина (исключая текущего пользователя)
    if (updates.login && users.some(user => user.login === updates.login && user.id !== userId)) {
      alert('Пользователь с таким логином уже существует');
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    await syncUsersWithServer(updatedUsers);
    setIsEditingUser(false);
    setSelectedUser(null);
  }

  // Удаление пользователя
  const deleteUser = async (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      await syncUsersWithServer(updatedUsers);
    }
  }

  // Переключение статуса
  const toggleUserStatus = async (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' as const : 'active' as const }
        : user
    );
    setUsers(updatedUsers);
    await syncUsersWithServer(updatedUsers);
  }

  // Функция для открытия модального окна редактирования роли
  const openRoleModal = (role: string) => {
    setSelectedRole(role)
    
    // Получаем сохраненные настройки роли или используем базовые
    const savedSettings: RoleSettings = roleSettings[role] || {
      'profile': false,
      'my-objects': false,
      'email': false,
      'academy': false,
      'knowledge-base': false,
      'tasks': false,
      'admin': false,
      'hide-in-tasks': false
    }
    
    setRolePermissions(savedSettings)
    setIsRoleModalOpen(true)
  }

  // Функция для сохранения изменений роли
  const saveRolePermissions = () => {
    if (!selectedRole) return;
    
    // Сохраняем настройки роли в глобальное состояние
    setRoleSettings(prev => ({
      ...prev,
      [selectedRole]: rolePermissions
    }));
    
    // Сохраняем в localStorage для персистентности
    const updatedRoleSettings = {
      ...roleSettings,
      [selectedRole]: rolePermissions
    };
    localStorage.setItem('roleSettings', JSON.stringify(updatedRoleSettings));
    
    console.log('Сохранение разрешений для роли:', selectedRole, rolePermissions)
    
    // В реальном приложении здесь была бы отправка на сервер
    // Разрешения сохранены
    
    setIsRoleModalOpen(false)
    setSelectedRole(null)
  }

  const openDeleteRoleModal = (role: string) => {
    setRoleToDelete(role)
    setIsDeleteRoleModalOpen(true)
  }

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      // TODO: Удалить роль
      console.log('Удаление роли:', roleToDelete)
      setIsDeleteRoleModalOpen(false)
      setRoleToDelete(null)
    }
  }

  const cancelDeleteRole = () => {
    setIsDeleteRoleModalOpen(false)
    setRoleToDelete(null)
  }

  // Функция для открытия модального окна индивидуальных разрешений
  const openIndividualPermissionsModal = (user: UserType) => {
    setSelectedUserForPermissions(user)
    
    // Пытаемся загрузить сохраненные индивидуальные разрешения из localStorage
    const userPermissionsKey = `userPermissions_${user.id}`;
    const savedPermissions = localStorage.getItem(userPermissionsKey);
    
    let initialPermissions;
    if (savedPermissions) {
      try {
        initialPermissions = JSON.parse(savedPermissions);
      } catch (error) {
        console.error('Ошибка загрузки индивидуальных разрешений:', error);
        initialPermissions = user.detailedPermissions || getDefaultPermissions();
      }
    } else {
      initialPermissions = user.detailedPermissions || getDefaultPermissions();
    }
    
    setIndividualPermissions(initialPermissions)
    setIsIndividualPermissionsModalOpen(true)
  }
  
  // Функция для получения дефолтных разрешений
  const getDefaultPermissions = () => {
    return {
      personalCabinet: { enabled: true },
      myObjects: { enabled: false },
      email: { 
        enabled: false,
        viewMail: false,
        sendEmails: false,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: { 
        enabled: false,
        dashboard: false,
        courses: false,
        tests: false,
        achievements: false,
        materials: false
      },
      knowledgeBase: { enabled: false },
      taskManager: { 
        enabled: false,
        viewTasks: false,
        createTasks: false,
        assignExecutors: false,
        closeTasks: false,
        editTasks: false,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: false,
        editChecklists: false,
        viewOtherUsersTasks: false
      },
      adminPanel: { 
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: false,
        canChangeExecutorInOwnTasks: false,
        canChangeCuratorInOwnTasks: false,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: false,
        canViewHiddenTasks: false,
        hiddenTasksFrom: []
      }
    }
  }

  // Функция для сохранения индивидуальных разрешений
  const saveIndividualPermissions = async () => {
    if (!selectedUserForPermissions || !individualPermissions) return

    const updatedUsers = users.map(user => 
      user.id === selectedUserForPermissions.id 
        ? { ...user, detailedPermissions: individualPermissions }
        : user
    )
    setUsers(updatedUsers)
    
    // Сохраняем индивидуальные разрешения в localStorage
    const userPermissionsKey = `userPermissions_${selectedUserForPermissions.id}`;
    localStorage.setItem(userPermissionsKey, JSON.stringify(individualPermissions));
    
    await syncUsersWithServer(updatedUsers)
    
    // Индивидуальные разрешения сохранены
    
    setIsIndividualPermissionsModalOpen(false)
    setSelectedUserForPermissions(null)
    setIndividualPermissions(null)
  }

  // Функция для сброса к ролевым разрешениям
  const resetToRolePermissions = () => {
    if (!selectedUserForPermissions) return

    // Получаем сохраненные настройки роли
    const roleSettingsForUser = roleSettings[selectedUserForPermissions.role] || {
      'profile': false,
      'my-objects': false,
      'email': false,
      'academy': false,
      'knowledge-base': false,
      'tasks': false,
      'admin': false,
      'hide-in-tasks': false
    }

    // Обновляем индивидуальные разрешения на основе сохраненных настроек роли
    setIndividualPermissions({
      personalCabinet: { enabled: roleSettingsForUser['profile'] },
      myObjects: { enabled: roleSettingsForUser['my-objects'] },
      email: { 
        enabled: roleSettingsForUser['email'],
        viewMail: roleSettingsForUser['email'],
        sendEmails: roleSettingsForUser['email'],
        manageMailboxes: roleSettingsForUser['email'],
        mailSettings: roleSettingsForUser['email']
      },
      academy: { 
        enabled: roleSettingsForUser['academy'],
        dashboard: roleSettingsForUser['academy'],
        courses: roleSettingsForUser['academy'],
        tests: roleSettingsForUser['academy'],
        achievements: roleSettingsForUser['academy'],
        materials: roleSettingsForUser['academy']
      },
      knowledgeBase: { enabled: roleSettingsForUser['knowledge-base'] },
      taskManager: { 
        enabled: roleSettingsForUser['tasks'],
        viewTasks: roleSettingsForUser['tasks'],
        createTasks: roleSettingsForUser['tasks'],
        assignExecutors: roleSettingsForUser['tasks'],
        closeTasks: roleSettingsForUser['tasks'],
        editTasks: roleSettingsForUser['tasks'],
        changeExecutors: roleSettingsForUser['tasks'],
        changeCurators: roleSettingsForUser['tasks'],
        editSubtasks: roleSettingsForUser['tasks'],
        editChecklists: roleSettingsForUser['tasks'],
        viewOtherUsersTasks: roleSettingsForUser['tasks']
      },
      adminPanel: { 
        enabled: roleSettingsForUser['admin'],
        dashboard: roleSettingsForUser['admin'],
        email: roleSettingsForUser['admin'],
        content: roleSettingsForUser['admin'],
        objects: roleSettingsForUser['admin'],
        users: roleSettingsForUser['admin'],
        tasks: roleSettingsForUser['admin'],
        media: roleSettingsForUser['admin'],
        hr: roleSettingsForUser['admin'],
        analytics: roleSettingsForUser['admin'],
        settings: roleSettingsForUser['admin']
      },
      otherPermissions: {
        enabled: false,
        canChangeExecutorInOwnTasks: false,
        canChangeCuratorInOwnTasks: false,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: false,
        canViewHiddenTasks: false,
        hiddenTasksFrom: []
      }
    })
    
    // Сохраняем сброшенные настройки в localStorage
    if (selectedUserForPermissions) {
      const userPermissionsKey = `userPermissions_${selectedUserForPermissions.id}`;
      localStorage.setItem(userPermissionsKey, JSON.stringify({
        personalCabinet: { enabled: roleSettingsForUser['profile'] },
        myObjects: { enabled: roleSettingsForUser['my-objects'] },
        email: { 
          enabled: roleSettingsForUser['email'],
          viewMail: roleSettingsForUser['email'],
          sendEmails: roleSettingsForUser['email'],
          manageMailboxes: roleSettingsForUser['email'],
          mailSettings: roleSettingsForUser['email']
        },
        academy: { 
          enabled: roleSettingsForUser['academy'],
          dashboard: roleSettingsForUser['academy'],
          courses: roleSettingsForUser['academy'],
          tests: roleSettingsForUser['academy'],
          achievements: roleSettingsForUser['academy'],
          materials: roleSettingsForUser['academy']
        },
        knowledgeBase: { enabled: roleSettingsForUser['knowledge-base'] },
        taskManager: { 
          enabled: roleSettingsForUser['tasks'],
          viewTasks: roleSettingsForUser['tasks'],
          createTasks: roleSettingsForUser['tasks'],
          assignExecutors: roleSettingsForUser['tasks'],
          closeTasks: roleSettingsForUser['tasks'],
          editTasks: roleSettingsForUser['tasks'],
          changeExecutors: roleSettingsForUser['tasks'],
          changeCurators: roleSettingsForUser['tasks'],
          editSubtasks: roleSettingsForUser['tasks'],
          editChecklists: roleSettingsForUser['tasks'],
          viewOtherUsersTasks: roleSettingsForUser['tasks']
        },
        adminPanel: { 
          enabled: roleSettingsForUser['admin'],
          dashboard: roleSettingsForUser['admin'],
          email: roleSettingsForUser['admin'],
          content: roleSettingsForUser['admin'],
          objects: roleSettingsForUser['admin'],
          users: roleSettingsForUser['admin'],
          tasks: roleSettingsForUser['admin'],
          media: roleSettingsForUser['admin'],
          hr: roleSettingsForUser['admin'],
          analytics: roleSettingsForUser['admin'],
          settings: roleSettingsForUser['admin']
        },
        otherPermissions: {
          enabled: false,
          canChangeExecutorInOwnTasks: false,
          canChangeCuratorInOwnTasks: false,
          cannotEditTasksFrom: [],
          canCreateHiddenTasks: false,
          canViewHiddenTasks: false,
          hiddenTasksFrom: []
        }
      }));
    }
    
    // Устанавливаем состояние нажатия кнопки
    setIsRoleButtonPressed(true)
    
    // Сбрасываем состояние через 2 секунды
    setTimeout(() => {
      setIsRoleButtonPressed(false)
    }, 2000)
    
    // Индивидуальные разрешения сброшены к ролевым
  }

  // Получение иконки роли
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-gray-600" />
      case 'manager': return <Star className="w-4 h-4 text-gray-600" />
      case 'employee': return <UserCheck className="w-4 h-4 text-gray-600" />
      case 'freelancer': return <User className="w-4 h-4 text-gray-600" />
      case 'foreign-employee': return <User className="w-4 h-4 text-gray-600" />
      case 'client': return <User className="w-4 h-4 text-gray-600" />
      case 'site-user': return <User className="w-4 h-4 text-gray-600" />
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
          const aLogin = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
          const bLogin = b.lastLogin ? new Date(b.lastLogin).getTime() : 0
          comparison = aLogin - bLogin
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Загрузка пользователей...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Управление пользователями</h2>
          <p className="text-gray-600">Управление пользователями и их правами доступа</p>
        </div>
        {activeTab === 'list' && (
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Всего: {users.length} • Активных: {users.filter(u => u.status === 'active').length}
            </div>
            {lastSaved && (
              <div className="text-xs text-gray-500">
                Последнее сохранение: {lastSaved.toLocaleTimeString()}
          </div>
            )}
          <Button
            onClick={() => setIsCreatingUser(true)}
            variant="default"
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Добавить пользователя
          </Button>
        </div>
        )}
      </div>

      {/* Навигация по вкладкам */}
      <div className="flex border-b border-gray-300">
        {[
          { id: 'list', label: 'Список пользователей', icon: Users },
          { id: 'permissions', label: 'Индивидуальные разрешения', icon: Shield },
          { id: 'roles', label: 'Роли', icon: Crown },
          { id: 'activity', label: 'Активность', icon: Settings }
        ].map(tab => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-[#fff60b] text-black bg-[#fff60b]/10'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Все роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="site-user">Пользователь сайта</SelectItem>
                  <SelectItem value="client">Клиент Метрики</SelectItem>
                  <SelectItem value="foreign-employee">Иностранный сотрудник</SelectItem>
                  <SelectItem value="freelancer">Внештатный сотрудник</SelectItem>
                  <SelectItem value="employee">Сотрудник</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                  <SelectItem value="pending">Ожидающие</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Таблица пользователей */}
            <div className="rounded-md border">
              <Table>
                <TableCaption>Список всех пользователей системы</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Пользователь</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Права</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedUserForCard(user)
                              setIsUserCardOpen(true)
                            }}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4 text-gray-600" />
                          </button>
                          <div>
                            <div className="font-medium text-black">{user.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className="text-sm font-medium text-black">{getRoleDisplayName(user.role)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Активен' :
                           user.status === 'inactive' ? 'Неактивен' : 'Ожидает'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Никогда'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          arePermissionsStandardWithLocalStorage(user) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {arePermissionsStandardWithLocalStorage(user) ? 'Стандартные права' : 'Нестандартные права'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Индивидуальные разрешения */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black">Индивидуальные разрешения</h3>
                <p className="text-sm text-gray-600">Настройка индивидуальных разрешений для каждого пользователя</p>
              </div>
            </div>
            
            {/* Фильтры и поиск */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Все роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="site-user">Пользователь сайта</SelectItem>
                  <SelectItem value="client">Клиент Метрики</SelectItem>
                  <SelectItem value="foreign-employee">Иностранный сотрудник</SelectItem>
                  <SelectItem value="freelancer">Внештатный сотрудник</SelectItem>
                  <SelectItem value="employee">Сотрудник</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                  <SelectItem value="pending">Ожидающие</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Таблица пользователей для индивидуальных разрешений */}
            <div className="rounded-md border">
              <Table>
                <TableCaption>Управление индивидуальными разрешениями пользователей</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                <button
                        onClick={() => {
                          if (sortBy === 'name') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                          } else {
                            setSortBy('name')
                            setSortOrder('asc')
                          }
                        }}
                        className="flex items-center space-x-1 hover:text-gray-900"
                      >
                        <span>Пользователь</span>
                        {sortBy === 'name' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                </button>
                    </TableHead>
                    <TableHead>
                <button
                        onClick={() => {
                          if (sortBy === 'role') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                          } else {
                            setSortBy('role')
                            setSortOrder('asc')
                          }
                        }}
                        className="flex items-center space-x-1 hover:text-gray-900"
                      >
                        <span>Роль</span>
                        {sortBy === 'role' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => {
                          if (sortBy === 'lastLogin') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                          } else {
                            setSortBy('lastLogin')
                            setSortOrder('asc')
                          }
                        }}
                        className="flex items-center space-x-1 hover:text-gray-900"
                      >
                        <span>Последний вход</span>
                        {sortBy === 'lastLogin' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </TableHead>
                    <TableHead>Права</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedUserForCard(user)
                              setIsUserCardOpen(true)
                            }}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4 text-gray-600" />
                          </button>
                          <div>
                            <div className="font-medium text-black">{user.name}</div>
              </div>
            </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className="text-sm font-medium text-black">{getRoleDisplayName(user.role)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Никогда'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          arePermissionsStandardWithLocalStorage(user) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {arePermissionsStandardWithLocalStorage(user) ? 'Стандартные права' : 'Нестандартные права'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                <button
                          onClick={() => openIndividualPermissionsModal(user)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-all"
                        >
                          Настроить разрешения
                </button>
                      </TableCell>
                    </TableRow>
              ))}
                </TableBody>
              </Table>
            </div>
                    </div>
        )}

        {/* Роли */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                    <div>
                <h3 className="text-lg font-semibold text-black">Роли</h3>
                <p className="text-sm text-gray-600">Управление ролями и их разрешениями</p>
                      </div>
                    </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Пользователь сайта */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Пользователь сайта</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">0 пользователей</span>
                  </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('site-user')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                    <Edit className="w-4 h-4" />
                  </button>
                    <button 
                      onClick={() => openDeleteRoleModal('site-user')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                </div>
                </div>
                
              {/* Клиент Метрики */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Клиент Метрики</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">0 пользователей</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('client')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteRoleModal('client')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Иностранный сотрудник */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Иностранный сотрудник</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">0 пользователей</span>
                    </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('foreign-employee')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteRoleModal('foreign-employee')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                </div>
                
              {/* Внештатный сотрудник */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Внештатный сотрудник</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">0 пользователей</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('freelancer')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteRoleModal('freelancer')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Сотрудник */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Сотрудник</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">8 пользователей</span>
                    </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('employee')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteRoleModal('employee')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                </div>
                
              {/* Менеджер */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Менеджер</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">1 пользователей</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('manager')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteRoleModal('manager')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                </div>
                
              {/* Администратор */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-black text-sm mb-2">Администратор</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">1 пользователей</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Создана: 01.01.2024</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openRoleModal('admin')}
                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Редактировать роль"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteRoleModal('admin')}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить роль"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                </div>
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
                    <p className="text-sm text-gray-600">Пользователей сайта</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'site-user').length}</p>
                  </div>
                  <User className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Клиентов Метрики</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'client').length}</p>
                        </div>
                  <User className="w-8 h-8 text-gray-600" />
                        </div>
                      </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Иностранных сотрудников</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'foreign-employee').length}</p>
                  </div>
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                </div>

              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                      <div>
                    <p className="text-sm text-gray-600">Внештатных сотрудников</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'freelancer').length}</p>
                      </div>
                  <User className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Сотрудников</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'employee').length}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Менеджеров</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'manager').length}</p>
                  </div>
                  <Star className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Администраторов</p>
                    <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'admin').length}</p>
                  </div>
                  <Crown className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      {/* Модальное окно создания пользователя */}
      <Dialog open={isCreatingUser} onOpenChange={setIsCreatingUser}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold text-black">Добавить пользователя</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 overflow-y-auto max-h-[calc(85vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Имя *</Label>
                <Input
                  type="text"
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите имя"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Email *</Label>
                <Input
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, email: e.target.value }))}
                  placeholder="Введите email"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Логин</Label>
                <Input
                  type="text"
                  value={newUser.login || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, login: e.target.value }))}
                  placeholder="Введите логин"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Пароль</Label>
                <Input
                  type="password"
                  value={newUser.password || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, password: e.target.value }))}
                  placeholder="Введите пароль"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Роль</Label>
                <Select value={newUser.role || 'employee'} onValueChange={(value) => setNewUser((prev: Partial<UserType>) => ({ ...prev, role: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site-user">Пользователь сайта</SelectItem>
                    <SelectItem value="client">Клиент Метрики</SelectItem>
                    <SelectItem value="foreign-employee">Иностранный сотрудник</SelectItem>
                    <SelectItem value="freelancer">Внештатный сотрудник</SelectItem>
                    <SelectItem value="employee">Сотрудник</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Статус</Label>
                <Select value={newUser.status || 'pending'} onValueChange={(value) => setNewUser((prev: Partial<UserType>) => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                    <SelectItem value="pending">Ожидает</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Дата рождения</Label>
                <Input
                  type="text"
                  value={newUser.dateOfBirth || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, dateOfBirth: e.target.value }))}
                  placeholder="ДД.ММ.ГГГГ"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Рабочий телефон</Label>
                <Input
                  type="text"
                  value={newUser.phoneWork || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, phoneWork: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Личный телефон</Label>
                <Input
                  type="text"
                  value={newUser.phonePersonal || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, phonePersonal: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <Label className="block text-sm font-medium text-black mb-2">Адрес</Label>
                <Input
                  type="text"
                  value={newUser.address || ''}
                  onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, address: e.target.value }))}
                  placeholder="Введите адрес"
                />
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-medium text-black mb-2">Объекты пользователя</label>
              <div className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 p-3 overflow-y-auto">
                <div className="text-sm text-gray-500">Объекты не назначены (функционал в разработке)</div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
              <Label className="block text-sm font-medium text-black mb-2">Комментарии</Label>
              <textarea
                value={newUser.comments || ''}
                onChange={(e) => setNewUser((prev: Partial<UserType>) => ({ ...prev, comments: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                rows={3}
                placeholder="Введите комментарии"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => setIsCreatingUser(false)}
              variant="outline"
            >
              Отменить
            </Button>
            <Button
              onClick={createUser}
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              Создать пользователя
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно редактирования пользователя */}
      <Dialog open={isEditingUser} onOpenChange={(open) => {
        if (!open) {
          setIsEditingUser(false)
          setSelectedUser(null)
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-hidden p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold text-black">Редактировать пользователя</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[calc(70vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Имя *</label>
                <Input
                  value={selectedUser?.name || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Email *</label>
                <Input
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, email: e.target.value } : null)}
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Логин</label>
                <Input
                  value={selectedUser?.login || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, login: e.target.value } : null)}
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Пароль</label>
                <Input
                  type="password"
                  value={selectedUser?.password || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, password: e.target.value } : null)}
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Роль</label>
                <Select
                  value={selectedUser?.role || ''}
                  onValueChange={(value) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, role: value as any } : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site-user">Пользователь сайта</SelectItem>
                    <SelectItem value="client">Клиент Метрики</SelectItem>
                    <SelectItem value="foreign-employee">Иностранный сотрудник</SelectItem>
                    <SelectItem value="freelancer">Внештатный сотрудник</SelectItem>
                    <SelectItem value="employee">Сотрудник</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Статус</label>
                <Select
                  value={selectedUser?.status || ''}
                  onValueChange={(value) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, status: value as any } : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                    <SelectItem value="pending">Ожидает</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Дата рождения</label>
                <Input
                  value={selectedUser?.dateOfBirth || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                  placeholder="ДД.ММ.ГГГГ"
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Рабочий телефон</label>
                <Input
                  value={selectedUser?.phoneWork || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, phoneWork: e.target.value } : null)}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Личный телефон</label>
                <Input
                  value={selectedUser?.phonePersonal || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, phonePersonal: e.target.value } : null)}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Адрес</label>
                <Input
                  value={selectedUser?.address || ''}
                  onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, address: e.target.value } : null)}
                  placeholder="Введите адрес"
                  className="w-full"
                />
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-black mb-2">Дата создания</label>
                <Input
                  value={selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : ''}
                  className="w-full bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
            </div>
            
            <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-medium text-black mb-2">Объекты пользователя</label>
              <div className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 p-3 overflow-y-auto">
                {selectedUser?.userObjects && selectedUser.userObjects.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.userObjects.map((objectId, index) => (
                      <div key={index} className="p-2 bg-white rounded border text-sm">
                        Объект {objectId} (функционал в разработке)
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Объекты не назначены (функционал в разработке)</div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-medium text-black mb-2">Комментарии</label>
              <textarea
                value={selectedUser?.comments || ''}
                onChange={(e) => setSelectedUser((prev: UserType | null) => prev ? { ...prev, comments: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                rows={3}
                placeholder="Введите комментарии"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditingUser(false)
                setSelectedUser(null)
              }}
            >
              Отменить
            </Button>
            <Button 
              onClick={() => {
                if (selectedUser) {
                  updateUser(selectedUser.id, selectedUser)
                  setIsEditingUser(false)
                  setSelectedUser(null)
                }
              }}
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно карточки пользователя */}
      <Dialog open={isUserCardOpen} onOpenChange={(open) => {
        if (!open) {
          setIsUserCardOpen(false)
          setSelectedUserForCard(null)
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-hidden p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold text-black">Карточка пользователя</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[calc(70vh-140px)]">
            {/* Основная информация */}
            <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-black">{selectedUserForCard?.name}</h4>
                  <p className="text-gray-600">{selectedUserForCard?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUserForCard?.status || 'active')}`}>
                      {selectedUserForCard?.status === 'active' ? 'Активен' :
                       selectedUserForCard?.status === 'inactive' ? 'Неактивен' : 'Ожидает'}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">{selectedUserForCard?.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Детальная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Логин</label>
                  <p className="text-black">{selectedUserForCard?.login || 'Не указан'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                  <p className="text-black">{selectedUserForCard?.dateOfBirth || 'Не указана'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Рабочий телефон</label>
                  <p className="text-black">{selectedUserForCard?.phoneWork || 'Не указан'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Личный телефон</label>
                  <p className="text-black">{selectedUserForCard?.phonePersonal || 'Не указан'}</p>
                </div>
              </div>
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                  <p className="text-black">{selectedUserForCard?.address || 'Не указан'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата создания</label>
                  <p className="text-black">{selectedUserForCard?.createdAt ? new Date(selectedUserForCard.createdAt).toLocaleDateString() : 'Не указана'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Последний вход</label>
                  <p className="text-black">
                    {selectedUserForCard?.lastLogin ? new Date(selectedUserForCard.lastLogin).toLocaleString() : 'Никогда'}
                  </p>
                </div>
              </div>
            </div>

            {/* Объекты пользователя */}
            <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Объекты пользователя</label>
              <div className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 p-3 overflow-y-auto">
                {selectedUserForCard?.userObjects && selectedUserForCard.userObjects.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUserForCard.userObjects.map((objectId, index) => (
                      <div key={index} className="p-2 bg-white rounded border text-sm">
                        Объект {objectId} (функционал в разработке)
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Объекты не назначены</div>
                )}
              </div>
            </div>

            {/* Комментарии */}
            {selectedUserForCard?.comments && (
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Комментарии</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-black">{selectedUserForCard.comments}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsUserCardOpen(false)
                setSelectedUserForCard(null)
              }}
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно редактирования роли */}
      {isRoleModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-black">
                Редактирование роли: {getRoleDisplayName(selectedRole)}
              </h3>
              <button
                onClick={() => {
                  setIsRoleModalOpen(false)
                  setSelectedRole(null)
                }}
                className="p-1 text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
                      </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(70vh-140px)]">
              {/* Чекбоксы разрешений */}
              <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-4">
                <h4 className="text-lg font-medium text-black mb-4">Разрешения доступа</h4>
                
                      <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                      checked={rolePermissions['profile']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'profile': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Личный кабинет</span>
                          </label>
                  
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                      checked={rolePermissions['my-objects']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'my-objects': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Мои объекты</span>
                          </label>
                  
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                      checked={rolePermissions['email']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'email': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Email</span>
                          </label>
                  
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                      checked={rolePermissions['academy']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'academy': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Академия</span>
                          </label>
                  
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                      checked={rolePermissions['knowledge-base']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'knowledge-base': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">База знаний</span>
                          </label>
                  
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                      checked={rolePermissions['tasks']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'tasks': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Менеджер задач</span>
                          </label>

                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                      checked={rolePermissions['admin']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'admin': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Админ панель</span>
                          </label>
                  
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                      checked={rolePermissions['hide-in-tasks']}
                      onChange={(e) => setRolePermissions(prev => ({ ...prev, 'hide-in-tasks': e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Не отображать в задачах</span>
                          </label>
                </div>
                        </div>
                      </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsRoleModalOpen(false)
                  setSelectedRole(null)
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Отменить
              </button>
              <button
                onClick={saveRolePermissions}
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления роли */}
      {isDeleteRoleModalOpen && roleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-black">
                Подтверждение удаления
              </h3>
              <button
                onClick={cancelDeleteRole}
                className="p-1 text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-black font-medium">
                    Вы уверены, что хотите удалить роль?
                  </p>
                  <p className="text-sm text-gray-600">
                    Роль: <span className="font-medium">{getRoleDisplayName(roleToDelete)}</span>
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Это действие нельзя отменить. Все пользователи с этой ролью будут переназначены на роль "Пользователь сайта".
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDeleteRole}
                  className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Отменить
                </button>
                <button
                  onClick={confirmDeleteRole}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Удалить роль
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно индивидуальных разрешений */}
      {isIndividualPermissionsModalOpen && selectedUserForPermissions && individualPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-black">
                Индивидуальные разрешения: {selectedUserForPermissions.name}
              </h3>
              <button
                onClick={() => {
                  setIsIndividualPermissionsModalOpen(false)
                  setSelectedUserForPermissions(null)
                  setIndividualPermissions(null)
                }}
                className="p-1 text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Основные разделы */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-black">Основные разделы</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                      checked={individualPermissions.personalCabinet?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        personalCabinet: { ...prev.personalCabinet, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Личный кабинет</span>
                          </label>

                  <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                      checked={individualPermissions.myObjects?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        myObjects: { ...prev.myObjects, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Мои объекты</span>
                          </label>

                  <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                      checked={individualPermissions.email?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        email: { ...prev.email, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Email</span>
                          </label>

                  <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                      checked={individualPermissions.academy?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        academy: { ...prev.academy, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Академия</span>
                          </label>

                  <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                      checked={individualPermissions.knowledgeBase?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        knowledgeBase: { ...prev.knowledgeBase, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">База знаний</span>
                          </label>

                  <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                      checked={individualPermissions.taskManager?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        taskManager: { ...prev.taskManager, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Менеджер задач</span>
                          </label>

                  <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                      checked={individualPermissions.adminPanel?.enabled || false}
                      onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                        adminPanel: { ...prev.adminPanel, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Админ панель</span>
                          </label>
                </div>
              </div>

              {/* Подразделы Email */}
              {individualPermissions.email?.enabled && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-black">Email - Подразделы</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.email?.viewMail || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, viewMail: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Просмотр почты</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.email?.sendEmails || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, sendEmails: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Отправка писем</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.email?.manageMailboxes || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, manageMailboxes: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Управление почтовыми ящиками</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.email?.mailSettings || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, mailSettings: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Настройки почты</span>
                          </label>
                        </div>
                      </div>
              )}

              {/* Подразделы Академия */}
              {individualPermissions.academy?.enabled && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-black">Академия - Подразделы</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.academy?.dashboard || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          academy: { ...prev.academy, dashboard: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Дашборд</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.academy?.courses || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          academy: { ...prev.academy, courses: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Курсы</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.academy?.tests || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          academy: { ...prev.academy, tests: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Тесты</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.academy?.achievements || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          academy: { ...prev.academy, achievements: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Достижения</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.academy?.materials || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          academy: { ...prev.academy, materials: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Материалы</span>
                          </label>
                        </div>
                      </div>
            )}

              {/* Подразделы Админ панель */}
              {individualPermissions.adminPanel?.enabled && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-black">Админ панель - Подразделы</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                        checked={individualPermissions.adminPanel?.dashboard || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, dashboard: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Дашборд</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.email || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, email: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Email</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.content || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, content: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Контент</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.objects || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, objects: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Объекты</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.users || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, users: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Пользователи</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.tasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, tasks: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Задачи</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.media || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, media: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Медиа</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.hr || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, hr: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Кадры и бухгалтерия</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.analytics || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, analytics: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Аналитика</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.adminPanel?.settings || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          adminPanel: { ...prev.adminPanel, settings: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Настройки</span>
                          </label>
                        </div>
                      </div>
        )}

              {/* Подразделы Менеджер задач */}
              {individualPermissions.taskManager?.enabled && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-black">Менеджер задач - Подразделы</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                        checked={individualPermissions.taskManager?.viewTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, viewTasks: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Просмотр задач</span>
                    </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.taskManager?.createTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, createTasks: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Создание задач</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.taskManager?.assignExecutors || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, assignExecutors: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Назначение исполнителей</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.taskManager?.closeTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, closeTasks: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Закрытие задач</span>
                          </label>

                    <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                        checked={individualPermissions.taskManager?.editTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, editTasks: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Редактирование задач</span>
                          </label>

                    <label className="flex items-center space-x-3">
                  <input
                        type="checkbox"
                        checked={individualPermissions.taskManager?.changeExecutors || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, changeExecutors: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Изменение исполнителей</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={individualPermissions.taskManager?.changeCurators || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          taskManager: { ...prev.taskManager, changeCurators: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Изменение кураторов</span>
                    </label>

                    <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                        checked={individualPermissions.taskManager?.editSubtasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                          taskManager: { ...prev.taskManager, editSubtasks: e.target.checked }
                      }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                      <span className="text-black">Редактирование подзадач</span>
                    </label>

                    <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                        checked={individualPermissions.taskManager?.editChecklists || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                          taskManager: { ...prev.taskManager, editChecklists: e.target.checked }
                      }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                      <span className="text-black">Редактирование чек-листов</span>
                    </label>

                    <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                        checked={individualPermissions.taskManager?.viewOtherUsersTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                          taskManager: { ...prev.taskManager, viewOtherUsersTasks: e.target.checked }
                      }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                      <span className="text-black">Просмотр задач других пользователей</span>
                    </label>
            </div>
          </div>
        )}

              {/* Фильтр видимости задач */}
              {individualPermissions.taskManager?.enabled && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-black">Видимость задач конкретных пользователей</h4>
                  <p className="text-sm text-gray-600">Выберите пользователей, чьи задачи этот пользователь не может видеть</p>
                  
                  <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Пользователи</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {users.filter(u => u.id !== selectedUserForPermissions?.id).map(user => (
                          <label key={user.id} className="flex items-center space-x-2">
                  <input
                              type="checkbox"
                              checked={hiddenTasksFilter.users.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setHiddenTasksFilter(prev => ({
                                    ...prev,
                                    users: [...prev.users, user.id]
                                  }))
                                } else {
                                  setHiddenTasksFilter(prev => ({
                                    ...prev,
                                    users: prev.users.filter(id => id !== user.id)
                                  }))
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-black">{user.name}</span>
                          </label>
                  ))}
              </div>
            </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Роли в задачах</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                  <input
                            type="checkbox"
                            checked={hiddenTasksFilter.roles.includes('executor')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setHiddenTasksFilter(prev => ({
                                  ...prev,
                                  roles: [...prev.roles, 'executor']
                                }))
                              } else {
                                setHiddenTasksFilter(prev => ({
                                  ...prev,
                                  roles: prev.roles.filter(role => role !== 'executor')
                                }))
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Исполнитель</span>
                        </label>
                        <label className="flex items-center space-x-2">
                  <input
                            type="checkbox"
                            checked={hiddenTasksFilter.roles.includes('curator')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setHiddenTasksFilter(prev => ({
                                  ...prev,
                                  roles: [...prev.roles, 'curator']
                                }))
                              } else {
                                setHiddenTasksFilter(prev => ({
                                  ...prev,
                                  roles: prev.roles.filter(role => role !== 'curator')
                                }))
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Куратор</span>
                        </label>
                </div>
                </div>
                </div>
                </div>
              )}

              {/* Дополнительные разрешения */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-black">Дополнительные разрешения</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                        checked={individualPermissions.otherPermissions?.canChangeExecutorInOwnTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                          otherPermissions: { 
                            ...prev.otherPermissions, 
                            canChangeExecutorInOwnTasks: e.target.checked 
                          }
                      }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                      <span className="text-black">Менять исполнителя в своих задачах</span>
                  </label>

                    <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                        checked={individualPermissions.otherPermissions?.canChangeCuratorInOwnTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                          otherPermissions: { 
                            ...prev.otherPermissions, 
                            canChangeCuratorInOwnTasks: e.target.checked 
                          }
                      }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                      <span className="text-black">Менять куратора в своих задачах</span>
                  </label>

                    <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                        checked={individualPermissions.otherPermissions?.canCreateHiddenTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                        ...prev,
                          otherPermissions: { 
                            ...prev.otherPermissions, 
                            canCreateHiddenTasks: e.target.checked 
                          }
                      }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                      <span className="text-black">Создавать скрытые задачи</span>
                  </label>

                    <label className="flex items-center space-x-3">
                  <input
                        type="checkbox"
                        checked={individualPermissions.otherPermissions?.canViewHiddenTasks || false}
                        onChange={(e) => setIndividualPermissions((prev: any) => ({
                          ...prev,
                          otherPermissions: { 
                            ...prev.otherPermissions, 
                            canViewHiddenTasks: e.target.checked 
                          }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-black">Видеть скрытые задачи</span>
                  </label>
              </div>

                  {/* Пользователи, чьи задачи нельзя редактировать/удалять */}
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Не может редактировать/удалять задачи пользователей:
                  </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {users.filter(u => u.id !== selectedUserForPermissions?.id).map(user => (
                        <label key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                            checked={individualPermissions.otherPermissions?.cannotEditTasksFrom?.includes(user.id) || false}
                            onChange={(e) => {
                              const currentList = individualPermissions.otherPermissions?.cannotEditTasksFrom || []
                              if (e.target.checked) {
                                setIndividualPermissions((prev: any) => ({
                        ...prev,
                                  otherPermissions: { 
                                    ...prev.otherPermissions, 
                                    cannotEditTasksFrom: [...currentList, user.id]
                                  }
                                }))
                              } else {
                                setIndividualPermissions((prev: any) => ({
                        ...prev,
                                  otherPermissions: { 
                                    ...prev.otherPermissions, 
                                    cannotEditTasksFrom: currentList.filter((id: string) => id !== user.id)
                                  }
                                }))
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">{user.name}</span>
                  </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={resetToRolePermissions}
                className={`px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all ${
                  isRoleButtonPressed 
                    ? 'text-black' 
                    : 'bg-white border border-gray-300 text-black'
                }`}
                style={{
                  backgroundColor: isRoleButtonPressed ? '#fff60b' : undefined
                }}
                onMouseEnter={!isRoleButtonPressed ? (e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a' : undefined}
                onMouseLeave={!isRoleButtonPressed ? (e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b' : undefined}
              >
                По роли
              </button>
              <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                    setIsIndividualPermissionsModalOpen(false)
                    setSelectedUserForPermissions(null)
                    setIndividualPermissions(null)
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                  Отменить
              </button>
              <button
                  onClick={saveIndividualPermissions}
                  className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                  style={{ backgroundColor: '#fff60b' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                  Применить
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}