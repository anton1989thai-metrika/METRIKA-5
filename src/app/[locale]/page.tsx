import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 mb-8">
              {t('home.welcome')}
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('home.useMenu')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                {t('home.realEstateObjects')}
              </h3>
              <p className="text-gray-600">
                {t('home.realEstateObjectsDesc')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                {t('home.interactiveMap')}
              </h3>
              <p className="text-gray-600">
                {t('home.interactiveMapDesc')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                {t('home.knowledgeBase')}
              </h3>
              <p className="text-gray-600">
                {t('home.knowledgeBaseDesc')}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-500">
              {t('home.useMenu')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
