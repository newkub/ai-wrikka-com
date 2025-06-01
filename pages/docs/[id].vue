<script setup lang="ts">
import { useRoute } from "vue-router";

definePageMeta({
	layout: "docs",
});

interface Document {
	_path?: string;
	title: string;
	description?: string;
	_id?: string;
	_source?: string;
	_type?: string;
	body?: unknown;
	// Use Record<string, unknown> instead of any for better type safety
	[key: string]: string | number | boolean | object | unknown | undefined;
}

const route = useRoute();
const docId = computed(() => (route.params.id as string) || "intro");

// Fetch document from content directory
const {
	data: doc,
	pending,
	error,
} = await useAsyncData<Document>(
	`content:docs-${docId.value}`,
	async () => {
		try {
			// @ts-ignore - queryContent will be available at runtime from Nuxt Content
			return await queryContent("docs")
				.where({ _path: `/docs/${docId.value}` })
				.findOne();
		} catch (err) {
			console.error("Error fetching document:", err);
			throw createError({
				statusCode: 404,
				statusMessage: "Document not found",
			});
		}
	},
	{
		watch: [docId],
		transform: (data: Document | null) => {
			if (!data) {
				throw createError({
					statusCode: 404,
					statusMessage: "Document not found",
				});
			}
			return data;
		},
	},
);

// Set page title
useHead({
	title: doc.value?.title
		? `${doc.value.title} | Documentation`
		: "Documentation",
});

// Handle 404
if (!doc.value) {
	throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
}
</script>

<template>
  <div>
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-10 bg-gray-200 rounded w-3/4"></div>
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-4 bg-gray-100 rounded" :class="{ 'w-5/6': i % 2 === 0, 'w-3/4': i % 2 !== 0 }"></div>
      </div>
    </div>
    
    <div v-else-if="error">
      <div class="bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <div class="i-mdi-alert-circle-outline h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {{ error.message || 'An error occurred while loading the documentation.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <h1 class="text-3xl font-bold mb-6">{{ doc?.title || 'Documentation' }}</h1>
      <div class="prose max-w-none">
        <ContentRenderer :value="doc">
          <ContentRendererMarkdown :value="doc" />
          
          <template #empty>
            <div class="text-center py-12">
              <div class="i-mdi-text-box-remove-outline text-4xl text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No content found for this page.</p>
            </div>
          </template>
        </ContentRenderer>
      </div>
    </div>
  </div>
</template>
