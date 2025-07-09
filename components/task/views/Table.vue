<script setup lang="ts">
import { computed, ref } from "vue";
import { useTable } from "~/composables/useTable";
import type { Task } from "~/stores/task";

const props = defineProps<{
	tasks: Task[];
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
	onStatusChange: (taskId: string, status: string) => void;
}>();

const {
	sortField,
	sortDirection,
	searchQuery,
	currentPage,
	itemsPerPage,
	totalPages,
	paginatedTasks,
	sortBy,
	changePage,
	formatHeader,
} = useTable(props.tasks);

// Table columns configuration
const columns = [
	{ key: "title", label: "Title", sortable: true },
	{ key: "status", label: "Status", sortable: true },
	{ key: "priority", label: "Priority", sortable: true },
	{ key: "dueDate", label: "Due Date", sortable: true },
	{ key: "actions", label: "Actions", sortable: false },
];

// Format date for display
const formatDate = (dateString?: Date) => {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("th-TH", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

// Status badge class
const getStatusClass = (status: string) => {
	const classes = {
		todo: "bg-gray-100 text-gray-800",
		"in-progress": "bg-blue-100 text-blue-800",
		review: "bg-yellow-100 text-yellow-800",
		done: "bg-green-100 text-green-800",
	};
	return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

// Priority badge class
const getPriorityClass = (priority: string) => {
	const classes = {
		low: "bg-blue-100 text-blue-800",
		medium: "bg-yellow-100 text-yellow-800",
		high: "bg-red-100 text-red-800",
	};
	return (
		classes[priority as keyof typeof classes] || "bg-gray-100 text-gray-800"
	);
};
</script>

<template>
  <div class="flex flex-col space-y-4">
    <!-- Search and Controls -->
    <div class="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <div class="i-mdi-magnify text-gray-400 w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
      </div>
      
      <div class="flex items-center space-x-2">
        <label for="itemsPerPage" class="text-sm text-gray-600">Show</label>
        <select
          id="itemsPerPage"
          v-model="itemsPerPage"
          class="block w-20 py-1 pl-2 pr-8 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-sm text-gray-600">entries</span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              :class="{ 'cursor-pointer hover:text-gray-700': column.sortable }"
              @click="column.sortable ? sortBy(column.key as any) : null"
            >
              <div class="flex items-center">
                {{ column.label }}
                <template v-if="column.sortable">
                  <span v-if="sortField === column.key" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                  <div v-if="task.description" class="text-sm text-gray-500 line-clamp-1">
                    {{ task.description }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                :value="task.status"
                @change="onStatusChange(task.id, ($event.target as HTMLSelectElement).value)"
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(task.status)
                ]"
              >
                <option value="todo" :class="getStatusClass('todo')">To Do</option>
                <option value="in-progress" :class="getStatusClass('in-progress')">In Progress</option>
                <option value="review" :class="getStatusClass('review')">Review</option>
                <option value="done" :class="getStatusClass('done')">Done</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                v-if="task.priority"
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getPriorityClass(task.priority)
                ]"
              >
                {{ task.priority }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ task.dueDate ? formatDate(new Date(task.dueDate)) : '' }}
            </td>
            <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
              <button
                @click.stop="onEdit(task)"
                class="mr-3 text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                @click.stop="onDelete(task.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="paginatedTasks.length === 0">
            <td :colspan="columns.length" class="px-6 py-4 text-sm text-center text-gray-500">
              No tasks found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 sm:flex-row">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            to
            <span class="font-medium">
              {{ Math.min(currentPage * itemsPerPage, paginatedTasks.length) }}
            </span>
            of
            <span class="font-medium">{{ paginatedTasks.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50',
                { 'opacity-50 cursor-not-allowed': currentPage === 1 }
              ]"
            >
              <span class="sr-only">Previous</span>
              <div class="i-mdi-chevron-left w-5 h-5" />
            </button>
            <template v-for="page in totalPages" :key="page">
              <button
                @click="changePage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 border-t-2 border-b-2'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 border-t-2 border-b-2'
                ]"
              >
                {{ page }}
              </button>
            </template>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages || totalPages === 0"
              :class="[
                'relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50',
                { 'opacity-50 cursor-not-allowed': currentPage === totalPages || totalPages === 0 }
              ]"
            >
              <span class="sr-only">Next</span>
              <div class="i-mdi-chevron-right w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
