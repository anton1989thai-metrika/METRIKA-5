"use client"

import { useState } from "react"
import { X, Calculator } from "lucide-react"

interface MortgageCalculatorProps {
  isOpen: boolean
  onClose: () => void
  propertyPrice: string
}

export default function MortgageCalculator({ isOpen, onClose, propertyPrice }: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState("")
  const [downPayment, setDownPayment] = useState("")
  const [loanTerm, setLoanTerm] = useState("20")
  const [interestRate, setInterestRate] = useState("12")
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount) || 0
    const rate = parseFloat(interestRate) / 100 / 12
    const payments = parseFloat(loanTerm) * 12

    if (principal > 0 && rate > 0 && payments > 0) {
      const monthly = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1)
      const total = monthly * payments
      const interest = total - principal

      setMonthlyPayment(Math.round(monthly))
      setTotalInterest(Math.round(interest))
      setTotalAmount(Math.round(total))
    }
  }

  const handlePropertyPriceChange = (value: string) => {
    const price = parseFloat(value.replace(/[^\d]/g, ''))
    if (!isNaN(price)) {
      setLoanAmount(price.toString())
      setDownPayment(Math.round(price * 0.2).toString())
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calculator className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Калькулятор ипотеки</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Цена объекта */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цена объекта
            </label>
            <input
              type="text"
              value={propertyPrice}
              onChange={(e) => handlePropertyPriceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите цену объекта"
            />
          </div>

          {/* Первоначальный взнос */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Первоначальный взнос
            </label>
            <input
              type="text"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите сумму первоначального взноса"
            />
            <p className="text-sm text-gray-500 mt-1">
              Рекомендуется: 20% от стоимости объекта
            </p>
          </div>

          {/* Сумма кредита */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сумма кредита
            </label>
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите сумму кредита"
            />
          </div>

          {/* Срок кредита */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Срок кредита (лет)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 лет</option>
              <option value="10">10 лет</option>
              <option value="15">15 лет</option>
              <option value="20">20 лет</option>
              <option value="25">25 лет</option>
              <option value="30">30 лет</option>
            </select>
          </div>

          {/* Процентная ставка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Процентная ставка (% годовых)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите процентную ставку"
              step="0.1"
              min="1"
              max="30"
            />
            <p className="text-sm text-gray-500 mt-1">
              Средняя ставка по ипотеке: 12-15% годовых
            </p>
          </div>

          {/* Кнопка расчета */}
          <button
            onClick={calculateMortgage}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Рассчитать платеж
          </button>

          {/* Результаты расчета */}
          {(monthlyPayment > 0) && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Результаты расчета</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {monthlyPayment.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-800">Ежемесячный платеж</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {totalInterest.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-800">Общая сумма процентов</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {totalAmount.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-800">Общая сумма выплат</div>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Дополнительная информация</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Страхование недвижимости: ~{Math.round(monthlyPayment * 0.1).toLocaleString()} ₽/месяц</p>
                  <p>• Страхование жизни: ~{Math.round(monthlyPayment * 0.05).toLocaleString()} ₽/месяц</p>
                  <p>• Комиссия банка: уточняйте в банке</p>
                  <p>• Нотариальные услуги: ~50,000 ₽</p>
                </div>
              </div>
            </div>
          )}

          {/* Информация о программах */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Государственные программы</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Семейная ипотека:</span>
                <span className="font-medium">6% годовых</span>
              </div>
              <div className="flex justify-between">
                <span>Молодая семья:</span>
                <span className="font-medium">6% годовых</span>
              </div>
              <div className="flex justify-between">
                <span>IT-ипотека:</span>
                <span className="font-medium">5% годовых</span>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Подать заявку в банк
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Консультация с банком
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
