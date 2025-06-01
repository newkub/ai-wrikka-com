<script lang="ts" setup>
import { ref, computed, onMounted, defineAsyncComponent, type Component } from 'vue';

interface ComponentInfo {
  name: string;
  path: string;
  category: string;
  component: Component;
  description: string;
  props?: Record<string, unknown>;
}

const components = ref<Record<string, ComponentInfo[]>>({});
const activeTab = ref('');
const isLoading = ref(true);

// Auto-import all Vue components
const importAllComponents = async () => {
  const componentFiles = import.meta.glob(['../components/**/*.vue', '!../components/DesignSystem.vue']);
  const componentList: ComponentInfo[] = [];

  for (const path in componentFiles) {
    try {
      // Extract component name from path
      const nameMatch = path.match(/\/([^/]+)\.vue$/) || [];
      if (!nameMatch[1]) continue;
      
      const name = nameMatch[1];
      const relativePath = path.replace('../components/', '');
      
      // Determine category based on directory structure
      let category = 'General';
      const categoryMatch = path.match(/components\/([^/]+)/);
      if (categoryMatch && categoryMatch[1] !== 'components') {
        category = categoryMatch[1].charAt(0).toUpperCase() + categoryMatch[1].slice(1);
      }

      componentList.push({
        name,
        path: relativePath,
        category,
        component: defineAsyncComponent(() => import(/* @vite-ignore */ path)),
        description: `${name} component`,
        props: name.toLowerCase().includes('modal') ? { isOpen: true } : undefined,
      });
    } catch (error) {
      console.error(`Failed to load component at ${path}:`, error);
    }
  }

  // Group components by category
  const grouped = componentList.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentInfo[]>);

  components.value = grouped;
  if (Object.keys(grouped).length > 0) {
    activeTab.value = Object.keys(grouped)[0];
  }
  isLoading.value = false;
};

onMounted(() => {
  importAllComponents();
});

const sortedCategories = computed(() => {
  return Object.keys(components.value).sort();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Design System</h1>
        <div v-if="isLoading" class="flex items-center text-gray-500">
          <div class="i-mdi-loading animate-spin mr-2"></div>
          Loading components...
        </div>
      </div>
      
      <!-- Tabs -->
      <div v-if="!isLoading" class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            v-for="category in sortedCategories"
            :key="category"
            @click="activeTab = category"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="[
              activeTab === category
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ category }} ({{ components[category]?.length || 0 }})
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="i-mdi-loading animate-spin text-4xl text-gray-400 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading components...</p>
      </div>

      <!-- Components Grid -->
      <template v-else>
        <div 
          v-for="category in sortedCategories" 
          :key="category" 
          v-show="activeTab === category"
          class="animate-fade-in"
        >
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">
            {{ category }}
            <span class="text-sm font-normal text-gray-500 ml-2">{{ components[category]?.length }} components</span>
          </h2>
          
          <div v-if="!components[category]?.length" class="text-center py-8 text-gray-500">
            No components found in this category.
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div 
              v-for="(component, index) in components[category]" 
              :key="`${category}-${component.name}-${index}`"
              class="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                  {{ component.name }}
                  <span 
                    v-if="component.path.includes('/')" 
                    class="ml-2 text-xs font-normal text-gray-400"
                    :title="component.path"
                  >
                    {{ component.path }}
                  </span>
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ component.description }}</p>
              </div>
              <div class="p-4 bg-gray-50 min-h-32 flex items-center justify-center">
                <component 
                  :is="component.component" 
                  v-bind="component.props || {}" 
                  class="w-full"
                />
              </div>
              <div class="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <span class="text-xs text-gray-500">
                  {{ component.path }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ component.name }}.vue
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>