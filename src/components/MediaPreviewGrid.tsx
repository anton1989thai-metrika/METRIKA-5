"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Image, Video, Star, StarOff } from 'lucide-react'
import { MediaFile } from './MediaUploader'
import { cn } from '@/lib/utils'

interface MediaPreviewGridProps {
  mediaFiles: MediaFile[]
  onRemove: (id: string) => void
  onSetCover?: (id: string) => void
  coverId?: string
  className?: string
}

export function MediaPreviewGrid({ 
  mediaFiles, 
  onRemove, 
  onSetCover,
  coverId,
  className 
}: MediaPreviewGridProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (mediaFiles.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Файлы не загружены</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">
          Медиа-файлы ({mediaFiles.length})
        </h4>
        {coverId && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Star className="w-3 h-3 mr-1" />
            Обложка выбрана
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaFiles.map((media, index) => {
          const isCover = coverId === media.id
          
          return (
            <Card key={media.id} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {media.type === 'image' ? (
                    <img
                      src={media.preview}
                      alt={media.name}
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
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Обложка
                      </Badge>
                    </div>
                  )}
                  
                  {/* Номер файла */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {index + 1}
                    </Badge>
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
                    
                    {onSetCover && media.type === 'image' && (
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
                        <Image className="w-3 h-3 mr-1" />
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
        })}
      </div>
      
      {/* Подсказка */}
      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Подсказки:</p>
        <ul className="space-y-1 text-xs">
          <li>• Наведите курсор на файл для управления</li>
          <li>• Звездочка — установить как обложку (только для изображений)</li>
          <li>• Крестик — удалить файл</li>
          <li>• Первое изображение автоматически становится обложкой</li>
        </ul>
      </div>
    </div>
  )
}
