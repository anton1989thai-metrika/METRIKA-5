"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-white">
      <CardContent className="p-0">
        {/* Основное изображение */}
        <div className="relative aspect-[4/3] bg-gray-100 rounded-t-2xl overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={`${title} - фото ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Навигационные кнопки */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
            onClick={prevImage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
            onClick={nextImage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          {/* Счетчик изображений */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/40 text-white border-0"
          >
            {currentImageIndex + 1}/{images.length}
          </Badge>
        </div>

        {/* Миниатюры */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                  index === currentImageIndex 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'hover:opacity-80'
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} - миниатюра ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
