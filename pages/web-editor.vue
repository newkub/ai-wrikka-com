<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";

// ========== TYPES ==========
interface ComponentProps {
	backgroundColor?: string;
	color?: string;
	text?: string;
	src?: string;
}

interface CanvasComponent {
	id: string;
	type: string;
	x: number;
	y: number;
	width: number;
	height: number;
	props: ComponentProps;
}

interface Page {
	id: string;
	name: string;
	elements: CanvasComponent[];
}

// ========== STATE ==========
const pages = ref<Page[]>([{ id: uuidv4(), name: "Home", elements: [] }]);

const currentPageId = ref<string>(pages.value[0].id);
const canvasZoom = ref<number>(1);
const canvasPosition = ref({ x: 0, y: 0 });
const selectedElement = ref<CanvasComponent | null>(null);
const showGrid = ref<boolean>(true);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const contextMenuPosition = ref({ x: 0, y: 0 });
const showContextMenu = ref(false);
const activeTool = ref("select");
const componentTypes = ref([
	{ id: "text", name: "Text", icon: "format-text" },
	{ id: "rectangle", name: "Rectangle", icon: "rectangle-outline" },
	{ id: "circle", name: "Circle", icon: "circle-outline" },
	{ id: "image", name: "Image", icon: "image-outline" },
]);

// ========== COMPUTED ==========
const currentPage = computed<Page>(() => {
	return (
		pages.value.find((page) => page.id === currentPageId.value) ||
		pages.value[0]
	);
});

const canvasCenter = computed(() => ({
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
}));

// ========== METHODS ==========
const addNewPage = () => {
	const newPage: Page = {
		id: uuidv4(),
		name: `Page ${pages.value.length + 1}`,
		elements: [],
	};
	pages.value.push(newPage);
	currentPageId.value = newPage.id;
};

const deleteElement = (element: CanvasComponent | Page) => {
	if ("elements" in element) {
		// It's a Page
		const index = pages.value.findIndex((p) => p.id === element.id);
		if (index !== -1 && pages.value.length > 1) {
			pages.value.splice(index, 1);
			if (currentPageId.value === element.id) {
				currentPageId.value = pages.value[0].id;
			}
		}
	} else {
		// It's a CanvasComponent
		const index = currentPage.value.elements.findIndex(
			(el) => el.id === element.id,
		);
		if (index !== -1) {
			currentPage.value.elements.splice(index, 1);
			selectedElement.value = null;
		}
	}
};

const addComponent = (type: string) => {
	const clickX = contextMenuPosition.value.x;
	const clickY = contextMenuPosition.value.y;
	const canvasContainer = document.querySelector(".canvas-container");
	if (!canvasContainer) return;
	const rect = canvasContainer.getBoundingClientRect();
	const x = clickX - rect.left;
	const y = clickY - rect.top;
	const width = 100;
	const height = type === "text" ? 40 : 100;
	const newComponent: CanvasComponent = {
		id: uuidv4(),
		type,
		x: x - width / 2,
		y: y - height / 2,
		width,
		height,
		props: {
			backgroundColor: "#ffffff",
		},
	};
	currentPage.value.elements.push(newComponent);
	selectedElement.value = newComponent;
	showContextMenu.value = false;
};

const selectElement = (element: CanvasComponent, event: MouseEvent) => {
	selectedElement.value = element;
	event.stopPropagation();
};

const handleCanvasClick = () => {
	selectedElement.value = null;
};

const startPan = (event: MouseEvent) => {
	if (event.button !== 1) return;
	isPanning.value = true;
	panStart.value = { x: event.clientX, y: event.clientY };
	document.body.style.cursor = "grabbing";
};

const pan = (event: MouseEvent) => {
	if (!isPanning.value) return;
	const dx = event.clientX - panStart.value.x;
	const dy = event.clientY - panStart.value.y;
	canvasPosition.value = {
		x: canvasPosition.value.x + dx,
		y: canvasPosition.value.y + dy,
	};
	panStart.value = { x: event.clientX, y: event.clientY };
};

const endPan = () => {
	isPanning.value = false;
	document.body.style.cursor = "";
};

const zoom = (delta: number) => {
	const zoomFactor = delta > 0 ? 1.1 : 0.9;
	canvasZoom.value = Math.min(Math.max(0.1, canvasZoom.value * zoomFactor), 3);
};

const handleKeyDown = (e: KeyboardEvent) => {
	if (e.code === "Space") {
		document.body.style.cursor = "grab";
	}
	if (e.code === "Equal" && e.ctrlKey) {
		e.preventDefault();
		zoom(1);
	} else if (e.code === "Minus" && e.ctrlKey) {
		e.preventDefault();
		zoom(-1);
	}
};

const handleKeyUp = (e: KeyboardEvent) => {
	if (e.code === "Space") {
		document.body.style.cursor = "";
	}
};

const handleCanvasRightClick = (e: MouseEvent) => {
	e.preventDefault();
	contextMenuPosition.value = { x: e.clientX, y: e.clientY };
	showContextMenu.value = true;
};

// ========== LIFECYCLE ==========
onMounted(() => {
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
	window.addEventListener("mouseup", endPan);
	window.addEventListener("mousemove", pan);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeyDown);
	window.removeEventListener("keyup", handleKeyUp);
	window.removeEventListener("mouseup", endPan);
	window.removeEventListener("mousemove", pan);
});

// ========== WATCHERS ==========
watch(
	selectedElement,
	() => {
		// Handle selection changes
	},
	{ deep: true },
);
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <header class="h-14 border-b border-gray-200 bg-white flex items-center px-4">
      <!-- Header content -->
      <div class="flex items-center space-x-2">
        <button class="p-1.5 rounded-md hover:bg-gray-100 md:hidden">
          <div class="i-mdi-menu text-lg" />
        </button>
        <div class="hidden md:flex items-center space-x-2">
          <div class="font-bold text-xl">Wrikka</div>
          <div class="text-sm text-gray-500">Editor</div>
        </div>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center px-2 overflow-hidden">
        <div class="w-full max-w-2xl flex items-center justify-center">
          <h1 class="text-sm sm:text-base font-medium truncate text-center">
            {{ currentPage?.name || 'Untitled Document' }}
          </h1>
          <div class="ml-2 flex items-center text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 whitespace-nowrap">
            <div class="i-mdi-lock-outline text-xs mr-1" />
            <span>Private</span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-1 sm:space-x-2">
        <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md relative group hidden sm:block">
          <div class="i-mdi-eye-outline text-lg" />
          <span class="tooltip">Preview</span>
        </button>
        <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md relative group hidden md:block">
          <div class="i-mdi-account-plus-outline text-lg" />
          <span class="tooltip">Invite</span>
        </button>
        <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md relative group hidden lg:block">
          <div class="i-mdi-chart-bar text-lg" />
          <span class="tooltip">Analytics</span>
        </button>
        <div class="h-6 w-px bg-gray-200 mx-0.5 sm:mx-1 hidden sm:block"></div>
        <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md relative group">
          <div class="i-mdi-cog-outline text-lg" />
          <span class="tooltip">Settings</span>
        </button>
        <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md relative group">
          <div class="i-mdi-share-variant text-lg" />
          <span class="tooltip">Share</span>
        </button>
        <button class="ml-1 px-2 sm:px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
          <span class="hidden sm:inline">Publish</span>
          <span class="sm:hidden">Publish</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar -->
      <aside class="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
        <div class="space-y-4">
          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pages</h3>
            <div class="space-y-1">
              <div v-for="page in pages" :key="page.id" class="group flex items-center p-2 rounded-md hover:bg-gray-100" :class="{ 'bg-blue-50 text-blue-700': currentPageId === page.id }" @click="currentPageId = page.id">
                <div class="i-mdi-file-document-outline mr-2" />
                <span class="flex-1 truncate">{{ page.name }}</span>
                <button v-if="pages.length > 1" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500" @click.stop="deleteElement(page)">
                  <div class="i-mdi-close text-sm" />
                </button>
              </div>
              <button class="w-full flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-500" @click="addNewPage">
                <div class="i-mdi-plus mr-2" />
                <span>Add page</span>
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Layers</h3>
            <div class="space-y-1">
              <div class="flex items-center p-2 rounded-md hover:bg-gray-100">
                <div class="i-mdi-square-outline mr-2 text-blue-500" />
                <span>Frame 1</span>
              </div>
              <div class="flex items-center p-2 rounded-md hover:bg-gray-100">
                <div class="i-mdi-format-text mr-2 text-green-500" />
                <span>Heading</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Canvas Area -->
      <main class="flex-1 relative overflow-hidden bg-gray-50" @mousedown="startPan" @mousemove="pan" @mouseup="endPan" @mouseleave="endPan" @click="handleCanvasClick" @contextmenu.prevent="showContextMenu" @wheel.prevent.stop="zoom($event.deltaY > 0 ? -1 : 1)" @contextmenu="handleCanvasRightClick">
        <!-- Context Menu -->
        <div v-if="showContextMenu" class="fixed bg-white shadow-lg rounded-md py-1 z-50" :style="{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px`, minWidth: '200px' }">
          <div class="px-2 py-1 text-sm font-medium text-gray-500 border-b">
            Add Component
          </div>
          <div v-for="comp in componentTypes" :key="comp.id" class="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center" @click="addComponent(comp.id)">
            <div :class="`i-mdi-${comp.icon} mr-2`" />
            <span>{{ comp.name }}</span>
          </div>
        </div>

        <!-- Canvas Components -->
        <div class="absolute origin-center transition-transform duration-150 ease-in-out" :style="{ transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasZoom})`, width: '100%', height: '100%', backgroundImage: showGrid ? 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)' : 'none', backgroundSize: '20px 20px' }">
          <div v-for="comp in currentPage.elements" :key="comp.id" class="absolute border border-transparent hover:border-blue-400" :class="{ 'border-blue-500': selectedElement === comp }" :style="{ left: `${comp.x}px`, top: `${comp.y}px`, width: `${comp.width}px`, height: `${comp.height}px`, backgroundColor: comp.props.backgroundColor }" @click.stop="selectElement(comp, $event)">
            <div v-if="comp.type === 'text'" class="w-full h-full p-2" :style="{ color: comp.props.color }">
              {{ comp.props.text }}
            </div>
            <div v-else-if="comp.type === 'image'" class="w-full h-full bg-gray-200 flex items-center justify-center">
              <div class="i-mdi-image text-4xl text-gray-400" />
            </div>
            <div v-else-if="comp.type === 'button'" class="w-full h-full bg-blue-500 text-white flex items-center justify-center rounded" :style="{ backgroundColor: comp.props.color }">
              Button
            </div>
          </div>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside class="w-72 border-l border-gray-200 bg-white p-4 overflow-y-auto">
        <h2 class="text-lg font-medium mb-4">Properties</h2>
        <div v-if="selectedElement">
          <!-- Common properties for all components -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500">X</label>
                  <input type="number" v-model="selectedElement.x" class="w-full px-2 py-1 border rounded" />
                </div>
                <div>
                  <label class="text-xs text-gray-500">Y</label>
                  <input type="number" v-model="selectedElement.y" class="w-full px-2 py-1 border rounded" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500">Width</label>
                  <input type="number" v-model="selectedElement.width" class="w-full px-2 py-1 border rounded" />
                </div>
                <div>
                  <label class="text-xs text-gray-500">Height</label>
                  <input type="number" v-model="selectedElement.height" class="w-full px-2 py-1 border rounded" />
                </div>
              </div>
            </div>

            <!-- Text component specific properties -->
            <div v-if="selectedElement.type === 'text'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
              <textarea v-model="selectedElement.props.text" class="w-full px-2 py-1 border rounded" rows="3"></textarea>

              <label class="block text-sm font-medium text-gray-700 mt-2 mb-1">Text Color</label>
              <input type="color" v-model="selectedElement.props.color" class="w-full h-8" />
            </div>

            <!-- Image component specific properties -->
            <div v-if="selectedElement.type === 'image'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" v-model="selectedElement.props.src" class="w-full px-2 py-1 border rounded" placeholder="https://example.com/image.jpg" />
            </div>

            <!-- Background color for all components -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input type="color" v-model="selectedElement.props.backgroundColor" class="w-full h-8" />
            </div>

            <button @click="deleteElement(selectedElement)" class="mt-4 px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600">
              Delete Component
            </button>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">
          Select a component to edit its properties
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Tooltip */
.tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #1f2937;
  color: white;
  font-size: 0.75rem;
  line-height: 1rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
  z-index: 100;
  transform-origin: top center;
}

.group:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
