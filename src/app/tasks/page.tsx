"use client"

import { useState, useEffect } from "react";
import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";

// Типы для состояний
interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  deadline: string;
  deadlineTime: string;
  executors: string[];
  curators: string[];
  subtasks: any[];
  checklists: any[];
  images: any[];
  links: any[];
  isAutoTask: boolean;
  autoFrequency: string;
  autoRepetitions: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
  executor: string;
  curator: string;
}

interface ChecklistFormData {
  title: string;
  items: ChecklistItem[];
}

export default function TasksPage() {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'low',
    deadline: '',
    deadlineTime: '12:00',
    executors: [],
    curators: [],
    subtasks: [],
    checklists: [],
    images: [],
    links: [],
    isAutoTask: false,
    autoFrequency: 'daily',
    autoRepetitions: ''
  });
  const [currentUser, setCurrentUser] = useState<User>({ id: 1, name: "Анна Петрова", role: "admin" }); // Текущий пользователь
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedTaskForComments, setSelectedTaskForComments] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterExecutor, setFilterExecutor] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    whatsapp: false,
    telegram: false,
    reminderDays: 1
  });
  const [showExecutorsDropdown, setShowExecutorsDropdown] = useState(false);
  const [showCuratorsDropdown, setShowCuratorsDropdown] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showChecklists, setShowChecklists] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDeadline, setShowDeadline] = useState(false);
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
  const [subtaskFormData, setSubtaskFormData] = useState({
    title: '',
    description: '',
    executors: [],
    curators: [],
    priority: 'low',
    deadline: '',
    deadlineTime: '12:00',
    subtasks: [],
    checklists: [],
    attachments: []
  });
  const [subtaskFormErrors, setSubtaskFormErrors] = useState({});

  // Состояние для модального окна создания чек-листа
  const [isCreateChecklistModalOpen, setIsCreateChecklistModalOpen] = useState(false);
  const [checklistFormData, setChecklistFormData] = useState({
    title: '',
    items: [
      { id: 1, text: '', completed: false, executor: '', curator: '' },
      { id: 2, text: '', completed: false, executor: '', curator: '' },
      { id: 3, text: '', completed: false, executor: '', curator: '' }
    ]
  });
  const [checklistFormErrors, setChecklistFormErrors] = useState({});
  
  // Состояние для выпадающих списков в чек-листе
  const [showChecklistCuratorDropdown, setShowChecklistCuratorDropdown] = useState<number | null>(null);
  const [showChecklistExecutorDropdown, setShowChecklistExecutorDropdown] = useState<number | null>(null);

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (isCreateTaskModalOpen || isCreateSubtaskModalOpen || isCreateChecklistModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Очистка при размонтировании
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateTaskModalOpen, isCreateSubtaskModalOpen, isCreateChecklistModalOpen]);

  // Закрытие выпадающих списков при клике вне их
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChecklistCuratorDropdown !== null || showChecklistExecutorDropdown !== null) {
        setShowChecklistCuratorDropdown(null);
        setShowChecklistExecutorDropdown(null);
      }
    };

    if (isCreateChecklistModalOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCreateChecklistModalOpen, showChecklistCuratorDropdown, showChecklistExecutorDropdown]);

  // Функции для работы с задачами
  // Функция для генерации дней календаря
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = firstDay.getDay() === 0 ? -5 : 2 - firstDay.getDay();
    
    const days = [];
    for (let i = startDate; i <= lastDay.getDate() + (6 - lastDay.getDay()); i++) {
      if (i <= 0 || i > lastDay.getDate()) {
        days.push(null);
      } else {
        days.push(i);
      }
    }
    return days;
  };

  // Функции склонения
  const getTaskWord = (count: number) => {
    if (count === 0) return 'задач';
    if (count % 10 === 1 && count % 100 !== 11) return 'задача';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'задачи';
    return 'задач';
  };

  const getMissedWord = (count: number) => {
    if (count === 0) return 'Пропущено';
    if (count % 10 === 1 && count % 100 !== 11) return 'Пропущена';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'Пропущено';
    return 'Пропущено';
  };

  const getTasksForDate = (date) => {
    return allTasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline).toDateString();
      const targetDate = new Date(date).toDateString();
      return taskDate === targetDate;
    });
  };

  const getTasksForToday = () => {
    const today = new Date();
    return getTasksForDate(today);
  };

  const getTasksForTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getTasksForDate(tomorrow);
  };

  const getMissedTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return allTasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    });
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return allTasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate < today;
    });
  };

  const getTasksForCalendar = () => {
    const tasksByDate = {};
    allTasks.forEach(task => {
      if (task.deadline) {
        const date = new Date(task.deadline).toDateString();
        if (!tasksByDate[date]) {
          tasksByDate[date] = [];
        }
        tasksByDate[date].push(task);
      }
    });
    return tasksByDate;
  };

  // Функции для редактирования и управления задачами
  const updateTask = (taskId, updates) => {
    setAllTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId) => {
    setAllTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Функции для работы с правами доступа
  const canReassignExecutor = (task) => {
    const userRole = currentUser.role;
    const isCreator = task.createdBy === currentUser.id;
    
    return userRole === 'admin' || userRole === 'manager' || isCreator;
  };

  const canChangeStatus = (task, newStatus) => {
    const userRole = currentUser.role;
    const isExecutor = task.executors.includes(currentUser.id);
    const isCurator = task.curators.includes(currentUser.id);
    
    if (newStatus === 'in_progress') {
      return isExecutor;
    }
    
    if (newStatus === 'completed') {
      return isExecutor && isTaskFullyApproved(task);
    }
    
    return userRole === 'admin' || userRole === 'manager';
  };

  const isTaskFullyApproved = (task) => {
    // Проверяем, что все элементы подтверждены куратором
    const mainTaskApproved = task.approvedByCurator || false;
    const subtasksApproved = task.subtasks.every(subtask => subtask.approvedByCurator);
    const checklistsApproved = task.checklists.every(checklist => checklist.approvedByCurator);
    
    return mainTaskApproved && subtasksApproved && checklistsApproved;
  };

  // Функции для работы с замечаниями
  const addComment = (taskId, comment) => {
    const commentData = {
      id: Date.now(),
      text: comment,
      author: currentUser.name,
      authorId: currentUser.id,
      timestamp: new Date().toISOString(),
      type: 'comment'
    };

    updateTask(taskId, {
      comments: [...(allTasks.find(t => t.id === taskId)?.comments || []), commentData]
    });
  };


  // Функции для работы с подзадачами
  const handleSubtaskInputChange = (field, value) => {
    setSubtaskFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очистка ошибки при изменении поля
    if (subtaskFormErrors[field]) {
      setSubtaskFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateSubtaskForm = () => {
    const errors = {};
    
    if (!subtaskFormData.title.trim()) {
      errors.title = 'Название подзадачи обязательно';
    }
    
    if (subtaskFormData.executors.length === 0) {
      errors.executors = 'Выберите хотя бы одного исполнителя';
    }
    
    if (subtaskFormData.deadline && subtaskFormData.deadlineTime) {
      const deadlineDate = new Date(subtaskFormData.deadline + 'T' + subtaskFormData.deadlineTime);
      if (deadlineDate <= new Date()) {
        errors.deadline = 'Срок выполнения должен быть в будущем';
      }
    }
    
    setSubtaskFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubtaskSubmit = () => {
    if (!validateSubtaskForm()) {
      return;
    }

    const newSubtask = {
      id: Date.now(),
      title: subtaskFormData.title,
      description: subtaskFormData.description,
      executors: subtaskFormData.executors,
      curators: subtaskFormData.curators,
      priority: subtaskFormData.priority,
      deadline: subtaskFormData.deadline,
      deadlineTime: subtaskFormData.deadlineTime,
      status: 'new',
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      approvedByCurator: {
        mainTask: false,
        subtasks: [],
        checklists: []
      },
      history: [{
        id: Date.now(),
        action: 'created',
        author: currentUser.name,
        authorId: currentUser.id,
        timestamp: new Date().toISOString(),
        type: 'creation'
      }],
      comments: [],
      parentTaskId: null // Будет установлен при создании основной задачи
    };

    // Добавляем подзадачу к форме основной задачи
    handleInputChange('subtasks', [...formData.subtasks, newSubtask]);
    
    // Сбрасываем форму подзадачи
    setSubtaskFormData({
      title: '',
      description: '',
      executors: [],
      curators: [],
      priority: 'low',
      deadline: '',
      deadlineTime: '12:00',
      subtasks: [],
      checklists: [],
      attachments: []
    });
    setSubtaskFormErrors({});
    setIsCreateSubtaskModalOpen(false);
  };

  // Функции для работы с чек-листами
  const handleChecklistInputChange = (field: string, value: any) => {
    setChecklistFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (checklistFormErrors[field]) {
      setChecklistFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleChecklistItemChange = (itemId: number, field: string, value: any) => {
    setChecklistFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const addChecklistItem = () => {
    const newId = Math.max(...checklistFormData.items.map(item => item.id)) + 1;
    setChecklistFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, text: '', completed: false, executor: '', curator: '' }]
    }));
  };

  const removeChecklistItem = (itemId: number) => {
    if (checklistFormData.items.length <= 2) return; // Минимум 2 строки
    
    setChecklistFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const validateChecklistForm = () => {
    const errors = {};
    
    if (!checklistFormData.title.trim()) {
      errors.title = 'Название чек-листа обязательно';
    }
    
    const filledItems = checklistFormData.items.filter(item => item.text.trim());
    if (filledItems.length < 2) {
      errors.items = 'Заполните минимум 2 строки';
    }
    
    setChecklistFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChecklistSubmit = () => {
    if (!validateChecklistForm()) {
      return;
    }

    // Создаем чек-лист только с заполненными строками
    const filledItems = checklistFormData.items
      .filter(item => item.text.trim())
      .map(item => ({
        ...item,
        id: Date.now() + Math.random() // Уникальный ID
      }));

    const newChecklist = {
      id: Date.now(),
      title: checklistFormData.title,
      items: filledItems,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    const updatedChecklists = [...formData.checklists, newChecklist];
    handleInputChange('checklists', updatedChecklists);

    // Сбрасываем форму чек-листа
    setChecklistFormData({
      title: '',
      items: [
        { id: 1, text: '', completed: false, executor: '', curator: '' },
        { id: 2, text: '', completed: false, executor: '', curator: '' },
        { id: 3, text: '', completed: false, executor: '', curator: '' }
      ]
    });
    setChecklistFormErrors({});
    setIsCreateChecklistModalOpen(false);
  };

  // Функции для выбора кураторов и исполнителей в чек-листе
  const handleChecklistCuratorSelect = (itemId: number, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      handleChecklistItemChange(itemId, 'curator', user.name);
    }
    setShowChecklistCuratorDropdown(null);
  };

  const handleChecklistExecutorSelect = (itemId: number, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      handleChecklistItemChange(itemId, 'executor', user.name);
    }
    setShowChecklistExecutorDropdown(null);
  };

  const removeChecklistCurator = (itemId: number) => {
    handleChecklistItemChange(itemId, 'curator', '');
  };

  const removeChecklistExecutor = (itemId: number) => {
    handleChecklistItemChange(itemId, 'executor', '');
  };

  const handleStatusChange = (taskId, newStatus) => {
    const task = allTasks.find(t => t.id === taskId);
    
    if (!canChangeStatus(task, newStatus)) {
      alert('У вас нет прав для изменения статуса');
      return;
    }

    const statusChange = {
      id: Date.now(),
      from: task.status,
      to: newStatus,
      author: currentUser.name,
      authorId: currentUser.id,
      timestamp: new Date().toISOString(),
      type: 'status_change'
    };

    updateTask(taskId, {
      status: newStatus,
      history: [...(task.history || []), statusChange]
    });

    // Отправляем уведомления
    sendStatusChangeNotification(task, newStatus);
  };

  const sendStatusChangeNotification = (task, newStatus) => {
    const message = `Статус задачи "${task.title}" изменен на "${newStatus}" пользователем ${currentUser.name}`;
    
    // Уведомляем кураторов
    task.curators.forEach(curatorId => {
      const curator = users.find(u => u.id === curatorId);
      if (curator) {
        console.log(`📧 Уведомление куратору ${curator.name}: ${message}`);
      }
    });

    // Уведомляем исполнителей
    task.executors.forEach(executorId => {
      const executor = users.find(u => u.id === executorId);
      if (executor) {
        console.log(`📧 Уведомление исполнителю ${executor.name}: ${message}`);
      }
    });
  };

  const getFilteredTasks = () => {
    let filtered = allTasks;

    // Поиск по названию
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Фильтр по приоритету
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Фильтр по исполнителю
    if (filterExecutor !== 'all') {
      filtered = filtered.filter(task => 
        task.executors.includes(parseInt(filterExecutor))
      );
    }

    return filtered;
  };

  // Шаблоны задач
  const taskTemplates = [
    {
      id: 1,
      name: "Показать объект клиенту",
      title: "Показать объект клиенту",
      description: "Встреча с клиентом для просмотра недвижимости",
      priority: "medium",
      deadline: "",
      deadlineTime: "10:00"
    },
    {
      id: 2,
      name: "Подготовить документы",
      title: "Подготовить документы для сделки",
      description: "Сбор и оформление всех необходимых документов",
      priority: "high",
      deadline: "",
      deadlineTime: "14:00"
    },
    {
      id: 3,
      name: "Звонок клиенту",
      title: "Звонок клиенту",
      description: "Связаться с клиентом для обсуждения деталей",
      priority: "low",
      deadline: "",
      deadlineTime: "16:00"
    },
    {
      id: 4,
      name: "Встреча с продавцом",
      title: "Встреча с продавцом недвижимости",
      description: "Обсуждение условий продажи объекта",
      priority: "high",
      deadline: "",
      deadlineTime: "11:00"
    },
    {
      id: 5,
      name: "Оценка объекта",
      title: "Провести оценку недвижимости",
      description: "Анализ рыночной стоимости объекта",
      priority: "medium",
      deadline: "",
      deadlineTime: "15:00"
    }
  ];

  // Функции для уведомлений
  const sendNotification = (task, type) => {
    const message = `Напоминание: Задача "${task.title}" должна быть выполнена ${new Date(task.deadline).toLocaleDateString('ru-RU')} в ${task.deadlineTime || 'не указано время'}`;
    
    switch (type) {
      case 'email':
        console.log(`📧 Email уведомление: ${message}`);
        break;
      case 'whatsapp':
        console.log(`📱 WhatsApp уведомление: ${message}`);
        break;
      case 'telegram':
        console.log(`📲 Telegram уведомление: ${message}`);
        break;
    }
  };

  const checkUpcomingDeadlines = () => {
    const today = new Date();
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + notificationSettings.reminderDays);
    
    const upcomingTasks = allTasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate >= today && taskDate <= reminderDate;
    });

    upcomingTasks.forEach(task => {
      if (notificationSettings.email) sendNotification(task, 'email');
      if (notificationSettings.whatsapp) sendNotification(task, 'whatsapp');
      if (notificationSettings.telegram) sendNotification(task, 'telegram');
    });

    return upcomingTasks;
  };

  // Функции для статистики
  const getTaskStatistics = () => {
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.status === 'completed').length;
    const inProgress = allTasks.filter(task => task.status === 'in_progress').length;
    const overdue = getOverdueTasks().length;
    const missed = getMissedTasks().length;
    
    const priorityStats = {
      high: allTasks.filter(task => task.priority === 'high').length,
      medium: allTasks.filter(task => task.priority === 'medium').length,
      low: allTasks.filter(task => task.priority === 'low').length,
      boss: allTasks.filter(task => task.priority === 'boss').length
    };

    const statusStats = {
      new: allTasks.filter(task => task.status === 'new').length,
      in_progress: allTasks.filter(task => task.status === 'in_progress').length,
      completed: allTasks.filter(task => task.status === 'completed').length,
      on_review: allTasks.filter(task => task.status === 'on_review').length,
      deferred: allTasks.filter(task => task.status === 'deferred').length,
      canceled: allTasks.filter(task => task.status === 'canceled').length
    };

    return {
      total,
      completed,
      inProgress,
      overdue,
      missed,
      priorityStats,
      statusStats,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // Функции для работы с формой
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Очищаем ошибку при изменении поля
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Валидация обязательных полей
    if (!formData.title.trim()) {
      errors.title = 'Название задачи обязательно';
    }
    
    if (formData.executors.length === 0) {
      errors.executors = 'Выберите хотя бы одного исполнителя';
    }
    
    // Валидация даты
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        errors.deadline = 'Дата не может быть в прошлом';
      }
    }
    
    // Валидация времени
    if (formData.deadlineTime && !formData.deadline) {
      errors.deadlineTime = 'Укажите дату для времени';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Создаем новую задачу
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline,
        deadlineTime: formData.deadlineTime,
        executors: formData.executors,
        curators: formData.curators,
        subtasks: formData.subtasks.map(subtask => ({
          ...subtask,
          approvedByCurator: false
        })),
        checklists: formData.checklists.map(checklist => ({
          ...checklist,
          approvedByCurator: false
        })),
        images: formData.images,
        links: formData.links,
        isAutoTask: formData.isAutoTask,
        autoFrequency: formData.autoFrequency,
        autoRepetitions: formData.autoRepetitions,
        status: 'new',
        approvedByCurator: false,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        history: [],
        comments: []
      };
      
      // Добавляем задачу в список
      setAllTasks(prev => [...prev, newTask]);
      
      // Сбрасываем форму
      setFormData({
        title: '',
        description: '',
        priority: 'low',
        deadline: '',
        deadlineTime: '12:00',
        executors: [],
        curators: [],
        subtasks: [],
        checklists: [],
        images: [],
        links: [],
        isAutoTask: false,
        autoFrequency: 'daily',
        autoRepetitions: ''
      });
      
      // Закрываем модальное окно
      setIsCreateTaskModalOpen(false);
      
      console.log('Задача создана:', newTask);
    }
  };

  // Тестовые пользователи с ролями
  const users = [
    { id: 1, name: "Анна Петрова", role: "admin", email: "anna@metrika.ru" },
    { id: 2, name: "Иван Сидоров", role: "manager", email: "ivan@metrika.ru" },
    { id: 3, name: "Мария Козлова", role: "employee", email: "maria@metrika.ru" },
    { id: 4, name: "Алексей Волков", role: "employee", email: "alexey@metrika.ru" },
    { id: 5, name: "Елена Соколова", role: "employee", email: "elena@metrika.ru" },
    { id: 6, name: "Дмитрий Морозов", role: "freelancer", email: "dmitry@metrika.ru" },
    { id: 7, name: "Ольга Новикова", role: "client", email: "olga@metrika.ru" },
    { id: 8, name: "Сергей Лебедев", role: "employee", email: "sergey@metrika.ru" }
  ];

  // Права доступа по ролям
  const rolePermissions = {
    admin: {
      canCreate: true,
      canEdit: true,
      canAssign: true,
      canReassign: true,
      canApprove: true,
      canViewAll: true
    },
    manager: {
      canCreate: true,
      canEdit: true,
      canAssign: true,
      canReassign: true,
      canApprove: true,
      canViewAll: true
    },
    employee: {
      canCreate: true,
      canEdit: true,
      canAssign: false,
      canReassign: false,
      canApprove: false,
      canViewAll: false
    },
    freelancer: {
      canCreate: true,
      canEdit: true,
      canAssign: false,
      canReassign: false,
      canApprove: false,
      canViewAll: false
    },
    client: {
      canCreate: false,
      canEdit: false,
      canAssign: false,
      canReassign: false,
      canApprove: false,
      canViewAll: false
    }
  };

  // Получаем актуальные задачи
  const todayTasks = getTasksForToday();
  const tomorrowTasks = getTasksForTomorrow();
  const missedTasks = getMissedTasks();
  const overdueTasks = getOverdueTasks();
  const tasksForCalendar = getTasksForCalendar();
  const filteredTasks = getFilteredTasks();
  const statistics = getTaskStatistics();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      case 'boss': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 4 блока сверху */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Блок 1: Задачи на сегодня */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-3 text-center">
                На сегодня {todayTasks.length} {getTaskWord(todayTasks.length)}
                  </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {todayTasks.map(task => (
                  <div key={task.id} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-xs text-gray-500">{task.deadlineTime || 'Без времени'}</span>
                    </div>
                    <div className="text-sm font-medium text-black">{task.title}</div>
                  </div>
                ))}
                  </div>
                </div>
                
            {/* Блок 2: Задачи на завтра */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-3 text-center">
                На завтра {tomorrowTasks.length} {getTaskWord(tomorrowTasks.length)}
                  </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {tomorrowTasks.map(task => (
                  <div key={task.id} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-xs text-gray-500">{task.deadlineTime || 'Без времени'}</span>
                    </div>
                    <div className="text-sm font-medium text-black">{task.title}</div>
                  </div>
                ))}
                  </div>
                </div>
                
            {/* Блок 3: Пропущенные */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-3 text-center">
                {getMissedWord(missedTasks.length)} {missedTasks.length} {getTaskWord(missedTasks.length)}
                  </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {missedTasks.map(task => (
                  <div key={task.id} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-xs text-gray-500">{new Date(task.deadline).toLocaleDateString('ru-RU')}</span>
                  </div>
                    <div className="text-sm font-medium text-black">{task.title}</div>
                </div>
                ))}
              </div>
            </div>
            
            {/* Блок 4: Кнопки */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-3">
                <button 
                  onClick={() => setIsCreateTaskModalOpen(true)}
                  className="w-full bg-white text-black py-3 px-4 rounded hover:bg-gray-50 transition-colors shadow-md"
                >
                  Создать задачу
                </button>
                <button 
                  onClick={() => window.location.href = '/my-tasks'}
                  className="w-full bg-white text-black py-3 px-4 rounded hover:bg-gray-50 transition-colors shadow-md"
                >
                  Мои задачи
                </button>
                <button 
                  onClick={() => window.location.href = '/all-tasks'}
                  className="w-full bg-white text-black py-3 px-4 rounded hover:bg-gray-50 transition-colors shadow-md"
                >
                  Все задачи
                </button>
                <button 
                  onClick={() => setShowTemplates(true)}
                  className="w-full bg-white text-black py-3 px-4 rounded hover:bg-gray-50 transition-colors shadow-md"
                >
                  Шаблоны
                </button>
                <button 
                  onClick={() => setShowStatistics(true)}
                  className="w-full bg-white text-black py-3 px-4 rounded hover:bg-gray-50 transition-colors shadow-md"
                >
                  Статистика
                </button>
                <button 
                  onClick={() => checkUpcomingDeadlines()}
                  className="w-full bg-white text-black py-3 px-4 rounded hover:bg-gray-50 transition-colors shadow-md"
                >
                  Проверить уведомления
                </button>
              </div>
                  </div>
                </div>
                
          {/* Поиск и фильтры */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Поиск и фильтры</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Поиск */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Поиск по названию
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название задачи..."
                />
              </div>

              {/* Фильтр по статусу */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все статусы</option>
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="on_review">На проверке</option>
                  <option value="completed">Выполнена</option>
                  <option value="deferred">Отложена</option>
                  <option value="canceled">Отменена</option>
                </select>
              </div>

              {/* Фильтр по приоритету */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все приоритеты</option>
                  <option value="low">🟢 Обычная</option>
                  <option value="medium">🟠 Важная</option>
                  <option value="high">🔴 Срочная</option>
                  <option value="boss">🟡 Задача от руководителя</option>
                </select>
              </div>

              {/* Фильтр по исполнителю */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Исполнитель
                </label>
                <select
                  value={filterExecutor}
                  onChange={(e) => setFilterExecutor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все исполнители</option>
                  {users.filter(user => ['admin', 'manager', 'employee', 'freelancer'].includes(user.role)).map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Список отфильтрованных задач */}
          {filteredTasks.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Найдено задач: {filteredTasks.length}
                  </h3>
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <h4 className="text-lg font-medium text-black">{task.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'new' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'new' ? 'Новая' :
                           task.status === 'in_progress' ? 'В работе' :
                           task.status === 'on_review' ? 'На проверке' :
                           task.status === 'completed' ? 'Выполнена' :
                           task.status === 'deferred' ? 'Отложена' :
                           'Отменена'}
                    </span>
                  </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          Редактировать
                        </button>
                        {canReassignExecutor(task) && (
                          <button
                            onClick={() => console.log('Переназначить исполнителя')}
                            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                          >
                            Переназначить
                          </button>
                        )}
                        {task.executors.includes(currentUser.id) && task.status === 'new' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'in_progress')}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                          >
                            Взять в работу
                          </button>
                        )}
                        {task.executors.includes(currentUser.id) && task.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            disabled={!isTaskFullyApproved(task)}
                            className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                              isTaskFullyApproved(task) 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Выполнена
                          </button>
                        )}
                        {task.curators.includes(currentUser.id) && task.status === 'in_progress' && (
                          <button
                            onClick={() => {
                              setSelectedTaskForComments(task);
                              setShowCommentsModal(true);
                            }}
                            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                          >
                            Замечания
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          Удалить
                        </button>
                </div>
              </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {task.deadline && (
                        <span>Срок: {new Date(task.deadline).toLocaleDateString('ru-RU')}</span>
                      )}
                      {task.deadlineTime && (
                        <span>Время: {task.deadlineTime}</span>
                      )}
                      <span>Создана: {new Date(task.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Модальное окно шаблонов */}
          {showTemplates && (
            <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Шаблоны задач</h2>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {taskTemplates.map(template => (
                    <div key={template.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-lg font-medium text-black mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(template.priority)}`}></div>
                          <span className="text-xs text-gray-500">{template.deadlineTime}</span>
                        </div>
                        <button
                          onClick={() => {
                            setFormData({
                              title: template.title,
                              description: template.description,
                              priority: template.priority,
                              deadline: template.deadline,
                              deadlineTime: template.deadlineTime,
                              executors: [],
                              curators: [],
                              subtasks: [],
                              checklists: [],
                              images: [],
                              links: [],
                              isAutoTask: false,
                              autoFrequency: 'daily',
                              autoRepetitions: ''
                            });
                            setShowTemplates(false);
                            setIsCreateTaskModalOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          Использовать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Модальное окно статистики */}
          {showStatistics && (
            <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Статистика и аналитика</h2>
                  <button
                    onClick={() => setShowStatistics(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Общая статистика */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Всего задач</h3>
                    <p className="text-3xl font-bold text-blue-600">{statistics.total}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Выполнено</h3>
                    <p className="text-3xl font-bold text-green-600">{statistics.completed}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">В работе</h3>
                    <p className="text-3xl font-bold text-yellow-600">{statistics.inProgress}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Просрочено</h3>
                    <p className="text-3xl font-bold text-red-600">{statistics.overdue}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Статистика по приоритетам */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-black mb-4">По приоритетам</h3>
              <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm text-gray-700">Срочные</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{statistics.priorityStats.high}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm text-gray-700">Важные</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{statistics.priorityStats.medium}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-700">Обычные</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{statistics.priorityStats.low}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm text-gray-700">От руководителя</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{statistics.priorityStats.boss}</span>
                      </div>
                  </div>
                </div>
                
                  {/* Статистика по статусам */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-black mb-4">По статусам</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Новые</span>
                        <span className="text-sm font-medium text-gray-900">{statistics.statusStats.new}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">В работе</span>
                        <span className="text-sm font-medium text-gray-900">{statistics.statusStats.in_progress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">На проверке</span>
                        <span className="text-sm font-medium text-gray-900">{statistics.statusStats.on_review}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Выполнены</span>
                        <span className="text-sm font-medium text-gray-900">{statistics.statusStats.completed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Отложены</span>
                        <span className="text-sm font-medium text-gray-900">{statistics.statusStats.deferred}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Отменены</span>
                        <span className="text-sm font-medium text-gray-900">{statistics.statusStats.canceled}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Процент выполнения */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Процент выполнения</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${statistics.completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{statistics.completionRate}% задач выполнено</p>
                </div>
              </div>
            </div>
          )}

          {/* Календарь на два месяца */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-black mb-6 text-center">
              Сентябрь 2024 - Октябрь 2024
                  </h3>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Сентябрь */}
              <div>
                <h4 className="text-lg font-medium text-black mb-4 text-center">Сентябрь 2024</h4>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  <div className="p-2 text-center font-medium text-gray-500">Пн</div>
                  <div className="p-2 text-center font-medium text-gray-500">Вт</div>
                  <div className="p-2 text-center font-medium text-gray-500">Ср</div>
                  <div className="p-2 text-center font-medium text-gray-500">Чт</div>
                  <div className="p-2 text-center font-medium text-gray-500">Пт</div>
                  <div className="p-2 text-center font-medium text-gray-500">Сб</div>
                  <div className="p-2 text-center font-medium text-gray-500">Вс</div>
                  
                  <div className="p-2 text-center text-gray-400">26</div>
                  <div className="p-2 text-center text-gray-400">27</div>
                  <div className="p-2 text-center text-gray-400">28</div>
                  <div className="p-2 text-center text-gray-400">29</div>
                  <div className="p-2 text-center text-gray-400">30</div>
                  <div className="p-2 text-center text-gray-400">31</div>
                  <div className="p-2 text-center">1</div>
                  
                  <div className="p-2 text-center">2</div>
                  <div className="p-2 text-center">3</div>
                  <div className="p-2 text-center">4</div>
                  <div className="p-2 text-center">5</div>
                  <div className="p-2 text-center">6</div>
                  <div className="p-2 text-center">7</div>
                  <div className="p-2 text-center">8</div>
                  
                  <div className="p-2 text-center">9</div>
                  <div className="p-2 text-center">10</div>
                  <div className="p-2 text-center">11</div>
                  <div className="p-2 text-center">12</div>
                  <div className="p-2 text-center">13</div>
                  <div className="p-2 text-center">14</div>
                  <div className="p-2 text-center">15</div>
                  
                  <div className="p-2 text-center">16</div>
                  <div className="p-2 text-center">17</div>
                  <div className="p-2 text-center">18</div>
                  <div className="p-2 text-center">19</div>
                  <div className="p-2 text-center">20</div>
                  <div className="p-2 text-center">21</div>
                  <div className="p-2 text-center">22</div>
                  
                  <div className="p-2 text-center">23</div>
                  <div className="p-2 text-center">24</div>
                  <div className="p-2 text-center">25</div>
                  <div className="p-2 text-center bg-blue-100 text-blue-800 rounded relative">
                    26
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="p-2 text-center">27</div>
                  <div className="p-2 text-center">28</div>
                  <div className="p-2 text-center">29</div>
                  
                  <div className="p-2 text-center">30</div>
                  <div className="p-2 text-center text-gray-400">1</div>
                  <div className="p-2 text-center text-gray-400">2</div>
                  <div className="p-2 text-center text-gray-400">3</div>
                  <div className="p-2 text-center text-gray-400">4</div>
                  <div className="p-2 text-center text-gray-400">5</div>
                  <div className="p-2 text-center text-gray-400">6</div>
                </div>
              </div>

              {/* Октябрь */}
              <div>
                <h4 className="text-lg font-medium text-black mb-4 text-center">Октябрь 2024</h4>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  <div className="p-2 text-center font-medium text-gray-500">Пн</div>
                  <div className="p-2 text-center font-medium text-gray-500">Вт</div>
                  <div className="p-2 text-center font-medium text-gray-500">Ср</div>
                  <div className="p-2 text-center font-medium text-gray-500">Чт</div>
                  <div className="p-2 text-center font-medium text-gray-500">Пт</div>
                  <div className="p-2 text-center font-medium text-gray-500">Сб</div>
                  <div className="p-2 text-center font-medium text-gray-500">Вс</div>
                  
                  <div className="p-2 text-center text-gray-400">30</div>
                  <div className="p-2 text-center text-gray-400">1</div>
                  <div className="p-2 text-center">2</div>
                  <div className="p-2 text-center">3</div>
                  <div className="p-2 text-center">4</div>
                  <div className="p-2 text-center bg-yellow-100 text-yellow-800 rounded relative">
                    5
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
                  <div className="p-2 text-center">6</div>
                  
                  <div className="p-2 text-center">7</div>
                  <div className="p-2 text-center">8</div>
                  <div className="p-2 text-center">9</div>
                  <div className="p-2 text-center">10</div>
                  <div className="p-2 text-center">11</div>
                  <div className="p-2 text-center bg-green-100 text-green-800 rounded relative">
                    12
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
                  <div className="p-2 text-center">13</div>
                  
                  <div className="p-2 text-center">14</div>
                  <div className="p-2 text-center">15</div>
                  <div className="p-2 text-center">16</div>
                  <div className="p-2 text-center">17</div>
                  <div className="p-2 text-center bg-purple-100 text-purple-800 rounded relative">
                    18
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="p-2 text-center">19</div>
                  <div className="p-2 text-center">20</div>
                  
                  <div className="p-2 text-center">21</div>
                  <div className="p-2 text-center">22</div>
                  <div className="p-2 text-center">23</div>
                  <div className="p-2 text-center">24</div>
                  <div className="p-2 text-center">25</div>
                  {(() => {
                    const days = [];
                    for (let day = 26; day <= 30; day++) {
                      const date = new Date(2024, 8, day); // 8 = сентябрь (0-indexed)
                      const dateString = date.toDateString();
                      const dayTasks = tasksForCalendar[dateString] || [];
                      
                      days.push(
                        <div key={day} className="p-2 text-center relative">
                          {day}
                          {dayTasks.length > 0 && (
                            <div className="absolute top-1 right-1 flex space-x-1">
                              {dayTasks.slice(0, 3).map((task, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                                  title={task.title}
                                ></div>
                              ))}
                              {dayTasks.length > 3 && (
                                <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dayTasks.length - 3} задач`}></div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return days;
                  })()}
                  <div className="p-2 text-center">31</div>
                  <div className="p-2 text-center text-gray-400">1</div>
                  <div className="p-2 text-center text-gray-400">2</div>
                  <div className="p-2 text-center text-gray-400">3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Модальное окно создания задачи */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Создать задачу</h2>
              <button
                onClick={() => setIsCreateTaskModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Форма создания задачи */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Блок 1: Основная информация */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название задачи *
                </label>
                <input
                  type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.title 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                  placeholder="Введите название задачи"
                      required
                />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                    )}
              </div>
              
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание задачи
                </label>
                <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Опишите детали задачи"
                />
              </div>
              
                  <div className="flex gap-4">
                <div className="w-1/4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                    Приоритет
                  </label>
                      <select 
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">🟢 Обычная</option>
                        <option value="medium">🟠 Важная</option>
                        <option value="high">🔴 Срочная</option>
                        <option value="boss">🟡 Задача от руководителя</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок выполнения
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDeadline(!showDeadline)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm mb-4"
                  >
                    {showDeadline ? '−' : '+'}
                  </button>
                  
                  {showDeadline && (
                    <div className="mt-4 space-y-2 relative">
                      <div className="space-y-2">
                  <input
                          type="text"
                          value={formData.deadline ? new Date(formData.deadline).toLocaleDateString('ru-RU') : ''}
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          readOnly
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
                            formErrors.deadline 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Выберите дату"
                        />
                        <div className="flex space-x-2">
                          <div className="flex-1 relative">
                            {formData.deadlineTime === '' ? (
                              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-pointer"
                                   onClick={() => handleInputChange('deadlineTime', '12:00')}>
                                Весь день
                              </div>
                            ) : (
                              <input
                                type="time"
                                value={formData.deadlineTime}
                                onChange={(e) => handleInputChange('deadlineTime', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                  formErrors.deadlineTime 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleInputChange('deadlineTime', '')}
                            className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                              formData.deadlineTime === '' 
                                ? 'bg-gray-500 text-white border-gray-500' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Весь день
                          </button>
                        </div>
                      </div>
                      
                      {/* Кастомный календарь */}
                      {showDatePicker && (
                        <div className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-1">
                          <div className="flex items-center justify-between mb-4">
                            <button
                              type="button"
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                              className="p-2 hover:bg-gray-100 rounded"
                            >
                              ←
                            </button>
                            <h3 className="text-lg font-semibold">
                              {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                className="p-2 hover:bg-gray-100 rounded"
                              >
                                →
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowDatePicker(false)}
                                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {getCalendarDays().map((day, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  if (day) {
                                    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                    handleInputChange('deadline', selectedDate.toISOString().split('T')[0]);
                                    setShowDatePicker(false);
                                  }
                                }}
                                className={`p-2 text-sm rounded hover:bg-gray-100 ${
                                  day ? 'text-black' : 'text-gray-300'
                                } ${
                                  formData.deadline && day && 
                                  new Date(formData.deadline).getDate() === day &&
                                  new Date(formData.deadline).getMonth() === currentMonth.getMonth() &&
                                  new Date(formData.deadline).getFullYear() === currentMonth.getFullYear()
                                    ? 'bg-blue-500 text-white' : ''
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formErrors.deadline && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>
                      )}
                      {formErrors.deadlineTime && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.deadlineTime}</p>
                      )}
                    </div>
                  )}
                </div>
                  </div>
                </div>
              </div>

              {/* Блок 2: Исполнители и кураторы */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4">Исполнители и кураторы</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Исполнители *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowExecutorsDropdown(!showExecutorsDropdown)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white ${
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
                                    handleInputChange('executors', [...formData.executors, user.id]);
                                  } else {
                                    handleInputChange('executors', formData.executors.filter(id => id !== user.id));
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Кураторы
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCuratorsDropdown(!showCuratorsDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white"
                      >
                        {formData.curators.length > 0 
                          ? `${formData.curators.length} выбрано` 
                          : 'Выберите кураторов'
                        }
                      </button>
                      {showCuratorsDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {users.map(user => (
                            <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.curators.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleInputChange('curators', [...formData.curators, user.id]);
                                  } else {
                                    handleInputChange('curators', formData.curators.filter(id => id !== user.id));
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
              </div>

              {/* Блок 3: Подзадачи */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Подзадачи</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreateSubtaskModalOpen(true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                
                {/* Список созданных подзадач - отображается только если есть подзадачи */}
                {formData.subtasks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600 mb-2">
                      Созданные подзадачи ({formData.subtasks.length}):
                    </div>
                    {formData.subtasks.map((subtask, index) => (
                      <div key={subtask.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(subtask.priority)}`}></div>
                          <span className="text-sm font-medium text-black">{subtask.title}</span>
                          <span className="text-xs text-gray-500">
                            {subtask.executors.length > 0 && `Исполнители: ${subtask.executors.length}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            {subtask.curators.length > 0 && `Кураторы: ${subtask.curators.length}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedSubtasks = formData.subtasks.filter((_, i) => i !== index);
                            handleInputChange('subtasks', updatedSubtasks);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="Удалить подзадачу"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Блок 4: Чек-листы */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Чек-листы</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreateChecklistModalOpen(true)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                
                {/* Список созданных чек-листов - отображается только если есть чек-листы */}
                {formData.checklists.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600 mb-2">
                      Созданные чек-листы ({formData.checklists.length}):
                    </div>
                    {formData.checklists.map((checklist, index) => (
                      <div key={checklist.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-black">{checklist.title}</span>
                          <span className="text-xs text-gray-500">
                            {checklist.items.length} пунктов
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedChecklists = formData.checklists.filter((_, i) => i !== index);
                            handleInputChange('checklists', updatedChecklists);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="Удалить чек-лист"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Блок 5: Вложения */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Вложения</h3>
                  <button
                    type="button"
                    onClick={() => setShowAttachments(!showAttachments)}
                    className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
                  >
                    {showAttachments ? '−' : '+'}
                  </button>
                </div>
                {showAttachments && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Изображения
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ссылки
                      </label>
                      <div className="space-y-2">
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com"
                        />
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                          Добавить ссылку
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Блок 6: Автоматизация */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Автоматизация</h3>
                  <button
                    type="button"
                    onClick={() => setShowAutomation(!showAutomation)}
                    className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
                  >
                    {showAutomation ? '−' : '+'}
                  </button>
                </div>
                {showAutomation && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoTask"
                        checked={formData.isAutoTask}
                        onChange={(e) => handleInputChange('isAutoTask', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="autoTask" className="text-sm text-gray-700">
                        Автоматическая задача (повторяется по расписанию)
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Периодичность
                        </label>
                        <select 
                          value={formData.autoFrequency}
                          onChange={(e) => handleInputChange('autoFrequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Ежедневно</option>
                          <option value="weekly">Еженедельно</option>
                          <option value="monthly">Ежемесячно</option>
                          <option value="custom">Произвольно</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Количество повторений
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.autoRepetitions}
                          onChange={(e) => handleInputChange('autoRepetitions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Без ограничений"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Создать задачу
              </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования задачи */}
      {editingTask && (
        <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Редактировать задачу</h2>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название задачи
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="on_review">На проверке</option>
                  <option value="completed">Выполнена</option>
                  <option value="deferred">Отложена</option>
                  <option value="canceled">Отменена</option>
                </select>
              </div>

              {/* Приоритет */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Обычная</option>
                  <option value="medium">🟡 Важная</option>
                  <option value="high">🔴 Срочная</option>
                </select>
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  rows={3}
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateTask(editingTask.id, editingTask);
                    setEditingTask(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Модальное окно создания подзадачи */}
      {isCreateSubtaskModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 mb-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Создать подзадачу</h2>
              <button
                onClick={() => {
                  setIsCreateSubtaskModalOpen(false);
                  setSubtaskFormData({
                    title: '',
                    description: '',
                    executors: [],
                    curators: [],
                    priority: 'low',
                    deadline: '',
                    deadlineTime: '12:00',
                    subtasks: [],
                    checklists: [],
                    attachments: []
                  });
                  setSubtaskFormErrors({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]">
              {/* Блок 1: Основная информация */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название подзадачи *
                    </label>
                    <input
                      type="text"
                      value={subtaskFormData.title}
                      onChange={(e) => handleSubtaskInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        subtaskFormErrors.title 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Введите название подзадачи"
                      required
                    />
                    {subtaskFormErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{subtaskFormErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание подзадачи
                    </label>
                    <textarea
                      rows={4}
                      value={subtaskFormData.description}
                      onChange={(e) => handleSubtaskInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Опишите детали подзадачи"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-1/4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Приоритет
                      </label>
                      <select 
                        value={subtaskFormData.priority}
                        onChange={(e) => handleSubtaskInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">🟢 Обычная</option>
                        <option value="medium">🟠 Важная</option>
                        <option value="high">🔴 Срочная</option>
                        <option value="boss">🟡 Задача от руководителя</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Срок выполнения
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowDeadline(!showDeadline)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm mb-4"
                      >
                        {showDeadline ? '−' : '+'}
                      </button>
                      
                      {showDeadline && (
                        <div className="mt-4 space-y-2 relative">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={subtaskFormData.deadline ? new Date(subtaskFormData.deadline).toLocaleDateString('ru-RU') : ''}
                              onClick={() => setShowDatePicker(!showDatePicker)}
                              readOnly
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
                                subtaskFormErrors.deadline 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                              placeholder="Выберите дату"
                            />
                            <div className="flex space-x-2">
                              <div className="flex-1 relative">
                                {subtaskFormData.deadlineTime === '' ? (
                                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-pointer"
                                       onClick={() => handleSubtaskInputChange('deadlineTime', '12:00')}>
                                    Весь день
                                  </div>
                                ) : (
                                  <input
                                    type="time"
                                    value={subtaskFormData.deadlineTime}
                                    onChange={(e) => handleSubtaskInputChange('deadlineTime', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                      subtaskFormErrors.deadlineTime 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                  />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSubtaskInputChange('deadlineTime', '')}
                                className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                                  subtaskFormData.deadlineTime === '' 
                                    ? 'bg-gray-500 text-white border-gray-500' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                Весь день
                              </button>
                            </div>
                          </div>
                          
                          {/* Кастомный календарь */}
                          {showDatePicker && (
                            <div className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-1">
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  type="button"
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                  className="p-2 hover:bg-gray-100 rounded"
                                >
                                  ←
                                </button>
                                <h3 className="text-lg font-semibold">
                                  {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    className="p-2 hover:bg-gray-100 rounded"
                                  >
                                    →
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowDatePicker(false)}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                    {day}
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {getCalendarDays().map((day, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      if (day) {
                                        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        handleSubtaskInputChange('deadline', selectedDate.toISOString().split('T')[0]);
                                        setShowDatePicker(false);
                                      }
                                    }}
                                    className={`p-2 text-sm rounded hover:bg-gray-100 ${
                                      day ? 'text-black' : 'text-gray-300'
                                    } ${
                                      subtaskFormData.deadline && day && 
                                      new Date(subtaskFormData.deadline).getDate() === day &&
                                      new Date(subtaskFormData.deadline).getMonth() === currentMonth.getMonth() &&
                                      new Date(subtaskFormData.deadline).getFullYear() === currentMonth.getFullYear()
                                        ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {subtaskFormErrors.deadline && (
                            <p className="text-red-500 text-sm mt-1">{subtaskFormErrors.deadline}</p>
                          )}
                          {subtaskFormErrors.deadlineTime && (
                            <p className="text-red-500 text-sm mt-1">{subtaskFormErrors.deadlineTime}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Блок 2: Исполнители и кураторы */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4">Исполнители и кураторы</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Исполнители *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowExecutorsDropdown(!showExecutorsDropdown)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white ${
                          subtaskFormErrors.executors ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {subtaskFormData.executors.length > 0 
                          ? `${subtaskFormData.executors.length} выбрано` 
                          : 'Выберите исполнителей'
                        }
                      </button>
                      {subtaskFormErrors.executors && (
                        <p className="mt-1 text-sm text-red-600">{subtaskFormErrors.executors}</p>
                      )}
                      {showExecutorsDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {users.filter(user => ['admin', 'manager', 'employee', 'freelancer'].includes(user.role)).map(user => (
                            <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={subtaskFormData.executors.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleSubtaskInputChange('executors', [...subtaskFormData.executors, user.id]);
                                  } else {
                                    handleSubtaskInputChange('executors', subtaskFormData.executors.filter(id => id !== user.id));
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Кураторы
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCuratorsDropdown(!showCuratorsDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white"
                      >
                        {subtaskFormData.curators.length > 0 
                          ? `${subtaskFormData.curators.length} выбрано` 
                          : 'Выберите кураторов'
                        }
                      </button>
                      {showCuratorsDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {users.map(user => (
                            <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={subtaskFormData.curators.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleSubtaskInputChange('curators', [...subtaskFormData.curators, user.id]);
                                  } else {
                                    handleSubtaskInputChange('curators', subtaskFormData.curators.filter(id => id !== user.id));
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
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateSubtaskModalOpen(false);
                    setSubtaskFormData({
                      title: '',
                      description: '',
                      executors: [],
                      curators: [],
                      priority: 'low',
                      deadline: '',
                      deadlineTime: '12:00',
                      subtasks: [],
                      checklists: [],
                      attachments: []
                    });
                    setSubtaskFormErrors({});
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSubtaskSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Создать подзадачу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания чек-листа */}
      {isCreateChecklistModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Создать чек-лист</h2>
              <button
                onClick={() => setIsCreateChecklistModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Название чек-листа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название чек-листа *
                </label>
                <input
                  type="text"
                  value={checklistFormData.title}
                  onChange={(e) => handleChecklistInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    checklistFormErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите название чек-листа"
                />
                {checklistFormErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{checklistFormErrors.title}</p>
                )}
              </div>

              {/* Таблица чек-листа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пункты чек-листа * (минимум 2)
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                      <div className="col-span-1 text-center">✓</div>
                      <div className="col-span-6">Действие</div>
                      <div className="col-span-2 text-center">Куратор</div>
                      <div className="col-span-2 text-center">Исполнитель</div>
                      <div className="col-span-1 text-center">✕</div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {checklistFormData.items.map((item, index) => (
                      <div key={item.id} className="p-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Чекбокс */}
                          <div className="col-span-1 flex justify-center">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded bg-gray-100"></div>
                          </div>
                          
                          {/* Поле ввода действия */}
                          <div className="col-span-6">
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => handleChecklistItemChange(item.id, 'text', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Введите действие"
                            />
                          </div>
                          
                          {/* Куратор */}
                          <div className="col-span-2 flex justify-center relative">
                            {item.curator ? (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-blue-600">{item.curator}</span>
                                <button
                                  type="button"
                                  onClick={() => removeChecklistCurator(item.id)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setShowChecklistCuratorDropdown(item.id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              >
                                +
                              </button>
                            )}
                            
                            {/* Выпадающий список кураторов */}
                            {showChecklistCuratorDropdown === item.id && (
                              <div className="absolute z-20 top-8 left-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto min-w-32">
                                {users.map(user => {
                                  const nameParts = user.name.split(' ');
                                  const firstName = nameParts[0] || '';
                                  const lastName = nameParts.slice(1).join(' ') || '';
                                  return (
                                    <button
                                      key={user.id}
                                      type="button"
                                      onClick={() => handleChecklistCuratorSelect(item.id, user.id)}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex flex-col">
                                        <span>{firstName}</span>
                                        <span>{lastName}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          
                          {/* Исполнитель */}
                          <div className="col-span-2 flex justify-center relative">
                            {item.executor ? (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-orange-600">{item.executor}</span>
                                <button
                                  type="button"
                                  onClick={() => removeChecklistExecutor(item.id)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setShowChecklistExecutorDropdown(item.id)}
                                className="px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                              >
                                +
                              </button>
                            )}
                            
                            {/* Выпадающий список исполнителей */}
                            {showChecklistExecutorDropdown === item.id && (
                              <div className="absolute z-20 top-8 left-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto min-w-32">
                                {users.map(user => {
                                  const nameParts = user.name.split(' ');
                                  const firstName = nameParts[0] || '';
                                  const lastName = nameParts.slice(1).join(' ') || '';
                                  return (
                                    <button
                                      key={user.id}
                                      type="button"
                                      onClick={() => handleChecklistExecutorSelect(item.id, user.id)}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex flex-col">
                                        <span>{firstName}</span>
                                        <span>{lastName}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          
                          {/* Удалить строку */}
                          <div className="col-span-1 flex justify-center">
                            {checklistFormData.items.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeChecklistItem(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Кнопка добавления строки */}
                  <div className="p-4 bg-gray-50 border-t border-gray-300">
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
                    >
                      + Добавить строку
                    </button>
                  </div>
                </div>
                
                {checklistFormErrors.items && (
                  <p className="mt-1 text-sm text-red-600">{checklistFormErrors.items}</p>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateChecklistModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleChecklistSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                >
                  Создать чек-лист
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно замечаний */}
      {showCommentsModal && selectedTaskForComments && (
        <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto pt-[130px]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Замечания к задаче: {selectedTaskForComments.title}</h2>
              <button
                onClick={() => {
                  setShowCommentsModal(false);
                  setSelectedTaskForComments(null);
                  setNewComment('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* История замечаний */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">История замечаний</h3>
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {selectedTaskForComments.comments?.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                  {(!selectedTaskForComments.comments || selectedTaskForComments.comments.length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-4">Замечаний пока нет</p>
                  )}
                </div>
              </div>

              {/* Новое замечание */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Добавить замечание</h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите замечание..."
                />
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCommentsModal(false);
                    setSelectedTaskForComments(null);
                    setNewComment('');
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newComment.trim()) {
                      addComment(selectedTaskForComments.id, newComment);
                      setNewComment('');
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Добавить замечание
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newComment.trim()) {
                      addComment(selectedTaskForComments.id, newComment);
                    }
                    handleStatusChange(selectedTaskForComments.id, 'in_progress');
                    setShowCommentsModal(false);
                    setSelectedTaskForComments(null);
                    setNewComment('');
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Подтвердить выполнение
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}