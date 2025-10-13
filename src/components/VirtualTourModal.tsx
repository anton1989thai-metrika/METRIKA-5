"use client"

import { useState } from "react"
import { X, Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, ArrowLeft, ArrowRight, Home, MapPin } from "lucide-react"

interface VirtualTourModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VirtualTourModal({ isOpen, onClose }: VirtualTourModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(0)
  const [currentView, setCurrentView] = useState(0)

  const rooms = [
    {
      id: 0,
      name: "Гостиная",
      description: "Просторная гостиная с большими окнами",
      views: ["Вид на окна", "Вид на кухню", "Вид на вход"]
    },
    {
      id: 1,
      name: "Кухня",
      description: "Современная кухня с островом",
      views: ["Общий вид", "Вид на технику", "Вид на обеденную зону"]
    },
    {
      id: 2,
      name: "Спальня",
      description: "Уютная спальня с гардеробной",
      views: ["Вид на кровать", "Вид на окно", "Вид на гардеробную"]
    },
    {
      id: 3,
      name: "Ванная",
      description: "Современная ванная комната",
      views: ["Общий вид", "Вид на ванну", "Вид на душ"]
    },
    {
      id: 4,
      name: "Балкон",
      description: "Просторный балкон с видом на парк",
      views: ["Вид на парк", "Вид на город", "Вид на соседние дома"]
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

  const handleRoomChange = (roomId: number) => {
    setCurrentRoom(roomId)
    setCurrentView(0)
  }

  const handleViewChange = (viewId: number) => {
    setCurrentView(viewId)
  }

  const nextRoom = () => {
    setCurrentRoom((prev) => (prev + 1) % rooms.length)
    setCurrentView(0)
  }

  const prevRoom = () => {
    setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length)
    setCurrentView(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`relative bg-white rounded-lg shadow-xl w-full mx-4 overflow-hidden border-2 border-black ${
        isFullscreen ? 'max-w-none max-h-none h-screen' : 'max-w-6xl max-h-[90vh]'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Play className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Виртуальный тур</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Основной тур */}
          <div className="flex-1 relative bg-gray-900">
            {/* 360° вид */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-medium">{rooms[currentRoom].name}</p>
                <p className="text-sm text-gray-300">{rooms[currentRoom].description}</p>
              </div>
            </div>

            {/* Элементы управления туром */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all">
                  <Home className="w-5 h-5" />
                </button>
                <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Навигация по комнатам */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevRoom}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex space-x-1">
                  {rooms.map((room, index) => (
                    <button
                      key={room.id}
                      onClick={() => handleRoomChange(room.id)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        currentRoom === room.id
                          ? 'bg-white text-black'
                          : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                      }`}
                    >
                      {room.name}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={nextRoom}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Элементы управления видео */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              <button
                onClick={handleMute}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handlePlayPause}
                className="p-3 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Панель управления */}
          {!isFullscreen && (
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Информация о текущей комнате */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {rooms[currentRoom].name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {rooms[currentRoom].description}
                  </p>
                  
                  {/* Виды в комнате */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Доступные виды:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rooms[currentRoom].views.map((view, index) => (
                        <button
                          key={index}
                          onClick={() => handleViewChange(index)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            currentView === index
                              ? 'bg-gray-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {view}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Мини-карта */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">План квартиры</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-3 gap-2 h-32">
                      {rooms.map((room, index) => (
                        <button
                          key={room.id}
                          onClick={() => handleRoomChange(room.id)}
                          className={`rounded-lg text-xs font-medium transition-colors ${
                            currentRoom === room.id
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {room.name}
                        </button>
                      ))}
                      <div className="col-span-3 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        Общий план
                      </div>
                    </div>
                  </div>
                  
                  {/* Дополнительная информация */}
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>• Используйте мышь для поворота камеры</p>
                    <p>• Кликните на стрелки для перехода между комнатами</p>
                    <p>• Нажмите F для полноэкранного режима</p>
                  </div>
                </div>
              </div>

              {/* Дополнительные функции */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Сохранить тур
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Поделиться туром
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Записать видео
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Сделать скриншот
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
