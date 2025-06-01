import { onMounted, onUnmounted, ref } from 'vue';

type Tool = 'select' | 'hand' | 'pen' | 'eraser' | 'line' | 'text' | 'rectangle' | 'circle' | 'triangle' | 'image';

export interface Point {
  x: number
  y: number
}

export interface Drawable {
  id: string
  points: Point[]
  color: string
  width: number
  type: 'drawing' | 'text' | 'shape' | 'line' | 'rectangle' | 'circle' | 'triangle' | 'image'
  text?: string
  isSelected?: boolean
  startX?: number
  startY?: number
}

export function useWhiteboard(canvasRef: Ref<HTMLCanvasElement | null>) {
  const isDrawing = ref(false)
  const currentDrawable = ref<Drawable | null>(null)
  const drawables = ref<Drawable[]>([])
  const selectedColor = ref('#000000')
  const selectedWidth = ref(2)
  const activeTool = ref<Tool>('pen')
  const isDragging = ref(false)
  const dragStart = ref<Point | null>(null)
  
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
    
    const point = getMousePos(canvasRef.value, e)
    
    if (activeTool.value === 'select') {
      // Handle selection
      const selected = getDrawableAtPoint(point)
      if (selected) {
        // Toggle selection
        drawables.value = drawables.value.map(d => ({
          ...d,
          isSelected: d.id === selected.id ? !d.isSelected : d.isSelected
        }))
        isDragging.value = true
        dragStart.value = point
      }
      return
    }
    
    isDrawing.value = true
    
    // Create a new drawable based on the active tool
    currentDrawable.value = {
      id: Date.now().toString(),
      points: [point],
      color: selectedColor.value,
      width: selectedWidth.value,
      type: getDrawableType(),
      startX: point.x,
      startY: point.y
    }
    
    // For text tool, we'll handle it differently
    if (activeTool.value === 'text') {
      const text = prompt('Enter text:', 'Text')
      if (text) {
        currentDrawable.value.text = text
        currentDrawable.value.points.push({ x: point.x + 100, y: point.y + 20 }) // Default size
        drawables.value.push({ ...currentDrawable.value })
        redraw()
      }
      currentDrawable.value = null
      isDrawing.value = false
      return
    }
    
    drawables.value.push({ ...currentDrawable.value })
  }
  
  const draw = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.value) return
    
    const point = getMousePos(canvasRef.value, e)
    
    if (activeTool.value === 'select' && isDragging.value && dragStart.value) {
      // Move selected drawables
      const dx = point.x - dragStart.value.x
      const dy = point.y - dragStart.value.y
      
      drawables.value = drawables.value.map(drawable => {
        if (drawable.isSelected) {
          return {
            ...drawable,
            points: drawable.points.map(p => ({
              x: p.x + dx,
              y: p.y + dy
            })),
            startX: drawable.startX ? drawable.startX + dx : undefined,
            startY: drawable.startY ? drawable.startY + dy : undefined
          }
        }
        return drawable
      })
      
      dragStart.value = point
      redraw()
      return
    }
    
    if (!isDrawing.value || !currentDrawable.value) return
    
    // Update the current drawable based on tool
    if (['pen', 'eraser'].includes(activeTool.value)) {
      currentDrawable.value.points.push(point)
    } else if (['line', 'rectangle', 'circle', 'triangle'].includes(activeTool.value)) {
      // For shapes, update the end point
      if (currentDrawable.value.points.length > 1) {
        currentDrawable.value.points[1] = point
      } else {
        currentDrawable.value.points.push(point)
      }
    }
    
    // Update the last drawable in the array
    if (drawables.value.length > 0) {
      drawables.value[drawables.value.length - 1] = { ...currentDrawable.value }
    }
    
    redraw()
  }
  
  const stopDrawing = () => {
    isDrawing.value = false
    isDragging.value = false
    dragStart.value = null
    
    // If we were drawing a shape, finalize it
    if (currentDrawable.value) {
      if (currentDrawable.value.type === 'rectangle' && 
          currentDrawable.value.points.length === 2) {
        // Ensure we have a valid rectangle
        const [start, end] = currentDrawable.value.points
        if (Math.abs(start.x - end.x) < 5 || Math.abs(start.y - end.y) < 5) {
          // Too small, remove it
          drawables.value.pop()
        }
      }
      currentDrawable.value = null
    }
    
    redraw()
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
  
  // Helper to get drawable type based on active tool
  const getDrawableType = (): Drawable['type'] => {
    switch (activeTool.value) {
      case 'pen':
      case 'eraser':
        return 'drawing'
      case 'line':
        return 'line'
      case 'rectangle':
        return 'rectangle'
      case 'circle':
        return 'circle'
      case 'triangle':
        return 'triangle'
      case 'text':
        return 'text'
      case 'image':
        return 'image'
      default:
        return 'drawing'
    }
  }
  
  // Helper to get drawable at point (for selection)
  const getDrawableAtPoint = (point: Point): Drawable | null => {
    // Simple hit testing - check if point is near any drawable
    for (let i = drawables.value.length - 1; i >= 0; i--) {
      const drawable = drawables.value[i]
      
      // For simplicity, we'll just check if point is near the first point of the drawable
      if (drawable.points.length > 0) {
        const p = drawable.points[0]
        const distance = Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2)
        if (distance < 20) { // 20px threshold
          return drawable
        }
      }
    }
    return null
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
      
      // Set drawing style
      currentCtx.strokeStyle = drawable.color
      currentCtx.fillStyle = drawable.color
      currentCtx.lineWidth = drawable.width
      currentCtx.lineCap = 'round'
      currentCtx.lineJoin = 'round'
      
      if (drawable.type === 'text' && drawable.text) {
        // Draw text
        currentCtx.font = `${drawable.width * 2}px Arial`
        currentCtx.fillText(drawable.text, drawable.points[0].x, drawable.points[0].y)
      } else if (drawable.type === 'line' && drawable.points.length === 2) {
        // Draw line
        const [start, end] = drawable.points
        currentCtx.beginPath()
        currentCtx.moveTo(start.x, start.y)
        currentCtx.lineTo(end.x, end.y)
        currentCtx.stroke()
      } else if (drawable.type === 'rectangle' && drawable.points.length === 2) {
        // Draw rectangle
        const [start, end] = drawable.points
        const width = end.x - start.x
        const height = end.y - start.y
        currentCtx.beginPath()
        currentCtx.rect(start.x, start.y, width, height)
        currentCtx.stroke()
      } else if (drawable.type === 'circle' && drawable.points.length === 2) {
        // Draw circle
        const [start, end] = drawable.points
        const radius = Math.sqrt(
          (end.x - start.x) ** 2 + (end.y - start.y) ** 2
        )
        currentCtx.beginPath()
        currentCtx.arc(start.x, start.y, radius, 0, Math.PI * 2)
        currentCtx.stroke()
      } else if (drawable.type === 'triangle' && drawable.points.length === 2) {
        // Draw triangle
        const [start, end] = drawable.points
        currentCtx.beginPath()
        currentCtx.moveTo(start.x, start.y)
        currentCtx.lineTo(end.x, end.y)
        currentCtx.lineTo(start.x * 2 - end.x, end.y)
        currentCtx.closePath()
        currentCtx.stroke()
      } else if (drawable.type === 'drawing') {
        // Draw freehand
        if (drawable.points.length < 2) continue
        
        currentCtx.beginPath()
        currentCtx.moveTo(drawable.points[0].x, drawable.points[0].y)
        
        for (let i = 1; i < drawable.points.length; i++) {
          currentCtx.lineTo(drawable.points[i].x, drawable.points[i].y)
        }
        
        currentCtx.stroke()
      }
      
      // Draw selection outline if selected
      if (drawable.isSelected) {
        currentCtx.save()
        currentCtx.strokeStyle = '#3b82f6' // blue-500
        currentCtx.lineWidth = 1
        currentCtx.setLineDash([5, 5])
        
        if (drawable.type === 'text' && drawable.text) {
          const textWidth = currentCtx.measureText(drawable.text).width
          currentCtx.strokeRect(
            drawable.points[0].x - 5,
            drawable.points[0].y - 20,
            textWidth + 10,
            30
          )
        } else if (drawable.type === 'line' && drawable.points.length === 2) {
          const [start, end] = drawable.points
          currentCtx.beginPath()
          currentCtx.moveTo(start.x, start.y)
          currentCtx.lineTo(end.x, end.y)
          currentCtx.stroke()
        } else if (drawable.type === 'rectangle' && drawable.points.length === 2) {
          const [start, end] = drawable.points
          const width = end.x - start.x
          const height = end.y - start.y
          currentCtx.strokeRect(start.x - 5, start.y - 5, width + 10, height + 10)
        } else if (drawable.type === 'circle' && drawable.points.length === 2) {
          const [start, end] = drawable.points
          const radius = Math.sqrt(
            (end.x - start.x) ** 2 + (end.y - start.y) ** 2
          )
          currentCtx.beginPath()
          currentCtx.arc(start.x, start.y, radius + 5, 0, Math.PI * 2)
          currentCtx.stroke()
        } else if (drawable.type === 'triangle' && drawable.points.length === 2) {
          const [start, end] = drawable.points
          currentCtx.beginPath()
          currentCtx.moveTo(start.x, start.y - 5)
          currentCtx.lineTo(end.x + 5, end.y + 5)
          currentCtx.lineTo(start.x * 2 - end.x - 5, end.y + 5)
          currentCtx.closePath()
          currentCtx.stroke()
        } else {
          // Bounding box for freehand drawing
          const xs = drawable.points.map(p => p.x)
          const ys = drawable.points.map(p => p.y)
          const minX = Math.min(...xs) - 5
          const minY = Math.min(...ys) - 5
          const maxX = Math.max(...xs) + 5
          const maxY = Math.max(...ys) + 5
          
          currentCtx.strokeRect(minX, minY, maxX - minX, maxY - minY)
        }
        
        currentCtx.restore()
      }
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
  
  // Set the active tool
  const setActiveTool = (tool: Tool) => {
    activeTool.value = tool
    
    // If eraser is selected, change the color to white
    if (tool === 'eraser') {
      selectedColor.value = '#FFFFFF' // White for eraser
    } else if (tool === 'pen') {
      // Reset to black if switching from eraser to pen
      selectedColor.value = '#000000'
    }
  }
  
  // Handle image upload
  const handleImageUpload = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input.files || !input.files[0] || !canvasRef.value) return
    
    const file = input.files[0]
    const reader = new FileReader()
    
    reader.onload = (event) => {
      if (!event || !event.target || !event.target.result || !canvasRef.value) return
      
      const img = new Image()
      img.onload = () => {
        const point = { x: 50, y: 50 } // Default position
        
        // Add image as a drawable
        drawables.value.push({
          id: Date.now().toString(),
          points: [point, { x: point.x + img.width, y: point.y + img.height }],
          color: '',
          width: 1,
          type: 'image',
          text: `data:${file.type};base64,${btoa(
            new Uint8Array(event.target?.result as ArrayBuffer || new ArrayBuffer(0))
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          )}`
        } as Drawable)
        
        redraw()
      }
      
      img.src = event.target.result as string
    }
    
    reader.readAsDataURL(file)
  }
  
  // Handle keyboard events
  const onKeyDown = (e: KeyboardEvent) => {
    // Delete selected items when Delete or Backspace is pressed
    if ((e.key === 'Delete' || e.key === 'Backspace') && drawables.value.some(d => d.isSelected)) {
      drawables.value = drawables.value.filter(d => !d.isSelected)
      redraw()
    }
  }
  
  // Add keyboard event listener
  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
  
  return {
    isDrawing,
    drawables,
    selectedColor,
    selectedWidth,
    activeTool,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    redraw,
    setActiveTool,
    handleImageUpload
  }
}
