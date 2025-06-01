<script setup lang="ts">
import { ref, computed } from "vue";

const activeTab = ref("computer");
const showFileModal = ref(false);

const openFileModal = () => {
	showFileModal.value = true;
};

const closeFileModal = () => {
	showFileModal.value = false;
};

const selectTab = (tab: string) => {
	activeTab.value = tab;
};

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
		default: () => [],
	},
	availableModes: {
		type: Array as () => Mode[],
		required: true,
		default: () => [],
	},
	selectedModel: {
		type: String,
		required: true,
	},
	selectedMode: {
		type: String,
		required: true,
	},
	placeholder: {
		type: String,
		default: "Type your message...",
	},
	rows: {
		type: Number,
		default: 1,
	},
	maxLength: {
		type: Number,
		default: 4000,
	},
	showCharacterCount: {
		type: Boolean,
		default: false,
	},
	showHelperText: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits([
	"update:selectedModel",
	"update:selectedMode",
	"send",
	"file-select",
]);

const files = ref<FileWithPreview[]>([]);
const inputValue = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);

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

// Expose methods if needed
const focus = () => {
	messageInput.value?.focus();
};

defineExpose({
	focus,
});
</script>

<template>
  <div class="border-t border-surface p-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <!-- File Upload Modal -->
      <div v-if="showFileModal" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Overlay -->
        <div 
          class="fixed inset-0 bg-black/50 transition-opacity"
          @click="closeFileModal"
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Modal Panel -->
          <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-background text-left shadow-xl transition-all">
            <!-- Header -->
            <div class="p-4 border-b border-surface">
              <h3 class="text-lg font-medium text-text">
                Upload File
              </h3>
            </div>
            
            <!-- Tabs -->
            <div class="border-b border-surface">
              <nav class="flex -mb-px">
                <button
                  v-for="tab in [
                    { id: 'computer', name: 'Computer', icon: 'i-mdi-desktop-mac' },
                    { id: 'github', name: 'GitHub', icon: 'i-mdi-github' },
                    { id: 'drive', name: 'Google Drive', icon: 'i-mdi-google-drive' }
                  ]"
                  :key="tab.id"
                  @click="selectTab(tab.id)"
                  class="flex-1 py-3 px-1 text-center border-b-2 font-medium text-sm"
                  :class="[
                    activeTab === tab.id
                      ? 'border-brand text-brand'
                      : 'border-transparent text-text/60 hover:text-text/80 hover:border-surface',
                    'group inline-flex items-center justify-center gap-2'
                  ]"
                >
                  <div :class="[tab.icon, 'h-5 w-5']" />
                  {{ tab.name }}
                </button>
              </nav>
            </div>
            
            <!-- Tab Panels -->
            <div class="p-4">
              <!-- Computer Panel -->
              <div v-if="activeTab === 'computer'" class="space-y-4">
                <div 
                  @click="triggerFileInput"
                  class="mt-2 flex justify-center rounded-lg border border-dashed border-surface px-6 py-10 cursor-pointer hover:bg-surface/50 transition-colors"
                >
                  <div class="text-center">
                    <div class="i-mdi-cloud-upload text-4xl text-text/40 mx-auto mb-3" />
                    <div class="text-sm text-text/60">
                      <p class="font-medium text-text">Click to upload</p>
                      <p class="text-xs">or drag and drop</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- GitHub Panel -->
              <div v-else-if="activeTab === 'github'" class="flex flex-col items-center justify-center py-8">
                <div class="i-mdi-github text-4xl text-text/60 mb-4" />
                <p class="text-text/80 text-center mb-4">Connect your GitHub account to browse repositories</p>
                <button class="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <div class="i-mdi-github h-5 w-5" />
                  Connect GitHub
                </button>
              </div>
              
              <!-- Google Drive Panel -->
              <div v-else class="flex flex-col items-center justify-center py-8">
                <div class="i-mdi-google-drive text-4xl text-text/60 mb-4" />
                <p class="text-text/80 text-center mb-4">Connect your Google Drive to browse files</p>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <div class="i-mdi-google h-5 w-5" />
                  Sign in with Google
                </button>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="bg-surface/50 px-4 py-3 flex justify-end gap-3 border-t border-surface">
              <button
                @click="closeFileModal"
                class="px-4 py-2 text-sm font-medium text-text/80 hover:text-text"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- File preview -->
      <div v-if="files.length > 0" class="flex flex-wrap gap-2 mb-3">
        <div v-for="(file, index) in files" :key="index" class="relative group">
          <img :src="file.preview" class="h-16 w-16 object-cover rounded-lg border border-surface" />
          <button 
            @click="removeFile(index)"
            class="absolute -top-2 -right-2 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-80 transition-colors"
            aria-label="Remove file"
          >
            <div class="i-mdi-close h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div class="relative rounded-lg border border-surface bg-background shadow-sm">
        <!-- Model and Mode Selectors -->
        <div class="flex border-b border-surface">
          <div class="relative flex-1 border-r border-surface">
            <select 
              :value="selectedModel"
              @change="$emit('update:selectedModel', ($event.target as HTMLSelectElement).value)"
              class="w-full bg-transparent px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-0 border-0 focus:border-brand"
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
              class="w-full bg-transparent px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-0 border-0 focus:border-brand"
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
              class="text-text/40 hover:text-text/60 transition-colors"
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
            class="w-full px-4 py-3 pl-12 pr-20 text-text bg-transparent border-0 focus:ring-0 focus:outline-none resize-none min-h-[60px] max-h-40"
            style="min-height: 60px"
          ></textarea>
          
          <div class="absolute right-3 bottom-3 flex items-center space-x-2">
            <span v-if="showCharacterCount" class="text-xs text-text/40">
              {{ inputValue.length }}/{{ maxLength || 4000 }}
            </span>
            <button
              type="button"
              @click="handleSend"
              :disabled="!canSend"
              :class="[
                'flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors',
                canSend 
                  ? 'bg-brand hover:bg-opacity-80' 
                  : 'bg-surface cursor-not-allowed'
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
        <div v-if="showHelperText" class="px-4 py-2 text-xs text-text/40 border-t border-surface">
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