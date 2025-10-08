"use client"

import { useState } from "react"
import { X, QrCode, Download, Share2, Copy, Smartphone } from "lucide-react"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  objectUrl: string
}

export default function QRCodeModal({ isOpen, onClose, objectUrl }: QRCodeModalProps) {
  const [qrSize, setQrSize] = useState("medium")
  const [qrFormat, setQrFormat] = useState("png")

  const sizes = [
    { id: "small", name: "Маленький", size: "128x128" },
    { id: "medium", name: "Средний", size: "256x256" },
    { id: "large", name: "Большой", size: "512x512" }
  ]

  const formats = [
    { id: "png", name: "PNG", description: "Для веб и печати" },
    { id: "svg", name: "SVG", description: "Векторный формат" },
    { id: "pdf", name: "PDF", description: "Для документов" }
  ]

  const handleDownload = () => {
    // Имитация скачивания QR-кода
    alert(`Скачивание QR-кода в формате ${qrFormat.toUpperCase()}, размер ${sizes.find(s => s.id === qrSize)?.size}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QR-код объекта недвижимости',
        text: 'Отсканируйте QR-код для быстрого доступа к объекту',
        url: objectUrl
      })
    } else {
      navigator.clipboard.writeText(objectUrl)
      alert('Ссылка скопирована в буфер обмена')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(objectUrl)
    alert('Ссылка скопирована в буфер обмена')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <QrCode className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">QR-код для быстрого доступа</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR-код */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                {/* Имитация QR-кода */}
                <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Отсканируйте QR-код камерой телефона для быстрого доступа к объекту
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Работает на всех устройствах</span>
              </div>
            </div>

            {/* Настройки и действия */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки QR-кода</h3>
              
              {/* Размер */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Размер QR-кода
                </label>
                <div className="space-y-2">
                  {sizes.map(size => (
                    <label key={size.id} className="flex items-center">
                      <input
                        type="radio"
                        name="qrSize"
                        value={size.id}
                        checked={qrSize === size.id}
                        onChange={(e) => setQrSize(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {size.name} ({size.size})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Формат */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Формат файла
                </label>
                <div className="space-y-2">
                  {formats.map(format => (
                    <label key={format.id} className="flex items-center">
                      <input
                        type="radio"
                        name="qrFormat"
                        value={format.id}
                        checked={qrFormat === format.id}
                        onChange={(e) => setQrFormat(e.target.value)}
                        className="mr-2"
                      />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">{format.name}</span>
                        <p className="text-xs text-gray-500">{format.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ссылка */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ссылка на объект
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={objectUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-gray-600 text-white rounded-r-lg hover:bg-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Действия */}
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Скачать QR-код
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Поделиться QR-кодом
                </button>
              </div>

              {/* Информация */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Как использовать</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>1. Скачайте QR-код на устройство</p>
                  <p>2. Распечатайте или покажите на экране</p>
                  <p>3. Отсканируйте камерой телефона</p>
                  <p>4. Перейдите по ссылке к объекту</p>
                </div>
              </div>

              {/* Статистика */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Статистика использования</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Скачано: 23 раза</p>
                  <p>• Отсканировано: 156 раз</p>
                  <p>• Последнее сканирование: сегодня</p>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительные возможности */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительные возможности</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                <QrCode className="w-5 h-5 mr-2" />
                Создать QR-код для визитки
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                <QrCode className="w-5 h-5 mr-2" />
                QR-код для брошюры
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
