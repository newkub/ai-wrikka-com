<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Dependency {
	name: string;
	version: string;
	latestVersion?: string;
	type: "dependency" | "devDependency" | "peerDependency";
	outdated?: boolean;
	homepage?: string;
	description?: string;
}

const dependencies = ref<Dependency[]>([]);
const searchQuery = ref("");
const isLoading = ref(false);

const filteredDependencies = computed(() => {
	if (!searchQuery.value) return dependencies.value;
	const query = searchQuery.value.toLowerCase();
	return dependencies.value.filter(
		(dep) =>
			dep.name.toLowerCase().includes(query) ||
			dep.description?.toLowerCase().includes(query),
	);
});

const loadDependencies = async () => {
	try {
		isLoading.value = true;
		// In a real app, you would fetch this from your backend or package.json
		// This is a mock implementation
		dependencies.value = [
			{
				name: "vue",
				version: "^3.3.0",
				latestVersion: "3.4.0",
				type: "dependency",
				description: "The Progressive JavaScript Framework",
				homepage: "https://vuejs.org/",
			},
			{
				name: "vite",
				version: "^4.0.0",
				latestVersion: "4.5.0",
				type: "devDependency",
				description: "Next Generation Frontend Tooling",
				homepage: "https://vitejs.dev/",
			},
			{
				name: "pinia",
				version: "^2.1.0",
				latestVersion: "2.1.0",
				type: "dependency",
				description: "Intuitive, type safe, light and flexible Store for Vue",
				homepage: "https://pinia.vuejs.org/",
			},
		];
	} catch (error) {
		console.error("Failed to load dependencies:", error);
	} finally {
		isLoading.value = false;
	}
};

const updateDependency = async (depName: string, version: string) => {
	// In a real app, this would update the package.json and run npm/yarn/pnpm install
	console.log(`Updating ${depName} to ${version}`);
	// Simulate update
	const dep = dependencies.value.find((d) => d.name === depName);
	if (dep) {
		dep.version = version;
		dep.outdated = false;
	}
};

onMounted(() => {
	loadDependencies();
});
</script>

<template>
  <div class="h-full flex flex-col bg-block">
    <!-- Search and Actions -->
    <div class="p-2 border-b border-border flex items-center gap-2">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search dependencies..."
          class="w-full bg-block border border-border rounded px-3 py-1.5 text-sm text-text placeholder-text/50 focus:outline-none focus:ring-1 focus:ring-color-primary focus:border-color-primary"
        />
        <i class="i-mdi-magnify absolute right-2 top-1/2 -translate-y-1/2 text-text/50"></i>
      </div>
      <button 
        class="p-1.5 text-text/50 hover:text-text hover:bg-bg-hover rounded"
        title="Refresh"
        @click="loadDependencies"
      >
        <i class="i-mdi-refresh" :class="{ 'animate-spin': isLoading }"></i>
      </button>
    </div>

    <!-- Dependencies List -->
    <div class="flex-1 overflow-auto">
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="animate-spin text-color-primary">
          <i class="i-mdi-loading text-2xl"></i>
        </div>
      </div>
      
      <div v-else-if="filteredDependencies.length === 0" class="text-center py-8 text-text/50">
        <i class="i-mdi-package-variant-remove text-4xl mb-2"></i>
        <p>No dependencies found</p>
      </div>
      
      <div v-else class="divide-y divide-border">
        <div 
          v-for="dep in filteredDependencies" 
          :key="dep.name"
          class="p-3 hover:bg-bg-hover"
        >
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-medium text-color-primary truncate">
                  {{ dep.name }}
                </h3>
                <span 
                  class="text-xs px-1.5 py-0.5 rounded"
                  :class="{
                    'bg-color-primary/10 text-color-primary': dep.type === 'dependency',
                    'bg-color-secondary/10 text-color-secondary': dep.type === 'devDependency',
                    'bg-color-alert/10 text-color-alert': dep.type === 'peerDependency'
                  }"
                >
                  {{ dep.type === 'devDependency' ? 'dev' : dep.type === 'peerDependency' ? 'peer' : 'dep' }}
                </span>
              </div>
              
              <p v-if="dep.description" class="text-xs text-text/70 mt-1 truncate">
                {{ dep.description }}
              </p>
              
              <div class="mt-2 flex items-center gap-2 text-xs">
                <span class="text-text/50">v{{ dep.version }}</span>
                
                <template v-if="dep.latestVersion && dep.latestVersion !== dep.version">
                  <span class="text-text/30">→</span>
                  <span class="text-color-success">v{{ dep.latestVersion }}</span>
                  <button 
                    class="text-xs bg-color-success/10 text-color-success px-1.5 py-0.5 rounded hover:bg-color-success/20"
                    @click="updateDependency(dep.name, dep.latestVersion!)"
                  >
                    Update
                  </button>
                </template>
              </div>
            </div>
            
            <div class="flex-shrink-0 ml-2">
              <button 
                class="p-1 text-text/50 hover:text-text"
                title="View details"
              >
                <i class="i-mdi-dots-vertical"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
