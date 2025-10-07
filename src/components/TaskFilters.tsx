"use client"

import React, { useState, useEffect } from 'react';
import { TaskFilter, TaskPriority, TaskStatus, TaskType } from '@/types/task';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilter) => void;
  initialFilters?: TaskFilter;
}

export default function TaskFilters({ onFiltersChange, initialFilters = {} }: TaskFiltersProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<TaskFilter>(initialFilters);

  // Состояния для каждого типа фильтра
  const [statusFilters, setStatusFilters] = useState<Record<TaskStatus, boolean>>({
    new: false,
    in_progress: false,
    review: false,
    completed: false,
    postponed: false,
    cancelled: false,
    overdue: false
  });

  const [priorityFilters, setPriorityFilters] = useState<Record<TaskPriority, boolean>>({
    low: false,
    medium: false,
    high: false,
    boss: false
  });

  const [typeFilters, setTypeFilters] = useState<Record<TaskType, boolean>>({
    simple: false,
    subtasks: false,
    project: false,
    recurring: false,
    with_files: false
  });

  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [creatorFilter, setCreatorFilter] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');
  const [dueDateFromFilter, setDueDateFromFilter] = useState<string>('');
  const [dueDateToFilter, setDueDateToFilter] = useState<string>('');
  const [tagsFilter, setTagsFilter] = useState<string>('');
  const [overdueFilter, setOverdueFilter] = useState<boolean>(false);

  // Обновляем фильтры при изменении состояния
  useEffect(() => {
    const newFilters: TaskFilter = {};

    // Статусы
    const selectedStatuses = Object.entries(statusFilters)
      .filter(([_, selected]) => selected)
      .map(([status, _]) => status as TaskStatus);
    if (selectedStatuses.length > 0) {
      newFilters.status = selectedStatuses;
    }

    // Приоритеты
    const selectedPriorities = Object.entries(priorityFilters)
      .filter(([_, selected]) => selected)
      .map(([priority, _]) => priority as TaskPriority);
    if (selectedPriorities.length > 0) {
      newFilters.priority = selectedPriorities;
    }

    // Типы
    const selectedTypes = Object.entries(typeFilters)
      .filter(([_, selected]) => selected)
      .map(([type, _]) => type as TaskType);
    if (selectedTypes.length > 0) {
      newFilters.type = selectedTypes;
    }

    // Остальные фильтры
    if (assigneeFilter) newFilters.assignee = [assigneeFilter];
    if (creatorFilter) newFilters.creator = [creatorFilter];
    if (dateFromFilter) newFilters.dateFrom = new Date(dateFromFilter);
    if (dateToFilter) newFilters.dateTo = new Date(dateToFilter);
    if (dueDateFromFilter) newFilters.dueDateFrom = new Date(dueDateFromFilter);
    if (dueDateToFilter) newFilters.dueDateTo = new Date(dueDateToFilter);
    if (tagsFilter) newFilters.tags = tagsFilter.split(',').map(tag => tag.trim()).filter(Boolean);
    if (overdueFilter) newFilters.overdue = true;

    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [
    statusFilters, priorityFilters, typeFilters, assigneeFilter, creatorFilter,
    dateFromFilter, dateToFilter, dueDateFromFilter, dueDateToFilter, tagsFilter, overdueFilter
  ]);

  // Обработчики для чекбоксов
  const handleStatusChange = (status: TaskStatus) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    setPriorityFilters(prev => ({ ...prev, [priority]: !prev[priority] }));
  };

  const handleTypeChange = (type: TaskType) => {
    setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setStatusFilters({
      new: false, in_progress: false, review: false, completed: false,
      postponed: false, cancelled: false, overdue: false
    });
    setPriorityFilters({
      low: false, medium: false, high: false, boss: false
    });
    setTypeFilters({
      simple: false, subtasks: false, project: false, recurring: false, with_files: false
    });
    setAssigneeFilter('');
    setCreatorFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setDueDateFromFilter('');
    setDueDateToFilter('');
    setTagsFilter('');
    setOverdueFilter(false);
  };

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-gray-50 p-6 rounded-lg sticky top-40 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">
            {t('tasks.filters')}
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            {t('tasks.reset')}
          </button>
        </div>

        {/* Статусы */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.status')}</h3>
          <div className="space-y-2">
            {Object.entries(statusFilters).map(([status, selected]) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected}
                  onChange={() => handleStatusChange(status as TaskStatus)}
                />
                <span className="text-gray-700">{t(`tasks.status.${status}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Приоритеты */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.priority')}</h3>
          <div className="space-y-2">
            {Object.entries(priorityFilters).map(([priority, selected]) => (
              <label key={priority} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected}
                  onChange={() => handlePriorityChange(priority as TaskPriority)}
                />
                <span className="text-gray-700">
                  {priority === 'low' && '🟢'} 
                  {priority === 'medium' && '🟠'} 
                  {priority === 'high' && '🔴'} 
                  {priority === 'boss' && '🟡'} 
                  {t(`tasks.priority.${priority}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Типы задач */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.type')}</h3>
          <div className="space-y-2">
            {Object.entries(typeFilters).map(([type, selected]) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected}
                  onChange={() => handleTypeChange(type as TaskType)}
                />
                <span className="text-gray-700">{t(`tasks.type.${type}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Исполнитель */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.assignee')}</h3>
          <input
            type="text"
            placeholder={t('tasks.assigneePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          />
        </div>

        {/* Создатель */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.creator')}</h3>
          <input
            type="text"
            placeholder={t('tasks.creatorPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          />
        </div>

        {/* Дата создания */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.createdDate')}</h3>
          <div className="space-y-2">
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Срок выполнения */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.dueDate')}</h3>
          <div className="space-y-2">
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={dueDateFromFilter}
              onChange={(e) => setDueDateFromFilter(e.target.value)}
            />
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={dueDateToFilter}
              onChange={(e) => setDueDateToFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Теги */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">{t('tasks.tags')}</h3>
          <input
            type="text"
            placeholder={t('tasks.tagsPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)}
          />
        </div>

        {/* Просроченные */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={overdueFilter}
              onChange={(e) => setOverdueFilter(e.target.checked)}
            />
            <span className="text-gray-700">{t('tasks.overdue')}</span>
          </label>
        </div>

        {/* Кнопка применения фильтров */}
        <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors shadow-sm">
          {t('tasks.applyFilters')}
        </button>
      </div>
    </div>
  );
}
