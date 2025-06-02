<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useTaskStore } from "~/stores/task";
import type { Task, TaskList } from "~/types/task";
type Status = "todo" | "inProgress" | "review" | "done";

definePageMeta({
	layout: "default",
});

type ViewMode = "list" | "board";

// Components
const TaskSidebar = defineAsyncComponent(
	() => import("~/components/tasks/TaskSidebar.vue"),
);
const TaskCard = defineAsyncComponent(
	() => import("~/components/tasks/TaskCard.vue"),
);
const TaskModal = defineAsyncComponent(
	() => import("~/components/tasks/TaskModal.vue"),
);
const TaskListView = defineAsyncComponent(
	() => import("~/components/tasks/TaskListView.vue"),
);

// Store
const taskStore = useTaskStore();

// Current task and status for the modal
const currentTask = ref<Partial<Task>>({
	title: "",
	description: "",
	status: "todo",
	priority: "medium",
	dueDate: "",
	assignee: "",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	labels: [],
});

const currentStatus = ref<Status>("todo");
const showModal = ref(false);
const currentView = ref<ViewMode>("board");
const currentList = ref<TaskList | null>(null);

// Computed
const allTasks = computed((): Task[] => {
	if (!currentList.value) return taskStore.tasks;
	return taskStore.tasks.filter(
		(task) => task.listId === currentList.value?.id,
	);
});

interface TaskGroup {
	[key: string]: Task[];
}

const tasks = computed<TaskGroup>(() => ({
	todo: allTasks.value.filter((task: Task) => task.status === "todo"),
	inProgress: allTasks.value.filter(
		(task: Task) => task.status === "inProgress",
	),
	review: allTasks.value.filter((task: Task) => task.status === "review"),
	done: allTasks.value.filter((task: Task) => task.status === "done"),
}));

// Status colors for UI
const statusColors = {
	todo: "bg-surface-100 text-surface-800",
	inProgress: "bg-primary-100 text-primary-800",
	review: "bg-warning-100 text-warning-800",
	done: "bg-success-100 text-success-800",
};

// Current list name for display
const currentListName = computed(() => {
	return currentList.value?.name || "All Tasks";
});

// Methods
const openNewTaskModal = (status: Status): void => {
	if (!currentList.value) {
		// Using a simple alert for now, could be replaced with a toast notification
		alert("Please select a list first");
		return;
	}

	currentTask.value = {
		title: "",
		description: "",
		status,
		priority: "medium",
		dueDate: "",
		assignee: "",
		listId: currentList.value.id,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
	currentStatus.value = status;
	showModal.value = true;
};

const openEditModal = (task: Task): void => {
	currentTask.value = { ...task };
	currentStatus.value = task.status;
	showModal.value = true;
};

const closeModal = (): void => {
	showModal.value = false;
	currentTask.value = {
		title: "",
		description: "",
		status: "todo",
		priority: "medium",
		dueDate: "",
		assignee: "",
		listId: currentList.value?.id || "",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
};

interface TaskData {
	task: Partial<Task>;
	status: Status;
}

const saveTask = async (taskData: TaskData): Promise<void> => {
	// Ensure all required fields have values to satisfy the Task interface
	const taskToSave: Task = {
		id: taskData.task.id ?? Date.now().toString(),
		title: taskData.task.title ?? "",
		description: taskData.task.description ?? "",
		status: taskData.status,
		priority: taskData.task.priority ?? "medium",
		dueDate: taskData.task.dueDate ?? "",
		assignee: taskData.task.assignee ?? "",
		labels: taskData.task.labels ?? [],
		listId: taskData.task.listId ?? currentList.value?.id ?? "",
		createdAt: taskData.task.createdAt ?? new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	if (taskData.task.id) {
		const { id, ...updates } = taskToSave;
		taskStore.updateTask(id, updates);
	} else {
		taskStore.addTask(taskToSave);
	}

	closeModal();
};

const deleteTask = async (id: string): Promise<void> => {
	// In a real app, consider using a more user-friendly confirmation dialog
	if (confirm("Are you sure you want to delete this task?")) {
		await taskStore.deleteTask(id);
	}
};

const updateTask = (updatedTask: Task): void => {
	const { id, ...updates } = updatedTask;
	if (id) {
		taskStore.updateTask(id, updates);
	}
};

// Handle list selection
const handleListSelect = (list: TaskList): void => {
	currentList.value = list;
	// Fetch tasks for the selected list
	taskStore.fetchTasks(list.id);
};

// Fetch tasks on component mount
onMounted(async () => {
	try {
		await taskStore.fetchTasks();

		// If there's no current list, select the first one if available
		if (taskStore.lists.length > 0 && !currentList.value) {
			currentList.value = taskStore.lists[0];
			await taskStore.fetchTasks(currentList.value.id);
		}
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
	}
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex">
    <!-- Sidebar -->
    <TaskSidebar 
      @select="handleListSelect" 
      class="hidden md:block" 
    />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-auto">
      <!-- Header -->
      <div class="p-6 pb-0">
        <div class="mb-6">
          <!-- View Toggle -->
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              @click="currentView = 'list'"
              type="button"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-l-lg border transition-colors',
                currentView === 'list'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-surface text-text/80 border-border hover:bg-surface-hover hover:text-text'
              ]"
              :aria-pressed="currentView === 'list'"
            >
              <div class="flex items-center">
                <div class="i-mdi-format-list-bulleted h-4 w-4 me-1.5" />
                List View
              </div>
            </button>
            <button
              @click="currentView = 'board'"
              type="button"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-r-lg border transition-colors',
                currentView === 'board'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-surface text-text/80 border-border hover:bg-surface-hover hover:text-text'
              ]"
            >
              <div class="flex items-center">
                <div class="i-mdi-view-grid h-4 w-4 me-1.5" />
                Board View
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="p-6 pt-4 flex-1 overflow-auto flex flex-col">
        <!-- List View -->
        <div v-if="currentView === 'list'" class="h-full w-full">
          <TaskListView 
            :tasks="allTasks" 
            :list-name="currentListName"
            @edit="openEditModal"
            @delete="deleteTask"
            @update:task="updateTask"
            class="h-full"
          />
          
          <div class="mt-4 flex justify-end">
            <button 
              @click="openNewTaskModal('todo')"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand/50"
            >
              <div class="i-mdi-plus -ml-1 mr-2 h-5 w-5" />
              Add Task
            </button>
          </div>
        </div>
        
        <!-- Board View -->
        <div v-else class="h-full">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            <!-- To Do Column -->
            <div class="flex flex-col h-full">
              <div class="bg-white rounded-lg shadow p-4 flex-1 flex flex-col">
                <h2 class="font-semibold text-lg mb-4 text-gray-700">To Do</h2>
                <div class="space-y-3 flex-1 overflow-y-auto">
                  <TaskCard 
                    v-for="task in tasks.todo" 
                    :key="task.id" 
                    :task="task"
                    @edit="openEditModal(task)"
                    @delete="deleteTask(task.id)"
                  />
                </div>
                <button 
                  @click="openNewTaskModal('todo')"
                  class="mt-3 w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  + Add Task
                </button>
              </div>
            </div>

            <!-- In Progress Column -->
            <div class="flex flex-col h-full">
              <div class="bg-white rounded-lg shadow p-4 flex-1 flex flex-col">
                <h2 class="font-semibold text-lg mb-4 text-gray-700">In Progress</h2>
                <div class="space-y-3 flex-1 overflow-y-auto">
                  <TaskCard 
                    v-for="task in tasks.inProgress" 
                    :key="task.id" 
                    :task="task"
                    @edit="openEditModal(task)"
                    @delete="deleteTask(task.id)"
                  />
                </div>
                <button 
                  @click="openNewTaskModal('inProgress')"
                  class="mt-3 w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  + Add Task
                </button>
              </div>
            </div>

            <!-- Review Column -->
            <div class="flex flex-col h-full">
              <div class="bg-white rounded-lg shadow p-4 flex-1 flex flex-col">
                <h2 class="font-semibold text-lg mb-4 text-gray-700">Review</h2>
                <div class="space-y-3 flex-1 overflow-y-auto">
                  <TaskCard 
                    v-for="task in tasks.review" 
                    :key="task.id" 
                    :task="task"
                    @edit="openEditModal(task)"
                    @delete="deleteTask(task.id)"
                  />
                </div>
                <button 
                  @click="openNewTaskModal('review')"
                  class="mt-3 w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  + Add Task
                </button>
              </div>
            </div>

            <!-- Done Column -->
            <div class="flex flex-col h-full">
              <div class="bg-white rounded-lg shadow p-4 flex-1 flex flex-col">
                <h2 class="font-semibold text-lg mb-4 text-gray-700">Done</h2>
                <div class="space-y-3 flex-1 overflow-y-auto">
                  <TaskCard 
                    v-for="task in tasks.done" 
                    :key="task.id" 
                    :task="task"
                    @edit="openEditModal(task)"
                    @delete="deleteTask(task.id)"
                  />
                </div>
                <button 
                  @click="openNewTaskModal('done')"
                  class="mt-3 w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  + Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Task Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
          <div class="absolute inset-0 bg-text/50"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-surface rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <TaskModal 
            :task="currentTask"
            :status="currentStatus"
            @save="saveTask"
            @close="closeModal"
          />
        </div>
      </div>
    </div>
    </div>
</template>