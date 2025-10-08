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
  operation: 'purchase' | 'sale' | 'rent';
  country: 'russia' | 'china' | 'thailand' | 'south-korea';
}

// Генерируем случайные координаты в пределах Москвы
const generateMoscowCoordinates = (id: number) => {
  // Центр Москвы: 55.7558, 37.6176
  // Примерные границы Москвы: 55.5-55.9, 37.3-37.9
  const lat = 55.5 + (id * 0.013) % 0.4; // Распределяем по широте
  const lng = 37.3 + (id * 0.017) % 0.6; // Распределяем по долготе
  return { lat, lng };
};

export const realEstateObjects: RealEstateObject[] = [
  { id: 1, title: "3-комнатная квартира", address: "ул. Тверская, д. 15", area: "85 м²", floor: "5/9", price: "15 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(1), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 2, title: "Частный дом", address: "ул. Ленина, д. 42", area: "120 м²", floor: "3/5", price: "25 000 000 ₽", material: "Дерево", coordinates: generateMoscowCoordinates(2), type: 'house', operation: 'sale', country: 'russia' },
  { id: 3, title: "2-комнатная квартира", address: "пр. Мира, д. 8", area: "65 м²", floor: "7/12", price: "12 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(3), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 4, title: "3-комнатная квартира", address: "ул. Арбат, д. 25", area: "95 м²", floor: "2/4", price: "18 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(4), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 5, title: "Дом с участком", address: "ул. Садовая, д. 17", area: "110 м²", floor: "8/15", price: "22 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(5), type: 'house', operation: 'sale', country: 'russia' },
  { id: 6, title: "2-комнатная квартира", address: "ул. Красная, д. 12", area: "75 м²", floor: "1/6", price: "14 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(6), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 7, title: "Офисное помещение", address: "ул. Деловая, д. 5", area: "130 м²", floor: "4/8", price: "28 000 000 ₽", material: "Монолит", coordinates: generateMoscowCoordinates(7), type: 'commercial', operation: 'sale', country: 'russia' },
  { id: 8, title: "3-комнатная квартира", address: "ул. Центральная, д. 33", area: "90 м²", floor: "6/10", price: "16 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(8), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 9, title: "Частный дом", address: "ул. Дачная, д. 7", area: "105 м²", floor: "9/14", price: "20 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(9), type: 'house', operation: 'sale', country: 'russia' },
  { id: 10, title: "1-комнатная квартира", address: "ул. Молодежная, д. 20", area: "70 м²", floor: "3/7", price: "13 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(10), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 11, title: "Дом с гаражем", address: "ул. Автомобильная, д. 9", area: "115 м²", floor: "5/11", price: "23 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(11), type: 'house', operation: 'sale', country: 'russia' },
  { id: 12, title: "2-комнатная квартира", address: "ул. Новая, д. 14", area: "80 м²", floor: "2/5", price: "15 500 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(12), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 13, title: "Торговое помещение", address: "ул. Торговая, д. 3", area: "125 м²", floor: "7/13", price: "26 000 000 ₽", material: "Монолит", coordinates: generateMoscowCoordinates(13), type: 'commercial', operation: 'sale', country: 'russia' },
  { id: 14, title: "3-комнатная квартира", address: "ул. Солнечная, д. 18", area: "100 м²", floor: "4/9", price: "19 000 000 ₽", material: "Кирпич", coordinates: generateMoscowCoordinates(14), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 15, title: "Студия", address: "ул. Студенческая, д. 22", area: "85 м²", floor: "1/8", price: "17 000 000 ₽", material: "Панель", coordinates: generateMoscowCoordinates(15), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 16, area: "140 м²", floor: "6/12", price: "30 000 000 ₽", coordinates: generateMoscowCoordinates(16), type: 'house', operation: 'sale', country: 'russia' },
  { id: 17, area: "95 м²", floor: "3/6", price: "18 500 000 ₽", coordinates: generateMoscowCoordinates(17), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 18, area: "110 м²", floor: "8/16", price: "21 000 000 ₽", coordinates: generateMoscowCoordinates(18), type: 'house', operation: 'sale', country: 'russia' },
  { id: 19, area: "75 м²", floor: "2/7", price: "14 500 000 ₽", coordinates: generateMoscowCoordinates(19), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 20, area: "120 м²", floor: "5/10", price: "24 000 000 ₽", coordinates: generateMoscowCoordinates(20), type: 'house', operation: 'sale', country: 'russia' },
  { id: 21, area: "90 м²", floor: "4/8", price: "16 500 000 ₽", coordinates: generateMoscowCoordinates(21), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 22, area: "105 м²", floor: "1/5", price: "20 500 000 ₽", coordinates: generateMoscowCoordinates(22), type: 'house', operation: 'sale', country: 'russia' },
  { id: 23, area: "130 м²", floor: "7/14", price: "27 000 000 ₽", coordinates: generateMoscowCoordinates(23), type: 'commercial', operation: 'sale', country: 'russia' },
  { id: 24, area: "80 м²", floor: "3/9", price: "15 000 000 ₽", coordinates: generateMoscowCoordinates(24), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 25, area: "115 м²", floor: "6/11", price: "22 500 000 ₽", coordinates: generateMoscowCoordinates(25), type: 'house', operation: 'sale', country: 'russia' },
  { id: 26, area: "100 м²", floor: "2/6", price: "19 500 000 ₽", coordinates: generateMoscowCoordinates(26), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 27, area: "85 м²", floor: "5/10", price: "17 500 000 ₽", coordinates: generateMoscowCoordinates(27), type: 'apartment', operation: 'rent', country: 'russia' },
  { id: 28, area: "125 м²", floor: "8/15", price: "25 500 000 ₽", coordinates: generateMoscowCoordinates(28), type: 'house', operation: 'sale', country: 'russia' },
  { id: 29, area: "95 м²", floor: "4/7", price: "18 000 000 ₽", coordinates: generateMoscowCoordinates(29), type: 'apartment', operation: 'sale', country: 'russia' },
  { id: 30, area: "110 м²", floor: "1/12", price: "21 500 000 ₽", coordinates: generateMoscowCoordinates(30), type: 'house', operation: 'sale', country: 'russia' },
  { id: 31, area: "85 м²", floor: "3/8", price: "15 000 000 ₽", coordinates: generateMoscowCoordinates(31), type: 'apartment', operation: 'sale', country: 'china' },
  { id: 32, area: "120 м²", floor: "5/10", price: "18 000 000 ₽", coordinates: generateMoscowCoordinates(32), type: 'house', operation: 'rent', country: 'thailand' },
  { id: 33, area: "95 м²", floor: "2/6", price: "16 500 000 ₽", coordinates: generateMoscowCoordinates(33), type: 'apartment', operation: 'sale', country: 'south-korea' },
  { id: 34, area: "105 м²", floor: "4/9", price: "17 500 000 ₽", coordinates: generateMoscowCoordinates(34), type: 'house', operation: 'sale', country: 'china' },
  { id: 35, area: "90 м²", floor: "1/7", price: "14 000 000 ₽", coordinates: generateMoscowCoordinates(35), type: 'apartment', operation: 'rent', country: 'thailand' },
  { id: 36, area: "200 м²", floor: "2/2", price: "35 000 000 ₽", coordinates: generateMoscowCoordinates(36), type: 'building', operation: 'sale', country: 'russia' },
  { id: 37, area: "500 м²", floor: "0/0", price: "8 000 000 ₽", coordinates: generateMoscowCoordinates(37), type: 'land', operation: 'sale', country: 'russia' },
  { id: 38, area: "150 м²", floor: "1/3", price: "25 000 000 ₽", coordinates: generateMoscowCoordinates(38), type: 'commercial', operation: 'rent', country: 'china' },
  { id: 39, area: "80 м²", floor: "0/0", price: "12 000 000 ₽", coordinates: generateMoscowCoordinates(39), type: 'nonCapital', operation: 'sale', country: 'russia' },
  { id: 40, area: "1/3", floor: "0/0", price: "5 000 000 ₽", coordinates: generateMoscowCoordinates(40), type: 'shares', operation: 'sale', country: 'russia' }
];
