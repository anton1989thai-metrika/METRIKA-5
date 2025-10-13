"use client"

import { useState, useRef } from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Save, 
  Eye, 
  Calendar, 
  Tag, 
  Globe, 
  Upload,
  X,
  Check,
  AlertCircle,
  Plus,
  RefreshCw
} from "lucide-react"

interface ContentEditorProps {
  isOpen: boolean
  onClose: () => void
  content?: any
  onSave: (content: any) => void
}

export default function ContentEditor({ isOpen, onClose, content, onSave }: ContentEditorProps) {
  const [title, setTitle] = useState(content?.title || '')
  const [excerpt, setExcerpt] = useState(content?.excerpt || '')
  const [contentText, setContentText] = useState(content?.content || '')
  const [category, setCategory] = useState(content?.category || 'blog')
  const [tags, setTags] = useState(content?.tags || [])
  const [status, setStatus] = useState(content?.status || 'draft')
  const [featuredImage, setFeaturedImage] = useState(content?.featuredImage || '')
  const [seoTitle, setSeoTitle] = useState(content?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(content?.seoDescription || '')
  const [publishDate, setPublishDate] = useState(content?.publishDate || '')
  const [language, setLanguage] = useState(content?.language || 'ru')
  const [newTag, setNewTag] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'blog', label: 'Статьи блога' },
    { value: 'news', label: 'Новости' },
    { value: 'knowledge', label: 'База знаний' },
    { value: 'faq', label: 'FAQ' },
    { value: 'policies', label: 'Политики и документы' }
  ]

  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
    { value: 'th', label: 'ไทย' }
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // В реальном приложении здесь будет загрузка на сервер
      const reader = new FileReader()
      reader.onload = (e) => {
        setFeaturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    const contentData = {
      id: content?.id || Date.now(),
      title,
      excerpt,
      content: contentText,
      category,
      tags,
      status,
      featuredImage,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      publishDate: publishDate || new Date().toISOString(),
      language,
      createdAt: content?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Администратор',
      views: content?.views || 0
    }

    try {
      await onSave(contentData)
      onClose()
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const formatText = (command: string) => {
    document.execCommand(command, false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-black">
            {content ? 'Редактировать контент' : 'Создать новый контент'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Eye className="w-4 h-4 inline mr-1" />
              {showPreview ? 'Редактор' : 'Превью'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Левая панель - Редактор */}
          {!showPreview && (
            <div className="flex-1 flex flex-col">
              {/* Панель инструментов */}
              <div className="p-4 border-b border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => formatText('bold')}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Жирный"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => formatText('italic')}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Курсив"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => formatText('underline')}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Подчеркнутый"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Маркированный список"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => formatText('insertOrderedList')}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Нумерованный список"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => formatText('createLink')}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Ссылка"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                    title="Изображение"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Основные поля */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Заголовок</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      placeholder="Введите заголовок..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Категория</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Редактор контента */}
              <div className="flex-1 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">Краткое описание</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                    placeholder="Краткое описание статьи..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">Содержание</label>
                  <div
                    contentEditable
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white min-h-64 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onInput={(e) => setContentText(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: contentText }}
                  />
                </div>

                {/* Теги */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">Теги</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      placeholder="Добавить тег..."
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Правая панель - Настройки и превью */}
          <div className="w-80 border-l border-gray-300 flex flex-col">
            {/* Настройки публикации */}
            <div className="p-4 border-b border-gray-300">
              <h3 className="font-semibold text-black mb-3">Настройки публикации</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Статус</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликовано</option>
                    <option value="scheduled">Запланировано</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Дата публикации</label>
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Язык</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Изображение */}
            <div className="p-4 border-b border-gray-300">
              <h3 className="font-semibold text-black mb-3">Изображение</h3>
              
              <div className="space-y-3">
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Загрузить изображение</div>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* SEO настройки */}
            <div className="p-4 border-b border-gray-300">
              <h3 className="font-semibold text-black mb-3">SEO настройки</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">SEO заголовок</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="SEO заголовок..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">SEO описание</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                    placeholder="SEO описание..."
                  />
                </div>
              </div>
            </div>

            {/* Превью */}
            {showPreview && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold text-black mb-3">Превью</h3>
                
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  {featuredImage && (
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h1 className="text-xl font-bold text-black mb-2">{title || 'Заголовок'}</h1>
                  <p className="text-gray-600 mb-4">{excerpt || 'Краткое описание...'}</p>
                  
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: contentText || '<p>Содержание статьи...</p>' }}
                  />
                  
                  {tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Действия */}
            <div className="p-4 border-t border-gray-300">
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !title.trim()}
                  className="flex-1 px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#e6d90a')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#fff60b')}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-2" />
                      Сохранить
                    </>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
