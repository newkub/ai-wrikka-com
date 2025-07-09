<script setup lang="ts">
import { ref } from "vue";
import Console from "./Console.vue";
import Dependencies from "./Dependencies.vue";
import Git from "./Git.vue";
import Problems from "./Problems.vue";
import Search from "./Search.vue";
import Tasks from "./Tasks.vue";
import Terminal from "./Terminal.vue";

const activeTab = ref("terminal");
const tabs = [
	{ id: "terminal", label: "Terminal", component: Terminal },
	{ id: "problems", label: "Problems", component: Problems },
	{ id: "output", label: "Output", component: Console },
	{ id: "debug-console", label: "Debug Console", component: Console },
	{ id: "git", label: "Git", component: Git },
	{ id: "dependencies", label: "Dependencies", component: Dependencies },
	{ id: "search", label: "Search", component: Search },
	{ id: "tasks", label: "Tasks", component: Tasks },
];

const setActiveTab = (tabId: string) => {
	activeTab.value = tabId;
};
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Tabs -->
    <div class="flex border-b border-gray-200 bg-gray-50">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2"
        :class="{
          'border-blue-500 text-blue-600': activeTab === tab.id,
          'border-transparent text-gray-500 hover:text-gray-700': activeTab !== tab.id
        }"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-auto">
      <component 
        :is="tabs.find(t => t.id === activeTab)?.component" 
        class="h-full"
      />
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for tab content */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* Removed dark mode scrollbar styles */
</style>