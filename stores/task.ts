import { defineStore } from 'pinia';
import type { Task } from '~/types/task';

type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt'>>;

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
  }),

  actions: {
    async fetchTasks() {
      // In a real app, this would be an API call
      // For now, we'll use some mock data
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Implement task board',
          description: 'Create a task board with drag and drop functionality',
          status: 'done',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Add task creation form',
          description: 'Create a modal form for adding new tasks',
          status: 'inProgress',
          priority: 'medium',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Implement task filtering',
          description: 'Add ability to filter tasks by status, priority, etc.',
          status: 'todo',
          priority: 'low',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.tasks = mockTasks;
    },

    addTask(task: TaskInput) {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.tasks.push(newTask);
      return newTask;
    },

    updateTask(id: string, updates: TaskUpdate) {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteTask(id: string) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    },
  },

  getters: {
    getTaskById: (state) => (id: string) => {
      return state.tasks.find(task => task.id === id);
    },
  },
});
