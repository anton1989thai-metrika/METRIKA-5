"use client"

import LanguageSelector from "./LanguageSelector"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Левая часть - бургер-меню (невидимый элемент для баланса) */}
          <div className="w-12 h-10 flex-shrink-0 flex items-center">
            {/* Невидимый элемент, который занимает место бургер-меню */}
          </div>
          
          {/* Центральная часть - логотип */}
          <div className="flex-1 text-center flex flex-col justify-center">
            <Image
              src="/images/logo"
              alt="МЕТРИКА Агентство недвижимости"
              width={300}
              height={80}
              className="mx-auto"
            />
          </div>
          
          {/* Правая часть - выбор языка */}
          <div className="w-12 h-10 flex-shrink-0 flex items-center justify-end">
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      {/* Черная линия */}
      <div className="h-1 bg-black"></div>
    </header>
  )
}
