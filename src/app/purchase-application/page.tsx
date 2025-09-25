"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PurchaseApplicationPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('purchaseApplication.title')}
          </h1>
          
          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">
              {t('purchaseApplication.description')}
            </h2>
            <p className="text-gray-700 mb-6">
              {t('purchaseApplication.instructions')}
            </p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('purchaseApplication.fullName')}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder={t('purchaseApplication.fullNamePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('purchaseApplication.phone')}
                  </label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder={t('purchaseApplication.phonePlaceholder')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('purchaseApplication.email')}
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder={t('purchaseApplication.emailPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('purchaseApplication.propertyType')}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-black">
                  <option>{t('purchaseApplication.selectPropertyType')}</option>
                  <option>{t('objects.apartments')}</option>
                  <option>{t('objects.houses')}</option>
                  <option>{t('objects.commercial')}</option>
                  <option>{t('objects.land')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('purchaseApplication.budget')}
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder={t('purchaseApplication.budgetPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('purchaseApplication.preferredLocation')}
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder={t('purchaseApplication.preferredLocationPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('purchaseApplication.additionalInfo')}
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder={t('purchaseApplication.additionalInfoPlaceholder')}
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('purchaseApplication.submit')}
                </button>
                
                <button 
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  {t('purchaseApplication.cancel')}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-2">
              {t('purchaseApplication.contactInfo')}
            </h3>
            <p className="text-gray-700 mb-2">
              {t('contacts.phone')}: +7 (495) 123-45-67
            </p>
            <p className="text-gray-700">
              {t('contacts.email')}: info@metrika.ru
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
