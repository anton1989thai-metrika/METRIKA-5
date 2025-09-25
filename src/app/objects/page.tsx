import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";

export default function ObjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Объекты недвижимости
          </h1>
          
          <div className="flex gap-8">
            {/* Фильтры слева */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-40">
                <h2 className="text-xl font-semibold text-black mb-6">
                  Фильтры
                </h2>
                
                {/* Тип недвижимости */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">Тип недвижимости</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Квартиры</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Дома с участками</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Коммерческая</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Земельные участки</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Некапитальные</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Доли</span>
                    </label>
                  </div>
                </div>
                
                {/* Цена */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">Цена</h3>
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder="От" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="До" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                {/* Площадь */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">Площадь (м²)</h3>
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder="От" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="До" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                {/* Район */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">Район</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Все районы</option>
                    <option>Центральный</option>
                    <option>Северный</option>
                    <option>Южный</option>
                    <option>Восточный</option>
                    <option>Западный</option>
                  </select>
                </div>
                
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Применить фильтры
                </button>
                
                <button className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
                  Сбросить
                </button>
              </div>
            </div>
            
            {/* Список объектов */}
            <div className="flex-1">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">Найдено: 156 объектов</p>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option>По дате добавления</option>
                  <option>По цене (возрастание)</option>
                  <option>По цене (убывание)</option>
                  <option>По площади</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {/* Объект 1 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">Фото</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">
                        2-комнатная квартира
                      </h3>
                      <p className="text-gray-600 mb-2">
                        ул. Тверская, д. 15, кв. 42
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>65 м²</span>
                        <span>5/9 этаж</span>
                        <span>Кирпич</span>
                      </div>
                      <p className="text-xl font-bold text-black">
                        8 500 000 ₽
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Объект 2 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">Фото</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Частный дом
                      </h3>
                      <p className="text-gray-600 mb-2">
                        д. Подмосковная, ул. Садовая, д. 7
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>120 м²</span>
                        <span>2 этажа</span>
                        <span>Участок 6 соток</span>
                      </div>
                      <p className="text-xl font-bold text-black">
                        15 200 000 ₽
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Объект 3 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">Фото</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Офисное помещение
                      </h3>
                      <p className="text-gray-600 mb-2">
                        БЦ &quot;Центр&quot;, офис 301
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>85 м²</span>
                        <span>3/15 этаж</span>
                        <span>Бетон</span>
                      </div>
                      <p className="text-xl font-bold text-black">
                        25 000 000 ₽
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Объект 4 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">Фото</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">
                        1-комнатная квартира
                      </h3>
                      <p className="text-gray-600 mb-2">
                        ул. Ленина, д. 25, кв. 15
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>45 м²</span>
                        <span>2/5 этаж</span>
                        <span>Панель</span>
                      </div>
                      <p className="text-xl font-bold text-black">
                        6 800 000 ₽
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Объект 5 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">Фото</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Земельный участок
                      </h3>
                      <p className="text-gray-600 mb-2">
                        СНТ &quot;Солнечное&quot;, участок 12
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>8 соток</span>
                        <span>ИЖС</span>
                        <span>Электричество</span>
                      </div>
                      <p className="text-xl font-bold text-black">
                        2 400 000 ₽
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Пагинация */}
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Назад
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md">
                    1
                  </button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    2
                  </button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    3
                  </button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Далее
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}