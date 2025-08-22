<script setup lang="ts">
import { ref, computed } from "vue";

interface SearchResult {
	file: string;
	line: number;
	content: string;
	matches: {
		line: number;
		content: string;
		lineNumber: number;
	}[];
}

const searchQuery = ref("");
const isSearching = ref(false);
const searchResults = ref<SearchResult[]>([]);
const selectedFile = ref<string | null>(null);

const filteredResults = computed(() => {
	if (!selectedFile.value) return searchResults.value;
	return searchResults.value.filter(
		(result) => result.file === selectedFile.value,
	);
});

const files = computed(() => {
	const files = new Set<string>();
	for (const result of searchResults.value) {
		files.add(result.file);
	}
	return Array.from(files);
});

const search = async () => {
	if (!searchQuery.value.trim()) {
		searchResults.value = [];
		return;
	}

	isSearching.value = true;

	try {
		// In a real app, this would call your backend search API
		// This is a mock implementation
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Mock search results
		searchResults.value = [
			{
				file: "src/components/HelloWorld.vue",
				line: 12,
				content: "  <h1>{{ msg }}</h1>",
				matches: [
					{ line: 12, content: "  <h1>{{ msg }}</h1>", lineNumber: 12 },
					{ line: 24, content: "    console.log(msg);", lineNumber: 24 },
				],
			},
			{
				file: "src/App.vue",
				line: 5,
				content: '  <HelloWorld :msg="message" />',
				matches: [
					{
						line: 5,
						content: '  <HelloWorld :msg="message" />',
						lineNumber: 5,
					},
					{
						line: 15,
						content: '      message: "Hello Vue 3 + Vite"',
						lineNumber: 15,
					},
				],
			},
		];
	} catch (error) {
		console.error("Search failed:", error);
	} finally {
		isSearching.value = false;
	}
};

const clearSearch = () => {
	searchQuery.value = "";
	searchResults.value = [];
	selectedFile.value = null;
};

const selectFile = (file: string) => {
	selectedFile.value = selectedFile.value === file ? null : file;
};

// Keyboard shortcut for search
const handleKeyDown = (e: KeyboardEvent) => {
	if (e.key === "Enter" && !e.shiftKey) {
		e.preventDefault();
		search();
	} else if (e.key === "Escape") {
		clearSearch();
	}
};
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Search Bar -->
    <div class="p-2 border-b border-border bg-block">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search (Enter to search, Esc to clear)"
          class="w-full bg-block border border-border rounded px-3 py-2 pl-10 text-sm placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
          @keydown="handleKeyDown"
        />
        <i class="i-mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-text/50"></i>
        <button
          v-if="searchQuery"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
          @click="clearSearch"
        >
          <i class="i-mdi-close"></i>
        </button>
      </div>
      
      <div v-if="files.length > 0" class="mt-2 flex flex-wrap gap-1">
        <button
          v-for="file in files"
          :key="file"
          class="text-xs px-2 py-0.5 rounded"
          :class="{
            'bg-color-primary/50 text-color-primary': selectedFile === file,
            'bg-block text-text/50 hover:bg-block/70': selectedFile !== file
          }"
          @click="selectFile(file)"
        >
          {{ file.split('/').pop() }}
          <span class="text-text/30 ml-1">
            {{ searchResults.find(r => r.file === file)?.matches.length || 0 }}
          </span>
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div class="flex-1 overflow-auto">
      <div v-if="isSearching" class="flex items-center justify-center h-full">
        <div class="animate-spin text-color-primary">
          <i class="i-mdi-loading text-2xl"></i>
        </div>
      </div>
      
      <div v-else-if="searchResults.length === 0" class="text-center py-8 text-text/50">
        <i class="i-mdi-magnify-remove-outline text-4xl mb-2"></i>
        <p>No results found</p>
        <p class="text-xs mt-1 text-text/30">Try a different search term</p>
      </div>
      
      <div v-else class="divide-y divide-border">
        <div v-for="result in filteredResults" :key="result.file" class="py-2">
          <div class="px-4 py-1 bg-block/50 text-xs text-text/50 flex items-center">
            <i class="i-mdi-file-document-outline mr-2"></i>
            <span class="truncate">{{ result.file }}</span>
            <span class="ml-auto bg-block rounded-full px-2 py-0.5 text-text">
              {{ result.matches.length }} {{ result.matches.length === 1 ? 'match' : 'matches' }}
            </span>
          </div>
          
          <div class="mt-1">
            <div 
              v-for="match in result.matches" 
              :key="`${result.file}-${match.line}`"
              class="px-4 py-1.5 hover:bg-block/50 cursor-pointer flex group"
            >
              <div class="text-xs text-text/50 w-8 flex-shrink-0">{{ match.lineNumber }}</div>
              <div class="text-sm text-text font-mono break-all">
                <span v-html="match.content.replace(new RegExp(searchQuery, 'gi'), match => `<span class='bg-color-alert/30 text-color-alert'>${match}</span>`)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
