<template>
  <div class="file-upload">
    <div class="file-upload-header">
      <h3>อัปโหลดไฟล์</h3>
      <button @click="$emit('close')" class="close-button">
        <div class="i-mdi-close w-5 h-5"></div>
      </button>
    </div>
    
    <div class="file-sources">
      <div class="source-option" @click="openFilePicker">
        <div class="source-icon">
          <div class="i-mdi-laptop w-8 h-8"></div>
        </div>
        <span>คอมพิวเตอร์ของฉัน</span>
      </div>
      
      <div class="source-option" @click="connectService('github')">
        <div class="source-icon">
          <div class="i-mdi-github w-8 h-8"></div>
        </div>
        <span>GitHub</span>
      </div>
      
      <div class="source-option" @click="connectService('google-drive')">
        <div class="source-icon">
          <div class="i-mdi-google-drive w-8 h-8"></div>
        </div>
        <span>Google Drive</span>
      </div>
    </div>
    
    <div class="file-preview" v-if="files.length > 0">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <div class="file-icon">
          <div :class="getFileIcon(file)" class="w-5 h-5"></div>
        </div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>
        <button @click="removeFile(index)" class="remove-file">
          <div class="i-mdi-close w-4 h-4"></div>
        </button>
      </div>
    </div>
    
    <div class="file-upload-actions">
      <button @click="$emit('close')" class="cancel-button">ยกเลิก</button>
      <button @click="submitFiles" :disabled="files.length === 0" class="submit-button">
        เพิ่มไฟล์
      </button>
    </div>
    
    <input 
      type="file" 
      ref="fileInput" 
      @change="handleFileSelect" 
      multiple 
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "upload", files: File[]): void;
	(e: "close"): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

const openFilePicker = () => {
	if (fileInput.value) {
		fileInput.value.click();
	}
};

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files.length > 0) {
		files.value = Array.from(target.files);
	}
};

const removeFile = (index: number) => {
	files.value.splice(index, 1);
};

const connectService = (service: string) => {
	// TODO: Implement service connection
	console.log(`Connect to ${service}`);
};

const submitFiles = () => {
	if (files.value.length > 0) {
		emit("upload", files.value);
		files.value = [];
		emit("close");
	}
};

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

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
</script>

<style scoped lang="postcss">
.file-upload {
  @apply bg-block rounded-lg shadow-lg w-full max-w-[28rem] max-h-[80vh] flex flex-col;
}

.file-upload-header {
  @apply flex justify-between items-center p-4 border-b border-border;
}

.file-sources {
  @apply grid grid-cols-3 gap-4 p-4;
}

.source-option {
  @apply flex flex-col items-center p-4 rounded-lg border border-border cursor-pointer
         transition-all duration-150 ease-in-out text-center;
}

.source-option:hover {
  @apply bg-primary/5;
}

.source-icon {
  @apply w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2;
}

.file-preview {
  @apply flex-1 overflow-y-auto p-4 border-t border-border;
}

.file-item {
  @apply flex items-center p-2 rounded-md bg-block mb-2;
}

.file-icon {
  margin-right: 0.75rem;
  color: #6b7280;
}

.file-info {
  @apply flex-1 min-w-0;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  @apply text-xs text-text-secondary;
}

.remove-file {
  color: #9ca3af;
  margin-left: 0.5rem;
}

.remove-file:hover {
  color: #374151;
}

.file-upload-actions {
  @apply flex justify-end gap-3 p-4 border-t border-border;
}

.cancel-button {
  @apply px-4 py-2 rounded-md font-medium text-text bg-transparent border border-border
         transition-all duration-150 ease-in-out hover:bg-bg-hover;
}

.submit-button {
  @apply px-4 py-2 rounded-md font-medium text-white bg-primary border border-primary
         transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
         hover:bg-primary-dark hover:border-primary-dark;
}

.close-button {
  padding: 0.25rem;
  border-radius: 9999px;
}

.close-button:hover {
  background-color: #f3f4f6;
}
</style>
