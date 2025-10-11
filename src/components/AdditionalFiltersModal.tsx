"use client"

import { useState } from "react"

interface AdditionalFiltersModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdditionalFiltersModal({ isOpen, onClose }: AdditionalFiltersModalProps) {
  const [filters, setFilters] = useState({
    // Основные характеристики
    rooms: [] as string[],
    bedroomsFrom: '',
    bedroomsTo: '',
    isStudio: false,
    livingAreaFrom: '',
    livingAreaTo: '',
    bathrooms: [] as string[],
    
    // Расположение и вид
    view: [] as string[],
    floorFrom: '',
    floorTo: '',
    floorsFrom: '',
    floorsTo: '',
    
    // Тип и состояние
    apartmentType: [] as string[],
    houseType: [] as string[],
    renovationType: [] as string[],
    readiness: [] as string[],
    renovationDate: '',
    
    // Коммуникации
    heating: [] as string[],
    waterSupply: [] as string[],
    sewage: [] as string[],
    internet: [] as string[],
    
    // Инфраструктура
    houseInfrastructure: [] as string[],
    parking: [] as string[],
    infrastructure: [] as string[],
    infrastructureDistance: 0.5,
    
    // Дополнительные удобства
    balcony: [] as string[],
    balconyArea: '',
    accessRoads: [] as string[],
    
    // Земельный участок
    landUse: [] as string[],
    
    // Строительство
    buildYearFrom: '',
    buildYearTo: '',
    
    // Права и условия
    ownershipType: [] as string[],
    bargaining: [] as string[],
    
    // Аренда
    rentPeriod: [] as string[],
    petsAllowed: [] as string[],
    availableFrom: '',
    deposit: [] as string[],
    commission: [] as string[]
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
      rooms: [],
      bedroomsFrom: '',
      bedroomsTo: '',
      isStudio: false,
      livingAreaFrom: '',
      livingAreaTo: '',
      bathrooms: [],
      view: [],
      floorFrom: '',
      floorTo: '',
      floorsFrom: '',
      floorsTo: '',
      apartmentType: [],
      houseType: [],
      renovationType: [],
      readiness: [],
      renovationDate: '',
      heating: [],
      waterSupply: [],
      sewage: [],
      internet: [],
      houseInfrastructure: [],
      parking: [],
      infrastructure: [],
      infrastructureDistance: 0.5,
      balcony: [],
      balconyArea: '',
      accessRoads: [],
      landUse: [],
      buildYearFrom: '',
      buildYearTo: '',
      ownershipType: [],
      bargaining: [],
      rentPeriod: [],
      petsAllowed: [],
      availableFrom: '',
      deposit: [],
      commission: []
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-5xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Дополнительные фильтры</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Основные характеристики */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Основные характеристики</h3>
              
              {/* Количество комнат */}
              <div>
                <h4 className="font-medium text-black mb-2">Количество комнат</h4>
                <div className="space-y-1">
                  {['1', '2', '3', '4', '5 и более'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.rooms.includes(option)}
                        onChange={() => handleArrayFilterChange('rooms', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Количество спален */}
              <div>
                <h4 className="font-medium text-black mb-2">Количество спален</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                      checked={filters.isStudio}
                      onChange={(e) => handleInputChange('isStudio', e.target.checked.toString())}
                    />
                    <span className="text-gray-700 text-sm">Студия</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="От" 
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                      value={filters.bedroomsFrom}
                      onChange={(e) => handleInputChange('bedroomsFrom', e.target.value)}
                    />
                    <input 
                      type="number" 
                      placeholder="До" 
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                      value={filters.bedroomsTo}
                      onChange={(e) => handleInputChange('bedroomsTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Жилая площадь */}
              <div>
                <h4 className="font-medium text-black mb-2">Жилая площадь (м²)</h4>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="От" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.livingAreaFrom}
                    onChange={(e) => handleInputChange('livingAreaFrom', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="До" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.livingAreaTo}
                    onChange={(e) => handleInputChange('livingAreaTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Количество санузлов */}
              <div>
                <h4 className="font-medium text-black mb-2">Количество санузлов</h4>
                <div className="space-y-1">
                  {['Без', '1', '2', '3', 'Более 3'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.bathrooms.includes(option)}
                        onChange={() => handleArrayFilterChange('bathrooms', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Расположение и вид */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Расположение и вид</h3>
              
              {/* Вид */}
              <div>
                <h4 className="font-medium text-black mb-2">Вид</h4>
                <div className="space-y-1">
                  {['На море', 'На горы', 'На город', 'На озеро или реку', 'Во двор'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.view.includes(option)}
                        onChange={() => handleArrayFilterChange('view', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Этаж */}
              <div>
                <h4 className="font-medium text-black mb-2">Этаж</h4>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="От" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.floorFrom}
                    onChange={(e) => handleInputChange('floorFrom', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="До" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.floorTo}
                    onChange={(e) => handleInputChange('floorTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Этажность дома */}
              <div>
                <h4 className="font-medium text-black mb-2">Этажность дома</h4>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="От" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.floorsFrom}
                    onChange={(e) => handleInputChange('floorsFrom', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="До" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.floorsTo}
                    onChange={(e) => handleInputChange('floorsTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Тип и состояние */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Тип и состояние</h3>
              
              {/* Вид квартиры */}
              <div>
                <h4 className="font-medium text-black mb-2">Вид квартиры</h4>
                <div className="space-y-1">
                  {['Вторичное жильё', 'Новостройка'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.apartmentType.includes(option)}
                        onChange={() => handleArrayFilterChange('apartmentType', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Тип дома */}
              <div>
                <h4 className="font-medium text-black mb-2">Тип дома</h4>
                <div className="space-y-1">
                  {['Панельный', 'Кирпичный', 'Монолитный', 'Деревянный', 'Блочный'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.houseType.includes(option)}
                        onChange={() => handleArrayFilterChange('houseType', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Тип ремонта */}
              <div>
                <h4 className="font-medium text-black mb-2">Тип ремонта</h4>
                <div className="space-y-1">
                  {['Без отделки', 'В состоянии ремонта', 'Бюджетный ремонт', 'Базовая отделка', 'Устаревшая отделка', 'Современный евроремонт', 'Дизайнерский'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.renovationType.includes(option)}
                        onChange={() => handleArrayFilterChange('renovationType', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Готовность объекта */}
              <div>
                <h4 className="font-medium text-black mb-2">Готовность объекта</h4>
                <div className="space-y-1">
                  {['Строящийся', 'Построен'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.readiness.includes(option)}
                        onChange={() => handleArrayFilterChange('readiness', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Дата завершения ремонта */}
              <div>
                <h4 className="font-medium text-black mb-2">Дата завершения ремонта</h4>
                <input 
                  type="date" 
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.renovationDate}
                  onChange={(e) => handleInputChange('renovationDate', e.target.value)}
                />
              </div>
            </div>

            {/* Коммуникации */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Коммуникации</h3>
              
              {/* Тип отопления */}
              <div>
                <h4 className="font-medium text-black mb-2">Тип отопления</h4>
                <div className="space-y-1">
                  {['Без отопления', 'Центральное', 'Электрическое', 'Газовое', 'Твердотопливное', 'Другое'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.heating.includes(option)}
                        onChange={() => handleArrayFilterChange('heating', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Тип водоснабжения */}
              <div>
                <h4 className="font-medium text-black mb-2">Тип водоснабжения</h4>
                <div className="space-y-1">
                  {['Без водоснабжения', 'Центральное', 'Скважина', 'Централизованная подача горячей воды'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.waterSupply.includes(option)}
                        onChange={() => handleArrayFilterChange('waterSupply', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Тип канализации */}
              <div>
                <h4 className="font-medium text-black mb-2">Тип канализации</h4>
                <div className="space-y-1">
                  {['Без канализации', 'Централизованная канализация', 'Септик', 'Выгребная яма'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.sewage.includes(option)}
                        onChange={() => handleArrayFilterChange('sewage', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Наличие интернета */}
              <div>
                <h4 className="font-medium text-black mb-2">Наличие интернета</h4>
                <div className="space-y-1">
                  {['Есть', 'Нет'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.internet.includes(option)}
                        onChange={() => handleArrayFilterChange('internet', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Инфраструктура */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Инфраструктура</h3>
              
              {/* Инфраструктура дома */}
              <div>
                <h4 className="font-medium text-black mb-2">Инфраструктура дома</h4>
                <div className="space-y-1">
                  {['Бассейн', 'Тренажерный зал', 'Теннисный корт', 'Круглосуточная охрана'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.houseInfrastructure.includes(option)}
                        onChange={() => handleArrayFilterChange('houseInfrastructure', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Парковка */}
              <div>
                <h4 className="font-medium text-black mb-2">Парковка</h4>
                <div className="space-y-1">
                  {['Наземная', 'Подземная', 'Отдельное здание'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.parking.includes(option)}
                        onChange={() => handleArrayFilterChange('parking', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Инфраструктура с расстоянием */}
              <div>
                <h4 className="font-medium text-black mb-2">Инфраструктура</h4>
                <div className="space-y-1">
                  {['Школа', 'Детский сад', 'Больница', 'Стадион', 'Супермаркет', 'Метро', 'Автобусная остановка'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.infrastructure.includes(option)}
                        onChange={() => handleArrayFilterChange('infrastructure', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
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

            {/* Дополнительные удобства */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Дополнительные удобства</h3>
              
              {/* Балкон */}
              <div>
                <h4 className="font-medium text-black mb-2">Балкон</h4>
                <div className="space-y-1">
                  {['Нет', 'Есть'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.balcony.includes(option)}
                        onChange={() => handleArrayFilterChange('balcony', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                <input 
                  type="number" 
                  placeholder="Площадь балкона (м²)" 
                  className="w-full mt-2 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.balconyArea}
                  onChange={(e) => handleInputChange('balconyArea', e.target.value)}
                />
              </div>

              {/* Подъездные пути */}
              <div>
                <h4 className="font-medium text-black mb-2">Подъездные пути</h4>
                <div className="space-y-1">
                  {['Без подъездных путей', 'Грунтовая дорога', 'Асфальтированная дорога', 'Комбинированная дорога'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.accessRoads.includes(option)}
                        onChange={() => handleArrayFilterChange('accessRoads', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Земельный участок */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Земельный участок</h3>
              
              {/* Вид использования земельного участка */}
              <div>
                <h4 className="font-medium text-black mb-2">Вид использования</h4>
                <div className="space-y-1">
                  {['ИЖС', 'Магазин', 'Под склад', 'Под производство', 'Под сельскохозяйственную деятельность', 'Под открытое хранение', 'Под гараж', 'Под организацию отдыха'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.landUse.includes(option)}
                        onChange={() => handleArrayFilterChange('landUse', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Строительство */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Строительство</h3>
              
              {/* Год постройки */}
              <div>
                <h4 className="font-medium text-black mb-2">Год постройки дома</h4>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="От" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.buildYearFrom}
                    onChange={(e) => handleInputChange('buildYearFrom', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="До" 
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                    value={filters.buildYearTo}
                    onChange={(e) => handleInputChange('buildYearTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Права и условия */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Права и условия</h3>
              
              {/* Тип права */}
              <div>
                <h4 className="font-medium text-black mb-2">Тип права</h4>
                <div className="space-y-1">
                  {['Собственность', 'Аренда', 'Собственность+аренда', 'Доля'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.ownershipType.includes(option)}
                        onChange={() => handleArrayFilterChange('ownershipType', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Торг */}
              <div>
                <h4 className="font-medium text-black mb-2">Торг</h4>
                <div className="space-y-1">
                  {['Без торга', 'Минимальный', 'Существенный'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.bargaining.includes(option)}
                        onChange={() => handleArrayFilterChange('bargaining', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Аренда */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Аренда</h3>
              
              {/* Срок аренды */}
              <div>
                <h4 className="font-medium text-black mb-2">Срок аренды</h4>
                <div className="space-y-1">
                  {['До 1 месяца', '1-3 месяца', '3-6 месяцев', '6-12 месяцев', 'Более года'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.rentPeriod.includes(option)}
                        onChange={() => handleArrayFilterChange('rentPeriod', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Аренда с питомцами */}
              <div>
                <h4 className="font-medium text-black mb-2">Аренда с питомцами</h4>
                <div className="space-y-1">
                  {['Собаки', 'Кошки', 'Другие крупные животные', 'Другие мелкие животные'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.petsAllowed.includes(option)}
                        onChange={() => handleArrayFilterChange('petsAllowed', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Аренда доступна с */}
              <div>
                <h4 className="font-medium text-black mb-2">Аренда доступна с</h4>
                <input 
                  type="date" 
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                />
              </div>

              {/* Размер депозита */}
              <div>
                <h4 className="font-medium text-black mb-2">Размер депозита</h4>
                <div className="space-y-1">
                  {['В размере 1 месяца', '2 месяцев', '3 месяцев', 'Конкретная сумма', 'Без депозита'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.deposit.includes(option)}
                        onChange={() => handleArrayFilterChange('deposit', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Комиссия Метрики */}
              <div>
                <h4 className="font-medium text-black mb-2">Комиссия Метрики</h4>
                <div className="space-y-1">
                  {['Без комиссии', 'Конкретная сумма'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 w-4 h-4 border border-gray-300 rounded shadow-sm" 
                        checked={filters.commission.includes(option)}
                        onChange={() => handleArrayFilterChange('commission', option)}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t border-gray-200">
          <button 
            onClick={resetFilters}
            className="px-6 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Сбросить
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  )
}