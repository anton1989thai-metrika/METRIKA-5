"use client"

import { debugLog } from "@/lib/logger"

import { useMemo, useState } from "react"
import { 
  BarChart3, 
  TrendingDown, 
  Users, 
  Eye, 
  Download, 
  RefreshCw, 
  Settings, 
  Target,
  Clock,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus,
  X
} from "lucide-react"

interface AnalyticsData {
  period: string
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  newUsers: number
  returningUsers: number
  topPages: Array<{ page: string; views: number; bounceRate: number }>
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>
  deviceTypes: Array<{ device: string; visitors: number; percentage: number }>
  geoData: Array<{ country: string; visitors: number; percentage: number }>
  conversions: number
  conversionRate: number
  revenue: number
}

interface ReportTemplate {
  id: number
  name: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  metrics: string[]
  lastGenerated: string
  isScheduled: boolean
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null)

  // Mock данные аналитики
  const analyticsData = useMemo<AnalyticsData>(() => ({
    period: selectedPeriod,
    visitors: 15420,
    pageViews: 45680,
    bounceRate: 42.5,
    avgSessionDuration: 3.2,
    newUsers: 8920,
    returningUsers: 6500,
    topPages: [
      { page: '/', views: 12500, bounceRate: 38.2 },
      { page: '/objects', views: 8900, bounceRate: 45.1 },
      { page: '/about', views: 5600, bounceRate: 52.3 },
      { page: '/contacts', views: 4200, bounceRate: 48.7 },
      { page: '/blog', views: 3800, bounceRate: 41.9 }
    ],
    trafficSources: [
      { source: 'Google', visitors: 8200, percentage: 53.2 },
      { source: 'Yandex', visitors: 4200, percentage: 27.2 },
      { source: 'Direct', visitors: 1800, percentage: 11.7 },
      { source: 'Social', visitors: 1220, percentage: 7.9 }
    ],
    deviceTypes: [
      { device: 'Desktop', visitors: 8900, percentage: 57.7 },
      { device: 'Mobile', visitors: 5200, percentage: 33.7 },
      { device: 'Tablet', visitors: 1320, percentage: 8.6 }
    ],
    geoData: [
      { country: 'Россия', visitors: 12500, percentage: 81.0 },
      { country: 'Беларусь', visitors: 1200, percentage: 7.8 },
      { country: 'Казахстан', visitors: 800, percentage: 5.2 },
      { country: 'Другие', visitors: 920, percentage: 6.0 }
    ],
    conversions: 156,
    conversionRate: 1.01,
    revenue: 2450000
  }), [selectedPeriod])

  const reportTemplates = useMemo<ReportTemplate[]>(() => [
    {
      id: 1,
      name: 'Ежедневный отчет',
      description: 'Основные метрики за день',
      type: 'daily',
      metrics: ['visitors', 'pageViews', 'bounceRate'],
      lastGenerated: '2024-01-20',
      isScheduled: true
    },
    {
      id: 2,
      name: 'Еженедельный отчет',
      description: 'Анализ за неделю',
      type: 'weekly',
      metrics: ['visitors', 'pageViews', 'conversions', 'revenue'],
      lastGenerated: '2024-01-19',
      isScheduled: true
    },
    {
      id: 3,
      name: 'Месячный отчет',
      description: 'Полный анализ за месяц',
      type: 'monthly',
      metrics: ['visitors', 'pageViews', 'bounceRate', 'conversions', 'revenue', 'topPages'],
      lastGenerated: '2024-01-01',
      isScheduled: true
    },
    {
      id: 4,
      name: 'Отчет по объектам',
      description: 'Анализ популярности объектов',
      type: 'custom',
      metrics: ['topPages', 'conversions'],
      lastGenerated: '2024-01-18',
      isScheduled: false
    }
  ], [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}ч ${mins}м`
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-gray-500" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-gray-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-gray-600'
    if (change < 0) return 'text-gray-600'
    return 'text-gray-600'
  }

  const generateReport = async (template: ReportTemplate) => {
    setIsGeneratingReport(true)
    setSelectedReport(template)
    
    // Симуляция генерации отчета
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGeneratingReport(false)
    // В реальном приложении здесь будет скачивание файла
    debugLog('Отчет сгенерирован:', template.name)
  }

  const periods = useMemo(() => [
    { value: '1d', label: 'Сегодня' },
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '90 дней' },
    { value: 'custom', label: 'Произвольный период' }
  ], [])

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтры */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-black">Аналитика и отчеты</h2>
            <p className="text-gray-600">Анализ эффективности сайта и генерация отчетов</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowReportBuilder(true)}
              className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Создать отчет
            </button>
          </div>
        </div>

        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Посетители</span>
              </div>
              {getChangeIcon(12.5)}
            </div>
            <div className="text-2xl font-bold text-black">{formatNumber(analyticsData.visitors)}</div>
            <div className={`text-sm ${getChangeColor(12.5)}`}>
              +12.5% к прошлому периоду
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Просмотры</span>
              </div>
              {getChangeIcon(8.3)}
            </div>
            <div className="text-2xl font-bold text-black">{formatNumber(analyticsData.pageViews)}</div>
            <div className={`text-sm ${getChangeColor(8.3)}`}>
              +8.3% к прошлому периоду
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Отказы</span>
              </div>
              {getChangeIcon(-5.2)}
            </div>
            <div className="text-2xl font-bold text-black">{analyticsData.bounceRate}%</div>
            <div className={`text-sm ${getChangeColor(-5.2)}`}>
              -5.2% к прошлому периоду
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Время сессии</span>
              </div>
              {getChangeIcon(15.7)}
            </div>
            <div className="text-2xl font-bold text-black">{formatDuration(analyticsData.avgSessionDuration)}</div>
            <div className={`text-sm ${getChangeColor(15.7)}`}>
              +15.7% к прошлому периоду
            </div>
          </div>
        </div>

        {/* Конверсии и доходы */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Конверсии</span>
              </div>
              {getChangeIcon(22.1)}
            </div>
            <div className="text-2xl font-bold text-black">{analyticsData.conversions}</div>
            <div className={`text-sm ${getChangeColor(22.1)}`}>
              +22.1% к прошлому периоду
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Percent className="w-5 h-5 text-indigo-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Конверсия</span>
              </div>
              {getChangeIcon(18.9)}
            </div>
            <div className="text-2xl font-bold text-black">{analyticsData.conversionRate}%</div>
            <div className={`text-sm ${getChangeColor(18.9)}`}>
              +18.9% к прошлому периоду
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600">Доход</span>
              </div>
              {getChangeIcon(25.3)}
            </div>
            <div className="text-2xl font-bold text-black">{formatCurrency(analyticsData.revenue)}</div>
            <div className={`text-sm ${getChangeColor(25.3)}`}>
              +25.3% к прошлому периоду
            </div>
          </div>
        </div>
      </div>

      {/* Графики и детальная аналитика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Топ страницы */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-4">Топ страницы</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-black">{page.page}</div>
                    <div className="text-sm text-gray-600">Отказы: {page.bounceRate}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">{formatNumber(page.views)}</div>
                  <div className="text-sm text-gray-600">просмотров</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Источники трафика */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-4">Источники трафика</h3>
          <div className="space-y-3">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-black">{source.source}</div>
                    <div className="text-sm text-gray-600">{source.percentage}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">{formatNumber(source.visitors)}</div>
                  <div className="text-sm text-gray-600">посетителей</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Устройства и география */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Типы устройств */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-4">Типы устройств</h3>
          <div className="space-y-3">
            {analyticsData.deviceTypes.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-black">{device.device}</div>
                    <div className="text-sm text-gray-600">{device.percentage}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">{formatNumber(device.visitors)}</div>
                  <div className="text-sm text-gray-600">посетителей</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* География */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-4">География</h3>
          <div className="space-y-3">
            {analyticsData.geoData.map((geo, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-black">{geo.country}</div>
                    <div className="text-sm text-gray-600">{geo.percentage}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">{formatNumber(geo.visitors)}</div>
                  <div className="text-sm text-gray-600">посетителей</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Шаблоны отчетов */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-black mb-4">Шаблоны отчетов</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map(template => (
            <div key={template.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-black">{template.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.isScheduled 
                    ? 'text-gray-600 bg-gray-50 border border-gray-200' 
                    : 'text-gray-600 bg-gray-50 border border-gray-200'
                }`}>
                  {template.isScheduled ? 'Авто' : 'Ручной'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="text-xs text-gray-500 mb-4">
                Последний: {new Date(template.lastGenerated).toLocaleDateString('ru-RU')}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => generateReport(template)}
                  disabled={isGeneratingReport && selectedReport?.id === template.id}
                  className="flex-1 px-3 py-2 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all font-medium disabled:opacity-50"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#e6d90a')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#fff60b')}
                >
                  {isGeneratingReport && selectedReport?.id === template.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 inline mr-1" />
                      Скачать
                    </>
                  )}
                </button>
                
                <button className="px-3 py-2 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно создания отчета */}
      {showReportBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h3 className="text-lg font-semibold text-black">Создать отчет</h3>
              <button
                onClick={() => setShowReportBuilder(false)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Название отчета</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Введите название отчета..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Период</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white">
                    <option value="daily">Ежедневный</option>
                    <option value="weekly">Еженедельный</option>
                    <option value="monthly">Ежемесячный</option>
                    <option value="custom">Произвольный</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Метрики</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['visitors', 'pageViews', 'bounceRate', 'conversions', 'revenue', 'topPages'].map(metric => (
                      <label key={metric} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  Создать отчет
                </button>
                <button
                  onClick={() => setShowReportBuilder(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
