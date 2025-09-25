"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MapPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('map.title')}
          </h1>
          
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-lg text-gray-600">
                {t('map.description')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Интеграция с картографическими сервисами
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                {t('map.filters')} - {t('objects.propertyType')}
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• {t('map.apartments')}</li>
                <li>• {t('map.houses')}</li>
                <li>• {t('map.commercial')}</li>
                <li>• {t('map.land')}</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                {t('map.filters')} - {t('objects.price')}
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• До 3 млн руб.</li>
                <li>• 3-10 млн руб.</li>
                <li>• 10-30 млн руб.</li>
                <li>• Свыше 30 млн руб.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
