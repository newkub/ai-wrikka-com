<template>
  <div>
    <!-- Header -->
    <header class="bg-block border-b border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Bookmarks</h1>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
            Add Bookmark
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Search and Filter -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search bookmarks..."
            class="w-full px-4 py-2 bg-block border border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div class="absolute right-3 top-2.5 text/50">
            <i class="i-mdi-magnify text-xl"></i>
          </div>
        </div>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button 
            @click="setActiveTag(null)"
            :class="[
              'px-3 py-1 text-sm rounded-full transition-colors',
              !activeTag 
                ? 'bg-primary/10 text-primary' 
                : 'bg-block/50 hover:bg-block/70'
            ]"
          >
            All
          </button>
          <template v-for="tag in getAllTags()" :key="tag.id">
            <button 
              @click="setActiveTag(tag.id)"
              :class="[
                'px-3 py-1 text-sm rounded-full transition-opacity',
                activeTag === tag.id 
                  ? 'bg-primary/10 text-primary'
                  : 'bg-block/50 hover:bg-block/70'
              ]"
            >
              {{ tag.name }}
            </button>
          </template>
        </div>
      </div>

      <!-- Bookmark Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="bookmark in filteredBookmarks" 
          :key="bookmark.id"
          class="bg-block rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border flex flex-col h-full"
        >
          <!-- Bookmark Image/Gradient -->
          <div 
            class="h-40 relative"
            :class="bookmark.gradient ? `bg-gradient-to-r ${bookmark.gradient.from} ${bookmark.gradient.to}` : 'bg-gray-100'"
          >
            <img 
              v-if="bookmark.image" 
              :src="bookmark.image" 
              :alt="bookmark.title" 
              class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div class="absolute bottom-2 right-2">
              <button class="p-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow hover:bg-white/30">
                <i class="i-mdi-dots-vertical" :class="{ 'text-white': bookmark.gradient, 'text-gray-500': !bookmark.gradient }"></i>
              </button>
            </div>
          </div>
          
          <!-- Bookmark Content -->
          <div class="p-4 flex-1 flex flex-col bg-block/50">
            <div class="flex items-center mb-2">
              <img 
                :src="bookmark.favicon" 
                :alt="bookmark.domain" 
                class="w-4 h-4 mr-2"
                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMC01LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTEgMTdoLTJ2LTloMnY5em0wLTEzaC0ydjZoMnYtNnoiLz48L3N2Zz4='"
              />
              <h3 class="font-medium text-sm text-gray-500 truncate">{{ bookmark.domain }}</h3>
            </div>
            
            <a 
              :href="bookmark.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
              :title="bookmark.title"
            >
              {{ bookmark.title }}
            </a>
            
            <p 
              v-if="bookmark.description" 
              class="text-sm  line-clamp-2 mb-3 flex-1"
            >
              {{ bookmark.description }}
            </p>
            
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in bookmark.tags" 
                :key="tag.id"
                class="px-2 py-0.5 text-xs rounded"
                :class="[
                  tag.bgColor || 'bg-gray-100',
                  tag.color || 'text-gray-800'
                ]"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div 
          v-if="filteredBookmarks.length === 0"
          class="col-span-full py-12 text-gray-500"
        >
          <i class="i-mdi-bookmark-outline text-4xl mx-auto mb-4"></i>
          <p class="text-lg font-medium">No bookmarks found</p>
          <p v-if="searchQuery || activeTag" class="text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  id: string
  name: string
  color?: string
  bgColor?: string
}

interface Bookmark {
  id: string
  title: string
  url: string
  domain: string
  favicon: string
  description: string
  image?: string
  gradient?: {
    from: string
    to: string
  }
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
}

// Example data - in a real app, this would come from an API or store
const bookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'Example Bookmark Title',
    url: 'https://example.com',
    domain: 'example.com',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com',
    description: 'This is a sample bookmark description that provides some context about the bookmarked page.',
    image: 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Bookmark',
    tags: [
      { id: 't1', name: 'tag1' },
      { id: 't2', name: 'tag2' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'GitHub: Where the world builds software',
    url: 'https://github.com',
    domain: 'github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=github.com',
    description: 'GitHub is where over 100 million developers shape the future of software, together.',
    gradient: {
      from: 'from-blue-500',
      to: 'to-purple-500'
    },
    tags: [
      { id: 'dev', name: 'Development', color: 'text-blue-800', bgColor: 'bg-blue-100' },
      { id: 'code', name: 'Code' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Tailwind CSS - Rapidly build modern websites',
    url: 'https://tailwindcss.com',
    domain: 'tailwindcss.com',
    favicon: 'https://www.google.com/s2/favicons?domain=tailwindcss.com',
    description: 'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    gradient: {
      from: 'from-green-500',
      to: 'to-teal-500'
    },
    tags: [
      { id: 'css', name: 'CSS', color: 'text-green-800', bgColor: 'bg-green-100' },
      { id: 'frontend', name: 'Frontend' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Nuxt 3: The Intuitive Web Framework',
    url: 'https://v3.nuxtjs.org',
    domain: 'v3.nuxtjs.org',
    favicon: 'https://www.google.com/s2/favicons?domain=v3.nuxtjs.org',
    description: 'Build your next Vue.js application with confidence using NuxtJS. An open source framework making web development simple and powerful.',
    gradient: {
      from: 'from-purple-500',
      to: 'to-pink-500'
    },
    tags: [
      { id: 'vue', name: 'Vue', color: 'text-purple-800', bgColor: 'bg-purple-100' },
      { id: 'framework', name: 'Framework' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'TypeScript - JavaScript that scales',
    url: 'https://www.typescriptlang.org',
    domain: 'typescriptlang.org',
    favicon: 'https://www.google.com/s2/favicons?domain=typescriptlang.org',
    description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.',
    gradient: {
      from: 'from-yellow-500',
      to: 'to-orange-500'
    },
    tags: [
      { id: 'ts', name: 'TypeScript', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      { id: 'programming', name: 'Programming' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// State
const searchQuery = ref('')
const activeTag = ref<string | null>(null)

// Computed
const filteredBookmarks = computed(() => {
  return bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    if (activeTag.value) {
      return matchesSearch && bookmark.tags.some(tag => tag.id === activeTag.value)
    }
    
    return matchesSearch
  })
})

// Methods
const setActiveTag = (tagId: string | null) => {
  activeTag.value = activeTag.value === tagId ? null : tagId
}

const getAllTags = (): Tag[] => {
  const tagsMap = new Map<string, Tag>()
  
  for (const bookmark of bookmarks) {
    for (const tag of bookmark.tags) {
      if (!tagsMap.has(tag.id)) {
        tagsMap.set(tag.id, tag)
      }
    }
  }
  
  return Array.from(tagsMap.values())
}
</script>
