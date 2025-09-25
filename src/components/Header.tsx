"use client"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">
            МЕТРИКА
          </h1>
          <p className="text-sm text-gray-600">
            Агентство недвижимости
          </p>
        </div>
      </div>
      
      {/* Черная линия */}
      <div className="h-1 bg-black"></div>
    </header>
  )
}
