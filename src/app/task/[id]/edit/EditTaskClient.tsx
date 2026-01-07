"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";

// Интерфейсы для типизации
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'boss';
  status: 'new' | 'in_progress' | 'review' | 'completed' | 'postponed' | 'cancelled';
  deadline: string;
  deadlineTime: string;
  executors: string[];
  curators: string[];
  subtasks: Subtask[];
  checklists: Checklist[];
  images: string[];
  links: string[];
  isAutoTask: boolean;
  autoFrequency: string;
  autoRepetitions: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: TaskHistory[];
}

interface Subtask {
  id: string;
  title: string;
  description: string;
  executor: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'boss';
  status: 'new' | 'in_progress' | 'completed';
  approvedByCurator: boolean;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  executor: string;
  curator: string;
  approvedByCurator: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  executor: string;
}

interface TaskHistory {
  id: string;
  action: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
  userId: string;
  comment?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface EditTaskClientProps {
  taskId: string;
}

export default function EditTaskClient({ taskId }: EditTaskClientProps) {
  const router = useRouter();
  
  // Состояние задачи
  const [task, setTask] = useState<Task | null>(null);
  const [originalTask, setOriginalTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low' as 'low' | 'medium' | 'high' | 'boss',
    status: 'new' as 'new' | 'in_progress' | 'review' | 'completed' | 'postponed' | 'cancelled',
    deadline: '',
    deadlineTime: '12:00',
    executors: [] as string[],
    curators: [] as string[],
    subtasks: [] as Subtask[],
    checklists: [] as Checklist[],
    images: [] as string[],
    links: [] as string[],
    isAutoTask: false,
    autoFrequency: 'daily',
    autoRepetitions: ''
  });
  
  // Состояние для управления ссылками
  const [linkInputs, setLinkInputs] = useState<string[]>(['']);
  
  // Состояние для валидации
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Состояние для истории изменений
  const [changesHistory, setChangesHistory] = useState<TaskHistory[]>([]);
  const [changeComment, setChangeComment] = useState('');
  
  // Состояние для автосохранения
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Состояние для выпадающих меню
  const [showExecutorsDropdown, setShowExecutorsDropdown] = useState(false);
  const [showCuratorsDropdown, setShowCuratorsDropdown] = useState(false);
  
  // Состояние для сравнения версий
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  
  // Состояние для фотографий
  const [showPhotos, setShowPhotos] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Состояние для подзадач
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
  
  // Состояние для чек-листов
  const [showChecklists, setShowChecklists] = useState(false);
  const [isCreateChecklistModalOpen, setIsCreateChecklistModalOpen] = useState(false);
  
  // Тестовые пользователи
  const users: User[] = [
    { id: '1', name: 'Анна Петрова', role: 'admin' },
    { id: '2', name: 'Иван Сидоров', role: 'employee' },
    { id: '3', name: 'Мария Козлова', role: 'manager' },
    { id: '4', name: 'Петр Иванов', role: 'employee' }
  ];

  // Загрузка задачи при монтировании компонента
  useEffect(() => {
    loadTask();
  }, [taskId]);

  // Автосохранение каждые 30 секунд
  useEffect(() => {
    if (hasUnsavedChanges) {
      autoSaveInterval.current = setInterval(() => {
        saveDraft();
      }, 30000);
    }

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [hasUnsavedChanges]);

  // Закрытие выпадающих меню при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowExecutorsDropdown(false);
        setShowCuratorsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функция загрузки задачи
  const loadTask = async () => {
    try {
      setLoading(true);
      
      // Тестовые данные задачи
      const mockTask: Task = {
        id: taskId,
        title: 'Разработка нового функционала для CRM системы',
        description: 'Необходимо разработать модуль для автоматического создания отчетов по клиентам с возможностью экспорта в PDF и Excel форматы.',
        priority: 'high',
        status: 'in_progress',
        deadline: '2024-10-15',
        deadlineTime: '18:00',
        executors: ['2'],
        curators: ['3'],
        subtasks: [
          {
            id: '1',
            title: 'Анализ требований',
            description: 'Изучить требования к модулю отчетов',
            executor: '2',
            deadline: '2024-10-10',
            priority: 'medium',
            status: 'completed',
            approvedByCurator: true
          },
          {
            id: '2',
            title: 'Создание макетов',
            description: 'Разработать UI/UX макеты для модуля',
            executor: '2',
            deadline: '2024-10-12',
            priority: 'high',
            status: 'in_progress',
            approvedByCurator: false
          }
        ],
        checklists: [
          {
            id: '1',
            title: 'Тестирование модуля',
            items: [
              { id: '1', text: 'Проверить генерацию PDF отчетов', completed: false, executor: '2' },
              { id: '2', text: 'Проверить генерацию Excel отчетов', completed: false, executor: '2' },
              { id: '3', text: 'Проверить корректность данных', completed: false, executor: '2' }
            ],
            executor: '2',
            curator: '3',
            approvedByCurator: false
          }
        ],
        images: ['task1.jpg', 'task2.jpg', 'task3.jpg'],
        links: ['https://example.com/docs', 'https://github.com/project/repo'],
        isAutoTask: false,
        autoFrequency: 'daily',
        autoRepetitions: '',
        createdBy: '1',
        createdAt: '2024-10-01T10:00:00Z',
        updatedAt: '2024-10-08T15:30:00Z',
        history: [
          {
            id: '1',
            action: 'created',
            field: 'task',
            oldValue: null,
            newValue: 'Разработка нового функционала для CRM системы',
            timestamp: '2024-10-01T10:00:00Z',
            userId: '1'
          },
          {
            id: '2',
            action: 'updated',
            field: 'status',
            oldValue: 'new',
            newValue: 'in_progress',
            timestamp: '2024-10-08T15:30:00Z',
            userId: '2',
            comment: 'Начал работу над задачей'
          }
        ]
      };

      setTask(mockTask);
      setOriginalTask(JSON.parse(JSON.stringify(mockTask))); // Глубокое копирование
      
      // Инициализация формы
      setFormData({
        title: mockTask.title,
        description: mockTask.description,
        priority: mockTask.priority,
        status: mockTask.status,
        deadline: mockTask.deadline,
        deadlineTime: mockTask.deadlineTime,
        executors: mockTask.executors,
        curators: mockTask.curators,
        subtasks: mockTask.subtasks,
        checklists: mockTask.checklists,
        images: mockTask.images,
        links: mockTask.links,
        isAutoTask: mockTask.isAutoTask,
        autoFrequency: mockTask.autoFrequency,
        autoRepetitions: mockTask.autoRepetitions
      });
      
      setLinkInputs(mockTask.links.length > 0 ? mockTask.links : ['']);
      setChangesHistory(mockTask.history);
      
    } catch (err) {
      setError('Ошибка загрузки задачи');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Функция валидации формы
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Название задачи обязательно';
    }
    
    if (formData.executors.length === 0) {
      errors.executors = 'Выберите хотя бы одного исполнителя';
    }
    
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        errors.deadline = 'Дата не может быть в прошлом';
      }
    }
    
    if (formData.deadlineTime && !formData.deadline) {
      errors.deadlineTime = 'Укажите дату для времени';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Функция сохранения черновика
  const saveDraft = async () => {
    try {
      // Здесь будет API вызов для сохранения черновика
      console.log('Saving draft...', formData);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error saving draft:', err);
    }
  };

  // Функции для работы с фотографиями
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setUploadedImages(prev => [...prev, ...imageFiles]);
    
    // Создаем превью для новых изображений
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...uploadedImages];
    const newPreviews = [...imagePreviews];
    
    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    
    newImages.splice(toIndex, 0, movedImage);
    newPreviews.splice(toIndex, 0, movedPreview);
    
    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Функции для работы с подзадачами
  const addSubtask = (subtask: Subtask) => {
    setFormData(prev => ({ ...prev, subtasks: [...prev.subtasks, subtask] }));
  };

  const removeSubtask = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      subtasks: prev.subtasks.filter((_, i) => i !== index) 
    }));
  };

  const moveSubtask = (fromIndex: number, toIndex: number) => {
    const newSubtasks = [...formData.subtasks];
    const [movedSubtask] = newSubtasks.splice(fromIndex, 1);
    newSubtasks.splice(toIndex, 0, movedSubtask);
    setFormData(prev => ({ ...prev, subtasks: newSubtasks }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-400';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      case 'boss': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Неизвестный пользователь';
  };

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'low': return 'Обычная';
      case 'medium': return 'Важная';
      case 'high': return 'Срочная';
      case 'boss': return 'Задача от руководителя';
      default: return 'Обычная';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'review': return 'На проверке';
      case 'completed': return 'Выполнена';
      case 'postponed': return 'Отложена';
      case 'cancelled': return 'Отменена';
      default: return 'Новая';
    }
  };

  // Функции для работы с чек-листами
  const addChecklist = (checklist: Checklist) => {
    setFormData(prev => ({ ...prev, checklists: [...prev.checklists, checklist] }));
  };

  const removeChecklist = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      checklists: prev.checklists.filter((_, i) => i !== index) 
    }));
  };

  const moveChecklist = (fromIndex: number, toIndex: number) => {
    const newChecklists = [...formData.checklists];
    const [movedChecklist] = newChecklists.splice(fromIndex, 1);
    newChecklists.splice(toIndex, 0, movedChecklist);
    setFormData(prev => ({ ...prev, checklists: newChecklists }));
  };

  // Функция отправки уведомлений
  const sendNotifications = async (changes: string[]) => {
    const recipients = [...formData.executors, ...formData.curators];
    const uniqueRecipients = [...new Set(recipients)];

    if (uniqueRecipients.length === 0) return;

    const message = `Задача "${formData.title}" была изменена. Изменения: ${changes.join(', ')}`;

    try {
      // Здесь будет API вызов для отправки уведомлений
      console.log('Отправка уведомлений:', {
        recipients: uniqueRecipients.map(id => getUserName(id)),
        message,
        changes
      });

      // Имитация отправки уведомлений
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Уведомления отправлены успешно');
    } catch (error) {
      console.error('Ошибка отправки уведомлений:', error);
    }
  };

  // Функция сохранения изменений
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      // Определяем изменения для уведомлений
      const changes: string[] = [];
      if (originalTask) {
        if (formData.title !== originalTask.title) changes.push('название');
        if (formData.description !== originalTask.description) changes.push('описание');
        if (formData.priority !== originalTask.priority) changes.push('приоритет');
        if (formData.status !== originalTask.status) changes.push('статус');
        if (formData.deadline !== originalTask.deadline) changes.push('дедлайн');
        if (JSON.stringify(formData.executors) !== JSON.stringify(originalTask.executors)) changes.push('исполнители');
        if (JSON.stringify(formData.curators) !== JSON.stringify(originalTask.curators)) changes.push('кураторы');
      }

      // Здесь будет API вызов для сохранения задачи
      console.log('Saving task...', formData);
      
      // Обновляем историю изменений
      const newHistoryEntry: TaskHistory = {
        id: Date.now().toString(),
        action: 'updated',
        field: 'multiple',
        oldValue: originalTask,
        newValue: formData,
        timestamp: new Date().toISOString(),
        userId: '1', // Текущий пользователь
        comment: changeComment || undefined
      };
      
      setChangesHistory(prev => [...prev, newHistoryEntry]);
      setChangeComment('');
      setHasUnsavedChanges(false);
      
      // Отправляем уведомления об изменениях
      if (changes.length > 0) {
        await sendNotifications(changes);
      }
      
      // Перенаправляем на страницу просмотра задачи
      router.push(`/task/${taskId}`);
      
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Ошибка сохранения задачи');
    } finally {
      setSaving(false);
    }
  };

  // Функция отмены изменений
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm('У вас есть несохраненные изменения. Вы уверены, что хотите отменить?');
      if (!confirmCancel) return;
    }
    
    router.push(`/task/${taskId}`);
  };

  // Функции для управления ссылками
  const addLinkInput = () => {
    setLinkInputs(prev => [...prev, '']);
  };

  const updateLinkInput = (index: number, value: string) => {
    setLinkInputs(prev => prev.map((link, i) => i === index ? value : link));
  };

  const removeLinkInput = (index: number) => {
    setLinkInputs(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BurgerMenu />
        <div className="pt-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Загрузка задачи...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BurgerMenu />
        <div className="pt-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600">Ошибка: {error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BurgerMenu />
        <div className="pt-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Задача не найдена.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />

      <main className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок страницы */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-black">Редактирование задачи</h1>
              <div className="flex items-center space-x-4">
                {hasUnsavedChanges && (
                  <div className="text-sm text-orange-600">
                    Есть несохраненные изменения
                  </div>
                )}
                {lastSaved && (
                  <div className="text-sm text-gray-500">
                    Последнее автосохранение: {lastSaved}
                  </div>
                )}
                     <button
                       onClick={() => setShowVersionComparison(!showVersionComparison)}
                       className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                     >
                       Сравнить версии
                     </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 text-black rounded-md transition-colors"
                  style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>

          {/* Основная форма редактирования */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Левая колонка - Основные поля */}
            <div className="lg:col-span-2 space-y-6">
              {/* Основная информация */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Основная информация</h2>
                
                {/* Название задачи */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название задачи *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Введите название задачи"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Описание */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Введите описание задачи"
                  />
                </div>

                {/* Приоритет и статус */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Приоритет
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="low">Обычная</option>
                      <option value="medium">Важная</option>
                      <option value="high">Срочная</option>
                      <option value="boss">Задача от руководителя</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Статус
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="review">На проверке</option>
                      <option value="completed">Выполнена</option>
                      <option value="postponed">Отложена</option>
                      <option value="cancelled">Отменена</option>
                    </select>
                  </div>
                </div>

                {/* Дедлайн */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата дедлайна
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        formErrors.deadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.deadline && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.deadline}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Время дедлайна
                    </label>
                    <input
                      type="time"
                      value={formData.deadlineTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadlineTime: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        formErrors.deadlineTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.deadlineTime && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.deadlineTime}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Исполнители и кураторы */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Исполнители и кураторы</h2>
                
                {/* Исполнители */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Исполнители *
                  </label>
                  <div className="relative dropdown-container">
                    <button
                      type="button"
                      onClick={() => setShowExecutorsDropdown(!showExecutorsDropdown)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-left bg-white ${
                        formErrors.executors ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {formData.executors.length > 0 
                        ? `${formData.executors.length} выбрано` 
                        : 'Выберите исполнителей'
                      }
                    </button>
                    {formErrors.executors && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.executors}</p>
                    )}
                    {showExecutorsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {users.filter(user => ['admin', 'manager', 'employee', 'freelancer'].includes(user.role)).map(user => (
                          <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.executors.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ ...prev, executors: [...prev.executors, user.id] }));
                                } else {
                                  setFormData(prev => ({ ...prev, executors: prev.executors.filter(id => id !== user.id) }));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{user.name} ({user.role})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Кураторы */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Кураторы
                  </label>
                  <div className="relative dropdown-container">
                    <button
                      type="button"
                      onClick={() => setShowCuratorsDropdown(!showCuratorsDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-left bg-white"
                    >
                      {formData.curators.length > 0 
                        ? `${formData.curators.length} выбрано` 
                        : 'Выберите кураторов'
                      }
                    </button>
                    {showCuratorsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {users.filter(user => ['admin', 'manager', 'employee', 'freelancer'].includes(user.role)).map(user => (
                          <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.curators.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ ...prev, curators: [...prev.curators, user.id] }));
                                } else {
                                  setFormData(prev => ({ ...prev, curators: prev.curators.filter(id => id !== user.id) }));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{user.name} ({user.role})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ссылки */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Ссылки</h2>
                <div className="space-y-3">
                  {linkInputs.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateLinkInput(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Введите ссылку"
                      />
                      <button
                        onClick={() => removeLinkInput(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addLinkInput}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Добавить ссылку
                  </button>
                </div>
              </div>

            </div>

            {/* Правая колонка - Дополнительная информация */}
            <div className="space-y-6">
              {/* Комментарий к изменениям */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Комментарий к изменениям</h2>
                <textarea
                  value={changeComment}
                  onChange={(e) => setChangeComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Опишите внесенные изменения..."
                />
              </div>

                     {/* История изменений */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">История изменений</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {changesHistory.map((change) => (
                    <div key={change.id} className="p-3 bg-white rounded border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {change.action === 'created' ? 'Создано' : 'Изменено'}: {change.field}
                          </p>
                          {change.comment && (
                            <p className="text-xs text-gray-600 mt-1">{change.comment}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(change.timestamp).toLocaleString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Фотографии */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Фотографии</h2>
                  <button
                    type="button"
                    onClick={() => setShowPhotos(!showPhotos)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                  >
                    {showPhotos ? '−' : '+'}
                  </button>
                </div>
                
                {showPhotos && (
                  <div className="space-y-4">
                    {/* Загрузка новых фотографий */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Загрузить новые фотографии
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>

                    {/* Существующие фотографии */}
                    {formData.images.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Существующие фотографии</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Фото ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                                  {index > 0 && (
                                    <button
                                      onClick={() => {
                                        const newImages = [...formData.images];
                                        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
                                        setFormData(prev => ({ ...prev, images: newImages }));
                                      }}
                                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {index < formData.images.length - 1 && (
                                    <button
                                      onClick={() => {
                                        const newImages = [...formData.images];
                                        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
                                        setFormData(prev => ({ ...prev, images: newImages }));
                                      }}
                                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                      →
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      const newImages = formData.images.filter((_, i) => i !== index);
                                      setFormData(prev => ({ ...prev, images: newImages }));
                                    }}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Новые загруженные фотографии */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Новые фотографии</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Новое фото ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                                  {index > 0 && (
                                    <button
                                      onClick={() => moveImage(index, index - 1)}
                                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {index < imagePreviews.length - 1 && (
                                    <button
                                      onClick={() => moveImage(index, index + 1)}
                                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                      →
                                    </button>
                                  )}
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Кнопка добавления существующих фотографий к задаче */}
                    {imagePreviews.length > 0 && (
                      <div className="pt-4 border-t border-gray-300">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, images: [...prev.images, ...imagePreviews] }));
                            setImagePreviews([]);
                            setUploadedImages([]);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Добавить фотографии к задаче
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Подзадачи */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Подзадачи</h2>
                  <button
                    type="button"
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                  >
                    {showSubtasks ? '−' : '+'}
                  </button>
                </div>
                
                {showSubtasks && (
                  <div className="space-y-4">
                    {/* Кнопка создания новой подзадачи */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsCreateSubtaskModalOpen(true)}
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Создать подзадачу
                      </button>
                    </div>

                    {/* Список существующих подзадач */}
                    {formData.subtasks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Существующие подзадачи</h3>
                        <div className="space-y-2">
                          {formData.subtasks.map((subtask, index) => (
                            <div key={subtask.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(subtask.priority)}`}></div>
                                <span className="text-sm font-medium text-black">{subtask.title}</span>
                                <span className="text-xs text-gray-500">
                                  {subtask.executor && `Исполнитель: ${getUserName(subtask.executor)}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {subtask.deadline && `Дедлайн: ${new Date(subtask.deadline).toLocaleDateString('ru-RU')}`}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {index > 0 && (
                                  <button
                                    onClick={() => moveSubtask(index, index - 1)}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    title="Переместить вверх"
                                  >
                                    ↑
                                  </button>
                                )}
                                {index < formData.subtasks.length - 1 && (
                                  <button
                                    onClick={() => moveSubtask(index, index + 1)}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    title="Переместить вниз"
                                  >
                                    ↓
                                  </button>
                                )}
                                <button
                                  onClick={() => removeSubtask(index)}
                                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  title="Удалить подзадачу"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Чек-листы */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Чек-листы</h2>
                  <button
                    type="button"
                    onClick={() => setShowChecklists(!showChecklists)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                  >
                    {showChecklists ? '−' : '+'}
                  </button>
                </div>
                
                {showChecklists && (
                  <div className="space-y-4">
                    {/* Кнопка создания нового чек-листа */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsCreateChecklistModalOpen(true)}
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Создать чек-лист
                      </button>
                    </div>

                    {/* Список существующих чек-листов */}
                    {formData.checklists.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Существующие чек-листы</h3>
                        <div className="space-y-2">
                          {formData.checklists.map((checklist, index) => (
                            <div key={checklist.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-black">{checklist.title}</span>
                                <span className="text-xs text-gray-500">
                                  {checklist.items.length} пунктов
                                </span>
                                <span className="text-xs text-gray-500">
                                  {checklist.executor && `Исполнитель: ${getUserName(checklist.executor)}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {checklist.curator && `Куратор: ${getUserName(checklist.curator)}`}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {index > 0 && (
                                  <button
                                    onClick={() => moveChecklist(index, index - 1)}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    title="Переместить вверх"
                                  >
                                    ↑
                                  </button>
                                )}
                                {index < formData.checklists.length - 1 && (
                                  <button
                                    onClick={() => moveChecklist(index, index + 1)}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    title="Переместить вниз"
                                  >
                                    ↓
                                  </button>
                                )}
                                <button
                                  onClick={() => removeChecklist(index)}
                                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  title="Удалить чек-лист"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Модальное окно создания подзадачи */}
      {isCreateSubtaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-black">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Создать подзадачу</h2>
              <button
                onClick={() => setIsCreateSubtaskModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Название подзадачи */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название подзадачи *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Введите название подзадачи"
                />
              </div>

              {/* Описание подзадачи */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 h-24"
                  placeholder="Введите описание подзадачи"
                />
              </div>

              {/* Исполнитель */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Исполнитель *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <option value="">Выберите исполнителя</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Приоритет */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <option value="low">Обычная</option>
                  <option value="medium">Важная</option>
                  <option value="high">Срочная</option>
                  <option value="boss">Задача от руководителя</option>
                </select>
              </div>

              {/* Дедлайн */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дедлайн
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreateSubtaskModalOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  // Здесь будет логика создания подзадачи
                  setIsCreateSubtaskModalOpen(false);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Создать подзадачу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно сравнения версий */}
      {showVersionComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border-2 border-black">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Сравнение версий</h2>
              <button
                onClick={() => setShowVersionComparison(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Текущая версия */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-black mb-4 bg-green-100 p-2 rounded">
                  Текущая версия (Редактируемая)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название:</label>
                    <div className="p-2 bg-gray-50 rounded border">{formData.title}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание:</label>
                    <div className="p-2 bg-gray-50 rounded border min-h-[60px]">{formData.description}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет:</label>
                    <div className="p-2 bg-gray-50 rounded border">{getPriorityName(formData.priority)}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус:</label>
                    <div className="p-2 bg-gray-50 rounded border">{getStatusName(formData.status)}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн:</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {formData.deadline ? `${new Date(formData.deadline).toLocaleDateString('ru-RU')} ${formData.deadlineTime}` : 'Не указан'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Исполнители:</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {formData.executors.length > 0 
                        ? formData.executors.map(id => getUserName(id)).join(', ')
                        : 'Не назначены'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Кураторы:</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {formData.curators.length > 0 
                        ? formData.curators.map(id => getUserName(id)).join(', ')
                        : 'Не назначены'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Предыдущая версия */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-black mb-4 bg-blue-100 p-2 rounded">
                  Предыдущая версия (Сохраненная)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название:</label>
                    <div className="p-2 bg-gray-50 rounded border">{originalTask?.title || 'Не загружено'}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание:</label>
                    <div className="p-2 bg-gray-50 rounded border min-h-[60px]">{originalTask?.description || 'Не загружено'}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет:</label>
                    <div className="p-2 bg-gray-50 rounded border">{originalTask ? getPriorityName(originalTask.priority) : 'Не загружено'}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус:</label>
                    <div className="p-2 bg-gray-50 rounded border">{originalTask ? getStatusName(originalTask.status) : 'Не загружено'}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн:</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {originalTask?.deadline 
                        ? `${new Date(originalTask.deadline).toLocaleDateString('ru-RU')} ${originalTask.deadlineTime}`
                        : 'Не указан'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Исполнители:</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {originalTask?.executors && originalTask.executors.length > 0 
                        ? originalTask.executors.map(id => getUserName(id)).join(', ')
                        : 'Не назначены'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Кураторы:</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {originalTask?.curators && originalTask.curators.length > 0 
                        ? originalTask.curators.map(id => getUserName(id)).join(', ')
                        : 'Не назначены'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Сводка изменений */}
            <div className="mt-6 border-t border-gray-300 pt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Сводка изменений</h3>
              <div className="space-y-2">
                {originalTask && (
                  <>
                    {formData.title !== originalTask.title && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменено название задачи</span>
                      </div>
                    )}
                    {formData.description !== originalTask.description && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменено описание задачи</span>
                      </div>
                    )}
                    {formData.priority !== originalTask.priority && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменен приоритет задачи</span>
                      </div>
                    )}
                    {formData.status !== originalTask.status && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменен статус задачи</span>
                      </div>
                    )}
                    {formData.deadline !== originalTask.deadline && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменен дедлайн задачи</span>
                      </div>
                    )}
                    {JSON.stringify(formData.executors) !== JSON.stringify(originalTask.executors) && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменены исполнители задачи</span>
                      </div>
                    )}
                    {JSON.stringify(formData.curators) !== JSON.stringify(originalTask.curators) && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border">
                        <span className="text-yellow-600">📝</span>
                        <span className="text-sm">Изменены кураторы задачи</span>
                      </div>
                    )}
                  </>
                )}
                {(!originalTask || Object.keys(changesHistory).length === 0) && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                    <span className="text-gray-500">ℹ️</span>
                    <span className="text-sm text-gray-500">Нет изменений для сравнения</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowVersionComparison(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания чек-листа */}
      {isCreateChecklistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-black">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Создать чек-лист</h2>
              <button
                onClick={() => setIsCreateChecklistModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Название чек-листа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название чек-листа *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Введите название чек-листа"
                />
              </div>

              {/* Исполнитель */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Исполнитель *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <option value="">Выберите исполнителя</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Куратор */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Куратор *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <option value="">Выберите куратора</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Пункты чек-листа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пункты чек-листа *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Пункт 1"
                    />
                    <button className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Пункт 2"
                    />
                    <button className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Пункт 3"
                    />
                    <button className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                </div>
                <button className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm">
                  Добавить пункт
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreateChecklistModalOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  // Здесь будет логика создания чек-листа
                  setIsCreateChecklistModalOpen(false);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Создать чек-лист
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
