<template>
  <div class="video-editor">
    <div class="editor-container">
      <!-- Video Preview -->
      <div class="bg-gray-900 rounded-lg overflow-hidden" style="aspect-ratio: 16/9;">
        <video
          ref="videoPlayer"
          class="w-full h-full object-contain bg-black"
          :src="videoSource"
          controls
        ></video>
      </div>

      <!-- Timeline -->
      <div class="bg-gray-800 rounded-lg p-3 h-24 overflow-x-auto">
        <div class="flex gap-2 h-full">
          <div 
            v-for="(clip, index) in clips" 
            :key="index"
            class="bg-#585b70 rounded-md min-w-100px p-2 text-white flex items-center justify-center text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ clip.name }}
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex gap-2 p-3 bg-#181825 rounded-lg">
        <div class="flex gap-2 flex-wrap">
          <button @click="importVideo" class="flex items-center gap-2 p-2 px-4 bg-#313244 text-#cdd6f4 border-none rounded-md cursor-pointer transition-bg duration-200 hover:bg-#45475a">
            <i class="fas fa-video"></i> Import Video
          </button>
          <button @click="addText" class="flex items-center gap-2 p-2 px-4 bg-#313244 text-#cdd6f4 border-none rounded-md cursor-pointer transition-bg duration-200 hover:bg-#45475a disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!videoSource">
            <i class="fas fa-font"></i> Add Text
          </button>
          <button @click="applyFilter" class="flex items-center gap-2 p-2 px-4 bg-#313244 text-#cdd6f4 border-none rounded-md cursor-pointer transition-bg duration-200 hover:bg-#45475a disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!videoSource">
            <i class="fas fa-magic"></i> Apply Filter
          </button>
          <button @click="trimVideo" class="flex items-center gap-2 p-2 px-4 bg-#313244 text-#cdd6f4 border-none rounded-md cursor-pointer transition-bg duration-200 hover:bg-#45475a disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!videoSource">
            <i class="fas fa-cut"></i> Trim
          </button>
          <button @click="exportVideo" class="flex items-center gap-2 p-2 px-4 bg-#a6e3a1 text-#1e1e2e font-500 border-none rounded-md cursor-pointer transition-bg duration-200 hover:bg-#94e2d5 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!videoSource">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

type VideoClip = {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  filter?: string;
  text?: string;
};

const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoSource = ref<string>('');
const clips = ref<VideoClip[]>([]);
const currentTime = ref(0);

// Initialize editor
onMounted(() => {
  // Add event listeners for video player
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('timeupdate', updateCurrentTime);
  }
});

const updateCurrentTime = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime;
  }
};

const importVideo = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      videoSource.value = URL.createObjectURL(file);
      
      // Add initial clip
      clips.value = [{
        id: Date.now().toString(),
        name: file.name,
        startTime: 0,
        endTime: 0 // Will be updated after metadata loads
      }];
      
      if (videoPlayer.value) {
        videoPlayer.value.onloadedmetadata = () => {
          if (videoPlayer.value && clips.value.length > 0) {
            clips.value[0].endTime = videoPlayer.value.duration;
          }
        };
      }
    }
  };
  
  input.click();
};

const addText = () => {
  const text = prompt('Enter text to add to video:', 'Sample Text');
  if (text && videoSource.value) {
    // In a real implementation, you would add this to the current clip
    console.log('Adding text:', text);
  }
};

const applyFilter = () => {
  const filters = ['grayscale', 'sepia', 'blur', 'brightness'];
  const selectedFilter = prompt(`Choose a filter (${filters.join(', ')}):`, filters[0]);
  
  if (selectedFilter && filters.includes(selectedFilter) && videoSource.value) {
    // In a real implementation, you would apply this filter to the current clip
    console.log('Applying filter:', selectedFilter);
  }
};

const trimVideo = () => {
  if (!videoSource.value) return;
  
  const startTime = prompt('Start time (seconds):', '0');
  const endTime = prompt('End time (seconds):', '10');
  
  if (startTime !== null && endTime !== null) {
    const start = Number.parseFloat(startTime);
    const end = Number.parseFloat(endTime);
    
    if (!Number.isNaN(start) && !Number.isNaN(end) && start < end) {
      // In a real implementation, you would create a new clip with these trim points
      console.log(`Trimming from ${start}s to ${end}s`);
    } else {
      alert('Please enter valid start and end times');
    }
  }
};

const exportVideo = async () => {
  if (!videoSource.value) return;
  
  // In a real implementation, you would use a library like ffmpeg.wasm
  // to process and export the video with all edits applied
  alert('Export functionality would be implemented here');
};
</script>