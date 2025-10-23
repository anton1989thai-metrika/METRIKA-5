import { FieldRow, FilterState } from '@/types/realEstateForm';

// Функция фильтрации полей согласно точной спецификации
export function filterFields(rows: FieldRow[], filters: FilterState): FieldRow[] {
  let filteredRows = [...rows];
  
  // Фильтр по стране
  if (filters.country) {
    filteredRows = filteredRows.filter(row => 
      row.countries.includes(filters.country!)
    );
  }
  
  // Фильтр по операции
  if (filters.operation) {
    filteredRows = filteredRows.filter(row => 
      row.operations.includes(filters.operation!)
    );
  }
  
  // Фильтр по типу объекта
  if (filters.objectType) {
    filteredRows = filteredRows.filter(row => 
      row.objectTypes.includes('Все') || row.objectTypes.includes(filters.objectType!)
    );
  }
  
  return filteredRows;
}

// Функция для получения эталонных результатов для тестирования
export function getExpectedResults() {
  return {
    // Россия → Аренда → Земельный участок
    russiaRentLand: [23, 24, 27, 28, 29, 35, 36, 37, 39, 40, 46, 47, 48, 49, 52, 53, 54, 55, 59, 60, 62, 64, 67, 75, 76, 77, 78],
    
    // Россия → Аренда (все поля)
    russiaRent: [1, 2, 3, 4, 6, 7, 9, 10, 11, 16, 17, 19, 22, 25, 26, 28, 30, 31, 32, 33, 34, 37, 38, 40, 42, 45, 53, 56, 58, 59, 63, 67, 68, 69, 70, 75, 78, 81, 82, 83, 84],
    
    // Россия (все поля кроме исключений 41, 71-74)
    russiaAll: Array.from({length: 84}, (_, i) => i + 1).filter(id => ![41, 71, 72, 73, 74].includes(id))
  };
}

// Функция для валидации результатов
export function validateResults(actualIds: number[], expectedIds: number[]): {
  isValid: boolean;
  missing: number[];
  extra: number[];
} {
  const actualSet = new Set(actualIds);
  const expectedSet = new Set(expectedIds);
  
  const missing = expectedIds.filter(id => !actualSet.has(id));
  const extra = actualIds.filter(id => !expectedSet.has(id));
  
  return {
    isValid: missing.length === 0 && extra.length === 0,
    missing,
    extra
  };
}
