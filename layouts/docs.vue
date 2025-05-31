<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar Component -->
    <Nav />
    
    <!-- Docs Header -->
    <header class="bg-white shadow-sm sticky top-0 z-40 py-4 border-b border-gray-200">
      <div class="w-full max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center">
          <NuxtLink to="/docs" class="text-gray-900 font-bold text-2xl transition-colors hover:text-blue-500">
            <h1>Documentation</h1>
          </NuxtLink>
          <div class="flex items-center gap-4">
            <div class="relative">
              <input
                type="text"
                placeholder="Search docs..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              >
              <svg
                class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>


    <!-- Main Content -->
    <div class="flex flex-1 max-w-7xl w-full mx-auto px-6 py-8">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 pr-8 border-r border-gray-200 h-[calc(100vh-120px)] sticky top-20 overflow-y-auto">
        <nav class="space-y-1">
          <div v-for="(section, sectionKey) in navigation" :key="sectionKey" class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {{ section.title }}
            </h3>
            <ul class="space-y-2">
              <li v-for="item in section.items" :key="item.href">
                <NuxtLink
                  :to="item.href"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  :class="{
                    'bg-blue-50 text-blue-600': isActive(item.href),
                    'text-gray-700 hover:bg-gray-100': !isActive(item.href)
                  }"
                >
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Content -->
      <main class="flex-1 min-w-0 px-8">
        <div class="prose max-w-none">
          <slot />
        </div>
      </main>

      <!-- Table of Contents -->
      <aside class="hidden xl:block w-64 flex-shrink-0 pl-8 border-l border-gray-200">
        <div class="sticky top-24">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            On this page
          </h3>
          <nav class="space-y-2">
            <a
              v-for="heading in tableOfContents"
              :key="heading.id"
              :href="`#${heading.id}`"
              class="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              :class="{
                'pl-4': heading.level === 3,
                'pl-8': heading.level === 4,
                'font-medium text-blue-600': isActiveHeading(heading.id)
              }"
              @click.prevent="scrollToHeading(`#${heading.id}`)"
            >
              {{ heading.text }}
            </a>
          </nav>
        </div>
      </aside>
    </div>

    <!-- Footer -->
    <footer class="bg-white py-6 border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center text-gray-500 text-sm">
          <p>© {{ new Date().getFullYear() }} Documentation. All rights reserved.</p>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-gray-700">Terms</a>
            <a href="#" class="hover:text-gray-700">Privacy</a>
            <a href="#" class="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Navigation items
const navigation = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs/introduction' },
      { name: 'Installation', href: '/docs/installation' },
      { name: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { name: 'Authentication', href: '/docs/authentication' },
      { name: 'API Reference', href: '/docs/api-reference' },
      { name: 'Examples', href: '/docs/examples' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { name: 'Deployment', href: '/docs/deployment' },
      { name: 'Troubleshooting', href: '/docs/troubleshooting' },
      { name: 'FAQ', href: '/docs/faq' },
    ],
  },
];

// Table of contents state
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([]);

// Check if a navigation item is active
const isActive = (path: string) => {
  return route.path.startsWith(path);
};

// Check if a heading is currently in view
const isActiveHeading = (id: string) => {
  if (typeof window === 'undefined') return false;
  const element = document.getElementById(id);
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.top <= 100;
};

// Scroll to heading with offset for fixed header
const scrollToHeading = (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

// Generate table of contents from headings
const generateTableOfContents = () => {
  if (typeof document === 'undefined') return [];
  
  const headings = Array.from(
    document.querySelectorAll('h2, h3, h4')
  ) as HTMLElement[];
  
  return headings.map((heading) => {
    // Generate ID if not exists
    if (!heading.id) {
      heading.id = heading.textContent
        ?.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') || '';
    }
    
    return {
      id: heading.id,
      text: heading.textContent || '',
      level: Number.parseInt(heading.tagName.substring(1)),
    };
  });
};

// Update TOC when route changes
onMounted(() => {
  // Wait for the content to be rendered
  setTimeout(() => {
    tableOfContents.value = generateTableOfContents();
  }, 100);
});

// Watch for route changes to update TOC
watch(
  () => route.path,
  () => {
    nextTick(() => {
      setTimeout(() => {
        tableOfContents.value = generateTableOfContents();
      }, 100);
    });
  }
);
</script>

<style scoped>
.prose {
  max-width: 100%;
}

/* Style for active navigation item */
.router-link-active {
  @apply bg-blue-50 text-blue-600;
}

/* Smooth scrolling for anchor links */nhtml {
  scroll-behavior: smooth;
}
</style>