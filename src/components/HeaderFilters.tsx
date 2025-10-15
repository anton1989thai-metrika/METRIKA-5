"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useState } from "react";
import { ChevronDown, Square, Eye, Hammer, Building, Star, TreePine, Calendar, FileText, Key } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
                  <span className="text-sm font-normal">
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
                  <span className="text-sm font-normal">
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
                  <span className="text-sm font-normal">
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
                  <Button variant="outline">
                    Доп. фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto [&>button]:ml-6 [&>button]:relative [&>button]:left-[295px] [&>button]:top-[-3px] [&>button]:border-0 [&>button]:outline [&>button]:outline-[#fff60b] [&>button]:outline-1">
                  <Accordion type="single" collapsible className="w-full mt-4">
                    {/* Основные характеристики */}
                    <AccordionItem value="basic">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Square className="w-5 h-5" />
                          <span>Основные характеристики</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
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
                      </AccordionContent>
                    </AccordionItem>

                    {/* Расположение и вид */}
                    <AccordionItem value="location">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Eye className="w-5 h-5" />
                          <span>Расположение и вид</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
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
                      </AccordionContent>
                    </AccordionItem>

                    {/* Тип и состояние */}
                    <AccordionItem value="type">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Hammer className="w-5 h-5" />
                          <span>Тип и состояние</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
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
                      </AccordionContent>
                    </AccordionItem>

                    {/* Коммуникации */}
                    <AccordionItem value="communications">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5" />
                          <span>Коммуникации</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Тип отопления */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Тип отопления</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Без отопления', 'Центральное', 'Электрическое', 'Газовое', 'Твердотопливное', 'Другое'].map(option => (
                              <Button
                                key={option}
                                variant={filters.heating?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('heating', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Тип водоснабжения */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Тип водоснабжения</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Без водоснабжения', 'Центральное', 'Скважина', 'Централизованная подача горячей воды'].map(option => (
                              <Button
                                key={option}
                                variant={filters.waterSupply?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('waterSupply', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Тип канализации */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Тип канализации</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Без канализации', 'Централизованная канализация', 'Септик', 'Выгребная яма'].map(option => (
                              <Button
                                key={option}
                                variant={filters.sewage?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('sewage', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Наличие интернета */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Наличие интернета</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Есть', 'Нет'].map(option => (
                              <Button
                                key={option}
                                variant={filters.internet?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('internet', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Инфраструктура */}
                    <AccordionItem value="infrastructure">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5" />
                          <span>Инфраструктура</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Инфраструктура дома */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Инфраструктура дома</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Бассейн', 'Тренажерный зал', 'Теннисный корт', 'Круглосуточная охрана'].map(option => (
                              <Button
                                key={option}
                                variant={filters.houseInfrastructure?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('houseInfrastructure', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Парковка */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Парковка</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Наземная', 'Подземная', 'Отдельное здание'].map(option => (
                              <Button
                                key={option}
                                variant={filters.parking?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('parking', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Инфраструктура с расстоянием */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Инфраструктура</h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {['Школа', 'Детский сад', 'Больница', 'Стадион', 'Супермаркет', 'Метро', 'Автобусная остановка'].map(option => (
                              <Button
                                key={option}
                                variant={filters.infrastructure?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('infrastructure', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                          <div className="mt-2">
                            <label className="text-sm text-gray-600">Расстояние (км):</label>
                            <input 
                              type="range" 
                              min="0.5" 
                              max="10" 
                              step="0.5" 
                              className="w-full mt-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #fff60b 0%, #fff60b ${((parseFloat(filters.infrastructureDistance || 0.5) - 0.5) / (10 - 0.5)) * 100}%, #e5e7eb ${((parseFloat(filters.infrastructureDistance || 0.5) - 0.5) / (10 - 0.5)) * 100}%, #e5e7eb 100%)`
                              }}
                              value={filters.infrastructureDistance || 0.5}
                              onChange={(e) => handleInputChange('infrastructureDistance', e.target.value)}
                            />
                            <span className="text-sm text-gray-600">{filters.infrastructureDistance || 0.5} км</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Дополнительные удобства */}
                    <AccordionItem value="amenities">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Star className="w-5 h-5" />
                          <span>Дополнительные удобства</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Балкон */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Балкон</h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {['Нет', 'Есть'].map(option => (
                              <Button
                                key={option}
                                variant={filters.balcony?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('balcony', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                          <Input 
                            type="number" 
                            placeholder="Площадь балкона (м²)" 
                            className="w-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={filters.balconyArea}
                            onChange={(e) => handleInputChange('balconyArea', e.target.value)}
                          />
                        </div>

                        {/* Подъездные пути */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Подъездные пути</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Без подъездных путей', 'Грунтовая дорога', 'Асфальтированная дорога', 'Комбинированная дорога'].map(option => (
                              <Button
                                key={option}
                                variant={filters.accessRoads?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('accessRoads', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Земельный участок */}
                    <AccordionItem value="land">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <TreePine className="w-5 h-5" />
                          <span>Земельный участок</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Вид использования земельного участка */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Вид использования</h4>
                          <div className="flex flex-wrap gap-2">
                            {['ИЖС', 'Магазин', 'Под склад', 'Под производство', 'Под сельскохозяйственную деятельность', 'Под открытое хранение', 'Под гараж', 'Под организацию отдыха'].map(option => (
                              <Button
                                key={option}
                                variant={filters.landUse?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('landUse', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Строительство */}
                    <AccordionItem value="construction">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5" />
                          <span>Строительство</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Год постройки */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Год постройки дома</h4>
                          <div className="flex gap-2">
                            <Input 
                              type="number" 
                              placeholder="От" 
                              className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={filters.buildYearFrom}
                              onChange={(e) => handleInputChange('buildYearFrom', e.target.value)}
                            />
                            <Input 
                              type="number" 
                              placeholder="До" 
                              className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={filters.buildYearTo}
                              onChange={(e) => handleInputChange('buildYearTo', e.target.value)}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Права и условия */}
                    <AccordionItem value="rights">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5" />
                          <span>Права и условия</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Тип права */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Тип права</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Собственность', 'Аренда', 'Собственность+аренда', 'Доля'].map(option => (
                              <Button
                                key={option}
                                variant={filters.ownershipType?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('ownershipType', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Торг */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Торг</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Без торга', 'Минимальный', 'Существенный'].map(option => (
                              <Button
                                key={option}
                                variant={filters.bargaining?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('bargaining', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Аренда */}
                    <AccordionItem value="rent">
                      <AccordionTrigger className="text-black hover:no-underline flex items-center space-x-3 justify-between text-base font-normal">
                        <div className="flex items-center space-x-3">
                          <Key className="w-5 h-5" />
                          <span>Аренда</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        {/* Срок аренды */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Срок аренды</h4>
                          <div className="flex flex-wrap gap-2">
                            {['До 1 месяца', '1-3 месяца', '3-6 месяцев', '6-12 месяцев', 'Более года'].map(option => (
                              <Button
                                key={option}
                                variant={filters.rentPeriod?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('rentPeriod', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Аренда с питомцами */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Аренда с питомцами</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Собаки', 'Кошки', 'Другие крупные животные', 'Другие мелкие животные'].map(option => (
                              <Button
                                key={option}
                                variant={filters.petsAllowed?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('petsAllowed', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Аренда доступна с */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Аренда доступна с</h4>
                          <Input 
                            type="date" 
                            value={filters.availableFrom}
                            onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                          />
                        </div>

                        {/* Размер депозита */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Размер депозита</h4>
                          <div className="flex flex-wrap gap-2">
                            {['В размере 1 месяца', '2 месяцев', '3 месяцев', 'Конкретная сумма', 'Без депозита'].map(option => (
                              <Button
                                key={option}
                                variant={filters.deposit?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('deposit', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Комиссия Метрики */}
                        <div>
                          <h4 className="font-medium text-black mb-2">Комиссия Метрики</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Без комиссии', 'Конкретная сумма'].map(option => (
                              <Button
                                key={option}
                                variant={filters.commission?.includes(option) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayFilterChange('commission', option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <SheetFooter>
                    <Button 
                      variant="default" 
                      className="mt-2.5 w-full px-4 py-2 text-black rounded-md transition-colors text-base font-normal"
                      style={{ backgroundColor: '#fff60b' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                    >
                      Применить
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <Button 
                variant="default"
                className="text-black rounded-md transition-colors text-sm font-normal"
                style={{ backgroundColor: '#fff60b' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
              >
                Применить
              </Button>
              <Button variant="outline" className="text-sm font-normal">
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
