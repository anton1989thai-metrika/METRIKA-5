'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Field {
  key: string
  label: string
  type: string
  required: boolean
}

interface FieldFormProps {
  fields: Field[]
  onValuesChange: (values: Record<string, any>) => void
  initialValues?: Record<string, any>
}

export default function FieldForm({ fields, onValuesChange, initialValues = {} }: FieldFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value }
    setValues(newValues)
    onValuesChange(newValues)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Заполните поля договора</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.key}
                value={values[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full"
                rows={3}
              />
            ) : (
              <Input
                id={field.key}
                type={field.type}
                value={values[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="w-full"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

