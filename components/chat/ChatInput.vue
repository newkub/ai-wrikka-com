<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface FileWithPreview extends File {
  preview: string;
}

interface Model {
  id: string;
  name: string;
}

interface Mode {
  id: string;
  name: string;
}

const props = defineProps({
  availableModels: {
    type: Array as () => Model[],
    required: true,
    default: () => []
  },
  availableModes: {
    type: Array as () => Mode[],
    required: true,
    default: () => []
  },
  selectedModel: {
    type: String,
    required: true
  },
  selectedMode: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Type your message...'
  },
  rows: {
    type: Number,
    default: 1
  },
  maxLength: {
    type: Number,
    default: 4000
  },
  showCharacterCount: {
    type: Boolean,
    default: false
  },
  showHelperText: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:selectedModel', 'update:selectedMode', 'send', 'file-select']);

const files = ref<FileWithPreview[]>([]);
const inputValue = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);

const canSend = computed(() => {
  return inputValue.value.trim().length > 0 || files.value.length > 0;
});

const openFileModal = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const fileArray = Array.from(target.files);
    for (const file of fileArray) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileWithPreview = Object.assign(file, {
          preview: e.target?.result as string
        });
        files.value.push(fileWithPreview);
      };
      reader.readAsDataURL(file);
    }
    emit('file-select', fileArray);
    target.value = '';
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileWithPreview = Object.assign(file, {
            preview: e.target?.result as string
          });
          files.value.push(fileWithPreview);
          emit('file-select', [file]);
        };
        reader.readAsDataURL(file);
      }
    }
  }
};

const handleSend = () => {
  if (!canSend.value) return;
  
  emit('send', {
    text: inputValue.value,
    files: files.value
  });
  
  inputValue.value = '';
  files.value = [];
};

// Expose methods if needed
const focus = () => {
  messageInput.value?.focus();
};

defineExpose({
  focus
});
</script>

<template>
  <div class="border-t border-gray-200 bg-white p-4">
    <div class="max-w-3xl mx-auto">
      <!-- File preview -->
      <div v-if="files.length > 0" class="flex flex-wrap gap-2 mb-3">
        <div v-for="(file, index) in files" :key="index" class="relative group">
          <img :src="file.preview" class="h-16 w-16 object-cover rounded-lg border border-gray-200" />
          <button 
            @click="removeFile(index)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <div class="i-mdi-close h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div class="relative rounded-lg border border-gray-200 bg-white shadow-sm">
        <!-- Model and Mode Selectors -->
        <div class="flex border-b border-gray-100">
          <div class="relative flex-1 border-r border-gray-100">
            <select 
              :value="selectedModel"
              @change="$emit('update:selectedModel', ($event.target as HTMLSelectElement).value)"
              class="w-full bg-transparent px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-0 border-0 focus:border-blue-500"
            >
              <option v-for="model in availableModels" :key="model.id" :value="model.id">
                {{ model.name }}
              </option>
            </select>
          </div>
          <div class="relative flex-1">
            <select 
              :value="selectedMode"
              @change="$emit('update:selectedMode', ($event.target as HTMLSelectElement).value)"
              class="w-full bg-transparent px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-0 border-0 focus:border-blue-500"
            >
              <option v-for="mode in availableModes" :key="mode.id" :value="mode.id">
                {{ mode.name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Text Input Area -->
        <div class="relative">
          <div class="absolute left-3 top-3">
            <button 
              type="button"
              @click="openFileModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              title="Attach file"
              aria-label="Attach file"
            >
              <div class="i-mdi-paperclip h-5 w-5" />
            </button>
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              multiple 
              @change="handleFileSelect"
              accept="image/*"
            />
          </div>
          
          <textarea
            ref="messageInput"
            v-model="inputValue"
            @paste="handlePaste"
            @keydown.enter.exact.prevent="handleSend"
            @keydown.enter.shift.exact.prevent="inputValue += '\n'"
            :placeholder="placeholder || 'Type your message...'"
            :rows="rows || 1"
            class="w-full px-4 py-3 pl-12 pr-20 text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none min-h-[60px] max-h-40"
            style="min-height: 60px"
          ></textarea>
          
          <div class="absolute right-3 bottom-3 flex items-center space-x-2">
            <span v-if="showCharacterCount" class="text-xs text-gray-400">
              {{ inputValue.length }}/{{ maxLength || 4000 }}
            </span>
            <button
              type="button"
              @click="handleSend"
              :disabled="!canSend"
              :class="[
                'flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors',
                canSend 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-300 cursor-not-allowed'
              ]"
              aria-label="Send message"
            >
              <slot name="send-icon">
                <div class="i-mdi-send h-4 w-4" />
              </slot>
            </button>
          </div>
        </div>
        
        <!-- Character Counter -->
        <div v-if="showHelperText" class="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <slot name="helper-text-left">
              <span>Shift + Enter for new line</span>
            </slot>
            <slot name="helper-text-right">
              <span>Press Enter to send</span>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>