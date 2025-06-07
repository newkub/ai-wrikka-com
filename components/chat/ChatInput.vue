<template>
  <div class="fixed bottom-0 left-0 right-0 bg-block p-4 border-t border-border">
    <div class="max-w-3xl mx-auto">
      <!-- Selected Files Preview -->
      <div v-if="selectedFiles.length > 0" class="mb-2 flex flex-wrap gap-2">
        <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center bg-primary/5 rounded-lg px-3 py-2 text-sm">
          <div :class="getFileIcon(file)" class="w-4 h-4 mr-2"></div>
          <span class="truncate max-w-xs">{{ file.name }}</span>
          <button @click="removeFile(index)" class="ml-2 text-gray-500 hover:text-gray-700">
            <div class="i-mdi-close w-4 h-4"></div>
          </button>
        </div>
      </div>
      
      <div class="relative">
        <!-- File Upload Button -->
        <button
          @click="showFileUpload = true"
          class="absolute left-3 bottom-3 p-1 rounded-full text-gray-500 hover:bg-gray-100"
          title="อัปโหลดไฟล์"
        >
          <div class="i-mdi-paperclip w-6 h-6"></div>
        </button>
        
        <textarea
          v-model="inputValue"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.enter.shift.exact="handleShiftEnter"
          :disabled="isLoading"
          :placeholder="placeholder"
          class="w-full p-3 pl-12 pr-24 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows="1"
          ref="textareaRef"
        ></textarea>
        
        <button
          @click="handleSend"
          :disabled="(!inputValue.trim() && selectedFiles.length === 0) || isLoading"
          class="absolute right-3 bottom-3 p-1 rounded-full text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'animate-spin': isLoading }"
        >
          <div v-if="isLoading" class="i-mdi-loading w-6 h-6"></div>
          <div v-else class="i-mdi-send w-6 h-6"></div>
        </button>
      </div>
      <p class="mt-2 text-xs text-gray-500 text-center">
        กด Enter เพื่อส่ง, Shift + Enter สำหรับขึ้นบรรทัดใหม่
      </p>
    </div>

    <!-- File Upload Modal -->
    <div v-if="showFileUpload" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showFileUpload = false">
      <FileUpload 
        @close="showFileUpload = false" 
        @upload="handleFilesUploaded"
        class="z-10"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import FileUpload from "~/components/common/FileUpload.vue";

type FileWithPreview = File & { preview?: string }; // For future use if we want to show image previews

const props = defineProps<{
	modelValue: string;
	isLoading?: boolean;
	placeholder?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "send"): void;
	(e: "files", files: File[]): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const inputValue = ref(props.modelValue);
const showFileUpload = ref(false);
const selectedFiles = ref<File[]>([]);

// Update local value when prop changes
watch(
	() => props.modelValue,
	(newValue) => {
		inputValue.value = newValue;
	},
);

// Emit update when input changes
watch(inputValue, (newValue) => {
	emit("update:modelValue", newValue);
	adjustTextareaHeight();
});

// Auto-resize textarea
const adjustTextareaHeight = () => {
	if (textareaRef.value) {
		textareaRef.value.style.height = "auto";
		textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
	}
};

// Handle send message
const handleSend = () => {
	if (
		(!inputValue.value.trim() && selectedFiles.value.length === 0) ||
		props.isLoading
	)
		return;

	// Emit send event with files if any
	if (selectedFiles.value.length > 0) {
		emit("files", [...selectedFiles.value]);
		selectedFiles.value = [];
	}

	if (inputValue.value.trim()) {
		emit("send");
	}
};

// Handle files uploaded from the modal
const handleFilesUploaded = (files: File[]) => {
	selectedFiles.value = [...selectedFiles.value, ...files];
	showFileUpload.value = false;
};

// Remove a file from the selected files
const removeFile = (index: number) => {
	selectedFiles.value.splice(index, 1);
};

// Get icon for file type
const getFileIcon = (file: File) => {
	const extension = file.name.split(".").pop()?.toLowerCase();
	const fileTypes: Record<string, string> = {
		pdf: "i-mdi-file-pdf",
		doc: "i-mdi-file-word",
		docx: "i-mdi-file-word",
		xls: "i-mdi-file-excel",
		xlsx: "i-mdi-file-excel",
		ppt: "i-mdi-file-powerpoint",
		pptx: "i-mdi-file-powerpoint",
		jpg: "i-mdi-file-image",
		jpeg: "i-mdi-file-image",
		png: "i-mdi-file-image",
		gif: "i-mdi-file-image",
		zip: "i-mdi-folder-zip",
		rar: "i-mdi-folder-zip",
		txt: "i-mdi-file-document",
		js: "i-mdi-language-javascript",
		ts: "i-mdi-language-typescript",
		vue: "i-mdi-vuejs",
		html: "i-mdi-language-html5",
		css: "i-mdi-language-css3",
	};
	return fileTypes[extension || ""] || "i-mdi-file";
};

// Handle Shift+Enter for new line
const handleShiftEnter = () => {
	inputValue.value += "\n";
	nextTick(adjustTextareaHeight);
};

// Focus the input when component is mounted
onMounted(() => {
	if (textareaRef.value) {
		textareaRef.value.focus();
	}
});
</script>
