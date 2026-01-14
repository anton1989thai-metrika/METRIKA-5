"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Share2, 
  Eye, 
  Download, 
  Calendar
} from 'lucide-react'

interface PropertyHeaderProps {
  title: string
  address: string
  price: string
  views: number
  favorites: number
  isFavorite: boolean
  onCall: () => void
  onMessage: () => void
  onFavorite: () => void
  onShare: () => void
  onRequestViewing: () => void
  onExportPDF: () => void
}

export function PropertyHeader({
  title,
  address,
  price,
  views,
  favorites,
  isFavorite,
  onCall,
  onMessage,
  onFavorite,
  onShare,
  onRequestViewing,
  onExportPDF
}: PropertyHeaderProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-white">
      <CardContent className="p-6">
        {/* Заголовок и адрес */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-lg text-gray-600 mb-4">{address}</p>
          <div className="text-4xl font-bold text-gray-900 mb-4">{price}</div>
        </div>

        {/* Статистика */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-2" />
            <span>Просмотрено {views} раз за 7 дней</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Heart className="w-4 h-4 mr-2" />
            <span>{favorites} человек добавили в избранное</span>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCall}
            className="flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Позвонить
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onMessage}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Написать
          </Button>
          
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="sm"
            onClick={onFavorite}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </Button>
          
          <Button 
            size="sm"
            onClick={onRequestViewing}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border-0"
          >
            <Calendar className="w-4 h-4" />
            Запросить просмотр
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExportPDF}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Экспорт в PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
