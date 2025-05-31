import { ref, onMounted, onUnmounted } from 'vue';

export interface Point {
  x: number
  y: number
}

export interface Drawable {
  id: string
  points: Point[]
  color: string
  width: number
  type: 'drawing' | 'text' | 'shape'
  text?: string
}

export function useWriteboard(canvasRef: Ref<HTMLCanvasElement | null>) {
  const isDrawing = ref(false)
  const currentDrawable = ref<Drawable | null>(null)
  const drawables = ref<Drawable[]>([])
  const selectedColor = ref('#000000')
  const selectedWidth = ref(2)
  
  let ctx: CanvasRenderingContext2D | null = null
  
  // Initialize canvas
  const initCanvas = () => {
    if (!canvasRef.value) return
    
    const canvas = canvasRef.value
    ctx = canvas.getContext('2d')
    
    // Set canvas size to match parent container
    const resizeCanvas = () => {
      if (!canvas.parentElement) return
      
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      
      // Redraw everything
      redraw()
    }
    
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }
  
  // Drawing functions
  const startDrawing = (e: MouseEvent | TouchEvent) => {
    if (!ctx || !canvasRef.value) return
    
    isDrawing.value = true
    const point = getMousePos(canvasRef.value, e)
    
    currentDrawable.value = {
      id: Date.now().toString(),
      points: [point],
      color: selectedColor.value,
      width: selectedWidth.value,
      type: 'drawing'
    }
    
    drawables.value.push(currentDrawable.value)
  }
  
  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing.value || !currentDrawable.value || !canvasRef.value) return
    
    const point = getMousePos(canvasRef.value, e)
    currentDrawable.value.points.push(point)
    
    // Draw the current line
    if (currentDrawable.value.points.length > 1) {
      redraw()
    }
  }
  
  const stopDrawing = () => {
    isDrawing.value = false
    currentDrawable.value = null
  }
  
  // Helper to get mouse/touch position
  const getMousePos = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent): Point => {
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }
  
  // Redraw all drawables
  const redraw = () => {
    if (!ctx || !canvasRef.value) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    
    // Draw all drawables
    for (const drawable of drawables.value) {
      if (drawable.points.length === 0) continue
      
      const currentCtx = ctx
      currentCtx.strokeStyle = drawable.color
      currentCtx.lineWidth = drawable.width
      currentCtx.lineCap = 'round'
      currentCtx.lineJoin = 'round'
      
      currentCtx.beginPath()
      currentCtx.moveTo(drawable.points[0].x, drawable.points[0].y)
      
      for (let i = 1; i < drawable.points.length; i++) {
        currentCtx.lineTo(drawable.points[i].x, drawable.points[i].y)
      }
      
      currentCtx.stroke()
    }
  }
  
  // Clear the canvas
  const clearCanvas = () => {
    drawables.value = []
    const currentCtx = ctx
    if (currentCtx && canvasRef.value) {
      currentCtx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }
  
  // Set up event listeners
  onMounted(() => {
    const cleanup = initCanvas()
    
    onUnmounted(() => {
      if (cleanup) cleanup()
    })
  })
  
  return {
    isDrawing,
    drawables,
    selectedColor,
    selectedWidth,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    redraw
  }
}
