<script setup lang="ts">
import { ref, computed } from "vue";
import Dependencies from "./Dependencies.vue";
import Git from "./Git.vue";
import Problems from "./Problems.vue";
import Search from "./Search.vue";
import Tasks from "./Tasks.vue";
import Terminal from "./Terminal.vue";

// Get file system data
const { fileStructure, activeFile, handleFileSelect } = useFileSystem();

// Handle file selection
const handleFileSelectWrapper = (fileName: string) => {
	console.log("File selected:", fileName);
	handleFileSelect(fileName);
};

const activeTab = ref("terminal");
const tabs = [
	{ id: "terminal", label: "Terminal", component: Terminal },
	{ id: "problems", label: "Problems", component: Problems },
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
  <div class="h-full flex flex-col bg-background">
    <!-- Tabs -->
    <div class="flex border-b border-border bg-block">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2"
        :class="{
          'border-color-primary text-color-primary': activeTab === tab.id,
          'border-transparent text-text/50 hover:text-text': activeTab !== tab.id
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
  background: var(--border);
  border-radius: 3px;
}

/* Removed dark mode scrollbar styles */
</style>