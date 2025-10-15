"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/Header"
import BurgerMenu from "@/components/BurgerMenu"
import { useLanguage } from "@/contexts/LanguageContext"
import { realEstateObjects, RealEstateObject } from "@/data/realEstateObjects"
import Image from "next/image"
import Link from "next/link"
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Share2, 
  Eye, 
  Download, 
  MapPin, 
  Calendar,
  Calculator,
  Users,
  Star,
  FileText,
  Play,
  TrendingUp,
  QrCode,
  Facebook,
  Instagram,
  Zap,
  Info,
  Bell,
  Cloud
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import MortgageCalculator from "@/components/MortgageCalculator"
import UtilitiesCalculator from "@/components/UtilitiesCalculator"
import AgentChat from "@/components/AgentChat"
import BookingCalendar from "@/components/BookingCalendar"
import DocumentationModal from "@/components/DocumentationModal"
import VideoModal from "@/components/VideoModal"
import PriceChartModal from "@/components/PriceChartModal"
import QRCodeModal from "@/components/QRCodeModal"
import DistrictInfoModal from "@/components/DistrictInfoModal"
import WeatherModal from "@/components/WeatherModal"
import VirtualTourModal from "@/components/VirtualTourModal"

export default function ObjectDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [object, setObject] = useState<RealEstateObject | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [showDocumentation, setShowDocumentation] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showPriceChart, setShowPriceChart] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showUtilitiesCalculator, setShowUtilitiesCalculator] = useState(false)
  const [showDistrictInfo, setShowDistrictInfo] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [showWeather, setShowWeather] = useState(false)

  useEffect(() => {
    if (params.id) {
      const foundObject = realEstateObjects.find(obj => obj.id === parseInt(params.id as string))
      setObject(foundObject || null)
    }
  }, [params.id])

  if (!object) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BurgerMenu />
        <main className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Объект не найден</h1>
              <p className="text-gray-600">Запрашиваемый объект недвижимости не существует</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const images = [
    "/images/object-1.jpg",
    "/images/object-2.jpg", 
    "/images/object-3.jpg",
    "/images/object-4.jpg",
    "/images/object-5.jpg"
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleCall = () => {
    window.open(`tel:+7-800-555-35-35`)
  }

  const handleMessage = () => {
    setShowChat(true)
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: object.title,
        text: `Посмотрите этот объект: ${object.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Ссылка скопирована в буфер обмена')
    }
  }

  const handleRequestViewing = () => {
    setShowBooking(true)
  }

  const handleExportPDF = () => {
    // Генерация PDF будет реализована позже
    alert('Функция экспорта в PDF будет доступна в ближайшее время')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Хлебные крошки */}
          <div className="py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Главная</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/objects">Объекты</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{object.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка - Описание */}
            <div className="space-y-6">
              {/* Заголовок и цена */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{object.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{object.address}</p>
                <div className="text-4xl font-bold text-gray-900 mb-4">{object.price}</div>
                
                {/* Статистика просмотров */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>Просмотрено 127 раз за 7 дней</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>23 человека добавили в избранное</span>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCall}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </button>
                
                <button
                  onClick={handleMessage}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Написать
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`flex items-center px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all ${
                    isFavorite 
                      ? 'bg-white border border-gray-300 text-black' 
                      : 'bg-white border border-gray-300 text-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Поделиться
                </button>
                
                <button
                  onClick={handleRequestViewing}
                  className="flex items-center px-4 py-2 text-black rounded-lg transition-colors"
                  style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Запросить просмотр
                </button>
                
                <button
                  onClick={handleExportPDF}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт в PDF
                </button>
              </div>

              {/* Основные характеристики */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Основные характеристики</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Площадь:</span>
                    <span className="ml-2 font-medium">{object.area}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Этаж:</span>
                    <span className="ml-2 font-medium">{object.floor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Материал:</span>
                    <span className="ml-2 font-medium">{object.material}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Год постройки:</span>
                    <span className="ml-2 font-medium">2018</span>
                  </div>
                </div>
              </div>

              {/* Дополнительные характеристики */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Дополнительные характеристики</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Количество комнат:</span>
                    <span className="ml-2 font-medium">3</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Санузлы:</span>
                    <span className="ml-2 font-medium">2</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Балкон:</span>
                    <span className="ml-2 font-medium">Да</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Парковка:</span>
                    <span className="ml-2 font-medium">Подземная</span>
                  </div>
                </div>
              </div>

              {/* Инфраструктура */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Инфраструктура</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-gray-600 mr-2" />
                    <span>Интернет: Оптоволокно</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                    <span>Подъездные пути: Асфальт</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-600 mr-2" />
                    <span>Консьерж: Круглосуточно</span>
                  </div>
                </div>
              </div>

              {/* Коммуникации */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Коммуникации</h2>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Отопление:</span>
                    <span className="ml-2 font-medium">Центральное</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Водоснабжение:</span>
                    <span className="ml-2 font-medium">Центральное</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Канализация:</span>
                    <span className="ml-2 font-medium">Центральная</span>
                  </div>
                </div>
              </div>

              {/* Условия */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Условия</h2>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Торг:</span>
                    <span className="ml-2 font-medium">Возможен</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Комиссия Метрики:</span>
                    <span className="ml-2 font-medium">3%</span>
                  </div>
                </div>
              </div>

              {/* Описание */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Описание</h2>
                <p className="text-gray-700 leading-relaxed">
                  Просторная трехкомнатная квартира в современном жилом комплексе. 
                  Отличное состояние, современный ремонт. Большие окна, много света. 
                  Удобная планировка, изолированные комнаты. Рядом метро, школы, детские сады.
                </p>
              </div>

              {/* Дополнительные функции */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowMortgageCalculator(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Калькулятор ипотеки
                </button>
                
                <button
                  onClick={() => setShowVirtualTour(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Виртуальный тур
                </button>
                
                <button
                  onClick={() => setShowDocumentation(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Документация
                </button>
                
                <button
                  onClick={() => setShowVideo(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Видео объекта
                </button>
                
                <button
                  onClick={() => setShowPriceChart(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  График цены
                </button>
                
                <button
                  onClick={() => setShowQRCode(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  QR-код
                </button>
                
                <button
                  onClick={() => setShowUtilitiesCalculator(true)}
                  className="flex items-center justify-center px-4 py-3 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                  style={{ backgroundColor: '#fff60b' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Коммунальные платежи
                </button>
                
                <button
                  onClick={() => setShowDistrictInfo(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Info className="w-5 h-5 mr-2" />
                  Информация о районе
                </button>
                
                <button
                  onClick={() => setShowBooking(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Бронирование просмотра
                </button>
                
                <button
                  onClick={() => setShowWeather(true)}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Cloud className="w-5 h-5 mr-2" />
                  Погода на дату просмотра
                </button>
              </div>

              {/* Интеграция с мессенджерами */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Поделиться в мессенджерах</h2>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Telegram
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Viber
                  </button>
                </div>
              </div>

              {/* Интеграция с социальными сетями */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Поделиться в соцсетях</h2>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <Share2 className="w-4 h-4 mr-2" />
                    VK
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <Share2 className="w-4 h-4 mr-2" />
                    Одноклассники
                  </button>
                </div>
              </div>

              {/* Похожие объекты */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Похожие объекты</h2>
                <div className="grid grid-cols-1 gap-4">
                  {realEstateObjects.slice(0, 3).map((similarObject) => (
                    <div key={similarObject.id} className="flex bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{similarObject.title}</h3>
                        <p className="text-sm text-gray-600">{similarObject.address}</p>
                        <p className="text-lg font-bold text-black">{similarObject.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Отзывы и рейтинги */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Отзывы и рейтинги</h2>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Анна К.</span>
                    </div>
                    <p className="text-gray-700">Отличная квартира, все как на фото. Агент очень профессиональный.</p>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Михаил С.</span>
                    </div>
                    <p className="text-gray-700">Хороший район, удобная транспортная доступность.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - Галерея фото */}
            <div className="space-y-4">
              {/* Основное фото */}
              <div className="relative">
                <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={images[currentImageIndex]}
                    alt={object.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Навигация по фото */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  →
                </button>
                
                {/* Счетчик фото */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Превью фото */}
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-gray-400' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Фото ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Интерактивная карта */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Расположение</h2>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Интерактивная карта</p>
                    <p className="text-sm text-gray-500">Google Maps / Yandex / 2GIS</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm shadow-sm hover:shadow-md transition-all">
                    Google Maps
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm shadow-sm hover:shadow-md transition-all">
                    Yandex
                  </button>
                  <button className="px-3 py-1 text-black rounded text-sm shadow-sm hover:shadow-md transition-all"
                    style={{ backgroundColor: '#fff60b' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                  >
                    2GIS
                  </button>
                </div>
              </div>

              {/* Система сравнения */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Сравнение объектов</h2>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                  Добавить к сравнению
                </button>
                <p className="text-sm text-gray-600 mt-2">В списке сравнения: 0 объектов</p>
              </div>

              {/* Уведомления */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Уведомления</h2>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                    style={{ backgroundColor: '#fff60b' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                  >
                    <Bell className="w-4 h-4 inline mr-2" />
                    Уведомлять о похожих объектах
                  </button>
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    <Bell className="w-4 h-4 inline mr-2" />
                    Уведомлять о новых объектах в районе
                  </button>
                </div>
              </div>

              {/* Интеграция с календарем */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-4">Добавить в календарь</h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    Google Calendar
                  </button>
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    Apple Calendar
                  </button>
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                    Outlook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Модальные окна */}
      <MortgageCalculator 
        isOpen={showMortgageCalculator}
        onClose={() => setShowMortgageCalculator(false)}
        propertyPrice={object.price}
      />
      
      <UtilitiesCalculator 
        isOpen={showUtilitiesCalculator}
        onClose={() => setShowUtilitiesCalculator(false)}
      />
      
      <AgentChat 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
      
      <BookingCalendar 
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
      
      <DocumentationModal 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
      
      <VideoModal 
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
      
      <PriceChartModal 
        isOpen={showPriceChart}
        onClose={() => setShowPriceChart(false)}
      />
      
      <QRCodeModal 
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        objectUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />
      
      <DistrictInfoModal 
        isOpen={showDistrictInfo}
        onClose={() => setShowDistrictInfo(false)}
      />
      
      <WeatherModal 
        isOpen={showWeather}
        onClose={() => setShowWeather(false)}
      />
      
      <VirtualTourModal 
        isOpen={showVirtualTour}
        onClose={() => setShowVirtualTour(false)}
      />
    </div>
  )
}
