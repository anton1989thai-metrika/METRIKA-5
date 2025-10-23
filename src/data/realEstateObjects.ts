// Данные объектов недвижимости с координатами для карты
export interface RealEstateObject {
  id: number;
  title: string;
  address: string;
  area: string;
  floor: string;
  price: string;
  material: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'apartment' | 'house' | 'land' | 'commercial' | 'building' | 'nonCapital' | 'shares';
  operation: 'sale' | 'rent';
  country: 'russia' | 'china' | 'thailand' | 'south-korea';
  
  // 👇 Новое поле для сохранения выбранных категорий и значений
  fields?: Record<string, string | number | null>;
}

// Генерируем случайные координаты в пределах Москвы
const generateMoscowCoordinates = (id: number) => {
  // Центр Москвы: 55.7558, 37.6176
  // Примерные границы Москвы: 55.5-55.9, 37.3-37.9
  const lat = 55.5 + (Math.random() * 0.4);
  const lng = 37.3 + (Math.random() * 0.6);
  return { lat, lng };
};

export const realEstateObjects: RealEstateObject[] = [
  { id: 1, title: "3-комнатная квартира", address: "ул. Тверская, д. 15", area: "85 м²", floor: "5/9", price: "15 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(1), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 2, title: "Частный дом", address: "д. Подмосковная, ул. Садовая, д. 7, корпус А, подъезд 3, квартира 45", area: "120 м²", floor: "3/5", price: "25 000 000 ₽", material: "Дерево", coordinates: generateMoscowCoordinates(2), type: 'house', operation: 'sale', country: 'russia', fields: { roomCount: "3", repair: "Хороший", facade: "Деревянный", balcony: "Да", parking: "Подземная", internet: "Оптоволокно", heatingType: "Газовое", hotWater: "Централизованная" } },
  { id: 3, title: "2-комнатная квартира", address: "пр. Мира, д. 8", area: "65 м²", floor: "7/12", price: "12 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(3), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 4, title: "3-комнатная квартира", address: "ул. Арбат, д. 25", area: "95 м²", floor: "2/4", price: "18 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(4), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 5, title: "Дом с участком", address: "ул. Садовая, д. 17", area: "110 м²", floor: "8/15", price: "22 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(5), type: 'house', operation: 'sale', country: 'russia' },
  { id: 6, title: "2-комнатная квартира", address: "ул. Красная, д. 12", area: "75 м²", floor: "1/6", price: "14 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(6), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 7, title: "Офисное помещение", address: "ул. Деловая, д. 5", area: "130 м²", floor: "4/8", price: "28 000 000 ₽", material: "Монолит", coordinates: generateMoscowCoordinates(7), type: 'commercial', operation: 'sale', country: 'russia' },
  { id: 8, title: "1-комнатная квартира", address: "ул. Студенческая, д. 10", area: "45 м²", floor: "3/5", price: "9 500 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(8), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 9, title: "Частный дом", address: "ул. Дачная, д. 7", area: "105 м²", floor: "9/14", price: "20 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(9), type: 'house', operation: 'sale', country: 'russia' },
  { id: 10, title: "1-комнатная квартира", address: "ул. Молодежная, д. 20", area: "70 м²", floor: "3/7", price: "13 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(10), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 11, title: "Дом с гаражем", address: "ул. Автомобильная, д. 9", area: "115 м²", floor: "5/11", price: "23 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(11), type: 'house', operation: 'sale', country: 'russia' },
  { id: 12, title: "2-комнатная квартира", address: "ул. Новая, д. 14", area: "80 м²", floor: "2/5", price: "15 500 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(12), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 13, title: "Торговое помещение", address: "ул. Торговая, д. 3", area: "125 м²", floor: "7/13", price: "26 000 000 ₽", material: "Монолит", coordinates: generateMoscowCoordinates(13), type: 'commercial', operation: 'sale', country: 'russia' },
  { id: 14, title: "3-комнатная квартира", address: "ул. Солнечная, д. 18", area: "100 м²", floor: "4/9", price: "19 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(14), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 15, title: "Студия", address: "ул. Студенческая, д. 22", area: "85 м²", floor: "1/8", price: "17 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(15), type: 'apartment', operation: 'rent', country: 'russia' }
];