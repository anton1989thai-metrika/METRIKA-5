"use client"

import { useState, useEffect } from "react"
import {
  X,
  Bell,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  User,
  Users,
  Home,
  Building,
  LandPlot,
  Store,
  Factory,
  Share,
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  Calculator,
  Play,
  QrCode,
  Info,
  Cloud,
  Zap,
  FileText,
  Image,
  Tag,
  TrendingUp,
  Archive,
  Minus,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Grid,
  List,
  Target,
  Layers,
  MapPin,
  Video,
  Music,
  Folder,
  Cog,
  Shield,
  ShieldCheck,
  Link,
  Link2,
  Unlink,
  Activity,
  TrendingDown,
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
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh
} from "lucide-react"

interface Notification {
  id: string
  type: 'deadline' | 'reminder' | 'update' | 'expiration' | 'task' | 'system'
  title: string
  message: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'sent' | 'read' | 'dismissed'
  createdAt: string
  scheduledFor: string
  sentAt?: string
  readAt?: string
  dismissedAt?: string
  recipient: {
    id: string
    name: string
    role: 'admin' | 'manager' | 'agent' | 'employee'
    email?: string
    phone?: string
  }
  objectId?: string
  objectTitle?: string
  taskId?: string
  taskTitle?: string
  channels: Array<'email' | 'sms' | 'push' | 'internal'>
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurringInterval?: number
  nextScheduled?: string
  metadata?: Record<string, any>
}

interface NotificationRule {
  id: string
  name: string
  description: string
  isActive: boolean
  conditions: {
    objectStatus?: string[]
    daysBeforeDeadline?: number
    objectType?: string[]
    agentRole?: string[]
    priceRange?: { min: number; max: number }
    location?: string[]
  }
  actions: {
    channels: Array<'email' | 'sms' | 'push' | 'internal'>
    template: string
    recipients: string[]
    priority: 'low' | 'normal' | 'high' | 'urgent'
  }
  schedule: {
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly'
    time?: string
    daysOfWeek?: number[]
    daysOfMonth?: number[]
  }
  createdAt: string
  lastTriggered?: string
  triggerCount: number
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (notifications: Notification[], rules: NotificationRule[]) => void
  initialNotifications?: Notification[]
  initialRules?: NotificationRule[]
  objectData?: any
}

export default function NotificationsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialNotifications = [],
  initialRules = [],
  objectData
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [rules, setRules] = useState<NotificationRule[]>(initialRules)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)
  const [isCreatingRule, setIsCreatingRule] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'created' | 'scheduled' | 'priority'>('scheduled')

  // Новое правило уведомлений
  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    name: '',
    description: '',
    isActive: true,
    conditions: {
      objectStatus: [],
      daysBeforeDeadline: 7,
      objectType: [],
      agentRole: [],
      priceRange: { min: 0, max: 10000000 },
      location: []
    },
    actions: {
      channels: ['internal'],
      template: '',
      recipients: [],
      priority: 'normal'
    },
    schedule: {
      frequency: 'daily',
      time: '09:00'
    },
    triggerCount: 0
  })

  // Фильтрация и сортировка уведомлений
  const filteredNotifications = notifications
    .filter(notification => {
      if (filterStatus !== 'all' && notification.status !== filterStatus) return false
      if (filterType !== 'all' && notification.type !== filterType) return false
      if (filterPriority !== 'all' && notification.priority !== filterPriority) return false
      if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      }
    })

  // Создание уведомления
  const createNotification = (type: Notification['type'], title: string, message: string, priority: Notification['priority'] = 'normal') => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString(),
      recipient: {
        id: 'current-user',
        name: 'Текущий пользователь',
        role: 'manager'
      },
      objectId: objectData?.id,
      objectTitle: objectData?.title,
      channels: ['internal'],
      isRecurring: false,
      metadata: {}
    }

    setNotifications(prev => [notification, ...prev])
  }

  // Отправка уведомления
  const sendNotification = async (notificationId: string) => {
    setIsSendingNotification(true)
    
    try {
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1000))

      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { 
              ...notification, 
              status: 'sent',
              sentAt: new Date().toISOString()
            }
          : notification
      ))

      console.log('Уведомление отправлено:', notificationId)
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error)
    } finally {
      setIsSendingNotification(false)
    }
  }

  // Отметка как прочитанное
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { 
            ...notification, 
            status: 'read',
            readAt: new Date().toISOString()
          }
        : notification
    ))
  }

  // Отклонение уведомления
  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { 
            ...notification, 
            status: 'dismissed',
            dismissedAt: new Date().toISOString()
          }
        : notification
    ))
  }

  // Удаление уведомления
  const deleteNotification = (notificationId: string) => {
    if (confirm('Вы уверены, что хотите удалить это уведомление?')) {
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
    }
  }

  // Создание правила
  const createRule = () => {
    if (!newRule.name || !newRule.description) return

    const rule: NotificationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      isActive: newRule.isActive || true,
      conditions: newRule.conditions || {},
      actions: newRule.actions || {
        channels: ['internal'],
        template: '',
        recipients: [],
        priority: 'normal'
      },
      schedule: newRule.schedule || {
        frequency: 'daily',
        time: '09:00'
      },
      createdAt: new Date().toISOString(),
      triggerCount: 0
    }

    setRules(prev => [...prev, rule])
    setNewRule({
      name: '',
      description: '',
      isActive: true,
      conditions: {
        objectStatus: [],
        daysBeforeDeadline: 7,
        objectType: [],
        agentRole: [],
        priceRange: { min: 0, max: 10000000 },
        location: []
      },
      actions: {
        channels: ['internal'],
        template: '',
        recipients: [],
        priority: 'normal'
      },
      schedule: {
        frequency: 'daily',
        time: '09:00'
      },
      triggerCount: 0
    })
    setIsCreatingRule(false)
  }

  // Переключение активности правила
  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ))
  }

  // Удаление правила
  const deleteRule = (ruleId: string) => {
    if (confirm('Вы уверены, что хотите удалить это правило?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId))
    }
  }

  // Тестирование правила
  const testRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return

    createNotification(
      'reminder',
      `Тест правила: ${rule.name}`,
      `Это тестовое уведомление для правила "${rule.description}"`,
      rule.actions.priority
    )

    setRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { 
            ...r, 
            lastTriggered: new Date().toISOString(),
            triggerCount: r.triggerCount + 1
          }
        : r
    ))
  }

  // Автоматическое создание уведомлений для объекта
  useEffect(() => {
    if (objectData && isOpen) {
      // Уведомление о создании объекта
      createNotification(
        'update',
        'Объект создан',
        `Объект "${objectData.title}" был создан и требует проверки`,
        'normal'
      )

      // Уведомление о необходимости обновления (через 30 дней)
      const updateDate = new Date()
      updateDate.setDate(updateDate.getDate() + 30)
      
      const updateNotification: Notification = {
        id: Date.now().toString() + '_update',
        type: 'reminder',
        title: 'Требуется обновление объекта',
        message: `Объект "${objectData.title}" требует обновления информации`,
        priority: 'normal',
        status: 'pending',
        createdAt: new Date().toISOString(),
        scheduledFor: updateDate.toISOString(),
        recipient: {
          id: 'current-user',
          name: 'Текущий пользователь',
          role: 'manager'
        },
        objectId: objectData.id,
        objectTitle: objectData.title,
        channels: ['internal', 'email'],
        isRecurring: true,
        recurringPattern: 'monthly',
        recurringInterval: 1,
        nextScheduled: updateDate.toISOString(),
        metadata: { reminderType: 'object_update' }
      }

      setNotifications(prev => [updateNotification, ...prev])
    }
  }, [objectData, isOpen])

  // Сохранение
  const handleSave = () => {
    onSave(notifications, rules)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">Система уведомлений</h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {notifications.filter(n => n.status === 'pending').length} ожидают
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {notifications.filter(n => n.status === 'sent').length} отправлено
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {rules.filter(r => r.isActive).length} правил активно
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Навигация по вкладкам */}
        <div className="flex border-b border-gray-300">
          {[
            { id: 'overview', label: 'Обзор', icon: Bell },
            { id: 'notifications', label: 'Уведомления', icon: MessageCircle },
            { id: 'rules', label: 'Правила', icon: Settings },
            { id: 'templates', label: 'Шаблоны', icon: FileText },
            { id: 'settings', label: 'Настройки', icon: Cog }
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Обзор */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Статистика уведомлений</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего уведомлений</p>
                      <p className="text-2xl font-bold text-black">{notifications.length}</p>
                    </div>
                    <Bell className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ожидают отправки</p>
                      <p className="text-2xl font-bold text-black">
                        {notifications.filter(n => n.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Отправлено</p>
                      <p className="text-2xl font-bold text-black">
                        {notifications.filter(n => n.status === 'sent').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Активных правил</p>
                      <p className="text-2xl font-bold text-black">
                        {rules.filter(r => r.isActive).length}
                      </p>
                    </div>
                    <Settings className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Последние уведомления */}
              <div>
                <h5 className="text-lg font-semibold text-black mb-4">Последние уведомления</h5>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map(notification => (
                    <div key={notification.id} className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          notification.priority === 'urgent' ? 'bg-gray-500' :
                          notification.priority === 'high' ? 'bg-gray-500' :
                          notification.priority === 'normal' ? 'bg-gray-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-black">{notification.title}</div>
                          <div className="text-sm text-gray-600">{notification.message}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Уведомления */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Управление уведомлениями</h4>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => createNotification('reminder', 'Тестовое уведомление', 'Это тестовое уведомление')}
                    className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                    style={{backgroundColor: '#fff60b'}}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Создать уведомление
                  </button>
                </div>
              </div>

              {/* Фильтры */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Поиск уведомлений..."
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="all">Все статусы</option>
                  <option value="pending">Ожидают</option>
                  <option value="sent">Отправлены</option>
                  <option value="read">Прочитаны</option>
                  <option value="dismissed">Отклонены</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="all">Все типы</option>
                  <option value="deadline">Сроки</option>
                  <option value="reminder">Напоминания</option>
                  <option value="update">Обновления</option>
                  <option value="expiration">Истечение</option>
                  <option value="task">Задачи</option>
                  <option value="system">Система</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="scheduled">По дате отправки</option>
                  <option value="created">По дате создания</option>
                  <option value="priority">По приоритету</option>
                </select>
              </div>

              {/* Список уведомлений */}
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all ${
                      notification.status === 'read' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          notification.priority === 'urgent' ? 'bg-gray-500' :
                          notification.priority === 'high' ? 'bg-gray-500' :
                          notification.priority === 'normal' ? 'bg-gray-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-black">{notification.title}</div>
                          <div className="text-sm text-gray-600">{notification.message}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          notification.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                          notification.status === 'sent' ? 'bg-gray-100 text-gray-800' :
                          notification.status === 'read' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.status === 'pending' ? 'Ожидает' :
                           notification.status === 'sent' ? 'Отправлено' :
                           notification.status === 'read' ? 'Прочитано' : 'Отклонено'}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          notification.priority === 'urgent' ? 'bg-gray-100 text-gray-800' :
                          notification.priority === 'high' ? 'bg-gray-100 text-gray-800' :
                          notification.priority === 'normal' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.priority}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>Получатель: {notification.recipient.name}</span>
                        <span>Каналы: {notification.channels.join(', ')}</span>
                        {notification.objectTitle && <span>Объект: {notification.objectTitle}</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {notification.status === 'pending' && (
                          <button
                            onClick={() => sendNotification(notification.id)}
                            disabled={isSendingNotification}
                            className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all disabled:opacity-50"
                          >
                            <Bell className="w-4 h-4 inline mr-1" />
                            Отправить
                          </button>
                        )}
                        {notification.status === 'sent' && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Прочитано
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Отклонить
                        </button>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Правила */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Правила уведомлений</h4>
                <button
                  onClick={() => setIsCreatingRule(true)}
                  className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Создать правило
                </button>
              </div>

              {/* Форма создания правила */}
              {isCreatingRule && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h5 className="text-lg font-semibold text-black mb-4">Создать новое правило</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Название правила</label>
                      <input
                        type="text"
                        value={newRule.name || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="Например: Напоминание об обновлении объекта"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Приоритет</label>
                      <select
                        value={newRule.actions?.priority || 'normal'}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          actions: { ...prev.actions!, priority: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="low">Низкий</option>
                        <option value="normal">Обычный</option>
                        <option value="high">Высокий</option>
                        <option value="urgent">Срочный</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">Описание</label>
                      <textarea
                        value={newRule.description || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        rows={3}
                        placeholder="Описание условия срабатывания правила..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={createRule}
                      className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Создать правило
                    </button>
                    <button
                      onClick={() => setIsCreatingRule(false)}
                      className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Список правил */}
              <div className="space-y-3">
                {rules.map(rule => (
                  <div key={rule.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="font-medium text-black">{rule.name}</div>
                          <div className="text-sm text-gray-600">{rule.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          rule.actions?.priority === 'urgent' ? 'bg-gray-100 text-gray-800' :
                          rule.actions?.priority === 'high' ? 'bg-gray-100 text-gray-800' :
                          rule.actions?.priority === 'normal' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.actions?.priority}
                        </div>
                        <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {rule.triggerCount} срабатываний
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>Каналы: {rule.actions?.channels.join(', ')}</span>
                        <span>Частота: {rule.schedule?.frequency}</span>
                        {rule.lastTriggered && (
                          <span>Последний запуск: {new Date(rule.lastTriggered).toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`px-3 py-1 rounded text-sm transition-all ${
                            rule.isActive 
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {rule.isActive ? 'Отключить' : 'Включить'}
                        </button>
                        <button
                          onClick={() => testRule(rule.id)}
                          className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                        >
                          <Bell className="w-4 h-4 inline mr-1" />
                          Тест
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Шаблоны */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Шаблоны уведомлений</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Шаблоны по типам</h5>
                  <div className="space-y-3">
                    {[
                      { type: 'deadline', name: 'Сроки', template: 'Объект "{objectTitle}" требует внимания до {deadline}' },
                      { type: 'reminder', name: 'Напоминания', template: 'Напоминание: {message}' },
                      { type: 'update', name: 'Обновления', template: 'Объект "{objectTitle}" был обновлен' },
                      { type: 'expiration', name: 'Истечение', template: 'Срок действия объекта "{objectTitle}" истекает {expirationDate}' },
                      { type: 'task', name: 'Задачи', template: 'Новая задача: {taskTitle}' },
                      { type: 'system', name: 'Система', template: 'Системное уведомление: {message}' }
                    ].map(template => (
                      <div key={template.type} className="p-3 bg-gray-50 rounded">
                        <div className="font-medium text-black">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.template}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Переменные шаблонов</h5>
                  <div className="space-y-2 text-sm">
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{objectTitle}'}</code> - Название объекта</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{objectId}'}</code> - ID объекта</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{deadline}'}</code> - Срок выполнения</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{expirationDate}'}</code> - Дата истечения</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{taskTitle}'}</code> - Название задачи</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{message}'}</code> - Сообщение</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{recipientName}'}</code> - Имя получателя</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">{'{currentDate}'}</code> - Текущая дата</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Настройки уведомлений</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Каналы уведомлений</h5>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Внутренние уведомления</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Email уведомления</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">SMS уведомления</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Push уведомления</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Расписание отправки</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Рабочие часы</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          defaultValue="09:00"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        />
                        <span className="text-gray-600">-</span>
                        <input
                          type="time"
                          defaultValue="18:00"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Рабочие дни</label>
                      <div className="flex items-center space-x-2">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={index < 5}
                              className="mr-1"
                            />
                            <span className="text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="text-sm text-gray-600">
            Всего уведомлений: {notifications.length} • 
            Ожидают: {notifications.filter(n => n.status === 'pending').length} • 
            Правил: {rules.length}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              <Save className="w-4 h-4 inline mr-2" />
              Сохранить настройки
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
