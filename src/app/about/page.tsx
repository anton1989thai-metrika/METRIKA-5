import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            О компании МЕТРИКА
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Наша миссия
              </h2>
              <p className="text-gray-700 leading-relaxed">
                МЕТРИКА — это современное агентство недвижимости, которое помогает 
                клиентам найти идеальное жилье или коммерческое помещение. Мы 
                специализируемся на всех типах недвижимости и предоставляем 
                полный спектр услуг в сфере недвижимости.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
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
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-black mb-3">
                  Наши преимущества
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Профессиональная команда</li>
                  <li>• Большая база объектов</li>
                  <li>• Прозрачные условия работы</li>
                  <li>• Современные технологии</li>
                  <li>• Индивидуальный подход</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Контактная информация
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-black mb-2">Телефон:</h4>
                  <p className="text-gray-700">+7 (XXX) XXX-XX-XX</p>
                  
                  <h4 className="font-semibold text-black mb-2 mt-4">Email:</h4>
                  <p className="text-gray-700">info@metrika.ru</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-black mb-2">Адрес:</h4>
                  <p className="text-gray-700">
                    г. Москва, ул. Примерная, д. 123
                  </p>
                  
                  <h4 className="font-semibold text-black mb-2 mt-4">Режим работы:</h4>
                  <p className="text-gray-700">
                    Пн-Пт: 9:00 - 18:00<br />
                    Сб: 10:00 - 16:00
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
