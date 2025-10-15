"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HeaderFilters() {
  const { t } = useLanguage();
  const { filters, updateFilter } = useFilters();

  const handleArrayFilterChange = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const handleInputChange = (key: string, value: string) => {
    updateFilter(key, value);
  };

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
          <div className="flex flex-nowrap gap-3 justify-center items-center overflow-x-auto">
            
            {/* Страна - Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[100px] justify-between">
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
                <Button variant="outline" className="min-w-[80px] justify-between">
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
                <Button variant="outline" className="min-w-[100px] justify-between">
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
                  className="w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Input 
                  type="number" 
                  placeholder="До" 
                  className="w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                  className="w-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Input 
                  type="number" 
                  placeholder="До" 
                  className="w-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Select value={filters.areaUnit} onValueChange={(value) => updateFilter('areaUnit', value)}>
                  <SelectTrigger className="w-16">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default">
                    Доп. фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <div className="grid flex-1 auto-rows-min gap-6 py-4">
                    {/* Основные характеристики */}
                    <div className="grid gap-3">
                      <h3 className="text-lg font-semibold text-black">Основные характеристики</h3>
                      
                      {/* Количество комнат */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Количество комнат</h4>
                        <div className="flex flex-wrap gap-2">
                          {['1', '2', '3', '4', '5 и более'].map(option => (
                            <Button
                              key={option}
                              variant={filters.rooms?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('rooms', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Количество спален */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Количество спален</h4>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="От" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.bedroomsFrom}
                            onChange={(e) => handleInputChange('bedroomsFrom', e.target.value)}
                          />
                          <Input 
                            type="number" 
                            placeholder="До" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.bedroomsTo}
                            onChange={(e) => handleInputChange('bedroomsTo', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Жилая площадь */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Жилая площадь (м²)</h4>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="От" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.livingAreaFrom}
                            onChange={(e) => handleInputChange('livingAreaFrom', e.target.value)}
                          />
                          <Input 
                            type="number" 
                            placeholder="До" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.livingAreaTo}
                            onChange={(e) => handleInputChange('livingAreaTo', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Количество санузлов */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Количество санузлов</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Без', '1', '2', '3', '4 и более'].map(option => (
                            <Button
                              key={option}
                              variant={filters.bathrooms?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('bathrooms', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Расположение и вид */}
                    <div className="grid gap-3">
                      <h3 className="text-lg font-semibold text-black">Расположение и вид</h3>
                      
                      {/* Вид */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Вид</h4>
                        <div className="flex flex-wrap gap-2">
                          {['На море', 'На горы', 'На город', 'На озеро или реку', 'Во двор'].map(option => (
                            <Button
                              key={option}
                              variant={filters.view?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('view', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Этаж */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Этаж</h4>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="От" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.floorFrom}
                            onChange={(e) => handleInputChange('floorFrom', e.target.value)}
                          />
                          <Input 
                            type="number" 
                            placeholder="До" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.floorTo}
                            onChange={(e) => handleInputChange('floorTo', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Этажность дома */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Этажность дома</h4>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="От" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.floorsFrom}
                            onChange={(e) => handleInputChange('floorsFrom', e.target.value)}
                          />
                          <Input 
                            type="number" 
                            placeholder="До" 
                            className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.floorsTo}
                            onChange={(e) => handleInputChange('floorsTo', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Тип и состояние */}
                    <div className="grid gap-3">
                      <h3 className="text-lg font-semibold text-black">Тип и состояние</h3>
                      
                      {/* Вид квартиры */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Вид квартиры</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Вторичное жильё', 'Новостройка'].map(option => (
                            <Button
                              key={option}
                              variant={filters.apartmentType?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('apartmentType', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Тип дома */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Тип дома</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Панельный', 'Кирпичный', 'Монолитный', 'Деревянный', 'Блочный'].map(option => (
                            <Button
                              key={option}
                              variant={filters.houseType?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('houseType', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Тип ремонта */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Тип ремонта</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Без отделки', 'В состоянии ремонта', 'Бюджетный ремонт', 'Базовая отделка', 'Устаревшая отделка', 'Современный евроремонт', 'Дизайнерский'].map(option => (
                            <Button
                              key={option}
                              variant={filters.renovationType?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('renovationType', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Готовность объекта */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Готовность объекта</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Строящийся', 'Построен'].map(option => (
                            <Button
                              key={option}
                              variant={filters.readiness?.includes(option) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleArrayFilterChange('readiness', option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Дата завершения ремонта */}
                      <div>
                        <h4 className="font-medium text-black mb-2">Дата завершения ремонта</h4>
                        <Input 
                          type="date" 
                          value={filters.renovationDate}
                          onChange={(e) => handleInputChange('renovationDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Закрыть</Button>
                    </SheetClose>
                    <Button variant="default">Применить</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
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

    </>
  );
}
