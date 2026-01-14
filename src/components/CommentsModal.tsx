"use client"

import { useState, useRef } from "react"
import { formatFileSize } from "@/lib/utils"
import {
  X,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Pin,
  Upload,
  Check,
  FileText
} from "lucide-react"

interface Comment {
  id: string
  text: string
  author: {
    id: string
    name: string
    role: 'admin' | 'manager' | 'agent' | 'employee'
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
  isEdited: boolean
  isPinned: boolean
  isPrivate: boolean
  visibility: 'all' | 'managers' | 'agents' | 'admins'
  replies: Comment[]
  attachments: Array<{
    id: string
    name: string
    url: string
    type: string
    size: string
  }>
  tags: string[]
  reactions: Array<{
    emoji: string
    users: string[]
  }>
  mentions: string[]
  isResolved: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
}

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (comments: Comment[]) => void
  initialComments?: Comment[]
  objectId?: string
  currentUser?: {
    id: string
    name: string
    role: 'admin' | 'manager' | 'agent' | 'employee'
  }
}

export default function CommentsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialComments = [], 
  objectId,
  currentUser = { id: 'current-user', name: 'Текущий пользователь', role: 'manager' }
}: CommentsModalProps) {
  void objectId
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest')
  const [filterVisibility, setFilterVisibility] = useState<string>('all')
  const [showResolved, setShowResolved] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [mentions, setMentions] = useState<string[]>([])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Фильтрация и сортировка комментариев
  const filteredComments = comments
    .filter(comment => {
      if (!showResolved && comment.isResolved) return false
      if (filterVisibility !== 'all' && comment.visibility !== filterVisibility) return false
      if (searchQuery && !comment.text.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !comment.author.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  // Добавление комментария
  const addComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      isEdited: false,
      isPinned: false,
      isPrivate: isPrivate,
      visibility: isPrivate ? 'managers' : 'all',
      replies: [],
      attachments: attachments.map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: formatFileSize(file.size)
      })),
      tags: tags,
      reactions: [],
      mentions: mentions,
      isResolved: false,
      priority: priority
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    setTags([])
    setAttachments([])
    setMentions([])
    setIsPrivate(false)
    setPriority('normal')
  }

  // Редактирование комментария
  const editComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId)
    if (comment) {
      setEditingComment(commentId)
      setEditText(comment.text)
    }
  }

  // Сохранение редактирования
  const saveEdit = () => {
    if (!editingComment || !editText.trim()) return

    setComments(prev => prev.map(comment => 
      comment.id === editingComment 
        ? { 
            ...comment, 
            text: editText.trim(), 
            updatedAt: new Date().toISOString(),
            isEdited: true 
          }
        : comment
    ))

    setEditingComment(null)
    setEditText('')
  }

  // Отмена редактирования
  const cancelEdit = () => {
    setEditingComment(null)
    setEditText('')
  }

  // Удаление комментария
  const deleteComment = (commentId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    }
  }

  // Закрепление комментария
  const togglePin = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isPinned: !comment.isPinned }
        : comment
    ))
  }

  // Решение комментария
  const toggleResolve = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isResolved: !comment.isResolved }
        : comment
    ))
  }

  // Добавление реакции
  const addReaction = (commentId: string, emoji: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const existingReaction = comment.reactions.find(r => r.emoji === emoji)
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // Убираем реакцию
            existingReaction.users = existingReaction.users.filter(id => id !== currentUser.id)
            if (existingReaction.users.length === 0) {
              comment.reactions = comment.reactions.filter(r => r.emoji !== emoji)
            }
          } else {
            // Добавляем реакцию
            existingReaction.users.push(currentUser.id)
          }
        } else {
          // Создаем новую реакцию
          comment.reactions.push({
            emoji,
            users: [currentUser.id]
          })
        }
      }
      return comment
    }))
  }

  // Добавление тега
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  // Удаление тега
  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  // Загрузка файлов
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!attachments.find(f => f.name === file.name)) {
        setAttachments(prev => [...prev, file])
      }
    })
  }

  // Удаление файла
  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName))
  }

  // Форматирование размера файла
  // Авторизация отключена - все могут всё
  const canEdit = () => {
    return true; // Все могут редактировать
  }

  const canDelete = () => {
    return true; // Все могут удалять
  }

  // Сохранение
  const handleSave = () => {
    onSave(comments)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-black" />
            <h3 className="text-xl font-semibold text-black">Комментарии к объекту</h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {comments.length} комментариев
              </div>
              {comments.filter(c => !c.isResolved).length > 0 && (
                <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {comments.filter(c => !c.isResolved).length} не решено
                </div>
              )}
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
            { id: 'all', label: 'Все комментарии', icon: MessageSquare },
            { id: 'unresolved', label: 'Не решено', icon: AlertCircle },
            { id: 'pinned', label: 'Закрепленные', icon: Pin },
            { id: 'private', label: 'Приватные', icon: Lock }
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

        {/* Содержимое */}
        <div className="flex h-[60vh]">
          {/* Левая панель - список комментариев */}
          <div className="flex-1 border-r border-gray-300 overflow-y-auto">
            {/* Фильтры и поиск */}
            <div className="p-4 border-b border-gray-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="Поиск комментариев..."
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'newest' | 'oldest' | 'priority')
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="newest">Новые сначала</option>
                  <option value="oldest">Старые сначала</option>
                  <option value="priority">По приоритету</option>
                </select>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showResolved}
                    onChange={(e) => setShowResolved(e.target.checked)}
                    className="mr-2"
                  />
                  Показать решенные
                </label>
                <select
                  value={filterVisibility}
                  onChange={(e) => setFilterVisibility(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-black bg-white text-xs"
                >
                  <option value="all">Все</option>
                  <option value="managers">Менеджеры</option>
                  <option value="agents">Агенты</option>
                  <option value="admins">Админы</option>
                </select>
              </div>
            </div>

            {/* Список комментариев */}
            <div className="p-4 space-y-4">
              {filteredComments.map(comment => (
                <div
                  key={comment.id}
                  className={`p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all ${
                    comment.isPinned ? 'border-gray-300 bg-gray-50' : ''
                  } ${comment.isResolved ? 'opacity-60' : ''}`}
                >
                  {/* Заголовок комментария */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-black">{comment.author.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                          {comment.isEdited && ' (изменен)'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {comment.isPinned && <Pin className="w-4 h-4 text-gray-600" />}
                      {comment.isPrivate && <Lock className="w-4 h-4 text-gray-600" />}
                      {comment.isResolved && <CheckCircle className="w-4 h-4 text-gray-600" />}
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        comment.priority === 'urgent' ? 'bg-gray-100 text-gray-800' :
                        comment.priority === 'high' ? 'bg-gray-100 text-gray-800' :
                        comment.priority === 'normal' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {comment.priority}
                      </div>
                    </div>
                  </div>

                  {/* Текст комментария */}
                  <div className="text-gray-800 mb-3">
                    {editingComment === comment.id ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        rows={3}
                      />
                    ) : (
                      <p>{comment.text}</p>
                    )}
                  </div>

                  {/* Теги */}
                  {comment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {comment.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Реакции */}
                  {comment.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {comment.reactions.map(reaction => (
                        <button
                          key={reaction.emoji}
                          onClick={() => addReaction(comment.id, reaction.emoji)}
                          className={`px-2 py-1 rounded-full text-xs border transition-all ${
                            reaction.users.includes(currentUser.id)
                              ? 'bg-gray-100 border-gray-300 text-gray-800'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {reaction.emoji} {reaction.users.length}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Вложения */}
                  {comment.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {comment.attachments.map(attachment => (
                        <div
                          key={attachment.id}
                          className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{attachment.name}</span>
                          <span className="text-gray-500">({attachment.size})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Действия */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => addReaction(comment.id, '👍')}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Нравится"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => addReaction(comment.id, '❤️')}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Любовь"
                      >
                        ❤️
                      </button>
                      <button
                        onClick={() => addReaction(comment.id, '😮')}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Удивление"
                      >
                        😮
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      {canEdit() && (
                        <>
                          {editingComment === comment.id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Сохранить"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Отмена"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => editComment(comment.id)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="Редактировать"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => togglePin(comment.id)}
                        className={`p-1 ${comment.isPinned ? 'text-gray-600' : 'text-gray-600 hover:text-gray-800'}`}
                        title={comment.isPinned ? 'Открепить' : 'Закрепить'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleResolve(comment.id)}
                        className={`p-1 ${comment.isResolved ? 'text-gray-600' : 'text-gray-600 hover:text-gray-800'}`}
                        title={comment.isResolved ? 'Отметить как нерешенное' : 'Отметить как решенное'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      {canDelete() && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая панель - создание комментария */}
          <div className="w-80 p-4 bg-gray-50">
            <h4 className="text-lg font-semibold text-black mb-4">Новый комментарий</h4>
            
            {/* Настройки комментария */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm text-gray-700">Приватный комментарий</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Приоритет</label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as 'low' | 'normal' | 'high' | 'urgent')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                >
                  <option value="low">Низкий</option>
                  <option value="normal">Обычный</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
              </div>
            </div>

            {/* Текст комментария */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">Комментарий</label>
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                rows={4}
                placeholder="Введите ваш комментарий..."
              />
            </div>

            {/* Теги */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">Теги</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white text-sm"
                  placeholder="Добавить тег"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Вложения */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">Вложения</label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Добавить файлы
              </button>
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.map(file => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeAttachment(file.name)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Кнопка добавления */}
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="w-full px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Добавить комментарий
            </button>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-300 bg-gray-50">
          <div className="text-sm text-gray-600">
            Всего комментариев: {comments.length} • 
            Не решено: {comments.filter(c => !c.isResolved).length} • 
            Закреплено: {comments.filter(c => c.isPinned).length}
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
              Сохранить комментарии
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
