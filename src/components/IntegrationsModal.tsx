"use client"

import { useState, useEffect } from "react"
import {
  X,
  ExternalLink,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Upload,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Globe,
  Database,
  BarChart,
  Bell,
  Calendar,
  Clock,
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
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Copy,
  Search,
  Filter,
  SortAsc,
  SortDesc,
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

interface Integration {
  id: string
  name: string
  type: 'cian' | 'avito' | 'domclick' | 'yandex' | 'google' | 'facebook' | 'vk' | 'telegram'
  status: 'active' | 'inactive' | 'error' | 'pending'
  apiKey: string
  apiSecret?: string
  webhookUrl?: string
  lastSync: string
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual'
  autoPublish: boolean
  autoUpdate: boolean
  syncFields: string[]
  mapping: Record<string, string>
  statistics: {
    totalObjects: number
    publishedObjects: number
    updatedObjects: number
    errorObjects: number
    lastError?: string
  }
  settings: {
    priceUpdate: boolean
    statusUpdate: boolean
    imageSync: boolean
    descriptionSync: boolean
    contactSync: boolean
  }
}

interface IntegrationsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (integrations: Integration[]) => void
  initialIntegrations?: Integration[]
  objectData?: any
}

export default function IntegrationsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialIntegrations = [],
  objectData
}: IntegrationsModalProps) {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [newIntegration, setNewIntegration] = useState<Partial<Integration>>({
    name: '',
    type: 'cian',
    status: 'inactive',
    apiKey: '',
    syncFrequency: 'daily',
    autoPublish: false,
    autoUpdate: true,
    syncFields: [],
    mapping: {},
    statistics: {
      totalObjects: 0,
      publishedObjects: 0,
      updatedObjects: 0,
      errorObjects: 0
    },
    settings: {
      priceUpdate: true,
      statusUpdate: true,
      imageSync: true,
      descriptionSync: true,
      contactSync: true
    }
  })

  // Типы интеграций
  const integrationTypes = [
    { id: 'cian', name: 'ЦИАН', icon: Home, color: 'text-gray-600', description: 'Крупнейший портал недвижимости в России' },
    { id: 'avito', name: 'Авито', icon: Store, color: 'text-gray-600', description: 'Популярная доска объявлений' },
    { id: 'domclick', name: 'Домклик', icon: Building, color: 'text-gray-600', description: 'Сервис Сбербанка для недвижимости' },
    { id: 'yandex', name: 'Яндекс.Недвижимость', icon: Globe, color: 'text-gray-600', description: 'Поиск недвижимости от Яндекса' },
    { id: 'google', name: 'Google My Business', icon: Globe, color: 'text-gray-600', description: 'Бизнес-профиль в Google' },
    { id: 'facebook', name: 'Facebook', icon: Share, color: 'text-gray-600', description: 'Социальная сеть Facebook' },
    { id: 'vk', name: 'ВКонтакте', icon: Users, color: 'text-gray-600', description: 'Социальная сеть ВКонтакте' },
    { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'text-gray-600', description: 'Мессенджер Telegram' }
  ]

  // Поля для синхронизации
  const syncFields = [
    { id: 'title', name: 'Название', required: true },
    { id: 'price', name: 'Цена', required: true },
    { id: 'description', name: 'Описание', required: true },
    { id: 'address', name: 'Адрес', required: true },
    { id: 'images', name: 'Фотографии', required: true },
    { id: 'characteristics', name: 'Характеристики', required: false },
    { id: 'contact', name: 'Контакты', required: true },
    { id: 'location', name: 'Координаты', required: false },
    { id: 'status', name: 'Статус', required: true },
    { id: 'category', name: 'Категория', required: true }
  ]

  // Добавление новой интеграции
  const addIntegration = () => {
    if (!newIntegration.name || !newIntegration.apiKey) return

    const integration: Integration = {
      id: Date.now().toString(),
      name: newIntegration.name,
      type: newIntegration.type as any,
      status: 'inactive',
      apiKey: newIntegration.apiKey,
      apiSecret: newIntegration.apiSecret,
      webhookUrl: newIntegration.webhookUrl,
      lastSync: new Date().toISOString(),
      syncFrequency: newIntegration.syncFrequency as any,
      autoPublish: newIntegration.autoPublish || false,
      autoUpdate: newIntegration.autoUpdate || true,
      syncFields: newIntegration.syncFields || [],
      mapping: newIntegration.mapping || {},
      statistics: {
        totalObjects: 0,
        publishedObjects: 0,
        updatedObjects: 0,
        errorObjects: 0
      },
      settings: {
        priceUpdate: true,
        statusUpdate: true,
        imageSync: true,
        descriptionSync: true,
        contactSync: true
      }
    }

    setIntegrations(prev => [...prev, integration])
    setNewIntegration({
      name: '',
      type: 'cian',
      status: 'inactive',
      apiKey: '',
      syncFrequency: 'daily',
      autoPublish: false,
      autoUpdate: true,
      syncFields: [],
      mapping: {},
      statistics: {
        totalObjects: 0,
        publishedObjects: 0,
        updatedObjects: 0,
        errorObjects: 0
      },
      settings: {
        priceUpdate: true,
        statusUpdate: true,
        imageSync: true,
        descriptionSync: true,
        contactSync: true
      }
    })
  }

  // Удаление интеграции
  const removeIntegration = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту интеграцию?')) {
      setIntegrations(prev => prev.filter(integration => integration.id !== id))
    }
  }

  // Переключение статуса интеграции
  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'active' ? 'inactive' : 'active' 
          }
        : integration
    ))
  }

  // Синхронизация интеграции
  const syncIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (!integration) return

    setIsSyncing(true)
    setSyncProgress(0)

    try {
      // Имитация синхронизации
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setSyncProgress(i)
      }

      // Обновляем статистику
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              lastSync: new Date().toISOString(),
              statistics: {
                ...integration.statistics,
                totalObjects: integration.statistics.totalObjects + 1,
                publishedObjects: integration.statistics.publishedObjects + 1
              }
            }
          : integration
      ))

      console.log(`Синхронизация ${integration.name} завершена`)
    } catch (error) {
      console.error('Ошибка синхронизации:', error)
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  // Тестирование подключения
  const testConnection = async (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (!integration) return

    try {
      // Имитация тестирования подключения
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'active' }
          : integration
      ))

      alert('Подключение успешно установлено!')
    } catch (error) {
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'error' }
          : integration
      ))
      alert('Ошибка подключения. Проверьте настройки.')
    }
  }

  // Публикация объекта
  const publishObject = async (integrationId: string) => {
    if (!objectData) {
      alert('Нет данных объекта для публикации')
      return
    }

    const integration = integrations.find(i => i.id === integrationId)
    if (!integration) return

    try {
      // Имитация публикации
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              statistics: {
                ...integration.statistics,
                publishedObjects: integration.statistics.publishedObjects + 1
              }
            }
          : integration
      ))

      alert(`Объект успешно опубликован на ${integration.name}`)
    } catch (error) {
      console.error('Ошибка публикации:', error)
      alert('Ошибка при публикации объекта')
    }
  }

  // Сохранение
  const handleSave = () => {
    onSave(integrations)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">Интеграции с внешними сервисами</h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {integrations.filter(i => i.status === 'active').length} активных
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {integrations.length} всего
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
            { id: 'integrations', label: 'Интеграции', icon: Link },
            { id: 'settings', label: 'Настройки', icon: Settings },
            { id: 'sync', label: 'Синхронизация', icon: RefreshCw },
            { id: 'logs', label: 'Логи', icon: FileText }
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
              <h4 className="text-lg font-semibold text-black">Статистика интеграций</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего объектов</p>
                      <p className="text-2xl font-bold text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.totalObjects, 0)}
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Опубликовано</p>
                      <p className="text-2xl font-bold text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.publishedObjects, 0)}
                      </p>
                    </div>
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Обновлено</p>
                      <p className="text-2xl font-bold text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.updatedObjects, 0)}
                      </p>
                    </div>
                    <RefreshCw className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ошибки</p>
                      <p className="text-2xl font-bold text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.errorObjects, 0)}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Активные интеграции */}
              <div>
                <h5 className="text-lg font-semibold text-black mb-4">Активные интеграции</h5>
                <div className="space-y-3">
                  {integrations.filter(i => i.status === 'active').map(integration => {
                    const typeInfo = integrationTypes.find(t => t.id === integration.type)
                    return (
                      <div key={integration.id} className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo?.color || 'text-gray-600'}`}>
                            {typeInfo?.icon && <typeInfo.icon className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="font-medium text-black">{integration.name}</div>
                            <div className="text-sm text-gray-600">{typeInfo?.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-600">
                            {integration.statistics.publishedObjects} объектов
                          </div>
                          <button
                            onClick={() => publishObject(integration.id)}
                            className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                          >
                            <Upload className="w-4 h-4 inline mr-1" />
                            Опубликовать
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Интеграции */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Управление интеграциями</h4>
                <button
                  onClick={() => setIsConfiguring(true)}
                  className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Добавить интеграцию
                </button>
              </div>

              {/* Список интеграций */}
              <div className="space-y-3">
                {integrations.map(integration => {
                  const typeInfo = integrationTypes.find(t => t.id === integration.type)
                  return (
                    <div key={integration.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo?.color || 'text-gray-600'}`}>
                            {typeInfo?.icon && <typeInfo.icon className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="font-medium text-black">{integration.name}</div>
                            <div className="text-sm text-gray-600">{typeInfo?.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            integration.status === 'active' ? 'bg-gray-100 text-gray-800' :
                            integration.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            integration.status === 'error' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {integration.status === 'active' ? 'Активна' :
                             integration.status === 'inactive' ? 'Неактивна' :
                             integration.status === 'error' ? 'Ошибка' : 'Ожидание'}
                          </div>
                          <button
                            onClick={() => toggleIntegration(integration.id)}
                            className={`px-3 py-1 rounded text-sm transition-all ${
                              integration.status === 'active' 
                                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {integration.status === 'active' ? 'Отключить' : 'Включить'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-black">{integration.statistics.totalObjects}</div>
                          <div className="text-xs text-gray-600">Всего</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-black">{integration.statistics.publishedObjects}</div>
                          <div className="text-xs text-gray-600">Опубликовано</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-black">{integration.statistics.updatedObjects}</div>
                          <div className="text-xs text-gray-600">Обновлено</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-black">{integration.statistics.errorObjects}</div>
                          <div className="text-xs text-gray-600">Ошибки</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Последняя синхронизация: {new Date(integration.lastSync).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => testConnection(integration.id)}
                            className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                          >
                            <Check className="w-4 h-4 inline mr-1" />
                            Тест
                          </button>
                          <button
                            onClick={() => syncIntegration(integration.id)}
                            disabled={isSyncing}
                            className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all disabled:opacity-50"
                          >
                            <RefreshCw className={`w-4 h-4 inline mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                            Синхронизация
                          </button>
                          <button
                            onClick={() => removeIntegration(integration.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Форма добавления интеграции */}
              {isConfiguring && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h5 className="text-lg font-semibold text-black mb-4">Добавить новую интеграцию</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Название</label>
                      <input
                        type="text"
                        value={newIntegration.name || ''}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="Моя интеграция с ЦИАН"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Тип сервиса</label>
                      <select
                        value={newIntegration.type || 'cian'}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        {integrationTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                      <input
                        type="password"
                        value={newIntegration.apiKey || ''}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="Введите API ключ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Частота синхронизации</label>
                      <select
                        value={newIntegration.syncFrequency || 'daily'}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, syncFrequency: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="realtime">В реальном времени</option>
                        <option value="hourly">Каждый час</option>
                        <option value="daily">Ежедневно</option>
                        <option value="weekly">Еженедельно</option>
                        <option value="manual">Вручную</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newIntegration.autoPublish || false}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, autoPublish: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Автоматическая публикация</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newIntegration.autoUpdate || true}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, autoUpdate: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Автоматическое обновление</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={addIntegration}
                      className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Добавить
                    </button>
                    <button
                      onClick={() => setIsConfiguring(false)}
                      className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Настройки синхронизации</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Поля для синхронизации</h5>
                  <div className="space-y-2">
                    {syncFields.map(field => (
                      <label key={field.id} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={field.required}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          {field.name}
                          {field.required && <span className="text-gray-500 ml-1">*</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Настройки публикации</h5>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Обновлять цены автоматически</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Синхронизировать статус</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Обновлять фотографии</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Синхронизировать описание</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Обновлять контакты</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Синхронизация */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Синхронизация объектов</h4>
              
              {isSyncing && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">Синхронизация в процессе...</span>
                    <span className="text-sm text-gray-600">{syncProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Быстрые действия</h5>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        integrations.forEach(integration => {
                          if (integration.status === 'active') {
                            syncIntegration(integration.id)
                          }
                        })
                      }}
                      disabled={isSyncing}
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 inline mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                      Синхронизировать все
                    </button>
                    <button
                      onClick={() => {
                        if (objectData) {
                          integrations.forEach(integration => {
                            if (integration.status === 'active') {
                              publishObject(integration.id)
                            }
                          })
                        } else {
                          alert('Нет данных объекта для публикации')
                        }
                      }}
                      className="w-full px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      Опубликовать везде
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Статистика синхронизации</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Всего объектов:</span>
                      <span className="font-medium text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.totalObjects, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Опубликовано:</span>
                      <span className="font-medium text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.publishedObjects, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Обновлено:</span>
                      <span className="font-medium text-black">
                        {integrations.reduce((sum, i) => sum + i.statistics.updatedObjects, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ошибки:</span>
                      <span className="font-medium text-gray-600">
                        {integrations.reduce((sum, i) => sum + i.statistics.errorObjects, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Логи */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Логи синхронизации</h4>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="space-y-3">
                  {[
                    { time: '2024-01-15 14:30:25', action: 'Синхронизация с ЦИАН', status: 'success', message: 'Опубликовано 5 объектов' },
                    { time: '2024-01-15 14:25:10', action: 'Синхронизация с Авито', status: 'error', message: 'Ошибка API: неверный ключ' },
                    { time: '2024-01-15 14:20:15', action: 'Обновление цен', status: 'success', message: 'Обновлено 12 объектов' },
                    { time: '2024-01-15 14:15:30', action: 'Синхронизация с Домклик', status: 'success', message: 'Опубликовано 3 объекта' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-gray-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="text-sm font-medium text-black">{log.action}</div>
                          <div className="text-xs text-gray-600">{log.message}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{log.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="text-sm text-gray-600">
            Активных интеграций: {integrations.filter(i => i.status === 'active').length} из {integrations.length}
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
