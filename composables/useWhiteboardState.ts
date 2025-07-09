import { ref, computed, watch, nextTick } from "vue";
import { useWhiteboardStore } from "~/stores/whiteboard";
import type { Point, DrawingTool, ViewState } from "~/types/whiteboard";

export function useWhiteboardState() {
	const store = useWhiteboardStore();

	// State
	const isFullscreen = ref(false);
	const isPanning = ref(false);
	const showTextInput = ref(false);
	const textInput = ref("");
	const textPosition = ref<Point | null>(null);

	// Computed
	const currentTool = computed<DrawingTool>({
		get: () => store.currentTool,
		set: (value) => {
			store.currentTool = value;
		},
	});

	const currentColor = computed<string>({
		get: () => store.currentColor,
		set: (value) => {
			store.currentColor = value;
		},
	});

	const currentWidth = computed<number>({
		get: () => store.currentWidth,
		set: (value) => {
			store.currentWidth = value;
		},
	});

	const viewState = computed<ViewState>({
		get: () => store.viewState,
		set: (value) => {
			store.viewState = value;
		},
	});

	// Methods
	const toggleFullscreen = () => {
		isFullscreen.value = !isFullscreen.value;
		// TODO: Implement actual fullscreen toggle using useFullscreen composable
	};

	const startPan = (point: Point) => {
		isPanning.value = true;
		store.startPan(point);
	};

	const updatePan = (point: Point) => {
		if (isPanning.value) {
			store.updatePan(point);
		}
	};

	const stopPan = () => {
		isPanning.value = false;
		store.stopPan();
	};

	const zoom = (delta: number, point: Point) => {
		store.zoom(delta, point);
	};

	const resetView = () => {
		store.resetView();
	};

	// Watch for text input focus
	watch(showTextInput, (newVal) => {
		if (newVal) {
			// Focus the text input when shown
			nextTick(() => {
				// This will be handled in the component
			});
		}
	});

	return {
		// State
		isFullscreen,
		isPanning,
		showTextInput,
		textInput,
		textPosition,

		// Computed
		currentTool,
		currentColor,
		currentWidth,
		viewState,

		// Methods
		toggleFullscreen,
		startPan,
		updatePan,
		stopPan,
		zoom,
		resetView,

		// Store methods
		startDrawing: store.startDrawing,
		updateDrawing: store.updateDrawing,
		stopDrawing: store.stopDrawing,
		addText: store.addText,
		clearCanvas: store.clearCanvas,
		undo: store.undo,
		toCanvasCoords: store.toCanvasCoords,
	};
}
