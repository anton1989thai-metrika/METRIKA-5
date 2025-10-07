"use client"

import { useState } from "react"

interface AdditionalFiltersModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdditionalFiltersModal({ isOpen, onClose }: AdditionalFiltersModalProps) {
  const [filters, setFilters] = useState({
    // Вид использования земельного участка
    landUse: [] as string[],
    
    // Тип дома
    houseType: [] as string[],
    
    // Год постройки
    buildYearFrom: '',
    buildYearTo: '',
    
    // Количество спален
    bedroomsFrom: '',
    bedroomsTo: '',
    isStudio: false,
    
    // Вид
    view: [] as string[],
    
    // Этаж
    floorFrom: '',
    floorTo: '',
    
    // Этажность дома
    floorsFrom: '',
    floorsTo: '',
    
    // Инфраструктура дома
    houseInfrastructure: [] as string[],
    
    // Парковка
    parking: [] as string[],
    
    // Инфраструктура с расстоянием
    infrastructure: [] as string[],
    infrastructureDistance: 0.5,
    
    // Жилая площадь
    livingAreaFrom: '',
    livingAreaTo: '',
    
    // Готовность объекта
    readiness: [] as string[],
    
    // Аренда с питомцами
    petsAllowed: [] as string[],
    
    // Срок аренды
    rentPeriod: [] as string[],
    
    // Аренда доступна с
    availableFrom: '',
    
    // Размер депозита
    deposit: [] as string[],
    
    // Комиссия Метрики
    commission: [] as string[],
    
    // Тип ремонта
    renovationType: [] as string[],
    
    // Дата завершения ремонта
    renovationDate: '',
    
    // Торг
    bargaining: [] as string[],
    
    // Количество санузлов
    bathrooms: [] as string[],
    
    // Тип отопления
    heating: [] as string[],
    
    // Тип водоснабжения
    waterSupply: [] as string[],
    
    // Тип канализации
    sewage: [] as string[],
    
    // Наличие интернета
    internet: [] as string[],
    
    // Подъездные пути
    accessRoads: [] as string[],
    
    // Балкон
    balcony: [] as string[],
    balconyArea: '',
    
    // Количество комнат
    rooms: [] as string[],
    
    // Вид квартиры
    apartmentType: [] as string[],
    
    // Тип права
    ownershipType: [] as string[]
  })

  const handleArrayFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key as keyof typeof prev] as string[]).includes(value)
        ? (prev[key as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[key as keyof typeof prev] as string[]), value]
    }))
  }

  const handleInputChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      landUse: [],
      houseType: [],
      buildYearFrom: '',
      buildYearTo: '',
      bedroomsFrom: '',
      bedroomsTo: '',
      isStudio: false,
      view: [],
      floorFrom: '',
      floorTo: '',
      floorsFrom: '',
      floorsTo: '',
      houseInfrastructure: [],
      parking: [],
      infrastructure: [],
      infrastructureDistance: 0.5,
      livingAreaFrom: '',
      livingAreaTo: '',
      readiness: [],
      petsAllowed: [],
      rentPeriod: [],
      availableFrom: '',
      deposit: [],
      commission: [],
      renovationType: [],
      renovationDate: '',
      bargaining: [],
      bathrooms: [],
      heating: [],
      waterSupply: [],
      sewage: [],
      internet: [],
      accessRoads: [],
      balcony: [],
      balconyArea: '',
      rooms: [],
      apartmentType: [],
      ownershipType: []
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-black p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Дополнительные фильтры</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Вид использования земельного участка */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Вид использования земельного участка</h3>
            <div className="space-y-2">
              {['ИЖС', 'Магазин', 'Под склад', 'Под производство', 'Под сельскохозяйственную деятельность', 'Под открытое хранение', 'Под гараж', 'Под организацию отдыха'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.landUse.includes(option)}
                    onChange={() => handleArrayFilterChange('landUse', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Тип дома */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Тип дома</h3>
            <div className="space-y-2">
              {['Панельный', 'Кирпичный', 'Монолитный', 'Деревянный', 'Блочный'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.houseType.includes(option)}
                    onChange={() => handleArrayFilterChange('houseType', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Год постройки */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Год постройки дома</h3>
            <div className="space-y-2">
              <input 
                type="number" 
                placeholder="От" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.buildYearFrom}
                onChange={(e) => handleInputChange('buildYearFrom', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="До" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.buildYearTo}
                onChange={(e) => handleInputChange('buildYearTo', e.target.value)}
              />
            </div>
          </div>

          {/* Количество спален */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Количество спален</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={filters.isStudio}
                  onChange={(e) => handleInputChange('isStudio', e.target.checked.toString())}
                />
                <span className="text-gray-700">Студия</span>
              </label>
              <input 
                type="number" 
                placeholder="От" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.bedroomsFrom}
                onChange={(e) => handleInputChange('bedroomsFrom', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="До" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.bedroomsTo}
                onChange={(e) => handleInputChange('bedroomsTo', e.target.value)}
              />
            </div>
          </div>

          {/* Вид */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Вид</h3>
            <div className="space-y-2">
              {['На море', 'На горы', 'На город', 'На озеро или реку', 'Во двор'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.view.includes(option)}
                    onChange={() => handleArrayFilterChange('view', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Этаж */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Этаж</h3>
            <div className="space-y-2">
              <input 
                type="number" 
                placeholder="От" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.floorFrom}
                onChange={(e) => handleInputChange('floorFrom', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="До" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.floorTo}
                onChange={(e) => handleInputChange('floorTo', e.target.value)}
              />
            </div>
          </div>

          {/* Этажность дома */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Этажность дома</h3>
            <div className="space-y-2">
              <input 
                type="number" 
                placeholder="От" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.floorsFrom}
                onChange={(e) => handleInputChange('floorsFrom', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="До" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.floorsTo}
                onChange={(e) => handleInputChange('floorsTo', e.target.value)}
              />
            </div>
          </div>

          {/* Инфраструктура дома */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Инфраструктура дома</h3>
            <div className="space-y-2">
              {['Бассейн', 'Тренажерный зал', 'Теннисный корт', 'Круглосуточная охрана'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.houseInfrastructure.includes(option)}
                    onChange={() => handleArrayFilterChange('houseInfrastructure', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Парковка */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Парковка</h3>
            <div className="space-y-2">
              {['Наземная', 'Подземная', 'Отдельное здание'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.parking.includes(option)}
                    onChange={() => handleArrayFilterChange('parking', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Инфраструктура с расстоянием */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Инфраструктура</h3>
            <div className="space-y-2">
              {['Школа', 'Детский сад', 'Больница', 'Стадион', 'Супермаркет', 'Метро', 'Автобусная остановка'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.infrastructure.includes(option)}
                    onChange={() => handleArrayFilterChange('infrastructure', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
              <div className="mt-2">
                <label className="text-sm text-gray-600">Расстояние (км):</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10" 
                  step="0.5" 
                  className="w-full mt-1"
                  value={filters.infrastructureDistance}
                  onChange={(e) => handleInputChange('infrastructureDistance', e.target.value)}
                />
                <span className="text-sm text-gray-600">{filters.infrastructureDistance} км</span>
              </div>
            </div>
          </div>

          {/* Жилая площадь */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Жилая площадь</h3>
            <div className="space-y-2">
              <input 
                type="number" 
                placeholder="От" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.livingAreaFrom}
                onChange={(e) => handleInputChange('livingAreaFrom', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="До" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.livingAreaTo}
                onChange={(e) => handleInputChange('livingAreaTo', e.target.value)}
              />
            </div>
          </div>

          {/* Готовность объекта */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Готовность объекта</h3>
            <div className="space-y-2">
              {['Строящийся', 'Построен'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.readiness.includes(option)}
                    onChange={() => handleArrayFilterChange('readiness', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Аренда с питомцами */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Аренда с питомцами</h3>
            <div className="space-y-2">
              {['Собаки', 'Кошки', 'Другие крупные животные', 'Другие мелкие животные'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.petsAllowed.includes(option)}
                    onChange={() => handleArrayFilterChange('petsAllowed', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Срок аренды */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Срок аренды</h3>
            <div className="space-y-2">
              {['До 1 месяца', '1-3 месяца', '3-6 месяцев', '6-12 месяцев', 'Более года'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.rentPeriod.includes(option)}
                    onChange={() => handleArrayFilterChange('rentPeriod', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Аренда доступна с */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Аренда доступна с</h3>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={filters.availableFrom}
              onChange={(e) => handleInputChange('availableFrom', e.target.value)}
            />
          </div>

          {/* Размер депозита */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Размер депозита</h3>
            <div className="space-y-2">
              {['В размере 1 месяца', '2 месяцев', '3 месяцев', 'Конкретная сумма', 'Без депозита'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.deposit.includes(option)}
                    onChange={() => handleArrayFilterChange('deposit', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Комиссия Метрики */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Комиссия Метрики</h3>
            <div className="space-y-2">
              {['Без комиссии', 'Конкретная сумма'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.commission.includes(option)}
                    onChange={() => handleArrayFilterChange('commission', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Тип ремонта */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Тип ремонта</h3>
            <div className="space-y-2">
              {['Без отделки', 'В состоянии ремонта', 'Бюджетный ремонт', 'Базовая отделка', 'Устаревшая отделка', 'Современный евроремонт', 'Дизайнерский'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.renovationType.includes(option)}
                    onChange={() => handleArrayFilterChange('renovationType', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Дата завершения ремонта */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Дата завершения ремонта</h3>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={filters.renovationDate}
              onChange={(e) => handleInputChange('renovationDate', e.target.value)}
            />
          </div>

          {/* Торг */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Торг</h3>
            <div className="space-y-2">
              {['Без торга', 'Минимальный', 'Существенный'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.bargaining.includes(option)}
                    onChange={() => handleArrayFilterChange('bargaining', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Количество санузлов */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Количество санузлов</h3>
            <div className="space-y-2">
              {['Без', '1', '2', '3', 'Более 3'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.bathrooms.includes(option)}
                    onChange={() => handleArrayFilterChange('bathrooms', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Тип отопления */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Тип отопления</h3>
            <div className="space-y-2">
              {['Без отопления', 'Центральное', 'Электрическое', 'Газовое', 'Твердотопливное', 'Другое'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.heating.includes(option)}
                    onChange={() => handleArrayFilterChange('heating', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Тип водоснабжения */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Тип водоснабжения</h3>
            <div className="space-y-2">
              {['Без водоснабжения', 'Центральное', 'Скважина', 'Централизованная подача горячей воды'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.waterSupply.includes(option)}
                    onChange={() => handleArrayFilterChange('waterSupply', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Тип канализации */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Тип канализации</h3>
            <div className="space-y-2">
              {['Без канализации', 'Централизованная канализация', 'Септик', 'Выгребная яма'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.sewage.includes(option)}
                    onChange={() => handleArrayFilterChange('sewage', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Наличие интернета */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Наличие интернета</h3>
            <div className="space-y-2">
              {['Есть', 'Нет'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.internet.includes(option)}
                    onChange={() => handleArrayFilterChange('internet', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Подъездные пути */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Подъездные пути</h3>
            <div className="space-y-2">
              {['Без подъездных путей', 'Грунтовая дорога', 'Асфальтированная дорога', 'Комбинированная дорога'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.accessRoads.includes(option)}
                    onChange={() => handleArrayFilterChange('accessRoads', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Балкон */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Балкон</h3>
            <div className="space-y-2">
              {['Нет', 'Есть'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.balcony.includes(option)}
                    onChange={() => handleArrayFilterChange('balcony', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
              <input 
                type="number" 
                placeholder="Площадь балкона" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.balconyArea}
                onChange={(e) => handleInputChange('balconyArea', e.target.value)}
              />
            </div>
          </div>

          {/* Количество комнат */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Количество комнат</h3>
            <div className="space-y-2">
              {['1', '2', '3', '4', '5 и более'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.rooms.includes(option)}
                    onChange={() => handleArrayFilterChange('rooms', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Вид квартиры */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Вид квартиры</h3>
            <div className="space-y-2">
              {['Вторичное жильё', 'Новостройка'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.apartmentType.includes(option)}
                    onChange={() => handleArrayFilterChange('apartmentType', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Тип права */}
          <div className="mb-4">
            <h3 className="font-semibold text-black mb-3">Тип права</h3>
            <div className="space-y-2">
              {['Собственность', 'Аренда', 'Собственность+аренда', 'Доля'].map(option => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={filters.ownershipType.includes(option)}
                    onChange={() => handleArrayFilterChange('ownershipType', option)}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Сбросить
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  )
}
