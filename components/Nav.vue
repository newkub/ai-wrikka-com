

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useColorMode } from '@vueuse/core';

const showSettings = ref(false);
const showProfile = ref(false);
const isDropdownOpen = ref(false);
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
};

const openProfile = (event: Event) => {
  event.stopPropagation();
  showProfile.value = true;
  showSettings.value = false;
  isDropdownOpen.value = false;
};

const closeModals = () => {
  showSettings.value = false;
  showProfile.value = false;
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
];

// Close profile dropdown when clicking outside
const onClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isDropdownOpen.value || showSettings.value || showProfile.value) {
    isDropdownOpen.value = false;
    closeModals();
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
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
            <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div class="p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Settings</h3>
                    <button @click="closeModals" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <span class="sr-only">Close</span>
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <button 
                        @click="toggleTheme" 
                        type="button" 
                        class="bg-gray-200 dark:bg-gray-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        :class="{ 'bg-indigo-600': isDark, 'bg-gray-200': !isDark }"
                      >
                        <span class="sr-only">Toggle dark mode</span>
                        <span 
                          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          :class="{ 'translate-x-5': isDark, 'translate-x-0': !isDark }"
                        />
                      </button>
                    </div>
                    <!-- Add more settings options here -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Modal -->
            <div v-if="showProfile" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
                <div class="p-6">
                  <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Profile</h3>
                    <button @click="closeModals" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <span class="sr-only">Close</span>
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="text-center">
                    <div class="mx-auto h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-white mb-4">
                      U
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
  </nav>
</template>