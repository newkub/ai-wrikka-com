<script setup lang="ts">
import { ref, computed } from 'vue';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  isOpen?: boolean;
}

const props = defineProps<{
  files: FileItem[];
  activeFile?: string;
}>();

const emit = defineEmits(['fileSelect']);

const toggleDirectory = (file: FileItem) => {
  if (file.type === 'directory') {
    file.isOpen = !file.isOpen;
  } else {
    emit('fileSelect', file.name);
  }
};

const fileIcon = (file: FileItem) => {
  if (file.type === 'directory') {
    return file.isOpen ? 'i-heroicons-folder-open' : 'i-heroicons-folder';
  }
  
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
      return 'i-vscode-icons-file-type-js-official';
    case 'ts':
      return 'i-vscode-icons-file-type-typescript-official';
    case 'vue':
      return 'i-vscode-icons-file-type-vue';
    case 'json':
      return 'i-vscode-icons-file-type-json';
    case 'html':
      return 'i-vscode-icons-file-type-html';
    case 'css':
      return 'i-vscode-icons-file-type-css';
    default:
      return 'i-heroicons-document-text';
  }
};

</script>

<template>
  <div class="h-full overflow-y-auto p-2">
    <div class="text-xs font-medium mb-2 px-2">EXPLORER</div>
    <ul class="space-y-1">
      <li v-for="(file, index) in files" :key="index" class="text-sm">
        <div 
          @click="toggleDirectory(file)" 
          class="flex items-center px-2 py-1 rounded hover:bg-block cursor-pointer transition-colors"
          :class="{ 'bg-block': activeFile === file.name }"
        >
          <span class="w-4 h-4 mr-1 flex items-center justify-center">
            <div :class="[fileIcon(file)]"></div>
          </span>
          <span class="truncate">{{ file.name }}</span>
          <span v-if="file.type === 'directory'" class="ml-auto text-xs">
            {{ file.isOpen ? '▼' : '▶' }}
          </span>
        </div>
        <transition name="slide">
          <ul v-if="file.type === 'directory' && file.isOpen && file.children" class="pl-4">
            <FileStructure 
              :files="file.children" 
              :active-file="activeFile"
              @file-select="$emit('fileSelect', $event)"
            />
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
  max-height: 1000px;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
