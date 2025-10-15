"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useState } from "react";
import AdditionalFiltersModal from "./AdditionalFiltersModal";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] justify-between">
                  <span className="text-sm font-medium">
                    {filters.country?.length > 0 
                      ? `${filters.country.length} выбрано` 
                      : 'Страна'
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {countries.map(country => (
                  <DropdownMenuCheckboxItem
                    key={country.id}
                    checked={filters.country?.includes(country.id) || false}
                    onCheckedChange={() => handleCountryChange(country.id)}
                  >
                    {country.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Тип недвижимости - Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px] justify-between">
                  <span className="text-sm font-medium">
                    {filters.propertyType?.length > 0 
                      ? `${filters.propertyType.length} выбрано` 
                      : 'Тип'
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {propertyTypes.map(type => (
                  <DropdownMenuCheckboxItem
                    key={type.id}
                    checked={filters.propertyType?.includes(type.id) || false}
                    onCheckedChange={() => handlePropertyTypeChange(type.id)}
                  >
                    {type.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Тип операции - Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] justify-between">
                  <span className="text-sm font-medium">
                    {filters.operationType?.length > 0 
                      ? `${filters.operationType.length} выбрано` 
                      : 'Операция'
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {operationTypes.map(operation => (
                  <DropdownMenuCheckboxItem
                    key={operation.id}
                    checked={filters.operationType?.includes(operation.id) || false}
                    onCheckedChange={() => handleOperationTypeChange(operation.id)}
                  >
                    {operation.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Цена */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Цена:</span>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="От" 
                  className="w-20"
                />
                <Input 
                  type="number" 
                  placeholder="До" 
                  className="w-20"
                />
              </div>
            </div>

            {/* Площадь */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Площадь:</span>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="От" 
                  className="w-16"
                />
                <Input 
                  type="number" 
                  placeholder="До" 
                  className="w-16"
                />
                <Select value={filters.areaUnit} onValueChange={(value) => updateFilter('areaUnit', value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m2">м²</SelectItem>
                    <SelectItem value="hectare">Гектар</SelectItem>
                    <SelectItem value="sotka">Сотки</SelectItem>
                    <SelectItem value="mu">亩</SelectItem>
                    <SelectItem value="wah2">Wah²</SelectItem>
                    <SelectItem value="ngan">Ngan</SelectItem>
                    <SelectItem value="rai">Rai</SelectItem>
                    <SelectItem value="pyeong">평</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsAdditionalFiltersOpen(true)}
                variant="default"
              >
                Доп. фильтры
              </Button>
              <Button variant="default">
                Применить
              </Button>
              <Button variant="outline">
                Сбросить
              </Button>
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
