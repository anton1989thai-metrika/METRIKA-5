"use client"

import { useState } from "react"
import { X, Bell, Clock, Calendar, Award, AlertCircle, CheckCircle, BookOpen, TestTube, FileText } from "lucide-react"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [activeTab, setActiveTab] = useState('all')

  const notifications = [
    {
      id: 1,
      type: 'course',
      title: 'Новый курс доступен',
      message: 'Курс "Работа с коммерческой недвижимостью" теперь доступен для изучения',
      time: '2 часа назад',
      read: false,
      priority: 'high',
      action: 'Начать обучение'
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Приближается дедлайн',
      message: 'До завершения курса "Основы недвижимости" осталось 3 дня',
      time: '4 часа назад',
      read: false,
      priority: 'high',
      action: 'Продолжить обучение'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Новое достижение!',
      message: 'Вы получили достижение "Знаток основ" за прохождение теста на 90+ баллов',
      time: '1 день назад',
      read: true,
      priority: 'medium',
      action: 'Посмотреть достижения'
    },
    {
      id: 4,
      type: 'test',
      title: 'Тест пройден успешно',
      message: 'Поздравляем! Вы успешно прошли тест "Работа с клиентами" с результатом 92/100',
      time: '2 дня назад',
      read: true,
      priority: 'medium',
      action: 'Посмотреть результаты'
    },
    {
      id: 5,
      type: 'material',
      title: 'Новые материалы',
      message: 'Добавлены новые документы к курсу "Юридические аспекты"',
      time: '3 дня назад',
      read: true,
      priority: 'low',
      action: 'Открыть материалы'
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Напоминание об обучении',
      message: 'Не забудьте продолжить изучение курса "Зарубежная недвижимость"',
      time: '5 дней назад',
      read: true,
      priority: 'low',
      action: 'Продолжить обучение'
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-5 h-5" />
      case 'test': return <TestTube className="w-5 h-5" />
      case 'achievement': return <Award className="w-5 h-5" />
      case 'deadline': return <Clock className="w-5 h-5" />
      case 'material': return <FileText className="w-5 h-5" />
      case 'reminder': return <Bell className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-gray-500'
    if (priority === 'medium') return 'text-gray-500'
    return 'text-gray-500'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-gray-100 text-gray-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий'
      case 'medium': return 'Средний'
      case 'low': return 'Низкий'
      default: return 'Неизвестно'
    }
  }

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab)

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Уведомления</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Навигация */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Все ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('course')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'course' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Курсы
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'test' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Тесты
              </button>
              <button
                onClick={() => setActiveTab('achievement')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'achievement' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Достижения
              </button>
            </div>
          </div>

          {/* Список уведомлений */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-white border-gray-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 ${
                    notification.read ? 'bg-gray-100' : 'bg-white'
                  }`}>
                    <div className={getIconColor(notification.type, notification.priority)}>
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-medium ${
                        notification.read ? 'text-gray-900' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {getPriorityText(notification.priority)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-2 ${
                      notification.read ? 'text-gray-600' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                        {notification.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Действия */}
          <div className="mt-6 flex justify-between">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Отметить все как прочитанные
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Настройки уведомлений
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
