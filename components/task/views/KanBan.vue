<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskStatus } from '~/stores/task'
import TaskCard from '../TaskCard.vue'

const props = defineProps<{
  tasks: Task[]
  statuses: Array<{ id: TaskStatus; title: string }>
  onTaskClick: (task: Task) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onDragStart: (e: DragEvent, taskId: string) => void
  onDrop: (e: DragEvent, status: TaskStatus) => void
}>()

const emit = defineEmits<{
  (e: 'edit', task: Task): void
  (e: 'delete', taskId: string): void
}>()

// Group tasks by status
const tasksByStatus = (status: TaskStatus) => {
  return props.tasks.filter(task => task.status === status)
}

const handleEdit = (task: Task) => {
  emit('edit', task)
}

const handleDelete = (taskId: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', taskId)
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="status in statuses"
      :key="status.id"
      class="flex flex-col flex-1"
      @dragover.prevent
      @drop="onDrop($event, status.id)"
    >
      <div class="flex items-center justify-between px-4 py-2 mb-2 bg-white border-b border-gray-200 rounded-t-lg">
        <h2 class="text-sm font-medium text-gray-700">{{ status.title }}</h2>
        <span class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
          {{ tasksByStatus(status.id).length }}
        </span>
      </div>
      <div 
        class="flex-1 p-2 bg-gray-100 rounded-b-lg min-h-[100px]"
        :class="{ 'border-2 border-dashed border-gray-300': tasksByStatus(status.id).length === 0 }"
      >
        <div class="space-y-2">
          <TaskCard
            v-for="task in tasksByStatus(status.id)"
            :key="task.id"
            :task="task"
            draggable="true"
            @dragstart="onDragStart($event, task.id)"
            @click="onTaskClick(task)"
            @statusChange="(newStatus) => onStatusChange(task.id, newStatus)"
            class="transition-transform duration-200 hover:scale-[1.01]"
          />
        </div>
        
        <!-- Empty state -->
        <div 
          v-if="tasksByStatus(status.id).length === 0"
          class="flex flex-col items-center justify-center h-24 text-center text-gray-400"
        >
          <svg 
            class="w-8 h-8 mb-1 text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1.5" 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p class="text-sm">Drop task here</p>
        </div>
      </div>
    </div>
  </div>
</template>
