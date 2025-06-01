<template>
  <div class="w-64 bg-surface border-r border-border flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-foreground">My Lists</h2>
        <button 
          @click="isAddingList = true"
          class="text-text/60 hover:text-brand p-1 rounded-full hover:bg-surface/50"
          aria-label="Add new list"
        >
          <div class="i-mdi-plus h-5 w-5"></div>
        </button>
      </div>
      
      <!-- Add List Form -->
      <div v-if="isAddingList" class="mb-4">
        <div class="flex space-x-2">
          <input
            ref="listNameInput"
            v-model="newListName"
            type="text"
            placeholder="List name"
            class="flex-1 text-sm rounded border border-border bg-surface text-text shadow-sm focus:border-brand focus:ring-1 focus:ring-brand"
            @keyup.enter="createList"
            @keyup.esc="cancelAddList"
          />
          <button 
            @click="createList"
            class="px-2 py-1 bg-brand text-white rounded hover:bg-brand/90"
          >
            Add
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <ul class="space-y-1 p-2">
        <li 
          v-for="list in taskStore.lists" 
          :key="list.id"
          @click="selectList(list)"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-text/80 hover:text-text',
            { 'bg-primary/10 text-primary': isActiveList(list.id) }
          ]"
        >
          <div class="flex items-center space-x-2 truncate">
            <div class="i-mdi-format-list-bulleted h-4 w-4 flex-shrink-0"></div>
            <span class="truncate">{{ list.name }}</span>
          </div>
          <span class="text-xs text-text/60">{{ taskCounts[list.id] || 0 }}</span>
        </li>
      </ul>
    </div>
    
    <div class="p-4 border-t border-border">
      <div class="text-xs text-text/60">
        {{ taskStore.tasks.length }} tasks in {{ taskStore.lists.length }} lists
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useTaskStore } from "~/stores/task";
import type { TaskList } from "~/types/task";

const taskStore = useTaskStore();
const emit = defineEmits(["select"]);

// State
const isAddingList = ref(false);
const newListName = ref("");
const selectedListId = ref<string | null>(null);
const listNameInput = ref<HTMLInputElement | null>(null);

// Computed
const taskCounts = computed(() => {
	return taskStore.getTaskCountsByList;
});

// Methods
function isActiveList(listId: string) {
	return selectedListId.value === listId;
}

function selectList(list: TaskList) {
	selectedListId.value = list.id;
	emit("select", list);
	taskStore.fetchTasks(list.id);
}

async function createList() {
	if (!newListName.value.trim()) return;

	const newList: Omit<TaskList, "id"> = {
		name: newListName.value.trim(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	// In a real app, this would be an API call
	const newListWithId = {
		...newList,
		id: Date.now().toString(),
	};

	taskStore.lists.push(newListWithId);

	// Reset form
	newListName.value = "";
	isAddingList.value = false;

	// Select the newly created list
	selectList(newListWithId);
}

function cancelAddList() {
	newListName.value = "";
	isAddingList.value = false;
}

// Lifecycle
onMounted(() => {
	// Select the first list by default if not already selected
	if (taskStore.lists.length > 0 && !selectedListId.value) {
		selectList(taskStore.lists[0]);
	}
});

// Focus the input when showing the add list form
watch(isAddingList, async (newVal) => {
	if (newVal) {
		await nextTick();
		listNameInput.value?.focus();
	}
});
</script>
