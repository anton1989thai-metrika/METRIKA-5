"use client"

import { useState, useEffect } from "react"
import {
  X,
  Globe,
  Search,
  Eye,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  BarChart,
  Target,
  Zap,
  FileText,
  Image,
  Link,
  Tag,
  TrendingUp,
  Settings,
  Save,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  HelpCircle,
  Lightbulb,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Home,
  Building,
  LandPlot,
  Store,
  Factory,
  Share,
  DollarSign,
  User,
  Users,
  Database,
  Bell,
  Cog,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreVertical,
  Check,
  AlertCircle,
  XCircle,
  PlusCircle,
  MinusCircle,
  Edit3,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ExternalLink as ExternalLinkIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Share2 as Share2Icon,
  MessageCircle as MessageCircleIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Home as HomeIcon,
  Building as BuildingIcon,
  LandPlot as LandPlotIcon,
  Store as StoreIcon,
  Factory as FactoryIcon,
  Share as ShareIcon,
  DollarSign as DollarSignIcon,
  User as UserIcon,
  Users as UsersIcon,
  Database as DatabaseIcon,
  Bell as BellIcon,
  Cog as CogIcon,
  Filter as FilterIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  Grid as GridIcon,
  List as ListIcon,
  MoreVertical as MoreVerticalIcon,
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  PlusCircle as PlusCircleIcon,
  MinusCircle as MinusCircleIcon,
  Edit3 as Edit3Icon
} from "lucide-react"

interface SEOData {
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

interface SEOModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (seoData: SEOData) => void
  initialData?: SEOData
  objectData?: {
    title: string
    address: string
    price: string
    description: string
    type: string
    images: string[]
  }
}

export default function SEOModal({ isOpen, onClose, onSave, initialData, objectData }: SEOModalProps) {
  const [seoData, setSeoData] = useState<SEOData>({
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
  })

  const [newKeyword, setNewKeyword] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const [newLanguageUrl, setNewLanguageUrl] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [seoScore, setSeoScore] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Инициализация данных
  useEffect(() => {
    if (initialData) {
      setSeoData(initialData)
    } else if (objectData) {
      setSeoData(prev => ({
        ...prev,
        metaTitle: `${objectData.title} - ${objectData.address}`,
        metaDescription: objectData.description.substring(0, 160),
        ogTitle: objectData.title,
        ogDescription: objectData.description.substring(0, 200),
        ogImage: objectData.images[0] || '',
        structuredData: {
          ...prev.structuredData,
          name: objectData.title,
          description: objectData.description,
          address: objectData.address,
          price: objectData.price,
          image: objectData.images
        }
      }))
    }
  }, [initialData, objectData])

  // Расчет SEO-оценки
  useEffect(() => {
    let score = 0
    const newSuggestions: string[] = []

    // Проверка заголовка
    if (seoData.metaTitle.length >= 30 && seoData.metaTitle.length <= 60) {
      score += 20
    } else {
      newSuggestions.push('Оптимальная длина заголовка: 30-60 символов')
    }

    // Проверка описания
    if (seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160) {
      score += 20
    } else {
      newSuggestions.push('Оптимальная длина описания: 120-160 символов')
    }

    // Проверка ключевых слов
    if (seoData.keywords.length >= 3 && seoData.keywords.length <= 10) {
      score += 15
    } else {
      newSuggestions.push('Рекомендуется 3-10 ключевых слов')
    }

    // Проверка Open Graph
    if (seoData.ogTitle && seoData.ogDescription && seoData.ogImage) {
      score += 15
    } else {
      newSuggestions.push('Заполните все поля Open Graph')
    }

    // Проверка структурированных данных
    if (seoData.structuredData.name && seoData.structuredData.description && seoData.structuredData.price) {
      score += 15
    } else {
      newSuggestions.push('Заполните структурированные данные')
    }

    // Проверка канонического URL
    if (seoData.canonicalUrl) {
      score += 10
    } else {
      newSuggestions.push('Укажите канонический URL')
    }

    // Проверка изображений
    if (seoData.structuredData.image.length > 0) {
      score += 5
    } else {
      newSuggestions.push('Добавьте изображения для лучшего SEO')
    }

    setSeoScore(score)
    setSuggestions(newSuggestions)
  }, [seoData])

  // Обновление данных
  const updateSeoData = (field: string, value: any) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Обновление структурированных данных
  const updateStructuredData = (field: string, value: any) => {
    setSeoData(prev => ({
      ...prev,
      structuredData: {
        ...prev.structuredData,
        [field]: value
      }
    }))
  }

  // Добавление ключевого слова
  const addKeyword = () => {
    if (newKeyword.trim() && !seoData.keywords.includes(newKeyword.trim())) {
      setSeoData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }))
      setNewKeyword('')
    }
  }

  // Удаление ключевого слова
  const removeKeyword = (keyword: string) => {
    setSeoData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  // Добавление языка
  const addLanguage = () => {
    if (newLanguage.trim() && newLanguageUrl.trim()) {
      setSeoData(prev => ({
        ...prev,
        alternateLanguages: [...prev.alternateLanguages, {
          language: newLanguage.trim(),
          url: newLanguageUrl.trim()
        }]
      }))
      setNewLanguage('')
      setNewLanguageUrl('')
    }
  }

  // Удаление языка
  const removeLanguage = (index: number) => {
    setSeoData(prev => ({
      ...prev,
      alternateLanguages: prev.alternateLanguages.filter((_, i) => i !== index)
    }))
  }

  // Генерация Schema.org разметки
  const generateSchemaMarkup = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": seoData.structuredData.name,
      "description": seoData.structuredData.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": seoData.structuredData.address
      },
      "offers": {
        "@type": "Offer",
        "price": seoData.structuredData.price,
        "priceCurrency": seoData.structuredData.currency,
        "availability": `https://schema.org/${seoData.structuredData.availability}`
      },
      "image": seoData.structuredData.image
    }

    setSeoData(prev => ({
      ...prev,
      schemaMarkup: JSON.stringify(schema, null, 2)
    }))
  }

  // Автогенерация SEO
  const autoGenerateSEO = () => {
    if (objectData) {
      const autoTitle = `${objectData.title} - ${objectData.address} | METRIKA`
      const autoDescription = `${objectData.description.substring(0, 120)}... Купить недвижимость в ${objectData.address}.`
      const autoKeywords = [
        objectData.title.toLowerCase(),
        objectData.address.toLowerCase(),
        'недвижимость',
        'купить',
        objectData.type === 'apartment' ? 'квартира' : 
        objectData.type === 'house' ? 'дом' : 
        objectData.type === 'land' ? 'участок' : 'объект'
      ]

      setSeoData(prev => ({
        ...prev,
        metaTitle: autoTitle,
        metaDescription: autoDescription,
        ogTitle: autoTitle,
        ogDescription: autoDescription,
        keywords: autoKeywords,
        structuredData: {
          ...prev.structuredData,
          name: objectData.title,
          description: objectData.description,
          address: objectData.address,
          price: objectData.price,
          image: objectData.images
        }
      }))
    }
  }

  // Сохранение
  const handleSave = () => {
    onSave(seoData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">SEO-оптимизация</h3>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                seoScore >= 80 ? 'bg-green-100 text-green-800' :
                seoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                SEO: {seoScore}%
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
            { id: 'basic', label: 'Основное', icon: FileText },
            { id: 'social', label: 'Социальные сети', icon: Share2 },
            { id: 'structured', label: 'Структурированные данные', icon: Database },
            { id: 'technical', label: 'Техническое', icon: Settings },
            { id: 'preview', label: 'Предварительный просмотр', icon: Eye }
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
          {/* Основное SEO */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Основные SEO-параметры</h4>
                <button
                  onClick={autoGenerateSEO}
                  className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Автогенерация
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Meta заголовок *
                    <span className="text-gray-500 ml-2">({seoData.metaTitle.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={seoData.metaTitle}
                    onChange={(e) => updateSeoData('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Купить квартиру в Москве - 2-комнатная квартира"
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    Рекомендуется: 30-60 символов
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Meta описание *
                    <span className="text-gray-500 ml-2">({seoData.metaDescription.length}/160)</span>
                  </label>
                  <textarea
                    value={seoData.metaDescription}
                    onChange={(e) => updateSeoData('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Продается 2-комнатная квартира в центре Москвы..."
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    Рекомендуется: 120-160 символов
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Ключевые слова
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Добавить ключевое слово"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seoData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-gray-600 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Канонический URL
                </label>
                <input
                  type="url"
                  value={seoData.canonicalUrl}
                  onChange={(e) => updateSeoData('canonicalUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="https://metrika.direct/objects/123"
                />
              </div>
            </div>
          )}

          {/* Социальные сети */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Open Graph (Facebook, VK)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    OG заголовок
                  </label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => updateSeoData('ogTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Купить квартиру в Москве"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    OG изображение
                  </label>
                  <input
                    type="url"
                    value={seoData.ogImage}
                    onChange={(e) => updateSeoData('ogImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  OG описание
                </label>
                <textarea
                  value={seoData.ogDescription}
                  onChange={(e) => updateSeoData('ogDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="Описание для социальных сетей..."
                />
              </div>
            </div>
          )}

          {/* Структурированные данные */}
          {activeTab === 'structured' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Schema.org разметка</h4>
                <button
                  onClick={generateSchemaMarkup}
                  className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Генерировать
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Тип объекта
                  </label>
                  <select
                    value={seoData.structuredData.type}
                    onChange={(e) => updateStructuredData('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="RealEstateListing">Объект недвижимости</option>
                    <option value="Apartment">Квартира</option>
                    <option value="House">Дом</option>
                    <option value="LandPlot">Земельный участок</option>
                    <option value="CommercialBuilding">Коммерческое здание</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Валюта
                  </label>
                  <select
                    value={seoData.structuredData.currency}
                    onChange={(e) => updateStructuredData('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="RUB">Рубль (RUB)</option>
                    <option value="USD">Доллар (USD)</option>
                    <option value="EUR">Евро (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Доступность
                  </label>
                  <select
                    value={seoData.structuredData.availability}
                    onChange={(e) => updateStructuredData('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="InStock">В наличии</option>
                    <option value="OutOfStock">Нет в наличии</option>
                    <option value="PreOrder">Предзаказ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Приоритет в sitemap
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={seoData.sitemapPriority}
                    onChange={(e) => updateSeoData('sitemapPriority', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  JSON-LD разметка
                </label>
                <textarea
                  value={seoData.schemaMarkup}
                  onChange={(e) => updateSeoData('schemaMarkup', e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white font-mono text-sm"
                  placeholder="JSON-LD разметка будет сгенерирована автоматически..."
                />
              </div>
            </div>
          )}

          {/* Техническое */}
          {activeTab === 'technical' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Технические параметры</h4>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Robots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex', 'notranslate'].map(robot => (
                    <label key={robot} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={seoData.robots.includes(robot)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateSeoData('robots', [...seoData.robots, robot])
                          } else {
                            updateSeoData('robots', seoData.robots.filter(r => r !== robot))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{robot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Альтернативные языки
                </label>
                <div className="space-y-2">
                  {seoData.alternateLanguages.map((lang, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{lang.language}:</span>
                      <span className="text-sm text-gray-800">{lang.url}</span>
                      <button
                        onClick={() => removeLanguage(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Язык (ru, en)"
                  />
                  <input
                    type="url"
                    value={newLanguageUrl}
                    onChange={(e) => setNewLanguageUrl(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="URL"
                  />
                  <button
                    onClick={addLanguage}
                    className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Последнее изменение
                </label>
                <input
                  type="datetime-local"
                  value={seoData.lastModified}
                  onChange={(e) => updateSeoData('lastModified', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                />
              </div>
            </div>
          )}

          {/* Предварительный просмотр */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Предварительный просмотр</h4>

              {/* Google поиск */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <h5 className="font-medium text-black mb-2">Google поиск</h5>
                <div className="space-y-2">
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {seoData.metaTitle || 'Заголовок не указан'}
                  </div>
                  <div className="text-green-600 text-sm">
                    {seoData.canonicalUrl || 'URL не указан'}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {seoData.metaDescription || 'Описание не указано'}
                  </div>
                </div>
              </div>

              {/* Facebook */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <h5 className="font-medium text-black mb-2">Facebook</h5>
                <div className="flex space-x-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    {seoData.ogImage ? (
                      <img src={seoData.ogImage} alt="OG Image" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-black font-medium mb-1">
                      {seoData.ogTitle || 'Заголовок не указан'}
                    </div>
                    <div className="text-gray-600 text-sm mb-2">
                      {seoData.ogDescription || 'Описание не указано'}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {seoData.canonicalUrl || 'URL не указан'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO рекомендации */}
              {suggestions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Рекомендации по улучшению
                  </h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              <Save className="w-4 h-4 inline mr-2" />
              Сохранить SEO
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(seoData.schemaMarkup)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Copy className="w-4 h-4 inline mr-2" />
              Копировать Schema
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
    </div>
  )
}
