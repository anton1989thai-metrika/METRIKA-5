"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { realEstateObjects, RealEstateObject } from "@/data/realEstateObjects";
import Link from "next/link";

export default function ObjectsPage() {
  const { t } = useLanguage()
  const { filters } = useFilters()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter) {
      setActiveFilter(filter)
    }
  }, [searchParams])

  // Получаем переведенные объекты
  const objects = realEstateObjects.map(obj => ({
    ...obj,
    title: t(`realEstateObjects.${obj.id}.title`),
    address: t(`realEstateObjects.${obj.id}.address`),
    material: t(`realEstateObjects.${obj.id}.material`)
  }))

  // Функция для фильтрации объектов
  const getFilteredObjects = () => {
    return objects.filter(obj => {
      // Фильтр по стране
      if (filters.country && filters.country.length > 0 && !filters.country.includes(obj.country)) {
        return false
      }
      
      // Фильтр по типу недвижимости
      if (filters.propertyType && filters.propertyType.length > 0 && !filters.propertyType.includes(obj.type)) {
        return false
      }
      
      // Фильтр по типу операции
      if (filters.operationType && filters.operationType.length > 0 && !filters.operationType.includes(obj.operation)) {
        return false
      }
      
      // Здесь можно добавить другие фильтры
      
      return true
    })
  }

  const filteredObjects = getFilteredObjects()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      {/* Основной контент с объектами */}
      <main className="pt-36 sm:pt-40 lg:pt-44">
        <div className="px-2 sm:px-4 lg:px-6 xl:px-8">
          {activeFilter === 'rent' && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">
                🔍 {t('objects.rentFilterActive')}
              </p>
            </div>
          )}
          
          {/* Сетка объектов - адаптивная */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 pb-8">
            {filteredObjects.map((object) => (
              <Link key={object.id} href={`/objects/${object.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
                    <span className="text-gray-500">{t('objects.photo')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                      {object.title}
                    </h3>
                    <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                      {object.address}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>{object.area}</span>
                      <span>{object.floor}</span>
                      <span>{object.material}</span>
                    </div>
                    <p className="text-lg font-bold text-black">
                      {object.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Пагинация */}
          <div className="flex justify-center pb-8">
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                {t('objects.previous')}
              </button>
              <button className="px-3 py-2 text-black rounded-md" style={{ backgroundColor: '#fff60b' }}>
                1
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                2
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                3
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                {t('objects.next')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}