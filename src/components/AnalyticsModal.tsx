"use client"

import { useState, useEffect } from "react"
import {
  X,
  BarChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
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
  Archive,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Grid,
  List,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
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

interface AnalyticsData {
  id: string
  objectId: string
  objectTitle: string
  objectType: string
  userId: string
  userName: string
  userRole: 'admin' | 'manager' | 'agent' | 'employee'
  startTime: string
  endTime: string
  duration: number // в минутах
  steps: Array<{
    step: string
    startTime: string
    endTime: string
    duration: number
  }>
  status: 'completed' | 'in_progress' | 'abandoned'
  createdAt: string
  completedAt?: string
}

interface AnalyticsStats {
  totalObjects: number
  totalTime: number
  averageTime: number
  fastestCreation: number
  slowestCreation: number
  completionRate: number
  abandonmentRate: number
  byUser: Array<{
    userId: string
    userName: string
    userRole: string
    objectsCount: number
    totalTime: number
    averageTime: number
    completionRate: number
  }>
  byType: Array<{
    type: string
    count: number
    averageTime: number
    completionRate: number
  }>
  byTimeframe: Array<{
    timeframe: string
    count: number
    averageTime: number
  }>
  trends: {
    daily: Array<{
      date: string
      count: number
      averageTime: number
    }>
    weekly: Array<{
      week: string
      count: number
      averageTime: number
    }>
    monthly: Array<{
      month: string
      count: number
      averageTime: number
    }>
  }
}

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (analytics: AnalyticsData[]) => void
  initialAnalytics?: AnalyticsData[]
  objectData?: any
}

export default function AnalyticsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialAnalytics = [],
  objectData
}: AnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>(initialAnalytics)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedAnalytics, setSelectedAnalytics] = useState<string | null>(null)
  const [filterUser, setFilterUser] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDateRange, setFilterDateRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'duration' | 'created' | 'user' | 'type'>('duration')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isTracking, setIsTracking] = useState(false)
  const [currentSession, setCurrentSession] = useState<AnalyticsData | null>(null)

  // Статистика
  const stats: AnalyticsStats = {
    totalObjects: analytics.length,
    totalTime: analytics.reduce((sum, item) => sum + item.duration, 0),
    averageTime: analytics.length > 0 ? analytics.reduce((sum, item) => sum + item.duration, 0) / analytics.length : 0,
    fastestCreation: analytics.length > 0 ? Math.min(...analytics.map(item => item.duration)) : 0,
    slowestCreation: analytics.length > 0 ? Math.max(...analytics.map(item => item.duration)) : 0,
    completionRate: analytics.length > 0 ? (analytics.filter(item => item.status === 'completed').length / analytics.length) * 100 : 0,
    abandonmentRate: analytics.length > 0 ? (analytics.filter(item => item.status === 'abandoned').length / analytics.length) * 100 : 0,
    byUser: [],
    byType: [],
    byTimeframe: [],
    trends: {
      daily: [],
      weekly: [],
      monthly: []
    }
  }

  // Фильтрация и сортировка
  const filteredAnalytics = analytics
    .filter(item => {
      if (filterUser !== 'all' && item.userId !== filterUser) return false
      if (filterType !== 'all' && item.objectType !== filterType) return false
      if (filterStatus !== 'all' && item.status !== filterStatus) return false
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'duration':
          comparison = a.duration - b.duration
          break
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'user':
          comparison = a.userName.localeCompare(b.userName)
          break
        case 'type':
          comparison = a.objectType.localeCompare(b.objectType)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Начало отслеживания
  const startTracking = () => {
    if (!objectData) return

    const session: AnalyticsData = {
      id: Date.now().toString(),
      objectId: objectData.id || 'new-object',
      objectTitle: objectData.title || 'Новый объект',
      objectType: objectData.type || 'apartment',
      userId: 'current-user',
      userName: 'Текущий пользователь',
      userRole: 'manager',
      startTime: new Date().toISOString(),
      endTime: '',
      duration: 0,
      steps: [],
      status: 'in_progress',
      createdAt: new Date().toISOString()
    }

    setCurrentSession(session)
    setIsTracking(true)
  }

  // Остановка отслеживания
  const stopTracking = (status: 'completed' | 'abandoned' = 'completed') => {
    if (!currentSession) return

    const endTime = new Date().toISOString()
    const duration = Math.round((new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60))

    const completedSession: AnalyticsData = {
      ...currentSession,
      endTime,
      duration,
      status,
      completedAt: endTime
    }

    setAnalytics(prev => [completedSession, ...prev])
    setCurrentSession(null)
    setIsTracking(false)
  }

  // Добавление шага
  const addStep = (stepName: string) => {
    if (!currentSession) return

    const step = {
      step: stepName,
      startTime: new Date().toISOString(),
      endTime: '',
      duration: 0
    }

    setCurrentSession(prev => prev ? {
      ...prev,
      steps: [...prev.steps, step]
    } : null)
  }

  // Завершение шага
  const completeStep = (stepIndex: number) => {
    if (!currentSession || !currentSession.steps[stepIndex]) return

    const endTime = new Date().toISOString()
    const step = currentSession.steps[stepIndex]
    const duration = Math.round((new Date(endTime).getTime() - new Date(step.startTime).getTime()) / (1000 * 60))

    const updatedSteps = [...currentSession.steps]
    updatedSteps[stepIndex] = {
      ...step,
      endTime,
      duration
    }

    setCurrentSession(prev => prev ? {
      ...prev,
      steps: updatedSteps
    } : null)
  }

  // Удаление аналитики
  const deleteAnalytics = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись аналитики?')) {
      setAnalytics(prev => prev.filter(item => item.id !== id))
    }
  }

  // Экспорт данных
  const exportData = () => {
    const csvContent = [
      ['ID', 'Объект', 'Тип', 'Пользователь', 'Начало', 'Конец', 'Длительность (мин)', 'Статус', 'Шаги'].join(','),
      ...analytics.map(item => [
        item.id,
        item.objectTitle,
        item.objectType,
        item.userName,
        item.startTime,
        item.endTime,
        item.duration,
        item.status,
        item.steps.map(s => s.step).join(';')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'analytics_data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Автоматическое начало отслеживания при открытии модала
  useEffect(() => {
    if (isOpen && objectData && !isTracking) {
      startTracking()
    }
  }, [isOpen, objectData])

  // Сохранение
  const handleSave = () => {
    onSave(analytics)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <BarChart className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">Аналитика создания объектов</h3>
            <div className="flex items-center space-x-2">
              {isTracking && (
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Отслеживание активно
                </div>
              )}
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {analytics.length} записей
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {Math.round(stats.averageTime)} мин среднее
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
            { id: 'overview', label: 'Обзор', icon: BarChart },
            { id: 'tracking', label: 'Отслеживание', icon: Clock },
            { id: 'analytics', label: 'Аналитика', icon: TrendingUp },
            { id: 'reports', label: 'Отчеты', icon: FileText },
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
              <h4 className="text-lg font-semibold text-black">Общая статистика</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего объектов</p>
                      <p className="text-2xl font-bold text-black">{stats.totalObjects}</p>
                    </div>
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Общее время</p>
                      <p className="text-2xl font-bold text-black">{Math.round(stats.totalTime)} мин</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Среднее время</p>
                      <p className="text-2xl font-bold text-black">{Math.round(stats.averageTime)} мин</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Завершено</p>
                      <p className="text-2xl font-bold text-black">{Math.round(stats.completionRate)}%</p>
                    </div>
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Текущая сессия */}
              {isTracking && currentSession && (
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="text-lg font-semibold text-black mb-4">Текущая сессия</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Объект</p>
                      <p className="font-medium text-black">{currentSession.objectTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Время начала</p>
                      <p className="font-medium text-black">
                        {new Date(currentSession.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Прошло времени</p>
                      <p className="font-medium text-black">
                        {Math.round((new Date().getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60))} мин
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => stopTracking('completed')}
                      className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Завершить
                    </button>
                    <button
                      onClick={() => stopTracking('abandoned')}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg shadow-sm hover:bg-red-200 transition-all"
                    >
                      <X className="w-4 h-4 inline mr-2" />
                      Отменить
                    </button>
                  </div>
                </div>
              )}

              {/* Последние записи */}
              <div>
                <h5 className="text-lg font-semibold text-black mb-4">Последние записи</h5>
                <div className="space-y-3">
                  {analytics.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in_progress' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-black">{item.objectTitle}</div>
                          <div className="text-sm text-gray-600">
                            {item.userName} • {item.duration} мин • {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.steps.length} шагов
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Отслеживание */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Отслеживание процесса</h4>
                <div className="flex items-center space-x-4">
                  {!isTracking ? (
                    <button
                      onClick={startTracking}
                      className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Начать отслеживание
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Отслеживание активно</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Шаги процесса */}
              {isTracking && currentSession && (
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="text-lg font-semibold text-black mb-4">Шаги создания объекта</h5>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Основная информация', icon: Info },
                      { name: 'Характеристики', icon: Tag },
                      { name: 'Фотографии', icon: Image },
                      { name: 'Расположение', icon: MapPin },
                      { name: 'SEO-оптимизация', icon: Search },
                      { name: 'Комментарии', icon: MessageCircle },
                      { name: 'Интеграции', icon: Link },
                      { name: 'Уведомления', icon: Bell }
                    ].map((step, index) => {
                      const IconComponent = step.icon
                      const stepData = currentSession.steps.find(s => s.step === step.name)
                      const isActive = currentSession.steps.length === index
                      const isCompleted = stepData && stepData.endTime
                      
                      return (
                        <div
                          key={step.name}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isCompleted ? 'bg-green-50 border-green-200' :
                            isActive ? 'bg-yellow-50 border-yellow-200' :
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-500 text-white' :
                              isActive ? 'bg-yellow-500 text-white' :
                              'bg-gray-300 text-gray-600'
                            }`}>
                              {isCompleted ? <Check className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-medium text-black">{step.name}</div>
                              {stepData && (
                                <div className="text-sm text-gray-600">
                                  {stepData.duration} мин
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!stepData && (
                              <button
                                onClick={() => addStep(step.name)}
                                className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                              >
                                Начать
                              </button>
                            )}
                            {stepData && !stepData.endTime && (
                              <button
                                onClick={() => completeStep(index)}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-all"
                              >
                                Завершить
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Аналитика */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Детальная аналитика</h4>
              
              {/* Фильтры */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="all">Все пользователи</option>
                  <option value="current-user">Текущий пользователь</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="all">Все типы</option>
                  <option value="apartment">Квартира</option>
                  <option value="house">Дом</option>
                  <option value="land">Участок</option>
                  <option value="commercial">Коммерция</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="duration">По времени</option>
                  <option value="created">По дате</option>
                  <option value="user">По пользователю</option>
                  <option value="type">По типу</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Таблица аналитики */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Объект</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Пользователь</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Тип</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Время</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статус</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAnalytics.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.objectTitle}</div>
                          <div className="text-sm text-gray-600">{item.steps.length} шагов</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.userName}</div>
                          <div className="text-sm text-gray-600">{item.userRole}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {item.objectType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.duration} мин</div>
                          <div className="text-sm text-gray-600">
                            {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'completed' ? 'Завершено' :
                             item.status === 'in_progress' ? 'В процессе' : 'Отменено'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteAnalytics(item.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-all"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Отчеты */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Отчеты и экспорт</h4>
                <button
                  onClick={exportData}
                  className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Экспорт CSV
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Статистика по пользователям</h5>
                  <div className="space-y-3">
                    {[
                      { name: 'Текущий пользователь', count: analytics.filter(a => a.userId === 'current-user').length, avgTime: 45 },
                      { name: 'Администратор', count: analytics.filter(a => a.userRole === 'admin').length, avgTime: 38 },
                      { name: 'Менеджер', count: analytics.filter(a => a.userRole === 'manager').length, avgTime: 52 }
                    ].map(user => (
                      <div key={user.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-black">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.count} объектов</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-black">{user.avgTime} мин</div>
                          <div className="text-sm text-gray-600">среднее время</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Статистика по типам</h5>
                  <div className="space-y-3">
                    {[
                      { type: 'Квартира', count: analytics.filter(a => a.objectType === 'apartment').length, avgTime: 42 },
                      { type: 'Дом', count: analytics.filter(a => a.objectType === 'house').length, avgTime: 58 },
                      { type: 'Участок', count: analytics.filter(a => a.objectType === 'land').length, avgTime: 35 },
                      { type: 'Коммерция', count: analytics.filter(a => a.objectType === 'commercial').length, avgTime: 67 }
                    ].map(type => (
                      <div key={type.type} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-black">{type.type}</div>
                          <div className="text-sm text-gray-600">{type.count} объектов</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-black">{type.avgTime} мин</div>
                          <div className="text-sm text-gray-600">среднее время</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Настройки аналитики</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Отслеживание</h5>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Автоматическое отслеживание</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Отслеживание шагов</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Отслеживание кликов</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Отслеживание времени на полях</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Уведомления</h5>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Уведомления о завершении</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Уведомления о превышении времени</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Еженедельные отчеты</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Ежемесячные отчеты</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="text-sm text-gray-600">
            Всего записей: {analytics.length} • 
            Среднее время: {Math.round(stats.averageTime)} мин • 
            Завершено: {Math.round(stats.completionRate)}%
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
              Сохранить данные
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
