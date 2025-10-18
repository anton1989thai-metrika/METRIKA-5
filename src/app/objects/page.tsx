"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { realEstateObjects, RealEstateObject } from "@/data/realEstateObjects";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
                      {(() => {
                        const fullText = `${object.address} • ${object.area}`;
                        
                        // Создаем временный элемент для измерения ширины текста
                        const measureElement = document.createElement('span');
                        measureElement.style.visibility = 'hidden';
                        measureElement.style.position = 'absolute';
                        measureElement.style.fontSize = '14px'; // text-sm
                        measureElement.style.fontFamily = 'inherit';
                        measureElement.textContent = fullText;
                        document.body.appendChild(measureElement);
                        
                        const fullWidth = measureElement.offsetWidth;
                        const availableWidth = 280 - 32; // ширина карточки минус padding (px-4 = 16px с каждой стороны)
                        
                        document.body.removeChild(measureElement);
                        
                        if (fullWidth <= availableWidth) {
                          return fullText;
                        }
                        
                        // Если не помещается, обрезаем адрес
                        const areaText = ` ${object.area}`;
                        const ellipsisText = '...';
                        const areaWidth = (() => {
                          const areaElement = document.createElement('span');
                          areaElement.style.visibility = 'hidden';
                          areaElement.style.position = 'absolute';
                          areaElement.style.fontSize = '14px';
                          areaElement.style.fontFamily = 'inherit';
                          areaElement.textContent = areaText;
                          document.body.appendChild(areaElement);
                          const width = areaElement.offsetWidth;
                          document.body.removeChild(areaElement);
                          return width;
                        })();
                        
                        const ellipsisWidth = (() => {
                          const ellipsisElement = document.createElement('span');
                          ellipsisElement.style.visibility = 'hidden';
                          ellipsisElement.style.position = 'absolute';
                          ellipsisElement.style.fontSize = '14px';
                          ellipsisElement.style.fontFamily = 'inherit';
                          ellipsisElement.textContent = ellipsisText;
                          document.body.appendChild(ellipsisElement);
                          const width = ellipsisElement.offsetWidth;
                          document.body.removeChild(ellipsisElement);
                          return width;
                        })();
                        
                        const availableForAddress = availableWidth - areaWidth - ellipsisWidth;
                        
                        // Бинарный поиск для точной обрезки адреса
                        let left = 0;
                        let right = object.address.length;
                        let bestLength = 0;
                        
                        while (left <= right) {
                          const mid = Math.floor((left + right) / 2);
                          const testAddress = object.address.substring(0, mid);
                          
                          const testElement = document.createElement('span');
                          testElement.style.visibility = 'hidden';
                          testElement.style.position = 'absolute';
                          testElement.style.fontSize = '14px';
                          testElement.style.fontFamily = 'inherit';
                          testElement.textContent = testAddress;
                          document.body.appendChild(testElement);
                          const testWidth = testElement.offsetWidth;
                          document.body.removeChild(testElement);
                          
                          if (testWidth <= availableForAddress) {
                            bestLength = mid;
                            left = mid + 1;
                          } else {
                            right = mid - 1;
                          }
                        }
                        
                        const truncatedAddress = object.address.substring(0, bestLength);
                        return `${truncatedAddress}${ellipsisText}${areaText}`;
                      })()}
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
    </div>
  );
}