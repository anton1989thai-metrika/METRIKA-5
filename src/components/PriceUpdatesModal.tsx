"use client"

import { useState, useEffect } from "react"
import type { ObjectData } from "@/types/object-data"
import {
  X,
  DollarSign,
  TrendingUp,
  Clock,
  Settings,
  Plus,
  Trash2,
  Save,
  Check,
  Play,
  Cog,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

interface PriceRule {
  id: string
  name: string
  description: string
  isActive: boolean
  conditions: {
    objectTypes?: string[]
    priceRange?: { min: number; max: number }
    locations?: string[]
    agents?: string[]
    dateRange?: { start: string; end: string }
    marketTrend?: 'up' | 'down' | 'stable'
  }
  actions: {
    type: 'percentage' | 'fixed' | 'formula' | 'market_based'
    value?: number
    formula?: string
    marketSource?: string
    minChange?: number
    maxChange?: number
  }
  schedule: {
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly' | 'custom'
    time?: string
    daysOfWeek?: number[]
    daysOfMonth?: number[]
    customInterval?: number
  }
  notifications: {
    enabled: boolean
    channels: Array<'email' | 'sms' | 'push' | 'internal'>
    recipients: string[]
    threshold?: number
  }
  createdAt: string
  lastTriggered?: string
  triggerCount: number
  successCount: number
  errorCount: number
}

interface PriceHistory {
  id: string
  objectId: string
  objectTitle: string
  oldPrice: number
  newPrice: number
  change: number
  changePercent: number
  ruleId: string
  ruleName: string
  reason: string
  timestamp: string
  userId: string
  userName: string
  status: 'success' | 'error' | 'pending'
  errorMessage?: string
}

interface PriceUpdate {
  id: string
  objectId: string
  objectTitle: string
  currentPrice: number
  suggestedPrice: number
  change: number
  changePercent: number
  ruleId: string
  ruleName: string
  reason: string
  confidence: number
  marketData?: {
    averagePrice: number
    medianPrice: number
    priceRange: { min: number; max: number }
    trend: 'up' | 'down' | 'stable'
    volume: number
  }
  createdAt: string
  status: 'pending' | 'approved' | 'rejected' | 'applied'
  approvedBy?: string
  approvedAt?: string
}

interface PriceUpdatesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rules: PriceRule[], updates: PriceUpdate[], history: PriceHistory[]) => void
  initialRules?: PriceRule[]
  initialUpdates?: PriceUpdate[]
  initialHistory?: PriceHistory[]
  objectData?: ObjectData
}

export default function PriceUpdatesModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialRules = [],
  initialUpdates = [],
  initialHistory = [],
  objectData
}: PriceUpdatesModalProps) {
  const [rules, setRules] = useState<PriceRule[]>(initialRules)
  const [updates, setUpdates] = useState<PriceUpdate[]>(initialUpdates)
  const [history, setHistory] = useState<PriceHistory[]>(initialHistory)
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreatingRule, setIsCreatingRule] = useState(false)
  const [isRunningUpdate, setIsRunningUpdate] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'change' | 'confidence'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const getPriceValue = (value: ObjectData['price']): number => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }

  // Новое правило
  const [newRule, setNewRule] = useState<Partial<PriceRule>>({
    name: '',
    description: '',
    isActive: true,
    conditions: {
      objectTypes: [],
      priceRange: { min: 0, max: 10000000 },
      locations: [],
      agents: [],
      marketTrend: 'stable'
    },
    actions: {
      type: 'percentage',
      value: 0,
      minChange: 0,
      maxChange: 100
    },
    schedule: {
      frequency: 'daily',
      time: '09:00'
    },
    notifications: {
      enabled: true,
      channels: ['internal'],
      recipients: []
    },
    triggerCount: 0,
    successCount: 0,
    errorCount: 0
  })

  // Фильтрация и сортировка
  const filteredUpdates = updates
    .filter(update => {
      if (filterStatus !== 'all' && update.status !== filterStatus) return false
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'change':
          comparison = Math.abs(a.change) - Math.abs(b.change)
          break
        case 'confidence':
          comparison = a.confidence - b.confidence
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Создание правила
  const createRule = () => {
    if (!newRule.name || !newRule.description) return

    const rule: PriceRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      isActive: newRule.isActive || true,
      conditions: newRule.conditions || {},
      actions: newRule.actions || { type: 'percentage', value: 0 },
      schedule: newRule.schedule || { frequency: 'daily' },
      notifications: newRule.notifications || { enabled: true, channels: ['internal'], recipients: [] },
      createdAt: new Date().toISOString(),
      triggerCount: 0,
      successCount: 0,
      errorCount: 0
    }

    setRules(prev => [...prev, rule])
    setNewRule({
      name: '',
      description: '',
      isActive: true,
      conditions: {
        objectTypes: [],
        priceRange: { min: 0, max: 10000000 },
        locations: [],
        agents: [],
        marketTrend: 'stable'
      },
      actions: {
        type: 'percentage',
        value: 0,
        minChange: 0,
        maxChange: 100
      },
      schedule: {
        frequency: 'daily',
        time: '09:00'
      },
      notifications: {
        enabled: true,
        channels: ['internal'],
        recipients: []
      },
      triggerCount: 0,
      successCount: 0,
      errorCount: 0
    })
    setIsCreatingRule(false)
  }

  // Переключение активности правила
  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ))
  }

  // Удаление правила
  const deleteRule = (ruleId: string) => {
    if (confirm('Вы уверены, что хотите удалить это правило?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId))
    }
  }

  // Тестирование правила
  const testRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule || !objectData) return

    // Имитация тестирования правила
    const currentPrice = getPriceValue(objectData.price)
    const suggestedPrice = currentPrice * (1 + (rule.actions.value || 0) / 100)
    const change = suggestedPrice - currentPrice
    const changePercent = currentPrice ? (change / currentPrice) * 100 : 0

    const update: PriceUpdate = {
      id: Date.now().toString(),
      objectId: objectData.id ? String(objectData.id) : 'test-object',
      objectTitle: objectData.title || 'Тестовый объект',
      currentPrice,
      suggestedPrice,
      change,
      changePercent,
      ruleId: rule.id,
      ruleName: rule.name,
      reason: `Тест правила: ${rule.description}`,
      confidence: 85,
      marketData: {
        averagePrice: currentPrice * 0.95,
        medianPrice: currentPrice * 1.05,
        priceRange: { min: currentPrice * 0.8, max: currentPrice * 1.2 },
        trend: 'up',
        volume: 150
      },
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    setUpdates(prev => [update, ...prev])
    setRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { 
            ...r, 
            lastTriggered: new Date().toISOString(),
            triggerCount: r.triggerCount + 1
          }
        : r
    ))
  }

  // Применение обновления цены
  const applyUpdate = (updateId: string) => {
    const update = updates.find(u => u.id === updateId)
    if (!update) return

    setIsRunningUpdate(true)

    // Имитация применения обновления
    setTimeout(() => {
      setUpdates(prev => prev.map(u => 
        u.id === updateId 
          ? { 
              ...u, 
              status: 'applied',
              approvedBy: 'current-user',
              approvedAt: new Date().toISOString()
            }
          : u
      ))

      // Добавляем в историю
      const historyEntry: PriceHistory = {
        id: Date.now().toString(),
        objectId: update.objectId,
        objectTitle: update.objectTitle,
        oldPrice: update.currentPrice,
        newPrice: update.suggestedPrice,
        change: update.change,
        changePercent: update.changePercent,
        ruleId: update.ruleId,
        ruleName: update.ruleName,
        reason: update.reason,
        timestamp: new Date().toISOString(),
        userId: 'current-user',
        userName: 'Текущий пользователь',
        status: 'success'
      }

      setHistory(prev => [historyEntry, ...prev])
      setIsRunningUpdate(false)
    }, 1000)
  }

  // Отклонение обновления
  const rejectUpdate = (updateId: string) => {
    setUpdates(prev => prev.map(u => 
      u.id === updateId 
        ? { 
            ...u, 
            status: 'rejected',
            approvedBy: 'current-user',
            approvedAt: new Date().toISOString()
          }
        : u
    ))
  }

  // Массовое применение обновлений
  const applyAllUpdates = () => {
    const pendingUpdates = updates.filter(u => u.status === 'pending')
    pendingUpdates.forEach(update => {
      setTimeout(() => applyUpdate(update.id), Math.random() * 2000)
    })
  }

  // Автоматическое создание обновления для объекта
  useEffect(() => {
    if (objectData && isOpen && rules.length > 0) {
      const applicableRule = rules.find(rule => 
        rule.isActive && 
        (!rule.conditions.objectTypes ||
          (objectData.type ? rule.conditions.objectTypes.includes(objectData.type) : false))
      )

      if (applicableRule) {
        const currentPrice = getPriceValue(objectData.price)
        const suggestedPrice = currentPrice * (1 + (applicableRule.actions.value || 0) / 100)
        const change = suggestedPrice - currentPrice
        const changePercent = currentPrice ? (change / currentPrice) * 100 : 0

        const update: PriceUpdate = {
          id: Date.now().toString(),
          objectId: objectData.id ? String(objectData.id) : 'new-object',
          objectTitle: objectData.title || 'Новый объект',
          currentPrice,
          suggestedPrice,
          change,
          changePercent,
          ruleId: applicableRule.id,
          ruleName: applicableRule.name,
          reason: `Автоматическое предложение для ${objectData.title}`,
          confidence: 75,
          marketData: {
            averagePrice: currentPrice * 0.95,
            medianPrice: currentPrice * 1.05,
            priceRange: { min: currentPrice * 0.8, max: currentPrice * 1.2 },
            trend: 'stable',
            volume: 100
          },
          createdAt: new Date().toISOString(),
          status: 'pending'
        }

        setUpdates(prev => [update, ...prev])
      }
    }
  }, [objectData, isOpen, rules])

  // Сохранение
  const handleSave = () => {
    onSave(rules, updates, history)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">Автоматическое обновление цен</h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {updates.filter(u => u.status === 'pending').length} ожидают
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {rules.filter(r => r.isActive).length} правил активно
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {history.length} изменений
              </div>
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
            { id: 'overview', label: 'Обзор', icon: DollarSign },
            { id: 'updates', label: 'Обновления', icon: TrendingUp },
            { id: 'rules', label: 'Правила', icon: Settings },
            { id: 'history', label: 'История', icon: Clock },
            { id: 'settings', label: 'Настройки', icon: Cog }
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
          {/* Обзор */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Общая статистика</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего правил</p>
                      <p className="text-2xl font-bold text-black">{rules.length}</p>
                    </div>
                    <Settings className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ожидают обновления</p>
                      <p className="text-2xl font-bold text-black">
                        {updates.filter(u => u.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Применено</p>
                      <p className="text-2xl font-bold text-black">
                        {updates.filter(u => u.status === 'applied').length}
                      </p>
                    </div>
                    <Check className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Изменений в истории</p>
                      <p className="text-2xl font-bold text-black">{history.length}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Последние обновления */}
              <div>
                <h5 className="text-lg font-semibold text-black mb-4">Последние обновления</h5>
                <div className="space-y-3">
                  {updates.slice(0, 5).map(update => (
                    <div key={update.id} className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          update.status === 'applied' ? 'bg-gray-500' :
                          update.status === 'pending' ? 'bg-gray-500' :
                          update.status === 'rejected' ? 'bg-gray-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-black">{update.objectTitle}</div>
                          <div className="text-sm text-gray-600">
                            {update.changePercent > 0 ? '+' : ''}{update.changePercent.toFixed(1)}% • {update.ruleName}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(update.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Обновления */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Предложения по ценам</h4>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={applyAllUpdates}
                    disabled={isRunningUpdate || updates.filter(u => u.status === 'pending').length === 0}
                    className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{backgroundColor: '#fff60b'}}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Применить все
                  </button>
                </div>
              </div>

              {/* Фильтры */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="all">Все статусы</option>
                  <option value="pending">Ожидают</option>
                  <option value="applied">Применены</option>
                  <option value="rejected">Отклонены</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'date' | 'change' | 'confidence')
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="date">По дате</option>
                  <option value="change">По изменению</option>
                  <option value="confidence">По уверенности</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Список обновлений */}
              <div className="space-y-3">
                {filteredUpdates.map(update => (
                  <div
                    key={update.id}
                    className={`p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all ${
                      update.status === 'applied' ? 'border-gray-200 bg-gray-50' :
                      update.status === 'rejected' ? 'border-gray-200 bg-gray-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          update.status === 'applied' ? 'bg-gray-500' :
                          update.status === 'pending' ? 'bg-gray-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-black">{update.objectTitle}</div>
                          <div className="text-sm text-gray-600">{update.ruleName}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          update.status === 'applied' ? 'bg-gray-100 text-gray-800' :
                          update.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {update.status === 'applied' ? 'Применено' :
                           update.status === 'pending' ? 'Ожидает' : 'Отклонено'}
                        </div>
                        <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {update.confidence}% уверенность
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Текущая цена</p>
                        <p className="font-medium text-black">{update.currentPrice.toLocaleString()} ₽</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Предлагаемая цена</p>
                        <p className="font-medium text-black">{update.suggestedPrice.toLocaleString()} ₽</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Изменение</p>
                        <p className={`font-medium ${update.change >= 0 ? 'text-gray-600' : 'text-gray-600'}`}>
                          {update.change >= 0 ? '+' : ''}{update.change.toLocaleString()} ₽ ({update.changePercent.toFixed(1)}%)
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Причина:</strong> {update.reason}
                    </div>

                    {update.marketData && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h6 className="font-medium text-black mb-2">Рыночные данные</h6>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Средняя цена</p>
                            <p className="font-medium text-black">{update.marketData.averagePrice.toLocaleString()} ₽</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Медианная цена</p>
                            <p className="font-medium text-black">{update.marketData.medianPrice.toLocaleString()} ₽</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Тренд</p>
                            <p className={`font-medium ${
                              update.marketData.trend === 'up' ? 'text-gray-600' :
                              update.marketData.trend === 'down' ? 'text-gray-600' :
                              'text-gray-600'
                            }`}>
                              {update.marketData.trend === 'up' ? '↗ Рост' :
                               update.marketData.trend === 'down' ? '↘ Спад' : '→ Стабильно'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Объем</p>
                            <p className="font-medium text-black">{update.marketData.volume}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Создано: {new Date(update.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        {update.status === 'pending' && (
                          <>
                            <button
                              onClick={() => applyUpdate(update.id)}
                              disabled={isRunningUpdate}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                              <Check className="w-4 h-4 inline mr-1" />
                              Применить
                            </button>
                            <button
                              onClick={() => rejectUpdate(update.id)}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all"
                            >
                              <X className="w-4 h-4 inline mr-1" />
                              Отклонить
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Правила */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black">Правила обновления цен</h4>
                <button
                  onClick={() => setIsCreatingRule(true)}
                  className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Создать правило
                </button>
              </div>

              {/* Форма создания правила */}
              {isCreatingRule && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h5 className="text-lg font-semibold text-black mb-4">Создать новое правило</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Название правила</label>
                      <input
                        type="text"
                        value={newRule.name || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="Например: Повышение цен на квартиры"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Тип действия</label>
                      <select
                        value={newRule.actions?.type || 'percentage'}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          actions: {
                            ...prev.actions!,
                            type: e.target.value as PriceRule['actions']['type'],
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="percentage">Процентное изменение</option>
                        <option value="fixed">Фиксированное изменение</option>
                        <option value="formula">По формуле</option>
                        <option value="market_based">На основе рынка</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Значение</label>
                      <input
                        type="number"
                        value={newRule.actions?.value || 0}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          actions: { ...prev.actions!, value: parseFloat(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Частота</label>
                      <select
                        value={newRule.schedule?.frequency || 'daily'}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule!,
                            frequency: e.target.value as PriceRule['schedule']['frequency'],
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="immediate">Немедленно</option>
                        <option value="daily">Ежедневно</option>
                        <option value="weekly">Еженедельно</option>
                        <option value="monthly">Ежемесячно</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">Описание</label>
                      <textarea
                        value={newRule.description || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        rows={3}
                        placeholder="Описание условия срабатывания правила..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={createRule}
                      className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Создать правило
                    </button>
                    <button
                      onClick={() => setIsCreatingRule(false)}
                      className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Список правил */}
              <div className="space-y-3">
                {rules.map(rule => (
                  <div key={rule.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="font-medium text-black">{rule.name}</div>
                          <div className="text-sm text-gray-600">{rule.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {rule.triggerCount} срабатываний
                        </div>
                        <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {rule.successCount} успешно
                        </div>
                        {rule.errorCount > 0 && (
                          <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {rule.errorCount} ошибок
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>Тип: {rule.actions.type}</span>
                        <span>Значение: {rule.actions.value}</span>
                        <span>Частота: {rule.schedule.frequency}</span>
                        {rule.lastTriggered && (
                          <span>Последний запуск: {new Date(rule.lastTriggered).toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`px-3 py-1 rounded text-sm transition-all ${
                            rule.isActive 
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {rule.isActive ? 'Отключить' : 'Включить'}
                        </button>
                        <button
                          onClick={() => testRule(rule.id)}
                          className="px-3 py-1 bg-white border border-gray-300 text-black rounded text-sm hover:shadow-sm transition-all"
                        >
                          <Play className="w-4 h-4 inline mr-1" />
                          Тест
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-all"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* История */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">История изменений цен</h4>
              
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Объект</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Старая цена</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Новая цена</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Изменение</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Правило</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Дата</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {history.slice(0, 10).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.objectTitle}</div>
                          <div className="text-sm text-gray-600">{item.userName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.oldPrice.toLocaleString()} ₽</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.newPrice.toLocaleString()} ₽</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`font-medium ${item.change >= 0 ? 'text-gray-600' : 'text-gray-600'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change.toLocaleString()} ₽ ({item.changePercent.toFixed(1)}%)
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-black">{item.ruleName}</div>
                          <div className="text-sm text-gray-600">{item.reason}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Настройки системы</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Автоматизация</h5>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Автоматическое применение обновлений</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Уведомления о изменениях цен</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Интеграция с внешними источниками</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Ведение истории изменений</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h5 className="font-medium text-black mb-4">Ограничения</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Максимальное изменение за раз</label>
                      <input
                        type="number"
                        defaultValue="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Минимальная уверенность</label>
                      <input
                        type="number"
                        defaultValue="70"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Задержка между обновлениями</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white">
                        <option value="0">Нет задержки</option>
                        <option value="1">1 час</option>
                        <option value="24">1 день</option>
                        <option value="168">1 неделя</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="text-sm text-gray-600">
            Правил: {rules.length} • 
            Ожидают: {updates.filter(u => u.status === 'pending').length} • 
            Изменений: {history.length}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              <Save className="w-4 h-4 inline mr-2" />
              Сохранить настройки
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
