import { FieldRow } from '@/types/realEstateForm';

// Парсинг CSV строки в массив значений
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Парсинг списка значений (разделенных запятыми)
function parseList(value: string): string[] {
  if (!value || value.trim() === '') return [];
  return value.split(',').map(item => item.trim()).filter(item => item !== '');
}

// Парсинг опций из строки описания
function parseOptions(description: string): Array<{ id: string; name: string }> {
  const options: Array<{ id: string; name: string }> = [];
  
  // Ищем паттерн опций в скобках
  const match = description.match(/\(([^)]+)\)/);
  if (match) {
    const optionsText = match[1];
    const optionItems = optionsText.split(',').map(item => item.trim());
    
    optionItems.forEach(item => {
      if (item === 'Другое') {
        options.push({ id: 'other', name: 'Другое' });
      } else {
        const id = item.toLowerCase().replace(/\s+/g, '_');
        options.push({ id, name: item });
      }
    });
  }
  
  return options;
}

// Определение типа контроля из описания
function parseControlType(description: string): FieldRow['control'] {
  if (description.includes('MultiSelect + Input')) return 'MultiSelect+Input';
  if (description.includes('MultiSelect')) return 'MultiSelect';
  if (description.includes('Select + Input')) return 'Select+Input';
  if (description.includes('Select')) return 'Select';
  if (description.includes('Input')) return 'Input';
  if (description.includes('Calendar') || description.includes('даты')) return 'Calendar';
  return 'Input';
}

// Определение автоматических единиц измерения
function parseAutoUnit(description: string): string | undefined {
  if (description.includes('«м»')) return 'м';
  if (description.includes('км')) return 'км';
  if (description.includes('кВт')) return 'кВт';
  if (description.includes('м²')) return 'м²';
  return undefined;
}

// Парсинг CSV файла в массив FieldRow
export function parseCSVToFieldRows(csvContent: string): FieldRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  const headers = parseCSVLine(lines[0]);
  const rows: FieldRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 6) continue;
    
    const id = parseInt(values[0].replace(/[^\d]/g, '')) || i;
    const category = values[1];
    const description = values[2];
    const objectTypesStr = values[3];
    const operationsStr = values[4];
    const countriesStr = values[5];
    
    const fieldRow: FieldRow = {
      id,
      category,
      control: parseControlType(description),
      objectTypes: parseList(objectTypesStr),
      operations: parseList(operationsStr),
      countries: parseList(countriesStr),
      options: parseOptions(description),
      otherInput: description.includes('Другое'),
      autoUnit: parseAutoUnit(description),
      nestedInputs: description.includes('при выборе') && description.includes('появляется'),
      notes: description
    };
    
    rows.push(fieldRow);
  }
  
  return rows;
}

// Функция фильтрации полей согласно спецификации
export function filterFields(rows: FieldRow[], filters: { country?: string; operation?: string; objectType?: string }): FieldRow[] {
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
