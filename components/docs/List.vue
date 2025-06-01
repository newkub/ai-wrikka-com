<template>
  <nav class="space-y-1">
    <div v-for="(section, sectionKey) in navigation" :key="sectionKey" class="mb-6">
      <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {{ section.title }}
      </h3>
      <ul class="space-y-2">
        <li v-for="item in section.items" :key="item.href">
          <NuxtLink
            :to="item.href"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="{
              'bg-accent text-accent-foreground': isActive(item.href),
              'text-foreground hover:bg-accent/50': !isActive(item.href)
            }"
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

defineProps<{
  navigation: Array<{
    title: string;
    items: Array<{
      name: string;
      href: string;
    }>;
  }>;
}>();

const route = useRoute();
const isActive = (path: string) => route.path.startsWith(path);
</script>
