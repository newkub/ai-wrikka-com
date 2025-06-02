<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Learning Center</h1>
    
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Panel - Grid Cards (3/4 width) -->
      <div class="w-full lg:w-3/4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(item, index) in learningItems" 
            :key="index"
            @click="selectItem(item)"
            class="bg-surface rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-border"
            :class="{ 'ring-2 ring-brand': selectedItem?.id === item.id }"
          >
            <div class="flex items-center mb-2">
              <div class="p-2 rounded-full mr-3" :class="item.iconBg">
                <div class="w-5 h-5" :class="[item.icon, item.iconColor]" />
              </div>
              <h3 class="font-semibold text-text">{{ item.title }}</h3>
            </div>
            <p class="text-sm text-text/70 line-clamp-2">{{ item.description }}</p>
            <div class="mt-3 flex justify-between items-center text-xs text-text/50">
              <span>{{ item.duration }} min</span>
              <span>{{ item.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Preview (1/4 width) -->
      <div class="w-full lg:w-1/4">
        <div class="sticky top-4">
          <div v-if="selectedItem" class="bg-surface rounded-lg shadow-md p-6 border border-border">
            <div class="flex items-center mb-4">
              <div class="p-2 rounded-full mr-3" :class="selectedItem.iconBg">
                <div class="w-6 h-6" :class="[selectedItem.icon, selectedItem.iconColor]" />
              </div>
              <h2 class="text-xl font-bold text-text">{{ selectedItem.title }}</h2>
            </div>
            <p class="text-text/80 mb-4">{{ selectedItem.description }}</p>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <div class="i-mdi-clock-outline w-4 h-4 mr-2 text-text/50" />
                <span class="text-sm">{{ selectedItem.duration }} minutes</span>
              </div>
              <div class="flex items-center">
                <div class="i-mdi-school-outline w-4 h-4 mr-2 text-text/50" />
                <span class="text-sm">{{ selectedItem.level }} level</span>
              </div>
            </div>
            <button class="w-full bg-brand hover:bg-brand/80 text-white py-2 px-4 rounded-md transition-colors">
              Start Learning
            </button>
          </div>
          <div v-else class="bg-surface/50 rounded-lg p-8 text-center border border-dashed border-border">
            <div class="i-mdi-text-box-outline w-12 h-12 mx-auto text-text/30 mb-3" />
            <h3 class="text-text/60 font-medium">Select a topic to preview</h3>
            <p class="text-sm text-text/40 mt-1">Click on any learning card to see details here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface LearningItem {
	id: number;
	title: string;
	description: string;
	duration: number;
	level: "Beginner" | "Intermediate" | "Advanced";
	icon: string;
	iconBg: string;
	iconColor: string;
}

// Mock data for learning items
const learningItems: LearningItem[] = [
	{
		id: 1,
		title: "Vue 3 Fundamentals",
		description:
			"Learn the core concepts of Vue 3 including the Composition API, reactivity, and component system.",
		duration: 45,
		level: "Beginner",
		icon: "i-mdi-code-braces",
		iconBg: "bg-blue-100",
		iconColor: "text-brand",
	},
	{
		id: 2,
		title: "TypeScript with Vue",
		description:
			"Master TypeScript integration with Vue 3 for type-safe and maintainable applications.",
		duration: 60,
		level: "Intermediate",
		icon: "i-mdi-text-box-outline",
		iconBg: "bg-purple-100",
		iconColor: "text-purple-600",
	},
	{
		id: 3,
		title: "State Management with Pinia",
		description:
			"Learn how to manage global state in your Vue 3 applications using Pinia.",
		duration: 50,
		level: "Intermediate",
		icon: "i-mdi-chip",
		iconBg: "bg-green-100",
		iconColor: "text-success",
	},
	{
		id: 4,
		title: "Vue Router Deep Dive",
		description:
			"Advanced routing techniques and patterns for Vue 3 applications.",
		duration: 55,
		level: "Intermediate",
		icon: "i-mdi-puzzle-outline",
		iconBg: "bg-yellow-100",
		iconColor: "text-yellow-600",
	},
	{
		id: 5,
		title: "Testing Vue Components",
		description:
			"Write effective unit and component tests for your Vue 3 applications.",
		duration: 65,
		level: "Advanced",
		icon: "i-mdi-code-brackets",
		iconBg: "bg-red-100",
		iconColor: "text-error",
	},
	{
		id: 6,
		title: "Server-Side Rendering",
		description:
			"Implement SSR in Vue 3 applications for better SEO and performance.",
		duration: 70,
		level: "Advanced",
		icon: "i-mdi-server-network",
		iconBg: "bg-indigo-100",
		iconColor: "text-indigo-600",
	},
];

const selectedItem = ref<LearningItem | null>(null);

const selectItem = (item: LearningItem) => {
	selectedItem.value = item;
};

useHead({
	title: "Learn - AI Wrikka",
	meta: [
		{
			name: "description",
			content: "Learning resources and tutorials powered by AI",
		},
	],
});
</script>
