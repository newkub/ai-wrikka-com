<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useTaskStore } from '~/stores/task';
import type { Task } from '~/types/task';
type Status = 'todo' | 'inProgress' | 'review' | 'done';

type ViewMode = 'list' | 'board';

// Components
const TaskSidebar = defineAsyncComponent(() => import('~/components/tasks/TaskSidebar.vue'));
const TaskCard = defineAsyncComponent(() => import('~/components/tasks/TaskCard.vue'));
const TaskModal = defineAsyncComponent(() => import('~/components/tasks/TaskModal.vue'));
const TaskListView = defineAsyncComponent(() => import('~/components/tasks/TaskListView.vue'));

// Store
const taskStore = useTaskStore();

// Current task and status for the modal
const currentTask = ref<Partial<Task>>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignee: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  labels: []
});

const currentStatus = ref<Status>('todo');
const showModal = ref(false);
const currentView = ref<'list' | 'board'>('board');
interface TaskList {
  id: string;
  name: string;
}

const currentList = ref<TaskList | null>(null);

// Computed
const allTasks = computed((): Task[] => taskStore.tasks);

interface TaskGroup {
  [key: string]: Task[];
}

const tasks = computed<TaskGroup>(() => ({
  todo: allTasks.value.filter((task: Task) => task.status === 'todo'),
  inProgress: allTasks.value.filter((task: Task) => task.status === 'inProgress'),
  review: allTasks.value.filter((task: Task) => task.status === 'review'),
  done: allTasks.value.filter((task: Task) => task.status === 'done')
}));

// Methods
const openNewTaskModal = (status: Status): void => {
  currentTask.value = {
    title: '',
    description: '',
    status,
    priority: 'medium',
    dueDate: '',
    assignee: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  currentStatus.value = status;
  showModal.value = true;
}

const openEditModal = (task: Task): void => {
  currentTask.value = { ...task };
  currentStatus.value = task.status;
  showModal.value = true;
}

const closeModal = (): void => {
  showModal.value = false;
  currentTask.value = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

interface TaskData {
  task: Partial<Task>;
  status: Status;
}

const saveTask = async (taskData: TaskData): Promise<void> => {
  // Ensure all required fields have values to satisfy the Task interface
  const taskToSave: Task = {
    id: taskData.task.id ?? Date.now().toString(),
    title: taskData.task.title ?? '',
    description: taskData.task.description ?? '',
    status: taskData.status,
    priority: taskData.task.priority ?? 'medium',
    dueDate: taskData.task.dueDate ?? '',
    assignee: taskData.task.assignee ?? '',
    labels: taskData.task.labels ?? [],
    createdAt: taskData.task.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (taskData.task.id) {
    const { id, ...updates } = taskToSave;
    taskStore.updateTask(id, updates);
  } else {
    taskStore.addTask(taskToSave);
  }
  
  closeModal();
}

const deleteTask = async (id: string): Promise<void> => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(id);
  }
}

const updateTask = (updatedTask: Task): void => {
  const { id, ...updates } = updatedTask;
  if (id) {
    taskStore.updateTask(id, updates);
  }
}

// Handle list selection
const handleListSelect = (list: TaskList): void => {
  currentList.value = list;
  // In a real app, you would fetch tasks for the selected list
  console.log('Selected list:', list);
  // For now, we'll just fetch all tasks
  taskStore.fetchTasks();
}

// Fetch tasks on component mount
onMounted(() => {
  taskStore.fetchTasks();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <TaskSidebar @select="handleListSelect" class="hidden md:block" />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-auto">
      <!-- Header -->
      <div class="p-6 pb-0">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Task Board</h1>
            <p class="text-gray-600">Manage your tasks efficiently</p>
          </div>
          
          <!-- View Toggle -->
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              @click="currentView = 'list'"
              type="button"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-l-lg border',
                currentView === 'list'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List View
              </div>
            </button>
            <button
              @click="currentView = 'board'"
              type="button"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-r-lg border',
                currentView === 'board'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-l-0 border-gray-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Board View
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="p-6 pt-4 flex-1 overflow-auto">
        <!-- List View -->
        <div v-if="currentView === 'list'" class="h-full">
          <TaskListView 
            :tasks="allTasks" 
            :list-name="currentList?.name || 'All Tasks'"
            @edit="openEditModal"
            @delete="deleteTask"
            @update:task="updateTask"
            class="h-full"
          />
          
          <div class="mt-4 flex justify-end">
            <button 
              @click="openNewTaskModal('todo')"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
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
    <div v-if="showModal">
      <TaskModal 
        :task="currentTask"
        :status="currentStatus"
        @save="saveTask"
        @close="closeModal"
      />
    </div>
  </div>
</template>
