"use client"

import { useState } from "react"
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Save, 
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  Timer
} from "lucide-react"

interface TimeRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  arrival: string
  departure: string
  hours: number
  status: 'present' | 'late' | 'absent' | 'vacation'
}

interface Employee {
  id: string
  name: string
  position: string
  defaultArrival: string
  defaultDeparture: string
}

export default function TimeTrackingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TimeRecord | null>(null)

  // Mock данные
  const employees: Employee[] = [
    { id: '1', name: 'Иван Сидоров', position: 'Менеджер', defaultArrival: '09:00', defaultDeparture: '18:00' },
    { id: '2', name: 'Анна Петрова', position: 'Юрист', defaultArrival: '09:00', defaultDeparture: '18:00' },
    { id: '3', name: 'Мария Козлова', position: 'Бухгалтер', defaultArrival: '09:00', defaultDeparture: '18:00' },
    { id: '4', name: 'Алексей Иванов', position: 'Агент', defaultArrival: '09:00', defaultDeparture: '18:00' }
  ]

  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Иван Сидоров',
      date: '2024-01-15',
      arrival: '09:15',
      departure: '18:30',
      hours: 8.5,
      status: 'late'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Анна Петрова',
      date: '2024-01-15',
      arrival: '09:00',
      departure: '18:00',
      hours: 8,
      status: 'present'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Мария Козлова',
      date: '2024-01-15',
      arrival: '09:00',
      departure: '18:00',
      hours: 8,
      status: 'present'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Алексей Иванов',
      date: '2024-01-15',
      arrival: '08:45',
      departure: '17:45',
      hours: 8,
      status: 'present'
    }
  ])

  const [newRecord, setNewRecord] = useState({
    employeeId: '',
    arrival: '09:00',
    departure: '18:00'
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Добавляем пустые ячейки для начала месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getRecordsForDate = (date: string) => {
    return timeRecords.filter(record => record.date === date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'vacation':
        return <Timer className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const calculateHours = (arrival: string, departure: string) => {
    const [arrHour, arrMin] = arrival.split(':').map(Number)
    const [depHour, depMin] = departure.split(':').map(Number)
    
    const arrivalMinutes = arrHour * 60 + arrMin
    const departureMinutes = depHour * 60 + depMin
    
    return Math.max(0, (departureMinutes - arrivalMinutes) / 60)
  }

  const handleAddRecord = () => {
    if (!selectedDate || !newRecord.employeeId) return

    const employee = employees.find(emp => emp.id === newRecord.employeeId)
    if (!employee) return

    const hours = calculateHours(newRecord.arrival, newRecord.departure)
    const status = newRecord.arrival > employee.defaultArrival ? 'late' : 'present'

    const record: TimeRecord = {
      id: Date.now().toString(),
      employeeId: newRecord.employeeId,
      employeeName: employee.name,
      date: selectedDate,
      arrival: newRecord.arrival,
      departure: newRecord.departure,
      hours,
      status
    }

    setTimeRecords(prev => [...prev, record])
    setShowAddRecord(false)
    setNewRecord({ employeeId: '', arrival: '09:00', departure: '18:00' })
  }

  const handleEditRecord = (record: TimeRecord) => {
    setEditingRecord(record)
  }

  const handleSaveEdit = () => {
    if (!editingRecord) return

    const employee = employees.find(emp => emp.id === editingRecord.employeeId)
    if (!employee) return

    const hours = calculateHours(editingRecord.arrival, editingRecord.departure)
    const status = editingRecord.arrival > employee.defaultArrival ? 'late' : 'present'

    setTimeRecords(prev => prev.map(record => 
      record.id === editingRecord.id 
        ? { ...editingRecord, hours, status }
        : record
    ))

    setEditingRecord(null)
  }

  const handleDeleteRecord = (recordId: string) => {
    setTimeRecords(prev => prev.filter(record => record.id !== recordId))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = formatDate(currentMonth)

  return (
    <div className="space-y-6">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Календарь рабочего времени</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold text-black min-w-[200px] text-center">
              {monthName}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowAddRecord(true)}
            className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Добавить запись
          </button>
        </div>
      </div>

      {/* Календарь */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        {/* Заголовки дней недели */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-300">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 border-r border-gray-300 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Дни месяца */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-24 border-r border-b border-gray-200 last:border-r-0"></div>
            }

            const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const records = getRecordsForDate(dateKey)
            const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()
            const isSelected = selectedDate === dateKey

            return (
              <div
                key={day}
                className={`h-24 border-r border-b border-gray-200 last:border-r-0 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-yellow-50' : ''
                } ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedDate(dateKey)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday ? 'text-yellow-600' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {records.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      {records.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {records.slice(0, 2).map(record => (
                    <div key={record.id} className="flex items-center text-xs">
                      {getStatusIcon(record.status)}
                      <span className="ml-1 truncate">{record.employeeName}</span>
                    </div>
                  ))}
                  {records.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{records.length - 2} ещё
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Детали выбранного дня */}
      {selectedDate && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">
              {new Date(selectedDate).toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {getRecordsForDate(selectedDate).map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <div className="font-medium text-black">{record.employeeName}</div>
                    <div className="text-sm text-gray-600">
                      {record.arrival} - {record.departure} ({record.hours.toFixed(1)}ч)
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditRecord(record)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {getRecordsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Нет записей для этого дня</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно добавления записи */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Добавить запись</h3>
              <button
                onClick={() => setShowAddRecord(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сотрудник
                </label>
                <select
                  value={newRecord.employeeId}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Приход
                  </label>
                  <input
                    type="time"
                    value={newRecord.arrival}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, arrival: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Уход
                  </label>
                  <input
                    type="time"
                    value={newRecord.departure}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, departure: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddRecord(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddRecord}
                disabled={!newRecord.employeeId}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования записи */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Редактировать запись</h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сотрудник
                </label>
                <div className="p-2 bg-gray-50 rounded-lg text-gray-700">
                  {editingRecord.employeeName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Приход
                  </label>
                  <input
                    type="time"
                    value={editingRecord.arrival}
                    onChange={(e) => setEditingRecord(prev => prev ? { ...prev, arrival: e.target.value } : null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Уход
                  </label>
                  <input
                    type="time"
                    value={editingRecord.departure}
                    onChange={(e) => setEditingRecord(prev => prev ? { ...prev, departure: e.target.value } : null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
