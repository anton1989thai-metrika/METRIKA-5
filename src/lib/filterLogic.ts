// ================================
// ФИЛЬТРАЦИЯ ПОЛЕЙ ДЛЯ ДОБАВЛЕНИЯ ОБЪЕКТА
// Иерархия: 1. Страна → 2. Операция → 3. Тип объекта → 4. Категории
// ================================

export interface FieldConfig {
  name: string
  type: 'select' | 'input' | 'select+input' | 'input+button' | 'multiselect' | 'calendar' | 'switch'
  objects: string[]
  operations: string[]
  countries: string[]
  options?: Array<{ id: string; name: string }>
  placeholder?: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

// --- Исходные данные из таблицы ---
export const fields: FieldConfig[] = [
  // Основные поля (всегда видимы)
  {
    name: "Страна",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "russia", name: "Россия" },
      { id: "thailand", name: "Таиланд" },
      { id: "china", name: "Китай" },
      { id: "south-korea", name: "Южная Корея" }
    ],
    validation: { required: true }
  },
  {
    name: "Операция",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "sale", name: "Продажа" },
      { id: "rent", name: "Аренда" },
      { id: "exchange", name: "Обмен" }
    ],
    validation: { required: true }
  },
  {
    name: "Тип объекта",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "apartment", name: "Квартира" },
      { id: "house", name: "Частный дом" },
      { id: "commercial", name: "Коммерческое помещение" },
      { id: "building", name: "Здание" },
      { id: "complex", name: "Имущественный комплекс" },
      { id: "non-capital", name: "Некапитальный объект" },
      { id: "share", name: "Доля в праве" },
      { id: "land", name: "Земельный участок" }
    ],
    validation: { required: true }
  },
  {
    name: "Адрес",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите адрес",
    validation: { required: true }
  },
  {
    name: "Район",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    validation: { required: true }
  },
  {
    name: "Цена",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите цену",
    validation: { required: true }
  },

  // Основные характеристики
  {
    name: "Тип помещения",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "studio", name: "Студия" },
      { id: "1-room", name: "1-комнатная" },
      { id: "2-room", name: "2-комнатная" },
      { id: "3-room", name: "3-комнатная" },
      { id: "4-room", name: "4-комнатная" },
      { id: "5-room", name: "5-комнатная" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Комнат",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
      { id: "6+", name: "6+" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Спален",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Санузлов",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Высота потолков",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "м"
  },
  {
    name: "Планировка",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "studio", name: "Студия" },
      { id: "open", name: "Открытая" },
      { id: "closed", name: "Закрытая" },
      { id: "mixed", name: "Смешанная" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Ремонт",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "none", name: "Без ремонта" },
      { id: "cosmetic", name: "Косметический" },
      { id: "euro", name: "Евроремонт" },
      { id: "designer", name: "Дизайнерский" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Дата завершения ремонта",
    type: "input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "DD.MM.YYYY"
  },
  {
    name: "Сторона окон",
    type: "multiselect",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "north", name: "Север" },
      { id: "south", name: "Юг" },
      { id: "east", name: "Восток" },
      { id: "west", name: "Запад" },
      { id: "northeast", name: "Северо-восток" },
      { id: "northwest", name: "Северо-запад" },
      { id: "southeast", name: "Юго-восток" },
      { id: "southwest", name: "Юго-запад" }
    ]
  },
  {
    name: "Вид из окон",
    type: "multiselect",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "street", name: "На улицу" },
      { id: "yard", name: "Во двор" },
      { id: "park", name: "В парк" },
      { id: "sea", name: "На море" },
      { id: "mountains", name: "На горы" },
      { id: "city", name: "На город" },
      { id: "other", name: "Другое" }
    ]
  },

  // Информация о здании
  {
    name: "Наличие лифта",
    type: "multiselect",
    objects: ["Квартира", "Коммерческое помещение", "Здание", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "passenger", name: "Пассажирский" },
      { id: "cargo", name: "Грузовой" },
      { id: "none", name: "Отсутствует" }
    ]
  },
  {
    name: "Фасад",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "brick", name: "Кирпичный" },
      { id: "panel", name: "Панельный" },
      { id: "monolithic", name: "Монолитный" },
      { id: "block", name: "Блочный" },
      { id: "wood", name: "Деревянный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Готовность объекта",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "ready", name: "Готов" },
      { id: "construction", name: "В строительстве" },
      { id: "planning", name: "В проекте" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Тип дома",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "panel", name: "Панельный" },
      { id: "brick", name: "Кирпичный" },
      { id: "monolithic", name: "Монолитный" },
      { id: "block", name: "Блочный" },
      { id: "wood", name: "Деревянный" },
      { id: "combined", name: "Комбинированный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Тип фундамента",
    type: "select+input",
    objects: ["Частный дом"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "strip", name: "Ленточный" },
      { id: "slab", name: "Плитный" },
      { id: "pile", name: "Свайный" },
      { id: "column", name: "Столбчатый" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Год постройки здания",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "YYYY"
  },
  {
    name: "Этажность здания",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Количество этажей"
  },
  {
    name: "Количество квартир в доме",
    type: "input",
    objects: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Количество квартир"
  },
  {
    name: "Этаж квартиры / помещения",
    type: "input",
    objects: ["Квартира", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Номер этажа"
  },
  {
    name: "Подвал",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" },
      { id: "partial", name: "Частично" }
    ]
  },
  {
    name: "Мансарда",
    type: "select",
    objects: ["Квартира", "Частный дом", "Здание"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" },
      { id: "partial", name: "Частично" }
    ]
  },
  {
    name: "Дополнительные постройки",
    type: "multiselect",
    objects: ["Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "garage", name: "Гараж" },
      { id: "shed", name: "Сарай" },
      { id: "bathhouse", name: "Баня" },
      { id: "greenhouse", name: "Теплица" },
      { id: "other", name: "Другое" }
    ]
  },

  // Коммуникации
  {
    name: "Электропитание",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "220v", name: "220В" },
      { id: "380v", name: "380В" },
      { id: "three-phase", name: "Трехфазное" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Пиковая мощность (кВт)",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "кВт"
  },
  {
    name: "Тип отопления",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "central", name: "Центральное" },
      { id: "individual", name: "Индивидуальное" },
      { id: "gas", name: "Газовое" },
      { id: "electric", name: "Электрическое" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Отопительные приборы",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "radiators", name: "Радиаторы" },
      { id: "convectors", name: "Конвекторы" },
      { id: "warm-floor", name: "Теплый пол" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Холодная вода",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "central", name: "Центральная" },
      { id: "well", name: "Скважина" },
      { id: "none", name: "Отсутствует" }
    ]
  },
  {
    name: "Горячая вода",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "central", name: "Центральная" },
      { id: "boiler", name: "Бойлер" },
      { id: "gas-heater", name: "Газовый нагреватель" },
      { id: "none", name: "Отсутствует" }
    ]
  },
  {
    name: "Тип канализации",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "central", name: "Центральная" },
      { id: "septic", name: "Септик" },
      { id: "none", name: "Отсутствует" }
    ]
  },
  {
    name: "Кондиционер",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Система «умный дом»",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Офисная зона",
    type: "select",
    objects: ["Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "allocated", name: "Выделена" },
      { id: "not-allocated", name: "Не выделена" }
    ]
  },
  {
    name: "Температурный режим помещения",
    type: "select",
    objects: ["Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "normal", name: "Обычный" },
      { id: "cold", name: "Холодный" },
      { id: "warm", name: "Теплый" }
    ]
  },
  {
    name: "Курение",
    type: "select",
    objects: ["Квартира", "Коммерческое помещение", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "allowed", name: "Разрешено" },
      { id: "forbidden", name: "Запрещено" }
    ]
  },

  // Дополнительные характеристики
  {
    name: "Мебель",
    type: "multiselect",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "kitchen", name: "Кухонная" },
      { id: "bedroom", name: "Спальная" },
      { id: "living", name: "Гостиная" },
      { id: "office", name: "Офисная" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Бытовая техника",
    type: "multiselect",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "refrigerator", name: "Холодильник" },
      { id: "washing-machine", name: "Стиральная машина" },
      { id: "dishwasher", name: "Посудомоечная машина" },
      { id: "microwave", name: "Микроволновка" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Ландшафт",
    type: "select+input",
    objects: ["Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "flat", name: "Ровный" },
      { id: "hilly", name: "Холмистый" },
      { id: "mountainous", name: "Горный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Тип забора",
    type: "select+input",
    objects: ["Частный дом", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "brick", name: "Кирпичный" },
      { id: "metal", name: "Металлический" },
      { id: "wood", name: "Деревянный" },
      { id: "concrete", name: "Бетонный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Зелёные насаждения",
    type: "select+input",
    objects: ["Частный дом", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "trees", name: "Деревья" },
      { id: "shrubs", name: "Кустарники" },
      { id: "lawn", name: "Газон" },
      { id: "garden", name: "Сад" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Инфраструктура",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "school", name: "Школа" },
      { id: "kindergarten", name: "Детский сад" },
      { id: "hospital", name: "Больница" },
      { id: "shop", name: "Магазин" },
      { id: "pharmacy", name: "Аптека" },
      { id: "bank", name: "Банк" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Парковка",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "garage", name: "Гараж" },
      { id: "open", name: "Открытая" },
      { id: "covered", name: "Крытая" },
      { id: "underground", name: "Подземная" },
      { id: "none", name: "Отсутствует" }
    ]
  },
  {
    name: "Подъездные пути",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "asphalt", name: "Асфальт" },
      { id: "concrete", name: "Бетон" },
      { id: "gravel", name: "Гравий" },
      { id: "dirt", name: "Грунтовая" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Тип окружения",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "residential", name: "Жилой" },
      { id: "commercial", name: "Коммерческий" },
      { id: "industrial", name: "Промышленный" },
      { id: "recreational", name: "Рекреационный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Удалённость от моря",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение"],
    operations: ["Продажа", "Аренда"],
    countries: ["Таиланд", "Китай", "Южная Корея"],
    placeholder: "км"
  },
  {
    name: "Удалённость от центра",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "км"
  },
  {
    name: "Пешеходный трафик",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "high", name: "Высокий" },
      { id: "medium", name: "Средний" },
      { id: "low", name: "Низкий" }
    ]
  },
  {
    name: "Автомобильный трафик",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "high", name: "Высокий" },
      { id: "medium", name: "Средний" },
      { id: "low", name: "Низкий" }
    ]
  },
  {
    name: "VR",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },

  // Кадастровые данные
  {
    name: "Кадастровый номер",
    type: "input+button",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите кадастровый номер"
  },
  {
    name: "Кадастровая стоимость",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите стоимость"
  },
  {
    name: "Территориальная зона",
    type: "select+input",
    objects: ["Частный дом", "Здание", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "residential", name: "Жилая" },
      { id: "commercial", name: "Коммерческая" },
      { id: "industrial", name: "Промышленная" },
      { id: "agricultural", name: "Сельскохозяйственная" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Вид права",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "ownership", name: "Собственность" },
      { id: "lease", name: "Аренда" },
      { id: "use", name: "Пользование" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Застройщик",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "known", name: "Известный" },
      { id: "unknown", name: "Неизвестный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "ДДУ",
    type: "select",
    objects: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Ипотека",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "available", name: "Доступна" },
      { id: "not-available", name: "Недоступна" },
      { id: "military", name: "Военная" },
      { id: "maternal", name: "Материнская" }
    ]
  },
  {
    name: "Коммунальные платежи",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите сумму"
  },
  {
    name: "Налог",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите сумму"
  },
  {
    name: "Стоимость квадратного метра",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "₽/м²"
  },
  {
    name: "Аренда за м²",
    type: "input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    placeholder: "₽/м²"
  },
  {
    name: "Субсидии",
    type: "select",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Дополнительно оплачивается",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    placeholder: "Введите сумму"
  },
  {
    name: "Торг",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "possible", name: "Возможен" },
      { id: "not-possible", name: "Невозможен" }
    ]
  },
  {
    name: "Комиссия",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "percentage", name: "Процент" },
      { id: "fixed", name: "Фиксированная" },
      { id: "none", name: "Отсутствует" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Метрики",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Введите метрики"
  },
  {
    name: "Количество собственников",
    type: "input",
    objects: ["Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Количество"
  },
  {
    name: "Обременения",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" },
      { id: "other", name: "Другое" }
    ]
  },

  // Дополнительные поля
  {
    name: "Балкон",
    type: "multiselect",
    objects: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" },
      { id: "loggia", name: "Лоджия" },
      { id: "terrace", name: "Терраса" }
    ]
  },
  {
    name: "Площадь балкона",
    type: "input",
    objects: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "м²"
  },
  {
    name: "Вид использования",
    type: "multiselect",
    objects: ["Частный дом", "Здание", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "residential", name: "Жилое" },
      { id: "commercial", name: "Коммерческое" },
      { id: "industrial", name: "Промышленное" },
      { id: "agricultural", name: "Сельскохозяйственное" },
      { id: "recreational", name: "Рекреационное" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Окна",
    type: "select+input",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "plastic", name: "Пластиковые" },
      { id: "wood", name: "Деревянные" },
      { id: "aluminum", name: "Алюминиевые" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Вид дома",
    type: "select",
    objects: ["Квартира", "Частный дом", "Здание"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "secondary", name: "Вторичное жильё" },
      { id: "new-building", name: "Новостройка" }
    ]
  },
  {
    name: "Домофон",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Охрана",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Наружное видеонаблюдение",
    type: "select",
    objects: ["Квартира", "Частный дом", "Здание", "Имущественный комплекс"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Консьерж",
    type: "select",
    objects: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Детская площадка",
    type: "select",
    objects: ["Квартира"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Температура по сезонам",
    type: "select",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "stable", name: "Стабильная" },
      { id: "variable", name: "Переменная" }
    ]
  },
  {
    name: "Влажность воздуха",
    type: "select",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "low", name: "Низкая" },
      { id: "normal", name: "Нормальная" },
      { id: "high", name: "Высокая" }
    ]
  },
  {
    name: "Загрязнение воздуха",
    type: "select",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "low", name: "Низкое" },
      { id: "medium", name: "Среднее" },
      { id: "high", name: "Высокое" }
    ]
  },
  {
    name: "Шумовой фон",
    type: "select",
    objects: ["Квартира", "Частный дом"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "low", name: "Низкий" },
      { id: "medium", name: "Средний" },
      { id: "high", name: "Высокий" }
    ]
  },
  {
    name: "Координаты",
    type: "input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Широта, долгота"
  },
  {
    name: "Форма участка",
    type: "select+input",
    objects: ["Частный дом", "Здание", "Имущественный комплекс", "Некапитальный объект", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "rectangular", name: "Прямоугольная" },
      { id: "square", name: "Квадратная" },
      { id: "triangular", name: "Треугольная" },
      { id: "irregular", name: "Неправильная" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Рельеф участка",
    type: "select+input",
    objects: ["Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "flat", name: "Ровный" },
      { id: "hilly", name: "Холмистый" },
      { id: "mountainous", name: "Горный" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Проводной интернет",
    type: "select",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "yes", name: "Есть" },
      { id: "no", name: "Нет" }
    ]
  },
  {
    name: "Количество зданий",
    type: "input",
    objects: ["Имущественный комплекс"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    placeholder: "Количество"
  },
  {
    name: "Тип зданий в комплексе",
    type: "select+input",
    objects: ["Имущественный комплекс"],
    operations: ["Продажа", "Аренда", "Обмен"],
    countries: ["Россия"],
    options: [
      { id: "residential", name: "Жилые" },
      { id: "commercial", name: "Коммерческие" },
      { id: "mixed", name: "Смешанные" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Размер депозита",
    type: "select+input",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "monthly", name: "Месячная аренда" },
      { id: "quarterly", name: "Квартальная аренда" },
      { id: "half-year", name: "Полугодовая аренда" },
      { id: "yearly", name: "Годовая аренда" },
      { id: "custom", name: "Другое" }
    ]
  },
  {
    name: "Недоступные даты",
    type: "calendar",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"]
  },
  {
    name: "Аренда с питомцами",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "cats", name: "Кошки" },
      { id: "dogs", name: "Собаки" },
      { id: "birds", name: "Птицы" },
      { id: "fish", name: "Рыбы" },
      { id: "other", name: "Другое" }
    ]
  },
  {
    name: "Срок аренды",
    type: "multiselect",
    objects: ["Квартира", "Частный дом", "Коммерческое помещение", "Здание", "Имущественный комплекс", "Некапитальный объект", "Доля в праве", "Земельный участок"],
    operations: ["Аренда"],
    countries: ["Россия", "Таиланд", "Китай", "Южная Корея"],
    options: [
      { id: "daily", name: "Посуточно" },
      { id: "weekly", name: "Понедельно" },
      { id: "monthly", name: "Помесячно" },
      { id: "quarterly", name: "Поквартально" },
      { id: "yearly", name: "Погодно" },
      { id: "long-term", name: "Долгосрочно" }
    ]
  }
]

// --- Логика фильтрации ---
export function getAvailableFields(selectedCountry: string, selectedOperation: string, selectedObjectType: string): FieldConfig[] {
  return fields.filter(field => 
    field.countries.includes(selectedCountry) &&
    field.operations.includes(selectedOperation) &&
    field.objects.includes(selectedObjectType)
  )
}

// --- Опционально: расширение логики для UI ---
export function shouldDisplayField(field: FieldConfig, selected: { country: string; operation: string; objectType: string }): boolean {
  return (
    field.countries.includes(selected.country) &&
    field.operations.includes(selected.operation) &&
    field.objects.includes(selected.objectType)
  )
}

// --- Утилиты для работы с полями ---
export function getFieldById(fieldId: string): FieldConfig | undefined {
  return fields.find(field => field.name === fieldId)
}

export function getFieldsByType(type: string): FieldConfig[] {
  return fields.filter(field => field.type === type)
}

export function getRequiredFields(selectedCountry: string, selectedOperation: string, selectedObjectType: string): FieldConfig[] {
  return getAvailableFields(selectedCountry, selectedOperation, selectedObjectType)
    .filter(field => field.validation?.required)
}

// --- Пример использования ---
export const exampleUsage = {
  selected: {
    country: "Таиланд",
    operation: "Аренда", 
    objectType: "Квартира"
  },
  
  getVisibleFields: () => {
    const visibleFields = getAvailableFields("Таиланд", "Аренда", "Квартира")
    console.log("Поля, которые показываются:", visibleFields.map(f => f.name))
    return visibleFields
  }
}

/*
  🔹 Логика работы:
  1. Пользователь выбирает страну → остаются поля, где есть эта страна.
  2. Выбирает операцию (Продажа / Аренда / Обмен) → остаются поля, где совпадает операция.
  3. Выбирает тип объекта → остаются только соответствующие поля.
  4. Итог: на экране отображаются только те поля, которые реально нужны.
*/

/*
  ✅ Пример:
  Страна = "Россия"
  Операция = "Продажа"
  Тип объекта = "Частный дом"

  Показать:
   - Тип помещения
   - Комнат
   - Тип фундамента
   - Кадастровый номер
   - ...и другие поля, соответствующие этим условиям
*/

/*
  ⚙️ Жёсткая фильтрация:
  если хотя бы одно условие не выполняется — поле не показывается.
  Это гарантирует "строгую логику" без пересечений.
*/
