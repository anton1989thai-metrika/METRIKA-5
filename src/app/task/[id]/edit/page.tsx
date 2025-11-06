import EditTaskClient from "./EditTaskClient";

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

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <EditTaskClient taskId={id} />;
}
