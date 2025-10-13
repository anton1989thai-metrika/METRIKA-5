"use client"

import { useState } from "react"
import { X, Play, Pause, Volume2, VolumeX, Maximize, Download, Share2 } from "lucide-react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videos = [
    {
      id: 1,
      title: "Обзор квартиры",
      duration: "3:45",
      thumbnail: "/images/video-thumb-1.jpg",
      url: "/videos/apartment-tour.mp4"
    },
    {
      id: 2,
      title: "Виртуальный тур",
      duration: "5:20",
      thumbnail: "/images/video-thumb-2.jpg",
      url: "/videos/virtual-tour.mp4"
    },
    {
      id: 3,
      title: "Окрестности",
      duration: "2:15",
      thumbnail: "/images/video-thumb-3.jpg",
      url: "/videos/surroundings.mp4"
    }
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    alert('Функция скачивания видео будет доступна в ближайшее время')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Видео объекта недвижимости',
        text: 'Посмотрите видео этого объекта недвижимости',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Ссылка скопирована в буфер обмена')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Play className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Видео объекта</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основное видео */}
            <div className="lg:col-span-2">
              <div className="relative bg-black rounded-lg overflow-hidden">
                {/* Видео плеер */}
                <div className="relative w-full h-64 lg:h-96">
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                      <p className="text-lg font-medium">Обзор квартиры</p>
                      <p className="text-sm text-gray-300">3:45</p>
                    </div>
                  </div>
                  
                  {/* Элементы управления */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex-1 bg-gray-600 rounded-full h-1">
                        <div className="bg-gray-600 h-1 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      
                      <span className="text-white text-sm">1:15 / 3:45</span>
                      
                      <button
                        onClick={handleMute}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Информация о видео */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Обзор квартиры</h3>
                <p className="text-gray-600 mb-4">
                  Полный обзор трехкомнатной квартиры площадью 85 м². Видео включает все комнаты, 
                  кухню, санузел, балкон и общие зоны. Показаны особенности планировки и состояние ремонта.
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Просмотров: 1,247</span>
                  <span>Дата: 15 января 2024</span>
                  <span>Качество: HD</span>
                </div>
              </div>
            </div>

            {/* Список видео */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Другие видео</h3>
              <div className="space-y-3">
                {videos.map(video => (
                  <div
                    key={video.id}
                    className="flex bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-20 h-16 bg-gray-200 rounded-lg mr-3 flex-shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{video.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Дополнительные функции */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Скачать видео
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Поделиться
                </button>
              </div>

              {/* Информация о качестве */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Качество видео</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>HD (720p)</span>
                    <span className="text-gray-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Full HD (1080p)</span>
                    <span className="text-gray-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>4K (2160p)</span>
                    <span className="text-gray-400">—</span>
                  </div>
                </div>
              </div>

              {/* Техническая информация */}
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Техническая информация</h4>
                <div className="text-sm text-gray-800 space-y-1">
                  <p>• Формат: MP4</p>
                  <p>• Разрешение: 1920x1080</p>
                  <p>• Битрейт: 5 Mbps</p>
                  <p>• Аудио: AAC, 128 kbps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительные действия */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Запросить дополнительное видео
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Записаться на видео-консультацию
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Добавить в избранное
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
