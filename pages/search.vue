<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

type ResultType = 'answer' | 'source' | 'image' | 'video'

interface SearchResult {
  id: string
  title: string
  url: string
  displayUrl: string
  snippet: string
  type: ResultType
  thumbnail?: string
  duration?: string
  views?: string
  date?: string
  dimensions?: string
}

const router = useRouter()
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const activeTab = ref<ResultType>('answer')
const results = ref<SearchResult[]>([])
const hasSearched = ref(false)
const showResults = ref(false)
const currentPage = ref(1)
const resultsPerPage = 10

const tabs = [
  { id: 'answer', label: 'Answer' },
  { id: 'source', label: 'Sources' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' }
] as const

// Generate mock data for different result types
const generateMockResults = (query: string, type: ResultType, count: number): SearchResult[] => {
  return Array.from({ length: count }, (_, i) => {
    const baseResult = {
      id: `${type}-${i + 1}`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Result ${i + 1} for "${query}"`,
      url: `https://example.com/${type}-result-${i + 1}`,
      displayUrl: `example.com/${type}-results/result-${i + 1}`,
      type,
      snippet: `This is a ${type} result description for "${query}". ${i % 3 === 0 ? 'Additional context about the search result.' : 'More information available.'}`
    }

    switch (type) {
      case 'answer':
        return {
          ...baseResult,
          title: `Answer: ${query} (${i + 1})`
        }
      case 'image':
        return {
          ...baseResult,
          title: `Image: ${query} (${i + 1})`,
          thumbnail: `https://picsum.photos/200/150?random=${i}`,
          dimensions: '800x600'
        }
      case 'video':
        return {
          ...baseResult,
          title: `Video: ${query} (${i + 1})`,
          thumbnail: `https://picsum.photos/320/180?random=${i + 100}`,
          duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          views: `${(Math.random() * 1000).toFixed(0)}K views`,
          date: `${Math.floor(Math.random() * 12) + 1} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)]} ${2020 + Math.floor(Math.random() * 4)}`
        }
      default: // source
        return {
          ...baseResult,
          title: `Source: ${query} (${i + 1})`,
          date: `${Math.floor(Math.random() * 30) + 1} ${['Jan', 'Feb', 'Mar'][Math.floor(Math.random() * 3)]} ${2020 + Math.floor(Math.random() * 4)}`
        }
    }
  })
}

// Mock search function
const mockSearch = async (query: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Return results for all types
  return [
    ...generateMockResults(query, 'answer', 2),
    ...generateMockResults(query, 'source', 10),
    ...generateMockResults(query, 'image', 12),
    ...generateMockResults(query, 'video', 8)
  ]
}

const totalPages = computed(() => {
  return Math.ceil(results.value.length / resultsPerPage)
})

// Filter and paginate results based on active tab
const filteredResults = computed(() => {
  // Filter by active tab
  const filtered = activeTab.value === 'answer' 
    ? results.value.filter(r => r.type === 'answer')
    : results.value.filter(r => r.type === activeTab.value)
  
  // Paginate
  const start = (currentPage.value - 1) * resultsPerPage
  const end = start + resultsPerPage
  
  return filtered.slice(start, end)
})

// Get featured answer if available
const featuredAnswer = computed(() => 
  results.value.find(r => r.type === 'answer')
)

// Check if current tab has results
const hasTabResults = computed(() => 
  results.value.some(r => r.type === activeTab.value)
)

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * resultsPerPage
  const end = start + resultsPerPage
  return results.value.slice(start, end)
})

const search = async () => {
  const query = searchQuery.value.trim()
  if (!query) return
  
  loading.value = true
  showResults.value = true
  hasSearched.value = true
  currentPage.value = 1
  
  try {
    // In a real app, this would be an API call to a search engine
    results.value = await mockSearch(query)
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

const feelingLucky = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  try {
    // In a real app, this would redirect to the first result
    const searchResults = await mockSearch(searchQuery.value)
    if (searchResults.length > 0) {
      window.location.href = searchResults[0].url
    } else {
      showResults.value = true
      hasSearched.value = true
      results.value = []
      loading.value = false
    }
  } catch (error) {
    console.error('Search error:', error)
    showResults.value = true
    hasSearched.value = true
    results.value = []
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-5 bg-white dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center w-full max-w-4xl">
      <div class="mb-8">
        <div class="i-mdi-magnify text-blue-500 dark:text-blue-400 text-7xl" />
      </div>
      
      <div class="w-full max-w-2xl mb-6">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="i-mdi-magnify h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full py-3 pl-10 pr-10 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Search the web"
            @keyup.enter="search"
            ref="searchInput"
          />
          <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div class="i-mdi-close h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
          <button v-else class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div class="i-mdi-microphone h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div class="flex space-x-4">
        <button 
          @click="search" 
          class="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Google Search
        </button>
        <button 
          @click="feelingLucky" 
          class="px-6 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          I'm Feeling Lucky
        </button>
      </div>
    </div>
    
    <div v-if="showResults" class="w-full max-w-4xl mt-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Searching...</p>
      </div>
      <div v-else-if="results.length === 0 && hasSearched" class="text-center py-12 text-gray-500">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
      <div v-else class="space-y-6">
          <!-- Tabs Navigation -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                ]"
              >
                {{ tab.label }}
                <span v-if="results.some(r => r.type === tab.id)" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ results.filter(r => r.type === tab.id).length }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Featured Answer (only for answer tab) -->
          <div v-if="activeTab === 'answer' && featuredAnswer" class="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Featured Answer</h2>
            <p class="text-gray-700 dark:text-gray-300">{{ featuredAnswer.snippet }}</p>
            <a :href="featuredAnswer.url" class="mt-3 inline-flex items-center text-blue-600 hover:underline dark:text-blue-400">
              Read more
              <div class="i-mdi-chevron-right w-4 h-4 ml-1" />
            </a>
          </div>

          <!-- Results Grid/List -->
          <div v-if="hasTabResults" :class="{
            'grid gap-6': ['image', 'video'].includes(activeTab),
            'space-y-6': !['image', 'video'].includes(activeTab),
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5': activeTab === 'image',
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': activeTab === 'video'
          }">
            <!-- Source Results -->
            <template v-if="activeTab === 'source'">
              <div v-for="result in filteredResults" :key="result.id" class="space-y-1">
                <a :href="result.url" class="text-sm text-green-700 dark:text-green-400 line-clamp-1">{{ result.displayUrl }}</a>
                <h3 class="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  <a :href="result.url">{{ result.title }}</a>
                </h3>
                <p class="text-gray-700 dark:text-gray-300 line-clamp-2">{{ result.snippet }}</p>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ result.date }}</div>
              </div>
            </template>

            <!-- Image Results -->
            <template v-else-if="activeTab === 'image'">
              <div v-for="result in filteredResults" :key="result.id" class="group relative">
                <a :href="result.url" class="block aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <img 
                    :src="result.thumbnail" 
                    :alt="result.title"
                    class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                    loading="lazy"
                  />
                </a>
                <div v-if="result.dimensions" class="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">{{ result.dimensions }}</div>
              </div>
            </template>

            <!-- Video Results -->
            <template v-else-if="activeTab === 'video'">
              <div v-for="result in filteredResults" :key="result.id" class="space-y-2">
                <a :href="result.url" class="block aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 relative group">
                  <img 
                    :src="result.thumbnail" 
                    :alt="result.title"
                    class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                    loading="lazy"
                  />
                  <div class="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                    {{ result.duration }}
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                      <div class="i-mdi-play w-6 h-6 text-white" />
                    </div>
                  </div>
                </a>
                <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">
                  <a :href="result.url">{{ result.title }}</a>
                </h3>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{{ result.views }}</span>
                  <span>•</span>
                  <span>{{ result.date }}</span>
                </div>
              </div>
            </template>
          </div>

          <!-- No Results -->
          <div v-else class="py-12 text-center">
            <div class="i-mdi-emoticon-sad-outline mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No {{ activeTab }} results found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        
        <div v-if="hasTabResults && Math.ceil(results.filter(r => r.type === activeTab).length / resultsPerPage) > 1" class="flex justify-between items-center mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button 
            @click="currentPage > 1 ? goToPage(currentPage - 1) : null"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 rounded-md border flex items-center space-x-1',
              currentPage === 1 
                ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            ]"
          >
            <div class="i-mdi-chevron-left w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div class="hidden md:flex space-x-1">
            <button 
              v-for="page in Math.ceil(results.filter(r => r.type === activeTab).length / resultsPerPage)"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage === page 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <div class="md:hidden text-sm text-gray-500 dark:text-gray-400">
            Page {{ currentPage }} of {{ Math.ceil(results.filter(r => r.type === activeTab).length / resultsPerPage) }}
          </div>
          
          <button 
            @click="currentPage < Math.ceil(results.filter(r => r.type === activeTab).length / resultsPerPage) ? goToPage(currentPage + 1) : null"
            :disabled="currentPage >= Math.ceil(results.filter(r => r.type === activeTab).length / resultsPerPage)"
            :class="[
              'px-4 py-2 rounded-md border flex items-center space-x-1',
              currentPage >= Math.ceil(results.filter(r => r.type === activeTab).length / resultsPerPage)
                ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            ]"
          >
            <span>Next</span>
            <div class="i-mdi-chevron-right w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
