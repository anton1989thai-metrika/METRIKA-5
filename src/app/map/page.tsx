"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
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

  // Фильтрация объектов - используем ту же логику, что и на странице объектов
  const filteredObjects = useMemo(() => {
    return realEstateObjects.filter(obj => {
      // Фильтр по стране (множественный выбор)
      if (filters.country && filters.country.length > 0 && !filters.country.includes(obj.country)) {
        return false
      }
      
      // Фильтр по типу недвижимости (множественный выбор)
      if (filters.propertyType && filters.propertyType.length > 0 && !filters.propertyType.includes(obj.type)) {
        return false
      }
      
      // Фильтр по типу операции (множественный выбор)
      if (filters.operationType && filters.operationType.length > 0 && !filters.operationType.includes(obj.operation)) {
        return false
      }
      
      // Здесь можно добавить другие фильтры из HeaderFilters
      
      return true
    });
  }, [filters]);

  const handleVisibleObjectsChange = (objects: RealEstateObject[]) => {
    setVisibleObjects(objects);
  };

  return (
    <div className="min-h-screen bg-white">
      <div id="preview-container">
      <Header />
      <BurgerMenu />
      
      <main className="pt-[166px] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Карточки объектов слева */}
            <div className="w-80 flex-shrink-0">
              <VisibleObjectsList objects={visibleObjects} />
            </div>
            
            {/* Карта справа */}
            <div className="flex-1">
              <YandexMap 
                objects={filteredObjects} 
                onVisibleObjectsChange={handleVisibleObjectsChange}
              />
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}