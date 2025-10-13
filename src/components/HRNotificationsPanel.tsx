"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Award, 
  AlertCircle,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  Archive,
  Star,
  StarOff,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  Lock,
  Unlock,
  Plus,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Upload,
  FileText,
  BarChart3,
  PieChart,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Sun,
  Moon,
  Star as StarIcon,
  Home,
  Building,
  LandPlot,
  Store,
  Factory,
  Share,
  MessageCircle,
  Play,
  QrCode,
  Cloud,
  Tag,
  Archive as ArchiveIcon,
  Grid,
  List,
  Layers,
  MapPin,
  Video,
  Music,
  Folder,
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
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
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
  Calculator,
  Receipt,
  CreditCard,
  Banknote,
  Wallet,
  Coins,
  HandCoins,
  PiggyBank,
  Timer,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Award as AwardIcon,
  AlertTriangle as AlertTriangleIcon,
  Bell as BellIcon,
  BellRing as BellRingIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon2,
  AlertTriangle as AlertTriangleIcon2,
  Info as InfoIcon2,
  Clock as ClockIcon2,
  Calendar as CalendarIcon2,
  DollarSign as DollarSignIcon2,
  Users as UsersIcon2,
  Award as AwardIcon2,
  AlertCircle as AlertCircleIcon2
} from "lucide-react"

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success' | 'salary' | 'vacation' | 'penalty' | 'bonus' | 'time' | 'cash'
  title: string
  message: string
  createdAt: string
  readAt?: string
  isRead: boolean
  isImportant: boolean
  isArchived: boolean
  category: string
  relatedEntity?: string
  relatedEntityId?: string
  actions?: NotificationAction[]
  expiresAt?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface NotificationAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  action: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  desktop: boolean
  sound: boolean
  workingHours: boolean
  categories: {
    salary: boolean
    vacation: boolean
    penalty: boolean
    bonus: boolean
    time: boolean
    cash: boolean
    general: boolean
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
}

export default function HRNotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'salary',
      title: 'Зарплата рассчитана',
      message: 'Зарплата за январь 2024 рассчитана для всех сотрудников. Общая сумма к выплате: ₽350,000',
      createdAt: '2024-01-15T10:30:00Z',
      isRead: false,
      isImportant: true,
      isArchived: false,
      category: 'Зарплата',
      priority: 'high',
      actions: [
        { id: 'approve', label: 'Одобрить', type: 'primary', action: 'approve_salary' },
        { id: 'review', label: 'Просмотреть', type: 'secondary', action: 'review_salary' }
      ]
    },
    {
      id: '2',
      type: 'vacation',
      title: 'Заявка на отпуск',
      message: 'Анна Петрова подала заявку на отпуск с 20 по 30 января 2024',
      createdAt: '2024-01-14T14:20:00Z',
      isRead: false,
      isImportant: false,
      isArchived: false,
      category: 'Отпуска',
      relatedEntity: 'Анна Петрова',
      relatedEntityId: '2',
      priority: 'medium',
      actions: [
        { id: 'approve', label: 'Одобрить', type: 'primary', action: 'approve_vacation' },
        { id: 'reject', label: 'Отклонить', type: 'danger', action: 'reject_vacation' }
      ]
    },
    {
      id: '3',
      type: 'penalty',
      title: 'Штраф на рассмотрении',
      message: 'Штраф за опоздание для Ивана Сидорова требует одобрения',
      createdAt: '2024-01-13T09:15:00Z',
      isRead: true,
      isImportant: false,
      isArchived: false,
      category: 'Штрафы',
      relatedEntity: 'Иван Сидоров',
      relatedEntityId: '1',
      priority: 'medium',
      actions: [
        { id: 'approve', label: 'Одобрить', type: 'primary', action: 'approve_penalty' },
        { id: 'reject', label: 'Отклонить', type: 'secondary', action: 'reject_penalty' }
      ]
    },
    {
      id: '4',
      type: 'time',
      title: 'Опоздание сотрудника',
      message: 'Мария Козлова опоздала на работу на 15 минут',
      createdAt: '2024-01-12T09:15:00Z',
      isRead: true,
      isImportant: false,
      isArchived: false,
      category: 'Рабочее время',
      relatedEntity: 'Мария Козлова',
      relatedEntityId: '3',
      priority: 'low'
    },
    {
      id: '5',
      type: 'cash',
      title: 'Крупная операция',
      message: 'Поступление ₽250,000 от продажи объекта #12345',
      createdAt: '2024-01-11T16:45:00Z',
      isRead: false,
      isImportant: true,
      isArchived: false,
      category: 'Касса',
      relatedEntity: 'Объект #12345',
      relatedEntityId: '12345',
      priority: 'high',
      actions: [
        { id: 'view', label: 'Просмотреть', type: 'secondary', action: 'view_transaction' }
      ]
    },
    {
      id: '6',
      type: 'bonus',
      title: 'Премия одобрена',
      message: 'Премия ₽25,000 для Ивана Сидорова за успешную продажу одобрена',
      createdAt: '2024-01-10T11:30:00Z',
      isRead: true,
      isImportant: false,
      isArchived: false,
      category: 'Премии',
      relatedEntity: 'Иван Сидоров',
      relatedEntityId: '1',
      priority: 'medium'
    }
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    desktop: true,
    sound: true,
    workingHours: true,
    categories: {
      salary: true,
      vacation: true,
      penalty: true,
      bonus: true,
      time: true,
      cash: true,
      general: true
    },
    frequency: 'immediate'
  })

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important' | 'archived'>('all')
  const [filterType, setFilterType] = useState<'all' | 'salary' | 'vacation' | 'penalty' | 'bonus' | 'time' | 'cash'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && !notification.isRead) ||
                      (activeTab === 'important' && notification.isImportant) ||
                      (activeTab === 'archived' && notification.isArchived)
    
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesType && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const importantCount = notifications.filter(n => n.isImportant && !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'salary':
        return <DollarSign className="w-5 h-5 text-gray-600" />
      case 'vacation':
        return <Calendar className="w-5 h-5 text-gray-600" />
      case 'penalty':
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
      case 'bonus':
        return <Award className="w-5 h-5 text-gray-600" />
      case 'time':
        return <Clock className="w-5 h-5 text-gray-600" />
      case 'cash':
        return <Receipt className="w-5 h-5 text-gray-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-gray-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-gray-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-gray-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }


  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true, readAt: new Date().toISOString() }
        : notification
    ))
  }

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: false, readAt: undefined }
        : notification
    ))
  }

  const toggleImportant = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isImportant: !notification.isImportant }
        : notification
    ))
  }

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isArchived: true }
        : notification
    ))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => 
      !notification.isRead 
        ? { ...notification, isRead: true, readAt: new Date().toISOString() }
        : notification
    ))
  }

  const handleNotificationAction = (notificationId: string, actionId: string) => {
    const notification = notifications.find(n => n.id === notificationId)
    const action = notification?.actions?.find(a => a.id === actionId)
    
    if (action) {
      console.log(`Выполнение действия: ${action.action} для уведомления ${notificationId}`)
      // Здесь будет логика выполнения действий
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
      {/* Заголовок и управление */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-black">Уведомления</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              {unreadCount} непрочитанных
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Настройки
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Отметить все как прочитанные
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">{notifications.length}</div>
              <div className="text-sm text-gray-600">Всего уведомлений</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <BellRing className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">{unreadCount}</div>
              <div className="text-sm text-gray-600">Непрочитанных</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">{importantCount}</div>
              <div className="text-sm text-gray-600">Важных</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Archive className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-600">{notifications.filter(n => n.isArchived).length}</div>
              <div className="text-sm text-gray-600">В архиве</div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Навигация */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'unread' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Непрочитанные ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('important')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'important' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Важные ({importantCount})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'archived' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Архив
            </button>
          </div>

          {/* Поиск */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск уведомлений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Фильтр по типу */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">Все типы</option>
            <option value="salary">Зарплата</option>
            <option value="vacation">Отпуска</option>
            <option value="penalty">Штрафы</option>
            <option value="bonus">Премии</option>
            <option value="time">Рабочее время</option>
            <option value="cash">Касса</option>
          </select>
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-white border border-gray-300 rounded-lg p-6 shadow-lg transition-all ${
              !notification.isRead ? 'ring-2 ring-gray-200' : ''
            }`}
          >
            <div className="space-y-4">
              {/* Заголовок и теги */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-black' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {notification.isImportant && (
                        <Star className="w-4 h-4 text-gray-500 fill-current" />
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {notification.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        notification.priority === 'urgent' ? 'bg-gray-100 text-gray-800' :
                        notification.priority === 'high' ? 'bg-gray-100 text-gray-800' :
                        notification.priority === 'medium' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.priority === 'urgent' ? 'Срочно' :
                         notification.priority === 'high' ? 'Высокий' :
                         notification.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Действия */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleImportant(notification.id)}
                    className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
                    title={notification.isImportant ? 'Убрать из важных' : 'Отметить как важное'}
                  >
                    {notification.isImportant ? (
                      <Star className="w-4 h-4 fill-current text-gray-500" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                    className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
                    title={notification.isRead ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}
                  >
                    {notification.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => archiveNotification(notification.id)}
                    className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
                    title="Архивировать"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Описание */}
              <div className="space-y-3">
                <p className={`text-gray-600 ${!notification.isRead ? 'font-medium' : ''}`}>
                  {notification.message}
                </p>
                
                {notification.relatedEntity && (
                  <div className="text-sm text-gray-500">
                    <strong>Связано с:</strong> {notification.relatedEntity}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(notification.createdAt)}
                </div>
              </div>
              
              {/* Кнопки действий */}
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex space-x-2 pt-2 border-t border-gray-200">
                  {notification.actions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleNotificationAction(notification.id, action.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        action.type === 'primary' ? 'bg-black text-white hover:bg-gray-800' :
                        action.type === 'danger' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Нет уведомлений, соответствующих фильтрам</p>
            <p className="text-sm">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      {/* Модальное окно настроек */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Настройки уведомлений</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Способы уведомлений */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Способы уведомлений</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                      className="mr-3"
                    />
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.push}
                      onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                      className="mr-3"
                    />
                    <Bell className="w-4 h-4 mr-2 text-gray-600" />
                    Push-уведомления
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sms}
                      onChange={(e) => setSettings(prev => ({ ...prev, sms: e.target.checked }))}
                      className="mr-3"
                    />
                    <Smartphone className="w-4 h-4 mr-2 text-gray-600" />
                    SMS
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.desktop}
                      onChange={(e) => setSettings(prev => ({ ...prev, desktop: e.target.checked }))}
                      className="mr-3"
                    />
                    <Monitor className="w-4 h-4 mr-2 text-gray-600" />
                    Desktop
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sound}
                      onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                      className="mr-3"
                    />
                    <Volume2 className="w-4 h-4 mr-2 text-gray-600" />
                    Звук
                  </label>
                </div>
              </div>

              {/* Категории */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Категории уведомлений</h4>
                <div className="space-y-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, [category]: e.target.checked }
                        }))}
                        className="mr-3"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Частота */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Частота уведомлений</h4>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="immediate">Немедленно</option>
                  <option value="hourly">Каждый час</option>
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                </select>
              </div>

              {/* Рабочие часы */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.workingHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, workingHours: e.target.checked }))}
                    className="mr-3"
                  />
                  <Clock className="w-4 h-4 mr-2 text-gray-600" />
                  Уведомления только в рабочее время
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
