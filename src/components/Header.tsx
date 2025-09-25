"use client"

import LanguageSelector from "./LanguageSelector"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Левая часть - бургер-меню (невидимый элемент для баланса) */}
          <div className="w-12 h-10 flex-shrink-0">
            {/* Невидимый элемент, который занимает место бургер-меню */}
          </div>
          
          {/* Центральная часть - логотип */}
          <div className="flex-1 text-center">
            <h1 className="font-bold text-black -mb-3" style={{ fontSize: '47px' }}>
              {t('header.title')}
            </h1>
            <p className="text-gray-600" style={{ fontSize: '20px' }}>
              {t('header.subtitle')}
            </p>
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
