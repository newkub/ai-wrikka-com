<template>
  <div class="h-full flex flex-col bg-gray-800">
    <!-- Timeline Header -->
    <div class="h-8 bg-gray-700 flex items-center px-4 text-sm font-medium">
      <span>Timeline</span>
    </div>
    
    <!-- Tracks -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="track in tracks" 
        :key="track.id"
        class="h-20 border-b border-gray-700 relative"
        :style="{ height: `${trackHeight}px` }"
      >
        <div class="absolute inset-0">
          <div 
            v-for="clip in track.clips" 
            :key="clip.id"
            class="absolute bg-blue-600 rounded h-16 m-1 overflow-hidden cursor-move"
            :style="{
              left: `${(clip.start / maxDuration) * 100}%`,
              width: `${((clip.end - clip.start) / maxDuration) * 100}%`,
              backgroundColor: track.color
            }"
            @mousedown="startDrag(clip, $event)"
          >
            <div class="p-2 text-xs truncate">
              {{ clip.name }}
            </div>
            <!-- Resize handles -->
            <div 
              class="absolute left-0 top-0 bottom-0 w-2 bg-black/20 cursor-ew-resize"
              @mousedown.stop="startResize(clip, 'start', $event)"
            ></div>
            <div 
              class="absolute right-0 top-0 bottom-0 w-2 bg-black/20 cursor-ew-resize"
              @mousedown.stop="startResize(clip, 'end', $event)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Timeline Ruler -->
    <div class="h-8 bg-gray-900 border-t border-gray-700 overflow-hidden relative">
      <div 
        class="absolute top-0 bottom-0 w-px bg-red-500 z-10"
        :style="{ left: `${(currentTime / maxDuration) * 100}%` }"
      ></div>
      <div 
        v-for="tick in ticks" 
        :key="tick.time" 
        class="absolute bottom-0 w-px bg-gray-600"
        :style="{ left: `${(tick.time / maxDuration) * 100}%`, height: tick.major ? '100%' : '50%' }"
      >
        <span 
          v-if="tick.major"
          class="absolute text-xs text-gray-400 -translate-x-1/2 whitespace-nowrap"
          style="bottom: 100%"
        >
          {{ formatTime(tick.time) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Clip {
  id: string;
  name: string;
  start: number;
  end: number;
  type: 'video' | 'audio' | 'text' | 'effect';
  [key: string]: string | number | boolean | undefined;
}

interface Track {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  clips: Clip[];
  color: string;
}

const props = withDefaults(defineProps<{
  currentTime?: number;
  maxDuration?: number;
  tracks?: Track[];
  trackHeight?: number;
}>(), {
  currentTime: 0,
  maxDuration: 60, // Default to 60 seconds
  tracks: () => [],
  trackHeight: 80
});

const emit = defineEmits([
  'update:currentTime',
  'clip-move',
  'clip-resize',
  'click',
  'add-clip'
]);

// Generate ticks for the timeline ruler
const ticks = computed(() => {
  const tickCount = Math.ceil(props.maxDuration / 5);
  return Array.from({ length: tickCount * 5 + 1 }, (_, i) => ({
    time: i * 1,
    major: i % 5 === 0
  }));
});

// Format time as MM:SS
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Drag and drop functionality
let isDragging = false;
let isResizing = false;
let currentClip: Clip | null = null;
let resizeEdge: 'start' | 'end' | null = null;
let startX = 0;
let startTime = 0;
let startClipStart = 0;
let startClipEnd = 0;

const startDrag = (clip: Clip, event: MouseEvent) => {
  isDragging = true;
  currentClip = clip;
  startX = event.clientX;
  const parentElement = (event.target as HTMLElement).parentElement;
  if (!parentElement) return;
  startTime = (event.offsetX / parentElement.offsetWidth) * props.maxDuration;
  startClipStart = clip.start;
  
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', stopDrag);
  event.preventDefault();
};

const startResize = (clip: Clip, edge: 'start' | 'end', event: MouseEvent) => {
  isResizing = true;
  currentClip = clip;
  resizeEdge = edge;
  startX = event.clientX;
  startClipStart = clip.start;
  startClipEnd = clip.end;
  
  document.addEventListener('mousemove', handleResizeMove);
  document.addEventListener('mouseup', stopResize);
  event.preventDefault();
  event.stopPropagation();
};

const handleDragMove = (event: MouseEvent) => {
  if (!isDragging || !currentClip) return;
  
  const deltaX = event.clientX - startX;
  const timePerPixel = props.maxDuration / (document.querySelector('.timeline')?.clientWidth || props.maxDuration);
  const deltaTime = deltaX * timePerPixel;
  
  const newStart = Math.max(0, startClipStart + deltaTime);
  const newEnd = newStart + (startClipEnd - startClipStart);
  
  // Emit event to parent
  emit('clip-move', {
    clip: currentClip,
    start: newStart,
    end: newEnd
  });
};

const handleResizeMove = (event: MouseEvent) => {
  if (!isResizing || !currentClip || !resizeEdge) return;
  
  const deltaX = event.clientX - startX;
  const timePerPixel = props.maxDuration / (document.querySelector('.timeline')?.clientWidth || props.maxDuration);
  const deltaTime = deltaX * timePerPixel;
  
  let newStart = currentClip.start;
  let newEnd = currentClip.end;
  
  if (resizeEdge === 'start') {
    newStart = Math.min(Math.max(0, startClipStart + deltaTime), currentClip.end - 0.5); // Min 0.5s duration
  } else {
    newEnd = Math.max(Math.min(props.maxDuration, startClipEnd + deltaTime), currentClip.start + 0.5); // Min 0.5s duration
  }
  
  // Emit event to parent
  emit('clip-resize', {
    clip: currentClip,
    start: newStart,
    end: newEnd,
    edge: resizeEdge
  });
};

const stopDrag = () => {
  isDragging = false;
  currentClip = null;
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', stopDrag);
};

const stopResize = () => {
  isResizing = false;
  currentClip = null;
  resizeEdge = null;
  document.removeEventListener('mousemove', handleResizeMove);
  document.removeEventListener('mouseup', stopResize);
};

// Cleanup event listeners
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('mousemove', handleResizeMove);
  document.removeEventListener('mouseup', stopResize);
});

// Handle timeline click to seek
const handleTimelineClick = (event: MouseEvent) => {
  if (isDragging || isResizing) return;
  
  const timeline = event.currentTarget as HTMLElement;
  const rect = timeline.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickTime = (clickX / rect.width) * props.maxDuration;
  
  emit('update:currentTime', clickTime);
  emit('click', clickTime);
};

// Expose methods
defineExpose({
  formatTime
});
</script>
