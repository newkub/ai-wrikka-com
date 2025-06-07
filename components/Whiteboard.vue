<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

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

const props = defineProps<{
	width?: string;
	height?: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const currentTool = ref<"pen" | "rectangle" | "ellipse" | "text" | "select">(
	"pen",
);
const currentColor = ref("#000000");
const currentWidth = ref(2);
const drawings = ref<Drawing[]>([]);
const currentDrawing = ref<Drawing | null>(null);
const textInput = ref("");
const showTextInput = ref(false);
const textPosition = ref({ x: 0, y: 0 });

const colors = [
	"var(--text)", // text color
	"var(--background)", // background color
	"var(--color-error)", // red
	"var(--color-success)", // green
	"var(--color-primary)", // blue
	"var(--color-alert)", // yellow
	"var(--color-secondary)", // cyan
	"var(--color-primary)", // magenta (using primary as fallback)
	"var(--border)", // silver
	"var(--text)/50", // gray
];

const tools = [
	{ id: "pen", icon: "i-mdi-pencil" },
	{ id: "rectangle", icon: "i-mdi-rectangle-outline" },
	{ id: "ellipse", icon: "i-mdi-circle-outline" },
	{ id: "text", icon: "i-mdi-format-text" },
	{ id: "select", icon: "i-mdi-cursor-default-outline" },
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
	context.value.lineJoin = "round";
	context.value.lineCap = "round";

	context.value.moveTo(drawing.points[0].x, drawing.points[0].y);

	for (let i = 1; i < drawing.points.length; i++) {
		context.value.lineTo(drawing.points[i].x, drawing.points[i].y);
	}

	context.value.stroke();
};

const drawRectangle = (drawing: Drawing) => {
	if (!context.value || !drawing.startPoint || !drawing.endPoint) return;

	const x = Math.min(drawing.startPoint.x, drawing.endPoint.x);
	const y = Math.min(drawing.startPoint.y, drawing.endPoint.y);
	const width = Math.abs(drawing.endPoint.x - drawing.startPoint.x);
	const height = Math.abs(drawing.endPoint.y - drawing.startPoint.y);

	context.value.strokeStyle = drawing.color;
	context.value.lineWidth = drawing.width;
	context.value.strokeRect(x, y, width, height);
};

const drawEllipse = (drawing: Drawing) => {
	if (!context.value || !drawing.startPoint || !drawing.endPoint) return;

	const x = (drawing.startPoint.x + drawing.endPoint.x) / 2;
	const y = (drawing.startPoint.y + drawing.endPoint.y) / 2;
	const radiusX = Math.abs(drawing.endPoint.x - drawing.startPoint.x) / 2;
	const radiusY = Math.abs(drawing.endPoint.y - drawing.startPoint.y) / 2;

	context.value.beginPath();
	context.value.strokeStyle = drawing.color;
	context.value.lineWidth = drawing.width;
	context.value.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
	context.value.stroke();
};

const drawText = (drawing: Drawing) => {
	if (!context.value || !drawing.text || !drawing.startPoint) return;

	context.value.fillStyle = drawing.color;
	context.value.font = `${drawing.width * 2}px Arial`;
	context.value.fillText(
		drawing.text,
		drawing.startPoint.x,
		drawing.startPoint.y + drawing.width * 2,
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

	const link = document.createElement("a");
	link.download = "whiteboard.png";
	link.href = canvasRef.value.toDataURL("image/png");
	link.click();
};
</script>

<template>
  <div class="flex flex-col h-full w-full bg-block">
    <!-- Toolbar -->
    <div class="p-2 border-t border-border flex-shrink-0">
      <div class="flex space-x-1">
        <button 
          v-for="tool in tools" 
          :key="tool.id"
          @click="currentTool = tool.id as any"
          :class="[
            'p-2 rounded',
            currentTool === tool.id 
              ? 'bg-color-primary/20 text-color-primary' 
              : 'hover:bg-block'
          ]"
          :title="tool.id"
        >
          <div :class="tool.icon" class="text-xl" />
        </button>
      </div>
      
      <div class="mx-4 h-8 w-px bg-gray-300" />
      
      <div class="flex items-center space-x-2">
        <input 
          v-model="currentWidth" 
          type="range" 
          min="1" 
          max="20" 
          class="w-24"
        >
        <span class="text-sm w-8 text-center">{{ currentWidth }}px</span>
      </div>
      
      <div class="mx-4 h-8 w-px bg-gray-300" />
      
      <div class="flex space-x-1">
        <button 
          v-for="color in colors" 
          :key="color"
          @click="currentColor = color"
          :class="[
            'w-8 h-8 rounded-full border-2',
            currentColor === color ? 'border-color-primary' : 'border-transparent'
          ]"
          :style="{ backgroundColor: color }"
          :title="color"
        />
      </div>
      
      <div class="flex-1" />
      
      <div class="flex space-x-2">
        <button 
          @click="undo"
          class="p-2 rounded hover:bg-gray-100"
          title="Undo"
        >
          <div class="i-mdi-undo text-xl" />
        </button>
        <button 
          @click="clearCanvas"
          class="p-2 rounded hover:bg-gray-100"
          title="Clear"
        >
          <div class="i-mdi-trash-can-outline text-xl" />
        </button>
        <button 
          @click="saveCanvas"
          class="px-4 py-2 bg-color-primary text-background rounded hover:opacity-90 flex items-center space-x-2"
        >
          <div class="i-mdi-content-save-outline" />
          <span>Save</span>
        </button>
      </div>
    </div>
    
    <!-- Canvas Container -->
    <div class="flex-1 relative overflow-hidden h-full">
      <canvas
        ref="canvasRef"
        class="absolute inset-0 w-full h-full block"
        :style="{
          cursor: currentTool === 'pen' ? 'crosshair' : 'default'
        }"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      ></canvas>
      
      <!-- Text Input Modal -->
      <div 
        v-if="showTextInput"
        class="absolute bg-block p-2 rounded shadow-lg border border-border"
        :style="{
          left: `${textPosition.x}px`,
          top: `${textPosition.y}px`
        }"
      >
        <input
          v-model="textInput"
          type="text"
          class="w-64 px-2 py-1 border border-border rounded bg-background"
          placeholder="Enter text..."
          @keyup.enter="addText"
          @blur="showTextInput = false"
          autofocus
        >
      </div>
    </div>
  </div>
</template>
