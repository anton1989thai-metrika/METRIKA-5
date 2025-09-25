import BurgerMenu from "@/components/BurgerMenu";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              МЕТРИКА
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Агентство недвижимости
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Добро пожаловать в портал агентства недвижимости МЕТРИКА. 
              Здесь вы найдете все необходимое для работы с недвижимостью.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Объекты недвижимости
              </h3>
              <p className="text-gray-600">
                Просматривайте и управляйте объектами недвижимости
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Интерактивная карта
              </h3>
              <p className="text-gray-600">
                Изучайте объекты на карте города
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                База знаний
              </h3>
              <p className="text-gray-600">
                Получайте доступ к экспертной информации
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-500">
              Используйте меню слева для навигации по порталу
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
