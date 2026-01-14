"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_LABELS } from '@/data/categoryLabels'

interface PropertyDetailsProps {
  area: string
  floor: string
  material: string
  yearBuilt: string
  rooms: string
  bathrooms: string
  balcony: string
  parking: string
  // 👇 Новое поле для динамических характеристик
  dynamicFields?: Record<string, string | number | null>
}

export function PropertyDetails({
  area,
  floor,
  material,
  yearBuilt,
  rooms,
  bathrooms,
  balcony,
  parking,
  dynamicFields
}: PropertyDetailsProps) {
  const mainCharacteristics = [
    { label: 'Площадь', value: area },
    { label: 'Этаж', value: floor },
    { label: 'Материал', value: material },
    { label: 'Год постройки', value: yearBuilt }
  ]

  const additionalCharacteristics = [
    { label: 'Количество комнат', value: rooms },
    { label: 'Санузлы', value: bathrooms },
    { label: 'Балкон', value: balcony },
    { label: 'Парковка', value: parking }
  ]

  // Фильтруем динамические поля - показываем только заполненные
  const dynamicCharacteristics = dynamicFields 
    ? Object.entries(dynamicFields)
        .filter(([, value]) => value && value !== '' && value !== null)
        .map(([key, value]) => ({
          label: CATEGORY_LABELS[key] || key,
          value: String(value)
        }))
    : []

  return (
    <div className="space-y-6">
      {/* Основные характеристики */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Основные характеристики
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mainCharacteristics.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">{item.label}:</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-900 font-medium">
                  {item.value}
                </Badge>
              </div>
              {index < mainCharacteristics.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Дополнительные характеристики */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Дополнительные характеристики
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {additionalCharacteristics.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">{item.label}:</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-900 font-medium">
                  {item.value}
                </Badge>
              </div>
              {index < additionalCharacteristics.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Динамические характеристики */}
      {dynamicCharacteristics.length > 0 && (
        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Дополнительные поля
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dynamicCharacteristics.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">{item.label}:</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-900 font-medium">
                    {item.value}
                  </Badge>
                </div>
                {index < dynamicCharacteristics.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
