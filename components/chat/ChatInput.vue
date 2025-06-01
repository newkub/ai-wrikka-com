<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import Dropdown from '~/components/Dropdown.vue';
import Button from '~/components/Button.vue';
import ButtonFileUpload from '~/components/chat/ButtonFileUpload.vue';

type TabType = 'computer' | 'url';

interface FileWithPreview extends File {
  preview: string;
}

interface Model {
  id: string;
  name: string;
  icon: string;
}

interface Mode {
  id: string;
  name: string;
  icon: string;
}

const defaultModels: Model[] = [
  { id: "gpt-4", name: "GPT-4", icon: "i-mdi-robot-outline" },
  { id: "gpt-3.5", name: "GPT-3.5", icon: "i-mdi-robot" },
  { id: "claude-2", name: "Claude 2", icon: "i-mdi-account-circle-outline" },
];

const defaultModes: Mode[] = [
  { id: "think", name: "Think", icon: "i-mdi-brain" },
  { id: "search", name: "Search", icon: "i-mdi-magnify" },
];

interface ChatInputProps {
  availableModels?: Model[];
  availableModes?: Mode[];
  selectedModel: string;
  selectedMode: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  showHelperText?: boolean;
}

interface ChatInputEmits {
  (e: 'update:selectedModel', value: string): void;
  (e: 'update:selectedMode', value: string): void;
  (e: 'send', payload: { text: string; files: FileWithPreview[] }): void;
  (e: 'file-select', files: File[]): void;
}

const activeTab = ref("computer");
const showFileModal = ref(false);
const isModelDropdownOpen = ref(false);

const openFileModal = () => {
	showFileModal.value = true;
};

const closeFileModal = () => {
	showFileModal.value = false;
};

const selectTab = (tab: string) => {
	activeTab.value = tab;
};

const props = defineProps<ChatInputProps>();

const emit = defineEmits([
	"update:selectedModel",
	"update:selectedMode",
	"send",
	"file-select",
]);

const files = ref<FileWithPreview[]>([]);
const inputValue = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);

// Auto-resize textarea
const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
};

const canSend = computed(() => {
	return inputValue.value.trim().length > 0 || files.value.length > 0;
});

const triggerFileInput = () => {
	fileInput.value?.click();
	closeFileModal();
};

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files.length > 0) {
		const fileArray = Array.from(target.files);
		for (const file of fileArray) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const fileWithPreview = Object.assign(file, {
					preview: e.target?.result as string,
				});
				files.value.push(fileWithPreview);
			};
			reader.readAsDataURL(file);
		}
		emit("file-select", fileArray);
		target.value = "";
	}
};

const removeFile = (index: number) => {
	files.value.splice(index, 1);
};

const handlePaste = (event: ClipboardEvent) => {
	const items = event.clipboardData?.items;
	if (!items) return;

	for (let i = 0; i < items.length; i++) {
		if (items[i].type.indexOf("image") !== -1) {
			const file = items[i].getAsFile();
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const fileWithPreview = Object.assign(file, {
						preview: e.target?.result as string,
					});
					files.value.push(fileWithPreview);
					emit("file-select", [file]);
				};
				reader.readAsDataURL(file);
			}
		}
	}
};

const handleSend = () => {
	if (!canSend.value) return;

	emit("send", {
		text: inputValue.value,
		files: files.value,
	});

	inputValue.value = "";
	files.value = [];
};

const handleFileUpload = (files: File[]) => {
  // Handle the uploaded files here
  console.log('Files uploaded:', files)
};

// Expose methods if needed
const focus = () => {
	messageInput.value?.focus();
};

defineExpose({
	focus,
});
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
    <div class="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
    <div class="relative flex items-center">
      <!-- File preview -->
      <div v-if="files.length > 0" class="absolute -top-20 left-0 right-0 flex gap-2 overflow-x-auto pb-2 px-4">
        <div v-for="(file, index) in files" :key="index" class="relative group">
          <img :src="file.preview" class="h-16 w-16 object-cover rounded-lg border border-gray-200" />
          <button 
            @click.stop="removeFile(index)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <div class="i-mdi-close h-3 w-3" />
          </button>
        </div>
      </div>

      <div class="relative w-full">
        <div class="relative flex items-center">
          <ButtonFileUpload 
            @upload="handleFileUpload"
            class="text-gray-500 hover:text-gray-700 mr-2"
          />
          
          <div class="relative flex-1">
            <div v-if="!inputValue" class="absolute inset-0 flex items-center pointer-events-none">
              <span class="text-gray-400 pl-3 text-sm">
                {{ props.placeholder || 'Message...' }}
              </span>
            </div>
            <textarea
              ref="messageInput"
              v-model="inputValue"
              class="w-full bg-gray-100 rounded-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none pr-12"
              :rows="1"
              :maxlength="props.maxLength"
              @keydown.enter.exact.prevent="handleSend"
              @paste="handlePaste"
              @input="autoResize"
            />
          </div>
          
          <button
            type="button"
            :disabled="!canSend"
            class="absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            :class="canSend ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'"
            @click="handleSend"
          >
            <div v-if="inputValue.trim().length > 0" class="i-mdi-send h-5 w-5" />
            <div v-else class="i-mdi-microphone h-5 w-5" />
          </button>
        </div>

        <!-- Mode/Model Row -->
        <div class="flex items-center justify-between mt-2 pb-2 px-2">
          <!-- Modes (Left) -->
          <div class="flex space-x-1">
            <button
              v-for="mode in props.availableModes || defaultModes"
              :key="mode.id"
              @click="$emit('update:selectedMode', mode.id)"
              class="px-2.5 py-1 text-xs rounded-md flex items-center gap-1.5 transition-colors"
              :class="{
                'bg-blue-100 text-blue-700': props.selectedMode === mode.id,
                'text-gray-500 hover:bg-gray-100': props.selectedMode !== mode.id
              }"
            >
              <div :class="`${mode.icon} text-sm`" />
              <span>{{ mode.name }}</span>
            </button>
          </div>
          
          <!-- Model (Right) -->
          <div class="relative">
            <button 
              @click="isModelDropdownOpen = !isModelDropdownOpen"
              class="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <div v-if="props.availableModels?.find(model => model.id === props.selectedModel)?.icon" 
                   :class="`${props.availableModels?.find(model => model.id === props.selectedModel)?.icon} text-sm`" />
              <span class="truncate max-w-[100px]">
                {{ props.availableModels?.find(model => model.id === props.selectedModel)?.name }}
              </span>
              <div class="i-mdi-chevron-down text-xs transition-transform duration-200" :class="{'transform rotate-180': isModelDropdownOpen}" />
            </button>
            <Dropdown 
              :isOpen="isModelDropdownOpen" 
              @close="isModelDropdownOpen = false"
              position="top"
              class="w-48"
            >
              <button
                v-for="model in props.availableModels || defaultModels"
                :key="model.id"
                @click="$emit('update:selectedModel', model.id); isModelDropdownOpen = false"
                class="px-3 py-2 text-sm text-left w-full hover:bg-gray-100 flex items-center gap-2"
                :class="{'text-blue-600': model.id === props.selectedModel}"
              >
                <div :class="model.icon" class="text-base" />
                <span>{{ model.name }}</span>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>