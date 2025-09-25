"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { t } = useLanguage()
  const router = useRouter()

  const handlePurchaseClick = () => {
    router.push('/purchase-application')
  }

  const handleSaleClick = () => {
    router.push('/objects')
  }

  const handleRentClick = () => {
    router.push('/objects?filter=rent')
  }

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

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <button 
              onClick={handlePurchaseClick}
              className="button-dark-bg hover:opacity-90 text-white p-8 rounded-lg transition-all text-center shadow-md border border-gray-300"
            >
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                {t('objects.purchase')}
              </h3>
              <p className="text-gray-200 relative z-10">
                {t('home.purchaseDesc')}
              </p>
            </button>
            
            <button 
              onClick={handleSaleClick}
              className="button-dark-bg hover:opacity-90 text-white p-8 rounded-lg transition-all text-center shadow-md border border-gray-300"
            >
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                {t('objects.sale')}
              </h3>
              <p className="text-gray-200 relative z-10">
                {t('home.saleDesc')}
              </p>
            </button>
            
            <button 
              onClick={handleRentClick}
              className="button-dark-bg hover:opacity-90 text-white p-8 rounded-lg transition-all text-center shadow-md border border-gray-300"
            >
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                {t('objects.rent')}
              </h3>
              <p className="text-gray-200 relative z-10">
                {t('home.rentDesc')}
              </p>
            </button>
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
