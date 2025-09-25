import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";

export default function ObjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Объекты недвижимости
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Квартиры
              </h3>
              <p className="text-gray-600 mb-4">
                Квартиры в новостройках и на вторичном рынке
              </p>
              <div className="text-sm text-gray-500">
                Доступно: 150+ объектов
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Дома с участками
              </h3>
              <p className="text-gray-600 mb-4">
                Частные дома и коттеджи с земельными участками
              </p>
              <div className="text-sm text-gray-500">
                Доступно: 80+ объектов
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Коммерческая недвижимость
              </h3>
              <p className="text-gray-600 mb-4">
                Офисы, магазины, склады и производственные помещения
              </p>
              <div className="text-sm text-gray-500">
                Доступно: 45+ объектов
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Земельные участки
              </h3>
              <p className="text-gray-600 mb-4">
                Участки под ИЖС, коммерческое и сельскохозяйственное использование
              </p>
              <div className="text-sm text-gray-500">
                Доступно: 120+ объектов
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Некапитальные объекты
              </h3>
              <p className="text-gray-600 mb-4">
                Гаражи, парковочные места, кладовые
              </p>
              <div className="text-sm text-gray-500">
                Доступно: 200+ объектов
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Доли в недвижимости
              </h3>
              <p className="text-gray-600 mb-4">
                Доли в квартирах, домах и коммерческих объектах
              </p>
              <div className="text-sm text-gray-500">
                Доступно: 30+ объектов
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
