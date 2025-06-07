<script setup lang="ts">
import { ref } from 'vue'
import Whiteboard from '~/components/Whiteboard.vue'
import { useFullscreen } from '@vueuse/core'

definePageMeta({
  layout: 'fullscreen'
});


const { isFullscreen, toggle } = useFullscreen()


const tools = [
  { name: 'pen', icon: '✏️', active: false },
  { name: 'eraser', icon: '🧽', active: false },
  { name: 'text', icon: '🔤', active: false },
  { name: 'shape', icon: '⬜', active: false },
]

const activeTool = ref('pen')

const selectTool = (toolName: string) => {
  activeTool.value = toolName
  // Add tool selection logic here
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="px-6 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-800">Whiteboard</h1>
          <div class="flex space-x-1">
            <button 
              v-for="tool in tools" 
              :key="tool.name"
              @click="selectTool(tool.name)"
              :class="[
                'p-2 rounded-md transition-colors',
                activeTool === tool.name 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
              :title="tool.name"
            >
              <span class="text-xl">{{ tool.icon }}</span>
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            @click="toggle()"
            class="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          >
            <span class="text-xl">{{ isFullscreen ? '⤵️' : '⤴️' }}</span>
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1 overflow-hidden bg-white shadow-inner h-[calc(100vh-4rem)]">
      <div class="w-full h-full">
        <Whiteboard class="w-full h-full" />
      </div>
    </main>
    
    <!-- Status Bar -->
    <footer class="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
      <div class="flex justify-between items-center">
        <span>Tool: {{ activeTool }}</span>
        <div class="flex space-x-4">
          <span>Zoom: 100%</span>
          <span>Position: 0, 0</span>
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