"use client";

import { useState } from 'react';
import MetrikaSelect from '@/components/metrika/MetrikaSelect';

interface User {
  id: string;
  name: string;
  role: string;
}

interface ChecklistItem {
  id: number;
  action: string;
  curator: string;
  performer: string;
}

interface ChecklistProps {
  executorUsers: User[];
  curatorUsers: User[];
}

export default function Checklist({ executorUsers, curatorUsers }: ChecklistProps) {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, action: '', curator: '', performer: '' },
    { id: 2, action: '', curator: '', performer: '' },
    { id: 3, action: '', curator: '', performer: '' }
  ]);

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now(), action: '', curator: '', performer: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof ChecklistItem, value: string) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className='w-full space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium text-foreground'>Название чек-листа *</label>
        <input
          type='text'
          placeholder='Введите название чек-листа'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200'
        />
      </div>

      <div className='overflow-x-auto rounded-lg border border-border'>
        <table className='w-full border-collapse text-sm'>
          <thead className='bg-muted text-foreground'>
            <tr>
              <th className='p-3 text-left font-medium w-1/2'>Действие</th>
              <th className='p-3 text-left font-medium w-1/4'>Исполнитель</th>
              <th className='p-3 text-left font-medium w-1/4'>Куратор</th>
              <th className='p-3 w-10'></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className='border-t border-border hover:bg-muted/50 transition'>
                <td className='p-2'>
                  <input
                    type='text'
                    placeholder='Введите действие'
                    value={item.action}
                    onChange={(e) => updateItem(item.id, 'action', e.target.value)}
                    className='w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition'
                  />
                </td>
                <td className='p-2'>
                  <MetrikaSelect
                    value={item.performer}
                    onChange={(e) => updateItem(item.id, 'performer', e.target.value)}
                    className='h-auto py-1 text-sm'
                  >
                    <option value=''>Выберите</option>
                    {executorUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </MetrikaSelect>
                </td>
                <td className='p-2'>
                  <MetrikaSelect
                    value={item.curator}
                    onChange={(e) => updateItem(item.id, 'curator', e.target.value)}
                    className='h-auto py-1 text-sm'
                  >
                    <option value=''>Выберите</option>
                    {curatorUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </MetrikaSelect>
                </td>
                <td className='p-2 text-center'>
                  <button
                    onClick={() => removeItem(item.id)}
                    className='text-destructive hover:text-destructive/80 text-lg font-medium transition'
                    title='Удалить строку'
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex items-center justify-center border-t border-border bg-muted/30 p-3'>
          <button
            onClick={addItem}
            className='text-sm text-muted-foreground hover:text-foreground font-medium transition'
          >
            + Добавить строку
          </button>
        </div>
      </div>
    </div>
  );
}

