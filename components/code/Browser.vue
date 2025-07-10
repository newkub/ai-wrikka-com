<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Browser Controls -->
    <div class="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
      <button 
        class="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!canGoBack"
        @click="goBack"
        title="Go back"
      >
        <i class="i-mdi-arrow-left text-lg" />
      </button>
      <button 
        class="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!canGoForward"
        @click="goForward"
        title="Go forward"
      >
        <i class="i-mdi-arrow-right text-lg" />
      </button>
      <button 
        class="p-2 rounded-full hover:bg-gray-200 transition-colors"
        @click="refresh"
        title="Refresh"
      >
        <i class="i-mdi-refresh text-lg" :class="{ 'animate-spin': isLoading }" />
      </button>
      <button 
        class="p-2 rounded-full hover:bg-gray-200 transition-colors"
        @click="goHome"
        title="Home"
      >
        <i class="i-mdi-home text-lg" />
      </button>
      
      <!-- URL Bar -->
      <div class="flex-1 flex items-center px-3 py-1.5 rounded-lg bg-white border transition-colors"
           :class="{
             'border-blue-500': isUrlFocused,
             'border-red-500': urlError,
             'border-gray-300': !isUrlFocused && !urlError
           }">
        <i 
          v-if="isSecure" 
          class="i-mdi-lock text-green-500 mr-2"
          :title="'Secure connection'"
        />
        <i 
          v-else 
          class="i-mdi-lock-open-outline text-gray-400 mr-2"
          :title="'Not secure'"
        />
        <input 
          ref="urlInput"
          type="text" 
          class="flex-1 outline-none text-sm bg-transparent"
          placeholder="Enter URL or search..."
          v-model="displayUrl"
          @keyup.enter="navigate"
          @focus="isUrlFocused = true"
          @blur="isUrlFocused = false"
        />
        <button 
          v-if="displayUrl"
          class="text-gray-400 hover:text-gray-600"
          @click="clearUrl"
          title="Clear"
        >
          <i class="i-mdi-close" />
        </button>
      </div>
    </div>

    <!-- Browser Content -->
    <div class="flex-1 overflow-hidden relative">
      <div v-if="isLoading" class="absolute top-0 left-0 right-0 h-1 bg-blue-500">
        <div class="h-full bg-blue-400 animate-pulse"></div>
      </div>
      
      <div v-if="urlError" class="h-full flex items-center justify-center bg-gray-50 p-4">
        <div class="text-center max-w-md">
          <i class="i-mdi-alert-circle-outline text-6xl text-red-500 mb-4 mx-auto" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Couldn't load the page</h3>
          <p class="text-gray-500 mb-4">{{ urlError }}</p>
          <button 
            @click="refresh"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      
      <iframe 
        v-show="!urlError"
        ref="browserFrame"
        :src="currentUrl" 
        class="w-full h-full border-0"
        :sandbox="sandboxOptions"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps({
	initialUrl: {
		type: String,
		default: "https://www.google.com",
	},
	sandbox: {
		type: String,
		default: "allow-same-origin allow-scripts allow-popups allow-forms",
	},
});

// Refs
const browserFrame = ref<HTMLIFrameElement | null>(null);
const urlInput = ref<HTMLInputElement | null>(null);
const currentUrl = ref(props.initialUrl);
const displayUrl = ref(props.initialUrl);
const isLoading = ref(false);
const isUrlFocused = ref(false);
const urlError = ref<string | null>(null);
const history = ref<string[]>([props.initialUrl]);
const historyIndex = ref(0);
const sandboxOptions = ref(props.sandbox);

// Computed
const canGoBack = computed(() => historyIndex.value > 0);
const canGoForward = computed(
	() => historyIndex.value < history.value.length - 1,
);
const isSecure = computed(() => currentUrl.value.startsWith("https://"));

// Methods
const formatUrl = (url: string): string => {
	try {
		// If it's already a valid URL, return it
		new URL(url);
		return url;
	} catch (e) {
		// If it's a domain without protocol, add https://
		if (!url.startsWith("http")) {
			return `https://${url}`;
		}
		return url;
	}
};

const navigate = async (urlInput: string | Event) => {
	let url: string;

	if (typeof urlInput === "string") {
		url = urlInput;
	} else {
		url = (urlInput.target as HTMLInputElement).value;
	}

	if (!url) return;

	try {
		isLoading.value = true;
		urlError.value = null;

		// Format URL
		const formattedUrl = formatUrl(url);

		// Update history if not just refreshing current page
		if (formattedUrl !== currentUrl.value) {
			// If we're not at the end of history, truncate the forward history
			if (historyIndex.value < history.value.length - 1) {
				history.value = history.value.slice(0, historyIndex.value + 1);
			}

			history.value.push(formattedUrl);
			historyIndex.value = history.value.length - 1;
		}

		currentUrl.value = formattedUrl;
		displayUrl.value = formattedUrl;
	} catch (error) {
		console.error("Navigation error:", error);
		urlError.value = "Invalid URL. Please check the address and try again.";
	} finally {
		// Focus the browser frame after navigation
		if (browserFrame.value) {
			browserFrame.value.focus();
		}
	}
};

const goBack = () => {
	if (historyIndex.value > 0) {
		historyIndex.value--;
		currentUrl.value = history.value[historyIndex.value];
		displayUrl.value = currentUrl.value;
	}
};

const goForward = () => {
	if (historyIndex.value < history.value.length - 1) {
		historyIndex.value++;
		currentUrl.value = history.value[historyIndex.value];
		displayUrl.value = currentUrl.value;
	}
};

const refresh = () => {
	if (browserFrame.value && currentUrl.value) {
		browserFrame.value.src = currentUrl.value;
		isLoading.value = true;
		urlError.value = null;
	}
};

const goHome = () => {
	navigate(props.initialUrl);
};

const clearUrl = () => {
	displayUrl.value = "";
	if (urlInput.value) {
		urlInput.value.focus();
	}
};

const handleLoad = () => {
	isLoading.value = false;
	urlError.value = null;

	// Update the display URL to match the final URL (in case of redirects)
	if (browserFrame.value?.contentWindow?.location.href) {
		const frameUrl = browserFrame.value.contentWindow.location.href;
		if (frameUrl !== "about:blank") {
			currentUrl.value = frameUrl;
			displayUrl.value = frameUrl;
		}
	}
};

const handleError = (error: Event) => {
	console.error("Frame error:", error);
	isLoading.value = false;
	urlError.value = "Failed to load the page. The site might be unavailable.";
};

// Lifecycle
onMounted(() => {
	if (urlInput.value) {
		urlInput.value.focus();
	}
});
</script>