<script setup lang="ts">
definePageMeta({
  layout: 'fullscreen'
});

import { ref } from 'vue';
import CodeEditor from '~/components/code/CodeEditor.vue';
import FileStructure from '~/components/code/FileStructure.vue';
import BottomPanel from '~/components/code/bottom/index.vue';

// File system logic
const { 
  activeFile, 
  fileStructure, 
  handleFileSelect: handleFileSelectOriginal 
} = useFileSystem();

// Code editor state
const code = ref('// Welcome to Code Editor\n// Start coding here...\n\nfunction helloWorld() {\n  console.log("Hello, World!");\n}\n\nhelloWorld();');
const editorTheme = 'vs';

// Handle file selection with code update
const handleFileSelect = (fileName: string) => {
  const fileContent = handleFileSelectOriginal(fileName);
  if (fileContent) {
    code.value = fileContent;
  }
};

// Handle code changes
const handleCodeUpdate = (newCode: string) => {
  code.value = newCode;
};

// Resize logic
const { 
  leftPanelWidth,
  editorHeight,
  startVerticalResize,
  startHorizontalResize 
} = useResize();

// Theme
const isDark = ref(false);
</script>

<template>
  <div class="flex h-full w-full overflow-hidden bg-white dark:bg-gray-900">
    <!-- Left Panel - File Explorer -->
    <div 
      class="h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      :style="{ width: leftPanelWidth }"
    >
      <!-- File Explorer Header -->
      <div class="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">EXPLORER</h2>
      </div>
      
      <!-- File Structure -->
      <div class="flex-1 overflow-y-auto">
        <FileStructure 
          :files="fileStructure" 
          :active-file="activeFile"
          @select-file="handleFileSelect"
        />
      </div>
    </div>

    <!-- Resize Handle -->
    <div 
      class="w-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 cursor-col-resize active:bg-blue-600 transition-colors"
      @mousedown="startVerticalResize"
    ></div>

    <!-- Right Panel -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Editor -->
      <div 
        class="flex-1 overflow-hidden"
        :style="{ height: editorHeight }"
      >
        <CodeEditor 
          v-model="code"
          :theme="editorTheme"
          :is-dark="isDark"
          @update:modelValue="handleCodeUpdate"
          class="h-full w-full"
        />
      </div>

      <!-- Resize Handle -->
      <div 
        class="h-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 cursor-row-resize active:bg-blue-600 transition-colors"
        @mousedown="startHorizontalResize"
      ></div>

      <!-- Bottom Panel -->
      <div class="h-1/3 min-h-[100px] max-h-[50%] overflow-hidden border-t border-gray-200 dark:border-gray-700">
        <BottomPanel class="h-full" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for file explorer */
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

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>