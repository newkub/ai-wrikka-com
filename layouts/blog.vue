<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Navbar Component -->
    <Nav />
    <!-- Blog Header -->
    <header class="bg-surface sticky top-0 z-50 py-4 border-b border-border shadow-sm">
      <div class="w-full max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center">
          <NuxtLink to="/blog" class="text-foreground font-bold text-2xl transition-colors hover:text-primary">
            <h1>Blog</h1>
          </NuxtLink>
          <nav class="flex gap-6">
            <NuxtLink to="/" class="text-muted-foreground font-medium py-2 relative transition-colors hover:text-primary">Home</NuxtLink>
            <NuxtLink to="/blog" class="text-muted-foreground font-medium py-2 relative transition-colors hover:text-primary" :class="{ 'text-primary after:content-[\'\'] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-sm': route.path === '/blog' }">All Posts</NuxtLink>
            <NuxtLink to="/blog/categories" class="text-muted-foreground font-medium py-2 relative transition-colors hover:text-primary" :class="{ 'text-primary after:content-[\'\'] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-sm': route.path.startsWith('/blog/categories') }">Categories</NuxtLink>
            <NuxtLink to="/blog/tags" class="text-muted-foreground font-medium py-2 relative transition-colors hover:text-primary" :class="{ 'text-primary after:content-[\'\'] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-sm': route.path.startsWith('/blog/tags') }">Tags</NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-[1fr_280px] flex-1 gap-8 max-w-[1400px] mx-auto w-full px-8 md:grid-cols-1 md:px-6">
      <main class="py-8 bg-background max-w-[800px] mx-auto w-full">
        <div class="w-full max-w-full p-0">
          <slot name="content" />
        </div>
      </main>

      <!-- Table of Contents -->
      <aside class="py-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto lg:hidden">
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-muted-foreground m-0">Table of Contents</h3>
        </div>
        <nav>
          <ul class="list-none p-0 m-0">
            <li v-for="(item, index) in tableOfContents" :key="index" :class="`mb-2 leading-normal ${item.level === 3 ? 'pl-4' : item.level === 4 ? 'pl-8' : ''}`">
              <a :href="`#${item.id}`" @click.prevent="scrollToHeading(`#${item.id}`)" class="text-muted-foreground no-underline text-sm transition-colors block py-1 hover:text-primary">
                {{ item.text }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>

    <!-- Footer -->
    <footer class="bg-surface py-8 border-t border-border mt-auto">
      <div class="w-full max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center text-muted-foreground text-sm md:flex-col md:gap-4 md:text-center">
          <p>© {{ new Date().getFullYear() }} My Blog. All rights reserved.</p>
          <div class="flex gap-5 md:justify-center">
            <a href="#" class="text-muted-foreground no-underline transition-colors hover:text-primary">Twitter</a>
            <a href="#" class="text-muted-foreground no-underline transition-colors hover:text-primary">GitHub</a>
            <a href="#" class="text-muted-foreground no-underline transition-colors hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Nav from '~/components/Nav.vue';

const route = useRoute();
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([]);

// Generate table of contents from headings
const generateTableOfContents = () => {
  if (process.client) {
    const content = document.querySelector('.blog-post-content');
    if (!content) return [];
    
    const headings = Array.from(content.querySelectorAll('h2, h3, h4'));
    return headings.map((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/[^\w]+/g, '-') || `heading-${Math.random().toString(36).substring(2, 9)}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent || '',
        level: Number.parseInt(heading.tagName.substring(1))
      };
    });
  }
  return [];
};

// Scroll to heading with offset for fixed header
const scrollToHeading = (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Update TOC when route changes
onMounted(() => {
  // Wait for the content to be rendered
  setTimeout(() => {
    tableOfContents.value = generateTableOfContents();
  }, 100);
});

watch(() => route.path, () => {
  nextTick(() => {
    tableOfContents.value = generateTableOfContents();
  });
});
</script>
