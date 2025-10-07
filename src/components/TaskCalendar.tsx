"use client"

import React, { useState, useMemo } from 'react';
import { Task, PRIORITY_COLORS, STATUS_COLORS } from '@/types/task';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDateClick: (date: Date) => void;
  currentDate?: Date;
}

export default function TaskCalendar({ tasks, onTaskClick, onDateClick, currentDate = new Date() }: TaskCalendarProps) {
  const { t } = useLanguage();
  const [viewDate, setViewDate] = useState(currentDate);

  // Генерируем календарь на 2 месяца
  const calendarData = useMemo(() => {
    const months = [];
    const startDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    
    for (let i = 0; i < 2; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      
      // Первый день месяца
      const firstDay = new Date(year, month, 1);
      // Последний день месяца
      const lastDay = new Date(year, month + 1, 0);
      // Первый день недели (0 = воскресенье)
      const firstDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      // Добавляем пустые ячейки для начала месяца
      for (let j = 0; j < firstDayOfWeek; j++) {
        days.push(null);
      }
      
      // Добавляем дни месяца
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        days.push(date);
      }
      
      months.push({
        year,
        month,
        monthName: monthDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
        days
      });
    }
    
    return months;
  }, [viewDate]);

  // Получаем задачи для конкретной даты
  const getTasksForDate = (date: Date | null): Task[] => {
    if (!date) return [];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Проверяем, является ли дата сегодняшней
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Проверяем, является ли дата выходным
  const isWeekend = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6; // воскресенье или суббота
  };

  // Навигация по месяцам
  const goToPreviousMonth = () => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setViewDate(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Заголовок календаря */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors shadow-sm"
          >
            {t('tasks.today')}
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="text-lg font-semibold text-black">
          {calendarData[0]?.monthName} - {calendarData[1]?.monthName}
        </div>
      </div>

      {/* Календарная сетка */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-8">
          {calendarData.map((month, monthIndex) => (
            <div key={`${month.year}-${month.month}`} className="min-w-0">
              <h3 className="text-lg font-semibold text-black mb-4 text-center">
                {month.monthName}
              </h3>
              
              {/* Дни недели */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Календарная сетка */}
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((date, dayIndex) => {
                  const dayTasks = getTasksForDate(date);
                  const isCurrentDay = isToday(date);
                  const isWeekendDay = isWeekend(date);
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`
                        min-h-[80px] border border-gray-200 p-1 cursor-pointer
                        ${date ? 'hover:bg-gray-50' : 'bg-gray-50'}
                        ${isCurrentDay ? 'bg-yellow-50 border-yellow-300' : ''}
                        ${isWeekendDay ? 'bg-gray-50' : ''}
                      `}
                      onClick={() => date && onDateClick(date)}
                    >
                      {date && (
                        <>
                          {/* Номер дня */}
                          <div className={`
                            text-sm font-medium mb-1
                            ${isCurrentDay ? 'text-yellow-800' : 'text-black'}
                            ${isWeekendDay ? 'text-gray-500' : ''}
                          `}>
                            {date.getDate()}
                          </div>
                          
                          {/* Задачи */}
                          <div className="space-y-1">
                            {dayTasks.slice(0, 3).map(task => (
                              <div
                                key={task.id}
                                className="text-xs p-1 rounded cursor-pointer truncate"
                                style={{
                                  backgroundColor: PRIORITY_COLORS[task.priority],
                                  color: 'black'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskClick(task);
                                }}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            ))}
                            
                            {dayTasks.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayTasks.length - 3} {t('tasks.more')}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
