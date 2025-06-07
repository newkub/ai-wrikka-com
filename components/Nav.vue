<template>
  <nav class="bg-white dark:bg-gray-900 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Left section - Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <Logo />
          </NuxtLink>
        </div>

        <!-- Center section - Navigation Links -->
        <div class="hidden md:flex items-center justify-center flex-1">
          <div class="flex space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path === '/' }"
            >
              หน้าแรก
            </NuxtLink>
            <NuxtLink 
              to="/chat" 
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path === '/chat' }"
            >
              แชท
            </NuxtLink>
            <NuxtLink 
              to="/blog" 
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path === '/blog' }"
            >
              บทความ
            </NuxtLink>
            <NuxtLink 
              to="/code" 
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path === '/code' }"
            >
              เขียนโค้ด
            </NuxtLink>
          </div>
        </div>

        <!-- Right section - Theme Toggle and Buttons -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <div class="flex items-center">
            <Toggle v-model="isDark" />
          </div>
          
          <!-- Sign In Button -->
          <Button 
            variant="secondary" 
            size="sm"
            class="hidden md:inline-flex"
            @click="signIn"
          >
            เข้าสู่ระบบ
          </Button>
          
          <!-- Get Started Button -->
          <Button
            size="sm"
            class="hidden md:inline-flex"
            @click="getStarted"
          >
            เริ่มต้นใช้งาน
          </Button>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button 
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none" 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <div class="i-mdi-menu text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NuxtLink 
          to="/" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-gray-100 dark:bg-gray-800': $route.path === '/' }"
          @click="isMobileMenuOpen = false"
        >
          หน้าแรก
        </NuxtLink>
        <NuxtLink 
          to="/chat" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-gray-100 dark:bg-gray-800': $route.path === '/chat' }"
          @click="isMobileMenuOpen = false"
        >
          แชท
        </NuxtLink>
        <NuxtLink 
          to="/blog" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-gray-100 dark:bg-gray-800': $route.path === '/blog' }"
          @click="isMobileMenuOpen = false"
        >
          บทความ
        </NuxtLink>
        <NuxtLink 
          to="/code" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-gray-100 dark:bg-gray-800': $route.path === '/code' }"
          @click="isMobileMenuOpen = false"
        >
          เขียนโค้ด
        </NuxtLink>
        <div class="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="secondary" 
            class="w-full mb-2"
            @click="signIn"
          >
            เข้าสู่ระบบ
          </Button>
          <Button
            class="w-full"
            @click="getStarted"
          >
            เริ่มต้นใช้งาน
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Logo from './Logo.vue';
import Toggle from './Toggle.vue';
import Button from './Button.vue';

const route = useRoute();
const isDark = ref(false);
const isMobileMenuOpen = ref(false);

// Watch for theme changes
watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
});

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});

// Check for saved theme preference
onMounted(() => {
  if (typeof window !== 'undefined') {
    isDark.value = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
});

const signIn = () => {
  // Handle sign in
  console.log('Sign in clicked');
  // Example: navigate to sign in page
  // navigateTo('/signin');
};

const getStarted = () => {
  // Handle get started
  console.log('Get started clicked');
  // Example: navigate to sign up page
  // navigateTo('/signup');
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>