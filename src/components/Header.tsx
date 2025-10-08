"use client"

import LanguageSelector from "./LanguageSelector"
import HeaderFilters from "./HeaderFilters"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      {/* Кнопка смены языка - позиционирована в правом верхнем углу основного хедера */}
      <div className="absolute right-4 top-5 z-50">
        <LanguageSelector />
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
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
      
      {/* Фильтры - показываем только на странице объектов */}
      {pathname === '/objects' && <HeaderFilters />}
    </header>
  )
}
