"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface FiltersState {
  country: string
  propertyType: string
  priceFrom: string
  priceTo: string
  areaFrom: string
  areaTo: string
  areaUnit: string
  district: string
  operationType: string[]
}

interface FiltersContextType {
  filters: FiltersState
  setFilters: (filters: FiltersState) => void
  updateFilter: (key: keyof FiltersState, value: any) => void
  resetFilters: () => void
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

const initialFilters: FiltersState = {
  country: '',
  propertyType: '',
  priceFrom: '',
  priceTo: '',
  areaFrom: '',
  areaTo: '',
  areaUnit: 'm2',
  district: '',
  operationType: []
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(initialFilters)

  const updateFilter = (key: keyof FiltersState, value: any) => {
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
