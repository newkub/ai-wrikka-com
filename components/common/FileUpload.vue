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
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'upload', files: File[]): void;
  (e: 'close'): void;
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
    emit('upload', files.value);
    files.value = [];
    emit('close');
  }
};

const getFileIcon = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const fileTypes: Record<string, string> = {
    'pdf': 'i-mdi-file-pdf',
    'doc': 'i-mdi-file-word',
    'docx': 'i-mdi-file-word',
    'xls': 'i-mdi-file-excel',
    'xlsx': 'i-mdi-file-excel',
    'ppt': 'i-mdi-file-powerpoint',
    'pptx': 'i-mdi-file-powerpoint',
    'jpg': 'i-mdi-file-image',
    'jpeg': 'i-mdi-file-image',
    'png': 'i-mdi-file-image',
    'gif': 'i-mdi-file-image',
    'zip': 'i-mdi-folder-zip',
    'rar': 'i-mdi-folder-zip',
    'txt': 'i-mdi-file-document',
    'js': 'i-mdi-language-javascript',
    'ts': 'i-mdi-language-typescript',
    'vue': 'i-mdi-vuejs',
    'html': 'i-mdi-language-html5',
    'css': 'i-mdi-language-css3',
  };
  return fileTypes[extension || ''] || 'i-mdi-file';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
};
</script>

<style scoped>
.file-upload {
  background-color: var(--color-block);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 28rem;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.file-upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.file-sources {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.source-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  text-align: center;
}

.source-option:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
}

.source-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.file-preview {
  flex: 1 1 0%;
  overflow-y: auto;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.file-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.file-item:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
}

.file-icon {
  margin-right: 0.75rem;
  color: #6b7280;
}

.file-info {
  flex: 1 1 0%;
  min-width: 0;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.75rem;
  line-height: 1rem;
  color: #6b7280;
}

.remove-file {
  color: #9ca3af;
  margin-left: 0.5rem;
}

.remove-file:hover {
  color: #374151;
}

.file-upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.cancel-button:hover {
  background-color: #f3f4f6;
}

.submit-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary);
  color: white;
}

.submit-button:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-primary) 90%, black);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-button {
  padding: 0.25rem;
  border-radius: 9999px;
}

.close-button:hover {
  background-color: #f3f4f6;
}
</style>
