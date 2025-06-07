<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Dependency {
  name: string;
  version: string;
  latestVersion?: string;
  type: 'dependency' | 'devDependency' | 'peerDependency';
  outdated?: boolean;
  homepage?: string;
  description?: string;
}

const dependencies = ref<Dependency[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);

const filteredDependencies = computed(() => {
  if (!searchQuery.value) return dependencies.value;
  const query = searchQuery.value.toLowerCase();
  return dependencies.value.filter(dep => 
    dep.name.toLowerCase().includes(query) ||
    dep.description?.toLowerCase().includes(query)
  );
});

const loadDependencies = async () => {
  try {
    isLoading.value = true;
    // In a real app, you would fetch this from your backend or package.json
    // This is a mock implementation
    dependencies.value = [
      { name: 'vue', version: '^3.3.0', latestVersion: '3.4.0', type: 'dependency', description: 'The Progressive JavaScript Framework', homepage: 'https://vuejs.org/' },
      { name: 'vite', version: '^4.0.0', latestVersion: '4.5.0', type: 'devDependency', description: 'Next Generation Frontend Tooling', homepage: 'https://vitejs.dev/' },
      { name: 'pinia', version: '^2.1.0', latestVersion: '2.1.0', type: 'dependency', description: 'Intuitive, type safe, light and flexible Store for Vue', homepage: 'https://pinia.vuejs.org/' },
    ];
  } catch (error) {
    console.error('Failed to load dependencies:', error);
  } finally {
    isLoading.value = false;
  }
};

const updateDependency = async (depName: string, version: string) => {
  // In a real app, this would update the package.json and run npm/yarn/pnpm install
  console.log(`Updating ${depName} to ${version}`);
  // Simulate update
  const dep = dependencies.value.find(d => d.name === depName);
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
  <div class="h-full flex flex-col">
    <!-- Search and Actions -->
    <div class="p-2 border-b border-gray-700 flex items-center gap-2">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search dependencies..."
          class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <i class="i-mdi-magnify absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"></i>
      </div>
      <button 
        class="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
        title="Refresh"
        @click="loadDependencies"
      >
        <i class="i-mdi-refresh" :class="{ 'animate-spin': isLoading }"></i>
      </button>
    </div>

    <!-- Dependencies List -->
    <div class="flex-1 overflow-auto">
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="animate-spin text-blue-400">
          <i class="i-mdi-loading text-2xl"></i>
        </div>
      </div>
      
      <div v-else-if="filteredDependencies.length === 0" class="text-center py-8 text-gray-500">
        <i class="i-mdi-package-variant-remove text-4xl mb-2"></i>
        <p>No dependencies found</p>
      </div>
      
      <div v-else class="divide-y divide-gray-800">
        <div 
          v-for="dep in filteredDependencies" 
          :key="dep.name"
          class="p-3 hover:bg-gray-800/50"
        >
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-medium text-blue-400 truncate">
                  <a 
                    v-if="dep.homepage" 
                    :href="dep.homepage" 
                    target="_blank" 
                    class="hover:underline"
                    @click.stop
                  >
                    {{ dep.name }}
                  </a>
                  <template v-else>{{ dep.name }}</template>
                </h3>
                <span 
                  class="text-xs px-1.5 py-0.5 rounded"
                  :class="{
                    'bg-blue-900/50 text-blue-300': dep.type === 'dependency',
                    'bg-purple-900/50 text-purple-300': dep.type === 'devDependency',
                    'bg-amber-900/50 text-amber-300': dep.type === 'peerDependency'
                  }"
                >
                  {{ dep.type === 'devDependency' ? 'dev' : dep.type === 'peerDependency' ? 'peer' : 'dep' }}
                </span>
              </div>
              
              <p v-if="dep.description" class="text-xs text-gray-400 mt-1 truncate">
                {{ dep.description }}
              </p>
              
              <div class="mt-2 flex items-center gap-2 text-xs">
                <span class="text-gray-500">v{{ dep.version }}</span>
                
                <template v-if="dep.latestVersion && dep.latestVersion !== dep.version">
                  <span class="text-gray-600">→</span>
                  <span class="text-green-400">v{{ dep.latestVersion }}</span>
                  <button 
                    class="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded hover:bg-green-800/50"
                    @click="updateDependency(dep.name, dep.latestVersion!)"
                  >
                    Update
                  </button>
                </template>
              </div>
            </div>
            
            <div class="flex-shrink-0 ml-2">
              <button 
                class="p-1 text-gray-500 hover:text-gray-300"
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
