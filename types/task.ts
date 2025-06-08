export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  workspaceId: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Workspace {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface TaskFilters {
  workspaceId: string | null;
  status: TaskStatus | null;
  view: string;
}

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isTaskFormOpen: boolean;
  currentView: 'kanban' | 'table';
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
}
