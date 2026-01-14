import { Building, Factory, Home, LandPlot, Share, Store } from 'lucide-react'

export const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Квартира', icon: Home, color: 'text-gray-600' },
  { id: 'house', name: 'Дом', icon: Building, color: 'text-gray-600' },
  { id: 'land', name: 'Участок', icon: LandPlot, color: 'text-gray-600' },
  { id: 'commercial', name: 'Коммерция', icon: Store, color: 'text-gray-600' },
  { id: 'building', name: 'Здание', icon: Factory, color: 'text-gray-600' },
  { id: 'nonCapital', name: 'Некопитальный', icon: Building, color: 'text-gray-600' },
  { id: 'shares', name: 'Доля', icon: Share, color: 'text-indigo-600' },
] as const

export const COUNTRIES = [
  { id: 'russia', name: 'Россия' },
  { id: 'thailand', name: 'Таиланд' },
  { id: 'china', name: 'Китай' },
  { id: 'south-korea', name: 'Южная Корея' },
] as const

export const OPERATION_TYPES = [
  { id: 'sale', name: 'Продажа' },
  { id: 'rent', name: 'Аренда' },
] as const

export const AGENTS = [
  { id: 'agent1', name: 'Анна Петрова', email: 'anna@metrika.direct' },
  { id: 'agent2', name: 'Михаил Сидоров', email: 'mikhail@metrika.direct' },
  { id: 'agent3', name: 'Елена Козлова', email: 'elena@metrika.direct' },
  { id: 'agent4', name: 'Дмитрий Волков', email: 'dmitry@metrika.direct' },
] as const
