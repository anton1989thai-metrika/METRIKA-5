"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Wifi, MapPin, User } from 'lucide-react'

interface InfrastructureSectionProps {
  internet: string
  accessRoads: string
  concierge: string
}

export function InfrastructureSection({
  internet,
  accessRoads,
  concierge
}: InfrastructureSectionProps) {
  const infrastructureItems = [
    { 
      label: 'Интернет', 
      value: internet, 
      icon: <Wifi className="w-4 h-4" />
    },
    { 
      label: 'Подъездные пути', 
      value: accessRoads, 
      icon: <MapPin className="w-4 h-4" />
    },
    { 
      label: 'Консьерж', 
      value: concierge, 
      icon: <User className="w-4 h-4" />
    }
  ]

  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Инфраструктура
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {infrastructureItems.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <div className="text-gray-500">
                  {item.icon}
                </div>
                <span className="text-gray-600 font-medium">{item.label}:</span>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-900 font-medium">
                {item.value}
              </Badge>
            </div>
            {index < infrastructureItems.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
