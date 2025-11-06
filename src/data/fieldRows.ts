import { FieldRow } from '@/types/realEstateForm';

// Данные полей из таблицы CSV
export const FIELD_ROWS: FieldRow[] = [
  {
    id: 1,
    category: "Тип помещения",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "penthouse", name: "Пентхаус" },
      { id: "apartments", name: "Апартаменты" },
      { id: "guest_room", name: "Гостинка" },
      { id: "room", name: "Комната" },
      { id: "townhouse", name: "Таунхаус" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 2,
    category: "Комнат",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 3,
    category: "Спален",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 4,
    category: "Санузлов",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 5,
    category: "Высота потолков",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    autoUnit: "м"
  },
  {
    id: 6,
    category: "Планировка",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "studio", name: "Студия" },
      { id: "separate", name: "Раздельные комнаты" },
      { id: "free", name: "Свободная планировка" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 7,
    category: "Ремонт",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "no_finish", name: "Без отделки" },
      { id: "in_repair", name: "В состоянии ремонта" },
      { id: "budget", name: "Бюджетный" },
      { id: "basic", name: "Базовая отделка" },
      { id: "modern", name: "Современный" },
      { id: "designer", name: "Дизайнерский" }
    ]
  },
  {
    id: 8,
    category: "Дата завершения ремонта",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Доля в праве"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    validation: {
      pattern: "\\d{2}\\.\\d{2}\\.\\d{4}",
      required: false
    }
  },
  {
    id: 9,
    category: "Сторона окон",
    control: "MultiSelect",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "north", name: "Север" },
      { id: "northeast", name: "Северо-восток" },
      { id: "east", name: "Восток" },
      { id: "southeast", name: "Юго-восток" },
      { id: "south", name: "Юг" },
      { id: "southwest", name: "Юго-запад" },
      { id: "west", name: "Запад" },
      { id: "northwest", name: "Северо-запад" }
    ]
  },
  {
    id: 10,
    category: "Вид из окон",
    control: "MultiSelect",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "sea", name: "На море" },
      { id: "mountains", name: "На горы" },
      { id: "city", name: "На город" },
      { id: "water", name: "На озеро или реку" },
      { id: "yard", name: "Во двор" }
    ]
  },
  {
    id: 11,
    category: "Лифт",
    control: "Select",
    objectTypes: ["Квартира", "Коммерческое помещение", "Здание", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "cargo", name: "Грузовой" },
      { id: "passenger", name: "Пассажирский" },
      { id: "none", name: "Нет" }
    ]
  },
  {
    id: 12,
    category: "Фасад",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "ventilated", name: "Вентилируемый" },
      { id: "plaster", name: "Штукатурный" },
      { id: "brick", name: "Кирпичный" },
      { id: "siding", name: "Сайдинговый" },
      { id: "wood", name: "Деревянный" },
      { id: "fiber_cement", name: "Фиброцементный" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 13,
    category: "Готовность объекта",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Доля в праве"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "construction", name: "Строящийся" },
      { id: "built", name: "Построен" }
    ]
  },
  {
    id: 14,
    category: "Тип дома",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом", "Здание", "Доля в праве"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "panel", name: "Панельный" },
      { id: "brick", name: "Кирпичный" },
      { id: "monolithic", name: "Монолитный" },
      { id: "block", name: "Блочный" },
      { id: "wood", name: "Деревянный" },
      { id: "combined", name: "Комбинированный" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 15,
    category: "Тип фундамента",
    control: "Select+Input",
    objectTypes: ["Частный дом"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "strip", name: "Ленточный" },
      { id: "pile", name: "Свайный" },
      { id: "monolithic", name: "Монолитный" },
      { id: "slab", name: "Плитный" },
      { id: "none", name: "Нет" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 16,
    category: "Год постройки здания",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    validation: {
      pattern: "\\d{4}",
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  {
    id: 17,
    category: "Этажность здания",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    validation: {
      pattern: "\\d+",
      min: 1,
      max: 200
    }
  },
  {
    id: 18,
    category: "Количество квартир в доме",
    control: "Input",
    objectTypes: ["Квартира"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    validation: {
      pattern: "\\d+",
      min: 1
    }
  },
  {
    id: 19,
    category: "Этаж квартиры / помещения",
    control: "Input",
    objectTypes: ["Квартира", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    validation: {
      pattern: "\\d+",
      min: 1
    }
  },
  {
    id: 20,
    category: "Подвал",
    control: "Select",
    objectTypes: ["Частный дом"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 21,
    category: "Мансарда",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 22,
    category: "Дополнительные постройки",
    control: "MultiSelect+Input",
    objectTypes: ["Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "guest_house", name: "Гостевой дом" },
      { id: "garage", name: "Гараж" },
      { id: "barbecue", name: "Барбекю-зона" },
      { id: "sauna", name: "Баня" },
      { id: "gazebo", name: "Беседка" },
      { id: "warehouse", name: "Склад" },
      { id: "greenhouse", name: "Теплица" },
      { id: "shed", name: "Сарай" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 23,
    category: "Электропитание",
    control: "MultiSelect",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "220", name: "220" },
      { id: "380", name: "380" }
    ]
  },
  {
    id: 24,
    category: "Пиковая мощность",
    control: "Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    autoUnit: "кВт"
  },
  {
    id: 25,
    category: "Тип отопления",
    control: "MultiSelect+Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "electric", name: "Электрическое" },
      { id: "solid_fuel", name: "Твердотопливное" },
      { id: "gas", name: "Газовое" },
      { id: "none", name: "Нет" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 26,
    category: "Отопительные приборы",
    control: "MultiSelect+Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "central", name: "Центральные" },
      { id: "electric", name: "Электрические" },
      { id: "water", name: "Водяные" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 27,
    category: "Холодная вода",
    control: "Select",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "centralized", name: "Централизованная" },
      { id: "well", name: "Скважина" },
      { id: "column", name: "Колонка" },
      { id: "none", name: "Нет" }
    ]
  },
  {
    id: 28,
    category: "Горячая вода",
    control: "MultiSelect",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "centralized", name: "Централизованная" },
      { id: "boiler", name: "Бойлер" },
      { id: "instant", name: "Проточный" },
      { id: "none", name: "Нет" }
    ]
  },
  {
    id: 29,
    category: "Тип канализации",
    control: "Select",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "centralized", name: "Централизованная" },
      { id: "septic", name: "Септик" },
      { id: "cesspool", name: "Выгребная яма" },
      { id: "none", name: "Без канализации" }
    ]
  },
  {
    id: 30,
    category: "Кондиционер",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
      { id: "none", name: "Нет" }
    ]
  },
  {
    id: 31,
    category: "Температурный режим помещения",
    control: "Select",
    objectTypes: ["Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "heated", name: "Отапливаемый" },
      { id: "unheated", name: "Неотапливаемый" }
    ]
  },
  {
    id: 32,
    category: "Курение",
    control: "Select",
    objectTypes: ["Квартира", "Коммерческое помещение"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "allowed", name: "Разрешено" },
      { id: "forbidden", name: "Запрещено" },
      { id: "separate", name: "Отдельная зона" }
    ]
  },
  {
    id: 33,
    category: "Мебель",
    control: "MultiSelect+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "bed", name: "Кровать" },
      { id: "sofa", name: "Диван" },
      { id: "table", name: "Стол" },
      { id: "chairs", name: "Стулья" },
      { id: "wardrobe", name: "Шкаф" },
      { id: "chest", name: "Комод" },
      { id: "nightstand", name: "Тумбочка" },
      { id: "armchair", name: "Кресло" },
      { id: "kitchen_table", name: "Кухонный стол" },
      { id: "kitchen_chairs", name: "Кухонные стулья" },
      { id: "desk", name: "Письменный стол" },
      { id: "mirror", name: "Зеркало" },
      { id: "coffee_table", name: "Кофейный столик" },
      { id: "dining_table", name: "Обеденный стол" },
      { id: "walk_in_closet", name: "Шкаф-купе" },
      { id: "kitchen_set", name: "Кухонный гарнитур" },
      { id: "tv_stand", name: "Тумба под телевизор" },
      { id: "shelf", name: "Стеллаж" },
      { id: "shoe_rack", name: "Обувница" },
      { id: "drawer_chest", name: "Комод с ящиками" },
      { id: "clothes_closet", name: "Шкаф для одежды" },
      { id: "dressing_table", name: "Туалетный столик" },
      { id: "bathtub", name: "Ванна" },
      { id: "sink", name: "Раковина" },
      { id: "cabinet", name: "Шкафчик" },
      { id: "toilet", name: "Унитаз" },
      { id: "bidet", name: "Биде" },
      { id: "shower", name: "Душевая кабина" },
      { id: "towel_rail", name: "Полотенцесушитель" },
      { id: "utility_cabinet", name: "Хозяйственная тумба" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 34,
    category: "Бытовая техника",
    control: "MultiSelect+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "refrigerator", name: "Холодильник" },
      { id: "stove", name: "Плита" },
      { id: "oven", name: "Духовка" },
      { id: "microwave", name: "Микроволновка" },
      { id: "dishwasher", name: "Посудомоечная машина" },
      { id: "washing_machine", name: "Стиральная машина" },
      { id: "dryer", name: "Сушильная машина" },
      { id: "vacuum", name: "Пылесос" },
      { id: "tv", name: "Телевизор" },
      { id: "iron", name: "Утюг" },
      { id: "hair_dryer", name: "Фен" },
      { id: "toaster", name: "Тостер" },
      { id: "coffee_machine", name: "Кофемашина" },
      { id: "kettle", name: "Чайник" },
      { id: "heater", name: "Обогреватель" },
      { id: "air_conditioner", name: "Кондиционер" },
      { id: "fan", name: "Вентилятор" },
      { id: "humidifier", name: "Увлажнитель воздуха" },
      { id: "air_purifier", name: "Очиститель воздуха" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 35,
    category: "Тип забора",
    control: "Select+Input",
    objectTypes: ["Частный дом", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "profiled_sheet", name: "Профлист" },
      { id: "brick", name: "Кирпич" },
      { id: "concrete", name: "Бетон" },
      { id: "chain_link", name: "Сетка-рабица" },
      { id: "metal", name: "Металл" },
      { id: "wood", name: "Дерево" },
      { id: "none", name: "Нет" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 36,
    category: "Зелёные насаждения",
    control: "Select",
    objectTypes: ["Частный дом", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" },
      { id: "partial", name: "Частично" }
    ]
  },
  {
    id: 37,
    category: "Инфраструктура",
    control: "MultiSelect+Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "school", name: "Школа" },
      { id: "kindergarten", name: "Детский сад" },
      { id: "clinic", name: "Поликлиника" },
      { id: "hospital", name: "Больница" },
      { id: "pharmacy", name: "Аптека" },
      { id: "shop", name: "Магазин" },
      { id: "supermarket", name: "Супермаркет" },
      { id: "market", name: "Рынок" },
      { id: "mall", name: "Торговый центр" },
      { id: "cafe", name: "Кафе" },
      { id: "restaurant", name: "Ресторан" },
      { id: "fitness", name: "Фитнес-клуб" },
      { id: "pool", name: "Бассейн" },
      { id: "stadium", name: "Стадион" },
      { id: "sports_ground", name: "Спортивная площадка" },
      { id: "park", name: "Парк" },
      { id: "green_zone", name: "Озеленённая зона" },
      { id: "bus_stop", name: "Остановка общественного транспорта" },
      { id: "metro", name: "Станция метро" },
      { id: "station", name: "Вокзал" },
      { id: "parking", name: "Парковка" },
      { id: "post", name: "Почта" },
      { id: "cultural_center", name: "Культурный центр" },
      { id: "church", name: "Церковь" },
      { id: "pet_shop", name: "Зоомагазин" },
      { id: "hairdresser", name: "Парикмахерская" },
      { id: "pickup_point", name: "Пункт выдачи заказов" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true,
    nestedInputs: true
  },
  {
    id: 38,
    category: "Парковка",
    control: "MultiSelect",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "ground", name: "Наземная" },
      { id: "garage", name: "Гараж" },
      { id: "canopy", name: "Навес" },
      { id: "separate_building", name: "Отдельное здание" }
    ]
  },
  {
    id: 39,
    category: "Подъездные пути",
    control: "Select",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "none", name: "Без подъездных путей" },
      { id: "dirt", name: "Грунтовая" },
      { id: "asphalt", name: "Асфальтированная" },
      { id: "combined", name: "Комбинированная дорога" }
    ]
  },
  {
    id: 40,
    category: "Тип окружения",
    control: "Select+Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "city", name: "Город" },
      { id: "village", name: "Посёлок" },
      { id: "rural", name: "Село" },
      { id: "nature", name: "Природная зона" },
      { id: "industrial", name: "Промзона" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 41,
    category: "Удалённость от моря",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда"],
    countries: ["Таиланд", "Китай", "Южная Корея"],
    autoUnit: "км"
  },
  {
    id: 42,
    category: "Удалённость от центра",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    autoUnit: "км"
  },
  {
    id: 43,
    category: "Пешеходный трафик",
    control: "Select",
    objectTypes: ["Коммерческое помещение", "Здание"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "low", name: "Низкий" },
      { id: "medium", name: "Средний" },
      { id: "high", name: "Высокий" }
    ]
  },
  {
    id: 44,
    category: "Автомобильный трафик",
    control: "Select",
    objectTypes: ["Коммерческое помещение", "Здание"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "low", name: "Низкий" },
      { id: "medium", name: "Средний" },
      { id: "high", name: "Высокий" }
    ]
  },
  {
    id: 45,
    category: "VR",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 46,
    category: "Кадастровый номер",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"]
  },
  {
    id: 47,
    category: "Кадастровая стоимость",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"]
  },
  {
    id: 48,
    category: "Территориальная зона",
    control: "Input",
    objectTypes: ["Частный дом", "Здание", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"]
  },
  {
    id: 49,
    category: "Вид права",
    control: "Select+Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "ownership", name: "Собственность" },
      { id: "rent", name: "Аренда" },
      { id: "ownership_rent", name: "Собственность + Аренда" },
      { id: "sublease", name: "Субаренда" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 50,
    category: "Застройщик",
    control: "Input",
    objectTypes: ["Квартира"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"]
  },
  {
    id: 51,
    category: "ДДУ",
    control: "Select",
    objectTypes: ["Квартира"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Да" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 52,
    category: "Ипотека",
    control: "MultiSelect+Input",
    objectTypes: ["Квартира", "Частный дом", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "far_eastern", name: "Дальневосточная ипотека" },
      { id: "family", name: "Семейная ипотека" },
      { id: "it", name: "IT-ипотека" },
      { id: "military", name: "Военная ипотека" },
      { id: "standard", name: "Стандартная ипотека" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 53,
    category: "Коммунальные платежи",
    control: "MultiSelect+Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "electricity", name: "Электричество" },
      { id: "water", name: "Вода" },
      { id: "hot_water", name: "Горячая вода" },
      { id: "heating", name: "Отопление" },
      { id: "gas", name: "Газ" },
      { id: "garbage", name: "Вывоз мусора" },
      { id: "maintenance", name: "Содержание ЖК" },
      { id: "internet", name: "Интернет" },
      { id: "capital_repair", name: "Кап. Ремонт" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true,
    nestedInputs: true
  },
  {
    id: 54,
    category: "Налог",
    control: "Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 55,
    category: "Цена за м²",
    control: "Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 56,
    category: "Аренда за м²",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 57,
    category: "Субсидии",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"]
  },
  {
    id: 58,
    category: "Дополнительно оплачивается",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 59,
    category: "Торг",
    control: "Select",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "no", name: "Без торга" },
      { id: "minimal", name: "Минимальный" },
      { id: "substantial", name: "Существенный" }
    ]
  },
  {
    id: 60,
    category: "Комиссия агентства",
    control: "Select+Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "no", name: "Без комиссии" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 61,
    category: "Количество собственников",
    control: "Input",
    objectTypes: ["Доля в праве"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    validation: {
      pattern: "\\d+",
      min: 1
    }
  },
  {
    id: 62,
    category: "Обременения",
    control: "Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"]
  },
  {
    id: 63,
    category: "Балкон",
    control: "MultiSelect+Input",
    objectTypes: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "balcony", name: "Балкон" },
      { id: "loggia", name: "Лоджия" },
      { id: "none", name: "Нет" }
    ],
    nestedInputs: true
  },
  {
    id: 64,
    category: "Вид использования",
    control: "MultiSelect+Input",
    objectTypes: ["Частный дом", "Здание", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "residential", name: "ИЖС" },
      { id: "dacha", name: "Дачное" },
      { id: "industrial", name: "Производственное" },
      { id: "warehouse", name: "Складское" },
      { id: "commercial", name: "Торговое" },
      { id: "office", name: "Офисное" },
      { id: "agricultural", name: "Сельскохозяйственное" },
      { id: "logistics", name: "Логистическое" },
      { id: "recreational", name: "Рекреационное" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 65,
    category: "Окна",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "pvc", name: "ПВХ" },
      { id: "wood", name: "Деревянные" },
      { id: "aluminum", name: "Алюминиевые" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 66,
    category: "Вид дома",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом", "Здание"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "secondary", name: "Вторичное жильё" },
      { id: "new_building", name: "Новостройка" }
    ]
  },
  {
    id: 67,
    category: "Охрана",
    control: "Select",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 68,
    category: "Наружное видеонаблюдение",
    control: "Select",
    objectTypes: ["Квартира", "Частный дом", "Здание", "Имущественный комплекс"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 69,
    category: "Консьерж",
    control: "Select",
    objectTypes: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 70,
    category: "Детская площадка",
    control: "Select",
    objectTypes: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 71,
    category: "Температура по сезонам",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Аренда"],
    countries: ["Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 72,
    category: "Влажность воздуха",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Аренда"],
    countries: ["Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 73,
    category: "Загрязнение воздуха",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Аренда"],
    countries: ["Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 74,
    category: "Шумовой фон",
    control: "Input",
    objectTypes: ["Квартира", "Частный дом"],
    operations: ["Аренда"],
    countries: ["Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 75,
    category: "Координаты",
    control: "Input",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"]
  },
  {
    id: 76,
    category: "Форма участка",
    control: "Select+Input",
    objectTypes: ["Частный дом", "Здание"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "regular", name: "Правильная" },
      { id: "irregular", name: "Неправильная" },
      { id: "corner", name: "Угловая" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 77,
    category: "Рельеф участка",
    control: "Select+Input",
    objectTypes: ["Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "flat", name: "Ровный" },
      { id: "sloped", name: "С уклоном" },
      { id: "uneven", name: "Неровный" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 78,
    category: "Проводной интернет",
    control: "Select",
    objectTypes: ["Все"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    id: 79,
    category: "Количество зданий",
    control: "Input",
    objectTypes: ["Имущественный комплекс"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    validation: {
      pattern: "\\d+",
      min: 1
    }
  },
  {
    id: 80,
    category: "Тип зданий в комплексе",
    control: "MultiSelect+Input",
    objectTypes: ["Имущественный комплекс"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "panel", name: "Панельные" },
      { id: "brick", name: "Кирпичные" },
      { id: "monolithic", name: "Монолитные" },
      { id: "block", name: "Блочные" },
      { id: "wood", name: "Деревянные" },
      { id: "combined", name: "Комбинированные" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 81,
    category: "Размер депозита",
    control: "Select+Input",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "1_month", name: "В размере 1 месяца" },
      { id: "2_months", name: "В размере 2 месяцев" },
      { id: "3_months", name: "В размере 3 месяцев" },
      { id: "no_deposit", name: "Без депозита" },
      { id: "other", name: "Другое" }
    ],
    otherInput: true
  },
  {
    id: 82,
    category: "Аренда с питомцами",
    control: "MultiSelect",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "dogs", name: "Собаки" },
      { id: "cats", name: "Кошки" },
      { id: "large_animals", name: "Другие крупные животные" },
      { id: "small_animals", name: "Другие мелкие животные" }
    ]
  },
  {
    id: 83,
    category: "Срок Аренды",
    control: "MultiSelect",
    objectTypes: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "up_to_1_month", name: "До 1 месяца" },
      { id: "1_3_months", name: "1-3 месяца" },
      { id: "3_6_months", name: "3-6 месяцев" },
      { id: "6_12_months", name: "6-12 месяцев" },
      { id: "more_than_year", name: "Более года" }
    ]
  }
];
