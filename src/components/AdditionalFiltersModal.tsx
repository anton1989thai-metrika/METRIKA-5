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
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Дополнительные фильтры</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Основные характеристики */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Основные характеристики</h3>
            
            {/* Количество комнат */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Количество комнат</h4>
              <div className="flex flex-wrap gap-2">
                {['1', '2', '3', '4', '5 и более'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('rooms', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.rooms.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.rooms.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.rooms.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.rooms.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Количество спален */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Количество спален</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => handleInputChange('isStudio', (!filters.isStudio).toString())}
                  className={`px-3 py-1 text-sm rounded-full border transition-all ${
                    filters.isStudio
                      ? 'text-black border border-gray-300 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  style={filters.isStudio ? {backgroundColor: '#fff60b'} : {}}
                  onMouseEnter={(e) => {
                    if (filters.isStudio) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.isStudio) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                    }
                  }}
                  >
                    Студия
                  </button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.bedroomsFrom}
                  onChange={(e) => handleInputChange('bedroomsFrom', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.bedroomsTo}
                  onChange={(e) => handleInputChange('bedroomsTo', e.target.value)}
                />
              </div>
            </div>

            {/* Жилая площадь */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Жилая площадь (м²)</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.livingAreaFrom}
                  onChange={(e) => handleInputChange('livingAreaFrom', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.livingAreaTo}
                  onChange={(e) => handleInputChange('livingAreaTo', e.target.value)}
                />
              </div>
            </div>

            {/* Количество санузлов */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Количество санузлов</h4>
              <div className="flex flex-wrap gap-2">
                {['Без', '1', '2', '3', 'Более 3'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('bathrooms', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.bathrooms.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.bathrooms.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.bathrooms.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bathrooms.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Расположение и вид */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Расположение и вид</h3>
            
            {/* Вид */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Вид</h4>
              <div className="flex flex-wrap gap-2">
                {['На море', 'На горы', 'На город', 'На озеро или реку', 'Во двор'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('view', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.view.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.view.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.view.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.view.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.view.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.view.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.view.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Этаж */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Этаж</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.floorFrom}
                  onChange={(e) => handleInputChange('floorFrom', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.floorTo}
                  onChange={(e) => handleInputChange('floorTo', e.target.value)}
                />
              </div>
            </div>

            {/* Этажность дома */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Этажность дома</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.floorsFrom}
                  onChange={(e) => handleInputChange('floorsFrom', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.floorsTo}
                  onChange={(e) => handleInputChange('floorsTo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Тип и состояние */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Тип и состояние</h3>
            
            {/* Вид квартиры */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Вид квартиры</h4>
              <div className="flex flex-wrap gap-2">
                {['Вторичное жильё', 'Новостройка'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('apartmentType', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.apartmentType.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.apartmentType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.apartmentType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.apartmentType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.apartmentType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.apartmentType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.apartmentType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Тип дома */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Тип дома</h4>
              <div className="flex flex-wrap gap-2">
                {['Панельный', 'Кирпичный', 'Монолитный', 'Деревянный', 'Блочный'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('houseType', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.houseType.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.houseType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.houseType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.houseType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.houseType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.houseType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.houseType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Тип ремонта */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Тип ремонта</h4>
              <div className="flex flex-wrap gap-2">
                {['Без отделки', 'В состоянии ремонта', 'Бюджетный ремонт', 'Базовая отделка', 'Устаревшая отделка', 'Современный евроремонт', 'Дизайнерский'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('renovationType', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.renovationType.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.renovationType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.renovationType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.renovationType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.renovationType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.renovationType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.renovationType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Готовность объекта */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Готовность объекта</h4>
              <div className="flex flex-wrap gap-2">
                {['Строящийся', 'Построен'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('readiness', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.readiness.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.readiness.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.readiness.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.readiness.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.readiness.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.readiness.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.readiness.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Дата завершения ремонта */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Дата завершения ремонта</h4>
              <input 
                type="date" 
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                value={filters.renovationDate}
                onChange={(e) => handleInputChange('renovationDate', e.target.value)}
              />
            </div>
          </div>

          {/* Коммуникации */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Коммуникации</h3>
            
            {/* Тип отопления */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Тип отопления</h4>
              <div className="flex flex-wrap gap-2">
                {['Без отопления', 'Центральное', 'Электрическое', 'Газовое', 'Твердотопливное', 'Другое'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('heating', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.heating.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.heating.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.heating.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.heating.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.heating.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.heating.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.heating.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Тип водоснабжения */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Тип водоснабжения</h4>
              <div className="flex flex-wrap gap-2">
                {['Без водоснабжения', 'Центральное', 'Скважина', 'Централизованная подача горячей воды'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('waterSupply', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.waterSupply.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.waterSupply.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.waterSupply.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.waterSupply.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.waterSupply.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.waterSupply.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.waterSupply.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Тип канализации */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Тип канализации</h4>
              <div className="flex flex-wrap gap-2">
                {['Без канализации', 'Централизованная канализация', 'Септик', 'Выгребная яма'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('sewage', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.sewage.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.sewage.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.sewage.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.sewage.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.sewage.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.sewage.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.sewage.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Наличие интернета */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Наличие интернета</h4>
              <div className="flex flex-wrap gap-2">
                {['Есть', 'Нет'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('internet', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.internet.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.internet.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.internet.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.internet.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.internet.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.internet.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.internet.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Инфраструктура */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Инфраструктура</h3>
            
            {/* Инфраструктура дома */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Инфраструктура дома</h4>
              <div className="flex flex-wrap gap-2">
                {['Бассейн', 'Тренажерный зал', 'Теннисный корт', 'Круглосуточная охрана'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('houseInfrastructure', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.houseInfrastructure.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.houseInfrastructure.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.houseInfrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.houseInfrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.houseInfrastructure.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.houseInfrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.houseInfrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Парковка */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Парковка</h4>
              <div className="flex flex-wrap gap-2">
                {['Наземная', 'Подземная', 'Отдельное здание'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('parking', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.parking.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.parking.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.parking.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.parking.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.parking.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.parking.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.parking.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Инфраструктура с расстоянием */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Инфраструктура</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Школа', 'Детский сад', 'Больница', 'Стадион', 'Супермаркет', 'Метро', 'Автобусная остановка'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('infrastructure', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.infrastructure.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.infrastructure.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.infrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.infrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.infrastructure.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.infrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.infrastructure.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
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
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Дополнительные удобства</h3>
            
            {/* Балкон */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Балкон</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Нет', 'Есть'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('balcony', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.balcony.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.balcony.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.balcony.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.balcony.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.balcony.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.balcony.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.balcony.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                placeholder="Площадь балкона (м²)" 
                className="w-40 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                value={filters.balconyArea}
                onChange={(e) => handleInputChange('balconyArea', e.target.value)}
              />
            </div>

            {/* Подъездные пути */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Подъездные пути</h4>
              <div className="flex flex-wrap gap-2">
                {['Без подъездных путей', 'Грунтовая дорога', 'Асфальтированная дорога', 'Комбинированная дорога'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('accessRoads', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.accessRoads.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.accessRoads.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.accessRoads.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.accessRoads.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.accessRoads.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.accessRoads.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.accessRoads.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Земельный участок */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Земельный участок</h3>
            
            {/* Вид использования земельного участка */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Вид использования</h4>
              <div className="flex flex-wrap gap-2">
                {['ИЖС', 'Магазин', 'Под склад', 'Под производство', 'Под сельскохозяйственную деятельность', 'Под открытое хранение', 'Под гараж', 'Под организацию отдыха'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('landUse', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.landUse.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.landUse.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.landUse.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.landUse.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.landUse.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.landUse.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.landUse.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Строительство */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Строительство</h3>
            
            {/* Год постройки */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Год постройки дома</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.buildYearFrom}
                  onChange={(e) => handleInputChange('buildYearFrom', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                  value={filters.buildYearTo}
                  onChange={(e) => handleInputChange('buildYearTo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Права и условия */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Права и условия</h3>
            
            {/* Тип права */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Тип права</h4>
              <div className="flex flex-wrap gap-2">
                {['Собственность', 'Аренда', 'Собственность+аренда', 'Доля'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('ownershipType', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.ownershipType.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.ownershipType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.ownershipType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.ownershipType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.ownershipType.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.ownershipType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.ownershipType.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Торг */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Торг</h4>
              <div className="flex flex-wrap gap-2">
                {['Без торга', 'Минимальный', 'Существенный'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('bargaining', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.bargaining.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.bargaining.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.bargaining.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bargaining.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.bargaining.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.bargaining.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bargaining.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Аренда */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Аренда</h3>
            
            {/* Срок аренды */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Срок аренды</h4>
              <div className="flex flex-wrap gap-2">
                {['До 1 месяца', '1-3 месяца', '3-6 месяцев', '6-12 месяцев', 'Более года'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('rentPeriod', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.rentPeriod.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.rentPeriod.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.rentPeriod.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.rentPeriod.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.rentPeriod.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.rentPeriod.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.rentPeriod.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Аренда с питомцами */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Аренда с питомцами</h4>
              <div className="flex flex-wrap gap-2">
                {['Собаки', 'Кошки', 'Другие крупные животные', 'Другие мелкие животные'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('petsAllowed', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.petsAllowed.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.petsAllowed.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.petsAllowed.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.petsAllowed.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.petsAllowed.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.petsAllowed.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.petsAllowed.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Аренда доступна с */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Аренда доступна с</h4>
              <input 
                type="date" 
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white text-black shadow-sm"
                value={filters.availableFrom}
                onChange={(e) => handleInputChange('availableFrom', e.target.value)}
              />
            </div>

            {/* Размер депозита */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Размер депозита</h4>
              <div className="flex flex-wrap gap-2">
                {['В размере 1 месяца', '2 месяцев', '3 месяцев', 'Конкретная сумма', 'Без депозита'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('deposit', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.deposit.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.deposit.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.deposit.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.deposit.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.deposit.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.deposit.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.deposit.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Комиссия Метрики */}
            <div className="mb-4">
              <h4 className="font-medium text-black mb-2">Комиссия Метрики</h4>
              <div className="flex flex-wrap gap-2">
                {['Без комиссии', 'Конкретная сумма'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayFilterChange('commission', option)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      filters.commission.includes(option)
                        ? 'text-black border border-gray-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                    style={filters.commission.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.commission.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.commission.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                    style={filters.commission.includes(option) ? {backgroundColor: '#fff60b'} : {}}
                    onMouseEnter={(e) => {
                      if (filters.commission.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.commission.includes(option)) {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
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