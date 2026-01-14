"use client"

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Video, Star, StarOff, GripVertical } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface MediaFile {
  id: string
  file: File
  type: 'image' | 'video'
  preview: string
  name: string
  size: number
  isCover?: boolean
  order?: number
}

interface MediaUploaderProps {
  onMediaChange: (media: MediaFile[]) => void
  maxFiles?: number
  maxSize?: number // в MB
  acceptedTypes?: string[]
}

// Компонент для сортируемого элемента медиа
function SortableMediaItem({ 
  media, 
  onRemove, 
  onSetCover, 
  isCover 
}: { 
  media: MediaFile
  onRemove: (id: string) => void
  onSetCover: (id: string) => void
  isCover: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative group cursor-grab active:cursor-grabbing",
        isCover && "ring-2 ring-yellow-400 ring-offset-2"
      )}
    >
      <CardContent className="p-2">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          {media.type === 'image' ? (
            <Image
              src={media.preview}
              alt={media.name}
              width={300}
              height={300}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Индикатор обложки */}
          {isCover && (
            <div className="absolute top-2 left-2">
              <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Главное фото
              </div>
            </div>
          )}
          
          {/* Кнопка перетаскивания */}
          <div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <Button size="sm" variant="secondary" className="w-6 h-6 p-0">
              <GripVertical className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Кнопки управления */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <Button
              size="sm"
              variant="destructive"
              className="w-8 h-8 p-0"
              onClick={() => onRemove(media.id)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {media.type === 'image' && (
              <Button
                size="sm"
                variant={isCover ? "default" : "secondary"}
                className="w-8 h-8 p-0"
                onClick={() => onSetCover(media.id)}
              >
                {isCover ? (
                  <StarOff className="w-4 h-4" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Информация о файле */}
        <div className="mt-2 space-y-1">
          <p className="text-xs font-medium text-gray-900 truncate" title={media.name}>
            {media.name}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              {media.type === 'image' ? (
                <ImageIcon className="w-3 h-3 mr-1" />
              ) : (
                <Video className="w-3 h-3 mr-1" />
              )}
              {formatFileSize(media.size)}
            </div>
            {isCover && (
              <Star className="w-3 h-3 text-yellow-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MediaUploader({ 
  onMediaChange, 
  maxFiles = 20, 
  maxSize = 50,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/mov']
}: MediaUploaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const validateFile = useCallback((file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      alert(`Неподдерживаемый тип файла: ${file.type}`)
      return false
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Файл слишком большой. Максимальный размер: ${maxSize}MB`)
      return false
    }
    
    if (mediaFiles.length >= maxFiles) {
      alert(`Максимальное количество файлов: ${maxFiles}`)
      return false
    }
    
    return true
  }, [acceptedTypes, maxFiles, maxSize, mediaFiles.length])

  const createMediaFile = useCallback(async (file: File): Promise<MediaFile> => {
    const id = Math.random().toString(36).substr(2, 9)
    const type = file.type.startsWith('image/') ? 'image' : 'video'
    
    let preview = ''
    if (type === 'image') {
      preview = URL.createObjectURL(file)
    } else {
      // Для видео создаем временный URL для превью
      preview = URL.createObjectURL(file)
    }
    
    return {
      id,
      file,
      type,
      preview,
      name: file.name,
      size: file.size,
      isCover: false,
      order: mediaFiles.length
    }
  }, [mediaFiles.length])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setMediaFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Обновляем порядок
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index
        }))
        
        onMediaChange(updatedItems)
        return updatedItems
      })
    }
  }

  const handleSetCover = (id: string) => {
    setMediaFiles((items) => {
      const updatedItems = items.map((item) => ({
        ...item,
        isCover: item.id === id
      }))
      onMediaChange(updatedItems)
      return updatedItems
    })
  }

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setIsUploading(true)
    
    try {
      const fileArray = Array.from(files)
      const validFiles = fileArray.filter(validateFile)
      
      const newMediaFiles = await Promise.all(
        validFiles.map(createMediaFile)
      )
      
      const updatedMedia = [...mediaFiles, ...newMediaFiles]
      
      // Автоматически устанавливаем первое изображение как обложку, если обложки еще нет
      const hasCover = updatedMedia.some(item => item.isCover)
      if (!hasCover && newMediaFiles.length > 0) {
        const firstImage = newMediaFiles.find(item => item.type === 'image')
        if (firstImage) {
          firstImage.isCover = true
        }
      }
      
      setMediaFiles(updatedMedia)
      onMediaChange(updatedMedia)
    } catch (error) {
      console.error('Ошибка при обработке файлов:', error)
    } finally {
      setIsUploading(false)
    }
  }, [createMediaFile, mediaFiles, onMediaChange, validateFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    // Сброс input для возможности повторного выбора того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFiles])

  const removeFile = useCallback((id: string) => {
    setMediaFiles((items) => {
      const updatedItems = items.filter(file => file.id !== id)
      
      // Если удаляем обложку, выбираем новую
      const removedItem = items.find(item => item.id === id)
      if (removedItem?.isCover) {
        const firstImage = updatedItems.find(item => item.type === 'image')
        if (firstImage) {
          firstImage.isCover = true
        }
      }
      
      // Обновляем порядок
      const reorderedItems = updatedItems.map((item, index) => ({
        ...item,
        order: index
      }))
      
      onMediaChange(reorderedItems)
      return reorderedItems
    })
  }, [onMediaChange])

  return (
    <div className="space-y-6">
      {/* Область загрузки */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragOver 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Перетащите файлы сюда
              </h3>
              <p className="text-gray-600 mt-2">
                или нажмите кнопку для выбора файлов
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || mediaFiles.length >= maxFiles}
                className="w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Загрузка...' : 'Выбрать файлы'}
              </Button>
              
              <p className="text-sm text-gray-500">
                Поддерживаемые форматы: JPG, PNG, WebP, MP4, MOV
                <br />
                Максимум {maxFiles} файлов, до {maxSize}MB каждый
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Скрытый input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Предпросмотр загруженных файлов */}
      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Загруженные файлы ({mediaFiles.length}/{maxFiles})
            </h4>
            <div className="text-sm text-gray-500">
              Перетащите для изменения порядка
            </div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={mediaFiles.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaFiles.map((media) => (
                  <SortableMediaItem
                    key={media.id}
                    media={media}
                    onRemove={removeFile}
                    onSetCover={handleSetCover}
                    isCover={media.isCover || false}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {/* Подсказки */}
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Подсказки:</p>
            <ul className="space-y-1 text-xs">
              <li>• Перетащите файлы для изменения порядка</li>
              <li>• Звездочка — установить как главное фото</li>
              <li>• Крестик — удалить файл</li>
              <li>• Первое изображение автоматически становится главным</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
