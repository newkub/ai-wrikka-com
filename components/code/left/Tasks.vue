<script setup lang="ts">
import { ref, computed } from "vue";

interface Task {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	priority: "low" | "medium" | "high";
	dueDate?: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

const props = withDefaults(
	defineProps<{
		initialTasks?: Task[];
	}>(),
	{
		initialTasks: () => [],
	},
);

const emit = defineEmits(["taskUpdate"]);

const tasks = ref<Task[]>([
	{
		id: "1",
		title: "Fix login page layout issue",
		description: "The login form is not centered on mobile devices",
		completed: false,
		priority: "high",
		dueDate: "2023-06-15",
		tags: ["bug", "ui"],
		createdAt: "2023-06-10T09:30:00Z",
		updatedAt: "2023-06-10T09:30:00Z",
	},
	{
		id: "2",
		title: "Add input validation to contact form",
		description: "Ensure all required fields are validated on the client side",
		completed: true,
		priority: "medium",
		dueDate: "2023-06-12",
		tags: ["feature", "form"],
		createdAt: "2023-06-08T14:20:00Z",
		updatedAt: "2023-06-09T11:15:00Z",
	},
	{
		id: "3",
		title: "Optimize image loading",
		description: "Implement lazy loading for images below the fold",
		completed: false,
		priority: "medium",
		tags: ["performance"],
		createdAt: "2023-06-05T16:45:00Z",
		updatedAt: "2023-06-05T16:45:00Z",
	},
	...props.initialTasks,
]);

const newTask = ref<Partial<Task>>({
	title: "",
	description: "",
	priority: "medium",
	tags: [],
});

const newTag = ref("");
const filter = ref<"all" | "active" | "completed">("all");
const searchQuery = ref("");
const isAddingTask = ref(false);

const filteredTasks = computed(() => {
	return tasks.value.filter((task) => {
		// Apply status filter
		if (filter.value === "active" && task.completed) return false;
		if (filter.value === "completed" && !task.completed) return false;

		// Apply search query
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			return (
				task.title.toLowerCase().includes(query) ||
				task.description.toLowerCase().includes(query) ||
				task.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		return true;
	});
});

const toggleTask = (taskId: string) => {
	const task = tasks.value.find((t) => t.id === taskId);
	if (task) {
		task.completed = !task.completed;
		task.updatedAt = new Date().toISOString();
		emit("taskUpdate", task);
	}
};

const addTask = () => {
	if (!newTask.value.title?.trim()) return;

	const task: Task = {
		id: Date.now().toString(),
		title: newTask.value.title,
		description: newTask.value.description || "",
		completed: false,
		priority: newTask.value.priority || "medium",
		dueDate: newTask.value.dueDate,
		tags: [...(newTask.value.tags || [])],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	tasks.value.unshift(task);
	emit("taskUpdate", task);

	// Reset form
	newTask.value = { title: "", description: "", priority: "medium", tags: [] };
	isAddingTask.value = false;
};

const deleteTask = (taskId: string) => {
	const index = tasks.value.findIndex((t) => t.id === taskId);
	if (index !== -1) {
		tasks.value.splice(index, 1);
	}
};

const addTag = () => {
	if (
		newTag.value.trim() &&
		!newTask.value.tags?.includes(newTag.value.trim())
	) {
		if (!newTask.value.tags) {
			newTask.value.tags = [];
		}
		newTask.value.tags.push(newTag.value.trim());
		newTag.value = "";
	}
};

const removeTag = (tag: string) => {
	if (newTask.value.tags) {
		newTask.value.tags = newTask.value.tags.filter((t) => t !== tag);
	}
};

const getPriorityColor = (priority: string) => {
	switch (priority) {
		case "high":
			return "bg-color-error/20 text-color-error";
		case "medium":
			return "bg-color-warning/20 text-color-warning";
		case "low":
			return "bg-color-success/20 text-color-success";
		default:
			return "bg-block/50 text-text/50";
	}
};

const getPriorityIcon = (priority: string) => {
	switch (priority) {
		case "high":
			return "i-mdi-arrow-up-thick";
		case "medium":
			return "i-mdi-arrow-right-thick";
		case "low":
			return "i-mdi-arrow-down-thick";
		default:
			return "i-mdi-minus";
	}
};
</script>

<template>
  <div class="h-full flex flex-col bg-background text-text">
    <!-- Toolbar -->
    <div class="p-3 border-b border-border bg-block">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-medium">Tasks</h2>
        <button 
          @click="isAddingTask = !isAddingTask" 
          class="px-3 py-1 bg-color-primary hover:bg-color-primary/90 rounded text-sm flex items-center gap-1"
        >
          <i class="i-mdi-plus"></i>
          <span>Add Task</span>
        </button>
      </div>
      
      <!-- Search and Filter -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="w-full bg-block border border-border rounded px-3 py-1.5 text-sm placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
          />
          <i class="i-mdi-magnify absolute right-2 top-1/2 -translate-y-1/2 text-text/50"></i>
        </div>
        
        <div class="flex border border-border rounded overflow-hidden">
          <button
            v-for="option in [
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' }
            ]"
            :key="option.value"
            @click="filter = option.value as any"
            class="px-3 py-1 text-sm"
            :class="{
              'bg-color-primary text-white': filter === option.value,
              'text-text hover:bg-block': filter !== option.value
            }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add Task Form -->
    <div v-if="isAddingTask" class="border-b border-border p-3 bg-block/50">
      <div class="space-y-3">
        <div>
          <input
            v-model="newTask.title"
            type="text"
            placeholder="Task title"
            class="w-full bg-block border border-border rounded px-3 py-2 text-sm placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
            @keyup.enter="addTask"
          />
        </div>
        
        <div>
          <textarea
            v-model="newTask.description"
            placeholder="Description (optional)"
            rows="2"
            class="w-full bg-block border border-border rounded px-3 py-2 text-sm placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
          ></textarea>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <select
              v-model="newTask.priority"
              class="appearance-none bg-block border border-border rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <i class="i-mdi-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-text/50 pointer-events-none"></i>
          </div>
          
          <div class="relative">
            <input
              v-model="newTask.dueDate"
              type="date"
              class="bg-block border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
            />
          </div>
          
          <div class="relative flex-1 flex items-center">
            <input
              v-model="newTag"
              type="text"
              placeholder="Add tags..."
              class="w-full bg-block border border-border rounded-l px-3 py-1.5 text-sm placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
              @keyup.enter="addTag"
            />
            <button 
              @click="addTag"
              class="bg-block hover:bg-block/50 text-text/50 px-2 py-1.5 rounded-r text-sm"
            >
              <i class="i-mdi-plus"></i>
            </button>
          </div>
        </div>
        
        <div v-if="newTask.tags && newTask.tags.length > 0" class="flex flex-wrap gap-1">
          <span 
            v-for="(tag, index) in newTask.tags" 
            :key="index"
            class="inline-flex items-center bg-block text-text/50 text-xs px-2 py-0.5 rounded"
          >
            {{ tag }}
            <button @click="removeTag(tag)" class="ml-1 text-text/50 hover:text-text">
              <i class="i-mdi-close text-xs"></i>
            </button>
          </span>
        </div>
        
        <div class="flex justify-end gap-2 pt-1">
          <button 
            @click="isAddingTask = false" 
            class="px-3 py-1.5 text-sm text-text/50 hover:text-text"
          >
            Cancel
          </button>
          <button 
            @click="addTask" 
            :disabled="!newTask.title?.trim()"
            class="px-3 py-1.5 bg-color-primary hover:bg-color-primary/90 rounded text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
    
    <!-- Tasks List -->
    <div class="flex-1 overflow-auto">
      <div v-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center h-full text-text/50 p-8 text-center">
        <i class="i-mdi-checkbox-marked-circle-outline text-4xl mb-2"></i>
        <p class="font-medium">No tasks found</p>
        <p class="text-sm mt-1">{{ searchQuery ? 'Try a different search term' : 'Add a new task to get started' }}</p>
      </div>
      
      <ul v-else class="divide-y divide-border">
        <li 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="group hover:bg-block/50"
        >
          <div class="p-3">
            <div class="flex items-start gap-3">
              <button
                @click="toggleTask(task.id)"
                class="mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center"
                :class="{
                  'bg-color-primary border-color-primary': task.completed,
                  'border-border hover:border-color-primary': !task.completed,
                  [getPriorityColor(task.priority)]: !task.completed
                }"
                :title="task.completed ? 'Mark as incomplete' : 'Mark as complete'"
              >
                <i v-if="task.completed" class="i-mdi-check text-white text-sm"></i>
                <i v-else :class="[getPriorityIcon(task.priority), 'opacity-70 text-xs']"></i>
              </button>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h3 
                    class="text-sm font-medium truncate"
                    :class="{
                      'text-text/70 line-through': task.completed,
                      'text-text': !task.completed
                    }"
                  >
                    {{ task.title }}
                  </h3>
                  <div class="flex items-center gap-1">
                    <span 
                      v-if="task.dueDate" 
                      class="text-xs px-1.5 py-0.5 rounded"
                      :class="{
                        'bg-color-error/20 text-color-error': new Date(task.dueDate) < new Date() && !task.completed,
                        'bg-block/50 text-text/50': !(new Date(task.dueDate) < new Date() && !task.completed)
                      }"
                    >
                      {{ new Date(task.dueDate).toLocaleDateString() }}
                    </span>
                    <button 
                      @click="deleteTask(task.id)" 
                      class="opacity-0 group-hover:opacity-100 text-text/50 hover:text-color-error p-1"
                      title="Delete task"
                    >
                      <i class="i-mdi-trash-can-outline text-sm"></i>
                    </button>
                  </div>
                </div>
                
                <p 
                  v-if="task.description" 
                  class="mt-1 text-sm text-text/70 whitespace-pre-line break-words"
                  :class="{ 'line-through': task.completed }"
                >
                  {{ task.description }}
                </p>
                
                <div v-if="task.tags && task.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                  <span 
                    v-for="(tag, index) in task.tags" 
                    :key="index"
                    class="inline-block bg-block text-text/50 text-xs px-2 py-0.5 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div class="mt-2 flex items-center justify-between text-xs text-text/50">
                  <span>Created: {{ new Date(task.createdAt).toLocaleString() }}</span>
                  <span v-if="task.updatedAt !== task.createdAt">
                    Updated: {{ new Date(task.updatedAt).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- Status Bar -->
    <div class="px-3 py-1.5 border-t border-border bg-block text-xs text-text/50 flex items-center justify-between">
      <div>
        {{ tasks.filter(t => t.completed).length }} of {{ tasks.length }} tasks completed
      </div>
      <div>
        {{ filteredTasks.length }} {{ filteredTasks.length === 1 ? 'task' : 'tasks' }} shown
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
