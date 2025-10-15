"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  MapPin,
  Search,
  Navigation,
  Target,
  Map,
  Globe,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Settings,
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
  Video,
  Music,
  Folder,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Edit,
  Save,
  Download,
  Upload,
  Trash2,
  Edit3,
  FileText,
  Image,
  Link,
  Tag,
  TrendingUp,
  BarChart,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Key,
  KeyRound,
  LockKeyhole,
  UnlockKeyhole,
  Map as MapIcon,
  MapPin as MapPinIcon,
  Navigation as NavigationIcon,
  Target as TargetIcon,
  Globe as GlobeIcon,
  ExternalLink as ExternalLinkIcon,
  Copy as CopyIcon,
  RefreshCw as RefreshCwIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  Loader as LoaderIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateCcw as RotateCcwIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon,
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
  Video as VideoIcon,
  Music as MusicIcon,
  Folder as FolderIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Check as CheckIcon,
  AlertTriangle as AlertTriangleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Trash2 as TrashIcon,
  Edit3 as Edit3Icon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag as TagIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Filter as FilterIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  Grid as GridIcon,
  List as ListIcon,
  MoreVertical as MoreVerticalIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Shield as ShieldIcon,
  ShieldCheck as ShieldCheckIcon,
  Key as KeyIcon,
  KeyRound as KeyRoundIcon,
  LockKeyhole as LockKeyholeIcon,
  UnlockKeyhole as UnlockKeyholeIcon
} from "lucide-react"

interface LocationData {
  latitude: string
  longitude: string
  address: string
  district: string
  metro: string
  city: string
  country: string
  postalCode: string
  street: string
  houseNumber: string
  apartment: string
  floor: string
  entrance: string
  coordinates: {
    lat: number
    lng: number
  }
  accuracy: number
  timestamp: string
  source: 'manual' | 'geocoding' | 'gps'
  verified: boolean
  notes: string
}

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (locationData: LocationData) => void
  initialData?: LocationData
  objectAddress?: string
}

export default function LocationModal({ isOpen, onClose, onSave, initialData, objectAddress }: LocationModalProps) {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: '',
    longitude: '',
    address: '',
    district: '',
    metro: '',
    city: '',
    country: '',
    postalCode: '',
    street: '',
    houseNumber: '',
    apartment: '',
    floor: '',
    entrance: '',
    coordinates: { lat: 0, lng: 0 },
    accuracy: 0,
    timestamp: new Date().toISOString(),
    source: 'manual',
    verified: false,
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('search')
  const [mapProvider, setMapProvider] = useState<'yandex' | 'google' | '2gis'>('yandex')
  const [mapZoom, setMapZoom] = useState(15)
  const [mapCenter, setMapCenter] = useState({ lat: 55.7558, lng: 37.6176 }) // Москва по умолчанию
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [geocodingError, setGeocodingError] = useState('')
  const [gpsError, setGpsError] = useState('')

  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Инициализация данных
  useEffect(() => {
    if (initialData) {
      setLocationData(initialData)
      if (initialData.coordinates.lat && initialData.coordinates.lng) {
        setMapCenter(initialData.coordinates)
      }
    } else if (objectAddress) {
      setLocationData(prev => ({
        ...prev,
        address: objectAddress
      }))
      setSearchQuery(objectAddress)
    }
  }, [initialData, objectAddress])

  // Обновление данных
  const updateLocationData = (field: string, value: any) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Обновление координат
  const updateCoordinates = (lat: number, lng: number) => {
    setLocationData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      coordinates: { lat, lng }
    }))
    setMapCenter({ lat, lng })
  }

  // Поиск адреса (геокодирование)
  const searchAddress = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setGeocodingError('')

    try {
      // Имитация API геокодирования
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResults = [
        {
          address: searchQuery,
          coordinates: { lat: 55.7558 + Math.random() * 0.01, lng: 37.6176 + Math.random() * 0.01 },
          district: 'Центральный',
          metro: 'Красные ворота',
          city: 'Москва',
          country: 'Россия',
          postalCode: '101000',
          street: 'Красные ворота',
          houseNumber: '1',
          accuracy: 95
        },
        {
          address: `${searchQuery}, дом 2`,
          coordinates: { lat: 55.7558 + Math.random() * 0.01, lng: 37.6176 + Math.random() * 0.01 },
          district: 'Центральный',
          metro: 'Красные ворота',
          city: 'Москва',
          country: 'Россия',
          postalCode: '101000',
          street: 'Красные ворота',
          houseNumber: '2',
          accuracy: 90
        }
      ]

      setSearchResults(mockResults)
    } catch (error) {
      setGeocodingError('Ошибка при поиске адреса. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  // Выбор результата поиска
  const selectSearchResult = (result: any) => {
    setLocationData(prev => ({
      ...prev,
      address: result.address,
      latitude: result.coordinates.lat.toString(),
      longitude: result.coordinates.lng.toString(),
      coordinates: result.coordinates,
      district: result.district,
      metro: result.metro,
      city: result.city,
      country: result.country,
      postalCode: result.postalCode,
      street: result.street,
      houseNumber: result.houseNumber,
      source: 'geocoding',
      verified: true,
      timestamp: new Date().toISOString()
    }))
    setMapCenter(result.coordinates)
    setSearchResults([])
    setActiveTab('map')
  }

  // Получение GPS координат
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Геолокация не поддерживается вашим браузером')
      return
    }

    setIsLoading(true)
    setGpsError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        updateCoordinates(latitude, longitude)
        setLocationData(prev => ({
          ...prev,
          accuracy,
          source: 'gps',
          verified: true,
          timestamp: new Date().toISOString()
        }))
        setIsLoading(false)
        setActiveTab('map')
      },
      (error) => {
        setGpsError(`Ошибка получения координат: ${error.message}`)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  // Обратное геокодирование (координаты -> адрес)
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true)
    try {
      // Имитация API обратного геокодирования
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockAddress = `ул. Примерная, д. ${Math.floor(Math.random() * 100)}, Москва`
      setLocationData(prev => ({
        ...prev,
        address: mockAddress,
        city: 'Москва',
        country: 'Россия',
        district: 'Центральный',
        metro: 'Примерная станция'
      }))
    } catch (error) {
      console.error('Ошибка обратного геокодирования:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Клик по карте
  const handleMapClick = (lat: number, lng: number) => {
    updateCoordinates(lat, lng)
    reverseGeocode(lat, lng)
  }

  // Сохранение
  const handleSave = () => {
    onSave(locationData)
    onClose()
  }

  // Копирование координат
  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${locationData.latitude}, ${locationData.longitude}`)
  }

  // Открытие в картах
  const openInMaps = (provider: string) => {
    const { lat, lng } = locationData.coordinates
    let url = ''
    
    switch (provider) {
      case 'yandex':
        url = `https://yandex.ru/maps/?pt=${lng},${lat}&z=${mapZoom}&l=map`
        break
      case 'google':
        url = `https://www.google.com/maps?q=${lat},${lng}&z=${mapZoom}`
        break
      case '2gis':
        url = `https://2gis.ru/moscow/search/${lat},${lng}`
        break
    }
    
    window.open(url, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">Геолокация и карты</h3>
            <div className="flex items-center space-x-2">
              {locationData.verified && (
                <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Проверено
                </div>
              )}
              {locationData.source === 'gps' && (
                <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  <Navigation className="w-3 h-3 inline mr-1" />
                  GPS
                </div>
              )}
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
            { id: 'search', label: 'Поиск адреса', icon: Search },
            { id: 'gps', label: 'GPS координаты', icon: Navigation },
            { id: 'map', label: 'Карта', icon: Map },
            { id: 'details', label: 'Детали', icon: FileText },
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Поиск адреса */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Поиск адреса
                </label>
                <div className="flex space-x-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Введите адрес для поиска..."
                  />
                  <button
                    onClick={searchAddress}
                    disabled={isLoading}
                    className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                    style={{backgroundColor: '#fff60b'}}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                  >
                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
                {geocodingError && (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    {geocodingError}
                  </div>
                )}
              </div>

              {/* Результаты поиска */}
              {searchResults.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-black mb-3">Результаты поиска</h4>
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => selectSearchResult(result)}
                        className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-black mb-1">{result.address}</div>
                            <div className="text-sm text-gray-600 mb-2">
                              {result.district}, {result.metro}
                            </div>
                            <div className="text-xs text-gray-500">
                              Точность: {result.accuracy}%
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GPS координаты */}
          {activeTab === 'gps' && (
            <div className="space-y-6">
              <div className="text-center">
                <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-black mb-2">Получить GPS координаты</h4>
                <p className="text-gray-600 mb-6">
                  Разрешите доступ к геолокации для автоматического определения координат
                </p>
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="px-6 py-3 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <Navigation className="w-5 h-5 mr-2" />}
                  Получить координаты
                </button>
                {gpsError && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    {gpsError}
                  </div>
                )}
              </div>

              {/* Текущие координаты */}
              {locationData.latitude && locationData.longitude && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-black mb-2">Текущие координаты</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Широта</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={locationData.latitude}
                          onChange={(e) => updateLocationData('latitude', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white text-sm"
                        />
                        <button
                          onClick={copyCoordinates}
                          className="p-2 text-gray-600 hover:text-black"
                          title="Копировать координаты"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Долгота</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={locationData.longitude}
                          onChange={(e) => updateLocationData('longitude', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white text-sm"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(locationData.longitude)}
                          className="p-2 text-gray-600 hover:text-black"
                          title="Копировать долготу"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Источник: {locationData.source === 'gps' ? 'GPS' : 'Ручной ввод'} • 
                    Точность: {locationData.accuracy}m • 
                    Время: {new Date(locationData.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Карта */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Интерактивная карта</h4>
                <div className="flex items-center space-x-2">
                  <select
                    value={mapProvider}
                    onChange={(e) => setMapProvider(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white text-sm"
                  >
                    <option value="yandex">Яндекс.Карты</option>
                    <option value="google">Google Maps</option>
                    <option value="2gis">2ГИС</option>
                  </select>
                  <button
                    onClick={() => openInMaps(mapProvider)}
                    className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    <ExternalLink className="w-4 h-4 inline mr-1" />
                    Открыть
                  </button>
                </div>
              </div>

              {/* Заглушка карты */}
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h5 className="text-lg font-medium text-gray-600 mb-2">Карта</h5>
                  <p className="text-gray-500 mb-4">
                    Здесь будет отображаться интерактивная карта
                  </p>
                  <div className="text-sm text-gray-400">
                    Координаты: {locationData.latitude || 'не указаны'}, {locationData.longitude || 'не указаны'}
                  </div>
                </div>
              </div>

              {/* Элементы управления картой */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <ZoomIn className="w-4 h-4 inline mr-1" />
                  Приблизить
                </button>
                <button
                  onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <ZoomOut className="w-4 h-4 inline mr-1" />
                  Отдалить
                </button>
                <button
                  onClick={() => setMapCenter({ lat: 55.7558, lng: 37.6176 })}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Target className="w-4 h-4 inline mr-1" />
                  Центр
                </button>
                <button
                  onClick={() => setMapZoom(15)}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <RotateCcw className="w-4 h-4 inline mr-1" />
                  Сброс
                </button>
              </div>
            </div>
          )}

          {/* Детали адреса */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Детали адреса</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Полный адрес
                  </label>
                  <textarea
                    value={locationData.address}
                    onChange={(e) => updateLocationData('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Введите полный адрес..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Город
                  </label>
                  <input
                    type="text"
                    value={locationData.city}
                    onChange={(e) => updateLocationData('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Москва"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Район
                  </label>
                  <input
                    type="text"
                    value={locationData.district}
                    onChange={(e) => updateLocationData('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Центральный"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Метро
                  </label>
                  <input
                    type="text"
                    value={locationData.metro}
                    onChange={(e) => updateLocationData('metro', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Красные ворота"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Улица
                  </label>
                  <input
                    type="text"
                    value={locationData.street}
                    onChange={(e) => updateLocationData('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Красные ворота"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Номер дома
                  </label>
                  <input
                    type="text"
                    value={locationData.houseNumber}
                    onChange={(e) => updateLocationData('houseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Квартира
                  </label>
                  <input
                    type="text"
                    value={locationData.apartment}
                    onChange={(e) => updateLocationData('apartment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Этаж
                  </label>
                  <input
                    type="text"
                    value={locationData.floor}
                    onChange={(e) => updateLocationData('floor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Подъезд
                  </label>
                  <input
                    type="text"
                    value={locationData.entrance}
                    onChange={(e) => updateLocationData('entrance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Почтовый индекс
                  </label>
                  <input
                    type="text"
                    value={locationData.postalCode}
                    onChange={(e) => updateLocationData('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="101000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Заметки
                </label>
                <textarea
                  value={locationData.notes}
                  onChange={(e) => updateLocationData('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="Дополнительная информация о расположении..."
                />
              </div>
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Настройки геолокации</h4>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-black mb-3">Провайдер карт по умолчанию</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'yandex', name: 'Яндекс.Карты', icon: Map },
                      { id: 'google', name: 'Google Maps', icon: Globe },
                      { id: '2gis', name: '2ГИС', icon: Map }
                    ].map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => setMapProvider(provider.id as any)}
                        className={`p-3 rounded-lg border transition-all ${
                          mapProvider === provider.id
                            ? 'border-black bg-white shadow-md'
                            : 'border-gray-300 bg-white hover:shadow-sm'
                        }`}
                      >
                        <provider.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium text-black">{provider.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-black mb-3">Настройки точности</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Высокая точность GPS</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Кэширование координат</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Автоматическое обновление</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-black mb-3">Интеграции</h5>
                  <div className="space-y-2">
                    <button className="w-full p-3 bg-white border border-gray-300 rounded-lg text-left hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">Яндекс.Карты API</span>
                        <span className="text-xs text-gray-500">Настроить</span>
                      </div>
                    </button>
                    <button className="w-full p-3 bg-white border border-gray-300 rounded-lg text-left hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">Google Maps API</span>
                        <span className="text-xs text-gray-500">Настроить</span>
                      </div>
                    </button>
                    <button className="w-full p-3 bg-white border border-gray-300 rounded-lg text-left hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">2ГИС API</span>
                        <span className="text-xs text-gray-500">Настроить</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
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
              Сохранить локацию
            </button>
            <button
              onClick={copyCoordinates}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Copy className="w-4 h-4 inline mr-2" />
              Копировать координаты
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
