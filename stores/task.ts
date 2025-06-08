import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task as TaskType, TaskFilters, TaskState, TaskStatus } from '~/types/task'

// Re-export types for use in other files
export type { TaskStatus } from '~/types/task'
export interface Task extends Omit<TaskType, 'id' | 'createdAt' | 'updatedAt'> {
  id: string
  createdAt: string
  updatedAt: string
}

export const useTaskStore = defineStore('task', () => {
  // State
  const state = ref<TaskState>({
    tasks: [],
    selectedTask: null,
    isTaskFormOpen: false,
    currentView: 'kanban',
    filters: {
      workspaceId: null,
      status: null,
      view: 'all'
    },
    isLoading: false,
    error: null
  })

  // Getters
  const tasks = computed({
    get: () => state.value.tasks,
    set: (value) => { state.value.tasks = value }
  })

  const selectedTask = computed({
    get: () => state.value.selectedTask,
    set: (value) => { state.value.selectedTask = value }
  })

  const isTaskFormOpen = computed({
    get: () => state.value.isTaskFormOpen,
    set: (value) => { state.value.isTaskFormOpen = value }
  })

  const currentView = computed({
    get: () => state.value.currentView,
    set: (value) => { state.value.currentView = value }
  })

  const filters = computed(() => state.value.filters)
  
  const isLoading = computed({
    get: () => state.value.isLoading,
    set: (value) => { state.value.isLoading = value }
  })

  const error = computed({
    get: () => state.value.error,
    set: (value) => { state.value.error = value }
  })

  // Filtered tasks with proper typing
  const filteredTasks = computed<Task[]>(() => {
    return tasks.value.filter((task: Task) => {
      const matchesWorkspace = !filters.value.workspaceId || 
        task.workspaceId === filters.value.workspaceId
      const matchesStatus = !filters.value.status || 
        task.status === filters.value.status
      return matchesWorkspace && matchesStatus
    })
  })

  // Status-based task getters with proper typing
  const todoTasks = computed(() => 
    filteredTasks.value.filter((task) => task.status === 'todo')
  )
  
  const inProgressTasks = computed(() => 
    filteredTasks.value.filter((task) => task.status === 'in-progress')
  )
  
  const reviewTasks = computed(() => 
    filteredTasks.value.filter((task) => task.status === 'review')
  )
  
  const doneTasks = computed(() => 
    filteredTasks.value.filter((task) => task.status === 'done')
  )

  // Actions
  const setFilter = (filter: Partial<TaskFilters>) => {
    state.value.filters = { ...state.value.filters, ...filter }
  }

  const setCurrentView = (view: 'kanban' | 'table') => {
    currentView.value = view
  }

  const fetchTasks = async () => {
    try {
      isLoading.value = true
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Sample data with workspaceId
      const now = new Date().toISOString()
      tasks.value = [
        {
          id: '1',
          title: 'Implement task management',
          description: 'Create task management feature similar to ClickUp',
          status: 'in-progress',
          priority: 'high',
          workspaceId: 'workspace-1',
          createdAt: now,
          updatedAt: now
        },
        {
          id: '2',
          title: 'Add task filtering',
          description: 'Implement filtering by status, priority, and assignee',
          status: 'todo',
          priority: 'medium',
          workspaceId: 'workspace-2',
          createdAt: now,
          updatedAt: now
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch tasks'
      console.error('Error fetching tasks:', e)
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const now = new Date().toISOString()
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      }
      
      tasks.value.push(newTask)
      return newTask
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create task'
      console.error('Error creating task:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      isLoading.value = true
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        const now = new Date().toISOString()
        tasks.value[index] = {
          ...tasks.value[index],
          ...updates,
          updatedAt: now
        }
        return tasks.value[index]
      }
      return null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update task'
      console.error('Error updating task:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    try {
      isLoading.value = true
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1)
        return true
      }
      return false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete task'
      console.error('Error deleting task:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const selectTask = (task: Task | null) => {
    selectedTask.value = task
    isTaskFormOpen.value = !!task
  }

  const openTaskForm = () => {
    selectedTask.value = null
    isTaskFormOpen.value = true
  }

  const closeTaskForm = () => {
    isTaskFormOpen.value = false
    selectedTask.value = null
  }

  return {
    // State
    tasks,
    selectedTask,
    isTaskFormOpen,
    currentView,
    filters,
    isLoading,
    error,
    
    // Getters
    filteredTasks,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    doneTasks,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
    openTaskForm,
    closeTaskForm,
    setFilter,
    setCurrentView
  }
})
