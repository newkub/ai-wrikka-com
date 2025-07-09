<script setup lang="ts">
import { ref, computed } from "vue";
import type { DrawingTool } from "~/types/whiteboard";

interface Tool {
	id: DrawingTool;
	name: string;
	icon: string;
}

const TOOLS: Tool[] = [
	{ id: "pen", name: "Pen", icon: "✏️" },
	{ id: "rectangle", name: "Rectangle", icon: "⬜" },
	{ id: "ellipse", name: "Ellipse", icon: "⭕" },
	{ id: "text", name: "Text", icon: "T" },
];

const props = defineProps<{
	currentTool: DrawingTool;
	currentColor: string;
	currentWidth: number;
	isFullscreen: boolean;
}>();

const emit = defineEmits<{
	"update:currentTool": [tool: DrawingTool];
	"update:currentColor": [color: string];
	"update:currentWidth": [width: number];
	clear: [];
	undo: [];
	toggleFullscreen: [];
}>();
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Tools -->
        <div class="flex space-x-1">
          <button
            v-for="tool in TOOLS"
            :key="tool.id"
            @click="emit('update:currentTool', tool.id)"
            :class="[
              'p-2 rounded-lg',
              currentTool === tool.id
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
            :title="tool.name"
          >
            {{ tool.icon }}
          </button>
        </div>
        <!-- Color Picker -->
        <div class="flex items-center space-x-2">
          <label for="color-picker" class="text-sm text-gray-600">Color:</label>
          <input
            id="color-picker"
            :value="currentColor"
            @input="emit('update:currentColor', ($event.target as HTMLInputElement).value)"
            type="color"
            class="w-8 h-8 rounded border border-gray-300"
          >
        </div>
        <!-- Line Width -->
        <div class="flex items-center space-x-2">
          <label for="width-picker" class="text-sm text-gray-600">Width:</label>
          <input
            id="width-picker"
            :value="currentWidth"
            @input="emit('update:currentWidth', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="1"
            max="50"
            class="w-24"
          >
        </div>
      </div>


      <div class="flex items-center space-x-2">
        <button
          @click="emit('undo')"
          class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          @click="emit('clear')"
          class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          Clear All
        </button>
        <button
          @click="emit('toggleFullscreen')"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
          {{ isFullscreen ? '⤵️' : '⤴️' }}
        </button>
      </div>
    </div>
  </header>
</template>
