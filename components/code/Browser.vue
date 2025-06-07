<script setup lang="ts">
import { watch } from "vue";
import { useBrowser } from "~/composables/useBrowser";

interface BrowserProps {
	url?: string;
	showControls?: boolean;
	showAddressBar?: boolean;
	height?: string;
	loadingText?: string;
}

const props = withDefaults(defineProps<BrowserProps>(), {
	url: "https://example.com",
	showControls: true,
	showAddressBar: true,
	height: "300px",
	loadingText: "Loading...",
});

const emit = defineEmits<{
	(e: "update:url", url: string): void;
	(e: "navigate", url: string): void;
	(e: "refresh"): void;
	(e: "back"): void;
	(e: "forward"): void;
}>();

const {
	currentUrl,
	isLoading,
	iframeRef,
	canGoBack,
	canGoForward,
	navigate: browserNavigate,
	refresh: browserRefresh,
	goBack: browserGoBack,
	goForward: browserGoForward,
	onIframeLoad: browserOnIframeLoad,
	onIframeLoadStart: browserOnIframeLoadStart,
} = useBrowser({
	initialUrl: props.url,
	showControls: props.showControls,
	showAddressBar: props.showAddressBar,
	enableHistory: true,
});

// Handle navigation with emit
const navigate = () => {
	const newUrl = browserNavigate(currentUrl.value);
	if (newUrl) {
		emit("navigate", newUrl);
	}
};

// Handle refresh with emit
const refresh = () => {
	if (browserRefresh()) {
		emit("refresh");
	}
};

// Handle back with emit
const goBack = () => {
	const result = browserGoBack();
	if (result) {
		emit("back");
	}
};

// Handle forward with emit
const goForward = () => {
	const result = browserGoForward();
	if (result) {
		emit("forward");
	}
};

// Handle iframe load events
const onIframeLoad = () => {
	browserOnIframeLoad();
	if (iframeRef.value?.contentWindow?.location.href) {
		const newUrl = iframeRef.value.contentWindow.location.href;
		emit("update:url", newUrl);
	}
};

const onIframeLoadStart = browserOnIframeLoadStart;

// Watch for URL changes from parent
watch(
	() => props.url,
	(newUrl) => {
		if (newUrl && newUrl !== currentUrl.value) {
			currentUrl.value = newUrl;
		}
	},
);
</script>

<template>
  <div class="flex flex-col border border-border rounded-lg overflow-hidden shadow-lg h-full bg-surface">
    <!-- Browser Toolbar -->
    <div v-if="showControls || showAddressBar" class="bg-surface p-2 border-b border-border flex items-center">
      <!-- Navigation Buttons -->
      <div v-if="showControls" class="flex space-x-2 mr-4">
        <button 
          @click="goBack"
          :disabled="!canGoBack"
          class="p-1.5 rounded-full hover:bg-surface text-text/80 hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
          :class="{ 'text-text/40': !canGoBack }"
          title="Go back"
        >
          <div class="i-mdi-arrow-left h-4 w-4" />
        </button>
        <button 
          @click="goForward"
          :disabled="!canGoForward"
          class="p-1.5 rounded-full hover:bg-surface text-text/80 hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
          :class="{ 'text-text/40': !canGoForward }"
          title="Go forward"
        >
          <div class="i-mdi-arrow-right h-4 w-4" />
        </button>
        <button 
          @click="refresh"
          class="p-1.5 rounded-full hover:bg-surface text-text/80 hover:text-text"
          :class="{ 'animate-spin': isLoading }"
          title="Refresh"
          :disabled="isLoading"
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
            class="w-full px-3 py-1.5 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-text placeholder-text/50"
            placeholder="Enter URL..."
            :disabled="isLoading"
          />
          <button 
            @click="navigate"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-text/60 hover:text-brand disabled:opacity-40"
            :disabled="isLoading"
          >
            <div class="i-mdi-arrow-right-thick h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Browser Content -->
    <div class="relative flex-1 bg-background" :style="{ height: height }">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-surface/80 z-10">
        <div class="animate-pulse text-text/60 flex items-center">
          <div class="i-mdi-loading h-4 w-4 mr-2 animate-spin"></div>
          {{ loadingText }}
        </div>
      </div>
      <iframe
        ref="iframeRef"
        :src="currentUrl"
        class="w-full h-full border-0 bg-white"
        @load="onIframeLoad"
        @loadstart="onIframeLoadStart"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        title="Browser Preview"
      ></iframe>
    </div>
  </div>
</template>
