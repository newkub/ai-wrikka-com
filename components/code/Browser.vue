<script setup lang="ts">
import { ref, watch } from 'vue';

interface BrowserProps {
  url?: string;
  showControls?: boolean;
  showAddressBar?: boolean;
  height?: string;
  loadingText?: string;
}

const props = withDefaults(defineProps<BrowserProps>(), {
  url: 'https://example.com',
  showControls: true,
  showAddressBar: true,
  height: '300px',
  loadingText: 'Loading...'
});

const emit = defineEmits<{
  (e: 'update:url', url: string): void;
  (e: 'navigate', url: string): void;
  (e: 'refresh'): void;
  (e: 'back'): void;
  (e: 'forward'): void;
}>();

const currentUrl = ref(props.url);
const isLoading = ref(false);
const iframeRef = ref<HTMLIFrameElement | null>(null);

const navigate = () => {
  if (!currentUrl.value) return;
  
  // Add https:// if no protocol is specified
  if (!currentUrl.value.match(/^https?:\/\//)) {
    currentUrl.value = `https://${currentUrl.value}`;
  }
  
  emit('navigate', currentUrl.value);
};

const refresh = () => {
  if (iframeRef.value) {
    iframeRef.value.contentWindow?.location.reload();
  }
  emit('refresh');
};

const goBack = () => {
  if (iframeRef.value) {
    iframeRef.value.contentWindow?.history.back();
  }
  emit('back');
};

const goForward = () => {
  if (iframeRef.value) {
    iframeRef.value.contentWindow?.history.forward();
  }
  emit('forward');
};

// Watch for URL changes from parent
watch(() => props.url, (newUrl) => {
  if (newUrl !== currentUrl.value) {
    currentUrl.value = newUrl;
  }
});


// Handle iframe load events
const onIframeLoad = () => {
  isLoading.value = false;
  if (iframeRef.value?.contentWindow?.location.href) {
    currentUrl.value = iframeRef.value.contentWindow.location.href;
    emit('update:url', currentUrl.value);
  }
};

const onIframeLoadStart = () => {
  isLoading.value = true;
};
</script>

<template>
  <div class="flex flex-col border border-border rounded-lg overflow-hidden shadow-lg h-full bg-surface">
    <!-- Browser Toolbar -->
    <div v-if="showControls || showAddressBar" class="bg-surface-2 p-2 border-b border-border flex items-center">
      <!-- Navigation Buttons -->
      <div v-if="showControls" class="flex space-x-2 mr-4">
        <button 
          @click="goBack"
          class="p-1.5 rounded-full hover:bg-surface-3 text-text/80 hover:text-text"
          title="Go back"
        >
          <div class="i-mdi-arrow-left h-4 w-4" />
        </button>
        <button 
          @click="goForward"
          class="p-1.5 rounded-full hover:bg-surface-3 text-text/80 hover:text-text"
          title="Go forward"
        >
          <div class="i-mdi-arrow-right h-4 w-4" />
        </button>
        <button 
          @click="refresh"
          class="p-1.5 rounded-full hover:bg-surface-3 text-text/80 hover:text-text"
          title="Refresh"
        >
          <div class="i-mdi-refresh h-4 w-4" />
        </button>
      </div>
      
      <!-- Address Bar -->
      <div v-if="showAddressBar" class="flex-1 flex">
        <div class="relative flex-1">
          <input
            v-model="currentUrl"
            @keyup.enter="navigate"
            type="text"
            class="w-full px-3 py-1.5 text-sm bg-surface-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-text placeholder-text/50"
            placeholder="Enter URL..."
          />
          <button 
            @click="navigate"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-text/60 hover:text-brand"
          >
            <div class="i-mdi-arrow-right-thick h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Browser Content -->
    <div class="relative flex-1 bg-surface-1" :style="{ height: height }">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-surface/80">
        <div class="animate-pulse text-text/60">
          {{ loadingText }}
        </div>
      </div>
      <iframe
        ref="iframeRef"
        :src="url"
        class="w-full h-full border-0 bg-white"
        @load="onIframeLoad"
        @loadstart="onIframeLoadStart"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        title="Browser Preview"
      ></iframe>
    </div>
  </div>
</template>
