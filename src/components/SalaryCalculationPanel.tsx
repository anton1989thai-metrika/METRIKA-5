"use client"

import { useState, useEffect } from "react"
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Edit, 
  Percent,
  Award,
  AlertTriangle,
  Wallet
} from "lucide-react"

interface Employee {
  id: string
  name: string
  position: string
  baseSalary: number
  hoursWorked: number
  standardHours: number
  hourlyRate: number
  overtimeHours: number
  overtimeRate: number
  bonuses: number
  penalties: number
  taxRate: number
  deductions: number
  netSalary: number
  grossSalary: number
  status: 'active' | 'vacation' | 'sick' | 'inactive'
}

interface SalaryCalculation {
  id: string
  employeeId: string
  employeeName: string
  period: string
  baseSalary: number
  overtimePay: number
  bonuses: number
  penalties: number
  grossSalary: number
  taxAmount: number
  deductions: number
  netSalary: number
  status: 'calculated' | 'approved' | 'paid'
  calculatedAt: string
  approvedAt?: string
  paidAt?: string
}

export default function SalaryCalculationPanel() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Иван Сидоров',
      position: 'Менеджер по недвижимости',
      baseSalary: 80000,
      hoursWorked: 168,
      standardHours: 160,
      hourlyRate: 500,
      overtimeHours: 8,
      overtimeRate: 750,
      bonuses: 25000,
      penalties: 2000,
      taxRate: 0.13,
      deductions: 0,
      netSalary: 0,
      grossSalary: 0,
      status: 'active'
    },
    {
      id: '2',
      name: 'Анна Петрова',
      position: 'Юрист',
      baseSalary: 120000,
      hoursWorked: 160,
      standardHours: 160,
      hourlyRate: 750,
      overtimeHours: 0,
      overtimeRate: 1125,
      bonuses: 15000,
      penalties: 0,
      taxRate: 0.13,
      deductions: 0,
      netSalary: 0,
      grossSalary: 0,
      status: 'active'
    },
    {
      id: '3',
      name: 'Мария Козлова',
      position: 'Бухгалтер',
      baseSalary: 90000,
      hoursWorked: 168,
      standardHours: 160,
      hourlyRate: 562.5,
      overtimeHours: 8,
      overtimeRate: 843.75,
      bonuses: 10000,
      penalties: 0,
      taxRate: 0.13,
      deductions: 0,
      netSalary: 0,
      grossSalary: 0,
      status: 'active'
    },
    {
      id: '4',
      name: 'Алексей Иванов',
      position: 'Агент',
      baseSalary: 60000,
      hoursWorked: 172,
      standardHours: 160,
      hourlyRate: 375,
      overtimeHours: 12,
      overtimeRate: 562.5,
      bonuses: 20000,
      penalties: 1000,
      taxRate: 0.13,
      deductions: 0,
      netSalary: 0,
      grossSalary: 0,
      status: 'active'
    }
  ])

  const [calculations, setCalculations] = useState<SalaryCalculation[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')
  const [isCalculating, setIsCalculating] = useState(false)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Автоматический расчёт зарплаты
  const calculateSalary = (employee: Employee): Employee => {
    const overtimePay = employee.overtimeHours * employee.overtimeRate
    const grossSalary = employee.baseSalary + overtimePay + employee.bonuses - employee.penalties
    const taxAmount = grossSalary * employee.taxRate
    const netSalary = grossSalary - taxAmount - employee.deductions

    return {
      ...employee,
      grossSalary: Math.round(grossSalary),
      netSalary: Math.round(netSalary)
    }
  }

  // Расчёт зарплат для всех сотрудников
  const calculateAllSalaries = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const updatedEmployees = employees.map(employee => calculateSalary(employee))
      setEmployees(updatedEmployees)

      // Создаём записи расчётов
      const newCalculations: SalaryCalculation[] = updatedEmployees.map(employee => ({
        id: `${employee.id}-${selectedPeriod}`,
        employeeId: employee.id,
        employeeName: employee.name,
        period: selectedPeriod,
        baseSalary: employee.baseSalary,
        overtimePay: employee.overtimeHours * employee.overtimeRate,
        bonuses: employee.bonuses,
        penalties: employee.penalties,
        grossSalary: employee.grossSalary,
        taxAmount: employee.grossSalary * employee.taxRate,
        deductions: employee.deductions,
        netSalary: employee.netSalary,
        status: 'calculated',
        calculatedAt: new Date().toISOString()
      }))

      setCalculations(prev => [
        ...prev.filter(calc => calc.period !== selectedPeriod),
        ...newCalculations
      ])

      setIsCalculating(false)
    }, 1500)
  }

  // Обновление данных сотрудника
  const updateEmployee = (employeeId: string, field: keyof Employee, value: any) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, [field]: value } : emp
    ))
  }

  // Одобрение расчёта
  const approveCalculation = (calculationId: string) => {
    setCalculations(prev => prev.map(calc => 
      calc.id === calculationId 
        ? { ...calc, status: 'approved' as const, approvedAt: new Date().toISOString() }
        : calc
    ))
  }

  // Отметка о выплате
  const markAsPaid = (calculationId: string) => {
    setCalculations(prev => prev.map(calc => 
      calc.id === calculationId 
        ? { ...calc, status: 'paid' as const, paidAt: new Date().toISOString() }
        : calc
    ))
  }

  // Экспорт в Excel
  const exportToExcel = () => {
    const currentCalculations = calculations.filter(calc => calc.period === selectedPeriod)
    const csvContent = [
      ['Сотрудник', 'Должность', 'Оклад', 'Переработка', 'Премии', 'Штрафы', 'Налог', 'К выплате'],
      ...currentCalculations.map(calc => [
        calc.employeeName,
        employees.find(emp => emp.id === calc.employeeId)?.position || '',
        calc.baseSalary.toString(),
        calc.overtimePay.toString(),
        calc.bonuses.toString(),
        calc.penalties.toString(),
        calc.taxAmount.toString(),
        calc.netSalary.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `salary_${selectedPeriod}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Статистика
  const totalGrossSalary = employees.reduce((sum, emp) => sum + emp.grossSalary, 0)
  const totalNetSalary = employees.reduce((sum, emp) => sum + emp.netSalary, 0)
  const totalTaxes = employees.reduce((sum, emp) => sum + (emp.grossSalary * emp.taxRate), 0)
  const totalBonuses = employees.reduce((sum, emp) => sum + emp.bonuses, 0)
  const totalPenalties = employees.reduce((sum, emp) => sum + emp.penalties, 0)

  return (
    <div className="space-y-6">
      {/* Заголовок и управление */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Расчёт зарплаты</h2>
        <div className="flex space-x-2">
          <button
            onClick={calculateAllSalaries}
            disabled={isCalculating}
            className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium disabled:opacity-50"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => !isCalculating ? (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a' : null}
            onMouseLeave={(e) => !isCalculating ? (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b' : null}
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Расчёт...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 inline mr-2" />
                Рассчитать зарплату
              </>
            )}
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Период расчёта */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Период расчёта:</label>
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">
            {new Date(selectedPeriod + '-01').toLocaleDateString('ru-RU', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </span>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalGrossSalary.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Общий фонд</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalNetSalary.toLocaleString()}</div>
              <div className="text-sm text-gray-600">К выплате</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Percent className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{Math.round(totalTaxes).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Налоги</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalBonuses.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Премии</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-black">₽{totalPenalties.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Штрафы</div>
            </div>
          </div>
        </div>
      </div>

      {/* Список сотрудников */}
      <div className="space-y-4">
        {employees.map(employee => (
          <div key={employee.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">{employee.name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {employee.position}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      employee.status === 'active' ? 'bg-gray-100 text-gray-800' :
                      employee.status === 'vacation' ? 'bg-gray-100 text-gray-800' :
                      employee.status === 'sick' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.status === 'active' ? 'Активен' :
                       employee.status === 'vacation' ? 'В отпуске' :
                       employee.status === 'sick' ? 'На больничном' : 'Неактивен'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Оклад:</span>
                      <div className="font-semibold text-black">₽{employee.baseSalary.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Часов:</span>
                      <div className="font-semibold text-black">{employee.hoursWorked} / {employee.standardHours}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Переработка:</span>
                      <div className="font-semibold text-black">{employee.overtimeHours}ч</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Премии/Штрафы:</span>
                      <div className="font-semibold text-black">
                        <span className="text-black">+₽{employee.bonuses.toLocaleString()}</span>
                        {employee.penalties > 0 && (
                          <span className="text-black"> / -₽{employee.penalties.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-black">₽{employee.netSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">К выплате</div>
                <div className="text-xs text-gray-500 mt-1">
                  Брутто: ₽{employee.grossSalary.toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Детали расчёта */}
            {showDetails === employee.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">Начисления</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Оклад:</span>
                      <span className="font-medium">₽{employee.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Переработка:</span>
                      <span className="font-medium">₽{(employee.overtimeHours * employee.overtimeRate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Премии:</span>
                      <span className="font-medium text-black">₽{employee.bonuses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Итого начислено:</span>
                      <span className="font-semibold">₽{employee.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">Удержания</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Налог (13%):</span>
                      <span className="font-medium text-black">₽{Math.round(employee.grossSalary * employee.taxRate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Штрафы:</span>
                      <span className="font-medium text-black">₽{employee.penalties.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Прочие удержания:</span>
                      <span className="font-medium">₽{employee.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Итого удержано:</span>
                      <span className="font-semibold text-black">₽{(Math.round(employee.grossSalary * employee.taxRate) + employee.penalties + employee.deductions).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">Итоги</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Брутто:</span>
                      <span className="font-medium">₽{employee.grossSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Нетто:</span>
                      <span className="font-semibold text-black">₽{employee.netSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ставка в час:</span>
                      <span className="font-medium">₽{employee.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Переработка:</span>
                      <span className="font-medium">₽{employee.overtimeRate}/ч</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowDetails(showDetails === employee.id ? null : employee.id)}
                className="px-3 py-1 text-gray-600 hover:text-black transition-colors text-sm"
              >
                {showDetails === employee.id ? 'Скрыть детали' : 'Показать детали'}
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
                <Edit className="w-3 h-3 inline mr-1" />
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* История расчётов */}
      {calculations.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-4">История расчётов</h3>
          <div className="space-y-3">
            {calculations
              .filter(calc => calc.period === selectedPeriod)
              .map(calculation => (
                <div key={calculation.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div>
                      <span className="font-medium text-black">{calculation.employeeName}</span>
                      <div className="text-sm text-gray-600">
                        {new Date(calculation.calculatedAt).toLocaleDateString('ru-RU')} в {new Date(calculation.calculatedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      calculation.status === 'calculated' ? 'bg-gray-100 text-gray-800' :
                      calculation.status === 'approved' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {calculation.status === 'calculated' ? 'Рассчитано' :
                       calculation.status === 'approved' ? 'Одобрено' : 'Выплачено'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-semibold text-black">₽{calculation.netSalary.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">К выплате</div>
                    </div>
                    
                    {calculation.status === 'calculated' && (
                      <button
                        onClick={() => approveCalculation(calculation.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Одобрить
                      </button>
                    )}
                    
                    {calculation.status === 'approved' && (
                      <button
                        onClick={() => markAsPaid(calculation.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        Выплачено
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
