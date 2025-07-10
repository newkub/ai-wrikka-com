<template>
  <div class="space-y-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Changelog</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Stay up to date with the latest product updates, improvements, and fixes.
      </p>
    </div>

    <div class="space-y-8">
      <article v-for="(update, index) in updates" :key="index" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div class="flex items-center">
              <h2 class="text-2xl font-bold text-gray-900">{{ update.title }}</h2>
              <span class="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTypeColor(update.type)">
                {{ getTypeLabel(update.type) }}
              </span>
            </div>
            <div class="mt-2 sm:mt-0 text-sm text-gray-500">
              <span class="font-medium">v{{ update.version }}</span>
              <span class="mx-2">•</span>
              <time :datetime="update.date">{{ new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
            </div>
          </div>
          
          <p class="text-gray-700 mb-4">{{ update.description }}</p>
          
          <div class="mt-4 pt-4 border-t border-gray-100">
            <h3 class="text-sm font-medium text-gray-900 mb-3">What's new:</h3>
            <ul class="space-y-2">
              <li v-for="(item, itemIndex) in update.items" :key="itemIndex" class="flex">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>

    <div class="text-center mt-8">
      <p class="text-sm text-gray-500">
        Subscribe to our newsletter to get updates delivered to your inbox.
      </p>
      <div class="mt-4 flex max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Enter your email" 
          class="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
        <button class="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium">
          Subscribe
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Update {
	version: string;
	date: string;
	title: string;
	description: string;
	type: "added" | "fixed" | "changed" | "deprecated" | "removed";
	items: string[];
}

const updates: Update[] = [
	{
		version: "2.0.0",
		date: "2025-07-10",
		title: "Major Platform Update",
		description:
			"Completely redesigned user interface and improved performance",
		type: "changed",
		items: [
			"Redesigned dashboard with improved navigation",
			"Added dark mode support",
			"Improved mobile responsiveness",
			"Updated all dependencies to their latest versions",
		],
	},
	{
		version: "1.5.2",
		date: "2025-06-25",
		title: "Bug Fixes",
		description: "Fixed several critical bugs and improved stability",
		type: "fixed",
		items: [
			"Fixed issue with form submission",
			"Resolved performance bottlenecks",
			"Fixed mobile menu behavior on iOS devices",
		],
	},
	{
		version: "1.5.0",
		date: "2025-06-15",
		title: "New Features",
		description: "Added several highly requested features",
		type: "added",
		items: [
			"Added export to PDF functionality",
			"Implemented user profile customization",
			"Added keyboard shortcuts for power users",
		],
	},
];

const getTypeColor = (type: string) => {
	const colors = {
		added: "bg-green-100 text-green-800",
		fixed: "bg-blue-100 text-blue-800",
		changed: "bg-yellow-100 text-yellow-800",
		deprecated: "bg-gray-100 text-gray-800",
		removed: "bg-red-100 text-red-800",
	};
	return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getTypeLabel = (type: string) => {
	const labels = {
		added: "Added",
		fixed: "Fixed",
		changed: "Changed",
		deprecated: "Deprecated",
		removed: "Removed",
	};
	return labels[type as keyof typeof labels] || type;
};
</script>
