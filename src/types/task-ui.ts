export type TaskPriorityUi = 'low' | 'medium' | 'high' | 'boss'

export type TaskStatusUi =
  | 'new'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'postponed'
  | 'cancelled'
  | 'overdue'
  | 'on_review'
  | 'deferred'
  | 'canceled'

export type UserId = number | string

export interface TaskAttachment {
  id?: number | string
  url?: string
  name?: string
  size?: string
  type?: string
  file?: File
}

export interface TaskChecklistItem {
  id: number
  text: string
  completed: boolean
  executor: string
  curator: string
}

export interface TaskChecklist {
  id: number
  title: string
  items: TaskChecklistItem[]
  createdAt?: string
  createdBy?: UserId
  executor?: string
  curator?: string
  approvedByCurator?: boolean
}

export interface TaskComment {
  id: number
  text: string
  author: string
  authorId: UserId
  timestamp: string
  type?: string
}

export interface TaskHistory {
  id: number
  action: string
  author: string
  authorId: UserId
  timestamp: string
  type?: string
  from?: TaskStatusUi
  to?: TaskStatusUi
  field?: string
  oldValue?: unknown
  newValue?: unknown
  comment?: string
  userId?: UserId
}

export interface TaskSubtask {
  id: number
  title: string
  description: string
  executors: UserId[]
  curators: UserId[]
  priority: TaskPriorityUi
  deadline: string
  deadlineTime: string
  status: TaskStatusUi
  createdAt: string
  createdBy: UserId
  approvedByCurator: boolean
  history: TaskHistory[]
  comments: TaskComment[]
  parentTaskId: number | null
}

export interface TaskItem {
  id: number
  title: string
  description: string
  priority: TaskPriorityUi
  status: TaskStatusUi
  deadline: string
  deadlineTime: string
  executors: UserId[]
  curators: UserId[]
  createdAt: string
  updatedAt?: string
  createdBy: UserId
  images: TaskAttachment[]
  links: string[]
  checklists: TaskChecklist[]
  subtasks: TaskSubtask[]
  comments: TaskComment[]
  history?: TaskHistory[]
  tags?: string[]
  estimatedHours?: number
  actualHours?: number
  isAutoTask?: boolean
  autoFrequency?: string
  autoRepetitions?: string
  approvedByCurator?: boolean
  isBlocking?: boolean
  startDate?: string
  startTime?: string
  completionTime?: string
  isHiddenTask?: boolean
}
