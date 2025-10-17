"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import BurgerMenu from "@/components/BurgerMenu"
import Header from "@/components/Header"
import ProtectedRoute from "@/components/ProtectedRoute"
import { 
  Users, 
  Building2, 
  FileText, 
  Image, 
  BarChart3, 
  Settings, 
  CheckSquare,
  Bell,
  Shield,
  Database,
  Calendar,
  Mail,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  BarChart,
  CheckSquare as TaskSquare,
  Copy,
  Video,
  Music,
  File,
  Folder,
  Calculator,
  DollarSign,
  UserCheck,
  Receipt,
  Award,
  PieChart,
  ArrowLeft,
  Archive,
  Trash2,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ContentEditor from "@/components/ContentEditor"
import MediaManager from "@/components/MediaManager"
import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import SiteSettingsPanel from "@/components/SiteSettingsPanel"
import ObjectManagementPanel from "@/components/ObjectManagementPanel"
import TaskManagementPanel from "@/components/TaskManagementPanel"
import UserManagementPanel from "@/components/UserManagementPanel"
import TimeTrackingCalendar from "@/components/TimeTrackingCalendar"
import PenaltiesBonusesPanel from "@/components/PenaltiesBonusesPanel"
import CashManagementPanel from "@/components/CashManagementPanel"
import SalaryCalculationPanel from "@/components/SalaryCalculationPanel"
import HRNotificationsPanel from "@/components/HRNotificationsPanel"
import HRReportingPanel from "@/components/HRReportingPanel"

export default function AdminPage() {
  return (
    <ProtectedRoute requiredPermission="admin">
      <AdminPageContent />
    </ProtectedRoute>
  )
}

function AdminPageContent() {
  const { data: session } = useSession()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [hrActiveTab, setHrActiveTab] = useState('dashboard')
  const [showContentEditor, setShowContentEditor] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)
  const [contentCategory, setContentCategory] = useState('all')
  const [contentStatus, setContentStatus] = useState('all')
  const [showMediaManager, setShowMediaManager] = useState(false)
  
  // Mock data
  const stats = {
    totalObjects: 156,
    activeClients: 24,
    employees: 8,
    monthlyDeals: 12,
    pendingTasks: 5,
    newApplications: 3,
    publishedArticles: 45,
    totalUsers: 156
  }

  const recentActivities = [
    { id: 1, type: 'application', message: 'Новая заявка на покупку квартиры', time: '2 мин назад', status: 'new' },
    { id: 2, type: 'task', message: 'Задача "Обновить фото объекта" выполнена', time: '15 мин назад', status: 'completed' },
    { id: 3, type: 'article', message: 'Статья "Рынок недвижимости 2024" опубликована', time: '1 час назад', status: 'published' },
    { id: 4, type: 'user', message: 'Новый пользователь зарегистрирован', time: '2 часа назад', status: 'new' }
  ]

  const quickActions = [
    { id: 1, title: 'Создать статью', icon: <FileText className="w-6 h-6" />, color: 'bg-white border border-gray-300' },
    { id: 2, title: 'Добавить объект', icon: <Building2 className="w-6 h-6" />, color: 'bg-white border border-gray-300' },
    { id: 3, title: 'Загрузить фото', icon: <Image className="w-6 h-6" />, color: 'bg-white border border-gray-300' },
    { id: 4, title: 'Создать задачу', icon: <CheckSquare className="w-6 h-6" />, color: 'bg-white border border-gray-300' },
    { id: 5, title: 'Добавить пользователя', icon: <UserPlus className="w-6 h-6" />, color: 'bg-white border border-gray-300' },
    { id: 6, title: 'Создать отчет', icon: <BarChart className="w-6 h-6" />, color: 'bg-white border border-gray-300' }
  ]

  // Mock данные для контента
  const contentItems = [
    {
      id: 1,
      title: "Рынок недвижимости в 2024 году",
      excerpt: "Анализ текущего состояния рынка недвижимости и прогнозы на будущее",
      category: "blog",
      status: "published",
      views: 1250,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      author: "Администратор",
      tags: ["рынок", "анализ", "2024"],
      language: "ru"
    },
    {
      id: 2,
      title: "Новые возможности для клиентов",
      excerpt: "Расширение сервисов и улучшение качества обслуживания",
      category: "news",
      status: "published",
      views: 890,
      createdAt: "2024-01-18",
      updatedAt: "2024-01-18",
      author: "Администратор",
      tags: ["новости", "сервис"],
      language: "ru"
    },
    {
      id: 3,
      title: "Как правильно выбрать квартиру",
      excerpt: "Подробное руководство по выбору недвижимости для покупки",
      category: "knowledge",
      status: "draft",
      views: 0,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
      author: "Администратор",
      tags: ["покупка", "руководство"],
      language: "ru"
    },
    {
      id: 4,
      title: "Часто задаваемые вопросы",
      excerpt: "Ответы на самые популярные вопросы клиентов",
      category: "faq",
      status: "published",
      views: 2100,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      author: "Администратор",
      tags: ["FAQ", "помощь"],
      language: "ru"
    }
  ]

  const handleCreateContent = () => {
    setSelectedContent(null)
    setShowContentEditor(true)
  }

  const handleEditContent = (content: any) => {
    setSelectedContent(content)
    setShowContentEditor(true)
  }

  const handleSaveContent = async (contentData: any) => {
    // В реальном приложении здесь будет API вызов
    console.log('Сохранение контента:', contentData)
  }

  const handleDeleteContent = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот контент?')) {
      // В реальном приложении здесь будет API вызов
      console.log('Удаление контента:', id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'draft': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'scheduled': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'archived': return 'text-gray-600 bg-gray-50 border border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Опубликовано'
      case 'draft': return 'Черновик'
      case 'scheduled': return 'Запланировано'
      case 'archived': return 'Архив'
      default: return 'Неизвестно'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'blog': return 'Статьи блога'
      case 'news': return 'Новости'
      case 'knowledge': return 'База знаний'
      case 'faq': return 'FAQ'
      case 'policies': return 'Политики'
      default: return 'Неизвестно'
    }
  }

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = contentCategory === 'all' || item.category === contentCategory
    const matchesStatus = contentStatus === 'all' || item.status === contentStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Mock данные для медиафайлов
  const mediaFiles = [
    {
      id: 1,
      name: "hero-bg.jpg",
      type: "image",
      size: 2048576,
      url: "/images/hero-bg.jpg",
      thumbnail: "/images/hero-bg.jpg",
      uploadedAt: "2024-01-15",
      folder: "heroes",
      tags: ["фон", "главная"],
      description: "Фоновое изображение для главной страницы",
      alt: "Фон главной страницы",
      dimensions: { width: 1920, height: 1080 }
    },
    {
      id: 2,
      name: "logo.png",
      type: "image",
      size: 512000,
      url: "/images/logo.png",
      thumbnail: "/images/logo.png",
      uploadedAt: "2024-01-10",
      folder: "branding",
      tags: ["логотип", "бренд"],
      description: "Логотип компании",
      alt: "Логотип МЕТРИКА",
      dimensions: { width: 200, height: 200 }
    },
    {
      id: 3,
      name: "object-1.jpg",
      type: "image",
      size: 1536000,
      url: "/images/object-1.jpg",
      thumbnail: "/images/object-1.jpg",
      uploadedAt: "2024-01-20",
      folder: "objects",
      tags: ["объект", "недвижимость"],
      description: "Фотография объекта недвижимости",
      alt: "Объект недвижимости",
      dimensions: { width: 800, height: 600 }
    },
    {
      id: 4,
      name: "presentation.pdf",
      type: "document",
      size: 5242880,
      url: "/documents/presentation.pdf",
      uploadedAt: "2024-01-18",
      folder: "documents",
      tags: ["презентация", "документ"],
      description: "Презентация компании"
    },
    {
      id: 5,
      name: "company-video.mp4",
      type: "video",
      size: 52428800,
      url: "/videos/company-video.mp4",
      thumbnail: "/images/video-thumb-1.jpg",
      uploadedAt: "2024-01-12",
      folder: "videos",
      tags: ["видео", "компания"],
      description: "Видео о компании"
    }
  ]

  const mediaStats = {
    totalFiles: mediaFiles.length,
    totalSize: mediaFiles.reduce((acc, file) => acc + file.size, 0),
    images: mediaFiles.filter(f => f.type === 'image').length,
    videos: mediaFiles.filter(f => f.type === 'video').length,
    documents: mediaFiles.filter(f => f.type === 'document').length,
    audio: mediaFiles.filter(f => f.type === 'audio').length,
    archives: mediaFiles.filter(f => f.type === 'archive').length
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-gray-500" />
      case 'video': return <Video className="w-8 h-8 text-gray-500" />
      case 'document': return <FileText className="w-8 h-8 text-gray-500" />
      case 'audio': return <Music className="w-8 h-8 text-gray-500" />
      case 'archive': return <Archive className="w-8 h-8 text-gray-500" />
      default: return <File className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок - скрыт для раздела "Кадры и бухгалтерия" */}
          {activeTab !== 'hr' && (
            <div className="mb-8 mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-2">Админ панель МЕТРИКА</h1>
                </div>
                <button className="relative p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingTasks + stats.newApplications}
                  </span>
                </button>
              </div>
            </div>
          )}
            
          {/* Навигация - скрыта для раздела "Кадры и бухгалтерия" */}
          {activeTab !== 'hr' && (
            <div className="mb-8">
              <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab('dashboard')}
                variant={activeTab === 'dashboard' ? 'default' : 'outline'}
                className="flex-1"
              >
                Дашборд
              </Button>
              <Button
                onClick={() => setActiveTab('email')}
                variant={activeTab === 'email' ? 'default' : 'outline'}
                className="flex-1"
              >
                Email
              </Button>
              <Button
                onClick={() => setActiveTab('content')}
                variant={activeTab === 'content' ? 'default' : 'outline'}
                className="flex-1"
              >
                Контент
              </Button>
              <Button
                onClick={() => setActiveTab('objects')}
                variant={activeTab === 'objects' ? 'default' : 'outline'}
                className="flex-1"
              >
                Объекты
              </Button>
              <Button
                onClick={() => setActiveTab('users')}
                variant={activeTab === 'users' ? 'default' : 'outline'}
                className="flex-1"
              >
                Пользователи
              </Button>
              <Button
                onClick={() => setActiveTab('tasks')}
                variant={activeTab === 'tasks' ? 'default' : 'outline'}
                className="flex-1"
              >
                Задачи
              </Button>
              <Button
                onClick={() => setActiveTab('media')}
                variant={activeTab === 'media' ? 'default' : 'outline'}
                className="flex-1"
              >
                Медиа
              </Button>
              <Button
                onClick={() => setActiveTab('analytics')}
                variant={activeTab === 'analytics' ? 'default' : 'outline'}
                className="flex-1"
              >
                Аналитика
              </Button>
              <Button
                onClick={() => setActiveTab('hr')}
                variant={activeTab === 'hr' ? 'default' : 'outline'}
                className="flex-1"
              >
                Кадры и бухгалтерия
              </Button>
              <Button
                onClick={() => setActiveTab('settings')}
                variant={activeTab === 'settings' ? 'default' : 'outline'}
                className="flex-1"
              >
                Настройки
              </Button>
            </div>
            </div>
          )}
            
          {/* Дашборд */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{stats.totalObjects}</div>
                      <div className="text-sm text-gray-600">Всего объектов</div>
                    </div>
                  </div>
            </div>
            
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                      <div className="text-2xl font-bold text-black">{stats.activeClients}</div>
                      <div className="text-sm text-gray-600">Активных клиентов</div>
                    </div>
                  </div>
            </div>
            
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <CheckSquare className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{stats.pendingTasks}</div>
                      <div className="text-sm text-gray-600">Ожидающих задач</div>
                    </div>
            </div>
          </div>
          
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                      <div className="text-2xl font-bold text-black">{stats.publishedArticles}</div>
                      <div className="text-sm text-gray-600">Опубликованных статей</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Быстрые действия</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map(action => (
                    <button
                      key={action.id}
                      className={`${action.color} rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div className="flex justify-center mb-2 text-gray-600">
                        {action.icon}
                      </div>
                      <div className="text-sm font-medium text-black">{action.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Последние активности */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-black mb-4">Последние активности</h2>
              <div className="space-y-3">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            activity.status === 'new' ? 'bg-gray-500' : 
                            activity.status === 'completed' ? 'bg-gray-500' : 'bg-gray-500'
                          }`}></div>
                  <div>
                            <div className="font-medium text-black text-sm">{activity.message}</div>
                            <div className="text-xs text-gray-600">{activity.time}</div>
                  </div>
                        </div>
                        <button className="px-2 py-1 bg-white border border-gray-300 text-black text-xs rounded-lg shadow-sm hover:shadow-md transition-all">
                          <Eye className="w-3 h-3" />
                    </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-black mb-4">Системные уведомления</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                          <div className="font-medium text-black text-sm">Требуется обновление</div>
                          <div className="text-xs text-gray-600">Доступна новая версия системы</div>
                  </div>
                      </div>
                      <button 
                        className="px-3 py-1 text-black text-xs rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                        style={{backgroundColor: '#fff60b'}}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                      >
                        Обновить
                    </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gray-500 mr-3" />
                        <div>
                          <div className="font-medium text-black text-sm">Резервная копия создана</div>
                          <div className="text-xs text-gray-600">Автоматическое резервное копирование</div>
                        </div>
                      </div>
                      <button className="px-2 py-1 bg-white border border-gray-300 text-black text-xs rounded-lg shadow-sm hover:shadow-md transition-all">
                        <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Email */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Управление почтой</h2>
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Открыть почту
              </button>
                </div>
            </div>
            
              {/* Статистика почты */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Mail className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">156</div>
                      <div className="text-sm text-gray-600">Всего писем</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Bell className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                      <div className="text-2xl font-bold text-black">23</div>
                      <div className="text-sm text-gray-600">Непрочитанных</div>
                  </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">8</div>
                      <div className="text-sm text-gray-600">Активных ящиков</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">2.4GB</div>
                      <div className="text-sm text-gray-600">Использовано места</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Управление почтовыми ящиками */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-black">Почтовые ящики</h3>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Создать ящик
                    </button>
            </div>
            
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-black">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-black">Владелец</th>
                        <th className="text-left py-3 px-4 font-medium text-black">Статус</th>
                        <th className="text-left py-3 px-4 font-medium text-black">Писем</th>
                        <th className="text-left py-3 px-4 font-medium text-black">Размер</th>
                        <th className="text-left py-3 px-4 font-medium text-black">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-black">admin@metrika.direct</td>
                        <td className="py-3 px-4 text-gray-600">Администратор</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Активен</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">45</td>
                        <td className="py-3 px-4 text-gray-600">1.2GB</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-black">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-800">
                              <Trash2 className="w-4 h-4" />
                    </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-black">lawyer@metrika.direct</td>
                        <td className="py-3 px-4 text-gray-600">Юрист</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Активен</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">32</td>
                        <td className="py-3 px-4 text-gray-600">890MB</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-black">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-black">manager@metrika.direct</td>
                        <td className="py-3 px-4 text-gray-600">Менеджер</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Приостановлен</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">18</td>
                        <td className="py-3 px-4 text-gray-600">456MB</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-black">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
                
              {/* Быстрые действия */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-black mb-4">Быстрые действия</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-6 h-6 text-gray-600" />
                  <div>
                        <div className="font-medium text-black">Создать ящик</div>
                        <div className="text-sm text-gray-600">Новый почтовый ящик</div>
                  </div>
                    </div>
                    </button>
                  
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center space-x-3">
                      <Database className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="font-medium text-black">Резервная копия</div>
                        <div className="text-sm text-gray-600">Создать бэкап почты</div>
                      </div>
                    </div>
                    </button>
                  
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="font-medium text-black">Настройки</div>
                        <div className="text-sm text-gray-600">Конфигурация почты</div>
                  </div>
                </div>
                  </button>
              </div>
              </div>
            </div>
          )}
              
          {/* Кадры и бухгалтерия */}
          {activeTab === 'hr' && (
            <div className="space-y-6 mt-8">
              {/* Кнопка "Назад" */}
              <div className="mb-6">
              <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад в Админ панель
              </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-black">Кадры и бухгалтерия</h2>
                  <p className="text-gray-600">Управление сотрудниками, зарплатами и рабочим временем</p>
            </div>
          </div>
          
              {/* Навигация */}
              <div className="mb-8">
                <div className="flex gap-2">
              <Button 
                    onClick={() => setHrActiveTab('dashboard')}
                    variant={hrActiveTab === 'dashboard' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Дашборд
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('employees')}
                    variant={hrActiveTab === 'employees' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Сотрудники
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('time')}
                    variant={hrActiveTab === 'time' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Рабочее время
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('salary')}
                    variant={hrActiveTab === 'salary' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Зарплата
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('cash')}
                    variant={hrActiveTab === 'cash' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Касса
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('penalties')}
                    variant={hrActiveTab === 'penalties' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Штрафы и премии
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('notifications')}
                    variant={hrActiveTab === 'notifications' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Уведомления
                  </Button>
                  <Button
                    onClick={() => setHrActiveTab('reports')}
                    variant={hrActiveTab === 'reports' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Отчёты
                  </Button>
                </div>
              </div>
          
              {/* Дашборд */}
              {hrActiveTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Статистика кадров */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                          <div className="text-2xl font-bold text-black">12</div>
                          <div className="text-sm text-gray-600">Сотрудников</div>
                        </div>
                      </div>
                  </div>
                  
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center">
                        <DollarSign className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                          <div className="text-2xl font-bold text-black">₽450,000</div>
                          <div className="text-sm text-gray-600">Фонд зарплат</div>
                        </div>
                      </div>
                  </div>
                  
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-gray-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-black">3</div>
                          <div className="text-sm text-gray-600">В отпуске</div>
                  </div>
                </div>
              </div>
              
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                          <div className="text-2xl font-bold text-black">168</div>
                          <div className="text-sm text-gray-600">Часов в месяц</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Функциональные блоки */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <Clock className="w-6 h-6 text-gray-600 mr-3" />
                        <h3 className="text-lg font-semibold text-black">Учёт рабочего времени</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Отслеживание прихода/ухода сотрудников</p>
                      <button 
                        onClick={() => setHrActiveTab('time')}
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
                        onClick={() => setHrActiveTab('salary')}
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
                        onClick={() => setHrActiveTab('cash')}
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
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-gray-800">Иван Сидоров пришёл на работу</span>
                  </div>
                        <span className="text-sm text-gray-500">09:15</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-gray-800">Начислена зарплата за январь</span>
                        </div>
                        <span className="text-sm text-gray-500">Вчера</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-gray-800">Анна Петрова ушла в отпуск</span>
                        </div>
                        <span className="text-sm text-gray-500">2 дня назад</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Сотрудники */}
              {hrActiveTab === 'employees' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black">Управление сотрудниками</h3>
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <Plus className="w-4 h-4 inline mr-2" />
                      Добавить сотрудника
                    </button>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                    <p className="text-gray-600">Здесь будет список сотрудников с возможностью добавления, редактирования и удаления.</p>
                  </div>
                </div>
              )}

              {/* Рабочее время */}
              {hrActiveTab === 'time' && (
                <TimeTrackingCalendar />
              )}

              {/* Зарплата */}
              {hrActiveTab === 'salary' && (
                <SalaryCalculationPanel />
              )}

              {/* Касса */}
              {hrActiveTab === 'cash' && (
                <CashManagementPanel />
              )}

              {/* Штрафы и премии */}
              {hrActiveTab === 'penalties' && (
                <PenaltiesBonusesPanel />
              )}

              {/* Уведомления */}
              {hrActiveTab === 'notifications' && (
                <HRNotificationsPanel />
              )}

              {/* Отчёты */}
              {hrActiveTab === 'reports' && (
                <HRReportingPanel />
              )}
            </div>
          )}

          {/* Контент */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Статистика контента */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                      <div className="text-2xl font-bold text-black">{contentItems.filter(c => c.category === 'blog').length}</div>
                      <div className="text-sm text-gray-600">Статьи блога</div>
                  </div>
                </div>
              </div>
              
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Bell className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                      <div className="text-2xl font-bold text-black">{contentItems.filter(c => c.category === 'news').length}</div>
                      <div className="text-sm text-gray-600">Новости</div>
                    </div>
                  </div>
                  </div>
                  
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-gray-600 mr-3" />
                  <div>
                      <div className="text-2xl font-bold text-black">{contentItems.filter(c => c.category === 'knowledge').length}</div>
                      <div className="text-sm text-gray-600">База знаний</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{contentItems.filter(c => c.category === 'faq').length}</div>
                      <div className="text-sm text-gray-600">FAQ</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Панель управления */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-black">Управление контентом</h2>
                  <button 
                    onClick={handleCreateContent}
                    className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                    style={{backgroundColor: '#fff60b'}}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Создать контент
                  </button>
                </div>
          
                {/* Поиск и фильтры */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <input
                      type="text"
                        placeholder="Поиск контента..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={contentCategory}
                      onChange={(e) => setContentCategory(e.target.value)}
                      className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                    >
                      <option value="all">Все категории</option>
                      <option value="blog">Статьи блога</option>
                      <option value="news">Новости</option>
                      <option value="knowledge">База знаний</option>
                      <option value="faq">FAQ</option>
                      <option value="policies">Политики</option>
                    </select>
                    
                    <select
                      value={contentStatus}
                      onChange={(e) => setContentStatus(e.target.value)}
                      className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                    >
                      <option value="all">Все статусы</option>
                      <option value="published">Опубликовано</option>
                      <option value="draft">Черновик</option>
                      <option value="scheduled">Запланировано</option>
                      <option value="archived">Архив</option>
                    </select>
                  </div>
                </div>

                {/* Список контента */}
                <div className="space-y-4">
                  {filteredContent.map(item => (
                    <div key={item.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                            <span className="px-2 py-1 bg-white border border-gray-300 text-black text-xs font-medium rounded-full shadow-sm">
                              {getCategoryText(item.category)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{item.excerpt}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {item.views} просмотров
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                            <span className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              {item.language.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditContent(item)}
                            className="px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <Edit className="w-4 h-4 inline mr-1" />
                            Редактировать
                          </button>
                          
                          <button className="px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Просмотр
                          </button>
                          
                          <button className="px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                            <Copy className="w-4 h-4 inline mr-1" />
                            Копировать
                    </button>
                  </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteContent(item.id)}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-600 text-sm rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Удалить
                          </button>
                </div>
              </div>
            </div>
                  ))}
                  
                  {filteredContent.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Контент не найден</h3>
                      <p className="text-gray-500">Попробуйте изменить параметры поиска или создайте новый контент</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Остальные разделы будут добавлены в следующих итерациях */}
          {activeTab === 'objects' && (
            <ObjectManagementPanel />
          )}

          {activeTab === 'users' && (
            <UserManagementPanel />
          )}

          {activeTab === 'tasks' && (
            <TaskManagementPanel />
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Статистика медиафайлов */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <File className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{mediaStats.totalFiles}</div>
                      <div className="text-sm text-gray-600">Всего файлов</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Image className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{mediaStats.images}</div>
                      <div className="text-sm text-gray-600">Изображения</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Video className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{mediaStats.videos}</div>
                      <div className="text-sm text-gray-600">Видео</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{mediaStats.documents}</div>
                      <div className="text-sm text-gray-600">Документы</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Панель управления медиа */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-black">Медиа библиотека</h2>
              <button 
                    onClick={() => setShowMediaManager(true)}
                    className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Управление медиа
              </button>
            </div>

                {/* Общая информация */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
              <div>
                        <div className="font-semibold text-black">Общий размер</div>
                        <div className="text-sm text-gray-600">{formatFileSize(mediaStats.totalSize)}</div>
          </div>
                      <Database className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-black">Последняя загрузка</div>
                        <div className="text-sm text-gray-600">
                          {new Date(Math.max(...mediaFiles.map(f => new Date(f.uploadedAt).getTime()))).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-black">Папки</div>
                        <div className="text-sm text-gray-600">
                          {new Set(mediaFiles.map(f => f.folder)).size} папок
                        </div>
                      </div>
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Быстрые действия */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Быстрые действия</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="bg-white border border-gray-300 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all">
                      <Image className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <div className="text-sm font-medium text-black">Загрузить изображения</div>
                    </button>
                    
                    <button className="bg-white border border-gray-300 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all">
                      <Video className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <div className="text-sm font-medium text-black">Загрузить видео</div>
                    </button>
                    
                    <button className="bg-white border border-gray-300 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all">
                      <FileText className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <div className="text-sm font-medium text-black">Загрузить документы</div>
                    </button>
                    
                    <button className="bg-white border border-gray-300 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all">
                      <Archive className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <div className="text-sm font-medium text-black">Загрузить архивы</div>
                    </button>
                  </div>
                </div>

                {/* Последние загруженные файлы */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Последние загруженные файлы</h3>
                  <div className="space-y-3">
                    {mediaFiles
                      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
                      .slice(0, 5)
                      .map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex items-center justify-center mr-3">
                              {file.thumbnail ? (
                                <img
                                  src={file.thumbnail}
                                  alt={file.alt || file.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                getFileIcon(file.type)
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-black">{file.name}</div>
                              <div className="text-sm text-gray-600">
                                {formatFileSize(file.size)} • {file.folder} • {new Date(file.uploadedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
            
                          <div className="flex items-center gap-2">
                            <button className="px-2 py-1 bg-white border border-gray-300 text-black text-xs rounded-lg shadow-sm hover:shadow-md transition-all">
                              <Eye className="w-3 h-3" />
                            </button>
                            <button className="px-2 py-1 bg-white border border-gray-300 text-black text-xs rounded-lg shadow-sm hover:shadow-md transition-all">
                              <Download className="w-3 h-3" />
                            </button>
                            <button className="px-2 py-1 bg-white border border-gray-300 text-gray-600 text-xs rounded-lg shadow-sm hover:shadow-md transition-all">
                              <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {activeTab === 'settings' && (
            <SiteSettingsPanel />
          )}
        </div>
      </main>

      {/* Редактор контента */}
      <ContentEditor
        isOpen={showContentEditor}
        onClose={() => {
          setShowContentEditor(false)
          setSelectedContent(null)
        }}
        content={selectedContent}
        onSave={handleSaveContent}
      />

      {/* Медиа менеджер */}
      <MediaManager
        isOpen={showMediaManager}
        onClose={() => setShowMediaManager(false)}
        multiple={true}
        acceptedTypes={['image/*', 'video/*', 'application/pdf']}
      />
    </div>
  )
}
