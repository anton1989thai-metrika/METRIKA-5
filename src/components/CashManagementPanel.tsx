"use client"

import { useState } from "react"
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Building,
  Home,
  LandPlot,
  Store,
  Factory,
  Share,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from "lucide-react"

interface CashTransaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  relatedObject?: string
  relatedObjectId?: string
  createdBy: string
  status: 'pending' | 'approved' | 'rejected'
  attachments?: string[]
  tags: string[]
}

interface Object {
  id: string
  title: string
  type: 'apartment' | 'house' | 'land' | 'commercial' | 'building' | 'non-capital' | 'share'
  address: string
  price: number
}

export default function CashManagementPanel() {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  // Mock данные
  const objects: Object[] = [
    { id: '1', title: 'Квартира в центре', type: 'apartment', address: 'ул. Ленина, 10', price: 5000000 },
    { id: '2', title: 'Дом с участком', type: 'house', address: 'ул. Садовая, 25', price: 8000000 },
    { id: '3', title: 'Офисное помещение', type: 'commercial', address: 'пр. Мира, 100', price: 12000000 },
    { id: '4', title: 'Земельный участок', type: 'land', address: 'СНТ Солнечное', price: 1500000 }
  ]

  const [transactions, setTransactions] = useState<CashTransaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'Комиссия за сделку',
      amount: 250000,
      description: 'Комиссия за продажу квартиры в центре города',
      date: '2024-01-15',
      relatedObject: 'Квартира в центре',
      relatedObjectId: '1',
      createdBy: 'Иван Сидоров',
      status: 'approved',
      tags: ['сделка', 'комиссия', 'продажа']
    },
    {
      id: '2',
      type: 'expense',
      category: 'Офисные расходы',
      amount: 15000,
      description: 'Покупка канцелярских товаров и расходных материалов',
      date: '2024-01-14',
      createdBy: 'Мария Козлова',
      status: 'approved',
      tags: ['офис', 'канцелярия']
    },
    {
      id: '3',
      type: 'income',
      category: 'Аванс клиента',
      amount: 500000,
      description: 'Аванс от клиента за дом с участком',
      date: '2024-01-13',
      relatedObject: 'Дом с участком',
      relatedObjectId: '2',
      createdBy: 'Анна Петрова',
      status: 'approved',
      tags: ['аванс', 'клиент', 'дом']
    },
    {
      id: '4',
      type: 'expense',
      category: 'Реклама и маркетинг',
      amount: 50000,
      description: 'Размещение рекламы на популярных площадках',
      date: '2024-01-12',
      createdBy: 'Алексей Иванов',
      status: 'pending',
      tags: ['реклама', 'маркетинг']
    },
    {
      id: '5',
      type: 'income',
      category: 'Дополнительные услуги',
      amount: 75000,
      description: 'Консультационные услуги по оформлению документов',
      date: '2024-01-11',
      createdBy: 'Анна Петрова',
      status: 'approved',
      tags: ['консультации', 'документы']
    }
  ])

  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: 0,
    description: '',
    relatedObjectId: '',
    tags: ''
  })

  const incomeCategories = [
    'Комиссия за сделку',
    'Аванс клиента',
    'Дополнительные услуги',
    'Консультации',
    'Аренда',
    'Другое'
  ]

  const expenseCategories = [
    'Офисные расходы',
    'Реклама и маркетинг',
    'Коммунальные услуги',
    'Зарплата',
    'Налоги',
    'Техническое обслуживание',
    'Другое'
  ]

  const allCategories = [...incomeCategories, ...expenseCategories]

  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || transaction.type === activeTab
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.relatedObject && transaction.relatedObject.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const matchesDateRange = (!dateRange.start || transaction.date >= dateRange.start) &&
                            (!dateRange.end || transaction.date <= dateRange.end)
    
    return matchesTab && matchesSearch && matchesCategory && matchesStatus && matchesDateRange
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense
  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.description || newTransaction.amount <= 0) return

    const relatedObject = newTransaction.relatedObjectId 
      ? objects.find(obj => obj.id === newTransaction.relatedObjectId)
      : null

    const transaction: CashTransaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      category: newTransaction.category,
      amount: newTransaction.amount,
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
      relatedObject: relatedObject?.title,
      relatedObjectId: newTransaction.relatedObjectId,
      createdBy: 'Текущий пользователь',
      status: 'pending',
      tags: newTransaction.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    setTransactions(prev => [...prev, transaction])
    setShowAddModal(false)
    setNewTransaction({ type: 'income', category: '', amount: 0, description: '', relatedObjectId: '', tags: '' })
  }

  const handleEditTransaction = (transaction: CashTransaction) => {
    setEditingTransaction(transaction)
  }

  const handleSaveEdit = () => {
    if (!editingTransaction) return

    setTransactions(prev => prev.map(t => 
      t.id === editingTransaction.id ? editingTransaction : t
    ))
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId))
  }

  const handleApproveTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'approved' as const }
        : t
    ))
  }

  const handleRejectTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'rejected' as const }
        : t
    ))
  }

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Home className="w-4 h-4" />
      case 'house':
        return <Building className="w-4 h-4" />
      case 'land':
        return <LandPlot className="w-4 h-4" />
      case 'commercial':
        return <Store className="w-4 h-4" />
      case 'building':
        return <Factory className="w-4 h-4" />
      case 'share':
        return <Share className="w-4 h-4" />
      default:
        return <Building className="w-4 h-4" />
    }
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
        <h2 className="text-2xl font-bold text-black">Касса и платежи</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Экспорт
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Добавить операцию
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalIncome.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Поступления</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalExpense.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Расходы</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{balance.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Баланс</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{Math.abs(pendingAmount).toLocaleString()}</div>
              <div className="text-sm text-gray-600">На рассмотрении</div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Навигация */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'income' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Доходы
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'expense' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown className="w-3 h-3 inline mr-1" />
              Расходы
            </button>
          </div>

          {/* Поиск */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Фильтр по категории */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">Все категории</option>
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Фильтр по статусу */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Одобрено</option>
            <option value="rejected">Отклонено</option>
          </select>

          {/* Фильтр по дате */}
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="От"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="До"
            />
          </div>
        </div>
      </div>

      {/* Список операций */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-8 h-8 text-gray-600" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">{transaction.category}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'approved' ? 'Одобрено' :
                       transaction.status === 'rejected' ? 'Отклонено' : 'На рассмотрении'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div><strong>Описание:</strong> {transaction.description}</div>
                    <div><strong>Дата:</strong> {new Date(transaction.date).toLocaleDateString('ru-RU')}</div>
                    <div><strong>Создано:</strong> {transaction.createdBy}</div>
                    {transaction.relatedObject && (
                      <div className="flex items-center">
                        <strong>Объект:</strong>
                        <span className="ml-1 flex items-center">
                          {getObjectIcon(objects.find(obj => obj.id === transaction.relatedObjectId)?.type || '')}
                          <span className="ml-1">{transaction.relatedObject}</span>
                        </span>
                      </div>
                    )}
                    {transaction.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1">
                        <strong>Теги:</strong>
                        {transaction.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-black' : 'text-black'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₽{transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.type === 'income' ? 'Поступление' : 'Расход'}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {transaction.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveTransaction(transaction.id)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Одобрить"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectTransaction(transaction.id)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Отклонить"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEditTransaction(transaction)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
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

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Нет операций, соответствующих фильтрам</p>
            <p className="text-sm">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Добавить операцию</h3>
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
                  Тип операции
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      newTransaction.type === 'income' 
                        ? 'bg-gray-100 text-gray-800 border border-gray-300'  
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Поступление
                  </button>
                  <button
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      newTransaction.type === 'expense' 
                        ? 'bg-gray-100 text-gray-800 border border-gray-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 inline mr-2" />
                    Расход
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите категорию</option>
                  {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(category => (
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
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите сумму"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Опишите операцию"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Связанный объект (опционально)
                </label>
                <select
                  value={newTransaction.relatedObjectId}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, relatedObjectId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите объект</option>
                  {objects.map(object => (
                    <option key={object.id} value={object.id}>
                      {object.title} - {object.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Теги (через запятую)
                </label>
                <input
                  type="text"
                  value={newTransaction.tags}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="сделка, комиссия, продажа"
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
                onClick={handleAddTransaction}
                disabled={!newTransaction.category || !newTransaction.description || newTransaction.amount <= 0}
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
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Редактировать операцию</h3>
              <button
                onClick={() => setEditingTransaction(null)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  value={editingTransaction.category}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма (₽)
                </label>
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingTransaction(null)}
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
