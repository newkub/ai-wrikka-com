<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { FileItem, ContextMenuPosition } from "./types";

const props = defineProps<{
	position: ContextMenuPosition | null;
	isDirectory: boolean;
}>();

const emit = defineEmits<{
	(e: "action", action: string, file: FileItem): void;
	(e: "close"): void;
}>();

const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
	if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
		emit("close");
	}
};

const handleAction = (action: string) => {
	if (props.position) {
		emit("action", action, props.position.target);
	}
	emit("close");
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
	document.addEventListener("contextmenu", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
	document.removeEventListener("contextmenu", handleClickOutside);
});
</script>

<template>
  <transition
    enter-active-class="transition-opacity duration-100"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="position" 
      ref="menuRef"
      class="fixed z-50 bg-block shadow-xl rounded-md py-1 w-48 border border-border text-sm"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
      @contextmenu.stop
    >
      <button 
        v-if="isDirectory"
        @click="handleAction('newFile')"
        class="w-full text-left px-4 py-2 text-text hover:bg-block-hover flex items-center"
      >
        <div class="i-mdi-file-document-outline mr-2 w-4 h-4"></div>
        New File
      </button>
      <button 
        v-if="isDirectory"
        @click="handleAction('newFolder')"
        class="w-full text-left px-4 py-2 text-text hover:bg-block-hover flex items-center"
      >
        <div class="i-mdi-folder-plus-outline mr-2 w-4 h-4"></div>
        New Folder
      </button>
      <div v-if="isDirectory" class="border-t border-border my-1"></div>
      <button 
        @click="handleAction('rename')"
        class="w-full text-left px-4 py-2 text-text hover:bg-block-hover flex items-center"
      >
        <div class="i-mdi-pencil-outline mr-2 w-4 h-4"></div>
        Rename
      </button>
      <button 
        @click="handleAction('delete')"
        class="w-full text-left px-4 py-2 text-color-error hover:bg-error/10 flex items-center"
      >
        <div class="i-mdi-delete-outline mr-2 w-4 h-4"></div>
        Delete
      </button>
    </div>
  </transition>
</template>
