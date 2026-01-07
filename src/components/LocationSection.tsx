"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface LocationSectionProps {
  address: string
}

export function LocationSection({ address }: LocationSectionProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Расположение
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Заглушка карты */}
        <div className="aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
          <MapPin className="w-12 h-12 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Интерактивная карта
          </h3>
          <p className="text-sm text-gray-500 text-center">
            Google Maps / Yandex / 2GIS
          </p>
          <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">
            {address}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
