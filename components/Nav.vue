<script setup lang="ts">
import { ref, computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import ModalCommandPalette from './ModalCommandPalette.vue';
import ModalAuth from './ModalAuth.vue';
import ModalSettings from './ModalSettings.vue';
import Avatar from './Avatar.vue';
import Dropdown from './Dropdown.vue';
import NavItems from './NavItems.vue';

// Modal states
const showModalSettings = ref(false);
const showProfile = ref(false);
const isDropdownOpen = ref(false);
const showModalCommandPalette = ref(false);
const showAuthModal = ref(false);

// Theme management
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
};

// Modal controls
const openModal = (modal: 'settings' | 'profile' | 'commandPalette') => (event: Event) => {
  event.stopPropagation();
  
  // Close all modals first
  closeModals();
  
  // Open the requested modal
  switch (modal) {
    case 'settings':
      showModalSettings.value = true;
      break;
    case 'profile':
      showProfile.value = true;
      break;
    case 'commandPalette':
      showModalCommandPalette.value = true;
      break;
  }
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

const closeModals = () => {
  showModalSettings.value = false;
  showProfile.value = false;
  showModalCommandPalette.value = false;
  isDropdownOpen.value = false;
  document.body.style.overflow = '';
};

// User actions
const signOut = () => {
  console.log('Signing out...');
  closeModals();
};

const openBilling = (event: Event) => {
  event.stopPropagation();
  closeModals();
  console.log('Open billing page');
  // navigateTo('/billing');
};

const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
};
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

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NavItems />
        </div>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <!-- Search Button -->
          <button 
            @click="openModal('commandPalette')($event)"
            class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Search"
          >
            <div class="i-mdi-magnify h-5 w-5" />
          </button>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <div v-if="isDark" class="i-mdi-weather-sunny h-5 w-5" />
            <div v-else class="i-mdi-weather-night h-5 w-5" />
          </button>

          <!-- User Menu -->
          <div class="relative">
            <Avatar :is-open="isDropdownOpen" @toggle="toggleDropdown" />
            
            <Dropdown :is-open="isDropdownOpen" position="right" @close="closeModals">
              <button
                @click="openModal('profile')($event)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-account h-5 w-5" />
                <span>Your Profile</span>
              </button>
              <button
                @click="openBilling($event)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-credit-card h-5 w-5" />
                <span>Billing</span>
              </button>
              <button
                @click="openModal('settings')($event)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-cog h-5 w-5" />
                <span>Settings</span>
              </button>
              <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                @click="signOut"
                class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-logout h-5 w-5" />
                <span>Sign out</span>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu button -->
    <div class="md:hidden">
      <button class="mobile-menu-button p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <div class="i-mdi-menu h-6 w-6" />
      </button>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden mobile-menu hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NavItems vertical />
      </div>
    </div>

    <!-- Auth Modal -->
    <ModalAuth v-model="showAuthModal" @close="showAuthModal = false" />

    <!-- Command Palette Modal -->
    <ModalCommandPalette 
      v-model="showModalCommandPalette"
      @close="closeModals"
    />
  </nav>
</template>