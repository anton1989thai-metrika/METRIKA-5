"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('contacts.title')}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                {t('contacts.description')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-1">{t('contacts.phone')}:</h3>
                  <p className="text-gray-700">+7 (495) 123-45-67</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-black mb-1">{t('contacts.email')}:</h3>
                  <p className="text-gray-700">info@metrika.ru</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-black mb-1">WhatsApp:</h3>
                  <p className="text-gray-700">+7 (495) 123-45-67</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-black mb-1">Telegram:</h3>
                  <p className="text-gray-700">@metrika_realty</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                {t('contacts.office')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-1">{t('contacts.address')}:</h3>
                  <p className="text-gray-700">
                    {t('contacts.officeAddress')}<br />
                    БЦ &quot;Метрика&quot;, офис 201
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-black mb-1">{t('contacts.workingHours')}:</h3>
                  <p className="text-gray-700">
                    {t('contacts.workingHoursText')}<br />
                    Вс: выходной
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-black mb-1">Метро:</h3>
                  <p className="text-gray-700">
                    Тверская, Пушкинская<br />
                    (5 минут пешком)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-gray-600">
                Здесь будет интерактивная карта с расположением офиса
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
