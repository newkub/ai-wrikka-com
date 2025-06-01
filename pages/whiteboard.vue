<template>
  <div class="h-full flex flex-col">
    <header class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">Whiteboard</h1>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <label for="color" class="mr-2 text-sm font-medium text-gray-700">Color:</label>
            <input 
              id="color"
              v-model="selectedColor"
              type="color" 
              class="w-8 h-8 p-1 border border-gray-300 rounded cursor-pointer"
            >
          </div>
          <div class="flex items-center">
            <label for="width" class="mr-2 text-sm font-medium text-gray-700">Width:</label>
            <input 
              id="width"
              v-model.number="selectedWidth" 
              type="range" 
              min="1" 
              max="20" 
              class="w-24"
            >
          </div>
          <button
            @click="clearCanvas"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </header>
    
    <main class="flex-1 bg-gray-100 overflow-hidden">
      <div class="h-full w-full">
        <canvas
          ref="canvasRef"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove.prevent="draw"
          @touchend="stopDrawing"
          class="bg-white touch-none block w-full h-full"
          style="touch-action: none;"
        ></canvas>
      </div>
    </main>
    
    <!-- Bottom Toolbar -->
    <div class="bg-gray-800 text-white p-2 flex justify-center items-center space-x-4">
      <!-- Cursor Tool -->
      <button 
        @click="setTool('select')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'select'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Select"
      >
        <div class="i-mdi-cursor-default-outline w-6 h-6 text-white" />
      </button>
      
      <!-- Hand Tool -->
      <button 
        @click="setTool('hand')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'hand'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Hand"
      >
        <div class="i-mdi-hand-back-right-outline w-6 h-6 text-white" />
      </button>
      
      <!-- Pen Tool -->
      <button 
        @click="setTool('pen')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'pen'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Pen"
      >
        <div class="i-mdi-pen w-6 h-6 text-white" />
      </button>
      
      <!-- Eraser Tool -->
      <button 
        @click="setTool('eraser')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'eraser'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Eraser"
      >
        <div class="i-mdi-eraser w-6 h-6 text-white" />
      </button>
      
      <!-- Line Tool -->
      <button 
        @click="setTool('line')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'line'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Line"
      >
        <div class="i-mdi-vector-line w-6 h-6 text-white" />
      </button>
      
      <!-- Text Tool -->
      <button 
        @click="setTool('text')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'text'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Text"
      >
        <div class="i-mdi-format-text w-6 h-6 text-white" />
      </button>
      
      <!-- Shape Tool -->
      <div class="relative group">
        <button 
          @click="toggleShapeMenu"
          class="p-2 hover:bg-gray-700 rounded-md transition-colors"
          :class="{'bg-blue-500': shapeMenuOpen}"
          title="Shapes"
        >
          <div class="i-mdi-shape w-6 h-6 text-white" />
        </button>
        <!-- Shape Dropdown Menu -->
        <div v-if="shapeMenuOpen" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
          <div class="p-2 space-y-1">
            <button @click="setTool('rectangle')" class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded">Rectangle</button>
            <button @click="setTool('circle')" class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded">Circle</button>
            <button @click="setTool('triangle')" class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded">Triangle</button>
          </div>
        </div>
      </div>
      
      <!-- Image Tool -->
      <button 
        @click="setTool('image')" 
        :class="{'bg-blue-500 rounded-md': activeTool === 'image'}"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="Image"
      >
        <div class="i-mdi-image-outline w-6 h-6 text-white" />
      </button>
      
      <!-- Color Picker -->
      <div class="flex items-center ml-4">
        <label for="color" class="mr-2 text-sm">Color:</label>
        <input 
          id="color"
          v-model="selectedColor"
          type="color" 
          class="w-8 h-8 p-1 border border-gray-300 rounded cursor-pointer"
        >
      </div>
      
      <!-- Line Width -->
      <div class="flex items-center w-32 mx-4">
        <span class="text-sm mr-2">Width:</span>
        <input 
          id="width"
          v-model.number="selectedWidth" 
          type="range" 
          min="1" 
          max="20" 
          class="w-full"
        >
      </div>
      
      <!-- Clear Button -->
      <button
        @click="clearCanvas"
        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ml-4"
        title="Clear Canvas"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { useWhiteboard } from "~/composables/useWhiteboard";

definePageMeta({
	layout: "default",
});

type Tool =
	| "select"
	| "hand"
	| "pen"
	| "eraser"
	| "line"
	| "text"
	| "rectangle"
	| "circle"
	| "triangle"
	| "image";

useHead({
	title: "Whiteboard - AI Wrikka",
	meta: [
		{ name: "description", content: "AI-powered collaborative whiteboard" },
	],
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const activeTool = ref("pen");
const shapeMenuOpen = ref(false);

const {
	isDrawing,
	selectedColor,
	selectedWidth,
	startDrawing,
	draw,
	stopDrawing,
	clearCanvas,
	redraw,
	setActiveTool,
	handleImageUpload,
} = useWhiteboard(canvasRef);

// Handle click outside to close shape menu
const onClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (!target.closest(".relative.group")) {
		shapeMenuOpen.value = false;
	}
};

// Toggle shape menu
const toggleShapeMenu = (event?: Event) => {
	if (event) event.stopPropagation();
	shapeMenuOpen.value = !shapeMenuOpen.value;
};

// Set the active tool
const setTool = (tool: string) => {
	setActiveTool(tool as Tool); // Cast to Tool type
	shapeMenuOpen.value = false; // Close shape menu when a tool is selected
};

// Handle window resize
const handleResize = () => {
	if (canvasRef.value) {
		redraw();
	}
};

// Set up event listeners
onMounted(() => {
	window.addEventListener("resize", handleResize);
	document.addEventListener("click", onClickOutside);

	// Initial redraw after mount
	nextTick(() => {
		redraw();
	});
});

// Clean up event listeners
onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	document.removeEventListener("click", onClickOutside);
});
</script>
