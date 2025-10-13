"use client"

import { useState } from "react"
import { X, Calendar, Clock, User, Phone, Mail } from "lucide-react"

interface BookingCalendarProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingCalendar({ isOpen, onClose }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateAvailable = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Нельзя забронировать прошедшие даты
    if (date < today) return false
    
    // Примерная логика доступности (можно заменить на реальную)
    const dayOfWeek = date.getDay()
    // Выходные дни доступны
    if (dayOfWeek === 0 || dayOfWeek === 6) return true
    // Будние дни доступны через день
    return day % 2 === 0
  }

  const isDateBooked = (day: number, month: number, year: number) => {
    // Примерная логика забронированных дат
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    // Субботы забронированы
    return dayOfWeek === 6
  }

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ]

  const handleBooking = () => {
    if (selectedDate && selectedTime && name && phone) {
      alert(`Бронирование успешно создано!\nДата: ${selectedDate.toLocaleDateString()}\nВремя: ${selectedTime}\nКонтакт: ${phone}`)
      onClose()
    } else {
      alert('Пожалуйста, заполните все обязательные поля')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Забронировать просмотр</h2>
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
            {/* Календарь */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите дату</h3>
              
              {/* Календарь на текущий месяц */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center font-semibold text-gray-900 mb-4">
                  {currentDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}
                </div>
                
                {/* Дни недели */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Дни месяца */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2"></div>
                  ))}
                  
                  {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
                    const day = i + 1
                    const isAvailable = isDateAvailable(day, currentMonth, currentYear)
                    const isBooked = isDateBooked(day, currentMonth, currentYear)
                    const isSelected = selectedDate?.getDate() === day && 
                                     selectedDate?.getMonth() === currentMonth && 
                                     selectedDate?.getFullYear() === currentYear
                    
                    return (
                      <button
                        key={day}
                        onClick={() => isAvailable && !isBooked ? setSelectedDate(new Date(currentYear, currentMonth, day)) : null}
                        disabled={!isAvailable || isBooked}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-gray-600 text-white'
                            : isBooked
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isAvailable
                            ? 'hover:bg-gray-100 text-gray-900'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                
                {/* Легенда */}
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                    <span>Доступно</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                    <span>Занято</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                    <span>Недоступно</span>
                  </div>
                </div>
              </div>

              {/* Выбор времени */}
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите время</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'bg-gray-600 text-white border-gray-600'
                            : 'bg-white text-gray-900 border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Форма бронирования */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дополнительные пожелания
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Особые требования или вопросы..."
                  />
                </div>
              </div>

              {/* Информация о бронировании */}
              {selectedDate && selectedTime && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Детали бронирования</h4>
                  <div className="text-sm text-gray-800 space-y-1">
                    <p><strong>Дата:</strong> {selectedDate.toLocaleDateString('ru')}</p>
                    <p><strong>Время:</strong> {selectedTime}</p>
                    <p><strong>Длительность:</strong> 1 час</p>
                    <p><strong>Агент:</strong> Анна Петрова</p>
                    <p><strong>Контакт агента:</strong> +7 (999) 123-45-67</p>
                  </div>
                </div>
              )}

              {/* Кнопки действий */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Забронировать просмотр
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Позвонить агенту
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Написать агенту
                  </button>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Важная информация</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Бронирование бесплатное</p>
                  <p>• Отмена возможна за 2 часа до просмотра</p>
                  <p>• При опоздании более 15 минут бронирование аннулируется</p>
                  <p>• Агент свяжется с вами для подтверждения</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
