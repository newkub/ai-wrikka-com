export interface Task {
  id: string
  listId: string
  title: string
  description: string
  status: 'todo' | 'inProgress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  assignee?: string
  labels?: string[]
  createdAt: string
  updatedAt: string
}

export interface TaskList {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface TaskState {
  tasks: Task[]
  lists: TaskList[]
  loading: boolean
  error: string | null
}

export const statusColors = {
  todo: 'bg-gray-200 text-gray-800',
  inProgress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
}

export const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export const statusCounts = {
  todo: 0,
  inProgress: 0,
  review: 0,
  done: 0,
}
