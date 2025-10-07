"use client"

import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, TaskType } from '@/types/task';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  mode: 'create' | 'edit';
}

export default function TaskModal({ task, isOpen, onClose, onSave, mode }: TaskModalProps) {
  const { t } = useLanguage();
  
  // Состояние формы
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'new',
    type: 'simple',
    dueDate: new Date(),
    tags: [],
    files: [],
    links: [],
    estimatedTime: 60
  });

  // Инициализация формы при открытии
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setFormData({
          ...task,
          dueDate: new Date(task.dueDate)
        });
      } else {
        setFormData({
          title: '',
          description: '',
          assignee: '',
          priority: 'medium',
          status: 'new',
          type: 'simple',
          dueDate: new Date(),
          tags: [],
          files: [],
          links: [],
          estimatedTime: 60
        });
      }
    }
  }, [isOpen, mode, task]);

  // Обработчики изменений
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleLinksChange = (value: string) => {
    const links = value.split(',').map(link => link.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      links
    }));
  };

  // Сохранение задачи
  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.assignee) {
      alert(t('tasks.fillRequiredFields'));
      return;
    }

    onSave(formData);
    onClose();
  };

  // Закрытие модального окна
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">
            {mode === 'create' ? t('tasks.createTask') : t('tasks.editTask')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Форма */}
        <div className="p-6 space-y-6">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('tasks.title')} *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('tasks.titlePlaceholder')}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('tasks.description')} *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              rows={4}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('tasks.descriptionPlaceholder')}
            />
          </div>

          {/* Исполнитель */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('tasks.assignee')} *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={formData.assignee || ''}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              placeholder={t('tasks.assigneePlaceholder')}
            />
          </div>

          {/* Приоритет и статус */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('tasks.priority')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={formData.priority || 'medium'}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
              >
                <option value="low">🟢 {t('tasks.priority.low')}</option>
                <option value="medium">🟠 {t('tasks.priority.medium')}</option>
                <option value="high">🔴 {t('tasks.priority.high')}</option>
                <option value="boss">🟡 {t('tasks.priority.boss')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('tasks.status')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={formData.status || 'new'}
                onChange={(e) => handleInputChange('status', e.target.value as TaskStatus)}
              >
                <option value="new">{t('tasks.status.new')}</option>
                <option value="in_progress">{t('tasks.status.in_progress')}</option>
                <option value="review">{t('tasks.status.review')}</option>
                <option value="completed">{t('tasks.status.completed')}</option>
                <option value="postponed">{t('tasks.status.postponed')}</option>
                <option value="cancelled">{t('tasks.status.cancelled')}</option>
                <option value="overdue">{t('tasks.status.overdue')}</option>
              </select>
            </div>
          </div>

          {/* Тип задачи и срок выполнения */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('tasks.type')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={formData.type || 'simple'}
                onChange={(e) => handleInputChange('type', e.target.value as TaskType)}
              >
                <option value="simple">{t('tasks.type.simple')}</option>
                <option value="subtasks">{t('tasks.type.subtasks')}</option>
                <option value="project">{t('tasks.type.project')}</option>
                <option value="recurring">{t('tasks.type.recurring')}</option>
                <option value="with_files">{t('tasks.type.with_files')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('tasks.dueDate')}
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleInputChange('dueDate', new Date(e.target.value))}
              />
            </div>
          </div>

          {/* Теги */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('tasks.tags')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder={t('tasks.tagsPlaceholder')}
            />
          </div>

          {/* Ссылки */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('tasks.links')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={formData.links?.join(', ') || ''}
              onChange={(e) => handleLinksChange(e.target.value)}
              placeholder={t('tasks.linksPlaceholder')}
            />
          </div>

          {/* Оценочное время */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('tasks.estimatedTime')}
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={formData.estimatedTime || 60}
              onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
              placeholder="60"
              min="1"
            />
            <p className="text-sm text-gray-500 mt-1">{t('tasks.estimatedTimeHelp')}</p>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('tasks.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors shadow-sm"
          >
            {mode === 'create' ? t('tasks.create') : t('tasks.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
