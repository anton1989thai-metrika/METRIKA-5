"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { realEstateObjects } from "@/data/realEstateObjects";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function ObjectsContent() {
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
  const objects = useMemo(() => realEstateObjects.map(obj => ({
    ...obj,
    title: t(`realEstateObjects.${obj.id}.title`),
    address: t(`realEstateObjects.${obj.id}.address`),
    material: t(`realEstateObjects.${obj.id}.material`)
  })), [t])

  // Функция для фильтрации объектов
  const filteredObjects = useMemo(() => {
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
  }, [filters, objects])

  return (
    <>
      {/* Основной контент с объектами */}
      <main className="pt-32">
        <div className="px-2 sm:px-4 lg:px-6 xl:px-8">
          {activeFilter === 'rent' && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">
                🔍 {t('objects.rentFilterActive')}
              </p>
            </div>
          )}
          
          {/* Сетка объектов - адаптивная */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 pb-8">
            {filteredObjects.map((object) => (
              <Link key={object.id} href={`/objects/${object.id}`}>
                <div className="card bg-base-100 w-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <figure>
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">{t('objects.photo')}</span>
                    </div>
                  </figure>
                  <div className="card-body p-0">
                    <h2 className="card-title text-lg font-normal text-black px-4 pt-4">
                      {object.title}
                    </h2>
                    <p className="text-gray-600 text-sm font-normal px-4 mb-2">
                      <span className="flex items-center gap-1 min-w-0">
                        <span className="truncate min-w-0">{object.address}</span>
                        <span className="text-gray-400">•</span>
                        <span className="flex-shrink-0">{object.area}</span>
                      </span>
                    </p>
                    <div className="card-actions justify-end px-4 pb-2 mt-1">
                      <div className="text-lg font-normal text-black">
                        {object.price}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Пагинация */}
          <div className="flex justify-center pb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#">
                    {t('objects.previous')}
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#">
                    {t('objects.next')}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ObjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div id="preview-container">
      <Header />
      <BurgerMenu />
      <Suspense fallback={<div className="pt-32 text-center">Загрузка...</div>}>
        <ObjectsContent />
      </Suspense>
      </div>
    </div>
  );
}
