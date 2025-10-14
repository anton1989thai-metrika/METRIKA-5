"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useState } from "react";
import AdditionalFiltersModal from "./AdditionalFiltersModal";

export default function HeaderFilters() {
  const { t } = useLanguage();
  const { filters, updateFilter } = useFilters();
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);

  // Обработчик изменения фильтра по стране (множественный выбор)
  const handleCountryChange = (country: string) => {
    const currentCountries = filters.country || [];
    const newCountries = currentCountries.includes(country)
      ? currentCountries.filter(c => c !== country)
      : [...currentCountries, country];
    updateFilter('country', newCountries);
  };

  // Обработчик изменения фильтра по типу недвижимости (множественный выбор)
  const handlePropertyTypeChange = (propertyType: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(propertyType)
      ? currentTypes.filter(t => t !== propertyType)
      : [...currentTypes, propertyType];
    updateFilter('propertyType', newTypes);
  };

  // Обработчик изменения фильтра по типу операции (множественный выбор)
  const handleOperationTypeChange = (operationType: string) => {
    const currentOperations = filters.operationType || [];
    const newOperations = currentOperations.includes(operationType)
      ? currentOperations.filter(o => o !== operationType)
      : [...currentOperations, operationType];
    updateFilter('operationType', newOperations);
  };

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {/* Страна */}
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-600 whitespace-nowrap">Страна:</span>
              <div className="flex gap-1">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.country?.includes('russia') || false}
                    onChange={() => handleCountryChange('russia')}
                  />
                  <span className="text-base text-gray-700">Россия</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.country?.includes('thailand') || false}
                    onChange={() => handleCountryChange('thailand')}
                  />
                  <span className="text-base text-gray-700">Таиланд</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.country?.includes('china') || false}
                    onChange={() => handleCountryChange('china')}
                  />
                  <span className="text-base text-gray-700">Китай</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.country?.includes('south-korea') || false}
                    onChange={() => handleCountryChange('south-korea')}
                  />
                  <span className="text-base text-gray-700">Южная Корея</span>
                </label>
              </div>
            </div>

            {/* Тип недвижимости */}
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-600 whitespace-nowrap">Тип:</span>
              <div className="flex gap-1 flex-wrap">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('apartment') || false}
                    onChange={() => handlePropertyTypeChange('apartment')}
                  />
                  <span className="text-base text-gray-700">Квартира</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('house') || false}
                    onChange={() => handlePropertyTypeChange('house')}
                  />
                  <span className="text-base text-gray-700">Дом</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('land') || false}
                    onChange={() => handlePropertyTypeChange('land')}
                  />
                  <span className="text-base text-gray-700">Участок</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('commercial') || false}
                    onChange={() => handlePropertyTypeChange('commercial')}
                  />
                  <span className="text-base text-gray-700">Коммерция</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('building') || false}
                    onChange={() => handlePropertyTypeChange('building')}
                  />
                  <span className="text-base text-gray-700">Здание</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('nonCapital') || false}
                    onChange={() => handlePropertyTypeChange('nonCapital')}
                  />
                  <span className="text-base text-gray-700">Некопитальный</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.propertyType?.includes('shares') || false}
                    onChange={() => handlePropertyTypeChange('shares')}
                  />
                  <span className="text-base text-gray-700">Доля</span>
                </label>
              </div>
            </div>

            {/* Тип операции */}
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-600 whitespace-nowrap">Операция:</span>
              <div className="flex gap-1">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.operationType?.includes('sale') || false}
                    onChange={() => handleOperationTypeChange('sale')}
                  />
                  <span className="text-base text-gray-700">Продажа</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-1 w-4 h-4 border border-gray-300 rounded shadow-sm custom-checkbox" 
                    checked={filters.operationType?.includes('rent') || false}
                    onChange={() => handleOperationTypeChange('rent')}
                  />
                  <span className="text-base text-gray-700">Аренда</span>
                </label>
              </div>
            </div>

            {/* Цена */}
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-600 whitespace-nowrap">Цена:</span>
              <div className="flex gap-1">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Площадь */}
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-600 whitespace-nowrap">Площадь:</span>
              <div className="flex gap-1">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <select 
                  className="text-base border border-gray-300 rounded px-2 py-1 h-8"
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
                className="px-3 py-2 text-black rounded text-base transition-colors"
                style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
              >
                Доп. фильтры
              </button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded text-base hover:bg-gray-700 transition-colors">
                Применить
              </button>
              <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-base hover:bg-gray-400 transition-colors">
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
