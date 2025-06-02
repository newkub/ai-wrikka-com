<script setup lang="ts">
import Modal from "~/components/modal/Modal.vue";

interface Tab {
	id: string;
	name: string;
	icon: string;
}

interface FileType {
	id: string;
	name: string;
	icon: string;
}

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
	upload: [files: File[]];
}>();

const activeTab = ref<string>("computer");
const connectedServices = ref<Record<string, boolean>>({
	github: false,
	"google-drive": false,
	onedrive: false,
});

// Mock function to toggle service connection
function toggleService(serviceId: string) {
	connectedServices.value[serviceId] = !connectedServices.value[serviceId];
}

const tabs: Tab[] = [
	{ id: "computer", name: "Computer", icon: "i-mdi-desktop-mac" },
	{ id: "github", name: "GitHub", icon: "i-mdi-github" },
	{ id: "google-drive", name: "Google Drive", icon: "i-mdi-google-drive" },
	{ id: "onedrive", name: "OneDrive", icon: "i-mdi-microsoft-onedrive" },
];

const fileTypes: FileType[] = [
	{ id: "file", name: "File", icon: "i-mdi-file-outline" },
	{ id: "image", name: "Image", icon: "i-mdi-image-outline" },
	{ id: "video", name: "Video", icon: "i-mdi-video-outline" },
];

function handleUpload(files: File[]) {
	emit("upload", files);
	closeModal();
}

function closeModal() {
	emit("update:modelValue", false);
}

function handleFileTypeSelect(typeId: string) {
	// You can use this to filter file types or set accept attribute on file input
	// For now, just trigger the file input click
	document.getElementById('file-upload')?.click();
}
</script>

<template>
  <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Upload File" content-class="w-full max-w-4xl">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-medium text-text">
          Upload File
        </h3>
      </div>
    </template>

    <!-- Tabs -->
    <div class="border-b border-surface">
      <nav class="flex -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors"
          :class="[
            activeTab === tab.id
              ? 'border-brand text-brand'
              : 'border-transparent text-text/60 hover:text-text hover:border-surface',
          ]"
        >
          <div :class="tab.icon" class="mx-auto text-lg" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Computer Panel -->
      <div v-if="activeTab === 'computer'" class="p-6">
        <label for="file-upload" class="cursor-pointer">
          <div class="grid grid-cols-3 gap-4">
            <div 
              v-for="fileType in fileTypes" 
              :key="fileType.id" 
              class="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-surface/60 rounded-xl cursor-pointer hover:border-brand/50 hover:bg-surface/30 transition-all duration-200"
              @click="handleFileTypeSelect(fileType.id)"
            >
              <div :class="[fileType.icon, 'text-5xl text-brand/80 group-hover:text-brand transition-colors mb-3']" />
              <span class="font-medium text-text group-hover:text-text/90 transition-colors">
                {{ fileType.name }}
              </span>
              <span v-if="fileType.id === 'file'" class="text-xs text-text/50 mt-1">PDF, DOC, XLS, etc.</span>
              <span v-else-if="fileType.id === 'image'" class="text-xs text-text/50 mt-1">JPG, PNG, GIF, etc.</span>
              <span v-else class="text-xs text-text/50 mt-1">MP4, MOV, AVI, etc.</span>
            </div>
          </div>
          <input 
            id="file-upload"
            type="file" 
            class="hidden" 
            multiple 
            @change="(event) => {
              const target = event.target as HTMLInputElement
              const files = target.files
              if (files) handleUpload(Array.from(files));
            }"
          >
        </label>
      </div>

      <!-- GitHub Panel -->
      <div v-if="activeTab === 'github'" class="p-4">
        <div v-if="!connectedServices.github" class="flex flex-col items-center justify-center py-8">
          <div class="i-mdi-github text-6xl text-text/30 mb-4" />
          <h3 class="text-xl font-medium text-text mb-2">Connect to GitHub</h3>
          <p class="text-text/60 mb-6 text-center">Connect to GitHub to access your repositories and files</p>
          <button 
            @click="toggleService('github')" 
            class="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Connect GitHub
          </button>
        </div>
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="i-mdi-github text-2xl text-text/80" />
              <span class="font-medium">GitHub Connected</span>
            </div>
            <button 
              @click="toggleService('github')" 
              class="text-sm text-text/60 hover:text-text/90 transition-colors"
            >
              Disconnect
            </button>
          </div>
          <!-- Repository list would go here -->
          <div class="p-4 border border-surface rounded-lg">
            <p class="text-text/70 text-center">Your GitHub repositories will appear here</p>
          </div>
        </div>
      </div>

      <!-- Google Drive Panel -->
      <div v-if="activeTab === 'google-drive'" class="p-4">
        <div v-if="!connectedServices['google-drive']" class="flex flex-col items-center justify-center py-8">
          <div class="i-mdi-google-drive text-6xl text-text/30 mb-4" />
          <h3 class="text-xl font-medium text-text mb-2">Connect Google Drive</h3>
          <p class="text-text/60 mb-6 text-center">Connect to Google Drive to access your files and documents</p>
          <button 
            @click="toggleService('google-drive')" 
            class="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Connect Google Drive
          </button>
        </div>
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="i-mdi-google-drive text-2xl text-text/80" />
              <span class="font-medium">Google Drive Connected</span>
            </div>
            <button 
              @click="toggleService('google-drive')" 
              class="text-sm text-text/60 hover:text-text/90 transition-colors"
            >
              Disconnect
            </button>
          </div>
          <!-- File list would go here -->
          <div class="p-4 border border-surface rounded-lg">
            <p class="text-text/70 text-center">Your Google Drive files will appear here</p>
          </div>
        </div>
      </div>

      <!-- OneDrive Panel -->
      <div v-if="activeTab === 'onedrive'" class="p-4">
        <div v-if="!connectedServices.onedrive" class="flex flex-col items-center justify-center py-8">
          <div class="i-mdi-microsoft-onedrive text-6xl text-text/30 mb-4" />
          <h3 class="text-xl font-medium text-text mb-2">Connect OneDrive</h3>
          <p class="text-text/60 mb-6 text-center">Connect to OneDrive to access your files and documents</p>
          <button 
            @click="toggleService('onedrive')" 
            class="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Connect OneDrive
          </button>
        </div>
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="i-mdi-microsoft-onedrive text-2xl text-text/80" />
              <span class="font-medium">OneDrive Connected</span>
            </div>
            <button 
              @click="toggleService('onedrive')" 
              class="text-sm text-text/60 hover:text-text/90 transition-colors"
            >
              Disconnect
            </button>
          </div>
          <!-- File list would go here -->
          <div class="p-4 border border-surface rounded-lg">
            <p class="text-text/70 text-center">Your OneDrive files will appear here</p>
          </div>
        </div>
        <div class="i-mdi-microsoft-onedrive text-4xl text-text/60 mb-4" />
        <p class="text-text/60 mb-4">Connect to OneDrive to select files</p>
        <button class="px-4 py-2 bg-surface rounded-lg text-text hover:bg-surface/80 transition-colors">
          Connect OneDrive
        </button>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-text/60 hover:text-text transition-colors"
        >
          Cancel
        </button>
      </div>
    </template>
  </Modal>
</template>
