"use client"

import { debugLog } from "@/lib/logger"

import { useMemo, useState } from "react"
import { 
  CheckSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Mail, 
  FileText, 
  Target, 
  TrendingUp, 
  BarChart3,
  MessageSquare
} from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  type: 'application' | 'task' | 'inquiry' | 'complaint' | 'support'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'new' | 'in-progress' | 'pending' | 'completed' | 'cancelled'
  assignee?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
  tags: string[]
  attachments: string[]
  comments: Array<{
    id: number
    author: string
    text: string
    createdAt: string
  }>
  client?: {
    name: string
    email: string
    phone: string
  }
  object?: {
    id: number
    title: string
    address: string
  }
}

interface Application {
  id: number
  type: 'purchase' | 'rent' | 'consultation' | 'valuation'
  client: {
    name: string
    email: string
    phone: string
  }
  object?: {
    id: number
    title: string
    address: string
  }
  budget?: number
  requirements: string
  status: 'new' | 'processing' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  assignedTo?: string
  notes: string
  source: 'website' | 'phone' | 'email' | 'office'
}

export default function TaskManagementPanel() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Mock данные для задач
  const tasks = useMemo<Task[]>(() => [
    {
      id: 1,
      title: "Обновить фотографии объекта #123",
      description: "Необходимо загрузить новые фотографии квартиры на ул. Ленина, 15",
      type: "task",
      priority: "medium",
      status: "in-progress",
      assignee: "Анна Петрова",
      createdBy: "Администратор",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
      dueDate: "2024-01-25",
      tags: ["фото", "объект", "обновление"],
      attachments: ["photo1.jpg", "photo2.jpg"],
      comments: [
        {
          id: 1,
          author: "Анна Петрова",
          text: "Начал работу над задачей",
          createdAt: "2024-01-20 10:30"
        }
      ],
      object: {
        id: 123,
        title: "2-комнатная квартира",
        address: "ул. Ленина, д. 15"
      }
    },
    {
      id: 2,
      title: "Обработать заявку на покупку",
      description: "Клиент интересуется квартирой в новостройке",
      type: "application",
      priority: "high",
      status: "new",
      assignee: "Михаил Соколов",
      createdBy: "Система",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
      tags: ["заявка", "покупка", "новостройка"],
      attachments: [],
      comments: [],
      client: {
        name: "Иван Петров",
        email: "ivan@example.com",
        phone: "+7 (495) 123-45-67"
      },
      object: {
        id: 456,
        title: "1-комнатная квартира",
        address: "ул. Примерная, д. 10"
      }
    },
    {
      id: 3,
      title: "Техническая поддержка",
      description: "Пользователь не может войти в личный кабинет",
      type: "support",
      priority: "urgent",
      status: "pending",
      assignee: "Елена Козлова",
      createdBy: "Система",
      createdAt: "2024-01-19",
      updatedAt: "2024-01-20",
      tags: ["поддержка", "вход", "кабинет"],
      attachments: [],
      comments: [
        {
          id: 2,
          author: "Елена Козлова",
          text: "Проверил логи, проблема в кэшировании",
          createdAt: "2024-01-20 14:15"
        }
      ],
      client: {
        name: "Мария Сидорова",
        email: "maria@example.com",
        phone: "+7 (495) 987-65-43"
      }
    }
  ], [])

  // Mock данные для заявок
  const applications = useMemo<Application[]>(() => [
    {
      id: 1,
      type: "purchase",
      client: {
        name: "Александр Иванов",
        email: "alex@example.com",
        phone: "+7 (495) 111-22-33"
      },
      object: {
        id: 789,
        title: "3-комнатная квартира",
        address: "ул. Центральная, д. 5"
      },
      budget: 15000000,
      requirements: "Квартира в центре города, с балконом, хорошая транспортная доступность",
      status: "processing",
      createdAt: "2024-01-20",
      assignedTo: "Михаил Соколов",
      notes: "Клиент очень заинтересован, готов к просмотру",
      source: "website"
    },
    {
      id: 2,
      type: "rent",
      client: {
        name: "Ольга Морозова",
        email: "olga@example.com",
        phone: "+7 (495) 444-55-66"
      },
      budget: 80000,
      requirements: "Студия или 1-комнатная квартира, рядом с метро",
      status: "new",
      createdAt: "2024-01-19",
      notes: "Срочно нужна квартира на месяц",
      source: "phone"
    },
    {
      id: 3,
      type: "consultation",
      client: {
        name: "Дмитрий Волков",
        email: "dmitry@example.com",
        phone: "+7 (495) 777-88-99"
      },
      requirements: "Консультация по инвестициям в недвижимость",
      status: "completed",
      createdAt: "2024-01-18",
      assignedTo: "Анна Петрова",
      notes: "Консультация проведена, клиент получил всю необходимую информацию",
      source: "email"
    }
  ], [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'in-progress': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'pending': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'completed': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'cancelled': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'processing': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'approved': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'rejected': return 'text-gray-600 bg-gray-50 border border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новая'
      case 'in-progress': return 'В работе'
      case 'pending': return 'Ожидает'
      case 'completed': return 'Завершена'
      case 'cancelled': return 'Отменена'
      case 'processing': return 'Обрабатывается'
      case 'approved': return 'Одобрена'
      case 'rejected': return 'Отклонена'
      default: return 'Неизвестно'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'medium': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'high': return 'text-gray-600 bg-gray-50 border border-gray-200'
      case 'urgent': return 'text-gray-600 bg-gray-50 border border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Низкий'
      case 'medium': return 'Средний'
      case 'high': return 'Высокий'
      case 'urgent': return 'Срочный'
      default: return 'Неизвестно'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'application': return 'Заявка'
      case 'task': return 'Задача'
      case 'inquiry': return 'Запрос'
      case 'complaint': return 'Жалоба'
      case 'support': return 'Поддержка'
      case 'purchase': return 'Покупка'
      case 'rent': return 'Аренда'
      case 'consultation': return 'Консультация'
      case 'valuation': return 'Оценка'
      default: return 'Неизвестно'
    }
  }

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  }), [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter])

  const filteredApplications = useMemo(() => applications.filter(app => {
    const matchesSearch = app.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.requirements.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  }), [applications, searchQuery, statusFilter])

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    urgentTasks: tasks.filter(t => t.priority === 'urgent').length,
    totalApplications: applications.length,
    newApplications: applications.filter(a => a.status === 'new').length,
    processingApplications: applications.filter(a => a.status === 'processing').length,
    completedApplications: applications.filter(a => a.status === 'completed').length
  }

  const handleCreateTask = () => {
    window.location.href = '/multi-step-form'
  }

  const handleEditTask = (task: Task) => {
    window.location.href = `/task/${task.id}/edit`
  }

  const handleEditApplication = (application: Application) => {
    window.location.href = `/purchase-application?applicationId=${application.id}`
  }

  const handleDeleteTask = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      // В реальном приложении здесь будет API вызов
      debugLog('Удаление задачи:', id)
    }
  }

  const handleDeleteApplication = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
      // В реальном приложении здесь будет API вызов
      debugLog('Удаление заявки:', id)
    }
  }

  const tabs = [
    { id: 'tasks', label: 'Задачи', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'applications', label: 'Заявки', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Аналитика', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-black">Управление задачами и заявками</h2>
            <p className="text-gray-600">Контроль выполнения задач и обработка заявок клиентов</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsLoading(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 inline mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Создать задачу
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <CheckSquare className="w-8 h-8 text-gray-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{stats.totalTasks}</div>
                <div className="text-sm text-gray-600">Всего задач</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-gray-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{stats.inProgressTasks}</div>
                <div className="text-sm text-gray-600">В работе</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-gray-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{stats.urgentTasks}</div>
                <div className="text-sm text-gray-600">Срочные</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-gray-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{stats.totalApplications}</div>
                <div className="text-sm text-gray-600">Заявок</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-black border border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Задачи */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Фильтры */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск задач..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                >
                  <option value="all">Все статусы</option>
                  <option value="new">Новые</option>
                  <option value="in-progress">В работе</option>
                  <option value="pending">Ожидают</option>
                  <option value="completed">Завершены</option>
                  <option value="cancelled">Отменены</option>
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                >
                  <option value="all">Все приоритеты</option>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
                
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                >
                  <option value="all">Все исполнители</option>
                  <option value="Анна Петрова">Анна Петрова</option>
                  <option value="Михаил Соколов">Михаил Соколов</option>
                  <option value="Елена Козлова">Елена Козлова</option>
                </select>
              </div>
            </div>
          </div>

          {/* Список задач */}
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                      <span className="px-2 py-1 bg-white border border-gray-300 text-black text-xs font-medium rounded-full shadow-sm">
                        {getTypeText(task.type)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {task.assignee || 'Не назначен'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(task.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          До: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {task.client && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-black mb-1">Клиент</div>
                        <div className="text-sm text-gray-600">
                          {task.client.name} • {task.client.email} • {task.client.phone}
                        </div>
                      </div>
                    )}
                    
                    {task.object && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-black mb-1">Объект</div>
                        <div className="text-sm text-gray-600">
                          {task.object.title} • {task.object.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
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
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Комментарии ({task.comments.length})
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-3 py-1 bg-white border border-gray-300 text-gray-600 text-sm rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Задачи не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска или создайте новую задачу</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Заявки */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Фильтры */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск заявок..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                >
                  <option value="all">Все статусы</option>
                  <option value="new">Новые</option>
                  <option value="processing">Обрабатываются</option>
                  <option value="approved">Одобрены</option>
                  <option value="rejected">Отклонены</option>
                  <option value="completed">Завершены</option>
                </select>
              </div>
            </div>
          </div>

          {/* Список заявок */}
          <div className="space-y-4">
            {filteredApplications.map(application => (
              <div key={application.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">
                        Заявка #{application.id} - {getTypeText(application.type)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                      <span className="px-2 py-1 bg-white border border-gray-300 text-black text-xs font-medium rounded-full shadow-sm">
                        {application.source}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-black mb-1">Клиент</div>
                        <div className="text-sm text-gray-600">
                          {application.client.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {application.client.email} • {application.client.phone}
                        </div>
                      </div>
                      
                      {application.object && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-black mb-1">Объект</div>
                          <div className="text-sm text-gray-600">
                            {application.object.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {application.object.address}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium text-black mb-1">Требования</div>
                      <div className="text-sm text-gray-600">{application.requirements}</div>
                    </div>
                    
                    {application.budget && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-black mb-1">Бюджет</div>
                        <div className="text-sm text-gray-600">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0
                          }).format(application.budget)}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                      {application.assignedTo && (
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {application.assignedTo}
                        </span>
                      )}
                    </div>
                    
                    {application.notes && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-black mb-1">Заметки</div>
                        <div className="text-sm text-gray-600">{application.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditApplication(application)}
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
                      <Mail className="w-4 h-4 inline mr-1" />
                      Ответить
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteApplication(application.id)}
                      className="px-3 py-1 bg-white border border-gray-300 text-gray-600 text-sm rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Заявки не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Аналитика */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4">Аналитика задач и заявок</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-gray-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">{stats.completedTasks}</div>
                    <div className="text-sm text-gray-600">Завершено задач</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-gray-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">{stats.inProgressTasks}</div>
                    <div className="text-sm text-gray-600">В работе</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-gray-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">{stats.newApplications}</div>
                    <div className="text-sm text-gray-600">Новых заявок</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-gray-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-black">{stats.completedApplications}</div>
                    <div className="text-sm text-gray-600">Завершено заявок</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Детальная аналитика</h3>
              <p className="text-gray-500">Графики и диаграммы будут добавлены в следующих версиях</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
