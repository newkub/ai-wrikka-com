import { ref } from "vue";

export interface BrowserHistoryItem {
	url: string;
	title?: string;
	timestamp: number;
}

export interface BrowserOptions {
	initialUrl?: string;
	showControls?: boolean;
	showAddressBar?: boolean;
	enableHistory?: boolean;
	maxHistoryItems?: number;
}

export function useBrowser(options: BrowserOptions = {}) {
	const {
		initialUrl = "https://example.com",
		showControls = true,
		showAddressBar = true,
		enableHistory = true,
		maxHistoryItems = 50,
	} = options;

	const currentUrl = ref(initialUrl);
	const isLoading = ref(false);
	const iframeRef = ref<HTMLIFrameElement | null>(null);
	const canGoBack = ref(false);
	const canGoForward = ref(false);
	const history = ref<BrowserHistoryItem[]>([]);
	const historyIndex = ref(-1);

	const navigate = (url: string) => {
		if (!url) return;

		// Add https:// if no protocol is specified
		let targetUrl = url;
		if (!targetUrl.match(/^https?:\/\//)) {
			targetUrl = `https://${url}`;
		}

		currentUrl.value = url;
		updateHistory(url);
		return url;
	};

	const refresh = () => {
		if (iframeRef.value) {
			iframeRef.value.contentWindow?.location.reload();
		}
		return true;
	};

	const goBack = () => {
		if (historyIndex.value > 0) {
			historyIndex.value--;
			const previousUrl = history.value[historyIndex.value].url;
			currentUrl.value = previousUrl;
			updateNavigationState();
			return previousUrl;
		}
		return null;
	};

	const goForward = () => {
		if (historyIndex.value < history.value.length - 1) {
			historyIndex.value++;
			const nextUrl = history.value[historyIndex.value].url;
			currentUrl.value = nextUrl;
			updateNavigationState();
			return nextUrl;
		}
		return null;
	};

	const updateHistory = (url: string) => {
		if (!enableHistory) return;

		// If we're not at the end of history, truncate the future history
		if (historyIndex.value < history.value.length - 1) {
			history.value = history.value.slice(0, historyIndex.value + 1);
		}

		// Add new history item
		const newItem = {
			url,
			timestamp: Date.now(),
		};

		history.value.push(newItem);

		// Remove oldest items if we've exceeded max history
		if (history.value.length > maxHistoryItems) {
			history.value.shift();
		} else {
			historyIndex.value++;
		}

		updateNavigationState();
	};

	const updateNavigationState = () => {
		canGoBack.value = historyIndex.value > 0;
		canGoForward.value = historyIndex.value < history.value.length - 1;
	};

	const onIframeLoad = () => {
		isLoading.value = false;
		if (iframeRef.value?.contentWindow?.location.href) {
			const newUrl = iframeRef.value.contentWindow.location.href;
			if (newUrl !== "about:blank") {
				currentUrl.value = newUrl;
				updateHistory(newUrl);
			}
		}
	};

	const onIframeLoadStart = () => {
		isLoading.value = true;
	};

	// Initialize with the initial URL
	if (enableHistory) {
		updateHistory(initialUrl);
	}

	return {
		// State
		currentUrl,
		isLoading,
		iframeRef,
		canGoBack,
		canGoForward,
		history,
		historyIndex,
		showControls,
		showAddressBar,

		// Methods
		navigate,
		refresh,
		goBack,
		goForward,
		onIframeLoad,
		onIframeLoadStart,
		updateNavigationState,
	};
}

export type UseBrowserReturn = ReturnType<typeof useBrowser>;
