<template>
  <div class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">My Lists</h2>
        <button 
          @click="isAddingList = true"
          class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
          aria-label="Add new list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
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
            class="flex-1 text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @keyup.enter="createList"
            @keyup.esc="cancelAddList"
          />
          <button 
            @click="createList"
            class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <ul class="space-y-1 p-2">
        <li 
          v-for="list in lists" 
          :key="list.id"
          @click="selectList(list.id)"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer',
            { 'bg-blue-50 text-blue-600': isActiveList(list.id) }
          ]"
        >
          <div class="flex items-center space-x-2 truncate">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span class="truncate">{{ list.name }}</span>
          </div>
          <span class="text-xs text-gray-400">{{ list.taskCount }}</span>
        </li>
      </ul>
    </div>
    
    <div class="p-4 border-t border-gray-200">
      <div class="text-xs text-gray-500">
        {{ totalTasks }} tasks in {{ lists.length }} lists
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useTaskStore } from '~/stores/task';

const taskStore = useTaskStore();
const emit = defineEmits(['select']);

interface TaskList {
  id: string;
  name: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

// State
const lists = ref<TaskList[]>([]);
const isAddingList = ref(false);
const newListName = ref('');
const selectedListId = ref<string | null>(null);
const listNameInput = ref<HTMLInputElement | null>(null);

// Computed
const totalTasks = computed(() => {
  return lists.value.reduce((sum, list) => sum + list.taskCount, 0);
});

// Methods
function isActiveList(listId: string) {
  return selectedListId.value === listId;
}

function selectList(listId: string) {
  selectedListId.value = listId;
  emit('select', listId);
}

async function createList() {
  if (!newListName.value.trim()) return;
  
  const newList: TaskList = {
    id: Date.now().toString(),
    name: newListName.value.trim(),
    taskCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // In a real app, this would be an API call
  lists.value.push(newList);
  
  // Reset form
  newListName.value = '';
  isAddingList.value = false;
  
  // Select the newly created list
  selectList(newList.id);
}

function cancelAddList() {
  newListName.value = '';
  isAddingList.value = false;
}

// Lifecycle
onMounted(() => {
  // Load initial data
  lists.value = [
    { id: '1', name: 'Personal', taskCount: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Work', taskCount: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'Shopping', taskCount: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  
  // Select the first list by default
  if (lists.value.length > 0) {
    selectList(lists.value[0].id);
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
