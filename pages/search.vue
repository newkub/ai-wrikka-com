<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const results = ref<Array<{
  title: string
  url: string
  displayUrl: string
  snippet: string
}>>([])
const hasSearched = ref(false)
const showResults = ref(false)
const currentPage = ref(1)
const resultsPerPage = 10

// Mock data for demonstration purposes
const mockSearch = async (query: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate mock results
  const mockResults = Array.from({ length: 50 }, (_, i) => ({
    title: `Result ${i + 1} for "${query}"`,
    url: `https://example.com/result-${i + 1}`,
    displayUrl: `example.com › result-${i + 1}`,
    snippet: `This is a sample search result description for the query "${query}". It provides a brief summary of what the user might find when clicking on this result.`
  }))
  
  return mockResults
}

const totalPages = computed(() => {
  return Math.ceil(results.value.length / resultsPerPage)
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * resultsPerPage
  const end = start + resultsPerPage
  return results.value.slice(start, end)
})

const search = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  showResults.value = true
  hasSearched.value = true
  currentPage.value = 1
  
  try {
    // In a real app, this would be an API call to a search engine
    const searchResults = await mockSearch(searchQuery.value)
    results.value = searchResults
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="text-blue-500 dark:text-blue-400" width="80" height="80">
          <path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z" />
        </svg>
      </div>
      
      <div class="w-full max-w-2xl mb-6">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
            <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button v-else class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
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
      <div v-else class="space-y-8">
        <div v-for="(result, index) in paginatedResults" :key="index" class="space-y-1">
          <a :href="result.url" class="text-sm text-green-700 dark:text-green-400">{{ result.displayUrl }}</a>
          <h3 class="text-xl text-blue-600 dark:text-blue-400 hover:underline">
            <a :href="result.url">{{ result.title }}</a>
          </h3>
          <p class="text-gray-700 dark:text-gray-300">{{ result.snippet }}</p>
        </div>
        
        <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-8">
          <button 
            v-for="page in totalPages" 
            :key="page" 
            :class="[
              'px-3 py-1 rounded-md border',
              currentPage === page 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200'
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
