"use client"

import { useState } from "react"
import { X, Info, MapPin, School, Hospital, ShoppingCart, Car, Trees, Wifi, Shield } from "lucide-react"

interface DistrictInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DistrictInfoModal({ isOpen, onClose }: DistrictInfoModalProps) {
  const [activeTab, setActiveTab] = useState("infrastructure")

  const tabs = [
    { id: "infrastructure", name: "Инфраструктура" },
    { id: "transport", name: "Транспорт" },
    { id: "ecology", name: "Экология" },
    { id: "safety", name: "Безопасность" }
  ]

  const infrastructure = [
    { name: "Школы", count: 3, distance: "500м", icon: School, color: "blue" },
    { name: "Детские сады", count: 2, distance: "300м", icon: School, color: "green" },
    { name: "Больницы", count: 1, distance: "1.2км", icon: Hospital, color: "red" },
    { name: "Поликлиники", count: 2, distance: "800м", icon: Hospital, color: "orange" },
    { name: "Магазины", count: 5, distance: "200м", icon: ShoppingCart, color: "purple" },
    { name: "Торговые центры", count: 2, distance: "1.5км", icon: ShoppingCart, color: "pink" }
  ]

  const transport = [
    { name: "Метро", stations: ["Сокольники", "Красносельская"], distance: "800м", color: "blue" },
    { name: "Автобусы", routes: ["15", "25", "40"], distance: "100м", color: "green" },
    { name: "Троллейбусы", routes: ["14", "41"], distance: "150м", color: "yellow" },
    { name: "Парковка", type: "Подземная", price: "3000₽/мес", color: "gray" }
  ]

  const ecology = [
    { name: "Парки", count: 2, distance: "400м", rating: 8, color: "green" },
    { name: "Скверы", count: 3, distance: "200м", rating: 7, color: "lightgreen" },
    { name: "Воздух", quality: "Хорошее", rating: 7, color: "blue" },
    { name: "Шум", level: "Умеренный", rating: 6, color: "orange" }
  ]

  const safety = [
    { name: "Полиция", distance: "600м", rating: 8, color: "blue" },
    { name: "Освещение", level: "Хорошее", rating: 8, color: "yellow" },
    { name: "Видеонаблюдение", coverage: "80%", rating: 7, color: "purple" },
    { name: "Криминогенность", level: "Низкая", rating: 8, color: "green" }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-gray-100 text-gray-600",
      green: "bg-gray-100 text-gray-600",
      red: "bg-gray-100 text-gray-600",
      orange: "bg-gray-100 text-gray-600",
      purple: "bg-gray-100 text-gray-600",
      pink: "bg-gray-100 text-gray-600",
      yellow: "bg-gray-100 text-gray-600",
      gray: "bg-gray-100 text-gray-600",
      lightgreen: "bg-gray-50 text-gray-700"
    }
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-600"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Info className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-black">Информация о районе</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Вкладки */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Контент вкладок */}
          <div className="min-h-96">
            {/* Инфраструктура */}
            {activeTab === "infrastructure" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Образовательные и медицинские учреждения</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {infrastructure.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg mr-4 ${getColorClasses(item.color)}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="text-sm text-gray-600">
                          <span>{item.count} объектов</span>
                          <span className="mx-2">•</span>
                          <span>{item.distance}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Дополнительная информация */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Дополнительная инфраструктура</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800">
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 mr-2" />
                      <span>Wi-Fi зоны</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span>Супермаркеты</span>
                    </div>
                    <div className="flex items-center">
                      <Trees className="w-4 h-4 mr-2" />
                      <span>Парки</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Безопасность</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Транспорт */}
            {activeTab === "transport" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Транспортная доступность</h3>
                <div className="space-y-4">
                  {transport.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-4 ${getColorClasses(item.color)}`}>
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            {item.stations && (
                              <>
                                <span>Станции: {item.stations.join(', ')}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.routes && (
                              <>
                                <span>Маршруты: {item.routes.join(', ')}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.type && (
                              <>
                                <span>{item.type}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            <span>{item.distance || item.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Карта транспорта */}
                <div className="mt-6 bg-gray-100 rounded-lg p-6 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Интерактивная карта транспорта</p>
                  <p className="text-sm text-gray-500">Показывает все маршруты и остановки</p>
                </div>
              </div>
            )}

            {/* Экология */}
            {activeTab === "ecology" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Экологическая обстановка</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ecology.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-4 ${getColorClasses(item.color)}`}>
                          <Trees className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            {item.count && (
                              <>
                                <span>{item.count} объектов</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.distance && (
                              <>
                                <span>{item.distance}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.quality && (
                              <>
                                <span>{item.quality}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.level && (
                              <>
                                <span>{item.level}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            <span>Оценка: {item.rating}/10</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full mr-1 ${
                              i < Math.floor(item.rating / 2) ? 'bg-gray-500' : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Экологический рейтинг */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Общий экологический рейтинг района</h4>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-600 mr-4">7.2/10</div>
                    <div className="flex">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full mr-1 ${
                            i < 7 ? 'bg-gray-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mt-2">
                    Район имеет хорошую экологическую обстановку с развитой зеленой инфраструктурой
                  </p>
                </div>
              </div>
            )}

            {/* Безопасность */}
            {activeTab === "safety" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Безопасность района</h3>
                <div className="space-y-4">
                  {safety.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-4 ${getColorClasses(item.color)}`}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            {item.distance && (
                              <>
                                <span>{item.distance}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.level && (
                              <>
                                <span>{item.level}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            {item.coverage && (
                              <>
                                <span>{item.coverage}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            <span>Оценка: {item.rating}/10</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full mr-1 ${
                              i < Math.floor(item.rating / 2) ? 'bg-gray-500' : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Общий рейтинг безопасности */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Общий рейтинг безопасности</h4>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-600 mr-4">7.8/10</div>
                    <div className="flex">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full mr-1 ${
                            i < 8 ? 'bg-gray-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mt-2">
                    Район считается безопасным с хорошим освещением и низким уровнем преступности
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Дополнительные действия */}
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Открыть на карте
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Получить подробный отчет
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Сравнить с другими районами
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
