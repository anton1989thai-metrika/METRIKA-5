"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useState } from "react";
import AdditionalFiltersModal from "./AdditionalFiltersModal";

export default function HeaderFilters() {
  const { t } = useLanguage();
  const { filters, updateFilter } = useFilters();
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);

  // Обработчик изменения фильтра по стране
  const handleCountryChange = (country: string) => {
    updateFilter('country', filters.country === country ? '' : country);
  };

  // Обработчик изменения фильтра по типу недвижимости
  const handlePropertyTypeChange = (propertyType: string) => {
    updateFilter('propertyType', filters.propertyType === propertyType ? '' : propertyType);
  };

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {/* Страна */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Страна:</span>
              <div className="flex gap-1">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.country === 'russia'}
                    onChange={() => handleCountryChange('russia')}
                  />
                  <span className="text-xs text-gray-700">Россия</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.country === 'thailand'}
                    onChange={() => handleCountryChange('thailand')}
                  />
                  <span className="text-xs text-gray-700">Таиланд</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.country === 'china'}
                    onChange={() => handleCountryChange('china')}
                  />
                  <span className="text-xs text-gray-700">Китай</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.country === 'south-korea'}
                    onChange={() => handleCountryChange('south-korea')}
                  />
                  <span className="text-xs text-gray-700">Южная Корея</span>
                </label>
              </div>
            </div>

            {/* Тип недвижимости */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Тип:</span>
              <div className="flex gap-1 flex-wrap">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'apartment'}
                    onChange={() => handlePropertyTypeChange('apartment')}
                  />
                  <span className="text-xs text-gray-700">Квартира</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'house'}
                    onChange={() => handlePropertyTypeChange('house')}
                  />
                  <span className="text-xs text-gray-700">Дом</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'land'}
                    onChange={() => handlePropertyTypeChange('land')}
                  />
                  <span className="text-xs text-gray-700">Участок</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'commercial'}
                    onChange={() => handlePropertyTypeChange('commercial')}
                  />
                  <span className="text-xs text-gray-700">Коммерция</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'building'}
                    onChange={() => handlePropertyTypeChange('building')}
                  />
                  <span className="text-xs text-gray-700">Здание</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'nonCapital'}
                    onChange={() => handlePropertyTypeChange('nonCapital')}
                  />
                  <span className="text-xs text-gray-700">Некопитальный</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-3 h-3" 
                    checked={filters.propertyType === 'shares'}
                    onChange={() => handlePropertyTypeChange('shares')}
                  />
                  <span className="text-xs text-gray-700">Доля</span>
                </label>
              </div>
            </div>

            {/* Тип операции */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Операция:</span>
              <div className="flex gap-1">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 w-3 h-3" />
                  <span className="text-xs text-gray-700">Продажа</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 w-3 h-3" />
                  <span className="text-xs text-gray-700">Аренда</span>
                </label>
              </div>
            </div>

            {/* Цена */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Цена:</span>
              <div className="flex gap-1">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-16 px-1 py-1 border border-gray-300 rounded text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-16 px-1 py-1 border border-gray-300 rounded text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Площадь */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Площадь:</span>
              <div className="flex gap-1">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <select 
                  className="text-xs border border-gray-300 rounded px-1 py-1 h-6"
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
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-1">
              <button 
                onClick={() => setIsAdditionalFiltersOpen(true)}
                className="px-2 py-1 text-black rounded text-xs transition-colors"
                style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
              >
                Доп. фильтры
              </button>
              <button className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors">
                Применить
              </button>
              <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 transition-colors">
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно дополнительных фильтров */}
      <AdditionalFiltersModal 
        isOpen={isAdditionalFiltersOpen}
        onClose={() => setIsAdditionalFiltersOpen(false)}
      />
    </>
  );
}
