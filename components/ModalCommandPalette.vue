<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Ref } from 'vue';

export interface CommandPaletteItem {
  path: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  keywords?: string[];
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    items?: CommandPaletteItem[];
    placeholder?: string;
    emptyText?: string;
    loading?: boolean;
  }>(),
  {
    items: () => [],
    placeholder: 'Search...',
    emptyText: 'No results found',
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', item: CommandPaletteItem): void;
  (e: 'search', query: string): void;
  (e: 'close'): void;
  (e: 'open'): void;
}>();

const router = useRouter();
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const selectedIndex = ref(0);

// Handle v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  emit('search', newQuery);
  selectedIndex.value = 0; // Reset selection on new search
});

// Watch for items changes to reset selection
watch(() => props.items, () => {
  selectedIndex.value = 0;
}, { deep: true });

// Handle open/close state changes
watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick();
    searchInput.value?.focus();
    emit('open');
  } else {
    searchQuery.value = '';
    emit('close');
  }
});

// Filter items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  
  const query = searchQuery.value.toLowerCase();
  return props.items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.keywords?.some((k: string) => k.toLowerCase().includes(query)) ?? false)
  );
});

// Close the command palette
const close = () => {
  isOpen.value = false;
};

// Handle item selection
const selectItem = (item: CommandPaletteItem) => {
  emit('select', item);
  
  if (item.path) {
    router.push(item.path);
  }
  
  close();
};

// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  const items = filteredItems.value;
  
  switch (e.key) {
    case 'Escape':
      e.preventDefault();
      close();
      break;
      
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, items.length - 1);
      scrollToSelected();
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
      scrollToSelected();
      break;
      
    case 'Enter':
      if (items[selectedIndex.value]) {
        e.preventDefault();
        selectItem(items[selectedIndex.value]);
      }
      break;
  }
};

// Scroll selected item into view
const scrollToSelected = () => {
  nextTick(() => {
    const selectedElement = document.querySelector('.command-palette-item.selected');
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  });
};

// Get category color class
const getCategoryClass = (category: string) => {
  const colors = {
    'Communication': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'Media': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    'Development': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'Navigation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    'Productivity': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    'Education': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    'Resources': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
    'Organization': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  };
  
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

// Quick actions
interface QuickAction {
  icon: string;
  label: string;
  command: string;
  action?: () => void;
}

const quickActions: QuickAction[] = [
  { 
    icon: 'i-mdi-plus', 
    label: 'New chat', 
    command: '⌘K',
    action: () => router.push('/chat/new')
  },
  { 
    icon: 'i-mdi-upload', 
    label: 'Upload file', 
    command: '⌘U',
    action: () => console.log('Upload file')
  },
  { 
    icon: 'i-mdi-cog', 
    label: 'Settings', 
    command: '⌘,',
    action: () => router.push('/settings')
  },
];

// Handle quick action selection
const handleQuickAction = (action: QuickAction) => {
  if (action.action) {
    action.action();
    close();
  }
};
</script>

<template>
  <Modal
    v-model="isOpen"
    title="Command Palette"
    :show-close-button="false"
    :close-on-backdrop="true"
    :close-on-esc="true"
    content-class="max-w-2xl p-0 overflow-hidden"
    no-padding
    @close="close"
  >
    <!-- Search input -->
    <div class="relative border-b border-border">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <div class="i-mdi-magnify h-5 w-5 text-text/40" />
      </div>
      <input
        ref="searchInput"
        v-model="searchQuery"
        @keydown="handleKeyDown"
        type="text"
        class="w-full py-4 pl-10 pr-4 text-text bg-transparent border-0 focus:ring-0 focus:outline-none text-lg placeholder-text/50"
        placeholder="Search pages, commands, and more..."
        autocomplete="off"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <kbd class="px-2 py-1 text-xs font-semibold text-text/50 bg-surface-100 dark:bg-surface-700 rounded">
          Esc
        </kbd>
      </div>
    </div>

    <!-- Results -->
    <div v-if="searchQuery" class="max-h-[60vh] overflow-y-auto">
      <div v-if="filteredItems.length === 0" class="px-4 py-14 text-center">
        <div class="i-mdi-magnify-remove-outline mx-auto h-12 w-12 text-text/30" />
        <p class="mt-4 font-semibold text-text">No results found</p>
        <p class="mt-1 text-sm text-text/50">We couldn't find anything with that term. Please try again.</p>
      </div>
      <ul v-else class="divide-y divide-border">
        <li 
          v-for="(item, index) in filteredItems"
          :key="item.path"
          @click="selectItem(item)"
          @mouseenter="selectedIndex = index"
          class="relative flex cursor-pointer select-none items-center px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          :class="{ 'bg-surface-100 dark:bg-surface-700': selectedIndex === index }"
        >
          <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg" :class="item.icon ? 'bg-brand/10' : 'bg-surface-200 dark:bg-surface-600'">
            <div v-if="item.icon" :class="item.icon + ' h-5 w-5 text-brand'" />
            <span v-else class="text-text/50">{{ item.title.charAt(0) }}</span>
          </div>
          <div class="ml-4 flex-auto min-w-0">
            <p class="text-sm font-medium text-text truncate">{{ item.title }}</p>
            <p class="text-sm text-text/50 truncate">{{ item.description }}</p>
          </div>
          <div class="px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap" :class="getCategoryClass(item.category)">
            {{ item.category }}
          </div>
        </li>
      </ul>
    </div>
    
    <div v-else class="px-6 py-8 text-center">
      <div class="i-mdi-lightning-bolt-outline mx-auto h-12 w-12 text-text/30" />
      <p class="mt-4 font-semibold text-text">Quick actions</p>
      <div class="mt-4 grid grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          v-for="(action, i) in quickActions"
          :key="i"
          @click="handleQuickAction(action)"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-text bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-lg transition-colors"
        >
          <div :class="action.icon + ' h-5 w-5 mr-2 text-brand'" />
          {{ action.label }}
        </button>
      </div>
    </div>
  </Modal>
</template>