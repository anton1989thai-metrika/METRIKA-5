"use client"

import LanguageSelector from "./LanguageSelector"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Левая часть - логотип */}
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-black">
              МЕТРИКА
            </h1>
            <p className="text-sm text-gray-600">
              Агентство недвижимости
            </p>
          </div>
          
          {/* Правая часть - выбор языка */}
          <div className="flex-shrink-0">
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      {/* Черная линия */}
      <div className="h-1 bg-black"></div>
    </header>
  )
}
