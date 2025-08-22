<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Sidebar from "~/components/task/Sidebar.vue";
import TaskForm from "~/components/task/TaskForm.vue";
import KanBanView from "~/components/task/views/KanBan.vue";
import TableView from "~/components/task/views/Table.vue";
import type { Task, TaskStatus } from "~/stores/task";
import { useTaskStore } from "~/stores/task";

// Meta
definePageMeta({
	title: "Task Management",
	description: "Manage your tasks with Kanban and Table views",
});

// View mode
type ViewMode = "kanban" | "table";
const viewMode = ref<ViewMode>("kanban");

// Search and filters
const searchQuery = ref("");
const currentFilter = ref<{
	workspaceId: string | null;
	status: TaskStatus | null;
	view: string;
}>({
	workspaceId: null,
	status: null,
	view: "all",
});

// UI state
const showMobileMenu = ref(false);
const isFullscreen = ref(false);

// Task store
const taskStore = useTaskStore();
const {
	tasks,
	selectedTask,
	isTaskFormOpen,
	todoTasks,
	inProgressTasks,
	reviewTasks,
	doneTasks,
	isLoading,
	error,
} = storeToRefs(taskStore);

// Define statuses with id and title to match KanBan component props
type StatusItem = { id: TaskStatus; title: string };
const statuses: StatusItem[] = [
	{ id: "todo", title: "To Do" },
	{ id: "in-progress", title: "In Progress" },
	{ id: "review", title: "Review" },
	{ id: "done", title: "Done" },
];

// Workspaces data
const workspaces = ref([
	{ id: "workspace-1", name: "Personal" },
	{ id: "workspace-2", name: "Work" },
	{ id: "workspace-3", name: "Team" },
]);

// Computed
const allTasks = computed(() => [
	...todoTasks.value,
	...inProgressTasks.value,
	...reviewTasks.value,
	...doneTasks.value,
]);

// Filtered tasks based on search and filters
const filteredTasks = computed(() => {
	let result = [...allTasks.value];
	
	// Apply search filter
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(task => 
			task.title.toLowerCase().includes(query) || 
			task.description?.toLowerCase().includes(query)
		);
	}

	// Apply workspace filter
	if (currentFilter.value.workspaceId) {
		result = result.filter(task => 
			task.workspaceId === currentFilter.value.workspaceId
		);
	}

	// Apply status filter
	if (currentFilter.value.status) {
		result = result.filter(task => 
			task.status === currentFilter.value.status
		);
	}

	// Apply view filter
	switch (currentFilter.value.view) {
		case 'today': {
			const today = new Date().toISOString().split('T')[0];
			result = result.filter(task => 
				task.dueDate?.startsWith(today)
			);
			break;
		}
		case 'upcoming': {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			result = result.filter(task => 
				task.dueDate && new Date(task.dueDate) >= tomorrow
			);
			break;
		}
		case 'completed': {
			result = result.filter(task => task.status === 'done');
			break;
		}
	}

	return result;
});

// Task statistics
const taskStats = computed(() => ({
	total: allTasks.value.length,
	todo: todoTasks.value.length,
	inProgress: inProgressTasks.value.length,
	review: reviewTasks.value.length,
	done: doneTasks.value.length,
	filtered: filteredTasks.value.length,
}));

// Methods
const handleCreateTask = async (
	taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
) => {
	try {
		await taskStore.createTask(taskData);
	} catch (error) {
		console.error("Error creating task:", error);
		throw error;
	}
};

const handleUpdateTask = async (task: Task) => {
	try {
		const { id, ...updates } = task;
		await taskStore.updateTask(id, updates);
	} catch (error) {
		console.error("Error updating task:", error);
		throw error;
	}
};

const handleDeleteTask = async (taskId: string) => {
	try {
		await taskStore.deleteTask(taskId);
	} catch (error) {
		console.error("Error deleting task:", error);
		throw error;
	}
};

const handleTaskClick = (task: Task) => {
	taskStore.selectTask(task);
	taskStore.openTaskForm();
};

const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
	try {
		await taskStore.updateTask(taskId, { status: newStatus });
	} catch (error) {
		console.error("Error updating task status:", error);
	}
};

// Drag and drop
const onDragStart = (e: DragEvent, taskId: string) => {
	if (e.dataTransfer) {
		e.dataTransfer.setData("taskId", taskId);
	}
};

const onDrop = async (e: DragEvent, status: TaskStatus) => {
	e.preventDefault();
	const taskId = e.dataTransfer?.getData("taskId");
	if (taskId) {
		await handleStatusChange(taskId, status);
	}
};

// Handle sidebar item selection
const handleSidebarSelect = (
	itemId: string,
	type: "workspace" | "status" | "view",
) => {
	// Handle selection based on type
	switch (type) {
		case "workspace": {
			currentFilter.value.workspaceId = itemId;
			currentFilter.value.status = null;
			currentFilter.value.view = "all";
			taskStore.setFilter({ workspaceId: itemId });
			break;
		}
		case "status": {
			currentFilter.value.status = itemId as TaskStatus;
			currentFilter.value.workspaceId = null;
			currentFilter.value.view = "all";
			taskStore.setFilter({ status: itemId as TaskStatus });
			break;
		}
		case "view": {
			currentFilter.value.view = itemId;
			currentFilter.value.workspaceId = null;
			currentFilter.value.status = null;
			taskStore.setFilter({ view: itemId });
			break;
		}
	}
};

// Search functionality
const clearSearch = () => {
	searchQuery.value = "";
};

const clearFilters = () => {
	currentFilter.value = {
		workspaceId: null,
		status: null,
		view: "all",
	};
	searchQuery.value = "";
	taskStore.setFilter({ workspaceId: null, status: null, view: "all" });
};

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
	// Ctrl/Cmd + N: New task
	if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
		e.preventDefault();
		taskStore.openTaskForm();
	}
	// Ctrl/Cmd + K: Focus search
	if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
		e.preventDefault();
		const searchInput = document.querySelector('#task-search') as HTMLInputElement;
		searchInput?.focus();
	}
	// Escape: Clear search/filters
	if (e.key === 'Escape') {
		if (searchQuery.value) {
			clearSearch();
		} else {
			clearFilters();
		}
	}
};

// Toggle fullscreen
const toggleFullscreen = () => {
	isFullscreen.value = !isFullscreen.value;
	if (isFullscreen.value) {
		document.documentElement.requestFullscreen?.();
	} else {
		document.exitFullscreen?.();
	}
};

// Error handling
const showError = (message: string) => {
	// TODO: Implement toast notification
	console.error(message);
};

// Watch for errors and show notifications
watch(error, (newError) => {
	if (newError) {
		showError(newError);
	}
});

// Lifecycle
onMounted(() => {
	taskStore.fetchTasks();
	document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div 
    :class="[
      'flex min-h-screen bg-gray-50 transition-all duration-300',
      isFullscreen ? 'fixed inset-0 z-50' : ''
    ]"
  >
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="showMobileMenu = false"
    />

    <!-- Sidebar -->
    <div 
      :class="[
        'flex-shrink-0 w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0',
        showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed lg:relative z-30 h-full lg:z-auto'
      ]"
    >
      <Sidebar 
        @select="handleSidebarSelect"
        :workspaces="workspaces"
        :statuses="[
          { id: 'todo', name: 'To Do' },
          { id: 'in-progress', name: 'In Progress' },
          { id: 'review', name: 'Review' },
          { id: 'done', name: 'Done' }
        ]"
      />
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto lg:ml-0">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-col justify-between py-6 space-y-4 md:flex-row md:items-center md:space-y-0">
          <div class="flex items-center space-x-4">
            <!-- Mobile Menu Button -->
            <button
              type="button"
              @click="showMobileMenu = !showMobileMenu"
              class="p-2 text-gray-600 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div class="i-mdi-menu w-6 h-6" />
            </button>
            
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
              <p class="text-sm text-gray-500 mt-1">
                {{ taskStats.filtered }} of {{ taskStats.total }} tasks
                <span v-if="searchQuery || currentFilter.workspaceId || currentFilter.status || currentFilter.view !== 'all'">
                  (filtered)
                </span>
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <div class="i-mdi-magnify w-5 h-5 text-gray-400" />
              </div>
              <input
                id="task-search"
                v-model="searchQuery"
                type="text"
                placeholder="Search tasks... (Ctrl+K)"
                class="block w-64 pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <div class="i-mdi-close w-5 h-5" />
              </button>
            </div>

            <!-- Clear Filters -->
            <button
              v-if="searchQuery || currentFilter.workspaceId || currentFilter.status || currentFilter.view !== 'all'"
              @click="clearFilters"
              class="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Clear Filters
            </button>
            
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
                <div class="i-mdi-view-column w-4 h-4 mr-2" />
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
                <div class="i-mdi-table w-4 h-4 mr-2" />
                Table
              </button>
            </div>

            <!-- Fullscreen Toggle -->
            <button
              type="button"
              @click="toggleFullscreen"
              class="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
            >
              <div :class="isFullscreen ? 'i-mdi-fullscreen-exit' : 'i-mdi-fullscreen'" class="w-5 h-5" />
            </button>
            
            <!-- New Task Button -->
            <button
              type="button"
              @click="taskStore.openTaskForm()"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <div class="i-mdi-plus w-5 h-5 mr-2 -ml-1" />
              New Task
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-2 text-gray-600">
            <div class="i-mdi-loading w-6 h-6 animate-spin" />
            <span>Loading tasks...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-12">
          <div class="max-w-md mx-auto text-center">
            <div class="i-mdi-alert-circle w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button
              @click="taskStore.fetchTasks()"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTasks.length === 0 && !isLoading" class="py-12">
          <div class="max-w-md mx-auto text-center">
            <div class="i-mdi-clipboard-text-outline w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ searchQuery || currentFilter.workspaceId || currentFilter.status || currentFilter.view !== 'all' 
                ? 'No tasks found' 
                : 'No tasks yet' 
              }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ searchQuery || currentFilter.workspaceId || currentFilter.status || currentFilter.view !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first task'
              }}
            </p>
            <button
              v-if="!searchQuery && !currentFilter.workspaceId && !currentFilter.status && currentFilter.view === 'all'"
              @click="taskStore.openTaskForm()"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Create Task
            </button>
          </div>
        </div>

        <!-- Task Views -->
        <div v-else>
          <!-- Kanban View -->
          <KanBanView
            v-if="viewMode === 'kanban'"
            :tasks="filteredTasks"
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
            :tasks="filteredTasks"
            :on-edit="handleTaskClick"
            :on-delete="handleDeleteTask"
            :on-status-change="(taskId: string, status: string) => handleStatusChange(taskId, status as TaskStatus)"
            class="mt-6"
          />
        </div>
      </div>
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

    <!-- Keyboard Shortcuts Help -->
    <div class="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-3 py-2 rounded-md shadow-sm border">
      <div class="space-y-1">
        <div><kbd class="px-1 py-0.5 bg-gray-100 rounded">Ctrl+N</kbd> New task</div>
        <div><kbd class="px-1 py-0.5 bg-gray-100 rounded">Ctrl+K</kbd> Search</div>
        <div><kbd class="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> Clear</div>
      </div>
    </div>
  </div>
</template>