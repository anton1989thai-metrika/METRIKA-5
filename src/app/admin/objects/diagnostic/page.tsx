'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getAvailableFields } from '@/lib/filterLogic'

// Маппинг значений
const COUNTRY_MAPPING: Record<string, string> = {
  'Россия': 'russia',
  'Таиланд': 'thailand', 
  'Китай': 'china',
  'Южная Корея': 'south-korea'
}

const OPERATION_MAPPING: Record<string, string> = {
  'Продажа': 'sale',
  'Аренда': 'rent',
  'Обмен': 'exchange'
}

const OBJECT_TYPE_MAPPING: Record<string, string> = {
  'Квартира': 'apartment',
  'Частный дом': 'house',
  'Коммерческое помещение': 'commercial',
  'Здание': 'building',
  'Имущественный комплекс': 'complex',
  'Некапитальный объект': 'non-capital',
  'Доля в праве': 'share',
  'Земельный участок': 'land'
}

const REVERSE_COUNTRY_MAPPING = Object.fromEntries(
  Object.entries(COUNTRY_MAPPING).map(([k, v]) => [v, k])
)
const REVERSE_OPERATION_MAPPING = Object.fromEntries(
  Object.entries(OPERATION_MAPPING).map(([k, v]) => [v, k])
)
const REVERSE_OBJECT_TYPE_MAPPING = Object.fromEntries(
  Object.entries(OBJECT_TYPE_MAPPING).map(([k, v]) => [v, k])
)

export default function DiagnosticPage() {
  const [formData, setFormData] = useState({
    country: '',
    operation: '',
    objectType: ''
  })
  
  const [availableFields, setAvailableFields] = useState<any[]>([])
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (formData.country && formData.operation && formData.objectType) {
      const countryName = REVERSE_COUNTRY_MAPPING[formData.country]
      const operationName = REVERSE_OPERATION_MAPPING[formData.operation]
      const objectTypeName = REVERSE_OBJECT_TYPE_MAPPING[formData.objectType]
      
      const fields = getAvailableFields(countryName, operationName, objectTypeName)
      setAvailableFields(fields)
      
      // Отладочная информация
      const debug = {
        formData,
        converted: {
          country: countryName,
          operation: operationName,
          objectType: objectTypeName
        },
        fieldsCount: fields.length,
        problematicFields: fields.filter(field => 
          field.name === "Тип фундамента" || 
          field.name === "Кадастровый номер" ||
          field.name === "Кадастровая стоимость"
        ),
        requiredFields: fields.filter(field => 
          field.name === "Удалённость от моря" ||
          field.name === "Аренда за м²" ||
          field.name === "Дополнительно оплачивается" ||
          field.name === "Размер депозита" ||
          field.name === "Недоступные даты" ||
          field.name === "Аренда с питомцами" ||
          field.name === "Срок аренды"
        )
      }
      
      setDebugInfo(debug)
      
      console.log("🔍 ДИАГНОСТИКА:", debug)
    } else {
      setAvailableFields([])
      setDebugInfo(null)
    }
  }, [formData.country, formData.operation, formData.objectType])

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const countries = Object.keys(COUNTRY_MAPPING)
  const operations = Object.keys(OPERATION_MAPPING)
  const objectTypes = Object.keys(OBJECT_TYPE_MAPPING)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Диагностика логики фильтрации
        </h1>
        <p className="text-gray-600">
          Проверка работы фильтрации полей для комбинации "Таиланд → Аренда → Частный дом"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Панель выбора */}
        <Card>
          <CardHeader>
            <CardTitle>Выбор параметров</CardTitle>
            <CardDescription>
              Выберите "Таиланд → Аренда → Частный дом" для тестирования
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Страна</Label>
              <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите страну" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={COUNTRY_MAPPING[country]} value={COUNTRY_MAPPING[country]}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Операция</Label>
              <Select 
                value={formData.operation} 
                onValueChange={(value) => updateFormData('operation', value)}
                disabled={!formData.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите операцию" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map(operation => (
                    <SelectItem key={OPERATION_MAPPING[operation]} value={OPERATION_MAPPING[operation]}>
                      {operation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Тип объекта</Label>
              <Select 
                value={formData.objectType} 
                onValueChange={(value) => updateFormData('objectType', value)}
                disabled={!formData.operation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип объекта" />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map(type => (
                    <SelectItem key={OBJECT_TYPE_MAPPING[type]} value={OBJECT_TYPE_MAPPING[type]}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Результат диагностики */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Результат диагностики
              {debugInfo && (
                <Badge variant={debugInfo.problematicFields.length === 0 ? "default" : "destructive"}>
                  {debugInfo.problematicFields.length === 0 ? "✅ OK" : "❌ Ошибка"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debugInfo ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Активные фильтры:</h4>
                  <p className="text-sm text-blue-700">
                    {debugInfo.converted.country} → {debugInfo.converted.operation} → {debugInfo.converted.objectType}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Показано полей: {debugInfo.fieldsCount}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">✅ Обязательные поля для аренды:</h4>
                    <div className="space-y-1">
                      {debugInfo.requiredFields.map((field: any) => (
                        <div key={field.name} className="text-sm text-green-600">
                          ✓ {field.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-600 mb-2">❌ Проблемные поля (не должны показываться):</h4>
                    {debugInfo.problematicFields.length > 0 ? (
                      <div className="space-y-1">
                        {debugInfo.problematicFields.map((field: any) => (
                          <div key={field.name} className="text-sm text-red-600">
                            ✗ {field.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-green-600">✓ Все проблемные поля правильно скрыты</div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Отладочная информация:</h4>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Выберите все параметры для диагностики
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Список всех полей */}
      {availableFields.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Все доступные поля ({availableFields.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableFields.map((field, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{field.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {field.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
