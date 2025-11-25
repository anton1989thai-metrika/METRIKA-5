"use client"

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BurgerMenu from '@/components/BurgerMenu';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'boss';
  status: 'new' | 'in_progress' | 'review' | 'completed' | 'postponed' | 'cancelled' | 'overdue';
  deadline: string;
  deadlineTime: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  executors: string[];
  curators: string[];
  images: string[];
  links: string[];
  files: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  events: Array<{
    id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
    details?: any;
  }>;
  messages: Array<{
    id: string;
    text: string;
    user: string;
    timestamp: string;
    files?: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
    }>;
    canDelete: boolean;
  }>;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({ id: 'user-1', name: 'Анна Петрова', role: 'admin' });
  const [loading, setLoading] = useState(true);
  const [currentImagePage, setCurrentImagePage] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загрузка данных задачи
  useEffect(() => {
    // Имитация загрузки данных задачи
    const mockTask: Task = {
      id: taskId,
      title: 'Разработка нового функционала для CRM системы',
      description: 'Необходимо разработать модуль для автоматического создания отчетов по клиентам с возможностью экспорта в PDF и Excel форматы.',
      priority: 'high',
      status: 'in_progress',
      deadline: '2024-10-15',
      deadlineTime: '18:00',
      createdAt: '2024-10-01T10:30:00Z',
      updatedAt: '2024-10-07T14:20:00Z',
      creator: 'user-2',
      executors: ['user-1'],
      curators: ['user-3'],
      images: [
        '/images/task1.jpg',
        '/images/task2.jpg',
        '/images/task3.jpg',
        '/images/task4.jpg',
        '/images/task5.jpg',
        '/images/task6.jpg',
        '/images/task7.jpg',
        '/images/task8.jpg',
        '/images/task9.jpg',
        '/images/task10.jpg',
        '/images/task11.jpg',
        '/images/task12.jpg'
      ],
      links: [
        'https://example.com/docs',
        'https://github.com/project/repo',
        'https://figma.com/design'
      ],
      files: [
        {
          id: 'file1',
          name: 'requirements.pdf',
          type: 'pdf',
          url: '/files/requirements.pdf',
          uploadedBy: 'user-2',
          uploadedAt: '2024-10-01T10:30:00Z'
        },
        {
          id: 'file2',
          name: 'mockup.fig',
          type: 'figma',
          url: '/files/mockup.fig',
          uploadedBy: 'user-3',
          uploadedAt: '2024-10-02T15:45:00Z'
        }
      ],
      events: [
        {
          id: 'event1',
          type: 'created',
          description: 'Задача создана',
          user: 'user-2',
          timestamp: '2024-10-01T10:30:15Z'
        },
        {
          id: 'event2',
          type: 'assigned',
          description: 'Назначен исполнитель: Анна Петрова',
          user: 'user-2',
          timestamp: '2024-10-01T10:31:22Z'
        },
        {
          id: 'event3',
          type: 'status_changed',
          description: 'Статус изменен на "В работе"',
          user: 'user-1',
          timestamp: '2024-10-01T11:15:33Z'
        },
        {
          id: 'event4',
          type: 'file_uploaded',
          description: 'Загружен файл: requirements.pdf',
          user: 'user-2',
          timestamp: '2024-10-01T10:30:45Z'
        },
        {
          id: 'event5',
          type: 'opened',
          description: 'Задача открыта пользователем',
          user: 'user-1',
          timestamp: '2024-10-07T20:25:10Z'
        }
      ],
      messages: [
        {
          id: 'msg1',
          text: 'Привет! Начал работу над задачей. Есть вопросы по требованиям.',
          user: 'user-1',
          timestamp: '2024-10-01T11:15:00Z',
          canDelete: true
        },
        {
          id: 'msg2',
          text: 'Отлично! Если что-то непонятно - обращайся.',
          user: 'user-2',
          timestamp: '2024-10-01T11:20:00Z',
          canDelete: false
        },
        {
          id: 'msg3',
          text: 'Добавил промежуточный результат работы',
          user: 'user-1',
          timestamp: '2024-10-03T16:30:00Z',
          files: [
            {
              id: 'msgfile1',
              name: 'progress.pdf',
              type: 'pdf',
              url: '/files/progress.pdf'
            }
          ],
          canDelete: true
        }
      ]
    };

    setTimeout(() => {
      setTask(mockTask);
      setLoading(false);
    }, 500);
  }, [taskId]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.messages]);

  // Функции для работы с изображениями
  const imagesPerPage = 9;
  const totalImagePages = Math.ceil((task?.images.length || 0) / imagesPerPage);
  const currentImages = task?.images.slice(
    currentImagePage * imagesPerPage,
    (currentImagePage + 1) * imagesPerPage
  ) || [];

  const nextImagePage = () => {
    if (currentImagePage < totalImagePages - 1) {
      setCurrentImagePage(currentImagePage + 1);
    }
  };

  const prevImagePage = () => {
    if (currentImagePage > 0) {
      setCurrentImagePage(currentImagePage - 1);
    }
  };

  // Функции для работы с сообщениями
  const sendMessage = () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      user: currentUser.id,
      timestamp: new Date().toISOString(),
      files: uploadedFiles.map((file, index) => ({
        id: `msgfile-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.split('/')[0],
        url: URL.createObjectURL(file)
      })),
      canDelete: true
    };

    setTask(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMsg]
    } : null);

    setNewMessage('');
    setUploadedFiles([]);
  };

  const deleteMessage = (messageId: string) => {
    setTask(prev => prev ? {
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    } : null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Функции для быстрых действий
  const takeInWork = () => {
    setTask(prev => prev ? {
      ...prev,
      status: 'in_progress',
      events: [...prev.events, {
        id: `event-${Date.now()}`,
        type: 'status_changed',
        description: 'Статус изменен на "В работе"',
        user: currentUser.id,
        timestamp: new Date().toISOString()
      }]
    } : null);
  };

  const completeTask = () => {
    setTask(prev => prev ? {
      ...prev,
      status: 'completed',
      events: [...prev.events, {
        id: `event-${Date.now()}`,
        type: 'status_changed',
        description: 'Задача завершена',
        user: currentUser.id,
        timestamp: new Date().toISOString()
      }]
    } : null);
  };

  // Утилиты
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      case 'boss': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'low': return 'Обычная';
      case 'medium': return 'Важная';
      case 'high': return 'Срочная';
      case 'boss': return 'Задача от руководителя';
      default: return 'Неизвестно';
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
      case 'overdue': return 'Просрочена';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-500';
      case 'in_progress': return 'bg-gray-500';
      case 'review': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'postponed': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      case 'overdue': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'figma': return '🎨';
      case 'word': return '📝';
      case 'excel': return '📊';
      default: return '📎';
    }
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

  if (!task) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BurgerMenu />
        <div className="pt-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Задача не найдена</h1>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Назад
              </button>
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
          {/* Заголовок задачи */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-black">{task.title}</h1>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-white text-sm text-center ${getPriorityColor(task.priority)}`} style={{width: '100px', minWidth: '100px', maxWidth: '100px'}}>
                  {getPriorityName(task.priority)}
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm text-center ${getStatusColor(task.status)}`} style={{width: '100px', minWidth: '100px', maxWidth: '100px'}}>
                  {getStatusName(task.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Дедлайн: {new Date(task.deadline).toLocaleDateString('ru-RU')} {task.deadlineTime}
                </div>
                {/* Быстрые действия */}
                <div className="flex items-center space-x-2 ml-4">
                  {task.status === 'new' && (
                    <button
                      onClick={takeInWork}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Взять в работу
                    </button>
                  )}
                         {task.status === 'in_progress' && (
                           <button
                             onClick={completeTask}
                             className="px-4 py-2 text-black rounded-md transition-colors"
                             style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
                           >
                             Завершить
                           </button>
                         )}
                  <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Назад
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="grid grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
            {/* Левая колонка */}
            <div className="flex flex-col space-y-6">
              {/* Данные задачи */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Данные задачи</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <p className="text-gray-900">{task.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Создатель</label>
                    <p className="text-gray-900">{task.creator}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Исполнители</label>
                    <p className="text-gray-900">{task.executors.join(', ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Кураторы</label>
                    <p className="text-gray-900">{task.curators.join(', ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Прикрепленные ссылки</label>
                    <div className="space-y-2">
                      {task.links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 underline"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Хронология событий */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-black mb-4">Хронология событий</h2>
                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin">
                  {task.events.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDateTime(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className="flex flex-col space-y-6">
              {/* Фотографии */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Фотографии</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevImagePage}
                      disabled={currentImagePage === 0}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentImagePage + 1} / {totalImagePages}
                    </span>
                    <button
                      onClick={nextImagePage}
                      disabled={currentImagePage === totalImagePages - 1}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {currentImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setShowImageModal(image)}
                    >
                      <img
                        src={image}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Чат */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-black mb-4">Чат</h2>
                
                {/* Сообщения */}
                <div className="flex-1 space-y-3 mb-4 overflow-y-auto scrollbar-thin">
                  {task.messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {message.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-900">{message.text}</p>
                          {message.files && message.files.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.files.map((file) => (
                                <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                                  <span className="text-lg">{getFileIcon(file.type)}</span>
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <button className="text-xs text-blue-600 hover:text-blue-800">Скачать</button>
                                  <button className="text-xs text-blue-600 hover:text-blue-800">Открыть</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.canDelete && (
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="text-xs text-red-600 hover:text-red-800 mt-1"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Поле ввода сообщения */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                    >
                      📎 Файл
                    </button>
                    {uploadedFiles.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {uploadedFiles.map((file, index) => (
                          <span key={index} className="text-xs text-gray-600">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Модальное окно для просмотра изображения */}
      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[70] bg-black bg-opacity-75">
          <div className="max-w-4xl max-h-4xl">
            <img
              src={showImageModal}
              alt="Увеличенное изображение"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
