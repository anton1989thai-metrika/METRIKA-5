"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import MapFilters from "@/components/MapFilters";
import VisibleObjectsList from "@/components/VisibleObjectsList";
import YandexMap from "@/components/YandexMap";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilters } from "@/contexts/FiltersContext";
import { realEstateObjects, RealEstateObject } from "@/data/realEstateObjects";
import { useState, useMemo } from "react";

export default function MapPage() {
  const { t } = useLanguage();
  const { filters } = useFilters();
  const [visibleObjects, setVisibleObjects] = useState<RealEstateObject[]>([]);

  // Фильтрация объектов
  const filteredObjects = useMemo(() => {
    return realEstateObjects.filter(obj => {
      // Фильтр по стране
      if (filters.country && obj.country !== filters.country) {
        return false
      }
      
      // Фильтр по типу недвижимости
      if (filters.propertyType && obj.type !== filters.propertyType) {
        return false
      }
      
      // Здесь можно добавить другие фильтры
      
      return true
    });
  }, [filters]);

  const handleVisibleObjectsChange = (objects: RealEstateObject[]) => {
    setVisibleObjects(objects);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      <main className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('map.title')}
          </h1>
          
          <div className="flex gap-8">
            {/* Фильтры слева */}
            <MapFilters />
            
            {/* Карта и объекты справа */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-600">
                Показано: {filteredObjects.length} из {realEstateObjects.length} объектов
                {(filters.country || filters.propertyType || filters.areaUnit !== 'm2') && (
                  <span className="ml-2 text-blue-600">
                    (фильтр: {[
                      filters.country && (filters.country === 'russia' ? 'Россия' : 
                                         filters.country === 'china' ? 'Китай' : 
                                         filters.country === 'thailand' ? 'Таиланд' : 
                                         filters.country === 'south-korea' ? 'Южная Корея' : filters.country),
                      filters.propertyType && (filters.propertyType === 'apartment' ? 'Квартира' :
                                               filters.propertyType === 'house' ? 'Жилой дом' :
                                               filters.propertyType === 'land' ? 'Земельный участок' :
                                               filters.propertyType === 'commercial' ? 'Коммерческое помещение' :
                                               filters.propertyType === 'building' ? 'Здание' :
                                               filters.propertyType === 'nonCapital' ? 'Некопитальный объект' :
                                               filters.propertyType === 'shares' ? 'Доля в праве' : filters.propertyType),
                      filters.areaUnit !== 'm2' && (filters.areaUnit === 'hectare' ? 'Гектар' : 
                                                    filters.areaUnit === 'sotka' ? 'Сотки' : 
                                                    filters.areaUnit === 'mu' ? '亩' : 
                                                    filters.areaUnit === 'wah2' ? 'Wah²' : 
                                                    filters.areaUnit === 'ngan' ? 'Ngan' : 
                                                    filters.areaUnit === 'rai' ? 'Rai' : 
                                                    filters.areaUnit === 'pyeong' ? '평' : filters.areaUnit)
                    ].filter(Boolean).join(', ')})
                  </span>
                )}
              </div>
              <YandexMap 
                objects={filteredObjects} 
                onVisibleObjectsChange={handleVisibleObjectsChange}
              />
              
              <VisibleObjectsList objects={visibleObjects} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}