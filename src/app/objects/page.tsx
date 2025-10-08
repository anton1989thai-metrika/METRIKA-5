"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import AdditionalFiltersModal from "@/components/AdditionalFiltersModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { realEstateObjects, RealEstateObject } from "@/data/realEstateObjects";

export default function ObjectsPage() {
  const { t } = useLanguage()
  const { filters, updateFilter } = useFilters()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false)

  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter) {
      setActiveFilter(filter)
    }
  }, [searchParams])

  // Получаем переведенные объекты
  const objects = realEstateObjects.map(obj => ({
    ...obj,
    title: t(`realEstateObjects.${obj.id}.title`),
    address: t(`realEstateObjects.${obj.id}.address`),
    material: t(`realEstateObjects.${obj.id}.material`)
  }))

  // Функция для фильтрации объектов
  const getFilteredObjects = () => {
    return objects.filter(obj => {
      // Фильтр по стране
      if (filters.country && obj.country !== filters.country) {
        return false
      }
      
      // Фильтр по типу недвижимости
      if (filters.propertyType && obj.type !== filters.propertyType) {
        return false
      }
      
      // Здесь можно добавить другие фильтры
      
      return true
    })
  }

  const filteredObjects = getFilteredObjects()

  // Обработчик изменения фильтра по стране
  const handleCountryChange = (country: string) => {
    updateFilter('country', filters.country === country ? '' : country)
  }

  // Обработчик изменения фильтра по типу недвижимости
  const handlePropertyTypeChange = (propertyType: string) => {
    updateFilter('propertyType', filters.propertyType === propertyType ? '' : propertyType)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      {/* Фильтры - закреплены вверху под хедером */}
      <div className="sticky top-32 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Страна */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-black mb-2">Страна</h3>
              <div className="flex gap-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.country === 'russia'}
                    onChange={() => handleCountryChange('russia')}
                  />
                  <span className="text-sm text-gray-700">Россия</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.country === 'thailand'}
                    onChange={() => handleCountryChange('thailand')}
                  />
                  <span className="text-sm text-gray-700">Таиланд</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.country === 'china'}
                    onChange={() => handleCountryChange('china')}
                  />
                  <span className="text-sm text-gray-700">Китай</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.country === 'south-korea'}
                    onChange={() => handleCountryChange('south-korea')}
                  />
                  <span className="text-sm text-gray-700">Южная Корея</span>
                </label>
              </div>
            </div>

            {/* Тип недвижимости */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-black mb-2">Тип недвижимости</h3>
              <div className="flex gap-2 flex-wrap">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'apartment'}
                    onChange={() => handlePropertyTypeChange('apartment')}
                  />
                  <span className="text-sm text-gray-700">Квартира</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'house'}
                    onChange={() => handlePropertyTypeChange('house')}
                  />
                  <span className="text-sm text-gray-700">Жилой дом</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'land'}
                    onChange={() => handlePropertyTypeChange('land')}
                  />
                  <span className="text-sm text-gray-700">Земельный участок</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'commercial'}
                    onChange={() => handlePropertyTypeChange('commercial')}
                  />
                  <span className="text-sm text-gray-700">Коммерческое помещение</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'building'}
                    onChange={() => handlePropertyTypeChange('building')}
                  />
                  <span className="text-sm text-gray-700">Здание</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'nonCapital'}
                    onChange={() => handlePropertyTypeChange('nonCapital')}
                  />
                  <span className="text-sm text-gray-700">Некопитальный объект</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={filters.propertyType === 'shares'}
                    onChange={() => handlePropertyTypeChange('shares')}
                  />
                  <span className="text-sm text-gray-700">Доля в праве</span>
                </label>
              </div>
            </div>

            {/* Тип операции */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-black mb-2">{t('objects.operationType')}</h3>
              <div className="flex gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />
                  <span className="text-sm text-gray-700">{t('objects.sale')}</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={activeFilter === 'rent'}
                    readOnly
                  />
                  <span className="text-sm text-gray-700">{t('objects.rent')}</span>
                </label>
              </div>
            </div>

            {/* Цена */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-black mb-2">{t('objects.price')}</h3>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder={t('objects.priceFrom')} 
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input 
                  type="number" 
                  placeholder={t('objects.priceTo')} 
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Площадь */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-sm font-semibold text-black">Площадь</h3>
                <select 
                  className="text-xs border border-gray-300 rounded px-1 py-0.5 h-[1.2em] leading-none"
                  value={filters.areaUnit}
                  onChange={(e) => updateFilter('areaUnit', e.target.value)}
                >
                  <option value="m2">м²</option>
                  <option value="hectare">Гектар</option>
                  <option value="sotka">Сотки</option>
                  <option value="mu">亩</option>
                  <option value="wah2">Wah²</option>
                  <option value="ngan">Ngan</option>
                  <option value="rai">Rai</option>
                  <option value="pyeong">평</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder={t('objects.areaFrom')} 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input 
                  type="number" 
                  placeholder={t('objects.areaTo')} 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Дополнительные фильтры */}
            <div className="flex flex-col items-center">
              <button 
                onClick={() => setIsAdditionalFiltersOpen(true)}
                className="px-3 py-1 text-black rounded-md transition-colors text-sm"
                style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
              >
                Дополнительные фильтры
              </button>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">
                  {t('objects.applyFilters')}
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm">
                  {t('objects.reset')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Основной контент с объектами */}
      <main className="pt-4">
        <div className="max-w-7xl mx-auto px-4">
          {activeFilter === 'rent' && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">
                🔍 {t('objects.rentFilterActive')}
              </p>
            </div>
          )}
          
          {/* Сетка объектов - адаптивная */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-8">
            {filteredObjects.map((object) => (
              <div key={object.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
                  <span className="text-gray-500">{t('objects.photo')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                    {object.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                    {object.address}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>{object.area}</span>
                    <span>{object.floor}</span>
                    <span>{object.material}</span>
                  </div>
                  <p className="text-lg font-bold text-black">
                    {object.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Пагинация */}
          <div className="flex justify-center pb-8">
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                {t('objects.previous')}
              </button>
              <button className="px-3 py-2 text-black rounded-md" style={{ backgroundColor: '#fff60b' }}>
                1
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                2
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                3
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                {t('objects.next')}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Модальное окно дополнительных фильтров */}
      <AdditionalFiltersModal 
        isOpen={isAdditionalFiltersOpen}
        onClose={() => setIsAdditionalFiltersOpen(false)}
      />
    </div>
  );
}