"use client"

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import type { TaskItem, UserId } from "@/types/task-ui";
import { taskUsers, type TaskUser } from "@/data/task-users";

type Task = TaskItem;

export default function MyTasksPage() {
  const [currentUser] = useState<TaskUser>(() => {
    return taskUsers.find((user) => user.email === "nekhoroshkov@metrika.direct") ?? taskUsers[0];
  });
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Тестовые пользователи
  const users = taskUsers;

  // Тестовые задачи (те же что и в основной странице)
  const testTasks = useMemo<Task[]>(() => ([
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
  ]), []);

  useEffect(() => {
    setAllTasks(testTasks);
  }, [testTasks]);

  // Функция для получения задач связанных с текущим пользователем
  const getMyTasks = useCallback(() => {
    return allTasks.filter(task => 
      task.createdBy === currentUser.id || // Задачи которые я создал
      task.executors.includes(currentUser.id) || // Задачи где я исполнитель
      task.curators.includes(currentUser.id) // Задачи где я куратор
    );
  }, [allTasks, currentUser.id]);

  // Функция для получения задач по статусу
  const getTasksByStatus = useCallback((status: string) => {
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
  }, [currentUser.id, getMyTasks]);

  // Функция для получения цвета приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-400';
      case 'medium': return 'bg-gray-500';
      case 'high': return 'bg-gray-600';
      case 'boss': return 'bg-gray-700';
      default: return 'bg-gray-500';
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
  const getUserName = (userId: UserId) => {
    const user = users.find(u => u.id === Number(userId));
    return user ? user.name : 'Неизвестный пользователь';
  };

  // Функция для получения роли пользователя в задаче
  const getUserRoleInTask = (task: Task) => {
    if (task.createdBy === currentUser.id) return 'Создатель';
    if (task.executors.includes(currentUser.id)) return 'Исполнитель';
    if (task.curators.includes(currentUser.id)) return 'Куратор';
    return 'Участник';
  };

  const filteredTasks = useMemo(() => {
    return getTasksByStatus(activeTab)
  }, [activeTab, getTasksByStatus])

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
    <div className="min-h-screen bg-white">
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
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg mb-6">
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
                <div key={task.id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
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
                        className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        Открыть
                      </Link>
                             <Link
                               href={`/task/${task.id}/edit`}
                               className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all text-center"
                             >
                               Редактировать
                             </Link>
                    </div>
                  </div>
                  
                  {/* Теги */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white border border-gray-300 text-gray-600 text-xs rounded-full shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 text-center">
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
