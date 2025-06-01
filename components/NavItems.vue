<script setup lang="ts">
const props = defineProps<{
  vertical?: boolean;
}>();

const navItems = [
  { name: 'Chat', href: '/chat', icon: 'i-mdi-chat' },
  { name: 'Image', href: '/image', icon: 'i-mdi-image' },
  { name: 'Video', href: '/video', icon: 'i-mdi-video' },
  { name: 'Code', href: '/code', icon: 'i-mdi-code-braces' },
  { name: 'Search', href: '/search', icon: 'i-mdi-magnify' },
  { name: 'Learn', href: '/learn', icon: 'i-mdi-school' },
  { name: 'Task', href: '/task', icon: 'i-mdi-format-list-checks' },
  { name: 'Whiteboard', href: '/whiteboard', icon: 'i-mdi-whiteboard' },
  { name: 'Bookmark', href: '/bookmark', icon: 'i-mdi-bookmark' },
  { name: 'Notes', href: '/notes', icon: 'i-mdi-note' },
  { name: 'Docs', href: '/docs', icon: 'i-mdi-file-document' },
  { name: 'Blog', href: '/blog', icon: 'i-mdi-post' },
  { name: 'Design System', href: '/design-system', icon: 'i-mdi-palette' },
];
</script>

<template>
  <template v-if="!vertical">
    <NuxtLink
      v-for="item in navItems"
      :key="item.href"
      :to="item.href"
      class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
      active-class="text-indigo-600 dark:text-indigo-400 font-semibold"
    >
      {{ item.name }}
    </NuxtLink>
  </template>
  <template v-else>
    <NuxtLink
      v-for="item in navItems"
      :key="item.href"
      :to="item.href"
      class="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
      active-class="bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
    >
      <div class="flex items-center space-x-3">
        <div :class="[item.icon, 'h-5 w-5']" />
        <span>{{ item.name }}</span>
      </div>
    </NuxtLink>
  </template>
</template>
