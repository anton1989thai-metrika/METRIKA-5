"use client"

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import AdditionalFiltersModal from "@/components/AdditionalFiltersModal";

export default function MapFilters() {
  const { t } = useLanguage();
  const { filters, updateFilter, resetFilters: resetGlobalFilters } = useFilters();
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);

  const handleCountryChange = (country: string) => {
    updateFilter('country', filters.country === country ? '' : country)
  }

  const handlePropertyTypeChange = (propertyType: string) => {
    updateFilter('propertyType', filters.propertyType === propertyType ? '' : propertyType)
  }

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-gray-50 p-6 rounded-lg sticky top-40 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
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
        <div className="mb-6">
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
        <div className="mb-6">
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
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">Тип операции</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Продажа</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Аренда</span>
            </label>
          </div>
        </div>
        
        {/* Цена */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">Цена</h3>
          <div className="space-y-2">
            <input 
              type="number" 
              placeholder="От" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input 
              type="number" 
              placeholder="До" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        
        {/* Площадь */}
        <div className="mb-6">
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
              placeholder="От" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input 
              type="number" 
              placeholder="До" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        
        {/* Дополнительные фильтры */}
        <div className="mb-6">
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
        
        <button 
          className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          onClick={resetGlobalFilters}
        >
          {t('objects.reset')}
        </button>
      </div>
      
      {/* Модальное окно дополнительных фильтров */}
      <AdditionalFiltersModal 
        isOpen={isAdditionalFiltersOpen}
        onClose={() => setIsAdditionalFiltersOpen(false)}
      />
    </div>
  );
}
