"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { FiltersProvider } from "@/contexts/FiltersContext"

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <FiltersProvider>
          {children}
        </FiltersProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}
