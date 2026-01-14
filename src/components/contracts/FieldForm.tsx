'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Field {
  key: string
  label: string
  type: string
  required: boolean
}

type FieldValues = Record<string, string>

interface FieldFormProps {
  fields: Field[]
  onValuesChange: (values: FieldValues) => void
  initialValues?: FieldValues
}

export default function FieldForm({ fields, onValuesChange, initialValues = {} }: FieldFormProps) {
  const [values, setValues] = useState<FieldValues>(initialValues)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, fields])

  const handleChange = (key: string, value: string) => {
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
