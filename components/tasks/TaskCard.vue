<template>
  <div 
    class="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
      <div class="flex space-x-2">
        <button 
          @click.stop="$emit('edit', task)"
          class="text-gray-400 hover:text-blue-500"
          aria-label="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button 
          @click.stop="$emit('delete', task.id)"
          class="text-gray-400 hover:text-red-500"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-3">
      {{ task.description }}
    </p>
    
    <div class="flex items-center justify-between text-xs text-gray-500">
      <span v-if="task.dueDate" class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(task.dueDate) }}
      </span>
      <span 
        v-if="task.priority" 
        class="px-2 py-0.5 rounded-full text-xs"
        :class="priorityClasses[task.priority]"
      >
        {{ task.priority }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task';
// Using Bun's built-in Date formatting

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'delete', id: string): void;
}>();

const priorityClasses: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', props.task.id);
    e.dataTransfer.effectAllowed = 'move';
  }
}
</script>
