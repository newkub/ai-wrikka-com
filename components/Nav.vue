

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import CommandPalette from './CommandPalette.vue';
import Settings from './Settings.vue';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  content?: string;
  href?: string;
}

const showSettings = ref(false);
const showProfile = ref(false);
const isDropdownOpen = ref(false);
const showCommandPalette = ref(false);

// Sample search items - replace with your actual data
const searchItems: SearchItem[] = [
  {
    id: '1',
    title: 'Chat',
    description: 'Start a new chat conversation',
    category: 'Chat',
    icon: 'i-mdi-chat',
    content: 'Start a new chat session to interact with the AI assistant.'
  },
  {
    id: '2',
    title: 'Notes',
    description: 'View and manage your notes',
    category: 'Notes',
    icon: 'i-mdi-note',
    content: 'Access your personal notes and create new ones.'
  },
  {
    id: '3',
    title: 'Whiteboard',
    description: 'Create or open a whiteboard',
    category: 'Whiteboard',
    icon: 'i-mdi-monitor-dashboard',
    content: 'Collaborative whiteboard for brainstorming and drawing.'
  },
  {
    id: '4',
    title: 'Settings',
    description: 'Application settings and preferences',
    category: 'System',
    icon: 'i-mdi-cog',
    content: 'Configure application settings and preferences.'
  },
  {
    id: '5',
    title: 'Documentation',
    description: 'View application documentation',
    category: 'Help',
    icon: 'i-mdi-help-circle',
    content: 'Access the application documentation and help resources.'
  }
];

const openCommandPalette = (event: Event) => {
  event.stopPropagation();
  showCommandPalette.value = true;
};

const closeCommandPalette = () => {
  showCommandPalette.value = false;
};

const handleCommandSelect = (item: SearchItem) => {
  console.log('Selected item:', item);
  // Handle navigation or action based on the selected item
  if (item.href) {
    navigateTo(item.href);
  }
  closeCommandPalette();
};
const mode = useColorMode({
  selector: 'html',
  attribute: 'class',
  modes: {
    light: 'light',
    dark: 'dark',
  },
});

const isDark = computed(() => mode.value === 'dark');

const toggleTheme = () => {
  mode.value = isDark.value ? 'light' : 'dark';
  // Update theme color meta tag
  const themeColor = isDark.value ? '#1f2937' : '#ffffff';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
};

// Set initial theme color
onMounted(() => {
  const themeColor = isDark.value ? '#1f2937' : '#ffffff';
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.setAttribute('content', themeColor);
});

const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
};

const openSettings = (event: Event) => {
  event.stopPropagation();
  showSettings.value = true;
  showProfile.value = false;
  isDropdownOpen.value = false;
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

const closeModals = () => {
  showSettings.value = false;
  showProfile.value = false;
  // Re-enable body scroll when modal is closed
  document.body.style.overflow = '';
};

const openProfile = (event: Event) => {
  event.stopPropagation();
  showProfile.value = true;
  showSettings.value = false;
  isDropdownOpen.value = false;
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

const signOut = () => {
  // Add sign out logic here
  console.log('Signing out...');
  isDropdownOpen.value = false;
};

const navItems = [
  { name: 'Chat', href: '/chat' },
  { name: 'Image', href: '/image' },
  { name: 'Video', href: '/video' },
  { name: 'Code', href: '/code' },
  { name: 'Search', href: '/search' },
  { name: 'Learn', href: '/learn' },
  { name: 'Task', href: '/task' },
  { name: 'Whiteboard', href: '/whiteboard' },
  { name: 'Bookmark', href: '/bookmark' },
  { name: 'Notes', href: '/notes' },
  { name: 'Docs', href: '/docs' },
  { name: 'Blog', href: '/blog' },
  { name: 'Design System', href: '/design-system' },
];

// Close profile dropdown when clicking outside
const onClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isDropdownOpen.value || showSettings.value || showProfile.value) {
    isDropdownOpen.value = false;
    closeModals();
  }
};

// Handle keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  // Check for Ctrl+K or Cmd+K (for Mac)
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (!showCommandPalette.value) {
      openCommandPalette(e);
    }
  }
  // Close with Escape key
  if (e.key === 'Escape' && showCommandPalette.value) {
    closeCommandPalette();
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>


<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0 flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div class="i-mdi-home h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span class="text-xl font-bold text-gray-900 dark:text-white">AI Wrikka</span>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.name" 
            :to="item.href" 
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Search Button -->
          <button 
            @click="openCommandPalette"
            class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Search"
          >
            <div class="i-mdi-magnify h-5 w-5" />
          </button>

          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme" 
            class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle theme"
          >
            <div :class="isDark ? 'i-mdi-weather-sunny' : 'i-mdi-weather-night'" class="h-5 w-5" />
          </button>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center focus:outline-none">
              <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-white">
                <span>U</span>
              </div>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="isDropdownOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div class="py-1" role="menu" aria-orientation="vertical">
                <button 
                  @click="openProfile" 
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  role="menuitem"
                >
                  <div class="i-mdi-account h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button 
                  @click="openSettings" 
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  role="menuitem"
                >
                  <div class="i-mdi-cog h-5 w-5" />
                  <span>Settings</span>
                </button>
                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button 
                  @click="signOut" 
                  class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  role="menuitem"
                >
                  <div class="i-mdi-logout h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>

            <!-- Settings Modal -->
            <Settings 
              v-model:isOpen="showSettings"
              @close="closeModals"
            />

            <!-- Profile Modal -->
            <div v-if="showProfile" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
                <div class="p-6">
                  <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Profile</h3>
                    <button @click="closeModals" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <span class="sr-only">Close</span>
                      <div class="i-mdi-close h-6 w-6" />
                    </button>
                  </div>
                  <div class="text-center">
                    <div class="mx-auto h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-white mb-4">
                      <div class="i-mdi-account-circle h-16 w-16 text-gray-700 dark:text-white" />
                    </div>
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">User Name</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">user@example.com</p>
                    
                    <div class="space-y-3">
                      <button class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                        View Profile
                      </button>
                      <button class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Command Palette -->
    <CommandPalette 
      v-model:isOpen="showCommandPalette"
      :items="searchItems"
      @close="closeCommandPalette"
      @select="handleCommandSelect"
    />
  </nav>
</template>