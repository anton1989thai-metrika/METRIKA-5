"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string;
  deadlineTime: string;
  executors: number[];
  curators: number[];
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  images: any[];
  links: any[];
  checklists: any[];
  subtasks: any[];
  comments: any[];
  tags: string[];
  estimatedHours: number;
  actualHours: number;
}

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

export default function MyTasksPage() {
  const { t } = useLanguage();
  const [currentUser] = useState<User>({ id: 1, name: "Анна Петрова", role: "admin", email: "anna@metrika.ru" });
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Тестовые пользователи
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

  // Тестовые задачи (те же что и в основной странице)
  const testTasks: Task[] = [
    {
      id: 1,
      title: "Разработка нового модуля аналитики",
      description: "Создать модуль для анализа эффективности маркетинговых кампаний с возможностью экспорта данных в Excel и PDF форматах.",
      priority: "high",
      status: "in_progress",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deadlineTime: "15:30",
      executors: [3, 4], // Мария Козлова, Алексей Волков
      curators: [2], // Иван Сидоров
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 1, // Анна Петрова
      images: [],
      links: [],
      checklists: [],
      subtasks: [],
      comments: [],
      tags: ["разработка", "аналитика", "CRM", "приоритет"],
      estimatedHours: 24,
      actualHours: 8
    },
    {
      id: 2,
      title: "Обновление дизайна главной страницы",
      description: "Переработать дизайн главной страницы сайта в соответствии с новыми требованиями брендинга.",
      priority: "medium",
      status: "new",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deadlineTime: "18:00",
      executors: [1], // Анна Петрова
      curators: [2], // Иван Сидоров
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 2, // Иван Сидоров
      images: [],
      links: [],
      checklists: [],
      subtasks: [],
      comments: [],
      tags: ["дизайн", "UI/UX", "главная страница"],
      estimatedHours: 16,
      actualHours: 0
    },
    {
      id: 3,
      title: "Настройка системы уведомлений",
      description: "Реализовать систему push-уведомлений для мобильного приложения.",
      priority: "low",
      status: "completed",
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deadlineTime: "12:00",
      executors: [5], // Елена Соколова
      curators: [1], // Анна Петрова
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 1, // Анна Петрова
      images: [],
      links: [],
      checklists: [],
      subtasks: [],
      comments: [],
      tags: ["уведомления", "мобильное приложение", "push"],
      estimatedHours: 12,
      actualHours: 12
    }
  ];

  useEffect(() => {
    setAllTasks(testTasks);
  }, []);

  // Функция для получения задач связанных с текущим пользователем
  const getMyTasks = () => {
    return allTasks.filter(task => 
      task.createdBy === currentUser.id || // Задачи которые я создал
      task.executors.includes(currentUser.id) || // Задачи где я исполнитель
      task.curators.includes(currentUser.id) // Задачи где я куратор
    );
  };

  // Функция для получения задач по статусу
  const getTasksByStatus = (status: string) => {
    const myTasks = getMyTasks();
    switch (status) {
      case 'created':
        return myTasks.filter(task => task.createdBy === currentUser.id);
      case 'assigned':
        return myTasks.filter(task => task.executors.includes(currentUser.id));
      case 'curated':
        return myTasks.filter(task => task.curators.includes(currentUser.id));
      case 'completed':
        return myTasks.filter(task => task.status === 'completed');
      case 'in_progress':
        return myTasks.filter(task => task.status === 'in_progress');
      case 'overdue':
        return myTasks.filter(task => {
          const deadline = new Date(task.deadline);
          const now = new Date();
          return deadline < now && task.status !== 'completed';
        });
      default:
        return myTasks;
    }
  };

  // Функция для получения цвета приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      case 'boss': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Функция для получения названия приоритета
  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'low': return '🟢 Обычная';
      case 'medium': return '🟠 Важная';
      case 'high': return '🔴 Срочная';
      case 'boss': return '🟡 Задача от руководителя';
      default: return 'Неизвестно';
    }
  };

  // Функция для получения названия статуса
  const getStatusName = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'review': return 'На проверке';
      case 'completed': return 'Выполнена';
      case 'postponed': return 'Отложена';
      case 'cancelled': return 'Отменена';
      case 'overdue': return 'Просрочена';
      default: return 'Неизвестно';
    }
  };

  // Функция для получения имени пользователя по ID
  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Неизвестный пользователь';
  };

  // Функция для получения роли пользователя в задаче
  const getUserRoleInTask = (task: Task) => {
    if (task.createdBy === currentUser.id) return 'Создатель';
    if (task.executors.includes(currentUser.id)) return 'Исполнитель';
    if (task.curators.includes(currentUser.id)) return 'Куратор';
    return 'Участник';
  };

  // Фильтрация задач
  useEffect(() => {
    const tasks = getTasksByStatus(activeTab);
    setFilteredTasks(tasks);
  }, [allTasks, activeTab, currentUser.id]);

  const tabs = [
    { id: 'all', name: 'Все задачи', count: getMyTasks().length },
    { id: 'created', name: 'Созданные мной', count: getTasksByStatus('created').length },
    { id: 'assigned', name: 'Назначенные мне', count: getTasksByStatus('assigned').length },
    { id: 'curated', name: 'Курируемые мной', count: getTasksByStatus('curated').length },
    { id: 'in_progress', name: 'В работе', count: getTasksByStatus('in_progress').length },
    { id: 'overdue', name: 'Просроченные', count: getTasksByStatus('overdue').length },
    { id: 'completed', name: 'Выполненные', count: getTasksByStatus('completed').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Мои задачи</h1>
            <p className="text-gray-600">Все задачи связанные с вами</p>
          </div>

          {/* Табы */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-gray-500 text-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs">{tab.name}</span>
                    <span className="mt-1 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>


          {/* Список задач */}
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-black">{task.title}</h3>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Статус: <span className="font-medium">{getStatusName(task.status)}</span></span>
                        <span>Дедлайн: <span className="font-medium">{task.deadline} в {task.deadlineTime}</span></span>
                        <span>Моя роль: <span className="font-medium text-gray-600">{getUserRoleInTask(task)}</span></span>
                        <span>Создатель: <span className="font-medium">{getUserName(task.createdBy)}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Link 
                        href={`/task/${task.id}`}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center"
                      >
                        Открыть
                      </Link>
                             <Link
                               href={`/task/${task.id}/edit`}
                               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center"
                             >
                               Редактировать
                             </Link>
                    </div>
                  </div>
                  
                  {/* Теги */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Задач не найдено</h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? 'У вас пока нет связанных задач'
                    : `Нет задач в категории "${tabs.find(t => t.id === activeTab)?.name}"`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
