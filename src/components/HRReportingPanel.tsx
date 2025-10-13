"use client"

import { useState } from "react"
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Eye, 
  FileText, 
  DollarSign, 
  Users, 
  Clock, 
  Award, 
  AlertTriangle, 
  Receipt, 
  Calculator,
  Target,
  Activity,
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
  Upload,
  Bell,
  Settings,
  MoreVertical,
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
  Info,
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
  CreditCard,
  Banknote,
  Wallet,
  Coins,
  HandCoins,
  PiggyBank,
  Timer,
  CalendarDays,
  Clock3,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info as InfoIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Award as AwardIcon,
  AlertTriangle as AlertTriangleIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  MoreVertical as MoreVerticalIcon,
  Archive as ArchiveIcon2,
  Star as StarIcon2,
  StarOff,
  Mail as MailIcon,
  MessageSquare as MessageSquareIcon,
  Phone as PhoneIcon,
  Smartphone as SmartphoneIcon2,
  Monitor as MonitorIcon2,
  Volume2 as Volume2Icon2,
  VolumeX as VolumeXIcon2,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  X as XIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FileText as FileTextIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Eye as EyeIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Calculator as CalculatorIcon,
  Receipt as ReceiptIcon,
  Target as TargetIcon,
  Activity as ActivityIcon
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: 'salary' | 'time' | 'financial' | 'performance' | 'compliance' | 'custom'
  description: string
  createdAt: string
  lastGenerated?: string
  isScheduled: boolean
  schedule?: string
  parameters: ReportParameter[]
  format: 'pdf' | 'excel' | 'csv' | 'json'
  status: 'active' | 'inactive' | 'error'
}

interface ReportParameter {
  id: string
  name: string
  type: 'date' | 'employee' | 'department' | 'amount' | 'text'
  value: any
  required: boolean
}

interface DashboardWidget {
  id: string
  title: string
  type: 'chart' | 'table' | 'metric' | 'kpi'
  data: any
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
}

export default function HRReportingPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'analytics' | 'exports'>('dashboard')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showReportBuilder, setShowReportBuilder] = useState(false)

  // Mock данные для отчётов
  const reports: Report[] = [
    {
      id: '1',
      name: 'Зарплатная ведомость',
      type: 'salary',
      description: 'Детальный отчёт по зарплатам всех сотрудников',
      createdAt: '2024-01-01T00:00:00Z',
      lastGenerated: '2024-01-15T10:30:00Z',
      isScheduled: true,
      schedule: 'monthly',
      parameters: [
        { id: 'period', name: 'Период', type: 'date', value: '2024-01', required: true },
        { id: 'employees', name: 'Сотрудники', type: 'employee', value: 'all', required: false }
      ],
      format: 'pdf',
      status: 'active'
    },
    {
      id: '2',
      name: 'Отчёт по рабочему времени',
      type: 'time',
      description: 'Анализ рабочего времени сотрудников',
      createdAt: '2024-01-01T00:00:00Z',
      lastGenerated: '2024-01-14T15:20:00Z',
      isScheduled: true,
      schedule: 'weekly',
      parameters: [
        { id: 'period', name: 'Период', type: 'date', value: '2024-01', required: true },
        { id: 'department', name: 'Отдел', type: 'department', value: 'all', required: false }
      ],
      format: 'excel',
      status: 'active'
    },
    {
      id: '3',
      name: 'Финансовый отчёт',
      type: 'financial',
      description: 'Отчёт по доходам и расходам компании',
      createdAt: '2024-01-01T00:00:00Z',
      lastGenerated: '2024-01-13T09:15:00Z',
      isScheduled: true,
      schedule: 'monthly',
      parameters: [
        { id: 'period', name: 'Период', type: 'date', value: '2024-01', required: true },
        { id: 'categories', name: 'Категории', type: 'text', value: 'all', required: false }
      ],
      format: 'pdf',
      status: 'active'
    },
    {
      id: '4',
      name: 'Отчёт по производительности',
      type: 'performance',
      description: 'Анализ эффективности работы сотрудников',
      createdAt: '2024-01-01T00:00:00Z',
      isScheduled: false,
      parameters: [
        { id: 'period', name: 'Период', type: 'date', value: '2024-01', required: true },
        { id: 'metrics', name: 'Метрики', type: 'text', value: 'all', required: false }
      ],
      format: 'excel',
      status: 'active'
    }
  ]

  // Mock данные для дашборда
  const dashboardData = {
    totalEmployees: 12,
    totalSalary: 450000,
    averageHours: 167,
    totalBonuses: 75000,
    totalPenalties: 5000,
    monthlyGrowth: 12.5,
    attendanceRate: 95.2,
    overtimeHours: 45
  }

  const generateReport = (reportId: string) => {
    console.log(`Генерация отчёта: ${reportId}`)
    // Здесь будет логика генерации отчёта
  }

  const scheduleReport = (reportId: string, schedule: string) => {
    console.log(`Планирование отчёта: ${reportId} с расписанием: ${schedule}`)
    // Здесь будет логика планирования отчёта
  }

  const exportData = (format: string) => {
    console.log(`Экспорт данных в формате: ${format}`)
    // Здесь будет логика экспорта
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'salary':
        return <DollarSign className="w-5 h-5 text-green-600" />
      case 'time':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'financial':
        return <Receipt className="w-5 h-5 text-purple-600" />
      case 'performance':
        return <Target className="w-5 h-5 text-orange-600" />
      case 'compliance':
        return <Shield className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и управление */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Отчёты и аналитика</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowReportBuilder(true)}
            className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Создать отчёт
          </button>
          <button
            onClick={() => exportData('excel')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'dashboard' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Дашборд
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'reports' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Отчёты
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'analytics' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <PieChart className="w-4 h-4 inline mr-2" />
          Аналитика
        </button>
        <button
          onClick={() => setActiveTab('exports')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'exports' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Download className="w-4 h-4 inline mr-2" />
          Экспорты
        </button>
      </div>

      {/* Период */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Период:</label>
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">
            {new Date(selectedPeriod + '-01').toLocaleDateString('ru-RU', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </span>
        </div>
      </div>

      {/* Дашборд */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI карточки */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-black">{dashboardData.totalEmployees}</div>
                  <div className="text-sm text-gray-600">Сотрудников</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-green-600">₽{dashboardData.totalSalary.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Фонд зарплат</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{dashboardData.averageHours}</div>
                  <div className="text-sm text-gray-600">Среднее время</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">+{dashboardData.monthlyGrowth}%</div>
                  <div className="text-sm text-gray-600">Рост за месяц</div>
                </div>
              </div>
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Динамика зарплат</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500">График зарплат</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Распределение времени</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500">Круговая диаграмма</span>
              </div>
            </div>
          </div>

          {/* Таблица активности */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4">Последняя активность</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-gray-800">Зарплата за январь рассчитана</span>
                </div>
                <span className="text-sm text-gray-500">2 часа назад</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-gray-800">Обновлён отчёт по времени</span>
                </div>
                <span className="text-sm text-gray-500">5 часов назад</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Receipt className="w-4 h-4 text-purple-600 mr-3" />
                  <span className="text-gray-800">Создан финансовый отчёт</span>
                </div>
                <span className="text-sm text-gray-500">1 день назад</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Отчёты */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getReportIcon(report.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{report.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status === 'active' ? 'Активен' :
                         report.status === 'inactive' ? 'Неактивен' : 'Ошибка'}
                      </span>
                      {report.isScheduled && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {report.schedule === 'monthly' ? 'Ежемесячно' :
                           report.schedule === 'weekly' ? 'Еженедельно' :
                           report.schedule === 'daily' ? 'Ежедневно' : 'По расписанию'}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    
                    <div className="text-sm text-gray-500">
                      <div>Создан: {new Date(report.createdAt).toLocaleDateString('ru-RU')}</div>
                      {report.lastGenerated && (
                        <div>Последний запуск: {new Date(report.lastGenerated).toLocaleDateString('ru-RU')}</div>
                      )}
                      <div>Формат: {report.format.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generateReport(report.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                  >
                    <RefreshCw className="w-3 h-3 inline mr-1" />
                    Запустить
                  </button>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Просмотр
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
                    <Edit className="w-3 h-3 inline mr-1" />
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Аналитика */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Анализ зарплат</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Средняя зарплата:</span>
                  <span className="font-semibold text-black">₽87,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Медианная зарплата:</span>
                  <span className="font-semibold text-black">₽85,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Разброс зарплат:</span>
                  <span className="font-semibold text-black">₽60,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Коэффициент вариации:</span>
                  <span className="font-semibold text-black">0.69</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Анализ времени</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Среднее время работы:</span>
                  <span className="font-semibold text-black">167 ч/мес</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Переработки:</span>
                  <span className="font-semibold text-black">45 ч/мес</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Процент присутствия:</span>
                  <span className="font-semibold text-black">95.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Опоздания:</span>
                  <span className="font-semibold text-black">3 случая</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4">Тренды и прогнозы</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <div className="text-sm text-gray-600">Рост зарплат</div>
              </div>
              <div className="text-center">
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">-5.2%</div>
                <div className="text-sm text-gray-600">Снижение опозданий</div>
              </div>
              <div className="text-center">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">+8.7%</div>
                <div className="text-sm text-gray-600">Рост производительности</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Экспорты */}
      {activeTab === 'exports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-black">PDF отчёты</h3>
              </div>
              <p className="text-gray-600 mb-4">Экспорт отчётов в PDF формате</p>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Экспорт PDF
              </button>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-black">Excel файлы</h3>
              </div>
              <p className="text-gray-600 mb-4">Экспорт данных в Excel формате</p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Экспорт Excel
              </button>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <PieChart className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-black">CSV данные</h3>
              </div>
              <p className="text-gray-600 mb-4">Экспорт сырых данных в CSV</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Экспорт CSV
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4">История экспортов</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-red-600 mr-3" />
                  <span className="text-gray-800">Зарплатная ведомость за январь 2024</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">PDF • 2.3 MB</div>
                  <div className="text-xs text-gray-400">15 января, 10:30</div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-gray-800">Отчёт по времени за неделю</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Excel • 1.8 MB</div>
                  <div className="text-xs text-gray-400">14 января, 15:20</div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <PieChart className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-gray-800">Финансовые данные</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">CSV • 0.9 MB</div>
                  <div className="text-xs text-gray-400">13 января, 09:15</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания отчёта */}
      {showReportBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Создать отчёт</h3>
              <button
                onClick={() => setShowReportBuilder(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название отчёта
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите название отчёта"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип отчёта
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="salary">Зарплата</option>
                  <option value="time">Рабочее время</option>
                  <option value="financial">Финансовый</option>
                  <option value="performance">Производительность</option>
                  <option value="custom">Пользовательский</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Формат
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Описание отчёта"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportBuilder(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowReportBuilder(false)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
