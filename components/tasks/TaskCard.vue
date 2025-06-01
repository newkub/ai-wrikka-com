<template>
  <div 
    class="bg-surface border border-border rounded-lg p-4 shadow-sm hover:shadow transition-shadow cursor-move"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-medium text-text">{{ task.title }}</h3>
      <div class="flex space-x-2">
        <button 
          @click.stop="$emit('edit', task)"
          class="text-gray-400 hover:text-brand"
          aria-label="Edit task"
        >
          <div class="i-mdi-pencil h-4 w-4"></div>
        </button>
        <button 
          @click.stop="$emit('delete', task.id)"
          class="text-gray-400 hover:text-alert"
          aria-label="Delete task"
        >
          <div class="i-mdi-trash-can-outline h-4 w-4"></div>
        </button>
      </div>
    </div>
    
    <p v-if="task.description" class="text-sm text-text/80 mb-3">
      {{ task.description }}
    </p>
    
    <div class="flex items-center justify-between text-xs text-text/60">
      <span v-if="task.dueDate" class="flex items-center">
        <div class="i-mdi-calendar-month-outline h-3.5 w-3.5 mr-1"></div>
        {{ formatDate(task.dueDate) }}
      </span>
      <span 
        v-if="task.priority" 
        class="px-2 py-0.5 rounded-full text-xs font-medium"
        :class="priorityClasses[task.priority]"
      >
        {{ task.priority }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/task";
// Using Bun's built-in Date formatting

const props = defineProps<{
	task: Task;
}>();

const emit = defineEmits<{
	(e: "edit", task: Task): void;
	(e: "delete", id: string): void;
}>();

const priorityClasses: Record<string, string> = {
	low: "bg-blue-100 text-blue-800",
	medium: "bg-yellow-100 text-yellow-800",
	high: "bg-red-100 text-red-800",
};

function formatDate(dateString: string) {
	try {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	} catch (e) {
		return dateString;
	}
}

function onDragStart(e: DragEvent) {
	if (e.dataTransfer) {
		e.dataTransfer.setData("text/plain", props.task.id);
		e.dataTransfer.effectAllowed = "move";
	}
}
</script>
