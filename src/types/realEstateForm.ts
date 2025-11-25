// Типы данных для динамической формы недвижимости
export interface FieldRow {
  id: number;
  category: string;
  control: 'Select' | 'Input' | 'MultiSelect' | 'Select+Input' | 'MultiSelect+Input' | 'Calendar';
  objectTypes: string[]; // Массив типов объектов или ['Все']
  operations: string[]; // Массив операций
  countries: string[]; // Массив стран
  options?: Array<{ id: string; name: string }>; // Опции для селектов
  otherInput?: boolean; // Показывать ли поле "Другое"
  autoUnit?: string; // Автоматическая единица измерения (м, км, кВт, м²)
  nestedInputs?: boolean; // Вложенные инпуты (например, для коммунальных платежей)
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    required?: boolean;
  };
  notes?: string; // Дополнительные заметки
}

export interface FilterState {
  country?: string;
  operation?: string;
  objectType?: string;
}

export interface FormData {
  [key: string]: any;
}

// Константы для типов объектов
export const OBJECT_TYPES = [
  'Квартира',
  'Частный дом', 
  'Коммерческое помещение',
  'Здание',
  'Имущественный комплекс',
  'Некапитальный объект',
  'Доля в праве',
  'Земельный участок'
] as const;

// Константы для операций
export const OPERATIONS = [
  'Продажа',
  'Аренда', 
  'Обмен'
] as const;

// Константы для стран
export const COUNTRIES = [
  'Россия',
  'Таиланд',
  'Китай',
  'Южная Корея'
] as const;
