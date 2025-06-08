<template>
  <div class="relative w-full h-full">
    <video
      ref="videoElement"
      class="w-full h-full bg-black"
      :src="currentSource"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @pause="isPlaying = false"
      @play="isPlaying = true"
    ></video>
    
    <!-- Video Controls Overlay -->
    <div 
      v-if="showControls"
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
    >
      <!-- Timeline -->
      <div class="mb-2">
        <div class="h-1 bg-gray-600 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500" 
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="togglePlay">
            <span class="text-2xl">{{ isPlaying ? '⏸️' : '▶️' }}</span>
          </button>
          <div class="text-sm">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <button @click="toggleMute">
            <span class="text-xl">{{ isMuted ? '🔇' : '🔊' }}</span>
          </button>
          <input 
            type="range" 
            v-model="volume" 
            min="0" 
            max="1" 
            step="0.1" 
            class="w-24"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  src: string;
  autoplay?: boolean;
  showControls?: boolean;
}>();

const emit = defineEmits(['timeupdate', 'loadedmetadata', 'play', 'pause']);

const videoElement = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);

const progress = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

const currentSource = computed(() => props.src);

const togglePlay = () => {
  if (!videoElement.value) return;
  
  if (videoElement.value.paused) {
    videoElement.value.play();
    emit('play');
  } else {
    videoElement.value.pause();
    emit('pause');
  }
};

const toggleMute = () => {
  if (!videoElement.value) return;
  isMuted.value = !isMuted.value;
  if (videoElement.value) {
    videoElement.value.muted = isMuted.value;
  }
};

const handleTimeUpdate = () => {
  if (!videoElement.value) return;
  currentTime.value = videoElement.value.currentTime;
  emit('timeupdate', currentTime.value);
};

const handleLoadedMetadata = () => {
  if (!videoElement.value) return;
  duration.value = videoElement.value.duration;
  emit('loadedmetadata', {
    duration: duration.value,
    videoWidth: videoElement.value.videoWidth,
    videoHeight: videoElement.value.videoHeight
  });};

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

watch(volume, (newVolume) => {
  if (!videoElement.value) return;
  videoElement.value.volume = newVolume;
  isMuted.value = newVolume === 0;
});

// Expose methods
const play = () => {
  if (videoElement.value) videoElement.value.play();
};

const pause = () => {
  if (videoElement.value) videoElement.value.pause();
};

const seek = (time: number) => {
  if (!videoElement.value) return;
  videoElement.value.currentTime = time;
};

defineExpose({
  play,
  pause,
  seek,
  videoElement
});
</script>
