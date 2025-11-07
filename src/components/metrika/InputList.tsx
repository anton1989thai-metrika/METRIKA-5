"use client";

import { useState } from 'react';

export default function InputList() {
  const [fields, setFields] = useState<string[]>(['']);

  const handleChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const addField = () => {
    setFields(prev => [...prev, '']);
  };

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='w-full flex flex-col gap-3'>
      {fields.map((field, index) => (
        <div key={index} className='flex items-center gap-2'>
          <input
            type='text'
            value={field}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Введите ссылку ${index + 1}`}
            className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200'
          />
          {fields.length > 1 && (
            <button
              onClick={() => removeField(index)}
              className='text-muted-foreground hover:text-destructive text-xl font-bold transition'
              title='Удалить поле'
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className='pt-2'>
        <button
          onClick={addField}
          className='w-full md:w-auto px-4 py-2 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition duration-200'
        >
          + Добавить ссылку
        </button>
      </div>
    </div>
  );
}

