"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { RealEstateObject } from "@/data/realEstateObjects";

interface VisibleObjectsListProps {
  objects: RealEstateObject[];
}

export default function VisibleObjectsList({ objects }: VisibleObjectsListProps) {
  const { t } = useLanguage();

  if (objects.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          {t('map.visibleObjects')}
        </h3>
        <p className="text-gray-500 text-center py-8">
          {t('map.noVisibleObjects')}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-black mb-4">
        {t('map.visibleObjects')} {objects.length}
      </h3>
      
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-2">
        {objects.map((object) => (
          <div key={object.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center mb-3">
              <span className="text-gray-500 text-sm">{t('objects.photo')}</span>
            </div>
            
            <h4 className="font-semibold text-black text-sm mb-2 line-clamp-2">
              {object.title || `Объект ${object.id}`}
            </h4>
            
            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
              {object.address || 'Адрес не указан'}
            </p>
            
            <div className="space-y-1 text-xs text-gray-500 mb-2">
              <div>{object.area}</div>
              <div>{object.floor}</div>
              <div>{object.material || 'Материал не указан'}</div>
            </div>
            
            <p className="text-sm font-bold text-black mb-2">
              {object.price}
            </p>
            
            <button 
              className="w-full px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              onClick={() => window.open('/objects', '_blank')}
            >
              {t('objects.details')}
            </button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
