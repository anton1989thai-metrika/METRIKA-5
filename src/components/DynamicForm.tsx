'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { MultiSelect } from '@/components/MultiSelect'
import { DateRange } from 'react-day-picker'
import { FormConfig, FormData, FormRuleEngine, FormField } from '@/config/form-rules'

interface DynamicFormProps {
  config: FormConfig
  initialData?: FormData
  onSubmit: (data: FormData) => void
  onChange?: (data: FormData) => void
  className?: string
}

export function DynamicForm({
  config,
  initialData = {},
  onSubmit,
  onChange,
  className = ''
}: DynamicFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Обновляем форму при изменении данных
  useEffect(() => {
    if (onChange) {
      onChange(formData)
    }
  }, [formData, onChange])

  // Получаем видимые поля на основе текущих данных
  const visibleFields = FormRuleEngine.getVisibleFields(formData, config)
  const requiredFields = FormRuleEngine.getRequiredFields(formData, config)

  // Обновление данных формы
  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Очищаем ошибку для этого поля
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  // Валидация формы
  const validateForm = () => {
    const newErrors = FormRuleEngine.validateForm(formData, config)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  // Рендер поля в зависимости от типа
  const renderField = (field: FormField) => {
    const isVisible = visibleFields.includes(field.id)
    const isRequired = requiredFields.includes(field.id)
    const isDisabled = FormRuleEngine.isFieldDisabled(field.id, formData, config.rules)
    const hasError = !!errors[field.id]

    if (!isVisible) return null

    const commonProps = {
      disabled: isDisabled,
      className: hasError ? 'border-red-500' : ''
    }

    switch (field.type) {
      case 'input':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              value={formData[field.id] || ''}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              value={formData[field.id] || ''}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value) => updateFormData(field.id, value)}
              disabled={isDisabled}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Выберите ${field.label.toLowerCase()}`} />
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
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'multiselect':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <MultiSelect
              options={field.options || []}
              value={formData[field.id] || []}
              onValueChange={(value) => updateFormData(field.id, value)}
              placeholder={field.placeholder || `Выберите ${field.label.toLowerCase()}`}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'switch':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Switch
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => updateFormData(field.id, checked)}
              disabled={isDisabled}
            />
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {hasError && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'calendar':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Calendar
              mode="range"
              selected={formData[field.id] as DateRange}
              onSelect={(range) => updateFormData(field.id, range)}
              className="rounded-md border"
              disabled={isDisabled}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <textarea
              {...commonProps}
              value={formData[field.id] || ''}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
            {hasError && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Рендер секций
  const renderSections = () => {
    if (!config.sections) {
      // Если секций нет, рендерим все поля подряд
      return config.fields
        .filter(field => visibleFields.includes(field.id))
        .map(field => renderField(field))
    }

    return config.sections.map(section => {
      const sectionVisibleFields = section.fields.filter(fieldId => 
        visibleFields.includes(fieldId)
      )

      if (sectionVisibleFields.length === 0) return null

      return (
        <div key={section.id} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionVisibleFields.map(fieldId => {
              const field = config.fields.find(f => f.id === fieldId)
              return field ? renderField(field) : null
            })}
          </div>
        </div>
      )
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {renderSections()}
      
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData(initialData)}
        >
          Сбросить
        </Button>
        <Button type="submit">
          Сохранить
        </Button>
      </div>
    </form>
  )
}

// Хук для использования формы с конфигурацией
export function useDynamicForm(config: FormConfig, initialData?: FormData) {
  const [formData, setFormData] = useState<FormData>(initialData || {})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const visibleFields = FormRuleEngine.getVisibleFields(formData, config)
  const requiredFields = FormRuleEngine.getRequiredFields(formData, config)

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const validate = () => {
    const newErrors = FormRuleEngine.validateForm(formData, config)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = () => {
    setFormData(initialData || {})
    setErrors({})
  }

  return {
    formData,
    errors,
    visibleFields,
    requiredFields,
    updateField,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}
