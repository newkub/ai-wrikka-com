<template>
  <div class="space-y-4">
    <!-- Task List Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-text">{{ listName || 'All Tasks' }}</h2>
      <div class="text-sm text-text/60">
        {{ filteredTasks.length }} {{ filteredTasks.length === 1 ? 'task' : 'tasks' }}
      </div>
    </div>

    <!-- Task Table -->
    <div class="bg-surface rounded-lg shadow overflow-hidden border border-border">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-surface">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
              Task
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
              Due Date
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-surface divide-y divide-border">
          <tr 
            v-for="task in filteredTasks" 
            :key="task.id"
            class="hover:bg-surface/50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  class="h-4 w-4 text-brand focus:ring-brand border-border rounded"
                  :checked="task.status === 'done'"
                  @change="toggleTaskStatus(task)"
                >
                <span 
                  class="ml-3 text-sm font-medium text-text"
                  :class="{ 'line-through text-text/40': task.status === 'done' }"
                >
                  {{ task.title }}
                </span>
              </div>
              <div class="ml-7 text-sm text-text/60">
                {{ task.description }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full"
                :class="statusClasses[task.status]"
              >
                {{ formatStatus(task.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full"
                :class="priorityClasses[task.priority || 'medium']"
              >
                {{ task.priority || 'Medium' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-text/80">
              {{ formatDate(task.dueDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="$emit('edit', task)"
                class="text-brand hover:text-brand/80 mr-4"
              >
                Edit
              </button>
              <button 
                @click="$emit('delete', task.id)"
                class="text-alert hover:text-alert/80"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredTasks.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-text/60">
              No tasks found. Create a new task to get started.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/task";

type Status = "todo" | "inProgress" | "review" | "done";
type Priority = "low" | "medium" | "high";
import { format } from "date-fns";

const props = defineProps<{
	tasks: Task[];
	listName?: string;
}>();

const emit = defineEmits<{
	(e: "edit", task: Task): void;
	(e: "delete", id: string): void;
	(e: "update:task", task: Task): void;
}>();

const statusClasses: Record<Status, string> = {
	todo: "bg-yellow-100 text-yellow-800",
	inProgress: "bg-blue-100 text-blue-800",
	review: "bg-purple-100 text-purple-800",
	done: "bg-green-100 text-green-800",
};

const priorityClasses: Record<Priority, string> = {
	low: "bg-blue-100 text-blue-800",
	medium: "bg-yellow-100 text-yellow-800",
	high: "bg-red-100 text-red-800",
};

const filteredTasks = computed(() => {
	return [...props.tasks].sort((a, b) => {
		// Sort by status (todo > inProgress > review > done)
		const statusOrder: Record<Status, number> = {
			todo: 0,
			inProgress: 1,
			review: 2,
			done: 3,
		};
		return statusOrder[a.status as Status] - statusOrder[b.status as Status];
	});
});

function formatStatus(status: string) {
	return status
		.split(/(?=[A-Z])/)
		.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatDate(dateString?: string) {
	if (!dateString) return "";
	try {
		return format(new Date(dateString), "MMM d, yyyy");
	} catch (e) {
		return dateString;
	}
}

function toggleTaskStatus(task: Task) {
	const newStatus: Status = task.status === "done" ? "todo" : "done";
	const updatedTask: Task = {
		...task,
		status: newStatus,
		updatedAt: new Date().toISOString(),
	};
	emit("update:task", updatedTask);
}
</script>
