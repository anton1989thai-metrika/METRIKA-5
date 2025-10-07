"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import YandexMap from "@/components/YandexMap";
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
  const [visibleObjects, setVisibleObjects] = useState<RealEstateObject[]>([])
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
    <div className="h-screen bg-white overflow-hidden">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 h-[calc(100vh-8rem)]">
        <div className="max-w-7xl mx-auto px-4">
          {activeFilter === 'rent' && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">
                🔍 {t('objects.rentFilterActive')}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-1 items-start h-full">
            {/* Фильтры слева - прижаты к левому краю */}
            <div className="w-80 flex-shrink-0 pl-4">
              <div className="bg-gray-50 p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <h2 className="text-xl font-semibold text-black mb-6">
                  {t('objects.filters')}
                  {(filters.country || filters.propertyType || filters.areaUnit !== 'm2') && (
                    <span className="ml-2 text-sm text-blue-600">
                      (Активны: {[
                        filters.country && (filters.country === 'russia' ? 'Россия' : 
                                           filters.country === 'china' ? 'Китай' : 
                                           filters.country === 'thailand' ? 'Таиланд' : 
                                           filters.country === 'south-korea' ? 'Южная Корея' : filters.country),
                        filters.propertyType && (filters.propertyType === 'apartment' ? 'Квартира' :
                                                 filters.propertyType === 'house' ? 'Жилой дом' :
                                                 filters.propertyType === 'land' ? 'Земельный участок' :
                                                 filters.propertyType === 'commercial' ? 'Коммерческое помещение' :
                                                 filters.propertyType === 'building' ? 'Здание' :
                                                 filters.propertyType === 'nonCapital' ? 'Некопитальный объект' :
                                                 filters.propertyType === 'shares' ? 'Доля в праве' : filters.propertyType),
                        filters.areaUnit !== 'm2' && (filters.areaUnit === 'hectare' ? 'Гектар' : 
                                                      filters.areaUnit === 'sotka' ? 'Сотки' : 
                                                      filters.areaUnit === 'mu' ? '亩' : 
                                                      filters.areaUnit === 'wah2' ? 'Wah²' : 
                                                      filters.areaUnit === 'ngan' ? 'Ngan' : 
                                                      filters.areaUnit === 'rai' ? 'Rai' : 
                                                      filters.areaUnit === 'pyeong' ? '평' : filters.areaUnit)
                      ].filter(Boolean).join(', ')})
                    </span>
                  )}
                </h2>
                
                {/* Страна */}
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-3">Страна</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.country === 'russia'}
                        onChange={() => handleCountryChange('russia')}
                      />
                      <span className="text-gray-700">Россия</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.country === 'thailand'}
                        onChange={() => handleCountryChange('thailand')}
                      />
                      <span className="text-gray-700">Таиланд</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.country === 'china'}
                        onChange={() => handleCountryChange('china')}
                      />
                      <span className="text-gray-700">Китай</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.country === 'south-korea'}
                        onChange={() => handleCountryChange('south-korea')}
                      />
                      <span className="text-gray-700">Южная Корея</span>
                    </label>
                  </div>
                </div>
                
                {/* Тип недвижимости */}
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-3">Тип недвижимости</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'apartment'}
                        onChange={() => handlePropertyTypeChange('apartment')}
                      />
                      <span className="text-gray-700">Квартира</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'house'}
                        onChange={() => handlePropertyTypeChange('house')}
                      />
                      <span className="text-gray-700">Жилой дом</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'land'}
                        onChange={() => handlePropertyTypeChange('land')}
                      />
                      <span className="text-gray-700">Земельный участок</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'commercial'}
                        onChange={() => handlePropertyTypeChange('commercial')}
                      />
                      <span className="text-gray-700">Коммерческое помещение</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'building'}
                        onChange={() => handlePropertyTypeChange('building')}
                      />
                      <span className="text-gray-700">Здание</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'nonCapital'}
                        onChange={() => handlePropertyTypeChange('nonCapital')}
                      />
                      <span className="text-gray-700">Некопитальный объект</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.propertyType === 'shares'}
                        onChange={() => handlePropertyTypeChange('shares')}
                      />
                      <span className="text-gray-700">Доля в праве</span>
                    </label>
                  </div>
                </div>
                
                {/* Тип операции */}
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-3">{t('objects.operationType')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.sale')}</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={activeFilter === 'rent'}
                        readOnly
                      />
                      <span className="text-gray-700">{t('objects.rent')}</span>
                    </label>
                  </div>
                </div>
                
                {/* Цена */}
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-3">{t('objects.price')}</h3>
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder={t('objects.priceFrom')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <input 
                      type="number" 
                      placeholder={t('objects.priceTo')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                
                {/* Площадь */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-black">Площадь</h3>
                    <select 
                      className="text-sm border border-gray-300 rounded px-2 py-1 h-[1.2em] leading-none"
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
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder={t('objects.areaFrom')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <input 
                      type="number" 
                      placeholder={t('objects.areaTo')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                
                {/* Дополнительные фильтры */}
                <div className="mb-4">
                  <button 
                    onClick={() => setIsAdditionalFiltersOpen(true)}
                    className="w-full px-4 py-2 text-black rounded-md transition-colors"
                    style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                  >
                    Дополнительные фильтры
                  </button>
                </div>
                
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  {t('objects.applyFilters')}
                </button>
                
                <button className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
                  {t('objects.reset')}
                </button>
              </div>
            </div>
            
            {/* Список объектов */}
            <div className="flex-1 max-w-2xl px-4 h-[calc(100vh-12rem)] overflow-y-auto">
              <div className="space-y-4">
                {filteredObjects.map((object) => (
                  <div key={object.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">{t('objects.photo')}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          {object.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {object.address}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500 mb-2">
                          <span>{object.area}</span>
                          <span>{object.floor}</span>
                          <span>{object.material}</span>
                        </div>
                        <p className="text-xl font-bold text-black">
                          {object.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Пагинация */}
              <div className="mt-8 flex justify-center">
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
            
            {/* Карта справа */}
            <div className="flex-1 pr-4">
              <div className="h-[calc(100vh-12rem)]">
                <YandexMap 
                  objects={filteredObjects} 
                  onVisibleObjectsChange={setVisibleObjects}
                />
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