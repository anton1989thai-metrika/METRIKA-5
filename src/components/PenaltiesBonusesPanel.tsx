"use client"

import { useState } from "react"
import { 
  Award, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Search
} from "lucide-react"

interface PenaltyBonus {
  id: string
  employeeId: string
  employeeName: string
  type: 'penalty' | 'bonus'
  category: string
  amount: number
  reason: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string
  approvedBy?: string
  approvedAt?: string
}

interface Employee {
  id: string
  name: string
  position: string
  avatar?: string
}

export default function PenaltiesBonusesPanel() {
  const [activeTab, setActiveTab] = useState<'penalties' | 'bonuses' | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PenaltyBonus | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // Mock данные
  const employees: Employee[] = [
    { id: '1', name: 'Иван Сидоров', position: 'Менеджер по недвижимости' },
    { id: '2', name: 'Анна Петрова', position: 'Юрист' },
    { id: '3', name: 'Мария Козлова', position: 'Бухгалтер' },
    { id: '4', name: 'Алексей Иванов', position: 'Агент' }
  ]

  const [penaltiesBonuses, setPenaltiesBonuses] = useState<PenaltyBonus[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Иван Сидоров',
      type: 'bonus',
      category: 'Продажа объекта',
      amount: 25000,
      reason: 'Успешная продажа квартиры за 5 млн рублей',
      date: '2024-01-15',
      status: 'approved',
      createdBy: 'Администратор',
      approvedBy: 'Директор',
      approvedAt: '2024-01-16'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Анна Петрова',
      type: 'penalty',
      category: 'Опоздание',
      amount: 2000,
      reason: 'Опоздание на работу на 30 минут',
      date: '2024-01-14',
      status: 'approved',
      createdBy: 'HR',
      approvedBy: 'Директор',
      approvedAt: '2024-01-15'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Мария Козлова',
      type: 'bonus',
      category: 'Переработка',
      amount: 15000,
      reason: 'Работа в выходные дни для подготовки отчёта',
      date: '2024-01-13',
      status: 'pending',
      createdBy: 'Менеджер'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Алексей Иванов',
      type: 'bonus',
      category: 'Клиентская работа',
      amount: 10000,
      reason: 'Отличная работа с клиентом, положительные отзывы',
      date: '2024-01-12',
      status: 'approved',
      createdBy: 'Менеджер',
      approvedBy: 'Директор',
      approvedAt: '2024-01-13'
    }
  ])

  const [newItem, setNewItem] = useState({
    employeeId: '',
    type: 'bonus' as 'penalty' | 'bonus',
    category: '',
    amount: 0,
    reason: ''
  })

  const categories = {
    penalty: [
      'Опоздание',
      'Нарушение дисциплины',
      'Невыполнение задач',
      'Порча имущества',
      'Другое'
    ],
    bonus: [
      'Продажа объекта',
      'Переработка',
      'Клиентская работа',
      'Инновации',
      'Командная работа',
      'Другое'
    ]
  }

  const filteredItems = penaltiesBonuses.filter(item => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'penalties' && item.type === 'penalty') ||
      (activeTab === 'bonuses' && item.type === 'bonus')
    const matchesSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    
    return matchesTab && matchesSearch && matchesStatus
  })

  const totalBonuses = penaltiesBonuses
    .filter(item => item.type === 'bonus' && item.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0)

  const totalPenalties = penaltiesBonuses
    .filter(item => item.type === 'penalty' && item.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0)

  const pendingCount = penaltiesBonuses.filter(item => item.status === 'pending').length

  const handleAddItem = () => {
    if (!newItem.employeeId || !newItem.category || !newItem.reason || newItem.amount <= 0) return

    const employee = employees.find(emp => emp.id === newItem.employeeId)
    if (!employee) return

    const item: PenaltyBonus = {
      id: Date.now().toString(),
      employeeId: newItem.employeeId,
      employeeName: employee.name,
      type: newItem.type,
      category: newItem.category,
      amount: newItem.amount,
      reason: newItem.reason,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      createdBy: 'Текущий пользователь'
    }

    setPenaltiesBonuses(prev => [...prev, item])
    setShowAddModal(false)
    setNewItem({ employeeId: '', type: 'bonus', category: '', amount: 0, reason: '' })
  }

  const handleEditItem = (item: PenaltyBonus) => {
    setEditingItem(item)
  }

  const handleSaveEdit = () => {
    if (!editingItem) return

    setPenaltiesBonuses(prev => prev.map(item => 
      item.id === editingItem.id ? editingItem : item
    ))
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    setPenaltiesBonuses(prev => prev.filter(item => item.id !== itemId))
  }

  const handleApproveItem = (itemId: string) => {
    setPenaltiesBonuses(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status: 'approved' as const, 
            approvedBy: 'Текущий пользователь',
            approvedAt: new Date().toISOString().split('T')[0]
          }
        : item
    ))
  }

  const handleRejectItem = (itemId: string) => {
    setPenaltiesBonuses(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: 'rejected' as const }
        : item
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-gray-100 text-gray-800'
      case 'rejected':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Штрафы и премии</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
          style={{backgroundColor: '#fff60b'}}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Добавить
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalBonuses.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Всего премий</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalPenalties.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Всего штрафов</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">{pendingCount}</div>
              <div className="text-sm text-gray-600">На рассмотрении</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{(totalBonuses - totalPenalties).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Чистый баланс</div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Навигация */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setActiveTab('bonuses')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'bonuses' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Премии
            </button>
            <button
              onClick={() => setActiveTab('penalties')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'penalties' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Штрафы
            </button>
          </div>

          {/* Поиск */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по сотруднику, причине или категории..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Фильтр по статусу */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Одобрено</option>
            <option value="rejected">Отклонено</option>
          </select>
        </div>
      </div>

      {/* Список штрафов и премий */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {item.type === 'bonus' ? (
                    <Award className="w-8 h-8 text-gray-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">{item.employeeName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'approved' ? 'Одобрено' :
                       item.status === 'rejected' ? 'Отклонено' : 'На рассмотрении'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div><strong>Категория:</strong> {item.category}</div>
                    <div><strong>Причина:</strong> {item.reason}</div>
                    <div><strong>Дата:</strong> {new Date(item.date).toLocaleDateString('ru-RU')}</div>
                    <div><strong>Создано:</strong> {item.createdBy}</div>
                    {item.approvedBy && (
                      <div><strong>Одобрено:</strong> {item.approvedBy} ({item.approvedAt})</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    item.type === 'bonus' ? 'text-black' : 'text-black'
                  }`}>
                    {item.type === 'bonus' ? '+' : '-'}₽{item.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.type === 'bonus' ? 'Премия' : 'Штраф'}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveItem(item.id)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Одобрить"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectItem(item.id)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Отклонить"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEditItem(item)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Нет записей, соответствующих фильтрам</p>
            <p className="text-sm">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Добавить запись</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setNewItem(prev => ({ ...prev, type: 'bonus' }))}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      newItem.type === 'bonus' 
                        ? 'bg-gray-100 text-gray-800 border border-gray-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <Award className="w-4 h-4 inline mr-2" />
                    Премия
                  </button>
                  <button
                    onClick={() => setNewItem(prev => ({ ...prev, type: 'penalty' }))}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      newItem.type === 'penalty' 
                        ? 'bg-gray-100 text-gray-800 border border-gray-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Штраф
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сотрудник
                </label>
                <select
                  value={newItem.employeeId}
                  onChange={(e) => setNewItem(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите категорию</option>
                  {categories[newItem.type].map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма (₽)
                </label>
                <input
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите сумму"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Причина
                </label>
                <textarea
                  value={newItem.reason}
                  onChange={(e) => setNewItem(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Опишите причину начисления"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.employeeId || !newItem.category || !newItem.reason || newItem.amount <= 0}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Редактировать запись</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сотрудник
                </label>
                <div className="p-2 bg-gray-50 rounded-lg text-gray-700">
                  {editingItem.employeeName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма (₽)
                </label>
                <input
                  type="number"
                  value={editingItem.amount}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Причина
                </label>
                <textarea
                  value={editingItem.reason}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, reason: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
