import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'Обычный' | 'Важный' | 'Срочный' | 'От руководителя';
export type Visibility = 'Для всех' | 'Для меня';
export type Status = 'Ждёт' | 'В работе' | 'На проверке' | 'Ожидает действия от <Имя>' | 'Пропущена' | 'Выполнена';
export type AutomationMode = 'daily' | 'weekly' | 'dates';
export type WeeklyDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface UserRef {
  id: string;
  name: string;
  avatar?: string;
}

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  executors: UserRef[];
  curators: UserRef[];
  startDateTime?: string | null;
  dueDate: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  allDay: boolean;
  durationHours?: number;
  attachments: Attachment[];
  status: Status;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  executor?: UserRef;
  curator?: UserRef;
  done: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  scope: 'task' | 'subtask';
  scopeId: string;
}

export interface Automation {
  mode: AutomationMode;
  weeklyDays?: WeeklyDay[];
  dates?: string[];
  active: boolean;
  copyBehavior: 'full';
}

export interface CreateTaskState {
  // Шаг 1: Основное
  title: string;
  description: string;
  priority: Priority;
  visibility: Visibility;
  isHidden: boolean;
  visibleToUserIds: string[];
  
  // Шаг 2: Сроки и время
  startDateTime?: string | null;
  dueDate?: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  allDay: boolean;
  durationHours?: number;
  isBlocking: boolean;
  
  // Шаг 3: Исполнители и кураторы
  executors: UserRef[];
  curators: UserRef[];
  
  // Шаг 4: Подзадачи и чек-листы
  subTasks: SubTask[];
  checklists: Checklist[];
  
  // Шаг 5: Вложения
  attachments: Attachment[];
  
  // Шаг 6: Автоматизация
  automation?: Automation | null;
  
  // Stepper
  currentStep: number;
  
  // Actions
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPriority: (priority: Priority) => void;
  setVisibility: (visibility: Visibility) => void;
  setIsHidden: (isHidden: boolean) => void;
  setVisibleToUserIds: (ids: string[]) => void;
  setStartDateTime: (date: string | null) => void;
  setDueDate: (date: string) => void;
  setTimeStart: (time: string | null) => void;
  setTimeEnd: (time: string | null) => void;
  setAllDay: (allDay: boolean) => void;
  setDurationHours: (hours: number | undefined) => void;
  setIsBlocking: (isBlocking: boolean) => void;
  setExecutors: (executors: UserRef[]) => void;
  setCurators: (curators: UserRef[]) => void;
  addSubTask: (subTask: SubTask) => void;
  removeSubTask: (id: string) => void;
  addChecklist: (checklist: Checklist) => void;
  removeChecklist: (id: string) => void;
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (id: string) => void;
  setAutomation: (automation: Automation | null) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialState = {
  title: '',
  description: '',
  priority: 'Обычный' as Priority,
  visibility: 'Для всех' as Visibility,
  isHidden: false,
  visibleToUserIds: [] as string[],
  startDateTime: null,
  dueDate: undefined,
  timeStart: null,
  timeEnd: null,
  allDay: false,
  durationHours: undefined,
  isBlocking: false,
  executors: [],
  curators: [],
  subTasks: [],
  checklists: [],
  attachments: [],
  automation: null,
  currentStep: 0,
};

export const useCreateTaskStore = create<CreateTaskState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setPriority: (priority) => set({ priority }),
      setVisibility: (visibility) => set({ visibility }),
      setIsHidden: (isHidden) => set({ isHidden }),
      setVisibleToUserIds: (ids) => set({ visibleToUserIds: ids }),
      setStartDateTime: (date) => set({ startDateTime: date }),
      setDueDate: (date) => set({ dueDate: date }),
      setTimeStart: (time) => set({ timeStart: time }),
      setTimeEnd: (time) => set({ timeEnd: time }),
      setAllDay: (allDay) => set({ allDay }),
      setDurationHours: (hours) => set({ durationHours: hours }),
      setIsBlocking: (isBlocking) => set({ isBlocking }),
      setExecutors: (executors) => set({ executors }),
      setCurators: (curators) => set({ curators }),
      addSubTask: (subTask) => set((state) => ({ subTasks: [...state.subTasks, subTask] })),
      removeSubTask: (id) => set((state) => ({ subTasks: state.subTasks.filter(t => t.id !== id) })),
      addChecklist: (checklist) => set((state) => ({ checklists: [...state.checklists, checklist] })),
      removeChecklist: (id) => set((state) => ({ checklists: state.checklists.filter(c => c.id !== id) })),
      addAttachment: (attachment) => set((state) => ({ attachments: [...state.attachments, attachment] })),
      removeAttachment: (id) => set((state) => ({ attachments: state.attachments.filter(a => a.id !== id) })),
      setAutomation: (automation) => set({ automation }),
      setCurrentStep: (step) => set({ currentStep: step }),
      reset: () => set(initialState),
    }),
    {
      name: 'create-task-draft',
    }
  )
);

