import React, { useState } from 'react';
import { FieldRow, FormData } from '@/types/realEstateForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-fixed';
import { MultiSelect } from '@/components/MultiSelect';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface FieldRendererProps {
  field: FieldRow;
  value: any;
  onChange: (value: any) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const [otherValue, setOtherValue] = useState('');
  
  const renderField = () => {
    switch (field.control) {
      case 'Input':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id.toString()}>{field.category}</Label>
            <div className="relative">
              <Input
                id={field.id.toString()}
                type={field.validation?.pattern === '\\d+' ? 'number' : 'text'}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.autoUnit ? `Введите значение (${field.autoUnit})` : 'Введите значение'}
                pattern={field.validation?.pattern}
                min={field.validation?.min}
                max={field.validation?.max}
                className=""
              />
              {field.autoUnit && (
                <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {field.autoUnit}
                </span>
              )}
            </div>
          </div>
        );
        
      case 'Select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id.toString()}>{field.category}</Label>
            <div className="relative">
              <Select value={value || ''} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={`Выберите ${field.category.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="empty" value="__empty__">
                    —
                  </SelectItem>
                  {field.options?.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'Select+Input':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id.toString()}>{field.category}</Label>
            <div className="space-y-2">
              <Select value={value || ''} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={`Выберите ${field.category.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="empty" value="__empty__">
                    —
                  </SelectItem>
                  {field.options?.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {value === 'other' && field.otherInput && (
                <Input
                  placeholder="Введите свой вариант"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                />
              )}
            </div>
          </div>
        );
        
      case 'MultiSelect':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id.toString()}>{field.category}</Label>
            <div className="relative">
              <MultiSelect
                options={field.options || []}
                value={value || []}
                onValueChange={onChange}
                placeholder={`Выберите ${field.category.toLowerCase()}`}
              />
            </div>
          </div>
        );
        
      case 'MultiSelect+Input':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id.toString()}>{field.category}</Label>
            <div className="space-y-2">
              <MultiSelect
                options={field.options || []}
                value={value || []}
                onValueChange={onChange}
                placeholder={`Выберите ${field.category.toLowerCase()}`}
              />
              {value?.includes('other') && field.otherInput && (
                <Input
                  placeholder="Введите свой вариант"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                />
              )}
            </div>
          </div>
        );
        
      case 'Calendar':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id.toString()}>{field.category}</Label>
            <Calendar
              mode="multiple"
              selected={value || []}
              onSelect={onChange}
              className="rounded-md border"
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return <div className="space-y-2">{renderField()}</div>;
}

interface DynamicFormProps {
  fields: FieldRow[];
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (data: FormData) => void;
  onReset: () => void;
}

export function DynamicForm({ fields, formData, onFormDataChange, onSubmit, onReset }: DynamicFormProps) {
  const handleFieldChange = (fieldId: number, value: any) => {
    // Для обычных полей специальное значение становится undefined
    value = value === '__empty__' ? undefined : value;
    
    onFormDataChange({
      ...formData,
      [fieldId]: value
    });
  };
  
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Нет полей по текущим фильтрам</p>
        <Button onClick={onReset} variant="outline">
          Сбросить фильтры
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(field => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
          />
        ))}
      </div>
      
      <div className="flex gap-4 pt-6 justify-end">
        <Button type="button" variant="outline" onClick={onReset}>
          Сбросить
        </Button>
        <Button 
          type="submit"
          className="flex items-center gap-2"
          disabled={Object.keys(formData).length === 0}
        >
          <Save className="w-4 h-4" />
          Сохранить объект
        </Button>
      </div>
    </form>
  );
}
