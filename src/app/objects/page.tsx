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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {filteredObjects.map((object) => (
              <Card key={object.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/objects/${object.id}`}>
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{t('objects.photo')}</span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg font-normal text-black line-clamp-2 flex-1">
                        {object.title}
                      </CardTitle>
                      <Badge 
                        variant={object.operation === 'sale' ? 'default' : 'secondary'}
                        className="ml-2 text-xs"
                      >
                        {object.operation === 'sale' ? 'Продажа' : 'Аренда'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm font-normal mb-3 truncate">
                      {object.address} • {object.area}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-black">
                        {object.price}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
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