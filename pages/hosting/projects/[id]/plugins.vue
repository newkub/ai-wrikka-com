<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock plugins data
const plugins = [
	{
		id: "1",
		name: "Analytics",
		description: "Track your website traffic and user behavior",
		icon: "i-mdi-chart-line",
		enabled: true,
		category: "Analytics",
	},
	{
		id: "2",
		name: "SEO",
		description: "Improve your search engine rankings",
		icon: "i-mdi-magnify",
		enabled: true,
		category: "Marketing",
	},
	{
		id: "3",
		name: "Contact Form",
		description: "Add a contact form to your website",
		icon: "i-mdi-email-outline",
		enabled: false,
		category: "Forms",
	},
	{
		id: "4",
		name: "Comments",
		description: "Add comments to your blog posts",
		icon: "i-mdi-comment-outline",
		enabled: false,
		category: "Social",
	},
	{
		id: "5",
		name: "Newsletter",
		description: "Collect email subscribers",
		icon: "i-mdi-email-newsletter",
		enabled: false,
		category: "Marketing",
	},
	{
		id: "6",
		name: "Backup",
		description: "Automated backups for your website",
		icon: "i-mdi-backup-restore",
		enabled: false,
		category: "Utilities",
	},
];

const enabledPlugins = computed(() =>
	plugins.filter((plugin) => plugin.enabled),
);
const availablePlugins = computed(() =>
	plugins.filter((plugin) => !plugin.enabled),
);

const togglePlugin = (pluginId: string) => {
	const plugin = plugins.find((p) => p.id === pluginId);
	if (plugin) {
		plugin.enabled = !plugin.enabled;
	}
};

const categories = [...new Set(plugins.map((plugin) => plugin.category))];
const selectedCategory = ref("All");

const filteredPlugins = computed(() => {
	if (selectedCategory.value === "All") return availablePlugins.value;
	return availablePlugins.value.filter(
		(plugin) => plugin.category === selectedCategory.value,
	);
});
</script>

<template>
    <div class="space-y-8">
      <!-- Enabled Plugins -->
      <div v-if="enabledPlugins.length > 0">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Enabled Plugins</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="plugin in enabledPlugins" 
            :key="plugin.id"
            class="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-start"
          >
            <div class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center" :class="'bg-indigo-100 text-indigo-600'">
              <span :class="[plugin.icon, 'h-6 w-6']" aria-hidden="true" />
            </div>
            <div class="ml-4 flex-1">
              <h4 class="text-sm font-medium text-gray-900">{{ plugin.name }}</h4>
              <p class="mt-1 text-sm text-gray-500">{{ plugin.description }}</p>
              <div class="mt-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ plugin.category }}
                </span>
              </div>
            </div>
            <div class="ml-4">
              <button 
                @click="togglePlugin(plugin.id)"
                type="button"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Plugins -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Available Plugins</h3>
          <div class="flex items-center">
            <label for="category" class="mr-2 text-sm text-gray-600">Filter by category:</label>
            <select 
              id="category" 
              v-model="selectedCategory"
              class="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>All</option>
              <option v-for="category in categories" :key="category">{{ category }}</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="plugin in filteredPlugins" 
            :key="plugin.id"
            class="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-start"
          >
            <div class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center" :class="'bg-gray-100 text-gray-600'">
              <span :class="[plugin.icon, 'h-6 w-6']" aria-hidden="true" />
            </div>
            <div class="ml-4 flex-1">
              <h4 class="text-sm font-medium text-gray-900">{{ plugin.name }}</h4>
              <p class="mt-1 text-sm text-gray-500">{{ plugin.description }}</p>
              <div class="mt-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ plugin.category }}
                </span>
              </div>
            </div>
            <div class="ml-4">
              <button 
                @click="togglePlugin(plugin.id)"
                type="button"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
