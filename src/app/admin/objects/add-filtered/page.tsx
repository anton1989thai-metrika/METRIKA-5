'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/MultiSelect'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getAvailableFields, FieldConfig } from '@/lib/filterLogic'

// Маппинг значений для UI
const COUNTRY_MAPPING = {
  'Россия': 'russia',
  'Таиланд': 'thailand', 
  'Китай': 'china',
  'Южная Корея': 'south-korea'
}

const OPERATION_MAPPING = {
  'Продажа': 'sale',
  'Аренда': 'rent',
  'Обмен': 'exchange'
}

const OBJECT_TYPE_MAPPING = {
  'Квартира': 'apartment',
  'Частный дом': 'house',
  'Коммерческое помещение': 'commercial',
  'Здание': 'building',
  'Имущественный комплекс': 'complex',
  'Некапитальный объект': 'non-capital',
  'Доля в праве': 'share',
  'Земельный участок': 'land'
}

// Обратный маппинг для отображения
const REVERSE_COUNTRY_MAPPING = Object.fromEntries(
  Object.entries(COUNTRY_MAPPING).map(([k, v]) => [v, k])
)
const REVERSE_OPERATION_MAPPING = Object.fromEntries(
  Object.entries(OPERATION_MAPPING).map(([k, v]) => [v, k])
)
const REVERSE_OBJECT_TYPE_MAPPING = Object.fromEntries(
  Object.entries(OBJECT_TYPE_MAPPING).map(([k, v]) => [v, k])
)

export default function AddObjectFilteredPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<Record<string, any>>({
    country: '',
    operation: '',
    objectType: '',
    // Динамические поля будут добавляться автоматически
  })
  
  const [availableFields, setAvailableFields] = useState<FieldConfig[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Обновляем доступные поля при изменении основных параметров
  useEffect(() => {
    if (formData.country && formData.operation && formData.objectType) {
      const countryName = REVERSE_COUNTRY_MAPPING[formData.country]
      const operationName = REVERSE_OPERATION_MAPPING[formData.operation]
      const objectTypeName = REVERSE_OBJECT_TYPE_MAPPING[formData.objectType]
      
      const fields = getAvailableFields(countryName, operationName, objectTypeName)
      setAvailableFields(fields)
      
      console.log(`Показываем ${fields.length} полей для:`, {
        country: countryName,
        operation: operationName,
        objectType: objectTypeName
      })
      
      // Отладочная информация
      console.log("Доступные поля:", fields.map(f => f.name))
      
      // Проверяем проблемные поля
      const problematicFields = fields.filter(field => 
        field.name === "Тип фундамента" || 
        field.name === "Кадастровый номер" ||
        field.name === "Кадастровая стоимость"
      )
      
      if (problematicFields.length > 0) {
        console.warn("❌ ПРОБЛЕМА: Показываются поля, которые не должны отображаться:", problematicFields.map(f => f.name))
        problematicFields.forEach(field => {
          console.warn(`- ${field.name}: countries=${field.countries}, operations=${field.operations}, objects=${field.objects}`)
        })
      } else {
        console.log("✅ Логика фильтрации работает правильно")
      }
    } else {
      setAvailableFields([])
    }
  }, [formData.country, formData.operation, formData.objectType])

  const updateFormData = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    // Очищаем ошибку для этого поля
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const renderField = (field: FieldConfig) => {
    const fieldKey = field.name.toLowerCase().replace(/\s+/g, '_')
    const hasError = !!errors[fieldKey]

    switch (field.type) {
      case 'input':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.name}
            </Label>
            <Input
              value={formData[fieldKey] || ''}
              onChange={(e) => updateFormData(fieldKey, e.target.value)}
              placeholder={field.placeholder || `Введите ${field.name.toLowerCase()}`}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[fieldKey]}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.name}
            </Label>
            <Select
              value={formData[fieldKey] || ''}
              onValueChange={(value) => updateFormData(fieldKey, value)}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Выберите ${field.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500">{errors[fieldKey]}</p>
            )}
          </div>
        )

      case 'select+input':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.name}
            </Label>
            <div className="flex gap-2">
              <Select
                value={formData[fieldKey] || ''}
                onValueChange={(value) => updateFormData(fieldKey, value)}
              >
                <SelectTrigger className={`flex-1 ${hasError ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={`Выберите ${field.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData[fieldKey] === 'other' && (
                <Input
                  value={formData[`${fieldKey}_other`] || ''}
                  onChange={(e) => updateFormData(`${fieldKey}_other`, e.target.value)}
                  placeholder="Укажите значение"
                  className="flex-1"
                />
              )}
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{errors[fieldKey]}</p>
            )}
          </div>
        )

      case 'multiselect':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.name}
            </Label>
            <MultiSelect
              options={field.options || []}
              value={formData[fieldKey] || []}
              onValueChange={(value) => updateFormData(fieldKey, value)}
              placeholder={`Выберите ${field.name.toLowerCase()}`}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[fieldKey]}</p>
            )}
          </div>
        )

      case 'calendar':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.name}
            </Label>
            <Calendar
              mode="range"
              selected={formData[fieldKey] as DateRange}
              onSelect={(range) => updateFormData(fieldKey, range)}
              className="rounded-md border"
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[fieldKey]}</p>
            )}
          </div>
        )

      case 'input+button':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.name}
            </Label>
            <div className="flex gap-2">
              <Input
                value={formData[fieldKey] || ''}
                onChange={(e) => updateFormData(fieldKey, e.target.value)}
                placeholder={field.placeholder || `Введите ${field.name.toLowerCase()}`}
                className={`flex-1 ${hasError ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Здесь можно добавить логику для кнопки (например, поиск по кадастру)
                  console.log('Поиск по кадастру:', formData[fieldKey])
                }}
              >
                Найти
              </Button>
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{errors[fieldKey]}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Проверка обязательных полей
    if (!formData.country) newErrors.country = 'Страна обязательна для заполнения'
    if (!formData.operation) newErrors.operation = 'Операция обязательна для заполнения'
    if (!formData.objectType) newErrors.objectType = 'Тип объекта обязателен для заполнения'
    
    // Проверка доступных полей
    availableFields.forEach(field => {
      const fieldKey = field.name.toLowerCase().replace(/\s+/g, '_')
      if (field.validation?.required && !formData[fieldKey]) {
        newErrors[fieldKey] = `${field.name} обязательно для заполнения`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Отправленные данные:', formData)
      alert('Объект успешно добавлен!')
      router.push('/admin/objects')
    }
  }

  return (
    <ProtectedRoute requiredPermission="adminPanel">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Хлебные крошки */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  Админ панель
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/objects">
                  Объекты недвижимости
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Добавить объект (Фильтрованная форма)</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Заголовок */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Добавить объект недвижимости
                </h1>
                <p className="mt-2 text-gray-600">
                  Форма с динамической фильтрацией полей по стране, операции и типу объекта
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/objects')}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Вернуться к списку
              </Button>
            </div>
          </div>

          {/* Форма */}
          <div className="bg-white rounded-lg shadow-sm border">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Основные поля */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Страна <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => updateFormData('country', value)}
                  >
                    <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите страну" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COUNTRY_MAPPING).map(([name, id]) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Операция <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.operation}
                    onValueChange={(value) => updateFormData('operation', value)}
                  >
                    <SelectTrigger className={errors.operation ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите операцию" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OPERATION_MAPPING).map(([name, id]) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.operation && (
                    <p className="text-sm text-red-500">{errors.operation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Тип объекта <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.objectType}
                    onValueChange={(value) => updateFormData('objectType', value)}
                  >
                    <SelectTrigger className={errors.objectType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите тип объекта" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OBJECT_TYPE_MAPPING).map(([name, id]) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.objectType && (
                    <p className="text-sm text-red-500">{errors.objectType}</p>
                  )}
                </div>
              </div>

              {/* Информация о фильтрации */}
              {formData.country && formData.operation && formData.objectType && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Активные фильтры:</strong> {REVERSE_COUNTRY_MAPPING[formData.country]} → {REVERSE_OPERATION_MAPPING[formData.operation]} → {REVERSE_OBJECT_TYPE_MAPPING[formData.objectType]}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Показано полей: {availableFields.length}
                  </p>
                </div>
              )}

              {/* Динамические поля */}
              {availableFields.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Характеристики объекта
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableFields.map(field => renderField(field))}
                  </div>
                </div>
              )}

              {/* Кнопки */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline">
                  Добавить фото
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({ country: '', operation: '', objectType: '' })
                    setAvailableFields([])
                    setErrors({})
                  }}
                >
                  Сбросить
                </Button>
                <Button type="submit">
                  Продолжить
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
