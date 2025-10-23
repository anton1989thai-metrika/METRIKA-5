"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import BurgerMenu from "@/components/BurgerMenu"
import { useLanguage } from "@/contexts/LanguageContext"
import { realEstateObjects, RealEstateObject } from "@/data/realEstateObjects"
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PropertyHeader } from "@/components/PropertyHeader"
import { PropertyGallery } from "@/components/PropertyGallery"
import { PropertyDetails } from "@/components/PropertyDetails"
import { InfrastructureSection } from "@/components/InfrastructureSection"
import { LocationSection } from "@/components/LocationSection"
import { CATEGORY_LABELS } from '@/data/categoryLabels';

export default function ObjectDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [object, setObject] = useState<RealEstateObject | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      const foundObject = realEstateObjects.find(obj => obj.id === parseInt(params.id as string))
      setObject(foundObject || null)
    }
  }, [params.id])

  if (!object) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BurgerMenu />
        <main className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Объект не найден</h1>
              <p className="text-gray-600">Запрашиваемый объект недвижимости не существует</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const images = [
    "/images/object-1.jpg",
    "/images/object-2.jpg", 
    "/images/object-3.jpg",
    "/images/object-4.jpg",
    "/images/object-5.jpg"
  ]

  // Обработчики событий
  const handleCall = () => {
    console.log('Звонок по номеру:', object.id)
  }

  const handleMessage = () => {
    console.log('Отправка сообщения для объекта:', object.id)
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    console.log('Избранное:', !isFavorite)
  }

  const handleShare = () => {
    console.log('Поделиться объектом:', object.id)
  }

  const handleRequestViewing = () => {
    console.log('Запрос просмотра объекта:', object.id)
  }

  const handleExportPDF = () => {
    console.log('Экспорт в PDF объекта:', object.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Хлебные крошки */}
          <div className="py-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Главная</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/objects">Объекты</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{object.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Левая колонка - Информация об объекте */}
            <div className="space-y-6">
              {/* Заголовок и действия */}
              <PropertyHeader
                title={object.title}
                address={object.address}
                price={object.price}
                views={127}
                favorites={23}
                isFavorite={isFavorite}
                onCall={handleCall}
                onMessage={handleMessage}
                onFavorite={handleFavorite}
                onShare={handleShare}
                onRequestViewing={handleRequestViewing}
                onExportPDF={handleExportPDF}
              />

              {/* Характеристики */}
              <PropertyDetails
                area={object.area}
                floor={object.floor}
                material={object.material}
                yearBuilt="2018"
                rooms="3"
                bathrooms="2"
                balcony="Да"
                parking="Подземная"
                dynamicFields={object.fields}
              />

              {/* Инфраструктура */}
              <InfrastructureSection
                internet="Оптоволокно"
                accessRoads="Асфальт"
                concierge="Круглосуточно"
              />
            </div>

            {/* Правая колонка - Галерея и карта */}
            <div className="space-y-6">
              {/* Галерея фотографий */}
              <PropertyGallery
                images={images}
                title={object.title}
              />

              {/* Расположение */}
              <LocationSection
                address={object.address}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}