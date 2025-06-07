<script setup lang="ts">
import { ref, computed } from 'vue';

// สถานะเมนูสำหรับ mobile
const isMenuOpen = ref(false);
const activeSection = ref('getting-started');

// ข้อมูลเมนู
const menuItems = [
  {
    title: 'Getting Started',
    id: 'getting-started',
    icon: 'i-mdi-rocket-launch-outline',
    children: [
      { title: 'Introduction', id: 'introduction' },
      { title: 'Installation', id: 'installation' },
      { title: 'Configuration', id: 'configuration' },
    ],
  },
  {
    title: 'Guides',
    id: 'guides',
    icon: 'i-mdi-book-open-page-variant-outline',
    children: [
      { title: 'Basic Concepts', id: 'basic-concepts' },
      { title: 'Advanced Usage', id: 'advanced-usage' },
      { title: 'Best Practices', id: 'best-practices' },
    ],
  },
  {
    title: 'API Reference',
    id: 'api',
    icon: 'i-mdi-api',
    children: [
      { title: 'Core API', id: 'core-api' },
      { title: 'Plugins', id: 'plugins' },
      { title: 'Utilities', id: 'utilities' },
    ],
  },
];

// ข้อมูลหัวข้อในหน้า (สำหรับ TOC)
const headings = [
  { id: 'introduction', text: 'Introduction', level: 2 },
  { id: 'features', text: 'Key Features', level: 2 },
  { id: 'quick-start', text: 'Quick Start', level: 2 },
  { id: 'prerequisites', text: 'Prerequisites', level: 3 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'usage', text: 'Basic Usage', level: 3 },
  { id: 'configuration', text: 'Configuration', level: 2 },
];

// ฟังก์ชันสำหรับเปลี่ยน section
const setActiveSection = (sectionId: string) => {
  activeSection.value = sectionId;
  isMenuOpen.value = false; // ปิดเมนูบนมือถือเมื่อเลือกหัวข้อ
};
</script>

<template>
  <div class="text flex flex-col">
    <!-- Header -->
    <header class="bg-block border-b border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button 
              @click="isMenuOpen = !isMenuOpen"
              class="md:hidden p-2 rounded-md text hover:bg-block/50 focus:outline-none"
            >
              <i class="i-mdi-menu text-2xl"></i>
            </button>
            <h1 class="text-xl font-bold ml-2">Documentation</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="i-mdi-magnify text-xl"></i>
            </button>
            <button class="p-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="i-mdi-brightness-6 text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Menu -->
      <aside 
        class="w-64 bg-block border-r border overflow-y-auto transition-all duration-300 ease-in-out transform md:translate-x-0 fixed md:static inset-y-0 left-0 z-30"
        :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
      >
        <div class="p-4">
          <nav>
            <ul class="space-y-1">
              <li v-for="section in menuItems" :key="section.id" class="mb-4">
                <h3 class="px-3 py-2 text-sm font-medium text/80 uppercase tracking-wider">
                  <i :class="[section.icon, 'mr-2']"></i>
                  {{ section.title }}
                </h3>
                <ul class="mt-1">
                  <li v-for="item in section.children" :key="item.id">
                    <a
                      href="#"
                      @click.prevent="setActiveSection(item.id)"
                      class="block px-3 py-2 text-sm rounded-md transition-colors duration-200"
                      :class="{
                        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': activeSection === item.id,
'text hover:bg-block/50': activeSection !== item.id
                      }"
                    >
                      {{ item.title }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold mb-6">Getting Started</h1>
          
          <div class="prose dark:prose-invert max-w-none">
            <section id="introduction" class="mb-12">
              <h2>Introduction</h2>
              <p>Welcome to the documentation for our platform. This guide will help you get started with our tools and services.</p>
              <p>Our platform is designed to be intuitive and powerful, providing everything you need to build amazing applications.</p>
            </section>

            <section id="features" class="mb-12">
              <h2>Key Features</h2>
              <ul>
                <li>Feature-rich API for all your needs</li>
                <li>Comprehensive documentation and examples</li>
                <li>Active community and support</li>
                <li>Regular updates and improvements</li>
              </ul>
            </section>

            <section id="quick-start" class="mb-12">
              <h2>Quick Start</h2>
              
              <section id="prerequisites" class="mt-6">
                <h3>Prerequisites</h3>
                <p>Before you begin, make sure you have the following installed:</p>
                <ul>
                  <li>Node.js 16.x or later</li>
                  <li>npm 7.x or later or yarn</li>
                  <li>Modern web browser</li>
                </ul>
              </section>

              <section id="installation" class="mt-6">
                <h3>Installation</h3>
                <p>Install the package using npm or yarn:</p>
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto"><code>npm install your-package-name
# or
yarn add your-package-name</code></pre>
              </section>

              <section id="usage" class="mt-6">
                <h3>Basic Usage</h3>
                <p>Import and use the package in your project:</p>
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto"><code>import { createApp } from 'your-package-name';

const app = createApp({
  // your configuration
});

app.mount('#app');</code></pre>
              </section>
            </section>

            <section id="configuration" class="mb-12">
              <h2>Configuration</h2>
              <p>Customize the behavior of the package using the following options:</p>
              <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto"><code>{
  // Enable debug mode
  debug: false,
  
  // API configuration
  api: {
    baseURL: 'https://api.example.com',
    timeout: 30000,
  },
  
  // Feature flags
  features: {
    analytics: true,
    notifications: true,
  },
}</code></pre>
            </section>
          </div>
        </div>
      </main>

      <!-- Table of Contents -->
      <aside class="hidden xl:block w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
        <div class="sticky top-6">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            On this page
          </h3>
          <nav>
            <ul class="space-y-2 text-sm">
              <li v-for="heading in headings" :key="heading.id" 
                  :class="{ 'ml-4': heading.level === 3 }">
                <a 
                  :href="`#${heading.id}`"
                  class="block py-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                  @click="setActiveSection(heading.id)"
                >
                  {{ heading.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f3f4f6; /* bg-gray-100 */
  background-color: rgba(17, 24, 39, 0.8); /* dark:bg-gray-800 */
}

.dark ::-webkit-scrollbar-track {
  background-color: #1f2937; /* dark:bg-gray-800 */
}

::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* bg-gray-300 */
  border-radius: 9999px; /* rounded-full */
}

.dark ::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* dark:bg-gray-600 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* bg-gray-400 */
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280; /* dark:bg-gray-500 */
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>