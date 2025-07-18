<script setup lang="ts">
// Add URL type for TypeScript
declare const URL: {
	prototype: globalThis.URL;
	new (url: string | URL, base?: string | URL): globalThis.URL;
	createObjectURL(obj: Blob | MediaSource): string;
	revokeObjectURL(url: string): void;
};

interface Source {
	title: string;
	url: string;
	snippet: string;
}

interface SearchResult {
	answer: string;
	sources: Source[];
}

const query = ref("");
const isLoading = ref(false);
const result = ref<SearchResult | null>(null);
const relatedQuestions = ref<string[]>([
	"What is the capital of France?",
	"How does AI work?",
	"Best programming languages in 2024",
	"How to learn Vue.js?",
]);

const search = async () => {
	if (!query.value.trim() || isLoading.value) return;

	try {
		isLoading.value = true;

		// TODO: Replace with actual API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock response
		result.value = {
			answer:
				"Based on your query, here is a comprehensive answer generated by AI. This is a placeholder response. In a real implementation, this would be generated by an AI model based on web search results.",
			sources: [
				{
					title: "Example Source 1",
					url: "https://example.com/source1",
					snippet:
						"This is a sample snippet from the source that contains relevant information about the query.",
				},
				{
					title: "Example Source 2",
					url: "https://example.com/source2",
					snippet:
						"Another example snippet that provides additional context or information related to the search query.",
				},
			],
		};
	} catch (error) {
		console.error("Search error:", error);
	} finally {
		isLoading.value = false;
	}
};

const selectQuestion = (question: string) => {
	query.value = question;
	search();
};

// Auto-focus search input on page load
onMounted(() => {
	const searchInput = document.querySelector(
		'input[type="text"]',
	) as HTMLInputElement | null;
	if (searchInput) {
		searchInput.focus();
	}
});
</script>

<template>
  <div class="min-h-screen ">
    <!-- Header -->
    <header class="border-b border-border bg-block">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Icon name="mdi:search-web" class="text-2xl" />
            <span class="text-xl font-semibold">AI Search</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="rounded-full p-2 hover:bg-background/50">
              <Icon name="mdi:history" class="text-xl" />
            </button>
            <button class="rounded-full p-2 hover:bg-background/50">
              <Icon name="mdi:account-circle" class="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto max-w-4xl px-4 py-8">
      <!-- Search Box -->
      <div class="mb-12 mt-8">
        <div class="relative">
          <input
            v-model="query"
            type="text"
            placeholder="Ask me anything..."
            class="w-full rounded-full border border-border py-4 pl-6 pr-16 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            @keyup.enter="search"
          />
          <button
            @click="search"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 hover:opacity-90"
            :disabled="isLoading"
          >
            <Icon v-if="isLoading" name="mdi:loading" class="h-5 w-5 animate-spin" />
            <Icon v-else name="mdi:send" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="result" class="space-y-8">
        <!-- AI Answer -->
        <div class="rounded-xl bg-block p-6 shadow">
          <div class="mb-4 flex items-center">
            <div class="mr-3 h-8 w-8 rounded-full bg-primary/20 p-1.5">
              <Icon name="mdi:robot" />
            </div>
            <h2 class="font-semibold">Answer</h2>
          </div>
          <div class="prose max-w-none">
            <p>{{ result.answer }}</p>
          </div>
        </div>

        <!-- Sources -->
        <div v-if="result.sources && result.sources.length > 0" class="rounded-xl bg-block p-6 shadow">
          <h3 class="mb-4 font-semibold">Sources</h3>
          <div class="space-y-3">
            <a
              v-for="(source, index) in result.sources"
              :key="index"
              :href="source.url"
              target="_blank"
              class="block rounded-lg border border-border p-4 hover:bg-background/50"
            >
              <div class="text-sm">
                {{ (() => {
                  try {
                    return new URL(source.url).hostname;
                  } catch {
                    return source.url;
                  }
                })() }}
              </div>
              <div class="font-medium">{{ source.title }}</div>
              <p class="mt-1 text-sm line-clamp-2">{{ source.snippet }}</p>
            </a>
          </div>
        </div>
      </div>

      <!-- Related Questions -->
      <div v-if="relatedQuestions.length > 0" class="mt-12">
        <h3 class="mb-4 font-semibold">People also ask</h3>
        <div class="grid gap-3 md:grid-cols-2">
          <button
            v-for="(question, index) in relatedQuestions"
            :key="index"
            @click="selectQuestion(question)"
            class="rounded-lg border border-border p-4 text-left hover:bg-background/50"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
