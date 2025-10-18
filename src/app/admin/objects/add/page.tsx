"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { Label } from '@/components/ui/label'
import ProtectedRoute from '@/components/ProtectedRoute'

const COUNTRIES = [
  { id: 'russia', name: 'Россия' },
  { id: 'thailand', name: 'Таиланд' },
  { id: 'china', name: 'Китай' },
  { id: 'south-korea', name: 'Южная Корея' }
]

const OPERATIONS = [
  { id: 'sale', name: 'Продажа' },
  { id: 'rent', name: 'Аренда' },
  { id: 'exchange', name: 'Обмен' }
]

const OBJECT_TYPES = [
  { id: 'apartment', name: 'Квартира' },
  { id: 'house', name: 'Частный дом' },
  { id: 'land', name: 'Земельный участок' },
  { id: 'commercial', name: 'Коммерческое помещение' },
  { id: 'building', name: 'Здание' },
  { id: 'complex', name: 'Имущественный комплекс' },
  { id: 'non-capital', name: 'Некапитальный объект' },
  { id: 'share', name: 'Доля в праве' }
]

// Опции для различных полей
const ROOM_TYPE_OPTIONS = [
  { id: 'penthouse', name: 'Пентхаус' },
  { id: 'apartments', name: 'Апартаменты' },
  { id: 'apartment', name: 'Квартира' },
  { id: 'studio', name: 'Гостинка' },
  { id: 'room', name: 'Комната' },
  { id: 'townhouse', name: 'Таунхаус' },
  { id: 'other', name: 'Другое' }
]

const ROOMS_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: 'other', name: 'Другое' }
]

const BEDROOMS_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: 'other', name: 'Другое' }
]

const BATHROOMS_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: 'other', name: 'Другое' }
]

const LAYOUT_OPTIONS = [
  { id: 'studio', name: 'Студия' },
  { id: 'separate', name: 'Раздельные комнаты' },
  { id: 'free', name: 'Свободная планировка' },
  { id: 'other', name: 'Другое' }
]

const RENOVATION_OPTIONS = [
  { id: 'none', name: 'Без отделки' },
  { id: 'renovation', name: 'В состоянии ремонта' },
  { id: 'budget', name: 'Бюджетный' },
  { id: 'basic', name: 'Базовая отделка' },
  { id: 'modern', name: 'Современный' },
  { id: 'designer', name: 'Дизайнерский' }
]

const WINDOW_SIDE_OPTIONS = [
  { id: 'north', name: 'Север' },
  { id: 'northeast', name: 'Северо-восток' },
  { id: 'east', name: 'Восток' },
  { id: 'southeast', name: 'Юго-восток' },
  { id: 'south', name: 'Юг' },
  { id: 'southwest', name: 'Юго-запад' },
  { id: 'west', name: 'Запад' },
  { id: 'northwest', name: 'Северо-запад' }
]

const VIEW_OPTIONS = [
  { id: 'sea', name: 'На море' },
  { id: 'mountains', name: 'На горы' },
  { id: 'city', name: 'На город' },
  { id: 'lake', name: 'На озеро или реку' },
  { id: 'yard', name: 'Во двор' }
]

const ELEVATOR_OPTIONS = [
  { id: 'cargo', name: 'Грузовой' },
  { id: 'passenger', name: 'Пассажирский' },
  { id: 'none', name: 'Нет' }
]

const FACADE_OPTIONS = [
  { id: 'ventilated', name: 'Вентилируемый' },
  { id: 'plaster', name: 'Штукатурный' },
  { id: 'brick', name: 'Кирпичный' },
  { id: 'siding', name: 'Сайдинговый' },
  { id: 'wood', name: 'Деревянный' },
  { id: 'fibercement', name: 'Фиброцементный' },
  { id: 'other', name: 'Другое' }
]

const READINESS_OPTIONS = [
  { id: 'under-construction', name: 'Строящийся' },
  { id: 'built', name: 'Построен' }
]

const HOUSE_TYPE_OPTIONS = [
  { id: 'panel', name: 'Панельный' },
  { id: 'brick', name: 'Кирпичный' },
  { id: 'monolithic', name: 'Монолитный' },
  { id: 'block', name: 'Блочный' },
  { id: 'wood', name: 'Деревянный' },
  { id: 'combined', name: 'Комбинированный' },
  { id: 'other', name: 'Другое' }
]

const FOUNDATION_OPTIONS = [
  { id: 'strip', name: 'Ленточный' },
  { id: 'pile', name: 'Свайный' },
  { id: 'monolithic', name: 'Монолитный' },
  { id: 'slab', name: 'Плитный' },
  { id: 'none', name: 'Нет' },
  { id: 'other', name: 'Другое' }
]

const BASEMENT_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' },
  { id: 'partial', name: 'Частично' }
]

const ATTIC_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const ADDITIONAL_BUILDINGS_OPTIONS = [
  { id: 'guest-house', name: 'Гостевой дом' },
  { id: 'garage', name: 'Гараж' },
  { id: 'barbecue', name: 'Барбекю-зона' },
  { id: 'sauna', name: 'Баня' },
  { id: 'gazebo', name: 'Беседка' },
  { id: 'warehouse', name: 'Склад' },
  { id: 'greenhouse', name: 'Теплица' },
  { id: 'shed', name: 'Сарай' },
  { id: 'other', name: 'Другое' }
]

const ELECTRICITY_OPTIONS = [
  { id: '220', name: '220' },
  { id: '380', name: '380' }
]

const HEATING_TYPE_OPTIONS = [
  { id: 'electric', name: 'Электрическое' },
  { id: 'solid-fuel', name: 'Твердотопливное' },
  { id: 'gas', name: 'Газовое' },
  { id: 'none', name: 'Нет' },
  { id: 'other', name: 'Другое' }
]

const HEATING_DEVICES_OPTIONS = [
  { id: 'central', name: 'Центральные' },
  { id: 'electric', name: 'Электрические' },
  { id: 'water', name: 'Водяные' },
  { id: 'other', name: 'Другое' }
]

const WATER_OPTIONS = [
  { id: 'centralized', name: 'Централизованная' },
  { id: 'well', name: 'Скважина' },
  { id: 'column', name: 'Колонка' },
  { id: 'none', name: 'Нет' }
]

const HOT_WATER_OPTIONS = [
  { id: 'centralized', name: 'Централизованная' },
  { id: 'boiler', name: 'Бойлер' },
  { id: 'instant', name: 'Проточный' },
  { id: 'none', name: 'Нет' }
]

const SEWERAGE_OPTIONS = [
  { id: 'centralized', name: 'Централизованная' },
  { id: 'septic', name: 'Септик' },
  { id: 'cesspool', name: 'Выгребная яма' },
  { id: 'none', name: 'Без канализации' }
]

const AIR_CONDITIONING_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: 'none', name: 'Нет' }
]

const SMART_HOME_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const OFFICE_ZONE_OPTIONS = [
  { id: 'allocated', name: 'Выделена' },
  { id: 'not-allocated', name: 'Не выделена' }
]

const TEMPERATURE_MODE_OPTIONS = [
  { id: 'warm', name: 'Тёплый' },
  { id: 'cold', name: 'Холодный' }
]

const SMOKING_OPTIONS = [
  { id: 'allowed', name: 'Разрешено' },
  { id: 'forbidden', name: 'Запрещено' },
  { id: 'separate-zone', name: 'Отдельная зона' }
]

const FURNITURE_OPTIONS = [
  { id: 'bed', name: 'Кровать' },
  { id: 'sofa', name: 'Диван' },
  { id: 'table', name: 'Стол' },
  { id: 'chairs', name: 'Стулья' },
  { id: 'wardrobe', name: 'Шкаф' },
  { id: 'chest', name: 'Комод' },
  { id: 'nightstand', name: 'Тумбочка' },
  { id: 'armchair', name: 'Кресло' },
  { id: 'kitchen-table', name: 'Кухонный стол' },
  { id: 'kitchen-chairs', name: 'Кухонные стулья' },
  { id: 'desk', name: 'Письменный стол' },
  { id: 'mirror', name: 'Зеркало' },
  { id: 'coffee-table', name: 'Кофейный столик' },
  { id: 'dining-table', name: 'Обеденный стол' },
  { id: 'walk-in-closet', name: 'Шкаф-купе' },
  { id: 'kitchen-set', name: 'Кухонный гарнитур' },
  { id: 'tv-stand', name: 'Тумба под телевизор' },
  { id: 'shelf', name: 'Стеллаж' },
  { id: 'shoe-rack', name: 'Обувница' },
  { id: 'drawer-chest', name: 'Комод с ящиками' },
  { id: 'clothes-wardrobe', name: 'Шкаф для одежды' },
  { id: 'vanity-table', name: 'Туалетный столик' },
  { id: 'bathtub', name: 'Ванна' },
  { id: 'sink', name: 'Раковина' },
  { id: 'cabinet', name: 'Шкафчик' },
  { id: 'toilet', name: 'Унитаз' },
  { id: 'bidet', name: 'Биде' },
  { id: 'shower', name: 'Душевая кабина' },
  { id: 'towel-rack', name: 'Полотенцесушитель' },
  { id: 'utility-cabinet', name: 'Хозяйственная тумба' },
  { id: 'other', name: 'Другое' }
]

const APPLIANCES_OPTIONS = [
  { id: 'refrigerator', name: 'Холодильник' },
  { id: 'stove', name: 'Плита' },
  { id: 'oven', name: 'Духовка' },
  { id: 'microwave', name: 'Микроволновка' },
  { id: 'dishwasher', name: 'Посудомоечная машина' },
  { id: 'washing-machine', name: 'Стиральная машина' },
  { id: 'dryer', name: 'Сушильная машина' },
  { id: 'vacuum', name: 'Пылесос' },
  { id: 'tv', name: 'Телевизор' },
  { id: 'iron', name: 'Утюг' },
  { id: 'hair-dryer', name: 'Фен' },
  { id: 'toaster', name: 'Тостер' },
  { id: 'coffee-machine', name: 'Кофемашина' },
  { id: 'kettle', name: 'Чайник' },
  { id: 'heater', name: 'Обогреватель' },
  { id: 'air-conditioner', name: 'Кондиционер' },
  { id: 'fan', name: 'Вентилятор' },
  { id: 'humidifier', name: 'Увлажнитель воздуха' },
  { id: 'air-purifier', name: 'Очиститель воздуха' },
  { id: 'other', name: 'Другое' }
]

const LANDSCAPE_OPTIONS = [
  { id: 'flat', name: 'Ровный' },
  { id: 'sloped', name: 'С уклоном' },
  { id: 'uneven', name: 'Неровный' },
  { id: 'other', name: 'Другое' }
]

const FENCE_TYPE_OPTIONS = [
  { id: 'profiled-sheet', name: 'Профлист' },
  { id: 'brick', name: 'Кирпич' },
  { id: 'concrete', name: 'Бетон' },
  { id: 'chain-link', name: 'Сетка-рабица' },
  { id: 'metal', name: 'Металл' },
  { id: 'wood', name: 'Дерево' },
  { id: 'none', name: 'Нет' },
  { id: 'other', name: 'Другое' }
]

const GREEN_PLANTINGS_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' },
  { id: 'partial', name: 'Частично' }
]

const INFRASTRUCTURE_OPTIONS = [
  { id: 'school', name: 'Школа' },
  { id: 'kindergarten', name: 'Детский сад' },
  { id: 'polyclinic', name: 'Поликлиника' },
  { id: 'hospital', name: 'Больница' },
  { id: 'pharmacy', name: 'Аптека' },
  { id: 'shop', name: 'Магазин' },
  { id: 'supermarket', name: 'Супермаркет' },
  { id: 'market', name: 'Рынок' },
  { id: 'mall', name: 'Торговый центр' },
  { id: 'cafe', name: 'Кафе' },
  { id: 'restaurant', name: 'Ресторан' },
  { id: 'fitness', name: 'Фитнес-клуб' },
  { id: 'pool', name: 'Бассейн' },
  { id: 'stadium', name: 'Стадион' },
  { id: 'sports-ground', name: 'Спортивная площадка' },
  { id: 'park', name: 'Парк' },
  { id: 'green-zone', name: 'Озеленённая зона' },
  { id: 'bus-stop', name: 'Остановка общественного транспорта' },
  { id: 'metro', name: 'Станция метро' },
  { id: 'station', name: 'Вокзал' },
  { id: 'parking', name: 'Парковка' },
  { id: 'post', name: 'Почта' },
  { id: 'cultural-center', name: 'Культурный центр' },
  { id: 'church', name: 'Церковь' },
  { id: 'pet-shop', name: 'Зоомагазин' },
  { id: 'hairdresser', name: 'Парикмахерская' },
  { id: 'pickup-point', name: 'Пункт выдачи заказов' }
]

const PARKING_OPTIONS = [
  { id: 'surface', name: 'Наземная' },
  { id: 'garage', name: 'Гараж' },
  { id: 'canopy', name: 'Навес' },
  { id: 'separate-building', name: 'Отдельное здание' }
]

const ACCESS_ROADS_OPTIONS = [
  { id: 'none', name: 'Без подъездных путей' },
  { id: 'dirt', name: 'Грунтовая' },
  { id: 'asphalt', name: 'Асфальтированная' },
  { id: 'combined', name: 'Комбинированная дорога' }
]

const SURROUNDING_TYPE_OPTIONS = [
  { id: 'city', name: 'Город' },
  { id: 'village', name: 'Посёлок' },
  { id: 'village-rural', name: 'Село' },
  { id: 'nature', name: 'Природная зона' },
  { id: 'industrial', name: 'Промзона' },
  { id: 'other', name: 'Иное' }
]

const TRAFFIC_OPTIONS = [
  { id: 'low', name: 'Низкий' },
  { id: 'medium', name: 'Средний' },
  { id: 'high', name: 'Высокий' }
]

const VR_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const RIGHT_TYPE_OPTIONS = [
  { id: 'ownership', name: 'Собственность' },
  { id: 'rent', name: 'Аренда' },
  { id: 'ownership-rent', name: 'Собственность + Аренда' },
  { id: 'sublease', name: 'Субаренда' },
  { id: 'other', name: 'Иное' }
]

const DDU_OPTIONS = [
  { id: 'yes', name: 'Да' },
  { id: 'no', name: 'Нет' }
]

const MORTGAGE_OPTIONS = [
  { id: 'far-east', name: 'Дальневосточная ипотека' },
  { id: 'family', name: 'Семейная ипотека' },
  { id: 'it', name: 'IT-ипотека' },
  { id: 'military', name: 'Военная ипотека' },
  { id: 'standard', name: 'Стандартная ипотека' },
  { id: 'other', name: 'Другое' }
]

const BARGAINING_OPTIONS = [
  { id: 'none', name: 'Без торга' },
  { id: 'minimal', name: 'Минимальный' },
  { id: 'substantial', name: 'Существенный' }
]

const COMMISSION_OPTIONS = [
  { id: 'none', name: 'Без комиссии' },
  { id: 'custom', name: 'Ввести' }
]

const BALCONY_OPTIONS = [
  { id: 'balcony', name: 'Балкон' },
  { id: 'loggia', name: 'Лоджия' },
  { id: 'none', name: 'Нет' }
]

const USE_TYPE_OPTIONS = [
  { id: 'izhs', name: 'ИЖС' },
  { id: 'industrial', name: 'Производственное' },
  { id: 'warehouse', name: 'Складское' },
  { id: 'retail', name: 'Торговое' },
  { id: 'office', name: 'Офисное' },
  { id: 'agricultural', name: 'Сельскохозяйственное' },
  { id: 'logistics', name: 'Логистическое' },
  { id: 'recreational', name: 'Рекреационное' },
  { id: 'other', name: 'Другое' }
]

const WINDOWS_OPTIONS = [
  { id: 'pvc', name: 'ПВХ' },
  { id: 'wood', name: 'Деревянные' },
  { id: 'aluminum', name: 'Алюминиевые' },
  { id: 'other', name: 'Другое' }
]

const HOUSE_TYPE_BUILDING_OPTIONS = [
  { id: 'secondary', name: 'Вторичное жильё' },
  { id: 'new-building', name: 'Новостройка' }
]

const INTERCOM_OPTIONS = [
  { id: 'intercom', name: 'Домофон' },
  { id: 'video-intercom', name: 'Видеодомофон' },
  { id: 'none', name: 'Нет' }
]

const SECURITY_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const VIDEO_SURVEILLANCE_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const CONCIERGE_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const PLAYGROUND_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const WIRED_INTERNET_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const BUILDING_TYPE_COMPLEX_OPTIONS = [
  { id: 'panel', name: 'Панельные' },
  { id: 'brick', name: 'Кирпичные' },
  { id: 'monolithic', name: 'Монолитные' },
  { id: 'block', name: 'Блочные' },
  { id: 'wood', name: 'Деревянные' },
  { id: 'combined', name: 'Комбинированные' },
  { id: 'other', name: 'Другое' }
]

const DEPOSIT_SIZE_OPTIONS = [
  { id: '1-month', name: 'В размере 1 месяца' },
  { id: '2-months', name: '2 месяцев' },
  { id: '3-months', name: '3 месяцев' },
  { id: 'none', name: 'Без депозита' },
  { id: 'other', name: 'Другое' }
]

const RENTAL_PERIOD_OPTIONS = [
  { id: 'up-to-1-month', name: 'До 1 месяца' },
  { id: '1-3-months', name: '1–3 месяца' },
  { id: '3-6-months', name: '3–6 месяцев' },
  { id: '6-12-months', name: '6–12 месяцев' },
  { id: 'more-than-year', name: 'Более года' }
]

const PETS_OPTIONS = [
  { id: 'dogs', name: 'Собаки' },
  { id: 'cats', name: 'Кошки' },
  { id: 'large-animals', name: 'Другие крупные животные' },
  { id: 'small-animals', name: 'Другие мелкие животные' }
]

const FORM_SHAPE_OPTIONS = [
  { id: 'regular', name: 'Правильная' },
  { id: 'irregular', name: 'Неправильная' },
  { id: 'corner', name: 'Угловая' },
  { id: 'other', name: 'Другое' }
]

const RELIEF_OPTIONS = [
  { id: 'flat', name: 'Ровный' },
  { id: 'sloped', name: 'С уклоном' },
  { id: 'uneven', name: 'Неровный' },
  { id: 'other', name: 'Другое' }
]

export default function AddObjectPage() {
  return (
    <ProtectedRoute requiredPermission="admin">
      <AddObjectPageContent />
    </ProtectedRoute>
  )
}

function AddObjectPageContent() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    country: '',
    operation: '',
    type: '',
    address: '',
    district: '',
    price: '',
    // Основные характеристики
    roomType: '',
    roomTypeOther: '',
    rooms: '',
    roomsOther: '',
    bedrooms: '',
    bedroomsOther: '',
    bathrooms: '',
    bathroomsOther: '',
    ceilingHeight: '',
    layout: '',
    layoutOther: '',
    renovation: '',
    renovationDate: '',
    windowSide: '',
    view: '',
    elevator: '',
    facade: '',
    facadeOther: '',
    readiness: '',
    houseType: '',
    houseTypeOther: '',
    foundation: '',
    foundationOther: '',
    constructionYear: '',
    buildingFloors: '',
    apartmentsInHouse: '',
    apartmentFloor: '',
    basement: '',
    attic: '',
    additionalBuildings: [] as string[],
    additionalBuildingsOther: '',
    // Коммуникации
    electricity: '',
    peakPower: '',
    heatingType: '',
    heatingTypeOther: '',
    heatingDevices: '',
    heatingDevicesOther: '',
    coldWater: '',
    hotWater: '',
    sewerage: '',
    airConditioning: '',
    smartHome: '',
    officeZone: '',
    temperatureMode: '',
    smoking: '',
    // Мебель и техника
    furniture: [] as string[],
    appliances: [] as string[],
    // Земельный участок
    landscape: '',
    landscapeOther: '',
    fenceType: '',
    fenceTypeOther: '',
    greenPlantings: '',
    // Инфраструктура
    infrastructure: [] as string[],
    infrastructureDistances: {} as Record<string, string>,
    parking: '',
    accessRoads: '',
    surroundingType: '',
    surroundingTypeOther: '',
    seaDistance: '',
    centerDistance: '',
    pedestrianTraffic: '',
    carTraffic: '',
    vr: '',
    // Кадастровые данные
    cadastralNumbers: [''] as string[],
    cadastralCosts: [''] as string[],
    territorialZone: '',
    rightType: '',
    rightTypeOther: '',
    developer: '',
    ddu: '',
    mortgage: '',
    mortgageOther: '',
    utilities: '',
    tax: '',
    pricePerSqm: '',
    rentPerSqm: '',
    subsidies: '',
    additionalPayment: '',
    bargaining: '',
    commission: '',
    commissionCustom: '',
    ownersCount: '',
    encumbrances: '',
    balcony: '',
    balconyArea: '',
    useType: '',
    useTypeOther: '',
    windows: '',
    windowsOther: '',
    houseTypeBuilding: '',
    intercom: '',
    security: '',
    videoSurveillance: '',
    concierge: '',
    playground: '',
    temperatureBySeasons: '',
    airHumidity: '',
    airPollution: '',
    noiseLevel: '',
    coordinates: '',
    formShape: '',
    formShapeOther: '',
    relief: '',
    reliefOther: '',
    wiredInternet: '',
    buildingsCount: '',
    buildingTypeComplex: '',
    buildingTypeComplexOther: '',
    depositSize: '',
    depositSizeOther: '',
    unavailableDates: undefined as DateRange | undefined,
    pets: [] as string[],
    rentalPeriod: ''
  })

  const [infrastructureSelected, setInfrastructureSelected] = useState<string[]>([])

  const getAreaFields = (type: string) => {
    switch (type) {
      case 'apartment':
        return [
          { id: 'totalArea', label: 'Общая площадь', placeholder: 'м²' },
          { id: 'livingArea', label: 'Жилая площадь', placeholder: 'м²' }
        ]
      case 'house':
        return [
          { id: 'landArea', label: 'Площадь земельного участка', placeholder: 'м²' },
          { id: 'livingArea', label: 'Жилая площадь дома', placeholder: 'м²' },
          { id: 'totalArea', label: 'Общая площадь дома', placeholder: 'м²' }
        ]
      case 'land':
        return [
          { id: 'landArea', label: 'Площадь земельного участка', placeholder: 'м²' }
        ]
      case 'commercial':
        return [
          { id: 'area', label: 'Площадь', placeholder: 'м²' }
        ]
      case 'building':
        return [
          { id: 'buildingArea', label: 'Площадь здания', placeholder: 'м²' },
          { id: 'landArea', label: 'Площадь земельного участка', placeholder: 'м²' }
        ]
      case 'non-capital':
        return [
          { id: 'area', label: 'Площадь', placeholder: 'м²' }
        ]
      case 'share':
        return [
          { id: 'shareSize', label: 'Размер доли', placeholder: 'м²' }
        ]
      case 'complex':
        return [
          { id: 'totalBuildingsArea', label: 'Общая площадь зданий', placeholder: 'м²' },
          { id: 'landArea', label: 'Площадь земельного участка', placeholder: 'м²' }
        ]
      default:
        return []
    }
  }

  const addCadastralNumber = () => {
    setFormData({
      ...formData,
      cadastralNumbers: [...formData.cadastralNumbers, '']
    })
  }

  const removeCadastralNumber = (index: number) => {
    setFormData({
      ...formData,
      cadastralNumbers: formData.cadastralNumbers.filter((_, i) => i !== index)
    })
  }

  const updateCadastralNumber = (index: number, value: string) => {
    const newNumbers = [...formData.cadastralNumbers]
    newNumbers[index] = value
    setFormData({
      ...formData,
      cadastralNumbers: newNumbers
    })
  }

  const addCadastralCost = () => {
    setFormData({
      ...formData,
      cadastralCosts: [...formData.cadastralCosts, '']
    })
  }

  const removeCadastralCost = (index: number) => {
    setFormData({
      ...formData,
      cadastralCosts: formData.cadastralCosts.filter((_, i) => i !== index)
    })
  }

  const updateCadastralCost = (index: number, value: string) => {
    const newCosts = [...formData.cadastralCosts]
    newCosts[index] = value
    setFormData({
      ...formData,
      cadastralCosts: newCosts
    })
  }

  const toggleInfrastructure = (item: string) => {
    const newSelected = infrastructureSelected.includes(item)
      ? infrastructureSelected.filter(i => i !== item)
      : [...infrastructureSelected, item]
    setInfrastructureSelected(newSelected)
    
    // Обновляем состояние формы
    setFormData({
      ...formData,
      infrastructure: newSelected
    })
  }

  const updateInfrastructureDistance = (item: string, distance: string) => {
    setFormData({
      ...formData,
      infrastructureDistances: {
        ...formData.infrastructureDistances,
        [item]: distance
      }
    })
  }

  const toggleFurniture = (item: string) => {
    const newFurniture = formData.furniture.includes(item)
      ? formData.furniture.filter(i => i !== item)
      : [...formData.furniture, item]
    setFormData({
      ...formData,
      furniture: newFurniture
    })
  }

  const toggleAppliances = (item: string) => {
    const newAppliances = formData.appliances.includes(item)
      ? formData.appliances.filter(i => i !== item)
      : [...formData.appliances, item]
    setFormData({
      ...formData,
      appliances: newAppliances
    })
  }

  const togglePets = (item: string) => {
    const newPets = formData.pets.includes(item)
      ? formData.pets.filter(i => i !== item)
      : [...formData.pets, item]
    setFormData({
      ...formData,
      pets: newPets
    })
  }

  const addAdditionalBuilding = () => {
    setFormData({
      ...formData,
      additionalBuildings: [...formData.additionalBuildings, '']
    })
  }

  const removeAdditionalBuilding = (index: number) => {
    setFormData({
      ...formData,
      additionalBuildings: formData.additionalBuildings.filter((_, i) => i !== index)
    })
  }

  const updateAdditionalBuilding = (index: number, value: string) => {
    const newBuildings = [...formData.additionalBuildings]
    newBuildings[index] = value
    setFormData({
      ...formData,
      additionalBuildings: newBuildings
    })
  }

  const shouldShowField = (fieldType: string) => {
    const { type } = formData
    switch (fieldType) {
      case 'roomType':
      case 'rooms':
      case 'bedrooms':
      case 'bathrooms':
      case 'layout':
      case 'renovation':
      case 'renovationDate':
      case 'windowSide':
      case 'view':
        return ['apartment', 'house'].includes(type)
      case 'ceilingHeight':
        return ['apartment', 'house', 'commercial', 'building', 'non-capital', 'share'].includes(type)
      case 'elevator':
        return ['apartment', 'commercial', 'building', 'share'].includes(type)
      case 'facade':
      case 'readiness':
      case 'houseType':
      case 'foundation':
      case 'constructionYear':
      case 'buildingFloors':
        return ['apartment', 'house', 'commercial', 'building', 'complex', 'non-capital', 'share'].includes(type)
      case 'apartmentsInHouse':
        return type === 'apartment'
      case 'apartmentFloor':
        return ['apartment', 'commercial'].includes(type)
      case 'basement':
        return ['apartment', 'house', 'commercial', 'building', 'complex', 'share'].includes(type)
      case 'attic':
        return ['apartment', 'house', 'building'].includes(type)
      case 'additionalBuildings':
        return type === 'house'
      case 'heatingType':
      case 'heatingDevices':
        return ['apartment', 'house', 'commercial', 'building', 'complex', 'non-capital', 'share'].includes(type)
      case 'officeZone':
      case 'temperatureMode':
        return ['commercial', 'building', 'complex', 'non-capital'].includes(type)
      case 'smoking':
        return ['apartment', 'commercial', 'share'].includes(type)
      case 'furniture':
      case 'appliances':
        return ['apartment', 'house'].includes(type)
      case 'landscape':
        return type === 'land'
      case 'fenceType':
        return ['house', 'complex', 'non-capital', 'land'].includes(type)
      case 'greenPlantings':
        return ['house', 'land'].includes(type)
      case 'territorialZone':
      case 'useType':
        return ['house', 'building', 'complex', 'non-capital', 'land'].includes(type)
      case 'developer':
        return ['apartment', 'house'].includes(type)
      case 'ddu':
        return type === 'apartment'
      case 'mortgage':
        return ['apartment', 'house', 'land'].includes(type)
      case 'subsidies':
        return ['apartment', 'house'].includes(type)
      case 'additionalPayment':
        return formData.operation === 'rent'
      case 'ownersCount':
        return type === 'share'
      case 'balcony':
        return type === 'apartment'
      case 'windows':
        return ['apartment', 'house'].includes(type)
      case 'houseTypeBuilding':
        return ['apartment', 'house', 'building'].includes(type)
      case 'videoSurveillance':
        return ['apartment', 'house', 'building', 'complex'].includes(type)
      case 'concierge':
        return type === 'apartment'
      case 'playground':
        return type === 'apartment'
      case 'temperatureBySeasons':
      case 'airHumidity':
      case 'airPollution':
      case 'noiseLevel':
        return ['apartment', 'house'].includes(type)
      case 'formShape':
        return ['house', 'building', 'complex', 'non-capital', 'land'].includes(type)
      case 'relief':
        return type === 'land'
      case 'buildingsCount':
        return type === 'complex'
      case 'buildingTypeComplex':
        return type === 'complex'
      case 'depositSize':
      case 'unavailableDates':
      case 'pets':
      case 'rentalPeriod':
        return formData.operation === 'rent'
      case 'seaDistance':
        return formData.country === 'thailand'
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex justify-end mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Админ панель</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/objects">Объекты</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Добавить объект</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Страна
                </Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страну" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Операция
                </Label>
                <Select value={formData.operation} onValueChange={(value) => setFormData({...formData, operation: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите операцию" />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATIONS.map((operation) => (
                      <SelectItem key={operation.id} value={operation.id}>
                        {operation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип объекта
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип объекта" />
                  </SelectTrigger>
                  <SelectContent>
                    {OBJECT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Адрес
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Введите адрес"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Район
                </Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  placeholder="Введите район"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Цена
                </Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Введите цену"
                />
              </div>
            </div>

            {/* Dynamic Area Fields */}
            {formData.type && (
              <div className="mt-4">
                <h4 className="text-md font-medium mb-3">Площадь</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getAreaFields(formData.type).map((field) => (
                    <div key={field.id}>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </Label>
                      <Input
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Основные характеристики */}
          {shouldShowField('roomType') && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Основные характеристики</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Тип помещения
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.roomType} onValueChange={(value) => setFormData({...formData, roomType: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите тип помещения" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.roomType === 'other' && (
                      <Input
                        value={formData.roomTypeOther}
                        onChange={(e) => setFormData({...formData, roomTypeOther: e.target.value})}
                        placeholder="Укажите тип"
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Комнат
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.rooms} onValueChange={(value) => setFormData({...formData, rooms: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите количество" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOMS_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.rooms === 'other' && (
                      <Input
                        value={formData.roomsOther}
                        onChange={(e) => setFormData({...formData, roomsOther: e.target.value})}
                        placeholder="Укажите количество"
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Спален
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.bedrooms} onValueChange={(value) => setFormData({...formData, bedrooms: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите количество" />
                      </SelectTrigger>
                      <SelectContent>
                        {BEDROOMS_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.bedrooms === 'other' && (
                      <Input
                        value={formData.bedroomsOther}
                        onChange={(e) => setFormData({...formData, bedroomsOther: e.target.value})}
                        placeholder="Укажите количество"
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Санузлов
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.bathrooms} onValueChange={(value) => setFormData({...formData, bathrooms: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите количество" />
                      </SelectTrigger>
                      <SelectContent>
                        {BATHROOMS_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.bathrooms === 'other' && (
                      <Input
                        value={formData.bathroomsOther}
                        onChange={(e) => setFormData({...formData, bathroomsOther: e.target.value})}
                        placeholder="Укажите количество"
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Высота потолков
                  </Label>
                  <Input
                    value={formData.ceilingHeight}
                    onChange={(e) => setFormData({...formData, ceilingHeight: e.target.value})}
                    placeholder="м"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Планировка
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.layout} onValueChange={(value) => setFormData({...formData, layout: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите планировку" />
                      </SelectTrigger>
                      <SelectContent>
                        {LAYOUT_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.layout === 'other' && (
                      <Input
                        value={formData.layoutOther}
                        onChange={(e) => setFormData({...formData, layoutOther: e.target.value})}
                        placeholder="Укажите планировку"
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Ремонт
                  </Label>
                  <Select value={formData.renovation} onValueChange={(value) => setFormData({...formData, renovation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип ремонта" />
                    </SelectTrigger>
                    <SelectContent>
                      {RENOVATION_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Дата завершения ремонта
                  </Label>
                  <Input
                    value={formData.renovationDate}
                    onChange={(e) => setFormData({...formData, renovationDate: e.target.value})}
                    placeholder="DD.MM.YYYY"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Сторона окон
                  </Label>
                  <Select value={formData.windowSide} onValueChange={(value) => setFormData({...formData, windowSide: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите сторону" />
                    </SelectTrigger>
                    <SelectContent>
                      {WINDOW_SIDE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Вид из окон
                  </Label>
                  <Select value={formData.view} onValueChange={(value) => setFormData({...formData, view: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вид" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIEW_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Мебель и бытовая техника */}
          {shouldShowField('furniture') && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Мебель и бытовая техника</h3>
              
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="furniture">
                  <AccordionTrigger>Мебель</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FURNITURE_OPTIONS.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Switch
                            id={`furniture-${item.id}`}
                            checked={formData.furniture.includes(item.id)}
                            onCheckedChange={() => toggleFurniture(item.id)}
                          />
                          <Label htmlFor={`furniture-${item.id}`} className="text-sm">
                            {item.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="appliances">
                  <AccordionTrigger>Бытовая техника</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {APPLIANCES_OPTIONS.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Switch
                            id={`appliances-${item.id}`}
                            checked={formData.appliances.includes(item.id)}
                            onCheckedChange={() => toggleAppliances(item.id)}
                          />
                          <Label htmlFor={`appliances-${item.id}`} className="text-sm">
                            {item.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* Инфраструктура */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Инфраструктура</h3>
            
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="infrastructure">
                <AccordionTrigger>Инфраструктура</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {INFRASTRUCTURE_OPTIONS.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Switch
                          id={`infrastructure-${item.id}`}
                          checked={infrastructureSelected.includes(item.id)}
                          onCheckedChange={() => toggleInfrastructure(item.id)}
                        />
                        <Label htmlFor={`infrastructure-${item.id}`} className="text-sm">
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Расстояния для выбранных элементов */}
                  {infrastructureSelected.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <h4 className="text-md font-medium mb-3">Расстояния</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {infrastructureSelected.map((itemId) => {
                          const item = INFRASTRUCTURE_OPTIONS.find(i => i.id === itemId)
                          return (
                            <div key={itemId} className="flex items-center space-x-2">
                              <Label className="text-sm font-medium min-w-0 flex-1">
                                {item?.name}
                              </Label>
                              <Input
                                value={formData.infrastructureDistances[itemId] || ''}
                                onChange={(e) => updateInfrastructureDistance(itemId, e.target.value)}
                                placeholder="км"
                                className="w-20"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Кадастровые данные */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Кадастровые данные</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Кадастровый номер
                </Label>
                <div className="space-y-2">
                  {formData.cadastralNumbers.map((number, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={number}
                        onChange={(e) => updateCadastralNumber(index, e.target.value)}
                        placeholder="Введите кадастровый номер"
                        className="flex-1"
                      />
                      {formData.cadastralNumbers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCadastralNumber(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCadastralNumber}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Добавить
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Кадастровая стоимость
                </Label>
                <div className="space-y-2">
                  {formData.cadastralCosts.map((cost, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={cost}
                        onChange={(e) => updateCadastralCost(index, e.target.value)}
                        placeholder="Введите кадастровую стоимость"
                        className="flex-1"
                      />
                      {formData.cadastralCosts.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCadastralCost(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCadastralCost}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Недоступные даты (только для аренды) */}
          {formData.operation === 'rent' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Недоступные даты</h3>
              <Calendar
                mode="range"
                selected={formData.unavailableDates}
                onSelect={(range) => setFormData({...formData, unavailableDates: range || undefined})}
                className="rounded-lg border shadow-sm"
              />
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Отменить
            </Button>
            <Button>
              Создать объект
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}