<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  content?: string;
}

const props = defineProps<{
  isOpen: boolean;
  items: SearchItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', item: SearchItem): void;
}>();

const searchQuery = ref('');
const selectedIndex = ref(0);
const selectedItem = ref<SearchItem | null>(null);

const filteredItems = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return props.items.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.description.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
});

const selectItem = (item: SearchItem) => {
  selectedItem.value = item;
  emit('select', item);
};

const close = () => {
  searchQuery.value = '';
  selectedIndex.value = 0;
  selectedItem.value = null;
  emit('close');
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return;

  switch (e.key) {
    case 'Escape':
      close();
      break;
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredItems.value.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
      break;
    case 'Enter':
      if (filteredItems.value[selectedIndex.value]) {
        selectItem(filteredItems.value[selectedIndex.value]);
      }
      break;
  }
};

// Close when clicking outside
const onClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.command-palette')) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', onClickOutside);
  document.body.style.overflow = '';
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-op-50 flex items-start justify-center p-4 pt-20 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
        <!-- Search input -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div class="i-mdi-magnify h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-10 pr-3 py-3 border-0 text-gray-900 dark:text-white bg-transparent focus:ring-0 focus:outline-none text-base"
              placeholder="Search..."
              autofocus
            />
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <div class="i-mdi-close h-5 w-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <!-- Search results list -->
          <div class="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div v-if="!searchQuery" class="p-4 text-center text-gray-500 dark:text-gray-400">
              Type to search...
            </div>
            <div v-else-if="filteredItems.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
            <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <li 
                  v-for="(item, index) in filteredItems" 
                  :key="item.id"
                  @click="selectItem(item)"
                  @mouseenter="selectedIndex = index"
                  class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  :class="{ 'bg-gray-100 dark:bg-gray-700': selectedIndex === index }"
              >
                <div class="flex items-center">
                  <div v-if="item.icon" class="flex-shrink-0 mr-3">
                    <div :class="item.icon" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ item.title }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ item.description }}
                    </p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                      {{ item.category }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Preview panel -->
          <div class="w-1/2 p-4 overflow-y-auto">
            <div v-if="!selectedItem && filteredItems.length > 0" class="flex items-center justify-center h-full">
              <div class="text-center text-gray-500 dark:text-gray-400">
                <div class="i-mdi-arrow-left h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Select an item to preview</p>
              </div>
            </div>
            <div v-else-if="selectedItem" class="h-full">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ selectedItem.title }}
              </h3>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {{ selectedItem.category }}
              </div>
              <div class="prose dark:prose-invert max-w-none">
                <p v-if="selectedItem.content" class="whitespace-pre-line">
                  {{ selectedItem.content }}
                </p>
                <p v-else class="text-gray-500 dark:text-gray-400 italic">
                  No preview available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
