"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface FiltersState {
  country: string[]
  propertyType: string[]
  priceFrom: string
  priceTo: string
  areaFrom: string
  areaTo: string
  areaUnit: string
  district: string
  operationType: string[]
  rooms: string[]
  bedroomsFrom: string
  bedroomsTo: string
  livingAreaFrom: string
  livingAreaTo: string
  bathrooms: string[]
  view: string[]
  floorFrom: string
  floorTo: string
  floorsFrom: string
  floorsTo: string
  apartmentType: string[]
  houseType: string[]
  readiness: string[]
  renovationType: string[]
  renovationDate: string
  heating: string[]
  waterSupply: string[]
  sewage: string[]
  internet: string[]
  houseInfrastructure: string[]
  parking: string[]
  infrastructure: string[]
  infrastructureDistance: string
  balcony: string[]
  balconyArea: string
  accessRoads: string[]
  landUse: string[]
  buildYearFrom: string
  buildYearTo: string
  ownershipType: string[]
  bargaining: string[]
  rentPeriod: string[]
  petsAllowed: string[]
  availableFrom: string
  deposit: string[]
  commission: string[]
}

interface FiltersContextType {
  filters: FiltersState
  setFilters: (filters: FiltersState) => void
  updateFilter: <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => void
  resetFilters: () => void
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

const initialFilters: FiltersState = {
  country: [],
  propertyType: [],
  priceFrom: '',
  priceTo: '',
  areaFrom: '',
  areaTo: '',
  areaUnit: 'm2',
  district: '',
  operationType: [],
  rooms: [],
  bedroomsFrom: '',
  bedroomsTo: '',
  livingAreaFrom: '',
  livingAreaTo: '',
  bathrooms: [],
  view: [],
  floorFrom: '',
  floorTo: '',
  floorsFrom: '',
  floorsTo: '',
  apartmentType: [],
  houseType: [],
  readiness: [],
  renovationType: [],
  renovationDate: '',
  heating: [],
  waterSupply: [],
  sewage: [],
  internet: [],
  houseInfrastructure: [],
  parking: [],
  infrastructure: [],
  infrastructureDistance: '',
  balcony: [],
  balconyArea: '',
  accessRoads: [],
  landUse: [],
  buildYearFrom: '',
  buildYearTo: '',
  ownershipType: [],
  bargaining: [],
  rentPeriod: [],
  petsAllowed: [],
  availableFrom: '',
  deposit: [],
  commission: []
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(initialFilters)

  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <FiltersContext.Provider value={{ filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider')
  }
  return context
}
