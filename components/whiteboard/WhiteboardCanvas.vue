<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { Point, ViewState, Drawing } from "~/types/whiteboard";
import { useCanvas } from "~/composables/useCanvas";

const props = defineProps<{
	drawings: Drawing[];
	currentTool: string;
	currentColor: string;
	currentWidth: number;
	viewState: ViewState;
	isPanning: boolean;
	showTextInput: boolean;
	textInput: string;
	textPosition: Point | null;
}>();

const emit = defineEmits<{
	"start-drawing": [point: Point];
	"update-drawing": [point: Point];
	"stop-drawing": [];
	"start-pan": [point: Point];
	"update-pan": [point: Point];
	"stop-pan": [];
	zoom: [delta: number, point: Point];
	"update:text": [text: string];
	"submit-text": [];
	"cancel-text": [];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const textInputRef = ref<HTMLInputElement | null>(null);

const { redraw } = useCanvas(
	canvasRef,
	computed(() => props.viewState),
);

// Watch for changes in drawings and redraw
watch(
	() => props.drawings,
	() => {
		redraw(props.drawings);
	},
	{ deep: true },
);

const handleMouseDown = (e: MouseEvent) => {
	if (!canvasRef.value) return;

	const rect = canvasRef.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	if (e.ctrlKey || e.metaKey || props.currentTool === "select") {
		emit("start-pan", { x, y });
		return;
	}

	emit("start-drawing", { x, y });
};

const handleMouseMove = (e: MouseEvent) => {
	if (!canvasRef.value) return;

	const rect = canvasRef.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	if (props.isPanning) {
		emit("update-pan", { x, y });
		return;
	}

	emit("update-drawing", { x, y });
};

const handleMouseUp = () => {
	if (props.isPanning) {
		emit("stop-pan");
	} else {
		emit("stop-drawing");
	}
};

const handleWheel = (e: WheelEvent) => {
	e.preventDefault();
	if (!canvasRef.value) return;

	const rect = canvasRef.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	// Zoom with mouse wheel (inverted for natural scrolling)
	emit("zoom", -e.deltaY * 0.001, { x, y });
};

onMounted(() => {
	// Prevent default touch actions to allow proper panning on touch devices
	if (containerRef.value) {
		containerRef.value.addEventListener("wheel", handleWheel, {
			passive: false,
		});
	}

	return () => {
		if (containerRef.value) {
			containerRef.value.removeEventListener("wheel", handleWheel);
		}
	};
});
</script>

<template>
  <div ref="containerRef" class="flex-1 relative overflow-hidden bg-white">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full touch-none"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    />
    
    <!-- Text Input Overlay -->
    <div
      v-if="showTextInput && textPosition"
      :style="{
        position: 'absolute',
        left: `${textPosition.x}px`,
        top: `${textPosition.y}px`,
      }"
      class="bg-white border border-gray-300 rounded shadow-lg p-1"
    >
      <input
        ref="textInputRef"
        :value="textInput"
        @input="(e) => $emit('update:text', (e.target as HTMLInputElement).value)"
        type="text"
        class="w-full px-2 py-1 border-none focus:ring-1 focus:ring-blue-500 outline-none"
        @keyup.enter="emit('submit-text')"
        @keyup.esc="emit('cancel-text')"
        @blur="emit('submit-text')"
        autofocus
      />
    </div>
  </div>
</template>
