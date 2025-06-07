<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { FileItem, ContextMenuPosition } from './types';
import ContextMenu from './ContextMenu.vue';

const props = defineProps<{
  files: FileItem[];
  activeFile?: string;
}>();

const emit = defineEmits<{
  (e: 'fileSelect', fileName: string): void;
  (e: 'fileRename', payload: { file: FileItem, newName: string }): void;
  (e: 'fileDelete', file: FileItem): void;
  (e: 'fileNewFile', parent: FileItem): void;
  (e: 'fileNewFolder', parent: FileItem): void;
}>();

// Context Menu
const contextMenu = ref<ContextMenuPosition | null>(null);
const renamingItem = ref<FileItem | null>(null);

const showContextMenu = (event: MouseEvent, file: FileItem) => {
  event.preventDefault();
  contextMenu.value = {
    x: event.clientX,
    y: event.clientY,
    target: file
  };
};

const closeContextMenu = () => {
  contextMenu.value = null;
};

const handleContextMenuAction = (action: string, file: FileItem) => {
  closeContextMenu();
  
  switch (action) {
    case 'rename':
      startRenaming(file);
      break;
    case 'newFile':
      emit('fileNewFile', file);
      break;
    case 'newFolder':
      emit('fileNewFolder', file);
      break;
    case 'delete':
      if (confirm(`Are you sure you want to delete ${file.name}?`)) {
        emit('fileDelete', file);
      }
      break;
  }
};

const startRenaming = (file: FileItem) => {
  renamingItem.value = file;
  initRenameInput();
};

const handleRename = (newName: string) => {
  if (renamingItem.value) {
    emit('fileRename', { file: renamingItem.value, newName });
    renamingItem.value = null;
  }
};

const cancelRename = () => {
  renamingItem.value = null;
};

// Rename Input Component
const renameInputRef = ref<HTMLInputElement | null>(null);
const newName = ref('');

const initRenameInput = () => {
  if (!renamingItem.value) return;
  
  // Set initial value without extension for files
  newName.value = renamingItem.value.type === 'file' && renamingItem.value.name.includes('.')
    ? renamingItem.value.name.split('.').slice(0, -1).join('.')
    : renamingItem.value.name;
  
  // Focus and select text
  nextTick(() => {
    if (renameInputRef.value) {
      renameInputRef.value.focus();
      renameInputRef.value.select();
    }
  });
};

const handleRenameInputBlur = () => {
  cancelRename();
};

const handleRenameInputKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleRename(newName.value);
  } else if (e.key === 'Escape') {
    cancelRename();
  }
};

const toggleDirectory = (file: FileItem) => {
  if (file.type === 'directory') {
    file.isOpen = !file.isOpen;
  } else {
    emit('fileSelect', file.name);
  }
};

const handleFileSelect = (file: FileItem) => {
  toggleDirectory(file);
};

const getFileIcon = (file: FileItem) => {
  if (file.type === 'directory') {
    return file.isOpen ? 'i-mdi-folder-open' : 'i-mdi-folder';
  }
  
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
      return 'i-mdi-language-javascript text-yellow-400';
    case 'ts':
      return 'i-mdi-language-typescript text-blue-500';
    case 'vue':
      return 'i-mdi-vuejs text-green-500';
    case 'json':
      return 'i-mdi-code-json text-yellow-600';
    case 'html':
      return 'i-mdi-language-html5 text-orange-500';
    case 'css':
      return 'i-mdi-language-css3 text-blue-400';
    case 'md':
      return 'i-mdi-language-markdown text-blue-600';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'i-mdi-image text-purple-500';
    default:
      return 'i-mdi-file-document-outline text-gray-500';
  }
};
</script>

<template>
  <div class="h-full overflow-y-auto p-2 text-sm">
    <ul class="space-y-0.5">
      <li v-for="(file, index) in files" :key="index">
        <!-- Renaming Input -->
        <div v-if="renamingItem === file" class="px-2 py-1.5">
          <input
            ref="renameInputRef"
            v-model="newName"
            type="text"
            class="w-full px-1 py-0.5 text-sm border border-blue-400 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            @blur="handleRenameInputBlur"
            @keydown="handleRenameInputKeydown"
            @click.stop
          />
        </div>
        
        <!-- File/Directory Item -->
        <div 
          v-else
          @click="handleFileSelect(file)"
          @dblclick="toggleDirectory(file)"
          @contextmenu.prevent="showContextMenu($event, file)"
          class="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
          :class="{ 'bg-gray-100 dark:bg-gray-700': activeFile === file.name }"
        >
          <span v-if="file.type === 'directory'" class="text-gray-400 text-xs mr-1">
            <div :class="file.isOpen ? 'i-mdi-chevron-down' : 'i-mdi-chevron-right'" class="w-4 h-4"></div>
          </span>
          <div :class="[getFileIcon(file), 'w-4 h-4 mr-2 flex-shrink-0']"></div>
          <span class="truncate text-gray-800 dark:text-gray-200">{{ file.name }}</span>
        </div>
        
        <!-- Nested Children -->
        <transition name="slide">
          <ul v-if="file.type === 'directory' && file.isOpen && file.children" class="pl-4">
            <FileStructure 
              :files="file.children" 
              :active-file="activeFile"
              @file-select="$emit('fileSelect', $event)"
              @file-rename="(payload) => $emit('fileRename', payload)"
              @file-delete="(file) => $emit('fileDelete', file)"
              @file-new-file="(parent) => $emit('fileNewFile', parent)"
              @file-new-folder="(parent) => $emit('fileNewFolder', parent)"
            />
          </ul>
        </transition>
      </li>
    </ul>

    <!-- Context Menu -->
    <ContextMenu
      :position="contextMenu"
      :is-directory="contextMenu?.target?.type === 'directory'"
      @action="(action) => contextMenu && handleContextMenuAction(action, contextMenu.target)"
      @close="closeContextMenu"
    />
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
