'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import BurgerMenu from '@/components/BurgerMenu'
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Settings, 
  Bell, 
  BellOff,
  Pin,
  MoreVertical,
  Paperclip,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

interface Email {
  id: string
  from: string
  to: string
  subject: string
  content: string
  date: string
  isRead: boolean
  isStarred: boolean
  isImportant: boolean
  attachments: string[]
  block?: string
  priority: 'low' | 'normal' | 'high'
}

interface EmailBlock {
  id: string
  name: string
  color: string
  icon: string
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  emails: Email[]
  notificationSettings: {
    enabled: boolean
    priority: boolean
    workingHours: boolean
  }
}

export default function EmailPage() {
  const { data: session, status } = useSession()
  const [activeView, setActiveView] = useState<'blocks' | 'list' | 'folders'>('blocks')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [blocks, setBlocks] = useState<EmailBlock[]>([])
  const [allEmails, setAllEmails] = useState<Email[]>([])

  // Mock data
  useEffect(() => {
    const mockBlocks: EmailBlock[] = [
      {
        id: 'banks',
        name: 'Банки',
        color: '#3b82f6',
        icon: 'Bank',
        unreadCount: 3,
        isPinned: true,
        isMuted: false,
        emails: [
          {
            id: '1',
            from: 'sberbank@bank.ru',
            to: 'user@metrika.direct',
            subject: 'Выписка по счету за декабрь',
            content: 'Ваша выписка по счету готова к просмотру...',
            date: '2024-01-15',
            isRead: false,
            isStarred: false,
            isImportant: true,
            attachments: ['statement.pdf'],
            block: 'banks',
            priority: 'high'
          }
        ],
        notificationSettings: {
          enabled: true,
          priority: true,
          workingHours: true
        }
      },
      {
        id: 'partners',
        name: 'Партнеры',
        color: '#10b981',
        icon: 'Handshake',
        unreadCount: 7,
        isPinned: true,
        isMuted: false,
        emails: [],
        notificationSettings: {
          enabled: true,
          priority: false,
          workingHours: true
        }
      },
      {
        id: 'unknown',
        name: 'Неизвестные',
        color: '#f59e0b',
        icon: 'QuestionMark',
        unreadCount: 12,
        isPinned: false,
        isMuted: true,
        emails: [],
        notificationSettings: {
          enabled: false,
          priority: false,
          workingHours: false
        }
      }
    ]

    const mockEmails: Email[] = [
      {
        id: '1',
        from: 'sberbank@bank.ru',
        to: 'user@metrika.direct',
        subject: 'Выписка по счету за декабрь',
        content: 'Ваша выписка по счету готова к просмотру...',
        date: '2024-01-15',
        isRead: false,
        isStarred: false,
        isImportant: true,
        attachments: ['statement.pdf'],
        block: 'banks',
        priority: 'high'
      },
      {
        id: '2',
        from: 'partner@company.com',
        to: 'user@metrika.direct',
        subject: 'Предложение о сотрудничестве',
        content: 'Здравствуйте! Предлагаем рассмотреть возможность сотрудничества...',
        date: '2024-01-14',
        isRead: true,
        isStarred: true,
        isImportant: false,
        attachments: [],
        block: 'partners',
        priority: 'normal'
      }
    ]

    setBlocks(mockBlocks)
    setAllEmails(mockEmails)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Загрузка почты...</p>
        </div>
      </div>
    )
  }

  // Авторизация отключена - доступ открыт для всех

  const handleCreateBlock = () => {
    // TODO: Implement block creation
    console.log('Create new block')
  }

  const handleMoveEmailToBlock = (emailId: string, blockId: string) => {
    // TODO: Implement email moving
    console.log('Move email', emailId, 'to block', blockId)
  }

  const handleToggleBlockPin = (blockId: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, isPinned: !block.isPinned }
        : block
    ))
  }

  const handleToggleBlockMute = (blockId: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, isMuted: !block.isMuted }
        : block
    ))
  }

  const filteredEmails = allEmails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedBlocks = [...blocks].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.unreadCount - a.unreadCount
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Burger Menu */}
      <BurgerMenu />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between h-16 pb-2">
            <div className="flex items-end space-x-4">
              <Mail className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-xl font-semibold text-black">Почта METRIKA</h1>
                <span className="text-sm text-gray-500">user@metrika.direct</span>
              </div>
            </div>
            
            <div className="flex items-end space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск писем..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              
              <button
                onClick={() => setShowCompose(true)}
                className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                <Send className="w-4 h-4 inline mr-2" />
                Написать
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 space-y-4">
            {/* View Toggle */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-black mb-3">Вид</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveView('blocks')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'blocks' 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                    Блоки
                  </div>
                </button>
                <button
                  onClick={() => setActiveView('list')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'list' 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                    Список
                  </div>
                </button>
                <button
                  onClick={() => setActiveView('folders')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'folders' 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                    Папки
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-black mb-3">Быстрые действия</h3>
              <div className="space-y-2">
                <button
                  onClick={handleCreateBlock}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать блок
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center">
                  <Archive className="w-4 h-4 mr-2" />
                  Архив
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeView === 'blocks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-black">Блоки писем</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Всего писем: {allEmails.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      Непрочитанных: {allEmails.filter(e => !e.isRead).length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: block.color }}
                          ></div>
                          <h3 className="font-medium text-black">{block.name}</h3>
                          {block.isPinned && (
                            <Pin className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {block.isMuted ? (
                            <BellOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Bell className="w-4 h-4 text-gray-600" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowSettings(true)
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {block.emails.length} писем
                        </span>
                        {block.unreadCount > 0 && (
                          <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                            {block.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'list' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-black">Все письма</h2>
                  <div className="flex items-center space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Все письма</option>
                      <option>Непрочитанные</option>
                      <option>Важные</option>
                      <option>С вложениями</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                        !email.isRead ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {!email.isRead && (
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            )}
                            {email.isStarred && (
                              <Star className="w-4 h-4 text-gray-500 fill-current" />
                            )}
                            {email.isImportant && (
                              <AlertCircle className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-black">{email.from}</p>
                            <p className="text-sm text-gray-600">{email.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {email.attachments.length > 0 && (
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-500">{email.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'folders' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-black">Папки</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <Inbox className="w-5 h-5 text-gray-500" />
                      <h3 className="font-medium text-black">Входящие</h3>
                    </div>
                    <p className="text-sm text-gray-600">12 непрочитанных</p>
                  </div>
                  
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <Send className="w-5 h-5 text-gray-500" />
                      <h3 className="font-medium text-black">Отправленные</h3>
                    </div>
                    <p className="text-sm text-gray-600">45 писем</p>
                  </div>
                  
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <Star className="w-5 h-5 text-gray-500" />
                      <h3 className="font-medium text-black">Избранное</h3>
                    </div>
                    <p className="text-sm text-gray-600">8 писем</p>
                  </div>
                  
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <Trash2 className="w-5 h-5 text-gray-500" />
                      <h3 className="font-medium text-black">Корзина</h3>
                    </div>
                    <p className="text-sm text-gray-600">23 письма</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
