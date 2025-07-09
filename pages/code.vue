<script setup lang="ts">
import { ref } from "vue";
import BottomPanel from "~/components/code/bottom/index.vue";
import CodeEditor from "~/components/code/CodeEditor.vue";
import FileStructure from "~/components/code/FileStructure.vue";

definePageMeta({
	layout: "fullscreen",
});

// File system logic
const {
	activeFile,
	fileStructure,
	handleFileSelect: handleFileSelectOriginal,
} = useFileSystem();

// Code editor state
const code = ref(
	'// Welcome to Code Editor\n// Start coding here...\n\nfunction helloWorld() {\n  console.log("Hello, World!");\n}\n\nhelloWorld();',
);
const chatInput = ref("");
const editorTheme = "vs";

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
	startHorizontalResize,
} = useResize();

// Theme - Using system preference
const isDark = ref(false);
// Note: Dark mode is now handled by CSS variables in uno.config.ts
</script>

<template>
  <div class="h-full flex flex-col bg-background">
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel - File Explorer -->
      <div 
        class="h-full bg-block border-r border-border flex flex-col flex-shrink-0"
        :style="{ width: leftPanelWidth }"
      >
        <!-- File Explorer Header -->
        <div class="p-2 border-b border-border flex justify-between items-center">
          <h2 class="text-sm font-medium text-text">EXPLORER</h2>
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
        class="w-1 bg-block hover:bg-color-primary cursor-col-resize active:bg-color-primary transition-colors flex-shrink-0"
        @mousedown="startVerticalResize"
      ></div>

      <!-- Right Panel -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Editor -->
        <div class="flex-1 overflow-hidden" :style="{ height: editorHeight }">
          <CodeEditor 
            v-model="code"
            :theme="editorTheme"
            :is-dark="isDark"
            @update:modelValue="handleCodeUpdate"
            class="size-full"
          />
        </div>

        <!-- Resize Handle -->
        <div 
          class="resize-handle"
          @mousedown="startHorizontalResize"
        ></div>

        <!-- Bottom Panel -->
        <div class="flex-1 overflow-hidden border-t border-border">
          <BottomPanel class="h-full w-full" />
        </div>
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

/* Using theme colors for scrollbar */
::-webkit-scrollbar-thumb {
  background: var(--border);
}
</style>