<script setup lang="ts">
import ModalFileUpload from "./ModalFileUpload.vue";

const isOpen = ref<boolean>(false);
const emit = defineEmits<{
	upload: (files: File[]) => void;
}>();

function openModal() {
	isOpen.value = true;
}

function handleUpload(files: File[]) {
	emit("upload", files);
	isOpen.value = false;
}
</script>

<template>
  <div>
    <!-- Upload Button -->
    <button
      type="button"
      @click="openModal"
      class="p-2 rounded-full text-text/60 hover:text-text hover:bg-surface transition-colors"
    >
      <div class="i-mdi-paperclip text-lg" />
    </button>

    <ModalFileUpload 
      :modelValue="isOpen"
      @update:modelValue="(v) => isOpen = v"
      @upload="handleUpload"
    />
  </div>
</template>
