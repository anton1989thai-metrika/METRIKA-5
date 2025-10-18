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

// Основные характеристики

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

const RIGHT_TYPE_OPTIONS = [
  { id: 'ownership', name: 'Собственность' },
  { id: 'rent', name: 'Аренда' },
  { id: 'ownership-rent', name: 'Собственность + Аренда' },
  { id: 'sublease', name: 'Субаренда' },
  { id: 'other', name: 'Иное' }
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

const FORM_SHAPE_OPTIONS = [
  { id: 'regular', name: 'Правильная' },
  { id: 'irregular', name: 'Неправильная' },
  { id: 'corner', name: 'Угловая' },
  { id: 'other', name: 'Другое' }
]



const ELECTRICITY_OPTIONS = [
  { id: '220', name: '220В' },
  { id: '380', name: '380В' }
]

const HEATING_TYPE_OPTIONS = [
  { id: 'electric', name: 'Электрическое' },
  { id: 'solid', name: 'Твердотопливное' },
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

const COLD_WATER_OPTIONS = [
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

// Инфраструктурные поля
const PARKING_OPTIONS = [
  { id: 'surface', name: 'Наземная' },
  { id: 'garage', name: 'Гараж' },
  { id: 'canopy', name: 'Навес' },
  { id: 'separate', name: 'Отдельное здание' }
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
  { id: 'rural', name: 'Село' },
  { id: 'nature', name: 'Природная зона' },
  { id: 'industrial', name: 'Промзона' },
  { id: 'other', name: 'Иное' }
]

const TRAFFIC_LEVEL_OPTIONS = [
  { id: 'low', name: 'Низкий' },
  { id: 'medium', name: 'Средний' },
  { id: 'high', name: 'Высокий' }
]

const VR_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

// Кадастровые поля
const TERRITORIAL_ZONE_OPTIONS = [
  { id: 'residential', name: 'Жилая зона' },
  { id: 'commercial', name: 'Коммерческая зона' },
  { id: 'industrial', name: 'Промышленная зона' },
  { id: 'agricultural', name: 'Сельскохозяйственная зона' },
  { id: 'recreational', name: 'Рекреационная зона' },
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

// Поля для аренды
const DEPOSIT_SIZE_OPTIONS = [
  { id: '1-month', name: 'В размере 1 месяца' },
  { id: '2-months', name: '2 месяцев' },
  { id: '3-months', name: '3 месяцев' },
  { id: 'none', name: 'Без депозита' },
  { id: 'custom', name: 'Другое' }
]

const PET_TYPES_OPTIONS = [
  { id: 'dogs', name: 'Собаки' },
  { id: 'cats', name: 'Кошки' },
  { id: 'large-animals', name: 'Другие крупные животные' },
  { id: 'small-animals', name: 'Другие мелкие животные' }
]

const RENTAL_PERIOD_OPTIONS = [
  { id: 'up-to-1-month', name: 'До 1 месяца' },
  { id: '1-3-months', name: '1–3 месяца' },
  { id: '3-6-months', name: '3–6 месяцев' },
  { id: '6-12-months', name: '6–12 месяцев' },
  { id: 'more-than-year', name: 'Более года' }
]

// Основные характеристики
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
  { id: 'custom', name: 'Ввести' }
]

const BEDROOMS_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: 'custom', name: 'Ввести' }
]

const BATHROOMS_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: 'custom', name: 'Ввести' }
]

const LAYOUT_OPTIONS = [
  { id: 'studio', name: 'Студия' },
  { id: 'separate', name: 'Раздельные комнаты' },
  { id: 'free', name: 'Свободная планировка' },
  { id: 'other', name: 'Другое' }
]

const RENOVATION_OPTIONS = [
  { id: 'none', name: 'Без отделки' },
  { id: 'in-progress', name: 'В состоянии ремонта' },
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
  { id: 'courtyard', name: 'Во двор' }
]

// Характеристики здания
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
  { id: 'fiber-cement', name: 'Фиброцементный' },
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

const HOUSE_TYPE_BUILDING_OPTIONS = [
  { id: 'secondary', name: 'Вторичное жильё' },
  { id: 'new-building', name: 'Новостройка' }
]

const ADDITIONAL_BUILDINGS_OPTIONS = [
  { id: 'garage', name: 'Гараж' },
  { id: 'shed', name: 'Сарай' },
  { id: 'bathhouse', name: 'Баня' },
  { id: 'greenhouse', name: 'Теплица' },
  { id: 'other', name: 'Другое' }
]

// Поля участка
const LANDSCAPE_OPTIONS = [
  { id: 'flat', name: 'Ровный' },
  { id: 'hilly', name: 'Холмистый' },
  { id: 'mountainous', name: 'Горный' },
  { id: 'sloping', name: 'Склон' },
  { id: 'other', name: 'Другое' }
]

const FENCE_TYPE_OPTIONS = [
  { id: 'none', name: 'Нет' },
  { id: 'wood', name: 'Деревянный' },
  { id: 'metal', name: 'Металлический' },
  { id: 'brick', name: 'Кирпичный' },
  { id: 'concrete', name: 'Бетонный' },
  { id: 'hedge', name: 'Живая изгородь' },
  { id: 'other', name: 'Другое' }
]

const GREEN_PLANTINGS_OPTIONS = [
  { id: 'none', name: 'Нет' },
  { id: 'minimal', name: 'Минимальные' },
  { id: 'moderate', name: 'Умеренные' },
  { id: 'extensive', name: 'Обширные' },
  { id: 'other', name: 'Другое' }
]

// Кадастровые поля
const DEVELOPER_OPTIONS = [
  { id: 'unknown', name: 'Неизвестно' },
  { id: 'other', name: 'Другое' }
]

const ENCUMBRANCES_OPTIONS = [
  { id: 'none', name: 'Нет' },
  { id: 'mortgage', name: 'Ипотека' },
  { id: 'arrest', name: 'Арест' },
  { id: 'lease', name: 'Аренда' },
  { id: 'other', name: 'Другое' }
]

const RELIEF_OPTIONS = [
  { id: 'flat', name: 'Ровный' },
  { id: 'sloped', name: 'С уклоном' },
  { id: 'uneven', name: 'Неровный' },
  { id: 'other', name: 'Другое' }
]

const DDU_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const MORTGAGE_OPTIONS = [
  { id: 'yes', name: 'Есть' },
  { id: 'no', name: 'Нет' }
]

const OWNERS_COUNT_OPTIONS = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: 'more', name: 'Более 5' }
]

const BUILDING_TYPE_COMPLEX_OPTIONS = [
  { id: 'residential', name: 'Жилой комплекс' },
  { id: 'commercial', name: 'Торговый комплекс' },
  { id: 'office', name: 'Офисный комплекс' },
  { id: 'industrial', name: 'Промышленный комплекс' },
  { id: 'mixed', name: 'Смешанный комплекс' },
  { id: 'other', name: 'Другое' }
]

// Дополнительные константы для недостающих полей
const TEMPERATURE_BY_SEASONS_OPTIONS = [
  { id: 'stable', name: 'Стабильная' },
  { id: 'variable', name: 'Переменная' },
  { id: 'extreme', name: 'Экстремальная' }
]

const AIR_HUMIDITY_OPTIONS = [
  { id: 'low', name: 'Низкая' },
  { id: 'normal', name: 'Нормальная' },
  { id: 'high', name: 'Высокая' }
]

const AIR_POLLUTION_OPTIONS = [
  { id: 'low', name: 'Низкий' },
  { id: 'medium', name: 'Средний' },
  { id: 'high', name: 'Высокий' }
]

const NOISE_LEVEL_OPTIONS = [
  { id: 'low', name: 'Низкий' },
  { id: 'medium', name: 'Средний' },
  { id: 'high', name: 'Высокий' }
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
    operation: 'rent',
    type: 'apartment',
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
    // Дополнительные коммуникации
    intercom: '',
    security: '',
    videoSurveillance: '',
    concierge: '',
    playground: '',
    wiredInternet: '',
    // Мебель и техника
    furniture: [] as string[],
    appliances: [] as string[],
    // Инфраструктура
    infrastructure: [] as string[],
    infrastructureDistances: {} as Record<string, string>,
    parking: '',
    accessRoads: '',
    surroundingType: '',
    surroundingTypeOther: '',
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
    encumbrancesOther: '',
    balconyArea: '',
    useType: '',
    useTypeOther: '',
    windows: '',
    windowsOther: '',
    houseTypeBuilding: '',
    temperatureBySeasons: '',
    airHumidity: '',
    airPollution: '',
    noiseLevel: '',
    coordinates: '',
    formShape: '',
    formShapeOther: '',
    relief: '',
    reliefOther: '',
    buildingsCount: '',
    buildingTypeComplex: '',
    buildingTypeComplexOther: '',
    depositSize: '',
    depositSizeCustom: '',
    unavailableDates: undefined as DateRange | undefined,
    petsAllowed: [] as string[],
    rentalPeriod: '',
    // Новые поля
    landscape: '',
    landscapeOther: '',
    fenceType: '',
    fenceTypeOther: '',
    greenPlantings: '',
    greenPlantingsOther: '',
    seaDistance: '',
    developer: '',
    developerOther: '',
    ddu: '',
    mortgage: '',
    automotiveTraffic: '',
    territorialZoneOther: '',
    pricePerSquareMeter: '',
    rentPerSquareMeter: ''
  })

  const [infrastructureSelected, setInfrastructureSelected] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [areaFieldsData, setAreaFieldsData] = useState<Record<string, string>>({})

  // Валидация обязательных полей
  const validateRequiredFields = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.country) newErrors.country = 'Страна обязательна для заполнения'
    if (!formData.operation) newErrors.operation = 'Операция обязательна для заполнения'
    if (!formData.type) newErrors.type = 'Тип объекта обязателен для заполнения'
    if (!formData.address) newErrors.address = 'Адрес обязателен для заполнения'
    if (!formData.price) newErrors.price = 'Цена обязательна для заполнения'
    
    // Валидация полей площади
    const areaFields = getAreaFields(formData.type)
    areaFields.forEach(field => {
      if (!areaFieldsData[field.id]) {
        newErrors[field.id] = `${field.label} обязательна для заполнения`
      }
    })
    
    // Валидация кадастровых номеров (если заполнены)
    formData.cadastralNumbers.forEach((number, index) => {
      if (number && number.trim().length < 10) {
        newErrors[`cadastralNumber_${index}`] = 'Кадастровый номер должен содержать минимум 10 символов'
      }
    })
    
    // Валидация кадастровых стоимостей (если заполнены)
    formData.cadastralCosts.forEach((cost, index) => {
      if (cost && !isValidNumber(cost)) {
        newErrors[`cadastralCost_${index}`] = 'Введите корректную стоимость'
      }
    })
    
    // Валидация даты ремонта
    if (formData.renovationDate && !isValidDate(formData.renovationDate)) {
      newErrors.renovationDate = 'Неверный формат даты. Используйте DD.MM.YYYY'
    }
    
    // Валидация числовых полей
    if (formData.ceilingHeight && !isValidNumber(formData.ceilingHeight)) {
      newErrors.ceilingHeight = 'Введите корректное число'
    }
    
    if (formData.peakPower && !isValidNumber(formData.peakPower)) {
      newErrors.peakPower = 'Введите корректное число'
    }
    
    if (formData.constructionYear && !isValidYear(formData.constructionYear)) {
      newErrors.constructionYear = 'Введите корректный год (4 цифры)'
    }
    
    if (formData.buildingFloors && !isValidNumber(formData.buildingFloors)) {
      newErrors.buildingFloors = 'Введите корректное число'
    }
    
    if (formData.apartmentsInHouse && !isValidNumber(formData.apartmentsInHouse)) {
      newErrors.apartmentsInHouse = 'Введите корректное число'
    }
    
    if (formData.apartmentFloor && !isValidNumber(formData.apartmentFloor)) {
      newErrors.apartmentFloor = 'Введите корректное число'
    }
    
    // Валидация расстояний инфраструктуры
    Object.keys(formData.infrastructureDistances).forEach(key => {
      const distance = formData.infrastructureDistances[key]
      if (distance && !isValidNumber(distance)) {
        newErrors[`infrastructure_${key}`] = 'Введите корректное расстояние'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Валидация даты в формате DD.MM.YYYY
  const isValidDate = (dateString: string): boolean => {
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/
    const match = dateString.match(dateRegex)
    
    if (!match) return false
    
    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)
    
    if (day < 1 || day > 31) return false
    if (month < 1 || month > 12) return false
    if (year < 1900 || year > 2100) return false
    
    const date = new Date(year, month - 1, day)
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
  }

  // Валидация числа
  const isValidNumber = (value: string): boolean => {
    const num = parseFloat(value)
    return !isNaN(num) && isFinite(num) && num >= 0
  }

  // Валидация года
  const isValidYear = (value: string): boolean => {
    const year = parseInt(value, 10)
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 10
  }

  // Форматирование даты при вводе
  const formatDateInput = (value: string): string => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`
  }

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateRequiredFields()) {
      // Здесь будет логика отправки данных
      console.log('Форма валидна:', { formData, areaFieldsData })
      alert('Объект успешно создан!')
    } else {
      console.log('Ошибки валидации:', errors)
    }
  }

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
    const newPets = formData.petsAllowed.includes(item)
      ? formData.petsAllowed.filter(i => i !== item)
      : [...formData.petsAllowed, item]
    setFormData({
      ...formData,
      petsAllowed: newPets
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Страна *
                </Label>
                <Select value={formData.country} onValueChange={(value) => {
                  setFormData({...formData, country: value})
                  if (errors.country) {
                    setErrors({...errors, country: ''})
                  }
                }}>
                  <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
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
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Операция *
                </Label>
                <Select value={formData.operation} onValueChange={(value) => {
                  setFormData({...formData, operation: value})
                  if (errors.operation) {
                    setErrors({...errors, operation: ''})
                  }
                }}>
                  <SelectTrigger className={errors.operation ? 'border-red-500' : ''}>
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
                {errors.operation && <p className="text-red-500 text-sm mt-1">{errors.operation}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип объекта *
                </Label>
                <Select value={formData.type} onValueChange={(value) => {
                  setFormData({...formData, type: value})
                  if (errors.type) {
                    setErrors({...errors, type: ''})
                  }
                }}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
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
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Адрес *
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({...formData, address: e.target.value})
                    if (errors.address) {
                      setErrors({...errors, address: ''})
                    }
                  }}
                  placeholder="Введите адрес"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                  Цена *
                </Label>
                <Input
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({...formData, price: e.target.value})
                    if (errors.price) {
                      setErrors({...errors, price: ''})
                    }
                  }}
                  placeholder="Введите цену"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
                        {field.label} *
                      </Label>
                      <Input
                        value={areaFieldsData[field.id] || ''}
                        onChange={(e) => {
                          setAreaFieldsData({...areaFieldsData, [field.id]: e.target.value})
                          if (errors[field.id]) {
                            setErrors({...errors, [field.id]: ''})
                          }
                        }}
                        placeholder={field.placeholder}
                        className={errors[field.id] ? 'border-red-500' : ''}
                      />
                      {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Основные характеристики */}
          {shouldShowField('roomType') && (
            <div className="bg-gray-50 p-6 rounded-lg">
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
                    onChange={(e) => {
                      setFormData({...formData, ceilingHeight: e.target.value})
                      if (errors.ceilingHeight) {
                        setErrors({...errors, ceilingHeight: ''})
                      }
                    }}
                    placeholder="м"
                    className={errors.ceilingHeight ? 'border-red-500' : ''}
                  />
                  {errors.ceilingHeight && <p className="text-red-500 text-sm mt-1">{errors.ceilingHeight}</p>}
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
                    onChange={(e) => {
                      const formatted = formatDateInput(e.target.value)
                      setFormData({...formData, renovationDate: formatted})
                      if (errors.renovationDate) {
                        setErrors({...errors, renovationDate: ''})
                      }
                    }}
                    placeholder="DD.MM.YYYY"
                    className={errors.renovationDate ? 'border-red-500' : ''}
                  />
                  {errors.renovationDate && <p className="text-red-500 text-sm mt-1">{errors.renovationDate}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Строна окон
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

          {/* Характеристики здания */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Наличие лифта
                </Label>
                <Select value={formData.elevator} onValueChange={(value) => setFormData({...formData, elevator: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип лифта" />
                  </SelectTrigger>
                  <SelectContent>
                    {ELEVATOR_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Фасад
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.facade} onValueChange={(value) => setFormData({...formData, facade: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип фасада" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACADE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.facade === 'other' && (
                    <Input
                      value={formData.facadeOther}
                      onChange={(e) => setFormData({...formData, facadeOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Готовность объекта
                </Label>
                <Select value={formData.readiness} onValueChange={(value) => setFormData({...formData, readiness: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите готовность" />
                  </SelectTrigger>
                  <SelectContent>
                    {READINESS_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип дома
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.houseType} onValueChange={(value) => setFormData({...formData, houseType: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип дома" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOUSE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.houseType === 'other' && (
                    <Input
                      value={formData.houseTypeOther}
                      onChange={(e) => setFormData({...formData, houseTypeOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип фундамента
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.foundation} onValueChange={(value) => setFormData({...formData, foundation: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип фундамента" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOUNDATION_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.foundation === 'other' && (
                    <Input
                      value={formData.foundationOther}
                      onChange={(e) => setFormData({...formData, foundationOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Год постройки здания
                </Label>
                <Input
                  value={formData.constructionYear}
                  onChange={(e) => setFormData({...formData, constructionYear: e.target.value})}
                  placeholder="Год"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Этажность здания
                </Label>
                <Input
                  value={formData.buildingFloors}
                  onChange={(e) => setFormData({...formData, buildingFloors: e.target.value})}
                  placeholder="Количество этажей"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Количество квартир в доме
                </Label>
                <Input
                  value={formData.apartmentsInHouse}
                  onChange={(e) => setFormData({...formData, apartmentsInHouse: e.target.value})}
                  placeholder="Количество"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Этаж квартиры / помещения
                </Label>
                <Input
                  value={formData.apartmentFloor}
                  onChange={(e) => setFormData({...formData, apartmentFloor: e.target.value})}
                  placeholder="Номер этажа"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Подвал
                </Label>
                <Select value={formData.basement} onValueChange={(value) => setFormData({...formData, basement: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие подвала" />
                  </SelectTrigger>
                  <SelectContent>
                    {BASEMENT_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Мансарда
                </Label>
                <Select value={formData.attic} onValueChange={(value) => setFormData({...formData, attic: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие мансарды" />
                  </SelectTrigger>
                  <SelectContent>
                    {ATTIC_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Дополнительные постройки
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ADDITIONAL_BUILDINGS_OPTIONS.map((building) => (
                    <div key={building.id} className="flex items-center space-x-2">
                      <Switch
                        id={`building-${building.id}`}
                        checked={formData.additionalBuildings.includes(building.id)}
                        onCheckedChange={() => {
                          const newBuildings = formData.additionalBuildings.includes(building.id)
                            ? formData.additionalBuildings.filter(id => id !== building.id)
                            : [...formData.additionalBuildings, building.id]
                          setFormData({...formData, additionalBuildings: newBuildings})
                        }}
                      />
                      <Label htmlFor={`building-${building.id}`} className="text-sm">
                        {building.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.additionalBuildings.includes('other') && (
                  <Input
                    value={formData.additionalBuildingsOther}
                    onChange={(e) => setFormData({...formData, additionalBuildingsOther: e.target.value})}
                    placeholder="Укажите другие постройки"
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Дополнительные коммуникации */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Домофон
                </Label>
                <Select value={formData.intercom} onValueChange={(value) => setFormData({...formData, intercom: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип домофона" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERCOM_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Охрана
                </Label>
                <Select value={formData.security} onValueChange={(value) => setFormData({...formData, security: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие охраны" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECURITY_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Наружное видеонаблюдение
                </Label>
                <Select value={formData.videoSurveillance} onValueChange={(value) => setFormData({...formData, videoSurveillance: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие видеонаблюдения" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_SURVEILLANCE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Консьерж
                </Label>
                <Select value={formData.concierge} onValueChange={(value) => setFormData({...formData, concierge: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие консьержа" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONCIERGE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Детская площадка
                </Label>
                <Select value={formData.playground} onValueChange={(value) => setFormData({...formData, playground: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие детской площадки" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYGROUND_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Проводной интернет
                </Label>
                <Select value={formData.wiredInternet} onValueChange={(value) => setFormData({...formData, wiredInternet: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие проводного интернета" />
                  </SelectTrigger>
                  <SelectContent>
                    {WIRED_INTERNET_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Базовые коммуникации */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Электропитание
                </Label>
                <Select value={formData.electricity} onValueChange={(value) => setFormData({...formData, electricity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип электропитания" />
                  </SelectTrigger>
                  <SelectContent>
                    {ELECTRICITY_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Пиковая мощность (кВт)
                </Label>
                <Input
                  value={formData.peakPower}
                  onChange={(e) => setFormData({...formData, peakPower: e.target.value})}
                  placeholder="кВт"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип отопления
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.heatingType} onValueChange={(value) => setFormData({...formData, heatingType: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип отопления" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEATING_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.heatingType === 'other' && (
                    <Input
                      value={formData.heatingTypeOther}
                      onChange={(e) => setFormData({...formData, heatingTypeOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Отопительные приборы
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.heatingDevices} onValueChange={(value) => setFormData({...formData, heatingDevices: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип приборов" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEATING_DEVICES_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.heatingDevices === 'other' && (
                    <Input
                      value={formData.heatingDevicesOther}
                      onChange={(e) => setFormData({...formData, heatingDevicesOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Холодная вода
                </Label>
                <Select value={formData.coldWater} onValueChange={(value) => setFormData({...formData, coldWater: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип холодной воды" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLD_WATER_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Горячая вода
                </Label>
                <Select value={formData.hotWater} onValueChange={(value) => setFormData({...formData, hotWater: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип горячей воды" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOT_WATER_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип канализации
                </Label>
                <Select value={formData.sewerage} onValueChange={(value) => setFormData({...formData, sewerage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип канализации" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEWERAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Кондиционер
                </Label>
                <Select value={formData.airConditioning} onValueChange={(value) => setFormData({...formData, airConditioning: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите количество кондиционеров" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIR_CONDITIONING_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Система "умный дом"
                </Label>
                <Select value={formData.smartHome} onValueChange={(value) => setFormData({...formData, smartHome: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие системы" />
                  </SelectTrigger>
                  <SelectContent>
                    {SMART_HOME_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Технические характеристики */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Офисная зона
                </Label>
                <Select value={formData.officeZone} onValueChange={(value) => setFormData({...formData, officeZone: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус офисной зоны" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFICE_ZONE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Температурный режим помещения
                </Label>
                <Select value={formData.temperatureMode} onValueChange={(value) => setFormData({...formData, temperatureMode: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите температурный режим" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPERATURE_MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Курение
                </Label>
                <Select value={formData.smoking} onValueChange={(value) => setFormData({...formData, smoking: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите политику курения" />
                  </SelectTrigger>
                  <SelectContent>
                    {SMOKING_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Мебель и бытовая техника */}
          <div className="bg-gray-50 p-6 rounded-lg">
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
                          onCheckedChange={() => {
                            const newFurniture = formData.furniture.includes(item.id)
                              ? formData.furniture.filter(id => id !== item.id)
                              : [...formData.furniture, item.id]
                            setFormData({...formData, furniture: newFurniture})
                          }}
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
                          onCheckedChange={() => {
                            const newAppliances = formData.appliances.includes(item.id)
                              ? formData.appliances.filter(id => id !== item.id)
                              : [...formData.appliances, item.id]
                            setFormData({...formData, appliances: newAppliances})
                          }}
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

          {/* Дополнительные характеристики */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Балкон
                </Label>
                <Select value={formData.balcony} onValueChange={(value) => setFormData({...formData, balcony: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие балкона" />
                  </SelectTrigger>
                  <SelectContent>
                    {BALCONY_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.balcony === 'yes' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Площадь балкона
                  </Label>
                  <Input
                    value={formData.balconyArea}
                    onChange={(e) => setFormData({...formData, balconyArea: e.target.value})}
                    placeholder="м²"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Вид использования
                </Label>
                <Select value={formData.useType} onValueChange={(value) => setFormData({...formData, useType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип использования" />
                  </SelectTrigger>
                  <SelectContent>
                    {USE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.useType === 'other' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Другой тип использования
                  </Label>
                  <Input
                    value={formData.useTypeOther}
                    onChange={(e) => setFormData({...formData, useTypeOther: e.target.value})}
                    placeholder="Укажите тип использования"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Окна
                </Label>
                <Select value={formData.windows} onValueChange={(value) => setFormData({...formData, windows: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип окон" />
                  </SelectTrigger>
                  <SelectContent>
                    {WINDOWS_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.windows === 'other' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Другой тип окон
                  </Label>
                  <Input
                    value={formData.windowsOther}
                    onChange={(e) => setFormData({...formData, windowsOther: e.target.value})}
                    placeholder="Укажите тип окон"
                  />
                </div>
              )}


              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Температура по сезонам
                </Label>
                <Select value={formData.temperatureBySeasons} onValueChange={(value) => setFormData({...formData, temperatureBySeasons: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите температурный режим" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPERATURE_BY_SEASONS_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Влажность воздуха
                </Label>
                <Select value={formData.airHumidity} onValueChange={(value) => setFormData({...formData, airHumidity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень влажности" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIR_HUMIDITY_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Загрязнение воздуха
                </Label>
                <Select value={formData.airPollution} onValueChange={(value) => setFormData({...formData, airPollution: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень загрязнения" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIR_POLLUTION_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Шумовой фон
                </Label>
                <Select value={formData.noiseLevel} onValueChange={(value) => setFormData({...formData, noiseLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень шума" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOISE_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Координаты
                </Label>
                <Input
                  value={formData.coordinates}
                  onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                  placeholder="Широта, долгота"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Форма участка
                </Label>
                <Select value={formData.formShape} onValueChange={(value) => setFormData({...formData, formShape: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите форму участка" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORM_SHAPE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.formShape === 'other' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Другая форма участка
                  </Label>
                  <Input
                    value={formData.formShapeOther}
                    onChange={(e) => setFormData({...formData, formShapeOther: e.target.value})}
                    placeholder="Укажите форму участка"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Рельеф участка
                </Label>
                <Select value={formData.relief} onValueChange={(value) => setFormData({...formData, relief: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите рельеф" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELIEF_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.relief === 'other' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Другой рельеф
                  </Label>
                  <Input
                    value={formData.reliefOther}
                    onChange={(e) => setFormData({...formData, reliefOther: e.target.value})}
                    placeholder="Укажите рельеф"
                  />
                </div>
              )}


              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип забора
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.fenceType} onValueChange={(value) => setFormData({...formData, fenceType: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип забора" />
                    </SelectTrigger>
                    <SelectContent>
                      {FENCE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.fenceType === 'other' && (
                    <Input
                      value={formData.fenceTypeOther}
                      onChange={(e) => setFormData({...formData, fenceTypeOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Зелёные насаждения
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.greenPlantings} onValueChange={(value) => setFormData({...formData, greenPlantings: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите уровень насаждений" />
                    </SelectTrigger>
                    <SelectContent>
                      {GREEN_PLANTINGS_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.greenPlantings === 'other' && (
                    <Input
                      value={formData.greenPlantingsOther}
                      onChange={(e) => setFormData({...formData, greenPlantingsOther: e.target.value})}
                      placeholder="Укажите уровень"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Количество зданий
                </Label>
                <Input
                  value={formData.buildingsCount}
                  onChange={(e) => setFormData({...formData, buildingsCount: e.target.value})}
                  placeholder="Количество"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип зданий в комплексе
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.buildingTypeComplex} onValueChange={(value) => setFormData({...formData, buildingTypeComplex: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип комплекса" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUILDING_TYPE_COMPLEX_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.buildingTypeComplex === 'other' && (
                    <Input
                      value={formData.buildingTypeComplexOther}
                      onChange={(e) => setFormData({...formData, buildingTypeComplexOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>


              {formData.buildingTypeComplex === 'other' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Другой тип комплекса
                  </Label>
                  <Input
                    value={formData.buildingTypeComplexOther}
                    onChange={(e) => setFormData({...formData, buildingTypeComplexOther: e.target.value})}
                    placeholder="Укажите тип комплекса"
                  />
                </div>
              )}


              {/* Поля для аренды */}
              {formData.operation === 'rent' && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Недоступные даты
                    </Label>
                    <Calendar
                      mode="range"
                      selected={formData.unavailableDates}
                      onSelect={(range) => setFormData({...formData, unavailableDates: range})}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Аренда с питомцами
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PET_TYPES_OPTIONS.map((pet) => (
                        <div key={pet.id} className="flex items-center space-x-2">
                          <Switch
                            id={`pet-${pet.id}`}
                            checked={formData.petsAllowed.includes(pet.id)}
                            onCheckedChange={() => {
                              const newPets = formData.petsAllowed.includes(pet.id)
                                ? formData.petsAllowed.filter(id => id !== pet.id)
                                : [...formData.petsAllowed, pet.id]
                              setFormData({...formData, petsAllowed: newPets})
                            }}
                          />
                          <Label htmlFor={`pet-${pet.id}`} className="text-sm">
                            {pet.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Срок аренды
                    </Label>
                    <Select value={formData.rentalPeriod} onValueChange={(value) => setFormData({...formData, rentalPeriod: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите срок аренды" />
                      </SelectTrigger>
                      <SelectContent>
                        {RENTAL_PERIOD_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>


          {/* Инфраструктура */}
          <div className="bg-gray-50 p-6 rounded-lg">
            
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
                                onChange={(e) => {
                                  updateInfrastructureDistance(itemId, e.target.value)
                                  if (errors[`infrastructure_${itemId}`]) {
                                    setErrors({...errors, [`infrastructure_${itemId}`]: ''})
                                  }
                                }}
                                placeholder="км"
                                className={`w-20 ${errors[`infrastructure_${itemId}`] ? 'border-red-500' : ''}`}
                              />
                              {errors[`infrastructure_${itemId}`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`infrastructure_${itemId}`]}</p>
                              )}
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

          {/* Дополнительные инфраструктурные поля */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Парковка
                </Label>
                <Select value={formData.parking} onValueChange={(value) => setFormData({...formData, parking: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип парковки" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARKING_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Подъездные пути
                </Label>
                <Select value={formData.accessRoads} onValueChange={(value) => setFormData({...formData, accessRoads: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип подъездных путей" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_ROADS_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Тип окружения
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.surroundingType} onValueChange={(value) => setFormData({...formData, surroundingType: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите тип окружения" />
                    </SelectTrigger>
                    <SelectContent>
                      {SURROUNDING_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.surroundingType === 'other' && (
                    <Input
                      value={formData.surroundingTypeOther}
                      onChange={(e) => setFormData({...formData, surroundingTypeOther: e.target.value})}
                      placeholder="Укажите тип"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Удалённость от центра
                </Label>
                <Input
                  value={formData.centerDistance}
                  onChange={(e) => setFormData({...formData, centerDistance: e.target.value})}
                  placeholder="км"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Удалённость от моря
                </Label>
                <Input
                  value={formData.seaDistance}
                  onChange={(e) => setFormData({...formData, seaDistance: e.target.value})}
                  placeholder="км"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Пешеходный трафик
                </Label>
                <Select value={formData.pedestrianTraffic} onValueChange={(value) => setFormData({...formData, pedestrianTraffic: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень пешеходного трафика" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAFFIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Автомобильный трафик
                </Label>
                <Select value={formData.automotiveTraffic} onValueChange={(value) => setFormData({...formData, automotiveTraffic: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень автомобильного трафика" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAFFIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  VR
                </Label>
                <Select value={formData.vr} onValueChange={(value) => setFormData({...formData, vr: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие VR" />
                  </SelectTrigger>
                  <SelectContent>
                    {VR_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Кадастровые данные */}
          <div className="bg-gray-50 p-6 rounded-lg">
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Кадастровый номер
                </Label>
                <div className="space-y-2">
                  {formData.cadastralNumbers.map((number, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex gap-2">
                        <Input
                          value={number}
                          onChange={(e) => {
                            updateCadastralNumber(index, e.target.value)
                            if (errors[`cadastralNumber_${index}`]) {
                              setErrors({...errors, [`cadastralNumber_${index}`]: ''})
                            }
                          }}
                          placeholder="Введите кадастровый номер"
                          className={`flex-1 ${errors[`cadastralNumber_${index}`] ? 'border-red-500' : ''}`}
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
                      {errors[`cadastralNumber_${index}`] && (
                        <p className="text-red-500 text-sm">{errors[`cadastralNumber_${index}`]}</p>
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
                    <div key={index} className="space-y-1">
                      <div className="flex gap-2">
                        <Input
                          value={cost}
                          onChange={(e) => {
                            updateCadastralCost(index, e.target.value)
                            if (errors[`cadastralCost_${index}`]) {
                              setErrors({...errors, [`cadastralCost_${index}`]: ''})
                            }
                          }}
                          placeholder="Введите кадастровую стоимость"
                          className={`flex-1 ${errors[`cadastralCost_${index}`] ? 'border-red-500' : ''}`}
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
                      {errors[`cadastralCost_${index}`] && (
                        <p className="text-red-500 text-sm">{errors[`cadastralCost_${index}`]}</p>
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

          {/* Дополнительные кадастровые поля */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Территориальная зона
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.territorialZone} onValueChange={(value) => setFormData({...formData, territorialZone: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите территориальную зону" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRITORIAL_ZONE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.territorialZone === 'other' && (
                    <Input
                      value={formData.territorialZoneOther}
                      onChange={(e) => setFormData({...formData, territorialZoneOther: e.target.value})}
                      placeholder="Укажите зону"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Вид права
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.rightType} onValueChange={(value) => setFormData({...formData, rightType: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите вид права" />
                    </SelectTrigger>
                    <SelectContent>
                      {RIGHT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.rightType === 'other' && (
                    <Input
                      value={formData.rightTypeOther}
                      onChange={(e) => setFormData({...formData, rightTypeOther: e.target.value})}
                      placeholder="Укажите вид права"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Коммунальные платежи
                </Label>
                <Input
                  value={formData.utilities}
                  onChange={(e) => setFormData({...formData, utilities: e.target.value})}
                  placeholder="₽"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Налог
                </Label>
                <Input
                  value={formData.tax}
                  onChange={(e) => setFormData({...formData, tax: e.target.value})}
                  placeholder="₽"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Стоимость квадратного метра
                </Label>
                <Input
                  value={formData.pricePerSquareMeter}
                  onChange={(e) => setFormData({...formData, pricePerSquareMeter: e.target.value})}
                  placeholder="₽/м²"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Арендная плата за кв.м
                </Label>
                <Input
                  value={formData.rentPerSquareMeter}
                  onChange={(e) => setFormData({...formData, rentPerSquareMeter: e.target.value})}
                  placeholder="₽/м²"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Субсидии
                </Label>
                <Input
                  value={formData.subsidies}
                  onChange={(e) => setFormData({...formData, subsidies: e.target.value})}
                  placeholder="₽"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Торг
                </Label>
                <Select value={formData.bargaining} onValueChange={(value) => setFormData({...formData, bargaining: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите возможность торга" />
                  </SelectTrigger>
                  <SelectContent>
                    {BARGAINING_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Комиссия Метрики
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.commission} onValueChange={(value) => setFormData({...formData, commission: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите комиссию" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMISSION_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.commission === 'custom' && (
                    <Input
                      value={formData.commissionCustom}
                      onChange={(e) => setFormData({...formData, commissionCustom: e.target.value})}
                      placeholder="₽"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Застройщик
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.developer} onValueChange={(value) => setFormData({...formData, developer: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите застройщика" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVELOPER_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.developer === 'other' && (
                    <Input
                      value={formData.developerOther}
                      onChange={(e) => setFormData({...formData, developerOther: e.target.value})}
                      placeholder="Укажите застройщика"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  ДДУ
                </Label>
                <Select value={formData.ddu} onValueChange={(value) => setFormData({...formData, ddu: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие ДДУ" />
                  </SelectTrigger>
                  <SelectContent>
                    {DDU_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Ипотека
                </Label>
                <Select value={formData.mortgage} onValueChange={(value) => setFormData({...formData, mortgage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите наличие ипотеки" />
                  </SelectTrigger>
                  <SelectContent>
                    {MORTGAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Количество собственников
                </Label>
                <Select value={formData.ownersCount} onValueChange={(value) => setFormData({...formData, ownersCount: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите количество собственников" />
                  </SelectTrigger>
                  <SelectContent>
                    {OWNERS_COUNT_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Обременения
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.encumbrances} onValueChange={(value) => setFormData({...formData, encumbrances: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите обременения" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENCUMBRANCES_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.encumbrances === 'other' && (
                    <Input
                      value={formData.encumbrancesOther}
                      onChange={(e) => setFormData({...formData, encumbrancesOther: e.target.value})}
                      placeholder="Укажите обременения"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Вид дома
                </Label>
                <Select value={formData.houseTypeBuilding} onValueChange={(value) => setFormData({...formData, houseTypeBuilding: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вид дома" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOUSE_TYPE_BUILDING_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>


          {/* Дополнительные поля для аренды */}
          {formData.operation === 'rent' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Дополнительно оплачивается
                  </Label>
                  <Input
                    value={formData.additionalPayment}
                    onChange={(e) => setFormData({...formData, additionalPayment: e.target.value})}
                    placeholder="₽"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Размер депозита
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.depositSize} onValueChange={(value) => setFormData({...formData, depositSize: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите размер депозита" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPOSIT_SIZE_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.depositSize === 'custom' && (
                      <Input
                        value={formData.depositSizeCustom}
                        onChange={(e) => setFormData({...formData, depositSizeCustom: e.target.value})}
                        placeholder="₽"
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отменить
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
            >
              Создать объект
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}