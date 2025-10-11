"use client"

import { useState, useEffect } from "react"
import BurgerMenu from "@/components/BurgerMenu"
import Header from "@/components/Header"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { 
  BookOpen, 
  Play, 
  FileText, 
  Award, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Search,
  Filter,
  Download,
  Bell,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Trophy,
  GraduationCap,
  Video,
  File,
  TestTube,
  BarChart3,
  Settings,
  User,
  ChevronRight,
  ChevronDown,
  Eye,
  Bookmark,
  Share2,
  MessageCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import CourseModal from "@/components/CourseModal"
import TestModal from "@/components/TestModal"
import NotificationModal from "@/components/NotificationModal"

interface Course {
  id: number
  title: string
  description: string
  category: string
  type: 'operation' | 'stage' | 'role' | 'region'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration: number
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
  rating: number
  students: number
  materials: {
    videos: number
    documents: number
    tests: number
  }
  instructor: string
  deadline?: string
  isRequired: boolean
  tags: string[]
}

interface Test {
  id: number
  title: string
  description: string
  category: string
  questions: number
  timeLimit: number
  attempts: number
  maxAttempts: number
  bestScore: number
  lastScore?: number
  status: 'not-taken' | 'in-progress' | 'passed' | 'failed'
  isRequired: boolean
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  earned: boolean
  earnedDate?: string
  progress: number
  requirement: string
}

export default function AcademyPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  // Mock data
  const courses: Course[] = [
    {
      id: 1,
      title: "Основы недвижимости",
      description: "Базовый курс для новых сотрудников. Изучение основ рынка недвижимости, типов объектов, законодательства.",
      category: "Основы",
      type: "operation",
      level: "beginner",
      duration: 120,
      progress: 75,
      status: "in-progress",
      rating: 4.8,
      students: 156,
      materials: { videos: 8, documents: 12, tests: 3 },
      instructor: "Анна Петрова",
      deadline: "2024-02-15",
      isRequired: true,
      tags: ["продажи", "аренда", "основы"]
    },
    {
      id: 2,
      title: "Работа с клиентами",
      description: "Техники продаж, работа с возражениями, психология клиента, построение долгосрочных отношений.",
      category: "Продажи",
      type: "stage",
      level: "intermediate",
      duration: 90,
      progress: 45,
      status: "in-progress",
      rating: 4.9,
      students: 203,
      materials: { videos: 12, documents: 8, tests: 4 },
      instructor: "Михаил Соколов",
      isRequired: true,
      tags: ["клиенты", "продажи", "коммуникация"]
    },
    {
      id: 3,
      title: "Юридические аспекты",
      description: "Правовые основы сделок с недвижимостью, документооборот, риски и их минимизация.",
      category: "Право",
      type: "role",
      level: "advanced",
      duration: 150,
      progress: 0,
      status: "not-started",
      rating: 4.7,
      students: 89,
      materials: { videos: 15, documents: 20, tests: 5 },
      instructor: "Елена Козлова",
      deadline: "2024-03-01",
      isRequired: true,
      tags: ["право", "документы", "риски"]
    },
    {
      id: 4,
      title: "Коммерческая недвижимость",
      description: "Особенности работы с коммерческими объектами, инвестиционные проекты, аренда офисов.",
      category: "Коммерция",
      type: "operation",
      level: "advanced",
      duration: 180,
      progress: 100,
      status: "completed",
      rating: 4.6,
      students: 67,
      materials: { videos: 20, documents: 15, tests: 6 },
      instructor: "Дмитрий Волков",
      isRequired: false,
      tags: ["коммерция", "инвестиции", "офисы"]
    },
    {
      id: 5,
      title: "Зарубежная недвижимость",
      description: "Особенности работы с недвижимостью в других странах, визовые вопросы, налогообложение.",
      category: "Зарубеж",
      type: "region",
      level: "expert",
      duration: 200,
      progress: 30,
      status: "in-progress",
      rating: 4.5,
      students: 34,
      materials: { videos: 25, documents: 30, tests: 8 },
      instructor: "Ольга Морозова",
      isRequired: false,
      tags: ["зарубеж", "визы", "налоги"]
    }
  ]

  const tests: Test[] = [
    {
      id: 1,
      title: "Тест по основам недвижимости",
      description: "Проверка знаний базовых понятий и законодательства",
      category: "Основы",
      questions: 20,
      timeLimit: 30,
      attempts: 2,
      maxAttempts: 3,
      bestScore: 85,
      lastScore: 85,
      status: "passed",
      isRequired: true
    },
    {
      id: 2,
      title: "Тест по работе с клиентами",
      description: "Оценка навыков коммуникации и продаж",
      category: "Продажи",
      questions: 25,
      timeLimit: 45,
      attempts: 1,
      maxAttempts: 3,
      bestScore: 92,
      lastScore: 92,
      status: "passed",
      isRequired: true
    },
    {
      id: 3,
      title: "Тест по юридическим аспектам",
      description: "Проверка знаний правовых основ сделок",
      category: "Право",
      questions: 30,
      timeLimit: 60,
      attempts: 0,
      maxAttempts: 3,
      bestScore: 0,
      status: "not-taken",
      isRequired: true
    }
  ]

  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Первые шаги",
      description: "Завершите первый курс",
      icon: <Target className="w-8 h-8 text-gray-600" />,
      earned: true,
      earnedDate: "2024-01-15",
      progress: 100,
      requirement: "Завершить 1 курс"
    },
    {
      id: 2,
      title: "Знаток основ",
      description: "Пройдите тест по основам на 90+ баллов",
      icon: <Trophy className="w-8 h-8 text-gray-600" />,
      earned: false,
      progress: 85,
      requirement: "90+ баллов в тесте по основам"
    },
    {
      id: 3,
      title: "Мастер продаж",
      description: "Завершите все курсы по продажам",
      icon: <GraduationCap className="w-8 h-8 text-gray-600" />,
      earned: false,
      progress: 60,
      requirement: "Завершить 3 курса по продажам"
    },
    {
      id: 4,
      title: "Эксперт",
      description: "Достигните уровня эксперт",
      icon: <Award className="w-8 h-8 text-gray-600" />,
      earned: false,
      progress: 25,
      requirement: "Уровень эксперт"
    }
  ]

  const stats = {
    totalCourses: courses.length,
    completedCourses: courses.filter(c => c.status === 'completed').length,
    inProgressCourses: courses.filter(c => c.status === 'in-progress').length,
    totalTests: tests.length,
    passedTests: tests.filter(t => t.status === 'passed').length,
    averageScore: tests.filter(t => t.bestScore > 0).reduce((acc, t) => acc + t.bestScore, 0) / tests.filter(t => t.bestScore > 0).length,
    studyTime: 45, // hours
    level: "Продвинутый",
    nextLevel: "Эксперт",
    levelProgress: 75
  }

  const categories = ["all", "Основы", "Продажи", "Право", "Коммерция", "Зарубеж"]
  const levels = ["all", "beginner", "intermediate", "advanced", "expert"]
  const statuses = ["all", "not-started", "in-progress", "completed"]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
  }

  const handleTestClick = (test: Test) => {
    setSelectedTest(test)
    setShowTestModal(true)
  }
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }
  
  if (!session || (session.user?.role !== "employee" && session.user?.role !== "admin")) {
    redirect("/auth/signin")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-black bg-white border border-black'
      case 'in-progress': return 'text-black bg-white border border-black'
      case 'not-started': return 'text-gray-600 bg-white border border-gray-300'
      default: return 'text-gray-600 bg-white border border-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен'
      case 'in-progress': return 'В процессе'
      case 'not-started': return 'Не начат'
      default: return 'Неизвестно'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Новичок'
      case 'intermediate': return 'Средний'
      case 'advanced': return 'Продвинутый'
      case 'expert': return 'Эксперт'
      default: return 'Неизвестно'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-black bg-white border border-black'
      case 'intermediate': return 'text-black bg-white border border-black'
      case 'advanced': return 'text-black bg-white border border-black'
      case 'expert': return 'text-black bg-white border border-black'
      default: return 'text-black bg-white border border-black'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="mb-8 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Академия МЕТРИКА</h1>
                <p className="text-gray-600">Система обучения и развития сотрудников</p>
              </div>
              <button
                onClick={() => setShowNotificationModal(true)}
                className="relative p-3 bg-white border-2 border-black rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
              </div>

          {/* Навигация */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white text-black border-2 border-black shadow-lg hover:shadow-xl'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Дашборд
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'courses' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white text-black border-2 border-black shadow-lg hover:shadow-xl'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Курсы
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'tests' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white text-black border-2 border-black shadow-lg hover:shadow-xl'
                }`}
              >
                <TestTube className="w-4 h-4 inline mr-2" />
                Тесты
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'achievements' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white text-black border-2 border-black shadow-lg hover:shadow-xl'
                }`}
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                Достижения
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'materials' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white text-black border-2 border-black shadow-lg hover:shadow-xl'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Материалы
              </button>
            </div>
          </div>

          {/* Дашборд */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <BookOpen className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{stats.completedCourses}/{stats.totalCourses}</div>
                      <div className="text-sm text-gray-600">Завершено курсов</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <TestTube className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{stats.passedTests}/{stats.totalTests}</div>
                      <div className="text-sm text-gray-600">Пройдено тестов</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{Math.round(stats.averageScore)}</div>
                      <div className="text-sm text-gray-600">Средний балл</div>
                    </div>
                  </div>
            </div>
            
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">{stats.studyTime}ч</div>
                      <div className="text-sm text-gray-600">Время обучения</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Уровень и прогресс */}
              <div className="bg-black rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Ваш уровень: {stats.level}</h3>
                    <p className="text-gray-300">Следующий уровень: {stats.nextLevel}</p>
                  </div>
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.levelProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  Прогресс: {stats.levelProgress}%
                </div>
              </div>

              {/* Курсы в процессе */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Курсы в процессе</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.filter(c => c.status === 'in-progress').map(course => (
                    <div key={course.id} className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-black">{course.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          {getStatusText(course.status)}
                        </span>
                      </div>
                      <p className="text-black text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Прогресс</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration} мин
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.students}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleCourseClick(course)}
                        className="w-full px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                      >
                Продолжить обучение
              </button>
                    </div>
                  ))}
                </div>
            </div>
            
              {/* Последние достижения */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Последние достижения</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.filter(a => a.earned).map(achievement => (
                    <div key={achievement.id} className="bg-white border-2 border-black rounded-lg p-4 text-center shadow-lg">
                      <div className="mb-2 flex justify-center">{achievement.icon}</div>
                      <h3 className="font-semibold text-black text-sm">{achievement.title}</h3>
                      <p className="text-gray-600 text-xs mt-1">{achievement.description}</p>
                      <div className="text-xs text-gray-600 mt-2">
                        Получено: {achievement.earnedDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Курсы */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Поиск и фильтры */}
              <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Поиск курсов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 bg-white border-2 border-black rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <Filter className="w-4 h-4 mr-2 text-gray-600" />
                    Фильтры
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Категория</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat === 'all' ? 'Все категории' : cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Уровень</label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>
                            {level === 'all' ? 'Все уровни' : getLevelText(level)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Статус</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status === 'all' ? 'Все статусы' : getStatusText(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Список курсов */}
              <div className="space-y-4">
                {filteredCourses.map(course => (
                  <div key={course.id} className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-black">{course.title}</h3>
                          {course.isRequired && (
                            <span className="px-2 py-1 bg-white border border-black text-black text-xs font-medium rounded-full">
                              Обязательный
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                            {getLevelText(course.level)}
                          </span>
                        </div>
                        <p className="text-black mb-3">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-600" />
                            {course.duration} мин
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-gray-600" />
                            {course.students} студентов
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-gray-600" />
                            {course.rating}
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1 text-gray-600" />
                            {course.instructor}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                          {getStatusText(course.status)}
                        </span>
                      </div>
                    </div>

                    {/* Материалы курса */}
                    <div className="mb-4">
                      <button
                        onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {expandedCourse === course.id ? (
                          <ChevronDown className="w-4 h-4 mr-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1" />
                        )}
                        Материалы курса
                      </button>
                      
                      {expandedCourse === course.id && (
                        <div className="mt-2 grid grid-cols-3 gap-4">
                          <div className="flex items-center p-3 bg-white border-2 border-black rounded-lg">
                            <Video className="w-5 h-5 text-gray-600 mr-2" />
                            <div>
                              <div className="font-medium text-black">{course.materials.videos}</div>
                              <div className="text-xs text-gray-600">Видео</div>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white border-2 border-black rounded-lg">
                            <FileText className="w-5 h-5 text-gray-600 mr-2" />
                            <div>
                              <div className="font-medium text-black">{course.materials.documents}</div>
                              <div className="text-xs text-gray-600">Документы</div>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white border-2 border-black rounded-lg">
                            <TestTube className="w-5 h-5 text-gray-600 mr-2" />
                            <div>
                              <div className="font-medium text-black">{course.materials.tests}</div>
                              <div className="text-xs text-gray-600">Тесты</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Прогресс */}
                    {course.status !== 'not-started' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Прогресс</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Дедлайн */}
                    {course.deadline && (
                      <div className="mb-4 p-3 bg-white border-2 border-black rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm text-black">
                            Дедлайн: {course.deadline}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Теги */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex gap-3">
                      {course.status === 'not-started' ? (
                        <button 
                          onClick={() => handleCourseClick(course)}
                          className="px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                          style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                        >
                Начать обучение
              </button>
                      ) : course.status === 'in-progress' ? (
                        <button 
                          onClick={() => handleCourseClick(course)}
                          className="px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                          style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                        >
                          Продолжить обучение
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCourseClick(course)}
                          className="px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                        >
                          Повторить курс
                        </button>
                      )}
                      <button className="px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Bookmark className="w-4 h-4 mr-2 inline text-gray-600" />
                        В закладки
                      </button>
                      <button className="px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Share2 className="w-4 h-4 mr-2 inline text-gray-600" />
                        Поделиться
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Тесты */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                  <div key={test.id} className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-black">{test.title}</h3>
                      {test.isRequired && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          Обязательный
                        </span>
                      )}
                    </div>
                    <p className="text-black text-sm mb-4">{test.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Вопросов:</span>
                        <span className="font-medium">{test.questions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Время:</span>
                        <span className="font-medium">{test.timeLimit} мин</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Попытки:</span>
                        <span className="font-medium">{test.attempts}/{test.maxAttempts}</span>
                      </div>
                      {test.bestScore > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Лучший результат:</span>
                          <span className="font-medium text-green-600">{test.bestScore}/100</span>
                        </div>
                      )}
          </div>
          
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}>
                        {getStatusText(test.status)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {test.status === 'not-taken' ? (
                        <button 
                          onClick={() => handleTestClick(test)}
                          className="flex-1 px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                          style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                        >
                          Начать тест
                        </button>
                      ) : test.status === 'passed' ? (
                        <button 
                          onClick={() => handleTestClick(test)}
                          className="flex-1 px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                        >
                  Пройти повторно
                </button>
                      ) : (
                        <button 
                          onClick={() => handleTestClick(test)}
                          className="flex-1 px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                          style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                        >
                          Продолжить тест
                        </button>
                      )}
                      <button className="px-4 py-2 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Достижения */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`border-2 rounded-lg p-6 text-center transition-all shadow-lg ${
                    achievement.earned 
                      ? 'bg-white border-black' 
                      : 'bg-white border-black'
                  }`}>
                    <div className="mb-3 flex justify-center">{achievement.icon}</div>
                    <h3 className="font-semibold text-black mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                    
                    {achievement.earned ? (
                      <div className="text-green-600 text-sm font-medium">
                        ✅ Получено
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {achievement.progress}% - {achievement.requirement}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Материалы */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Видео */}
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <Video className="w-6 h-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-semibold text-black">Видео-уроки</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">Основы недвижимости</div>
                        <div className="text-sm text-gray-500">8 видео • 2ч 15мин</div>
                      </div>
                      <button className="px-3 py-1 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                        Смотреть
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">Работа с клиентами</div>
                        <div className="text-sm text-gray-500">12 видео • 3ч 30мин</div>
                      </div>
                      <button className="px-3 py-1 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                        Смотреть
                      </button>
                    </div>
                  </div>
                </div>

                {/* Документы */}
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-semibold text-black">Документы</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">Шаблоны договоров</div>
                        <div className="text-sm text-gray-500">15 документов</div>
                      </div>
                      <button className="px-3 py-1 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">Методички</div>
                        <div className="text-sm text-gray-500">8 документов</div>
                      </div>
                      <button className="px-3 py-1 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
              </div>
              
                {/* Тесты */}
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <TestTube className="w-6 h-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-semibold text-black">Тесты</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">Основы недвижимости</div>
                        <div className="text-sm text-gray-500">20 вопросов • 30 мин</div>
                      </div>
                      <button className="px-3 py-1 bg-white border-2 border-black text-black rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                        Пройти
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">Работа с клиентами</div>
                        <div className="text-sm text-gray-500">25 вопросов • 45 мин</div>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                        Пройти
                </button>
              </div>
            </div>
          </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Модальные окна */}
      {selectedCourse && (
        <CourseModal
          isOpen={showCourseModal}
          onClose={() => {
            setShowCourseModal(false)
            setSelectedCourse(null)
          }}
          course={selectedCourse}
        />
      )}

      {selectedTest && (
        <TestModal
          isOpen={showTestModal}
          onClose={() => {
            setShowTestModal(false)
            setSelectedTest(null)
          }}
          test={selectedTest}
        />
      )}

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  )
}