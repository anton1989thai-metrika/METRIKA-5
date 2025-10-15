"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Upload,
  X,
  Image as ImageIcon,
  File,
  Trash2,
  Save,
  Eye,
  Plus,
  MapPin,
  User,
  DollarSign,
  Home,
  Building,
  LandPlot,
  Store,
  Factory,
  Share,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Globe,
  AlertTriangle,
  MessageSquare,
  Bell,
  BarChart,
  DollarSign,
  ExternalLink,
  Settings,
  Search,
  Filter,
  Edit,
  Download,
  RefreshCw,
  Bell,
  BarChart,
  DollarSign,
  ExternalLink,
  Database,
  BarChart,
  DollarSign,
  ExternalLink,
  Cog,
  Video,
  Music,
  Folder,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  MessageSquare,
  Bell,
  BarChart,
  DollarSign,
  ExternalLink,
  AlertTriangle,
  MessageSquare,
  Bell,
  BarChart,
  DollarSign,
  ExternalLink,
  Link,
  Target,
  Layers,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Star,
  Calculator,
  Play,
  FileText,
  QrCode,
  Info,
  Cloud,
  Zap,
  Users,
  UserPlus
} from "lucide-react"
import SEOModal from "./SEOModal"
import LocationModal from "./LocationModal"
import CommentsModal from "./CommentsModal"
import IntegrationsModal from "./IntegrationsModal"
import NotificationsModal from "./NotificationsModal"
import AnalyticsModal from "./AnalyticsModal"
import PriceUpdatesModal from "./PriceUpdatesModal"

// Типы объектов недвижимости
const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Квартира', icon: Home, color: 'text-gray-600' },
  { id: 'house', name: 'Дом', icon: Building, color: 'text-gray-600' },
  { id: 'land', name: 'Участок', icon: LandPlot, color: 'text-gray-600' },
  { id: 'commercial', name: 'Коммерция', icon: Store, color: 'text-gray-600' },
  { id: 'building', name: 'Здание', icon: Factory, color: 'text-gray-600' },
  { id: 'nonCapital', name: 'Некопитальный', icon: Building, color: 'text-gray-600' },
  { id: 'shares', name: 'Доля', icon: Share, color: 'text-indigo-600' }
]

// Страны
const COUNTRIES = [
  { id: 'russia', name: 'Россия' },
  { id: 'thailand', name: 'Таиланд' },
  { id: 'china', name: 'Китай' },
  { id: 'south-korea', name: 'Южная Корея' }
]

// Типы операций
const OPERATION_TYPES = [
  { id: 'sale', name: 'Продажа' },
  { id: 'rent', name: 'Аренда' }
]

// Агенты
const AGENTS = [
  { id: 'agent1', name: 'Анна Петрова', email: 'anna@metrika.direct' },
  { id: 'agent2', name: 'Михаил Сидоров', email: 'mikhail@metrika.direct' },
  { id: 'agent3', name: 'Елена Козлова', email: 'elena@metrika.direct' },
  { id: 'agent4', name: 'Дмитрий Волков', email: 'dmitry@metrika.direct' }
]

// Интерфейс загруженного файла
interface UploadedFile {
  id: string
  file: File
  preview: string
  size: string
  name: string
}

// Интерфейс формы объекта
interface ObjectFormData {
  title: string
  address: string
  price: string
  type: string
  country: string
  operation: string
  agent: string
  description: string
  characteristics: {
    area?: string
    floor?: string
    material?: string
    buildYear?: string
    rooms?: string
    bathrooms?: string
    balcony?: string
    parking?: string
    landArea?: string
    floors?: string
    commercialType?: string
    nonCapitalType?: string
    sharesType?: string
  }
  seoData?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogTitle: string
    ogDescription: string
    ogImage: string
    canonicalUrl: string
    robots: string[]
    structuredData: {
      type: string
      name: string
      description: string
      address: string
      price: string
      currency: string
      availability: string
      image: string[]
    }
    schemaMarkup: string
    sitemapPriority: number
    lastModified: string
    alternateLanguages: Array<{
      language: string
      url: string
    }>
  }
  location: {
    latitude?: string
    longitude?: string
    district?: string
    metro?: string
  }
  comments: string
}

interface ObjectCreateFormProps {
  templateId: string
  onClose: () => void
  onSave: (data: ObjectFormData, files: UploadedFile[], action: 'draft' | 'task' | 'publish') => void
}

export default function ObjectCreateForm({ templateId, onClose, onSave }: ObjectCreateFormProps) {
  const [formData, setFormData] = useState<ObjectFormData>({
    title: '',
    address: '',
    price: '',
    type: templateId,
    country: 'russia',
    operation: 'sale',
    agent: 'agent1',
    description: '',
    characteristics: {},
    seoData: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: '',
      robots: ['index', 'follow'],
      structuredData: {
        type: 'RealEstateListing',
        name: '',
        description: '',
        address: '',
        price: '',
        currency: 'RUB',
        availability: 'InStock',
        image: []
      },
      schemaMarkup: '',
      sitemapPriority: 0.8,
      lastModified: new Date().toISOString(),
      alternateLanguages: []
    },
    location: {},
    comments: ''
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showSeoModal, setShowSeoModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false)
  const [showNotificationsModal, setShowNotificationsModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [showPriceUpdatesModal, setShowPriceUpdatesModal] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [canCreateTask, setCanCreateTask] = useState(false)
  const [canPublish, setCanPublish] = useState(false)
  
  // Автосохранение
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Автосохранение черновика
  const autoSaveDraft = useCallback(async () => {
    if (!hasUnsavedChanges || isAutoSaving) return

    setIsAutoSaving(true)
    try {
      // Имитация сохранения в localStorage
      const draftData = {
        formData,
        uploadedFiles: uploadedFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          preview: file.preview
        })),
        timestamp: new Date().toISOString(),
        templateId
      }
      
      localStorage.setItem(`object_draft_${templateId}`, JSON.stringify(draftData))
      setLastAutoSave(new Date())
      setHasUnsavedChanges(false)
      
      console.log('Черновик автосохранен:', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Ошибка автосохранения:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [formData, uploadedFiles, hasUnsavedChanges, isAutoSaving, templateId])

  // Загрузка черновика из localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(`object_draft_${templateId}`)
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft)
        setFormData(draftData.formData)
        setUploadedFiles(draftData.uploadedFiles || [])
        setLastAutoSave(new Date(draftData.timestamp))
        setHasUnsavedChanges(false)
        console.log('Черновик загружен:', draftData.timestamp)
        return true
      }
    } catch (error) {
      console.error('Ошибка загрузки черновика:', error)
    }
    return false
  }, [templateId])

  // Очистка черновика
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`object_draft_${templateId}`)
      setLastAutoSave(null)
      setHasUnsavedChanges(false)
      console.log('Черновик очищен')
    } catch (error) {
      console.error('Ошибка очистки черновика:', error)
    }
  }, [templateId])

  // Отметка об изменениях
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true)
  }, [])

  // Инициализация автосохранения
  useEffect(() => {
    // Загружаем черновик при открытии формы
    if (templateId) {
      const hasDraft = loadDraft()
      if (hasDraft) {
        // Показываем уведомление о загруженном черновике
        console.log('Черновик восстановлен из автосохранения')
      }
    }

    // Настраиваем интервал автосохранения (каждые 30 секунд)
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        autoSaveDraft()
      }
    }, 30000)

    setAutoSaveInterval(interval)

    // Очистка при размонтировании
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [templateId, loadDraft, autoSaveDraft, hasUnsavedChanges])

  // Автосохранение при изменении данных
  useEffect(() => {
    if (hasUnsavedChanges && !isAutoSaving) {
      // Автосохранение через 2 секунды после последнего изменения
      const timeout = setTimeout(() => {
        autoSaveDraft()
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [formData, uploadedFiles, hasUnsavedChanges, isAutoSaving, autoSaveDraft])

  // Предупреждение при закрытии с несохраненными изменениями
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Обработка загрузки файлов
  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview: e.target?.result as string,
            size: formatFileSize(file.size),
            name: file.name
          }
          setUploadedFiles(prev => [...prev, newFile])
          markAsChanged()
        }
        reader.readAsDataURL(file)
      }
    })
  }, [])

  // Drag & Drop обработчики
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }, [handleFileUpload])

  // Обработка выбора файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  // Удаление файла
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    markAsChanged()
  }

  // Обновление формы
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    markAsChanged()
  }

  // Обновление характеристик
  const updateCharacteristics = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [field]: value
      }
    }))
    markAsChanged()
  }

  // Обновление SEO
  const updateSeoData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      seoData: {
        ...prev.seoData,
        [field]: value
      } as any
    }))
    markAsChanged()
  }

  // Обновление локации
  const updateLocation = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
    markAsChanged()
  }

  // Проверка возможности создания задачи
  const checkCanCreateTask = () => {
    const required = ['title', 'address', 'price', 'description']
    const hasRequired = required.every(field => formData[field as keyof ObjectFormData])
    setCanCreateTask(hasRequired)
  }

  // Проверка возможности публикации
  const checkCanPublish = () => {
    const required = ['title', 'address', 'price', 'description']
    const hasRequired = required.every(field => formData[field as keyof ObjectFormData])
    setCanPublish(hasRequired)
  }

  // Обработка сохранения
  const handleSave = (action: 'draft' | 'task' | 'publish') => {
    if (action === 'task' && !canCreateTask) return
    if (action === 'publish' && !canPublish) return
    
    // Очищаем черновик при успешном сохранении
    clearDraft()
    onSave(formData, uploadedFiles, action)
  }

  // Получение характеристик для текущего типа
  const getCharacteristicsForType = () => {
    switch (templateId) {
      case 'apartment':
        return [
          { key: 'area', label: 'Площадь', placeholder: '65 м²' },
          { key: 'floor', label: 'Этаж', placeholder: '7/12' },
          { key: 'material', label: 'Материал', placeholder: 'Панель' },
          { key: 'buildYear', label: 'Год постройки', placeholder: '2018' },
          { key: 'rooms', label: 'Количество комнат', placeholder: '3' },
          { key: 'bathrooms', label: 'Санузлы', placeholder: '2' },
          { key: 'balcony', label: 'Балкон', placeholder: 'Да' },
          { key: 'parking', label: 'Парковка', placeholder: 'Подземная' }
        ]
      case 'house':
        return [
          { key: 'area', label: 'Площадь дома', placeholder: '120 м²' },
          { key: 'landArea', label: 'Площадь участка', placeholder: '600 м²' },
          { key: 'floors', label: 'Этажность', placeholder: '2' },
          { key: 'material', label: 'Материал', placeholder: 'Кирпич' },
          { key: 'buildYear', label: 'Год постройки', placeholder: '2015' },
          { key: 'rooms', label: 'Количество комнат', placeholder: '5' },
          { key: 'bathrooms', label: 'Санузлы', placeholder: '2' },
          { key: 'parking', label: 'Парковка', placeholder: 'Гараж' }
        ]
      case 'land':
        return [
          { key: 'landArea', label: 'Площадь участка', placeholder: '1000 м²' },
          { key: 'landUse', label: 'Назначение', placeholder: 'ИЖС' },
          { key: 'material', label: 'Тип участка', placeholder: 'Песок' }
        ]
      case 'commercial':
        return [
          { key: 'area', label: 'Площадь', placeholder: '200 м²' },
          { key: 'commercialType', label: 'Тип коммерции', placeholder: 'Офис' },
          { key: 'floor', label: 'Этаж', placeholder: '1/5' },
          { key: 'buildYear', label: 'Год постройки', placeholder: '2020' },
          { key: 'parking', label: 'Парковка', placeholder: 'Да' }
        ]
      case 'building':
        return [
          { key: 'area', label: 'Площадь здания', placeholder: '5000 м²' },
          { key: 'floors', label: 'Этажность', placeholder: '5' },
          { key: 'material', label: 'Материал', placeholder: 'Монолит' },
          { key: 'buildYear', label: 'Год постройки', placeholder: '2018' },
          { key: 'parking', label: 'Парковка', placeholder: 'Подземная' }
        ]
      case 'nonCapital':
        return [
          { key: 'area', label: 'Площадь', placeholder: '50 м²' },
          { key: 'nonCapitalType', label: 'Тип строения', placeholder: 'Дача' },
          { key: 'material', label: 'Материал', placeholder: 'Дерево' },
          { key: 'buildYear', label: 'Год постройки', placeholder: '2010' }
        ]
      case 'shares':
        return [
          { key: 'area', label: 'Площадь доли', placeholder: '30 м²' },
          { key: 'sharesType', label: 'Тип доли', placeholder: '1/3' },
          { key: 'material', label: 'Материал', placeholder: 'Панель' },
          { key: 'buildYear', label: 'Год постройки', placeholder: '2015' }
        ]
      default:
        return []
    }
  }

  const selectedTemplate = PROPERTY_TYPES.find(t => t.id === templateId)
  const characteristics = getCharacteristicsForType()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            {selectedTemplate && (
              <>
                <selectedTemplate.icon className={`w-6 h-6 ${selectedTemplate.color}`} />
                <h3 className="text-xl font-semibold text-black">
                  Создание объекта: {selectedTemplate.name}
                </h3>
              </>
            )}
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
            { id: 'basic', label: 'Основная информация', icon: FileText },
            { id: 'characteristics', label: 'Характеристики', icon: Settings },
            { id: 'photos', label: 'Фотографии', icon: ImageIcon },
            { id: 'location', label: 'Расположение', icon: MapPin },
            { id: 'seo', label: 'SEO', icon: Globe },
            { id: 'comments', label: 'Комментарии', icon: MessageCircle }
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
          {/* Основная информация */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Название объекта *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="2-комнатная квартира"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Адрес *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="пр. Мира, д. 8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Цена *
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="12 000 000 ₽"
                  />
                </div>

                <div>
                  <label className="medusa-form-label">
                    Страна
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    className="medusa-form-select"
                  >
                    {COUNTRIES.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="medusa-form-label">
                    Тип операции
                  </label>
                  <select
                    value={formData.operation}
                    onChange={(e) => updateFormData('operation', e.target.value)}
                    className="medusa-form-select"
                  >
                    {OPERATION_TYPES.map(operation => (
                      <option key={operation.id} value={operation.id}>{operation.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="medusa-form-label">
                    Агент
                  </label>
                  <select
                    value={formData.agent}
                    onChange={(e) => updateFormData('agent', e.target.value)}
                    className="medusa-form-select"
                  >
                    {AGENTS.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Описание *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="Просторная трехкомнатная квартира в современном жилом комплексе..."
                />
              </div>
            </div>
          )}

          {/* Характеристики */}
          {activeTab === 'characteristics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characteristics.map(char => (
                  <div key={char.key}>
                    <label className="block text-sm font-medium text-black mb-2">
                      {char.label}
                    </label>
                    <input
                      type="text"
                      value={formData.characteristics[char.key as keyof typeof formData.characteristics] || ''}
                      onChange={(e) => updateCharacteristics(char.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      placeholder={char.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Фотографии */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Область загрузки */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-gray-400 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-black mb-2">
                  Перетащите фотографии сюда или
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  Выберите файлы
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Поддерживаются все форматы изображений
                </p>
              </div>

              {/* Список загруженных файлов */}
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                      <div className="relative">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-2 right-2 p-1 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-black truncate">{file.name}</p>
                        <p className="text-gray-600">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Расположение */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Район
                  </label>
                  <input
                    type="text"
                    value={formData.location.district || ''}
                    onChange={(e) => updateLocation('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Центральный район"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Метро
                  </label>
                  <input
                    type="text"
                    value={formData.location.metro || ''}
                    onChange={(e) => updateLocation('metro', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Сокольники"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Широта
                  </label>
                  <input
                    type="text"
                    value={formData.location.latitude || ''}
                    onChange={(e) => updateLocation('latitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="55.7558"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Долгота
                  </label>
                  <input
                    type="text"
                    value={formData.location.longitude || ''}
                    onChange={(e) => updateLocation('longitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="37.6176"
                  />
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Интерактивная карта будет добавлена в следующем этапе
                </p>
                <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Открыть карту
                </button>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Meta заголовок
                </label>
                <input
                  type="text"
                  value={formData.seoData?.metaTitle || ''}
                  onChange={(e) => updateSeoData('metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="Купить квартиру в Москве - 2-комнатная квартира"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Meta описание
                </label>
                <textarea
                  value={formData.seoData?.metaDescription || ''}
                  onChange={(e) => updateSeoData('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="Продается 2-комнатная квартира в центре Москвы..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Ключевые слова
                </label>
                <input
                  type="text"
                  value={formData.seoData?.keywords?.join(', ') || ''}
                  onChange={(e) => updateSeoData('keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="квартира, Москва, продажа, недвижимость"
                />
              </div>
            </div>
          )}

          {/* Комментарии */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Внутренние комментарии
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => updateFormData('comments', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="Комментарии для команды (видны только пользователям с соответствующими правами)..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Индикатор автосохранения */}
        <div className="px-6 py-3 border-t border-gray-300 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              {isAutoSaving && (
                <div className="flex items-center text-gray-600">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Автосохранение...
                </div>
              )}
              {lastAutoSave && !isAutoSaving && (
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Автосохранено {lastAutoSave.toLocaleTimeString()}
                </div>
              )}
              {hasUnsavedChanges && !isAutoSaving && (
                <div className="flex items-center text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Есть несохраненные изменения
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={autoSaveDraft}
                disabled={isAutoSaving || !hasUnsavedChanges}
                className="px-3 py-1 text-xs bg-white border border-gray-300 text-black rounded hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3 h-3 inline mr-1" />
                Сохранить сейчас
              </button>
              <button
                onClick={clearDraft}
                className="px-3 py-1 text-xs bg-white border border-gray-300 text-gray-600 rounded hover:shadow-sm transition-all"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Очистить черновик
              </button>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSeoModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Globe className="w-4 h-4 inline mr-2" />
              SEO-оптимизация
            </button>
            
            <button
              onClick={() => setShowLocationModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Геолокация
            </button>
            
            <button
              onClick={() => setShowCommentsModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Комментарии
            </button>
            
            <button
              onClick={() => setShowIntegrationsModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink className="w-4 h-4 inline mr-2" />
              Интеграции
            </button>
            
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Bell className="w-4 h-4 inline mr-2" />
              Уведомления
            </button>
            
            <button
              onClick={() => setShowAnalyticsModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <BarChart className="w-4 h-4 inline mr-2" />
              Аналитика
            </button>
            
            <button
              onClick={() => setShowPriceUpdatesModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Обновление цен
            </button>
            
            <button
              onClick={() => handleSave('draft')}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Создать черновик
            </button>

            <button
              onClick={() => handleSave('task')}
              disabled={!canCreateTask}
              className={`px-4 py-2 rounded-lg shadow-sm transition-all ${
                canCreateTask
                  ? 'bg-white border border-gray-300 text-black hover:shadow-md'
                  : 'bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Создать задачу
            </button>

            <button
              onClick={() => handleSave('publish')}
              disabled={!canPublish}
              className={`px-4 py-2 rounded-lg shadow-sm transition-all ${
                canPublish
                  ? 'text-black hover:shadow-md'
                  : 'bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={canPublish ? { backgroundColor: '#fff60b' } : {}}
              onMouseEnter={(e) => {
                if (canPublish) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'
                }
              }}
              onMouseLeave={(e) => {
                if (canPublish) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'
                }
              }}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Опубликовать объект
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Отмена
          </button>
        </div>
      </div>

      {/* SEO-модал */}
      <SEOModal
        isOpen={showSeoModal}
        onClose={() => setShowSeoModal(false)}
        onSave={(seoData) => {
          // Сохраняем SEO данные в formData
          setFormData(prev => ({
            ...prev,
            seoData: seoData
          }))
          setShowSeoModal(false)
        }}
        objectData={{
          title: formData.title,
          address: formData.address,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          images: uploadedFiles.map(file => file.preview)
        }}
      />

      {/* LocationModal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSave={(locationData) => {
          // Сохраняем данные геолокации в formData
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              district: locationData.district,
              metro: locationData.metro,
              coordinates: locationData.coordinates,
              accuracy: locationData.accuracy,
              verified: locationData.verified,
              source: locationData.source
            }
          }))
          setShowLocationModal(false)
        }}
        objectAddress={formData.address}
      />

      {/* CommentsModal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        onSave={(comments) => {
          // Сохраняем комментарии в formData
          setFormData(prev => ({
            ...prev,
            comments: comments.map(comment => comment.text).join('\n')
          }))
          setShowCommentsModal(false)
        }}
        objectId={templateId}
        currentUser={{
          id: 'current-user',
          name: 'Текущий пользователь',
          role: 'manager'
        }}
      />

      {/* IntegrationsModal */}
      <IntegrationsModal
        isOpen={showIntegrationsModal}
        onClose={() => setShowIntegrationsModal(false)}
        onSave={(integrations) => {
          // Сохраняем настройки интеграций
          console.log('Интеграции сохранены:', integrations)
          setShowIntegrationsModal(false)
        }}
        objectData={{
          title: formData.title,
          address: formData.address,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          images: uploadedFiles.map(file => file.preview)
        }}
      />

      {/* NotificationsModal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onSave={(notifications, rules) => {
          // Сохраняем настройки уведомлений
          console.log('Уведомления сохранены:', notifications, rules)
          setShowNotificationsModal(false)
        }}
        objectData={{
          id: templateId,
          title: formData.title,
          address: formData.address,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          images: uploadedFiles.map(file => file.preview)
        }}
      {/* AnalyticsModal */}
      <AnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        onSave={(analytics) => {
          // Сохраняем данные аналитики
          console.log('Аналитика сохранена:', analytics)
          setShowAnalyticsModal(false)
        }}
        objectData={{
          id: templateId,
          title: formData.title,
          address: formData.address,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          images: uploadedFiles.map(file => file.preview)
        }}
      />

      {/* PriceUpdatesModal */}
      <PriceUpdatesModal
        isOpen={showPriceUpdatesModal}
        onClose={() => setShowPriceUpdatesModal(false)}
        onSave={(rules, updates, history) => {
          // Сохраняем настройки обновления цен
          console.log('Настройки цен сохранены:', rules, updates, history)
          setShowPriceUpdatesModal(false)
        }}
        objectData={{
          id: templateId,
          title: formData.title,
          address: formData.address,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          images: uploadedFiles.map(file => file.preview)
        }}
      />
    </div>
  )
}
