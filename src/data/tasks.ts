import { Task, TaskPriority, TaskStatus, TaskType } from '@/types/task';

// Генерируем тестовые данные для задач
const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const priorities: TaskPriority[] = ['critical', 'high', 'medium', 'low', 'black'];
  const statuses: TaskStatus[] = ['new', 'in_progress', 'review', 'completed', 'postponed', 'cancelled', 'overdue'];
  const types: TaskType[] = ['simple', 'subtasks', 'project', 'recurring', 'with_files'];
  const assignees = ['Анна Петрова', 'Иван Сидоров', 'Мария Козлова', 'Алексей Иванов', 'Елена Смирнова'];
  const creators = ['Директор', 'Менеджер', 'Администратор'];

  const taskTitles = [
    'Провести показ квартиры',
    'Подготовить документы для сделки',
    'Связаться с клиентом',
    'Проверить документы объекта',
    'Организовать встречу с продавцом',
    'Подготовить презентацию объекта',
    'Провести переговоры с клиентом',
    'Оформить договор купли-продажи',
    'Проверить юридическую чистоту',
    'Организовать осмотр объекта',
    'Подготовить отчет по объекту',
    'Связаться с риелтором',
    'Провести анализ рынка',
    'Подготовить коммерческое предложение',
    'Организовать фотосессию объекта'
  ];

  for (let i = 1; i <= 50; i++) {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 10);

    const task: Task = {
      id: i,
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      description: `Подробное описание задачи ${i}. Необходимо выполнить все требования и соблюсти сроки.`,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      creator: creators[Math.floor(Math.random() * creators.length)],
      dueDate,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      createdAt: createdDate,
      updatedAt: new Date(),
      tags: [`тег${Math.floor(Math.random() * 5) + 1}`, `категория${Math.floor(Math.random() * 3) + 1}`],
      files: Math.random() > 0.7 ? [
        {
          id: `file-${i}`,
          name: `Документ ${i}.pdf`,
          url: `/files/document-${i}.pdf`,
          size: Math.floor(Math.random() * 1000000) + 100000,
          type: 'application/pdf',
          uploadedAt: new Date(),
          uploadedBy: assignees[Math.floor(Math.random() * assignees.length)]
        }
      ] : [],
      links: Math.random() > 0.8 ? [`https://example.com/link-${i}`] : [],
      comments: Math.random() > 0.6 ? [
        {
          id: `comment-${i}`,
          text: `Комментарий к задаче ${i}`,
          author: assignees[Math.floor(Math.random() * assignees.length)],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ] : [],
      timeSpent: Math.floor(Math.random() * 480), // до 8 часов
      estimatedTime: Math.floor(Math.random() * 240) + 60, // 1-5 часов
      dependencies: Math.random() > 0.8 ? [Math.floor(Math.random() * i)] : [],
      notifications: []
    };

    tasks.push(task);
  }

  return tasks;
};

export const tasks = generateTasks();

// Функции для работы с задачами
export const getTasksByDateRange = (startDate: Date, endDate: Date): Task[] => {
  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= startDate && taskDate <= endDate;
  });
};

export const getTasksByAssignee = (assignee: string): Task[] => {
  return tasks.filter(task => task.assignee === assignee);
};

export const getTasksByStatus = (status: TaskStatus): Task[] => {
  return tasks.filter(task => task.status === status);
};

export const getTasksByPriority = (priority: TaskPriority): Task[] => {
  return tasks.filter(task => task.priority === priority);
};

export const getOverdueTasks = (): Task[] => {
  const now = new Date();
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < now && task.status !== 'completed' && task.status !== 'cancelled';
  });
};
