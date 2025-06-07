
<script setup lang="ts">
// Mock data for documentation structure
const docsMenu = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'introduction' },
      { title: 'Installation', slug: 'installation' },
      { title: 'Configuration', slug: 'configuration' }
    ]
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', slug: 'button' },
      { title: 'Input', slug: 'input' },
      { title: 'Card', slug: 'card' }
    ]
  }
]

// Current page content mock
const currentDoc = {
  title: 'Introduction',
  content: '<h1>Welcome to our Documentation</h1><p>This is the introduction to our product documentation.</p>',
  headings: [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'features', title: 'Features', level: 2 },
    { id: 'getting-started', title: 'Getting Started', level: 3 }
  ]
}

const activeMenu = ref('')
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar Menu -->
    <div class="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div v-for="section in docsMenu" :key="section.title" class="mb-8">
        <h3 class="font-semibold text-lg mb-2">{{ section.title }}</h3>
        <ul>
          <li 
            v-for="item in section.items" 
            :key="item.slug"
            class="py-1 px-2 rounded hover:bg-gray-100"
            :class="{ 'bg-gray-100': activeMenu === item.slug }"
          >
            <NuxtLink 
              :to="`/docs/${item.slug}`" 
              class="block"
              @click="activeMenu = item.slug"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-8">
      <div class="prose max-w-4xl mx-auto">
        <div v-html="currentDoc.content" />
      </div>
    </div>

    <!-- Table of Contents -->
    <div class="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <h3 class="font-semibold text-lg mb-4">On this page</h3>
      <ul class="space-y-2">
        <li 
          v-for="heading in currentDoc.headings" 
          :key="heading.id"
          :class="`ml-${(heading.level - 2) * 4}`"
        >
          <a 
            :href="`#${heading.id}`" 
            class="text-gray-600 hover:text-gray-900"
          >
            {{ heading.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: 65ch;
}
</style>