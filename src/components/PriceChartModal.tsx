"use client"

import { useState } from "react"
import { X, TrendingUp, Bell, Download, Share2 } from "lucide-react"

interface PriceChartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PriceChartModal({ isOpen, onClose }: PriceChartModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const priceData = [
    { date: "2023-07", price: 8500000, change: 0 },
    { date: "2023-08", price: 8600000, change: 1.2 },
    { date: "2023-09", price: 8700000, change: 1.2 },
    { date: "2023-10", price: 8800000, change: 1.1 },
    { date: "2023-11", price: 8750000, change: -0.6 },
    { date: "2023-12", price: 8700000, change: -0.6 },
    { date: "2024-01", price: 8650000, change: -0.6 },
    { date: "2024-02", price: 8600000, change: -0.6 },
    { date: "2024-03", price: 8550000, change: -0.6 },
    { date: "2024-04", price: 8500000, change: -0.6 },
    { date: "2024-05", price: 8450000, change: -0.6 },
    { date: "2024-06", price: 8400000, change: -0.6 }
  ]

  const currentPrice = priceData[priceData.length - 1].price
  const initialPrice = priceData[0].price
  const totalChange = ((currentPrice - initialPrice) / initialPrice) * 100
  const maxPrice = Math.max(...priceData.map(d => d.price))
  const minPrice = Math.min(...priceData.map(d => d.price))

  const periods = [
    { id: "3months", name: "3 месяца" },
    { id: "6months", name: "6 месяцев" },
    { id: "1year", name: "1 год" },
    { id: "all", name: "Все время" }
  ]

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
    if (!isSubscribed) {
      alert('Вы подписались на уведомления об изменении цены!')
    }
  }

  const handleDownloadChart = () => {
    alert('Функция скачивания графика будет доступна в ближайшее время')
  }

  const handleShareChart = () => {
    if (navigator.share) {
      navigator.share({
        title: 'График изменения цены объекта',
        text: `Цена объекта изменилась на ${totalChange.toFixed(1)}%`,
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
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-black">График изменения цены</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {currentPrice.toLocaleString()} ₽
              </div>
              <div className="text-sm text-gray-800">Текущая цена</div>
            </div>
            
            <div className={`rounded-lg p-4 text-center ${
              totalChange >= 0 ? 'bg-gray-50' : 'bg-gray-50'
            }`}>
              <div className={`text-2xl font-bold ${
                totalChange >= 0 ? 'text-gray-600' : 'text-gray-600'
              }`}>
                {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}%
              </div>
              <div className={`text-sm ${
                totalChange >= 0 ? 'text-gray-800' : 'text-gray-800'
              }`}>
                Изменение за период
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {maxPrice.toLocaleString()} ₽
              </div>
              <div className="text-sm text-gray-800">Максимальная цена</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {minPrice.toLocaleString()} ₽
              </div>
              <div className="text-sm text-gray-800">Минимальная цена</div>
            </div>
          </div>

          {/* Фильтры периода */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {periods.map(period => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.name}
                </button>
              ))}
            </div>
          </div>

          {/* График */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="h-64 flex items-end justify-between space-x-1">
              {priceData.map((point, index) => {
                const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100
                const isCurrent = index === priceData.length - 1
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-gray-500' 
                          : point.change >= 0
                            ? 'bg-gray-400' 
                            : 'bg-gray-400'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                      {point.date.split('-')[1]}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Подписи осей */}
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>{minPrice.toLocaleString()} ₽</span>
              <span>Цена</span>
              <span>{maxPrice.toLocaleString()} ₽</span>
            </div>
          </div>

          {/* История изменений */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">История изменений</h3>
            <div className="space-y-3">
              {priceData.slice(-6).reverse().map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">
                      {new Date(point.date + '-01').toLocaleDateString('ru', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-gray-600 ml-2">{point.price.toLocaleString()} ₽</span>
                  </div>
                  <div className={`flex items-center ${
                    point.change >= 0 ? 'text-gray-600' : 'text-gray-600'
                  }`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      point.change < 0 ? 'rotate-180' : ''
                    }`} />
                    <span className="font-medium">
                      {point.change >= 0 ? '+' : ''}{point.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Анализ рынка */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Анализ рынка</h4>
            <div className="text-sm text-gray-800 space-y-1">
              <p>• Средняя цена в районе: 8,200,000 ₽</p>
              <p>• Цена объекта выше среднего на 2.4%</p>
              <p>• Тренд: снижение цены на 1.2% за последние 3 месяца</p>
              <p>• Рекомендуемая цена: 8,300,000 - 8,500,000 ₽</p>
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSubscribe}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isSubscribed
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              {isSubscribed ? 'Отписаться от уведомлений' : 'Подписаться на уведомления'}
            </button>
            
            <button
              onClick={handleDownloadChart}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать график
            </button>
            
            <button
              onClick={handleShareChart}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </button>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Дополнительная информация</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Данные обновляются ежедневно</p>
              <p>• Уведомления приходят на email и в приложение</p>
              <p>• График учитывает только изменения цены, без учета инфляции</p>
              <p>• Для получения более детального анализа обратитесь к агенту</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
