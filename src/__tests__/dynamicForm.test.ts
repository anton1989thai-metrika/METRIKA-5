import { FieldRow } from '@/types/realEstateForm';
import { FIELD_ROWS } from '@/data/fieldRows';
import { filterFields, getExpectedResults, validateResults } from '@/lib/fieldFilter';

// Тесты для проверки эталонных случаев
describe('Dynamic Real Estate Form Filtering', () => {
  describe('Россия → Аренда', () => {
    test('должен показать правильные поля для аренды в России', () => {
      const filters = { country: 'Россия', operation: 'Аренда' };
      const result = filterFields(FIELD_ROWS, filters);
      const resultIds = result.map(f => f.id).sort((a, b) => a - b);
      
      const expected = getExpectedResults().russiaRent;
      const validation = validateResults(resultIds, expected);
      
      expect(validation.isValid).toBe(true);
      if (!validation.isValid) {
        console.log('Отсутствующие поля:', validation.missing);
        console.log('Лишние поля:', validation.extra);
      }
    });
  });
  
  describe('Россия → Аренда → Земельный участок', () => {
    test('должен показать правильные поля для аренды земельного участка в России', () => {
      const filters = { country: 'Россия', operation: 'Аренда', objectType: 'Земельный участок' };
      const result = filterFields(FIELD_ROWS, filters);
      const resultIds = result.map(f => f.id).sort((a, b) => a - b);
      
      const expected = getExpectedResults().russiaRentLand;
      const validation = validateResults(resultIds, expected);
      
      expect(validation.isValid).toBe(true);
      if (!validation.isValid) {
        console.log('Отсутствующие поля:', validation.missing);
        console.log('Лишние поля:', validation.extra);
      }
    });
  });
  
  describe('Россия (все поля)', () => {
    test('должен показать все поля для России кроме исключений', () => {
      const filters = { country: 'Россия' };
      const result = filterFields(FIELD_ROWS, filters);
      const resultIds = result.map(f => f.id).sort((a, b) => a - b);
      
      const expected = getExpectedResults().russiaAll;
      const validation = validateResults(resultIds, expected);
      
      expect(validation.isValid).toBe(true);
      if (!validation.isValid) {
        console.log('Отсутствующие поля:', validation.missing);
        console.log('Лишние поля:', validation.extra);
      }
    });
  });
  
  describe('Поля с типом "Все"', () => {
    test('должны показываться для всех типов объектов', () => {
      const allFields = FIELD_ROWS.filter(f => f.objectTypes.includes('Все'));
      
      OBJECT_TYPES.forEach(objectType => {
        const filters = { country: 'Россия', operation: 'Продажа', objectType };
        const result = filterFields(FIELD_ROWS, filters);
        
        allFields.forEach(field => {
          expect(result).toContainEqual(expect.objectContaining({ id: field.id }));
        });
      });
    });
  });
  
  describe('Исключения для России', () => {
    test('поля 41, 71-74 не должны показываться для России', () => {
      const filters = { country: 'Россия' };
      const result = filterFields(FIELD_ROWS, filters);
      const resultIds = result.map(f => f.id);
      
      expect(resultIds).not.toContain(41); // Удалённость от моря
      expect(resultIds).not.toContain(71); // Температура по сезонам
      expect(resultIds).not.toContain(72); // Влажность воздуха
      expect(resultIds).not.toContain(73); // Загрязнение воздуха
      expect(resultIds).not.toContain(74); // Шумовой фон
    });
  });
  
  describe('Поля только для аренды', () => {
    test('поля аренды должны показываться только при операции "Аренда"', () => {
      const rentFields = FIELD_ROWS.filter(f => 
        f.operations.includes('Аренда') && !f.operations.includes('Продажа')
      );
      
      const saleFilters = { country: 'Россия', operation: 'Продажа', objectType: 'Квартира' };
      const rentFilters = { country: 'Россия', operation: 'Аренда', objectType: 'Квартира' };
      
      const saleResult = filterFields(FIELD_ROWS, saleFilters);
      const rentResult = filterFields(FIELD_ROWS, rentFilters);
      
      rentFields.forEach(field => {
        expect(saleResult).not.toContainEqual(expect.objectContaining({ id: field.id }));
        expect(rentResult).toContainEqual(expect.objectContaining({ id: field.id }));
      });
    });
  });
});

// Константы для тестов
const OBJECT_TYPES = [
  'Квартира',
  'Частный дом',
  'Коммерческое помещение',
  'Здание',
  'Имущественный комплекс',
  'Некапитальный объект',
  'Доля в праве',
  'Земельный участок'
];
