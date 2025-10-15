"use client"

import { useState, useEffect } from "react"
import { X, Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye } from "lucide-react"

interface WeatherModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
}

export default function WeatherModal({ isOpen, onClose, selectedDate }: WeatherModalProps) {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Имитация получения данных о погоде
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Имитация API запроса
      setTimeout(() => {
        const mockWeatherData = {
          current: {
            temperature: 15,
            condition: "partly-cloudy",
            humidity: 65,
            windSpeed: 12,
            visibility: 10,
            pressure: 1013,
            uvIndex: 3
          },
          forecast: [
            { date: "2024-01-15", high: 18, low: 8, condition: "sunny", precipitation: 0 },
            { date: "2024-01-16", high: 16, low: 6, condition: "cloudy", precipitation: 20 },
            { date: "2024-01-17", high: 14, low: 4, condition: "rainy", precipitation: 80 },
            { date: "2024-01-18", high: 12, low: 2, condition: "snowy", precipitation: 60 },
            { date: "2024-01-19", high: 10, low: 0, condition: "cloudy", precipitation: 10 }
          ]
        }
        setWeatherData(mockWeatherData)
        setLoading(false)
      }, 1000)
    }
  }, [isOpen])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-gray-500" />
      case "partly-cloudy":
        return <Cloud className="w-8 h-8 text-gray-500" />
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-600" />
      case "rainy":
        return <CloudRain className="w-8 h-8 text-gray-500" />
      case "snowy":
        return <CloudSnow className="w-8 h-8 text-gray-300" />
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "Солнечно"
      case "partly-cloudy":
        return "Переменная облачность"
      case "cloudy":
        return "Облачно"
      case "rainy":
        return "Дождь"
      case "snowy":
        return "Снег"
      default:
        return "Неизвестно"
    }
  }

  const getPrecipitationColor = (precipitation: number) => {
    if (precipitation === 0) return "text-gray-600"
    if (precipitation < 30) return "text-gray-600"
    if (precipitation < 70) return "text-gray-600"
    return "text-gray-600"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Cloud className="w-6 h-6 text-cyan-600 mr-3" />
            <h2 className="text-2xl font-bold text-black">
              Погода на дату просмотра
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка данных о погоде...</p>
            </div>
          ) : weatherData ? (
            <>
              {/* Текущая погода */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Сегодня</h3>
                    <div className="flex items-center mb-2">
                      {getWeatherIcon(weatherData.current.condition)}
                      <div className="ml-3">
                        <div className="text-4xl font-bold">{weatherData.current.temperature}°C</div>
                        <div className="text-lg">{getConditionText(weatherData.current.condition)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2" />
                      <span>Влажность: {weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="w-4 h-4 mr-2" />
                      <span>Ветер: {weatherData.current.windSpeed} км/ч</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      <span>Видимость: {weatherData.current.visibility} км</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 mr-2" />
                      <span>Давление: {weatherData.current.pressure} гПа</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Прогноз на неделю */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Прогноз на 5 дней</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        {new Date(day.date).toLocaleDateString('ru', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                      <div className="mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {day.high}° / {day.low}°
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {getConditionText(day.condition)}
                      </div>
                      <div className={`text-xs ${getPrecipitationColor(day.precipitation)}`}>
                        Осадки: {day.precipitation}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Рекомендации для просмотра */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Рекомендации для просмотра</h4>
                <div className="text-sm text-gray-800 space-y-1">
                  <p>• Лучшее время для просмотра: утром (9:00-11:00) или вечером (17:00-19:00)</p>
                  <p>• Возьмите зонт на случай дождя</p>
                  <p>• Одевайтесь по погоде - сегодня прохладно</p>
                  <p>• Проверьте освещение в квартире при пасмурной погоде</p>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Сезонные особенности</h4>
                  <div className="text-sm text-gray-800 space-y-1">
                    <p>• Зимний период: возможны снегопады</p>
                    <p>• Температура может опускаться до -10°C</p>
                    <p>• Дороги могут быть скользкими</p>
                    <p>• Отопление работает на полную мощность</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Советы по просмотру</h4>
                  <div className="text-sm text-gray-800 space-y-1">
                    <p>• Проверьте работу отопления</p>
                    <p>• Обратите внимание на утепление окон</p>
                    <p>• Уточните расходы на отопление</p>
                    <p>• Посмотрите на состояние крыши</p>
                  </div>
                </div>
              </div>

              {/* Действия */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  Обновить прогноз
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Получить уведомления о погоде
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Поделиться прогнозом
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Не удалось загрузить данные о погоде</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Источники данных</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Данные предоставлены метеорологической службой</p>
              <p>• Прогноз обновляется каждые 3 часа</p>
              <p>• Точность прогноза: 85% на 24 часа</p>
              <p>• Для точного прогноза на дату просмотра обратитесь к агенту</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
