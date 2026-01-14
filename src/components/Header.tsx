"use client"

import type { ReactNode } from "react"
import LanguageSelector from "./LanguageSelector"
import HeaderFilters from "./HeaderFilters"
import { AnimatedShinyButton } from "./ui/animated-shiny-button"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  children?: ReactNode
}

export default function Header({ children }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      {/* Кнопка смены языка - позиционирована в прав��м верхнем углу основного хедера */}
      <div className="absolute right-4 top-[19px] z-50 flex items-center gap-[10px]">
        <AnimatedShinyButton url="/chat">
          МЕТРИКА GPT
        </AnimatedShinyButton>
        <LanguageSelector />
      </div>
      
      <div className="max-w-[200px] mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          {/* Центральная часть - логотип */}
          <div className="flex-1 text-center flex flex-col justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="МЕТРИКА Агентство недвижимости"
                width={162}
                height={43}
                className="mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Черная линия */}
      <div className="h-0.5 bg-black"></div>
      
      {children}

      {/* Фильтры - показываем на странице объектов и карты */}
      {(pathname === '/objects' || pathname === '/map') && <HeaderFilters />}
    </header>
  )
}
