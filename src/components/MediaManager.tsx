"use client"

import Image from "next/image"
import { debugLog } from "@/lib/logger"
import { formatFileSize } from "@/lib/utils"

import { useState, useRef, useCallback, useMemo } from "react"
import { 
  Upload, 
  Image as ImageIcon, 
  File, 
  Video, 
  Music, 
  Archive, 
  FileText, 
  Trash2, 
  Edit, 
  Eye, 
  Search, 
  Grid, 
  List, 
  Folder, 
  FolderPlus, 
  X
} from "lucide-react"

interface MediaFile {
  id: number
  name: string
  type: 'image' | 'video' | 'document' | 'audio' | 'archive'
  size: number
  url: string
  thumbnail?: string
  uploadedAt: string
  folder: string
  tags: string[]
  description?: string
  alt?: string
  dimensions?: { width: number; height: number }
}

interface MediaManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (file: MediaFile) => void
  multiple?: boolean
  acceptedTypes?: string[]
}

export default function MediaManager({ 
  isOpen, 
  onClose, 
  onSelect, 
  multiple = false, 
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'] 
}: MediaManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Mock данные
  const mediaFiles = useMemo<MediaFile[]>(() => [
    {
      id: 1,
      name: "hero-bg.jpg",
      type: "image",
      size: 2048576,
      url: "/images/hero-bg.jpg",
      thumbnail: "/images/hero-bg.jpg",
      uploadedAt: "2024-01-15",
      folder: "heroes",
      tags: ["фон", "главная"],
      description: "Фоновое изображение для главной страницы",
      alt: "Фон главной страницы",
      dimensions: { width: 1920, height: 1080 }
    },
    {
      id: 2,
      name: "logo.png",
      type: "image",
      size: 512000,
      url: "/images/logo.png",
      thumbnail: "/images/logo.png",
      uploadedAt: "2024-01-10",
      folder: "branding",
      tags: ["логотип", "бренд"],
      description: "Логотип компании",
      alt: "Логотип МЕТРИКА",
      dimensions: { width: 200, height: 200 }
    },
    {
      id: 3,
      name: "object-1.jpg",
      type: "image",
      size: 1536000,
      url: "/images/object-1.jpg",
      thumbnail: "/images/object-1.jpg",
      uploadedAt: "2024-01-20",
      folder: "objects",
      tags: ["объект", "недвижимость"],
      description: "Фотография объекта недвижимости",
      alt: "Объект недвижимости",
      dimensions: { width: 800, height: 600 }
    },
    {
      id: 4,
      name: "presentation.pdf",
      type: "document",
      size: 5242880,
      url: "/documents/presentation.pdf",
      uploadedAt: "2024-01-18",
      folder: "documents",
      tags: ["презентация", "документ"],
      description: "Презентация компании"
    },
    {
      id: 5,
      name: "company-video.mp4",
      type: "video",
      size: 52428800,
      url: "/videos/company-video.mp4",
      thumbnail: "/images/video-thumb-1.jpg",
      uploadedAt: "2024-01-12",
      folder: "videos",
      tags: ["видео", "компания"],
      description: "Видео о компании"
    }
  ], [])

  const folders = useMemo(() => [
    { name: "all", label: "Все файлы", count: mediaFiles.length },
    { name: "heroes", label: "Фоны", count: mediaFiles.filter(f => f.folder === "heroes").length },
    { name: "branding", label: "Брендинг", count: mediaFiles.filter(f => f.folder === "branding").length },
    { name: "objects", label: "Объекты", count: mediaFiles.filter(f => f.folder === "objects").length },
    { name: "documents", label: "Документы", count: mediaFiles.filter(f => f.folder === "documents").length },
    { name: "videos", label: "Видео", count: mediaFiles.filter(f => f.folder === "videos").length }
  ], [mediaFiles])

  const filteredFiles = useMemo(() => mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder
    const matchesType = selectedType === 'all' || file.type === selectedType
    
    return matchesSearch && matchesFolder && matchesType
  }), [mediaFiles, searchQuery, selectedFolder, selectedType])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-gray-500" />
      case 'video': return <Video className="w-8 h-8 text-gray-500" />
      case 'document': return <FileText className="w-8 h-8 text-gray-500" />
      case 'audio': return <Music className="w-8 h-8 text-gray-500" />
      case 'archive': return <Archive className="w-8 h-8 text-gray-500" />
      default: return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const handleFileSelect = (file: MediaFile) => {
    if (multiple) {
      setSelectedFiles(prev => 
        prev.includes(file.id) 
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      )
    } else {
      onSelect?.(file)
      onClose()
    }
  }

  const handleUpload = useCallback(async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Симуляция загрузки
    for (let i = 0; i < files.length; i++) {
      const progress = ((i + 1) / files.length) * 100
      setUploadProgress(progress)
      
      // В реальном приложении здесь будет загрузка на сервер
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsUploading(false)
    setShowUploadModal(false)
    setUploadProgress(0)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleUpload(files)
    }
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handlePreview = (file: MediaFile) => {
    setPreviewFile(file)
    setShowPreview(true)
  }

  const handleEdit = (file: MediaFile) => {
    alert(`Редактирование файла "${file.name}" пока недоступно`)
  }

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот файл?')) {
      // В реальном приложении здесь будет API вызов
      debugLog('Удаление файла:', id)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-black">Медиа библиотека</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
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
          {/* Левая панель - Папки */}
          <div className="w-64 border-r border-gray-300 p-4">
            <div className="mb-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium mb-2"
                style={{backgroundColor: '#fff60b'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Загрузить файлы
              </button>
              
              <button className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                <FolderPlus className="w-4 h-4 inline mr-2" />
                Создать папку
              </button>
            </div>

            <div className="space-y-1">
              {folders.map(folder => (
                <button
                  key={folder.name}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    selectedFolder === folder.name
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center">
                    <Folder className="w-4 h-4 mr-2" />
                    {folder.label}
                  </div>
                  <span className="text-xs opacity-75">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Основная область */}
          <div className="flex-1 flex flex-col">
            {/* Панель поиска и фильтров */}
            <div className="p-4 border-b border-gray-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск файлов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                  />
                </div>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black border border-gray-300"
                >
                  <option value="all">Все типы</option>
                  <option value="image">Изображения</option>
                  <option value="video">Видео</option>
                  <option value="document">Документы</option>
                  <option value="audio">Аудио</option>
                  <option value="archive">Архивы</option>
                </select>
              </div>

              {/* Статистика */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>{filteredFiles.length} файлов</span>
                <span>{formatFileSize(filteredFiles.reduce((acc, file) => acc + file.size, 0))}</span>
                {selectedFiles.length > 0 && (
                  <span className="text-black font-medium">
                    Выбрано: {selectedFiles.length}
                  </span>
                )}
              </div>
            </div>

            {/* Область файлов */}
            <div 
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex-1 p-4 overflow-y-auto"
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      className={`relative bg-white border border-gray-300 rounded-lg p-3 cursor-pointer transition-all hover:shadow-lg ${
                        selectedFiles.includes(file.id) ? 'ring-2 ring-yellow-400' : ''
                      }`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <div className="aspect-square flex items-center justify-center mb-2">
                        {file.thumbnail ? (
                          <Image
                            src={file.thumbnail}
                            alt={file.alt || file.name}
                            width={200}
                            height={200}
                            unoptimized
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>
                      
                      <div className="text-xs text-black font-medium truncate mb-1">
                        {file.name}
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        {formatFileSize(file.size)}
                      </div>

                      {/* Действия */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePreview(file)
                          }}
                          className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-all"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(file)
                          }}
                          className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-all"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                          className="p-1 bg-white border border-gray-300 text-gray-600 rounded shadow-sm hover:shadow-md transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      className={`flex items-center p-3 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                        selectedFiles.includes(file.id) ? 'ring-2 ring-yellow-400' : ''
                      }`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <div className="w-12 h-12 flex items-center justify-center mr-4">
                        {file.thumbnail ? (
                          <Image
                            src={file.thumbnail}
                            alt={file.alt || file.name}
                            width={48}
                            height={48}
                            unoptimized
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-black truncate">{file.name}</div>
                        <div className="text-sm text-gray-600">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('ru-RU')}
                        </div>
                        {file.description && (
                          <div className="text-xs text-gray-500 truncate">{file.description}</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePreview(file)
                          }}
                          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(file)
                          }}
                          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                          className="p-2 bg-white border border-gray-300 text-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Файлы не найдены</h3>
                  <p className="text-gray-500">Попробуйте изменить параметры поиска или загрузите новые файлы</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Модальное окно загрузки */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Загрузка файлов</h3>
              
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600 mb-2">Перетащите файлы сюда или нажмите для выбора</div>
                <div className="text-sm text-gray-500">
                  Поддерживаемые форматы: JPG, PNG, GIF, MP4, PDF, DOC, ZIP
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
              />
              
              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Загрузка...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно предварительного просмотра */}
        {showPreview && previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-black">{previewFile.name}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                {previewFile.type === 'image' ? (
                  <Image
                    src={previewFile.url}
                    alt={previewFile.alt || previewFile.name}
                    width={previewFile.dimensions?.width ?? 1200}
                    height={previewFile.dimensions?.height ?? 800}
                    unoptimized
                    className="max-w-full max-h-[60vh] mx-auto"
                  />
                ) : previewFile.type === 'video' ? (
                  <video
                    src={previewFile.url}
                    controls
                    className="max-w-full max-h-[60vh] mx-auto"
                  />
                ) : (
                  <div className="text-center py-12">
                    {getFileIcon(previewFile.type)}
                    <div className="mt-4 text-gray-600">
                      Предварительный просмотр недоступен для этого типа файла
                    </div>
                  </div>
                )}
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-black">Размер</div>
                    <div className="text-gray-600">{formatFileSize(previewFile.size)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-black">Загружен</div>
                    <div className="text-gray-600">{new Date(previewFile.uploadedAt).toLocaleDateString('ru-RU')}</div>
                  </div>
                  {previewFile.dimensions && (
                    <div>
                      <div className="font-medium text-black">Разрешение</div>
                      <div className="text-gray-600">{previewFile.dimensions.width} × {previewFile.dimensions.height}</div>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-black">Папка</div>
                    <div className="text-gray-600">{previewFile.folder}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
