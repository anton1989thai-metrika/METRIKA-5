"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useState } from "react";
import AdditionalFiltersModal from "./AdditionalFiltersModal";
import { ChevronDown } from "lucide-react";

export default function HeaderFilters() {
  const { t } = useLanguage();
  const { filters, updateFilter } = useFilters();
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isOperationDropdownOpen, setIsOperationDropdownOpen] = useState(false);

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

  const countries = [
    { id: 'russia', name: 'Россия' },
    { id: 'thailand', name: 'Таиланд' },
    { id: 'china', name: 'Китай' },
    { id: 'south-korea', name: 'Южная Корея' }
  ];

  const propertyTypes = [
    { id: 'apartment', name: 'Квартира' },
    { id: 'house', name: 'Дом' },
    { id: 'land', name: 'Участок' },
    { id: 'commercial', name: 'Коммерция' },
    { id: 'building', name: 'Здание' },
    { id: 'nonCapital', name: 'Некопитальный' },
    { id: 'shares', name: 'Доля' }
  ];

  const operationTypes = [
    { id: 'sale', name: 'Продажа' },
    { id: 'rent', name: 'Аренда' }
  ];

  return (
    <>
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            
            {/* Страна - Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="medusa-select min-w-[120px]"
              >
                <span className="text-sm font-medium text-gray-700">
                  {filters.country?.length > 0 
                    ? `${filters.country.length} выбрано` 
                    : 'Страна'
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {isCountryDropdownOpen && (
                <div className="medusa-dropdown">
                  {countries.map(country => (
                    <label key={country.id} className="medusa-dropdown-item">
                      <input
                        type="checkbox"
                        className="medusa-checkbox mr-2"
                        checked={filters.country?.includes(country.id) || false}
                        onChange={() => handleCountryChange(country.id)}
                      />
                      {country.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Тип недвижимости - Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="medusa-select min-w-[140px]"
              >
                <span className="text-sm font-medium text-gray-700">
                  {filters.propertyType?.length > 0 
                    ? `${filters.propertyType.length} выбрано` 
                    : 'Тип'
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {isTypeDropdownOpen && (
                <div className="medusa-dropdown">
                  {propertyTypes.map(type => (
                    <label key={type.id} className="medusa-dropdown-item">
                      <input
                        type="checkbox"
                        className="medusa-checkbox mr-2"
                        checked={filters.propertyType?.includes(type.id) || false}
                        onChange={() => handlePropertyTypeChange(type.id)}
                      />
                      {type.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Тип операции - Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOperationDropdownOpen(!isOperationDropdownOpen)}
                className="medusa-select min-w-[120px]"
              >
                <span className="text-sm font-medium text-gray-700">
                  {filters.operationType?.length > 0 
                    ? `${filters.operationType.length} выбрано` 
                    : 'Операция'
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {isOperationDropdownOpen && (
                <div className="medusa-dropdown">
                  {operationTypes.map(operation => (
                    <label key={operation.id} className="medusa-dropdown-item">
                      <input
                        type="checkbox"
                        className="medusa-checkbox mr-2"
                        checked={filters.operationType?.includes(operation.id) || false}
                        onChange={() => handleOperationTypeChange(operation.id)}
                      />
                      {operation.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Цена */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Цена:</span>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="medusa-input w-20"
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="medusa-input w-20"
                />
              </div>
            </div>

            {/* Площадь */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Площадь:</span>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  className="medusa-input w-16"
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  className="medusa-input w-16"
                />
                <select 
                  className="medusa-form-select w-20"
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
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAdditionalFiltersOpen(true)}
                className="medusa-button-yellow"
              >
                Доп. фильтры
              </button>
              <button className="medusa-button">
                Применить
              </button>
              <button className="medusa-button-secondary">
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
