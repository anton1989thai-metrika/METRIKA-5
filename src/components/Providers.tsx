"use client"

import { LanguageProvider } from "@/contexts/LanguageContext"
import { FiltersProvider } from "@/contexts/FiltersContext"

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <FiltersProvider>
        {children}
      </FiltersProvider>
    </LanguageProvider>
  )
}
