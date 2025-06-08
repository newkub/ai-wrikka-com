import { computed, onMounted } from 'vue'
import { useTaskStore } from '~/stores/task'
import type { Task, TaskStatus } from '~/stores/task'

export const useTaskBoard = () => {
  const taskStore = useTaskStore()
  
  // Status columns
  const statuses = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' }
  ] as const

  // Get tasks by status
  const getTasksByStatus = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return taskStore.todoTasks
      case 'in-progress':
        return taskStore.inProgressTasks
      case 'review':
        return taskStore.reviewTasks
      case 'done':
        return taskStore.doneTasks
      default:
        return []
    }
  }

  // Handle task drop
  const onTaskDrop = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await taskStore.updateTask(taskId, { status: newStatus })
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  // Handle task click
  const onTaskClick = (task: Task) => {
    taskStore.selectTask(task)
  }

  // Initialize
  onMounted(() => {
    taskStore.fetchTasks()
  })

  return {
    // State
    statuses,
    isLoading: computed(() => taskStore.isLoading),
    error: computed(() => taskStore.error),
    selectedTask: computed(() => taskStore.selectedTask),
    isTaskFormOpen: computed({
      get: () => taskStore.isTaskFormOpen,
      set: (value) => {
        if (!value) taskStore.closeTaskForm()
      }
    }),
    
    // Methods
    getTasksByStatus,
    onTaskDrop,
    onTaskClick,
    openTaskForm: taskStore.openTaskForm,
    closeTaskForm: taskStore.closeTaskForm,
    createTask: taskStore.createTask,
    updateTask: taskStore.updateTask,
    deleteTask: taskStore.deleteTask
  }
}
