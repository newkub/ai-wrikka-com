<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Navbar Component -->
    <Nav />
    
    <!-- Docs Header -->
    <header class="bg-surface sticky top-0 z-40 py-4 border-b border-border shadow-sm">
      <div class="w-full max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center">
          <NuxtLink to="/docs" class="text-foreground font-bold text-2xl transition-colors hover:text-primary">
            <h1>Documentation</h1>
          </NuxtLink>
          <div class="flex items-center gap-4">
            <div class="relative">
              <input
                type="text"
                placeholder="Search docs..."
                class="pl-10 pr-4 py-2 border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-ring w-64 bg-background text-foreground"
              >
              <div class="i-mdi-magnify w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>


    <!-- Main Content -->
    <div class="flex flex-1 max-w-7xl w-full mx-auto px-6 py-8">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 pr-8 border-r border-border h-[calc(100vh-120px)] sticky top-20 overflow-y-auto">
        <DocsList v-if="navigation" :navigation="navigation" />
        <div v-else class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div v-for="j in 3" :key="j" class="ml-4 h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 min-w-0 px-8">
        <div class="prose max-w-none">
          <slot />
        </div>
      </main>

      <!-- Table of Contents -->
      <aside class="hidden xl:block w-64 flex-shrink-0 pl-8 border-l border-border">
        <DocsToc :items="tableOfContents" />
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
import DocsList from '~/components/docs/List.vue';
import DocsToc from '~/components/docs/Toc.vue';
import type { NavigationItem } from '~/types/content';

const route = useRoute();

// Table of contents state
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([]);

// Fetch navigation from content directory
const { data: navigation } = await useAsyncData<NavigationItem[]>('navigation', async () => {
  return Promise.resolve([
    {
      title: 'Getting Started',
      items: [
        { name: 'Introduction', href: '/docs/intro' },
        { name: 'Installation', href: '/docs/installation' },
        { name: 'Configuration', href: '/docs/configuration' },
      ],
    },
    {
      title: 'Authentication',
      items: [
        { name: 'Overview', href: '/docs/auth' },
      ],
    },
    {
      title: 'Guides',
      items: [
        { name: 'Best Practices', href: '/docs/best-practices' },
        { name: 'Endpoints', href: '/docs/endpoints' },
        { name: 'Examples', href: '/docs/examples' },
        { name: 'Troubleshooting', href: '/docs/troubleshooting' },
      ],
    },
  ]);
});

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