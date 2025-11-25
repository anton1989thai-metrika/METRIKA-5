export type TaskPriority = 'low' | 'medium' | 'high' | 'boss';
export type TaskStatus = 'new' | 'in_progress' | 'review' | 'completed' | 'postponed' | 'cancelled' | 'overdue';
export type TaskType = 'simple' | 'subtasks' | 'project' | 'recurring' | 'with_files';
export type UserRole = 'admin' | 'manager' | 'employee' | 'client' | 'observer' | 'freelancer';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  creator: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  files?: TaskFile[];
  links?: string[];
  comments?: TaskComment[];
  subtasks?: Task[];
  parentTaskId?: number;
  projectId?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  timeSpent?: number; // в минутах
  estimatedTime?: number; // в минутах
  dependencies?: number[]; // ID зависимых задач
  notifications?: TaskNotification[];
}

export interface TaskFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TaskComment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (воскресенье-суббота)
  dayOfMonth?: number; // 1-31
  endDate?: Date;
}

export interface TaskNotification {
  id: string;
  type: 'email' | 'internal' | 'push' | 'sms' | 'telegram' | 'whatsapp';
  recipient: string;
  message: string;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  creator?: string[];
  type?: TaskType[];
  dateFrom?: Date;
  dateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  tags?: string[];
  overdue?: boolean;
}

export interface TaskReport {
  id: string;
  type: 'completed' | 'overdue' | 'assignees' | 'priorities' | 'time' | 'types' | 'projects' | 'notifications';
  title: string;
  data: any;
  period: {
    from: Date;
    to: Date;
  };
  generatedAt: Date;
  generatedBy: string;
}

// Цвета для приоритетов
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#10B981', // зеленый - Обычная
  medium: '#F97316', // оранжевый - Важная
  high: '#EF4444', // красный - Срочная
  boss: '#fff60b' // желтый - Задача от руководителя
};

// Цвета для статусов
export const STATUS_COLORS: Record<TaskStatus, string> = {
  new: '#6B7280', // серый
  in_progress: '#3B82F6', // синий
  review: '#8B5CF6', // фиолетовый
  completed: '#10B981', // зеленый
  postponed: '#F59E0B', // желтый
  cancelled: '#EF4444', // красный
  overdue: '#DC2626' // темно-красный
};
