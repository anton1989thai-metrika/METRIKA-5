// Утилиты для миграции данных между старой и новой формой
import { FormData } from '@/config/form-rules'

// Маппинг полей между старой и новой формой
export const FIELD_MAPPING: Record<string, string> = {
  // Основные поля
  'country': 'country',
  'operation': 'operation', 
  'type': 'type',
  'address': 'address',
  'district': 'district',
  'price': 'price',
  
  // Основные характеристики
  'roomType': 'roomType',
  'rooms': 'rooms',
  'bedrooms': 'bedrooms',
  'bathrooms': 'bathrooms',
  'ceilingHeight': 'ceilingHeight',
  'layout': 'layout',
  'renovation': 'renovation',
  'renovationDate': 'renovationDate',
  'windowSide': 'windowSide',
  'view': 'view',
  
  // Информация о здании
  'elevator': 'elevator',
  'facade': 'facade',
  'readiness': 'readiness',
  'houseType': 'houseType',
  'foundation': 'foundation',
  'constructionYear': 'constructionYear',
  'buildingFloors': 'buildingFloors',
  'apartmentsInHouse': 'apartmentsInHouse',
  'apartmentFloor': 'apartmentFloor',
  'basement': 'basement',
  'attic': 'attic',
  'additionalBuildings': 'additionalBuildings',
  
  // Коммуникации
  'electricity': 'electricity',
  'peakPower': 'peakPower',
  'heatingType': 'heatingType',
  'heatingDevices': 'heatingDevices',
  'coldWater': 'coldWater',
  'hotWater': 'hotWater',
  'sewerage': 'sewerage',
  'airConditioning': 'airConditioning',
  'smartHome': 'smartHome',
  'officeZone': 'officeZone',
  'temperatureMode': 'temperatureMode',
  'smoking': 'smoking',
  
  // Дополнительные характеристики
  'furniture': 'furniture',
  'appliances': 'appliances',
  'landscape': 'landscape',
  'fenceType': 'fenceType',
  'greenPlantings': 'greenPlantings',
  'infrastructure': 'infrastructure',
  'parking': 'parking',
  'accessRoads': 'accessRoads',
  'surroundingType': 'surroundingType',
  'centerDistance': 'centerDistance',
  'pedestrianTraffic': 'pedestrianTraffic',
  'carTraffic': 'carTraffic',
  'vr': 'vr',
  
  // Кадастровые данные
  'cadastralNumbers': 'cadastralNumbers',
  'cadastralCosts': 'cadastralCosts',
  'territorialZone': 'territorialZone',
  'rightType': 'rightType',
  'developer': 'developer',
  'ddu': 'ddu',
  'mortgage': 'mortgage',
  'utilities': 'utilities',
  'tax': 'tax',
  'pricePerSqm': 'pricePerSqm',
  'rentPerSqm': 'rentPerSqm',
  'subsidies': 'subsidies',
  'additionalPayment': 'additionalPayment',
  'bargaining': 'bargaining',
  'commission': 'commission',
  'commissionCustom': 'commissionCustom',
  'ownersCount': 'ownersCount',
  'encumbrances': 'encumbrances',
  
  // Дополнительные поля
  'balcony': 'balcony',
  'balconyArea': 'balconyArea',
  'useType': 'useType',
  'windows': 'windows',
  'houseTypeBuilding': 'houseTypeBuilding',
  'intercom': 'intercom',
  'security': 'security',
  'videoSurveillance': 'videoSurveillance',
  'concierge': 'concierge',
  'playground': 'playground',
  'temperatureBySeasons': 'temperatureBySeasons',
  'airHumidity': 'airHumidity',
  'airPollution': 'airPollution',
  'noiseLevel': 'noiseLevel',
  'coordinates': 'coordinates',
  'formShape': 'formShape',
  'relief': 'relief',
  'wiredInternet': 'wiredInternet',
  'buildingsCount': 'buildingsCount',
  'buildingTypeComplex': 'buildingTypeComplex',
  'depositSize': 'depositSize',
  'depositSizeCustom': 'depositSizeCustom',
  'unavailableDates': 'unavailableDates',
  'petsAllowed': 'petsAllowed',
  'rentalPeriod': 'rentalPeriod',
  'seaDistance': 'seaDistance'
}

// Конвертация данных из старой формы в новую
export function migrateOldFormData(oldData: any): FormData {
  const newData: FormData = {}
  
  Object.entries(FIELD_MAPPING).forEach(([oldKey, newKey]) => {
    if (oldData[oldKey] !== undefined) {
      newData[newKey] = oldData[oldKey]
    }
  })
  
  return newData
}

// Конвертация данных из новой формы в старую
export function migrateNewFormData(newData: FormData): any {
  const oldData: any = {}
  
  Object.entries(FIELD_MAPPING).forEach(([oldKey, newKey]) => {
    if (newData[newKey] !== undefined) {
      oldData[oldKey] = newData[newKey]
    }
  })
  
  return oldData
}

// Валидация данных формы
export function validateFormData(data: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Проверка обязательных полей
  const requiredFields = ['country', 'operation', 'type', 'address', 'price']
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      errors.push(`Поле "${field}" обязательно для заполнения`)
    }
  })
  
  // Проверка числовых полей
  const numericFields = ['price', 'ceilingHeight', 'peakPower', 'constructionYear']
  
  numericFields.forEach(field => {
    if (data[field] && isNaN(Number(data[field]))) {
      errors.push(`Поле "${field}" должно содержать число`)
    }
  })
  
  // Проверка дат
  if (data.renovationDate && !isValidDate(data.renovationDate as string)) {
    errors.push('Неверный формат даты ремонта')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Проверка валидности даты
function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/
  if (!regex.test(dateString)) return false
  
  const [day, month, year] = dateString.split('.').map(Number)
  const date = new Date(year, month - 1, day)
  
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year
}

// Генерация уникального ID для объекта
export function generateObjectId(): string {
  return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Форматирование данных для отправки на сервер
export function formatDataForServer(data: FormData): any {
  return {
    id: generateObjectId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
