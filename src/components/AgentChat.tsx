"use client"

import { useState } from "react"
import { X, Send, Phone, Mail, MessageCircle } from "lucide-react"

interface AgentChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function AgentChat({ isOpen, onClose }: AgentChatProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Здравствуйте! Я Анна, ваш персональный агент по недвижимости. Чем могу помочь?",
      isAgent: true,
      timestamp: new Date()
    }
  ])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isAgent: false,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setMessage("")
      
      // Имитация ответа агента
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          text: "Спасибо за ваш вопрос! Я изучу детали и отвечу в ближайшее время. Также могу предложить организовать просмотр объекта.",
          isAgent: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, agentResponse])
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-semibold">А</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Анна Петрова</h2>
              <p className="text-sm text-gray-600">Агент по недвижимости</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-96">
          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isAgent ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isAgent
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.isAgent ? 'text-gray-500' : 'text-gray-100'
                  }`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Поле ввода */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <Phone className="w-4 h-4 mr-2" />
              Позвонить
            </button>
            <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Записать на просмотр
            </button>
            <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </button>
          </div>
        </div>

        {/* Информация об агенте */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Онлайн • Ответит в течение 5 минут</p>
              <p>Опыт работы: 5 лет • 150+ сделок</p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
              <span>В сети</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
