"use client"

import { useState } from "react"
import BurgerMenu from "@/components/BurgerMenu"
import Header from "@/components/Header"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { 
  Users, 
  Calculator,
  DollarSign,
  Calendar,
  Clock,
  UserCheck,
  Receipt,
  CreditCard,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  Timer,
  CalendarDays,
  Banknote,
  Wallet,
  Coins,
  HandCoins,
  PiggyBank,
  Building,
  Home,
  LandPlot,
  Store,
  Factory,
  Share,
  MessageCircle,
  Play,
  QrCode,
  Info,
  Cloud,
  Zap,
  Tag,
  Archive,
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
  Laugh,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Bell,
  Shield,
  Database,
  Mail,
  Search,
  Filter,
  UserPlus,
  FilePlus,
  ImagePlus,
  BarChart,
  Cog,
  CheckSquare,
  Globe,
  Copy,
  MoreVertical,
  File,
  Folder as FolderIcon,
  BarChart3,
  Settings,
  FileText,
  Image,
  Building2
} from "lucide-react"
import TimeTrackingCalendar from "@/components/TimeTrackingCalendar"
import PenaltiesBonusesPanel from "@/components/PenaltiesBonusesPanel"
import CashManagementPanel from "@/components/CashManagementPanel"
import SalaryCalculationPanel from "@/components/SalaryCalculationPanel"
import HRNotificationsPanel from "@/components/HRNotificationsPanel"
import HRReportingPanel from "@/components/HRReportingPanel"
import HRPermissionsPanel from "@/components/HRPermissionsPanel"

export default function HRPage() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
    </div>
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/auth/signin')
  }

  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock данные для кадров
  const employees = [
    {
      id: 1,
      name: "Иван Сидоров",
      position: "Менеджер по недвижимости",
      salary: 80000,
      hoursWorked: 168,
      status: "active",
      avatar: "/images/avatar-1.jpg"
    },
    {
      id: 2,
      name: "Анна Петрова",
      position: "Юрист",
      salary: 120000,
      hoursWorked: 160,
      status: "vacation",
      avatar: "/images/avatar-2.jpg"
    },
    {
      id: 3,
      name: "Мария Козлова",
      position: "Бухгалтер",
      salary: 90000,
      hoursWorked: 168,
      status: "active",
      avatar: "/images/avatar-3.jpg"
    },
    {
      id: 4,
      name: "Алексей Иванов",
      position: "Агент",
      salary: 60000,
      hoursWorked: 172,
      status: "active",
      avatar: "/images/avatar-4.jpg"
    }
  ]

  const salaryStats = {
    totalSalary: 350000,
    averageSalary: 87500,
    totalHours: 668,
    averageHours: 167
  }

  const recentActivities = [
    {
      id: 1,
      type: "arrival",
      employee: "Иван Сидоров",
      time: "09:15",
      date: "Сегодня"
    },
    {
      id: 2,
      type: "departure",
      employee: "Анна Петрова",
      time: "18:30",
      date: "Вчера"
    },
    {
      id: 3,
      type: "salary",
      employee: "Все сотрудники",
      time: "10:00",
      date: "2 дня назад"
    },
    {
      id: 4,
      type: "vacation",
      employee: "Мария Козлова",
      time: "09:00",
      date: "3 дня назад"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Кадры и бухгалтерия</h1>
          <p className="text-gray-600">Управление сотрудниками, зарплатами и рабочим временем</p>
        </div>

        {/* Навигация */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Дашборд
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'employees' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Сотрудники
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'time' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Рабочее время
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'salary' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Зарплата
            </button>
            <button
              onClick={() => setActiveTab('cash')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'cash' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Receipt className="w-4 h-4 inline mr-2" />
              Касса
            </button>
            <button
              onClick={() => setActiveTab('penalties')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'penalties' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Штрафы и премии
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Bell className="w-4 h-4 inline mr-2" />
              Уведомления
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'reports' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-2" />
              Отчёты
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'permissions' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-black border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Права доступа
            </button>
          </div>
        </div>

        {/* Дашборд */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">{employees.length}</div>
                    <div className="text-sm text-gray-600">Сотрудников</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">₽{salaryStats.totalSalary.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Фонд зарплат</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">{salaryStats.totalHours}</div>
                    <div className="text-sm text-gray-600">Часов в месяц</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">1</div>
                    <div className="text-sm text-gray-600">В отпуске</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <UserCheck className="w-6 h-6 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-black">Учёт рабочего времени</h3>
                </div>
                <p className="text-gray-600 mb-4">Отслеживание прихода/ухода сотрудников</p>
                <button 
                  onClick={() => setActiveTab('time')}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Открыть календарь
                </button>
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Calculator className="w-6 h-6 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-black">Расчёт зарплаты</h3>
                </div>
                <p className="text-gray-600 mb-4">Автоматический расчёт с возможностью корректировки</p>
                <button 
                  onClick={() => setActiveTab('salary')}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Рассчитать зарплату
                </button>
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Receipt className="w-6 h-6 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-black">Касса и платежи</h3>
                </div>
                <p className="text-gray-600 mb-4">Учёт поступлений и расходов</p>
                <button 
                  onClick={() => setActiveTab('cash')}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Управление кассой
                </button>
              </div>
            </div>

            {/* Последние действия */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Последние действия</h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      {activity.type === 'arrival' && <UserCheck className="w-4 h-4 text-green-600 mr-3" />}
                      {activity.type === 'departure' && <Clock className="w-4 h-4 text-red-600 mr-3" />}
                      {activity.type === 'salary' && <DollarSign className="w-4 h-4 text-blue-600 mr-3" />}
                      {activity.type === 'vacation' && <Calendar className="w-4 h-4 text-yellow-600 mr-3" />}
                      <span className="text-gray-800">{activity.employee}</span>
                      <span className="text-gray-500 ml-2">
                        {activity.type === 'arrival' && 'пришёл на работу'}
                        {activity.type === 'departure' && 'ушёл с работы'}
                        {activity.type === 'salary' && 'начислена зарплата'}
                        {activity.type === 'vacation' && 'ушла в отпуск'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{activity.time}</div>
                      <div className="text-xs text-gray-400">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Сотрудники */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Сотрудники</h2>
              <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Добавить сотрудника
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <div key={employee.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">{employee.name}</h3>
                      <p className="text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Зарплата:</span>
                      <span className="font-semibold text-black">₽{employee.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Часов:</span>
                      <span className="font-semibold text-black">{employee.hoursWorked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Статус:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' :
                        employee.status === 'vacation' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.status === 'active' ? 'Активен' :
                         employee.status === 'vacation' ? 'В отпуске' : 'Неактивен'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Редактировать
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Рабочее время */}
        {activeTab === 'time' && (
          <TimeTrackingCalendar />
        )}

        {/* Зарплата */}
        {activeTab === 'salary' && (
          <SalaryCalculationPanel />
        )}

        {/* Касса */}
        {activeTab === 'cash' && (
          <CashManagementPanel />
        )}

        {/* Штрафы и премии */}
        {activeTab === 'penalties' && (
          <PenaltiesBonusesPanel />
        )}

        {/* Уведомления */}
        {activeTab === 'notifications' && (
          <HRNotificationsPanel />
        )}

        {/* Права доступа */}
        {activeTab === 'permissions' && (
          <HRPermissionsPanel />
        )}
      </div>
    </div>
  )
}
