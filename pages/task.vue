<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import TaskForm from '~/components/task/TaskForm.vue'
import KanBanView from '~/components/task/views/KanBan.vue'
import TableView from '~/components/task/views/Table.vue'
import Sidebar from '~/components/task/Sidebar.vue'
import { useTaskStore } from '~/stores/task'
import type { Task, TaskStatus } from '~/stores/task'

// View mode
type ViewMode = 'kanban' | 'table'
const viewMode = ref<ViewMode>('kanban')

// Task store
const taskStore = useTaskStore()
const { 
  tasks, 
  selectedTask, 
  isTaskFormOpen,
  todoTasks,
  inProgressTasks,
  reviewTasks,
  doneTasks
} = storeToRefs(taskStore)

// Define statuses with id and title to match KanBan component props
type StatusItem = { id: TaskStatus; title: string }
const statuses: StatusItem[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
]

// Computed
const allTasks = computed(() => [
  ...todoTasks.value,
  ...inProgressTasks.value,
  ...reviewTasks.value,
  ...doneTasks.value
])

// Methods
const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    await taskStore.createTask(taskData)
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

const handleUpdateTask = async (task: Task) => {
  try {
    const { id, ...updates } = task
    await taskStore.updateTask(id, updates)
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

const handleDeleteTask = async (taskId: string) => {
  try {
    await taskStore.deleteTask(taskId)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

const handleTaskClick = (task: Task) => {
  taskStore.selectTask(task)
  taskStore.openTaskForm()
}

const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
  try {
    await taskStore.updateTask(taskId, { status: newStatus })
  } catch (error) {
    console.error('Error updating task status:', error)
  }
}

// Drag and drop
const onDragStart = (e: DragEvent, taskId: string) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('taskId', taskId)
  }
}

const onDrop = async (e: DragEvent, status: TaskStatus) => {
  e.preventDefault()
  const taskId = e.dataTransfer?.getData('taskId')
  if (taskId) {
    await handleStatusChange(taskId, status)
  }
}

// Handle sidebar item selection
const handleSidebarSelect = (itemId: string, type: 'workspace' | 'status' | 'view') => {
  console.log(`Selected ${type}:`, itemId)
  
  // Handle selection based on type
  switch (type) {
    case 'workspace':
      // Filter tasks by workspace
      console.log('Filtering by workspace:', itemId)
      break
      
    case 'status':
      // Filter tasks by status
      console.log('Filtering by status:', itemId)
      break
      
    case 'view':
      // Handle view type selection
      console.log('Selected view:', itemId)
      break
  }
}

// Fetch tasks on component mount
onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar 
      @select="handleSidebarSelect"
      :workspaces="[
        { id: 'workspace-1', name: 'Personal' },
        { id: 'workspace-2', name: 'Work' },
        { id: 'workspace-3', name: 'Team' }
      ]"
      :statuses="[
        { id: 'todo', name: 'To Do' },
        { id: 'in-progress', name: 'In Progress' },
        { id: 'review', name: 'Review' },
        { id: 'done', name: 'Done' }
      ]"
      class="flex-shrink-0 hidden md:block"
    />
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between py-6 space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
        
        <div class="flex items-center space-x-4">
          <!-- View Toggle -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              @click="viewMode = 'kanban'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                viewMode === 'kanban' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Kanban
            </button>
            <button
              type="button"
              @click="viewMode = 'table'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                viewMode === 'table' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-r border-gray-300'
              ]"
            >
              Table
            </button>
          </div>
          
          <!-- New Task Button -->
          <button
            type="button"
            @click="taskStore.openTaskForm()"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              class="w-5 h-5 mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            New Task
          </button>
        </div>
      </div>

      <!-- Kanban View -->
      <KanBanView
        v-if="viewMode === 'kanban'"
        :tasks="allTasks"
        :statuses="statuses"
        :on-task-click="handleTaskClick"
        :on-status-change="handleStatusChange"
        :on-drag-start="onDragStart"
        :on-drop="onDrop"
        @edit="handleTaskClick"
        @delete="handleDeleteTask"
        class="mt-6"
      />

      <!-- Table View -->
      <TableView
        v-else
        :tasks="allTasks"
        :on-edit="handleTaskClick"
        :on-delete="handleDeleteTask"
        :on-status-change="(taskId: string, status: string) => handleStatusChange(taskId, status as TaskStatus)"
        class="mt-6"
      />
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-if="isTaskFormOpen"
      v-model:is-open="isTaskFormOpen"
      :task="selectedTask || undefined"
      @submit="handleCreateTask"
      @update:task="handleUpdateTask"
      @close="taskStore.closeTaskForm"
    />
  </div>
</div>
</template>