<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string;
}

const tasks = ref<Task[]>([]);
const newTask = ref<Partial<Task>>({
  title: '',
  description: '',
  completed: false,
});
const showTaskDetails = ref(false);

// Load tasks from localStorage
onMounted(() => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

// Add new task
const addTask = () => {
  if (!newTask.value.title?.trim()) return;
  
  const task: Task = {
    id: Date.now().toString(),
    title: newTask.value.title,
    description: newTask.value.description || '',
    completed: false,
    dueDate: newTask.value.dueDate,
    priority: newTask.value.priority || 'medium',
    tags: newTask.value.tags,
  };

  tasks.value.unshift(task);
  saveTasks();
  
  // Reset form
  newTask.value = {
    title: '',
    description: '',
    completed: false,
  };
  showTaskDetails.value = false;
};

// Delete task
const deleteTask = (index: number) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value.splice(index, 1);
    saveTasks();
  }
};

// Format date for display
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<template>
  <div class="min-h-screen  p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-text">Tasks</h1>
        <p class="text-text/80">Manage your tasks efficiently</p>
      </header>

      <!-- Task Input -->
      <div class="bg-block rounded-lg shadow p-4 mb-6">
        <div class="flex gap-2">
          <input
            v-model="newTask.title"
            @keyup.enter="addTask"
            type="text"
            placeholder="Add a new task..."
            class="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            @click="addTask"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Task
          </button>
        </div>
        <!-- Task Details -->
        <div v-if="showTaskDetails" class="mt-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1">Due Date</label>
              <input
                v-model="newTask.dueDate"
                type="date"
                class="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1">Priority</label>
              <select v-model="newTask.priority" class="w-full p-2 border rounded-lg">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Description</label>
            <textarea
              v-model="newTask.description"
              class="w-full p-2 border rounded-lg"
              rows="3"
              placeholder="Add details..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Tags (comma separated)</label>
            <input
              v-model="newTask.tags"
              type="text"
              class="w-full p-2 border rounded-lg"
              placeholder="work, important, etc."
            />
          </div>
        </div>
        <button
          @click="showTaskDetails = !showTaskDetails"
          class="mt-2 text-sm text-primary hover:opacity-80 flex items-center gap-1"
        >
          <span v-if="!showTaskDetails">+ Add details</span>
          <span v-else>- Hide details</span>
        </button>
      </div>

      <!-- Task List -->
      <div class="space-y-3">
        <div
          v-for="(task, index) in tasks"
          :key="task.id"
          class="bg-block rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                v-model="task.completed"
                class="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <div class="flex items-center gap-2">
                  <span
                    :class="{
                      'line-through text-text/50': task.completed,
                      'text-text': !task.completed,
                      'font-medium': true
                    }"
                  >
                    {{ task.title }}
                  </span>
                  <span
                    v-if="task.priority"
                    class="px-2 py-0.5 text-xs rounded-full"
                    :class="{
                      'bg-error/20 text-error': task.priority === 'high',
                      'bg-alert/20 text-alert': task.priority === 'medium',
                      'bg-success/20 text-success': task.priority === 'low',
                    }"
                  >
                    {{ task.priority }}
                  </span>
                </div>
                <p v-if="task.description" class="text-sm text-text/70 mt-1">
                  {{ task.description }}
                </p>
                <div v-if="task.dueDate" class="flex items-center gap-2 mt-2 text-xs text-text/60">
                  <i class="i-mdi-calendar"></i>
                  <span>{{ formatDate(task.dueDate) }}</span>
                </div>
                <div v-if="task.tags" class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="(tag, i) in task.tags.split(',')"
                    :key="i"
                    class="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full"
                  >
                    {{ tag.trim() }}
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="deleteTask(index)"
              class="text-text/40 hover:text-error transition-colors"
            >
              <i class="i-mdi-delete"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="tasks.length === 0"
        class="text-center py-12 text-text/60"
      >
        <i class="i-mdi-checkbox-marked-outline text-4xl mb-2"></i>
        <p>No tasks yet. Add one above!</p>
      </div>
    </div>
  </div>
</template>

