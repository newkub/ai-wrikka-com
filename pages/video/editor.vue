<template>
  <div class="flex flex-col h-screen">
    <!-- Top Bar -->
    <div class="flex items-center justify-between p-2 border-b h-12">
      <h1 class="text-xl font-bold">Video Editor</h1>
      <div class="flex gap-2">
        <button class="px-4 py-1 rounded bg-blue-500 text-white">
          Export
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Panel -->
      <div class="w-64 border-r p-2 flex flex-col">
        <div class="flex border-b">
          <button 
            v-for="tab in (['media', 'text', 'effects'] as EditorTab[])" 
            :key="tab"
            @click="activeTab = tab"
            class="px-4 py-2"
            :class="{ 'border-b-2 border-blue-500': activeTab === tab }"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex-1 overflow-auto p-2">
          <!-- MediaPanel v-if="activeTab === 'media'" -->
          <!-- TextPanel v-if="activeTab === 'text'" -->
          <!-- EffectsPanel v-if="activeTab === 'effects'" -->
        </div>
      </div>

      <!-- Preview Area -->
      <div class="flex-1 flex flex-col">
        <div class="flex-1 flex items-center justify-center bg-gray-100 overflow-hidden">
          <div class="relative w-full h-full flex items-center justify-center">
            <video 
              ref="videoRef" 
              :src="videoSrc" 
              class="max-w-full max-h-full bg-gray-100"
              @timeupdate="handleTimeUpdate"
              @loadedmetadata="handleLoadedMetadata"
            />
            <canvas ref="canvasRef" class="absolute inset-0" />
          </div>
        </div>

        <!-- Timeline -->
        <div class="h-48 border-t p-2 bg-gray-50 flex flex-col">
          <div class="flex items-center gap-2 mb-2">
            <button @click="togglePlay" class="p-1 rounded bg-gray-200">
              {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
            <input 
              type="range" 
              :value="currentTime" 
              :max="duration" 
              class="flex-1"
              @input="seek(Number(($event.target as HTMLInputElement).value))"
            />
            <span class="text-sm text-gray-500">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </span>
          </div>
          
          <div class="relative h-32 bg-gray-200 rounded overflow-auto">
            <!-- Playhead -->
            <div 
              class="absolute top-0 bottom-0 w-px bg-red-500 z-10"
              :style="{ left: `${(currentTime / (duration || 1)) * 100}%` }"
            />
            
            <!-- Clips -->
            <div class="relative h-full flex items-center">
              <div 
                v-for="clip in clips" 
                :key="clip.id"
                class="absolute h-16 bg-blue-500 rounded cursor-move flex items-center justify-center text-white text-xs"
                :style="{
                  left: `${(clip.start / (duration || 1)) * 100}%`,
                  width: `${((clip.end - clip.start) / (duration || 1)) * 100}%`
                }"
                @mousedown="selectedClipId = clip.id"
              >
                Clip {{ clip.id.slice(0, 4) }}
                <div class="absolute right-0 w-2 h-full bg-blue-700 cursor-ew-resize"
                     @mousedown.stop="resizeClip(clip.id, $event.clientX)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

// Video editor logic will be implemented here
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// State for video editor
const videoSrc = ref<string>(
	"https://videos.pexels.com/video-files/1481903/1481903-hd_1920_1080_25fps.mp4",
);
const isPlaying = ref<boolean>(false);
const currentTime = ref<number>(0);
const duration = ref<number>(0);

// New state for CapCut-like features
type EditorTab = "media" | "text" | "effects" | "export";
interface VideoClip {
	id: string;
	start: number;
	end: number;
	file?: File;
}

const activeTab = ref<EditorTab>("media");
const clips = ref<VideoClip[]>([]);
const selectedClipId = ref<string | null>(null);

// Initialize with mock data
onMounted(() => {
	// Add sample clips to timeline
	clips.value = [
		{ id: "clip1", start: 0, end: 5 },
		{ id: "clip2", start: 5, end: 10 },
		{ id: "clip3", start: 10, end: 15 },
	];

	// Set duration after video loaded
	if (videoRef.value) {
		videoRef.value.onloadedmetadata = () => {
			duration.value = videoRef.value?.duration || 15;
		};
	}
});

// Helper function to format time
const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Functions
const togglePlay = () => {
	if (!videoRef.value) return;

	if (isPlaying.value) {
		videoRef.value.pause();
	} else {
		videoRef.value.play();
	}
	isPlaying.value = !isPlaying.value;
};

const seek = (time: number) => {
	if (!videoRef.value) return;
	videoRef.value.currentTime = time;
};

const handleTimeUpdate = (event: Event) => {
	const target = event.target as HTMLVideoElement;
	currentTime.value = target.currentTime;
};

const handleLoadedMetadata = (event: Event) => {
	const target = event.target as HTMLVideoElement;
	duration.value = target.duration;
};

// Timeline functions
const addClip = (file: File) => {
	const clipId = crypto.randomUUID();
	clips.value.push({
		id: clipId,
		start: 0,
		end: 10, // default duration
		file,
	});
};

const moveClip = (clipId: string, newStart: number) => {
	const clip = clips.value.find((c) => c.id === clipId);
	if (clip) clip.start = Math.max(0, newStart);
};

const resizeClip = (clipId: string, newEnd: number) => {
	const clip = clips.value.find((c) => c.id === clipId);
	if (clip) clip.end = Math.max(clip.start + 1, newEnd);
};
</script>