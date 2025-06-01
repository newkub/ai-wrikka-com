<template>
  <div class="sticky top-24">
    <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
      On this page
    </h3>
    <nav class="space-y-2">
      <a
        v-for="heading in items"
        :key="heading.id"
        :href="`#${heading.id}`"
        class="block text-sm text-muted-foreground hover:text-primary transition-colors"
        :class="{
          'pl-4': heading.level === 3,
          'pl-8': heading.level === 4,
          'font-medium text-primary': activeId === heading.id
        }"
        @click.prevent="scrollToHeading(`#${heading.id}`)"
      >
        {{ heading.text }}
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps<{
  items: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}>();

const activeId = ref('');
let observer: IntersectionObserver | null = null;

const setActiveId = (id: string) => {
  activeId.value = id;
  // Update URL hash without scrolling
  if (id && typeof window !== 'undefined') {
    history.replaceState(null, '', `${route.path}#${id}`);
  }
};

const onScroll = () => {
  if (!props.items.length) return;
  
  // Get all headings that are currently visible
  const visibleHeadings = props.items.filter(heading => {
    const element = document.getElementById(heading.id);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
  });

  if (visibleHeadings.length > 0) {
    // Get the first visible heading
    const firstVisible = visibleHeadings[0];
    if (firstVisible.id !== activeId.value) {
      setActiveId(firstVisible.id);
    }
  }
};

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

// Initialize IntersectionObserver
const initObserver = () => {
  if (typeof window === 'undefined') return;
  
  // Clean up previous observer if exists
  if (observer) {
    observer.disconnect();
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          break;
        }
      }
    },
    {
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0.1,
    }
  );

  // Observe all headings
  for (const { id } of props.items) {
    const element = document.getElementById(id);
    if (element) {
      observer?.observe(element);
    }
  }
};

// Handle initial hash
const handleInitialHash = () => {
  if (typeof window === 'undefined') return;
  
  const hash = window.location.hash.substring(1);
  if (hash) {
    // Wait for the content to be rendered
    setTimeout(() => {
      scrollToHeading(`#${hash}`);
    }, 100);
  }
};

onMounted(() => {
  handleInitialHash();
  
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initObserver();
  }, 150);
  
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  window.removeEventListener('scroll', onScroll);
});

// Watch for route changes to handle hash changes
watch(
  () => route.hash,
  (newHash) => {
    if (newHash) {
      const id = newHash.substring(1);
      scrollToHeading(`#${id}`);
    }
  },
  { immediate: true }
);
</script>
