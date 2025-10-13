"use client"

import { useState } from "react"
import { X, Zap } from "lucide-react"

interface UtilitiesCalculatorProps {
  isOpen: boolean
  onClose: () => void
}

export default function UtilitiesCalculator({ isOpen, onClose }: UtilitiesCalculatorProps) {
  const [area, setArea] = useState("")
  const [residents, setResidents] = useState("")
  const [electricity, setElectricity] = useState(0)
  const [water, setWater] = useState(0)
  const [heating, setHeating] = useState(0)
  const [gas, setGas] = useState(0)
  const [total, setTotal] = useState(0)

  const calculateUtilities = () => {
    const areaValue = parseFloat(area) || 0
    const residentsValue = parseFloat(residents) || 1

    // Примерные тарифы (рублей)
    const electricityRate = 4.5 // за кВт⋅ч
    const waterRate = 45 // за м³
    const heatingRate = 25 // за м²
    const gasRate = 6.5 // за м³

    // Примерные нормы потребления
    const electricityNorm = 100 * residentsValue // кВт⋅ч в месяц
    const waterNorm = 6 * residentsValue // м³ в месяц
    const heatingNorm = areaValue * 0.02 // Гкал в месяц
    const gasNorm = 10 * residentsValue // м³ в месяц

    const electricityCost = electricityNorm * electricityRate
    const waterCost = waterNorm * waterRate
    const heatingCost = heatingNorm * heatingRate * 1000 // переводим в рубли
    const gasCost = gasNorm * gasRate

    const totalCost = electricityCost + waterCost + heatingCost + gasCost

    setElectricity(Math.round(electricityCost))
    setWater(Math.round(waterCost))
    setHeating(Math.round(heatingCost))
    setGas(Math.round(gasCost))
    setTotal(Math.round(totalCost))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Калькулятор коммунальных платежей</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Площадь квартиры */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Площадь квартиры (м²)
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Введите площадь квартиры"
            />
          </div>

          {/* Количество проживающих */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество проживающих
            </label>
            <input
              type="number"
              value={residents}
              onChange={(e) => setResidents(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Введите количество проживающих"
              min="1"
            />
          </div>

          {/* Кнопка расчета */}
          <button
            onClick={calculateUtilities}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Рассчитать коммунальные платежи
          </button>

          {/* Результаты расчета */}
          {(total > 0) && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Расчет коммунальных платежей</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">Электричество</span>
                  </div>
                  <span className="font-semibold text-gray-900">{electricity.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-500 rounded mr-2"></div>
                    <span className="text-gray-700">Водоснабжение</span>
                  </div>
                  <span className="font-semibold text-gray-900">{water.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-500 rounded mr-2"></div>
                    <span className="text-gray-700">Отопление</span>
                  </div>
                  <span className="font-semibold text-gray-900">{heating.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-500 rounded mr-2"></div>
                    <span className="text-gray-700">Газ</span>
                  </div>
                  <span className="font-semibold text-gray-900">{gas.toLocaleString()} ₽</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                  <span className="text-lg font-semibold text-gray-900">Итого в месяц:</span>
                  <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()} ₽</span>
                </div>
              </div>

              {/* Дополнительные расходы */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Дополнительные расходы</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Управляющая компания: ~{Math.round(total * 0.1).toLocaleString()} ₽/месяц</p>
                  <p>• Капитальный ремонт: ~{Math.round(total * 0.05).toLocaleString()} ₽/месяц</p>
                  <p>• Интернет: ~1,000 ₽/месяц</p>
                  <p>• Телевидение: ~500 ₽/месяц</p>
                </div>
              </div>
            </div>
          )}

          {/* Информация о тарифах */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Актуальные тарифы</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Электричество:</span>
                <span className="font-medium">4.5 ₽/кВт⋅ч</span>
              </div>
              <div className="flex justify-between">
                <span>Холодная вода:</span>
                <span className="font-medium">45 ₽/м³</span>
              </div>
              <div className="flex justify-between">
                <span>Горячая вода:</span>
                <span className="font-medium">180 ₽/м³</span>
              </div>
              <div className="flex justify-between">
                <span>Отопление:</span>
                <span className="font-medium">25 ₽/м²</span>
              </div>
              <div className="flex justify-between">
                <span>Газ:</span>
                <span className="font-medium">6.5 ₽/м³</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Тарифы могут отличаться в зависимости от региона и поставщика услуг
            </p>
          </div>

          {/* Советы по экономии */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Советы по экономии</h4>
            <div className="text-sm text-gray-800 space-y-1">
              <p>• Установите энергосберегающие лампы</p>
              <p>• Используйте программируемые термостаты</p>
              <p>• Установите счетчики воды и газа</p>
              <p>• Утеплите окна и двери</p>
              <p>• Выбирайте энергоэффективную технику</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
