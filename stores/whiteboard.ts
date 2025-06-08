import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Drawing, DrawingTool, Point, ViewState } from '~/types/whiteboard';

const DEFAULT_VIEW_STATE: ViewState = {
  x: 0,
  y: 0,
  scale: 1
};

const ZOOM_SENSITIVITY = 0.1;
const PAN_SENSITIVITY = 1.5;

export const useWhiteboardStore = defineStore('whiteboard', () => {
  // View state
  const viewState = ref<ViewState>({ ...DEFAULT_VIEW_STATE });
  const isPanning = ref(false);
  const lastMousePos = ref<Point>({ x: 0, y: 0 });
  
  // Transform canvas coordinates to screen coordinates
  const toScreenCoords = (point: Point): Point => ({
    x: (point.x - viewState.value.x) * viewState.value.scale,
    y: (point.y - viewState.value.y) * viewState.value.scale
  });
  
  // Transform screen coordinates to canvas coordinates
  const toCanvasCoords = (point: Point): Point => ({
    x: point.x / viewState.value.scale + viewState.value.x,
    y: point.y / viewState.value.scale + viewState.value.y
  });
  
  // Zoom to a specific point (mouse position)
  const zoom = (delta: number, point: Point) => {
    const zoom = Math.exp(delta * ZOOM_SENSITIVITY);
    const newScale = viewState.value.scale * zoom;
    
    // Limit zoom levels
    if (newScale < 0.1 || newScale > 10) return;
    
    // Calculate new position to zoom toward the mouse
    const worldPoint = toCanvasCoords(point);
    viewState.value.x = point.x / newScale + viewState.value.x - worldPoint.x / viewState.value.scale * newScale;
    viewState.value.y = point.y / newScale + viewState.value.y - worldPoint.y / viewState.value.scale * newScale;
    viewState.value.scale = newScale;
  };
  
  // Start panning
  const startPan = (point: Point) => {
    isPanning.value = true;
    lastMousePos.value = { ...point };
  };
  
  // Update pan
  const updatePan = (point: Point) => {
    if (!isPanning.value) return;
    
    const dx = (point.x - lastMousePos.value.x) / viewState.value.scale;
    const dy = (point.y - lastMousePos.value.y) / viewState.value.scale;
    
    viewState.value.x -= dx * PAN_SENSITIVITY;
    viewState.value.y -= dy * PAN_SENSITIVITY;
    
    lastMousePos.value = { ...point };
  };
  
  // Stop panning
  const stopPan = () => {
    isPanning.value = false;
  };
  
  // Reset view
  const resetView = () => {
    viewState.value = { ...DEFAULT_VIEW_STATE };
  };
  
  // Drawing state
  const drawings = ref<Drawing[]>([]);
  const currentDrawing = ref<Drawing | null>(null);
  const isDrawing = ref(false);
  const currentTool = ref<DrawingTool>('pen');
  const currentColor = ref('#000000');
  const currentWidth = ref(2);
  const showTextInput = ref(false);
  const textInput = ref('');
  const textPosition = ref<Point>({ x: 0, y: 0 });

  // Actions
  const startDrawing = (point: Point) => {
    if (currentTool.value === 'text') {
      textPosition.value = point;
      showTextInput.value = true;
      return;
    }

    isDrawing.value = true;
    currentDrawing.value = {
      id: Date.now(),
      points: [point],
      color: currentColor.value,
      width: currentWidth.value,
      type: currentTool.value,
      startPoint: { ...point },
      endPoint: { ...point },
    };
    drawings.value.push(currentDrawing.value);
  };

  const updateDrawing = (point: Point) => {
    if (!isDrawing.value || !currentDrawing.value) return;

    if (currentTool.value === 'pen') {
      currentDrawing.value.points.push(point);
    } else {
      currentDrawing.value.endPoint = point;
    }
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
        type: 'text',
        text: textInput.value,
        startPoint: { ...textPosition.value },
        endPoint: { ...textPosition.value },
      });
      textInput.value = '';
      showTextInput.value = false;
    }
  };

  const clearCanvas = () => {
    drawings.value = [];
  };

  const undo = () => {
    drawings.value.pop();
  };

  return {
    // State
    drawings,
    currentDrawing,
    isDrawing,
    currentTool,
    currentColor,
    currentWidth,
    showTextInput,
    textInput,
    textPosition,
    viewState,
    isPanning,
    
    // Actions
    startDrawing,
    updateDrawing,
    stopDrawing,
    addText,
    clearCanvas,
    undo,
    
    // View transformations
    toScreenCoords,
    toCanvasCoords,
    zoom,
    startPan,
    updatePan,
    stopPan,
    resetView,
  };
}, {
  persist: true, // Optional: Enable persistence if needed
});
