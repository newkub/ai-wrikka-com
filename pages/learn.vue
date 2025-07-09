<script setup lang="ts">
definePageMeta({
	layout: "default",
});

import CardText from "~/components/CardText.vue";

const learningCards = [
	{
		title: "Getting Started",
		description: "Learn the basics and get started with our platform.",
		icon: "i-mdi-book-open-page-variant",
	},
	{
		title: "Tutorials",
		description: "Step-by-step guides to master our tools.",
		icon: "i-mdi-school",
	},
	{
		title: "API Documentation",
		description: "Complete reference for our API endpoints.",
		icon: "i-mdi-api",
	},
	{
		title: "Best Practices",
		description: "Learn the recommended ways to use our platform.",
		icon: "i-mdi-lightbulb",
	},
];
</script>

<template>
  <NuxtLayout>
    <div class="container mx-auto px-4 py-8 h-screen flex gap-4 scrollbar-thin scrollbar-thumb-border/50 scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-track-rounded">
    <!-- Left Panel (3/4 width) -->
    <div class="w-3/4 pr-4 overflow-y-auto">
      <h1 class="font-bold mb-6">Learning Resources</h1>
      
      <!-- Grid Layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardText 
          v-for="card in learningCards" 
          :key="card.title"
          :title="card.title" 
          :description="card.description" 
          :icon="card.icon"
        />
      </div>
    </div>
    
    <!-- Right Panel (1/4 width) -->
    <div class="w-1/4 bg-block rounded-lg shadow p-4">
      <h2 class="text-lg font-semibold mb-4">Learning Assistant</h2>
      <div class="h-[calc(100%-3rem)] flex flex-col">
        <!-- Chat messages will go here -->
        <div class="flex-grow overflow-y-auto mb-4 space-y-2">
          <div class="text-sm text/80">
            Ask me anything about our learning resources!
          </div>
        </div>
        
        <!-- Chat input -->
        <div class="mt-auto">
          <div class="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your question..." 
              class="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-block"
            >
            <button class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              <i class="i-mdi-send" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </NuxtLayout>
</template>

