import { defineStore } from 'pinia';
import type { Task, TaskList } from '~/types/task';

type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt'>>;

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    lists: [] as TaskList[],
  }),

  actions: {
    async fetchTasks(listId?: string) {
      // In a real app, this would be an API call
      // For now, we'll use some mock data
      const mockLists: TaskList[] = [
        { id: '1', name: 'Personal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'Work', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', name: 'Shopping', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
      
      const mockTasks: Task[] = [
        {
          id: '1',
          listId: '1',
          title: 'Implement task board',
          description: 'Create a task board with drag and drop functionality',
          status: 'done',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: 'user1',
          labels: ['development', 'ui'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          listId: '1',
          title: 'Add task creation form',
          description: 'Create a modal form for adding new tasks',
          status: 'inProgress',
          priority: 'medium',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: 'user2',
          labels: ['development', 'form'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          listId: '2',
          title: 'Implement task filtering',
          description: 'Add ability to filter tasks by status, priority, etc.',
          status: 'todo',
          priority: 'low',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: 'user1',
          labels: ['development', 'filtering'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          listId: '2',
          title: 'Fix login issue',
          description: 'Investigate and fix the login issue on production',
          status: 'inProgress',
          priority: 'high',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          listId: '3',
          title: 'Buy groceries',
          description: 'Milk, eggs, bread, and fruits',
          status: 'todo',
          priority: 'medium',
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      this.lists = mockLists;
      this.tasks = listId ? mockTasks.filter(task => task.listId === listId) : mockTasks;
    },

    addTask(task: TaskInput & { listId: string }) {
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
    getTasksByListId: (state) => (listId: string) => {
      return state.tasks.filter(task => task.listId === listId);
    },
    getTaskCountsByList(state) {
      const counts: Record<string, number> = {};
      for (const list of state.lists) {
        counts[list.id] = state.tasks.filter(task => task.listId === list.id).length;
      }
      return counts;
    },
    // ... rest of the code ...
  },
});
