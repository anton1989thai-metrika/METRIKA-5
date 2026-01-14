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
