<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useFullscreen } from "@vueuse/core";

type Point = { x: number; y: number };
type Drawing = {
  id: number;
  points: Point[];
  color: string;
  width: number;
  type: "pen" | "rectangle" | "ellipse" | "text";
  text?: string;
  startPoint?: Point;
  endPoint?: Point;
};

definePageMeta({
  layout: "fullscreen",
});

const { isFullscreen, toggle } = useFullscreen();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const currentTool = ref<"pen" | "rectangle" | "ellipse" | "text" | "select">("pen");
const currentColor = ref("#000000");
const currentWidth = ref(2);
const drawings = ref<Drawing[]>([]);
const currentDrawing = ref<Drawing | null>(null);
const textInput = ref("");
const showTextInput = ref(false);
const textPosition = ref({ x: 0, y: 0 });

const colors = [
  "var(--text)",
  "var(--background)",
  "var(--color-error)",
  "var(--color-success)",
  "var(--color-primary)",
  "var(--color-alert)",
  "var(--color-secondary)",
  "var(--color-primary)",
  "var(--border)",
  "var(--text)/50",
];

const tools = [
  { id: "pen", icon: "i-mdi-pencil", name: "pen" },
  { id: "rectangle", icon: "i-mdi-rectangle-outline", name: "rectangle" },
  { id: "ellipse", icon: "i-mdi-circle-outline", name: "ellipse" },
  { id: "text", icon: "i-mdi-format-text", name: "text" },
  { id: "select", icon: "i-mdi-cursor-default-outline", name: "select" },
];

onMounted(() => {
  if (canvasRef.value) {
    context.value = canvasRef.value.getContext("2d");
    resizeCanvas();
    redraw();
  }
  window.addEventListener("resize", resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

const resizeCanvas = () => {
  if (canvasRef.value) {
    const container = canvasRef.value.parentElement;
    if (container) {
      canvasRef.value.width = container.clientWidth;
      canvasRef.value.height = container.clientHeight;
      redraw();
    }
  }
};

const startDrawing = (e: MouseEvent) => {
  if (!canvasRef.value || !context.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (currentTool.value === "text") {
    textPosition.value = { x, y };
    showTextInput.value = true;
    return;
  }


  isDrawing.value = true;

  currentDrawing.value = {
    id: Date.now(),
    points: [{ x, y }],
    color: currentColor.value,
    width: currentWidth.value,
    type: currentTool.value as "pen" | "rectangle" | "ellipse",
    startPoint: { x, y },
    endPoint: { x, y },
  };

  drawings.value.push(currentDrawing.value);
};

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !canvasRef.value || !currentDrawing.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (currentTool.value === "pen") {
    currentDrawing.value.points.push({ x, y });
  } else {
    currentDrawing.value.endPoint = { x, y };
  }

  redraw();
};

const stopDrawing = () => {
  isDrawing.value = false;
  currentDrawing.value = null;
};

const addText = () => {
  if (textInput.value.trim() && showTextInput.value) {
    drawings.value.push({
      id: Date.now(),
      points: [],
      color: currentColor.value,
      width: currentWidth.value,
      type: "text",
      text: textInput.value,
      startPoint: { ...textPosition.value },
      endPoint: { ...textPosition.value },
    });
    textInput.value = "";
    showTextInput.value = false;
    redraw();
  }
};

const redraw = () => {
  if (!canvasRef.value || !context.value) return;

  // Clear canvas
  context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);


  // Draw grid
  drawGrid();

  // Draw all shapes
  for (const drawing of drawings.value) {
    if (drawing.type === "pen") {
      drawFreehand(drawing);
    } else if (drawing.type === "rectangle") {
      drawRectangle(drawing);
    } else if (drawing.type === "ellipse") {
      drawEllipse(drawing);
    } else if (drawing.type === "text" && drawing.text && drawing.startPoint) {
      drawText(drawing);
    }
  }
};

const drawGrid = () => {
  if (!canvasRef.value || !context.value) return;

  const gridSize = 20;
  const width = canvasRef.value.width;
  const height = canvasRef.value.height;

  context.value.strokeStyle = "#e0e0e0";
  context.value.lineWidth = 1;

  // Draw vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    context.value.beginPath();
    context.value.moveTo(x, 0);
    context.value.lineTo(x, height);
    context.value.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    context.value.beginPath();
    context.value.moveTo(0, y);
    context.value.lineTo(width, y);
    context.value.stroke();
  }
};

const drawFreehand = (drawing: Drawing) => {
  if (!context.value || drawing.points.length < 2) return;

  context.value.beginPath();
  context.value.strokeStyle = drawing.color;
  context.value.lineWidth = drawing.width;
  context.value.lineCap = "round";
  context.value.lineJoin = "round";

  context.value.moveTo(drawing.points[0].x, drawing.points[0].y);
  for (let i = 1; i < drawing.points.length; i++) {
    context.value.lineTo(drawing.points[i].x, drawing.points[i].y);
  }
  context.value.stroke();
};

const drawRectangle = (drawing: Drawing) => {
  if (!context.value || !drawing.startPoint || !drawing.endPoint) return;

  const width = drawing.endPoint.x - drawing.startPoint.x;
  const height = drawing.endPoint.y - drawing.startPoint.y;

  context.value.beginPath();
  context.value.strokeStyle = drawing.color;
  context.value.lineWidth = drawing.width;
  context.value.strokeRect(
    drawing.startPoint.x,
    drawing.startPoint.y,
    width,
    height
  );
};

const drawEllipse = (drawing: Drawing) => {
  if (!context.value || !drawing.startPoint || !drawing.endPoint) return;

  const centerX = (drawing.startPoint.x + drawing.endPoint.x) / 2;
  const centerY = (drawing.startPoint.y + drawing.endPoint.y) / 2;
  const radiusX = Math.abs(drawing.endPoint.x - drawing.startPoint.x) / 2;
  const radiusY = Math.abs(drawing.endPoint.y - drawing.startPoint.y) / 2;

  context.value.beginPath();
  context.value.strokeStyle = drawing.color;
  context.value.lineWidth = drawing.width;
  context.value.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.value.stroke();
};

const drawText = (drawing: Drawing) => {
  if (!context.value || !drawing.text || !drawing.startPoint) return;

  context.value.font = `${drawing.width * 2}px Arial`;
  context.value.fillStyle = drawing.color;
  context.value.fillText(
    drawing.text,
    drawing.startPoint.x,
    drawing.startPoint.y + drawing.width * 2
  );
};

const clearCanvas = () => {
  drawings.value = [];
  redraw();
};

const undo = () => {
  drawings.value.pop();
  redraw();
};

const saveCanvas = () => {
  if (!canvasRef.value) return;
  
  const link = document.createElement('a');
  link.download = 'whiteboard.png';
  link.href = canvasRef.value.toDataURL('image/png');
  link.click();
};
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="px-6 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-800">Whiteboard</h1>
          <div class="flex space-x-1">
            <button 
              v-for="tool in tools" 
              :key="tool.id"
              @click="currentTool = tool.id as any"
              :class="[
                'p-2 rounded-md transition-colors',
                currentTool === tool.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
              :title="tool.name"
            >
              <div :class="tool.icon + ' w-6 h-6'"></div>
            </button>
          </div>
          
          <!-- Color Picker -->
          <div class="flex items-center space-x-2 ml-4">
            <div 
              v-for="(color, index) in colors" 
              :key="index"
              @click="currentColor = color"
              :style="{ backgroundColor: color }"
              class="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
              :class="{ 'ring-2 ring-offset-2 ring-blue-500': currentColor === color }"
            ></div>
          </div>
          
          <!-- Line Width -->
          <div class="flex items-center space-x-2 ml-4">
            <input 
              type="range" 
              v-model="currentWidth" 
              min="1" 
              max="20" 
              class="w-24"
            >
            <span class="text-sm text-gray-600">{{ currentWidth }}px</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            @click="undo"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Undo"
          >
            <div class="i-mdi-undo w-6 h-6"></div>
          </button>
          <button 
            @click="clearCanvas"
            class="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
            title="Clear Canvas"
          >
            <div class="i-mdi-trash-can-outline w-6 h-6"></div>
          </button>
          <button 
            @click="toggle()"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          >
            <div :class="isFullscreen ? 'i-mdi-fullscreen-exit' : 'i-mdi-fullscreen'" class="w-6 h-6"></div>
          </button>
          <button 
            @click="saveCanvas"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <div class="i-mdi-content-save-outline w-5 h-5"></div>
            <span>Save</span>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1 overflow-hidden bg-gray-100 relative" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing">
      <canvas
        ref="canvasRef"
        class="absolute top-0 left-0 w-full h-full bg-white"
      ></canvas>
      
      <!-- Text Input -->
      <div 
        v-if="showTextInput" 
        :style="{
          position: 'absolute',
          left: `${textPosition.x}px`,
          top: `${textPosition.y}px`,
          zIndex: 1000
        }"
        class="bg-white p-1 rounded shadow-lg"
      >
        <input
          v-model="textInput"
          @keyup.enter="addText"
          @blur="addText"
          @keydown.esc="showTextInput = false"
          class="border border-gray-300 rounded p-1 outline-none"
          autofocus
        />
      </div>
    </main>
    
    <!-- Status Bar -->
    <footer class="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
      <div class="flex justify-between items-center">
        <span>Tool: {{ currentTool }}</span>
        <div class="flex space-x-4">
          <span>Brush Size: {{ currentWidth }}px</span>
          <span>Color: {{ currentColor }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Add smooth transitions for a polished feel */
button, a, input, select {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>