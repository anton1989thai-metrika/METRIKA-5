"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('about.title')} {t('header.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                {t('about.mission')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('about.description')} — это современное агентство недвижимости, которое помогает 
                клиентам найти идеальное жилье или коммерческое помещение. Мы 
                специализируемся на всех типах недвижимости и предоставляем 
                полный спектр услуг в сфере недвижимости.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-3">
                  Наши услуги
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Продажа и покупка недвижимости</li>
                  <li>• Аренда жилых и коммерческих помещений</li>
                  <li>• Оценка недвижимости</li>
                  <li>• Консультации по недвижимости</li>
                  <li>• Юридическое сопровождение сделок</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-3">
                  {t('about.values')}
                </h3>
                <ul className="text-gray-700 space-y-2">
                  {t('about.valuesList').map((value: string, index: number) => (
                    <li key={index}>• {value}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-black mb-4">
                {t('contacts.title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-black mb-2">{t('contacts.phone')}:</h4>
                  <p className="text-gray-700">+7 (XXX) XXX-XX-XX</p>
                  
                  <h4 className="font-semibold text-black mb-2 mt-4">{t('contacts.email')}:</h4>
                  <p className="text-gray-700">info@metrika.ru</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-black mb-2">{t('contacts.address')}:</h4>
                  <p className="text-gray-700">
                    {t('contacts.officeAddress')}
                  </p>
                  
                  <h4 className="font-semibold text-black mb-2 mt-4">{t('contacts.workingHours')}:</h4>
                  <p className="text-gray-700">
                    {t('contacts.workingHoursText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
