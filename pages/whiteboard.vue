<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useWhiteboardStore } from '~/stores/whiteboard';
import { useWhiteboardState } from '~/composables/useWhiteboardState';
import WhiteboardToolbar from '~/components/whiteboard/WhiteboardToolbar.vue';
import WhiteboardCanvas from '~/components/whiteboard/WhiteboardCanvas.vue';

const store = useWhiteboardStore();

const {
  // State
  isFullscreen,
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
  startDrawing,
  updateDrawing,
  stopDrawing,
  startPan,
  updatePan,
  stopPan,
  zoom,
  resetView,
  clearCanvas: handleClearCanvas,
  undo: handleUndo,

  toCanvasCoords,
} = useWhiteboardState();

// Handle keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showTextInput.value) {
    showTextInput.value = false;
  } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    resetView();
  } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    handleUndo();
  }
};

// Handle text submission
const handleSubmitText = () => {
  if (textInput.value.trim() && textPosition.value) {
    store.addText();
    textInput.value = '';
    showTextInput.value = false;
  }
};

// Handle text cancellation
const handleCancelText = () => {
  textInput.value = '';
  showTextInput.value = false;
};

// Set up keyboard event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Toolbar -->
    <WhiteboardToolbar
      v-model:current-tool="currentTool"
      v-model:current-color="currentColor"
      v-model:current-width="currentWidth"
      :is-fullscreen="isFullscreen"
      @clear="handleClearCanvas"
      @undo="handleUndo"
      @toggle-fullscreen="toggleFullscreen"
    />

    <!-- Canvas -->
    <WhiteboardCanvas
      :drawings="[]"
      :current-tool="currentTool"
      :current-color="currentColor"
      :current-width="currentWidth"
      :view-state="viewState"
      :is-panning="false"
      :show-text-input="showTextInput"
      :text-input="textInput"
      :text-position="textPosition"
      @start-drawing="startDrawing"
      @update-drawing="updateDrawing"
      @stop-drawing="stopDrawing"
      @start-pan="startPan"
      @update-pan="updatePan"
      @stop-pan="stopPan"
      @zoom="zoom"
      @update:text="(val: string) => textInput = val"
      @submit-text="handleSubmitText"
      @cancel-text="handleCancelText"
    />
    <!-- Status Bar -->
    <footer class="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <span>Tool: {{ currentTool }}</span>
          <span>Zoom: {{ Math.round(viewState.scale * 100) }}%</span>
          <button 
            v-if="viewState.scale !== 1 || viewState.x !== 0 || viewState.y !== 0"
            @click="resetView"
            class="text-blue-500 hover:text-blue-700"
            title="Reset View (Ctrl+0)"
          >
            Reset View
          </button>
        </div>
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