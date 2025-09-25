"use client"

import { useState, useEffect } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-center">
          <h1 className={`text-2xl font-bold text-black transition-all duration-300 ${
            isScrolled ? 'text-xl' : 'text-2xl'
          }`}>
            МЕТРИКА
          </h1>
          <p className={`text-sm text-gray-600 transition-all duration-300 ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            Агентство недвижимости
          </p>
        </div>
      </div>
      
      {/* Черная линия */}
      <div className="h-1 bg-black"></div>
    </header>
  )
}
