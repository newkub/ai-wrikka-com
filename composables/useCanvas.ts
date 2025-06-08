import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Drawing, ViewState } from '~/types/whiteboard';

export const useCanvas = (canvasRef: Ref<HTMLCanvasElement | null>, viewStateRef: Ref<ViewState>) => {
  const context = ref<CanvasRenderingContext2D | null>(null);
  
  const initCanvas = () => {
    if (!canvasRef.value) return;
    
    const canvas = canvasRef.value;
    const dpr = window.devicePixelRatio || 1;
    
    // Set display size (CSS pixels)
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Set actual size in memory (scaled for DPI)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Get drawing context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Scale the context to ensure crisp drawing on high-DPI displays
    ctx.scale(dpr, dpr);
    
    // Apply initial view state
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(viewStateRef.value.scale, viewStateRef.value.scale);
    ctx.translate(-viewStateRef.value.x, -viewStateRef.value.y);
    
    context.value = ctx;
    
    // Clear the canvas
    clearCanvas();
  };
  
  const clearCanvas = (bgColor = '#ffffff') => {
    if (!canvasRef.value || !context.value) return;
    
    const ctx = context.value;
    
    // Save current transform
    const transform = ctx.getTransform();
    
    // Reset transform to identity
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Clear the entire canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    
    // Restore transform
    ctx.setTransform(transform);
    return true;
  };
  
  const redraw = (drawings: Drawing[]) => {
    if (!canvasRef.value || !context.value) return;

    // Clear canvas with white background
    context.value.fillStyle = '#ffffff';
    context.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

    // Draw all shapes
    for (const drawing of drawings) {
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
  
  const drawFreehand = (drawing: Drawing) => {
    if (!context.value || drawing.points.length < 2) return;
    
    const { points, color, width } = drawing;
    
    context.value.beginPath();
    context.value.strokeStyle = color;
    context.value.lineWidth = width;
    context.value.lineCap = 'round';
    context.value.lineJoin = 'round';
    
    context.value.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      context.value.lineTo(points[i].x, points[i].y);
    }
    
    context.value.stroke();
  };
  
  const drawRectangle = (drawing: Drawing) => {
    if (!context.value || !drawing.startPoint || !drawing.endPoint) return;
    
    const { startPoint, endPoint, color, width } = drawing;
    const x = Math.min(startPoint.x, endPoint.x);
    const y = Math.min(startPoint.y, endPoint.y);
    const rectWidth = Math.abs(endPoint.x - startPoint.x);
    const rectHeight = Math.abs(endPoint.y - startPoint.y);
    
    context.value.strokeStyle = color;
    context.value.lineWidth = width;
    context.value.strokeRect(x, y, rectWidth, rectHeight);
  };
  
  const drawEllipse = (drawing: Drawing) => {
    if (!context.value || !drawing.startPoint || !drawing.endPoint) return;
    
    const { startPoint, endPoint, color, width } = drawing;
    const centerX = (startPoint.x + endPoint.x) / 2;
    const centerY = (startPoint.y + endPoint.y) / 2;
    const radiusX = Math.abs(endPoint.x - startPoint.x) / 2;
    const radiusY = Math.abs(endPoint.y - startPoint.y) / 2;
    
    context.value.beginPath();
    context.value.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.value.strokeStyle = color;
    context.value.lineWidth = width;
    context.value.stroke();
  };
  
  const drawText = (drawing: Drawing) => {
    if (!context.value || !drawing.text || !drawing.startPoint) return;
    
    const { startPoint, color, width, text } = drawing;
    
    context.value.font = `${width * 2}px Arial`;
    context.value.fillStyle = color;
    context.value.fillText(text, startPoint.x, startPoint.y);
  };
  
  // Watch for view state changes and redraw
  watch(viewStateRef, (newState) => {
    if (canvasRef.value && context.value) {
      context.value.setTransform(1, 0, 0, 1, 0, 0);
      context.value.scale(newState.scale, newState.scale);
      context.value.translate(-newState.x, -newState.y);
      // Redraw will be handled by the watch on drawings in whiteboard.vue
    }
  }, { deep: true });
  
  onMounted(initCanvas);
  onMounted(() => window.addEventListener('resize', initCanvas));
  onUnmounted(() => window.removeEventListener('resize', initCanvas));
  
  return {
    context,
    initCanvas,
    clearCanvas,
    redraw,
    drawFreehand,
    drawRectangle,
    drawEllipse,
    drawText
  };
};
