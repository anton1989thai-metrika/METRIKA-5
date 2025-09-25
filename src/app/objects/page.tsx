"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

// Данные объектов (статичные данные для демонстрации)
const objectsData = [
  {
    id: 1,
    area: "65 м²",
    floor: "5/9 этаж",
    price: "8 500 000 ₽"
  },
  {
    id: 2,
    title: "Частный дом",
    address: "д. Подмосковная, ул. Садовая, д. 7",
    area: "120 м²",
    floor: "2 этажа",
    material: "Участок 6 соток",
    price: "15 200 000 ₽"
  },
  {
    id: 3,
    title: "Офисное помещение",
    address: "БЦ \"Центр\", офис 301",
    area: "85 м²",
    floor: "3/15 этаж",
    material: "Бетон",
    price: "25 000 000 ₽"
  },
  {
    id: 4,
    title: "1-комнатная квартира",
    address: "ул. Ленина, д. 25, кв. 15",
    area: "45 м²",
    floor: "2/5 этаж",
    material: "Панель",
    price: "6 800 000 ₽"
  },
  {
    id: 5,
    title: "Земельный участок",
    address: "СНТ \"Солнечное\", участок 12",
    area: "8 соток",
    floor: "ИЖС",
    material: "Электричество",
    price: "2 400 000 ₽"
  },
  {
    id: 6,
    title: "3-комнатная квартира",
    address: "пр. Мира, д. 8, кв. 67",
    area: "85 м²",
    floor: "7/12 этаж",
    material: "Монолит",
    price: "12 300 000 ₽"
  },
  {
    id: 7,
    title: "Студия",
    address: "ул. Арбат, д. 12, кв. 3",
    area: "35 м²",
    floor: "1/6 этаж",
    material: "Кирпич",
    price: "9 500 000 ₽"
  },
  {
    id: 8,
    title: "Коттедж",
    address: "пос. Рублево, ул. Лесная, д. 45",
    area: "200 м²",
    floor: "3 этажа",
    material: "Участок 10 соток",
    price: "35 000 000 ₽"
  },
  {
    id: 9,
    title: "Торговое помещение",
    address: "ТЦ \"Мега\", павильон 15",
    area: "120 м²",
    floor: "1 этаж",
    material: "Торговый центр",
    price: "18 500 000 ₽"
  },
  {
    id: 10,
    title: "4-комнатная квартира",
    address: "ул. Красная Площадь, д. 1, кв. 100",
    area: "140 м²",
    floor: "10/15 этаж",
    material: "Монолит",
    price: "45 000 000 ₽"
  },
  {
    id: 11,
    title: "Гараж",
    address: "ул. Промышленная, д. 5, бокс 12",
    area: "18 м²",
    floor: "Подземный",
    material: "Бетон",
    price: "1 200 000 ₽"
  },
  {
    id: 12,
    title: "2-комнатная квартира",
    address: "ул. Садовая, д. 30, кв. 25",
    area: "58 м²",
    floor: "4/9 этаж",
    material: "Панель",
    price: "7 200 000 ₽"
  },
  {
    id: 13,
    title: "Складское помещение",
    address: "ул. Промышленная, д. 15, склад 3",
    area: "500 м²",
    floor: "1 этаж",
    material: "Металлоконструкция",
    price: "22 000 000 ₽"
  },
  {
    id: 14,
    title: "1-комнатная квартира",
    address: "ул. Новая, д. 7, кв. 8",
    area: "42 м²",
    floor: "3/5 этаж",
    material: "Кирпич",
    price: "5 800 000 ₽"
  },
  {
    id: 15,
    title: "Таунхаус",
    address: "пос. Заречный, ул. Центральная, д. 12",
    area: "150 м²",
    floor: "2 этажа",
    material: "Участок 4 сотки",
    price: "28 500 000 ₽"
  },
  {
    id: 16,
    title: "Офис",
    address: "БЦ \"Современный\", офис 505",
    area: "95 м²",
    floor: "5/20 этаж",
    material: "Стекло/бетон",
    price: "32 000 000 ₽"
  },
  {
    id: 17,
    title: "3-комнатная квартира",
    address: "ул. Московская, д. 22, кв. 45",
    area: "78 м²",
    floor: "6/10 этаж",
    material: "Монолит",
    price: "11 500 000 ₽"
  },
  {
    id: 18,
    title: "Земельный участок",
    address: "СНТ \"Ромашка\", участок 8",
    area: "6 соток",
    floor: "ИЖС",
    material: "Газ, электричество",
    price: "1 800 000 ₽"
  },
  {
    id: 19,
    title: "Студия",
    address: "ул. Молодежная, д. 18, кв. 2",
    area: "38 м²",
    floor: "2/4 этаж",
    material: "Панель",
    price: "4 200 000 ₽"
  },
  {
    id: 20,
    title: "Частный дом",
    address: "д. Зеленое, ул. Дачная, д. 3",
    area: "90 м²",
    floor: "1 этаж",
    material: "Участок 8 соток",
    price: "12 800 000 ₽"
  },
  {
    id: 21,
    title: "2-комнатная квартира",
    address: "ул. Парковая, д. 14, кв. 33",
    area: "62 м²",
    floor: "8/12 этаж",
    material: "Кирпич",
    price: "9 100 000 ₽"
  },
  {
    id: 22,
    title: "Производственное помещение",
    address: "ул. Заводская, д. 25, цех 2",
    area: "800 м²",
    floor: "1 этаж",
    material: "Металлоконструкция",
    price: "35 000 000 ₽"
  },
  {
    id: 23,
    title: "1-комнатная квартира",
    address: "ул. Школьная, д. 9, кв. 12",
    area: "48 м²",
    floor: "5/9 этаж",
    material: "Панель",
    price: "6 500 000 ₽"
  },
  {
    id: 24,
    title: "Коттедж",
    address: "пос. Лесной, ул. Сосновая, д. 7",
    area: "180 м²",
    floor: "2 этажа",
    material: "Участок 12 соток",
    price: "42 000 000 ₽"
  },
  {
    id: 25,
    title: "Офисное помещение",
    address: "БЦ \"Деловой\", офис 201",
    area: "75 м²",
    floor: "2/8 этаж",
    material: "Бетон",
    price: "28 500 000 ₽"
  },
  {
    id: 26,
    title: "3-комнатная квартира",
    address: "ул. Весенняя, д. 11, кв. 56",
    area: "82 м²",
    floor: "4/7 этаж",
    material: "Монолит",
    price: "13 200 000 ₽"
  },
  {
    id: 27,
    title: "Гараж",
    address: "ул. Автомобильная, д. 3, бокс 7",
    area: "20 м²",
    floor: "Наземный",
    material: "Кирпич",
    price: "1 500 000 ₽"
  },
  {
    id: 28,
    title: "Студия",
    address: "ул. Студенческая, д. 5, кв. 1",
    area: "32 м²",
    floor: "1/3 этаж",
    material: "Кирпич",
    price: "3 800 000 ₽"
  },
  {
    id: 29,
    title: "Земельный участок",
    address: "СНТ \"Урожай\", участок 25",
    area: "10 соток",
    floor: "ИЖС",
    material: "Все коммуникации",
    price: "3 200 000 ₽"
  },
  {
    id: 30,
    title: "Таунхаус",
    address: "пос. Солнечный, ул. Ясная, д. 9",
    area: "130 м²",
    floor: "2 этажа",
    material: "Участок 5 соток",
    price: "25 000 000 ₽"
  }
];

export default function ObjectsPage() {
  const { t } = useLanguage()

  // Получаем переведенные объекты
  const objects = objectsData.map(obj => ({
    ...obj,
    title: t(`realEstateObjects.${obj.id}.title`),
    address: t(`realEstateObjects.${obj.id}.address`),
    material: t(`realEstateObjects.${obj.id}.material`)
  }))

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('objects.title')}
          </h1>
          
          <div className="flex gap-8">
            {/* Фильтры слева */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-40">
                <h2 className="text-xl font-semibold text-black mb-6">
                  {t('objects.filters')}
                </h2>
                
                {/* Тип недвижимости */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">{t('objects.propertyType')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.apartments')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.houses')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.commercial')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.land')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.nonCapital')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{t('objects.shares')}</span>
                    </label>
                  </div>
                </div>
                
                {/* Цена */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">{t('objects.price')}</h3>
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder={t('objects.priceFrom')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder={t('objects.priceTo')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                {/* Площадь */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">{t('objects.area')}</h3>
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder={t('objects.areaFrom')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder={t('objects.areaTo')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                {/* Район */}
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-3">{t('objects.district')}</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>{t('objects.allDistricts')}</option>
                    <option>{t('objects.central')}</option>
                    <option>{t('objects.northern')}</option>
                    <option>{t('objects.southern')}</option>
                    <option>{t('objects.eastern')}</option>
                    <option>{t('objects.western')}</option>
                  </select>
                </div>
                
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  {t('objects.applyFilters')}
                </button>
                
                <button className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
                  {t('objects.reset')}
                </button>
              </div>
            </div>
            
            {/* Список объектов */}
            <div className="flex-1">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">{t('objects.found')}: {objects.length} {t('objects.objects')}</p>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option>{t('objects.sortBy')}</option>
                  <option>{t('objects.sortByPriceAsc')}</option>
                  <option>{t('objects.sortByPriceDesc')}</option>
                  <option>{t('objects.sortByArea')}</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {objects.map((object) => (
                  <div key={object.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">{t('objects.photo')}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          {object.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {object.address}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500 mb-2">
                          <span>{object.area}</span>
                          <span>{object.floor}</span>
                          <span>{object.material}</span>
                        </div>
                        <p className="text-xl font-bold text-black">
                          {object.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Пагинация */}
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    {t('objects.previous')}
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
                    {t('objects.next')}
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