'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getAvailableFields, FieldConfig } from '@/lib/filterLogic'

export default function FilterDemoPage() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedOperation, setSelectedOperation] = useState('')
  const [selectedObjectType, setSelectedObjectType] = useState('')
  
  const [availableFields, setAvailableFields] = useState<FieldConfig[]>([])

  const updateFields = React.useCallback(() => {
    if (selectedCountry && selectedOperation && selectedObjectType) {
      const fields = getAvailableFields(selectedCountry, selectedOperation, selectedObjectType)
      setAvailableFields(fields)
    } else {
      setAvailableFields([])
    }
  }, [selectedCountry, selectedOperation, selectedObjectType])

  // Обновляем поля при изменении любого параметра
  React.useEffect(() => {
    updateFields()
  }, [updateFields])

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    setSelectedOperation('')
    setSelectedObjectType('')
    setAvailableFields([])
  }

  const handleOperationChange = (value: string) => {
    setSelectedOperation(value)
    setSelectedObjectType('')
    setAvailableFields([])
  }

  const handleObjectTypeChange = (value: string) => {
    setSelectedObjectType(value)
    updateFields()
  }

  const countries = ['Россия', 'Таиланд', 'Китай', 'Южная Корея']
  const operations = ['Продажа', 'Аренда', 'Обмен']
  const objectTypes = [
    'Квартира', 'Частный дом', 'Коммерческое помещение', 'Здание',
    'Имущественный комплекс', 'Некапитальный объект', 'Доля в праве', 'Земельный участок'
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Демонстрация фильтрации полей
        </h1>
        <p className="text-gray-600">
          Выберите параметры и посмотрите, какие поля будут показаны в форме
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Панель выбора */}
        <Card>
          <CardHeader>
            <CardTitle>Выбор параметров</CardTitle>
            <CardDescription>
              Иерархия: Страна → Операция → Тип объекта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>1. Страна</Label>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите страну" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>2. Операция</Label>
              <Select 
                value={selectedOperation} 
                onValueChange={handleOperationChange}
                disabled={!selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите операцию" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map(operation => (
                    <SelectItem key={operation} value={operation}>
                      {operation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>3. Тип объекта</Label>
              <Select 
                value={selectedObjectType} 
                onValueChange={handleObjectTypeChange}
                disabled={!selectedOperation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип объекта" />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={updateFields}
              disabled={!selectedObjectType}
              className="w-full"
            >
              Обновить поля
            </Button>
          </CardContent>
        </Card>

        {/* Результат фильтрации */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Доступные поля
              <Badge variant="secondary">
                {availableFields.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Поля, которые будут показаны в форме
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableFields.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    Активные фильтры: {selectedCountry} → {selectedOperation} → {selectedObjectType}
                  </p>
                </div>
                
                <div className="grid gap-2">
                  {availableFields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{field.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {field.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {!selectedCountry && "Выберите страну для начала"}
                {selectedCountry && !selectedOperation && "Выберите операцию"}
                {selectedOperation && !selectedObjectType && "Выберите тип объекта"}
                {selectedObjectType && availableFields.length === 0 && "Нет доступных полей для выбранных параметров"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Статистика */}
      {availableFields.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Статистика полей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {availableFields.length}
                </div>
                <div className="text-sm text-gray-600">Всего полей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {availableFields.filter(f => f.type === 'input').length}
                </div>
                <div className="text-sm text-gray-600">Input поля</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {availableFields.filter(f => f.type.includes('select')).length}
                </div>
                <div className="text-sm text-gray-600">Select поля</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {availableFields.filter(f => f.type === 'multiselect').length}
                </div>
                <div className="text-sm text-gray-600">MultiSelect поля</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
