<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type AssetsPanel from "~/components/video-editor/AssetsPanel.vue";
import type Timeline from "~/components/video-editor/Timeline.vue";
import type VideoPlayer from "~/components/video-editor/VideoPlayer.vue";

// Types
interface Tool {
	id: string;
	name: string;
	icon: string;
}

interface MediaAsset {
	id: string;
	name: string;
	type: "video" | "image" | "audio" | "text" | "effect";
	duration: number;
	thumbnail?: string;
	width?: number;
	height?: number;
	[key: string]: string | number | boolean | undefined;
}

interface Clip {
	id: string;
	assetId: string;
	startTime: number;
	endTime: number;
	trackId: string;
	layer: number;
}

interface Track {
	id: string;
	name: string;
	type: "video" | "audio" | "text";
	muted: boolean;
	locked: boolean;
}

// Refs
const videoPlayer = ref<InstanceType<typeof VideoPlayer> | null>(null);
const timeline = ref<InstanceType<typeof Timeline> | null>(null);
const assetsPanel = ref<InstanceType<typeof AssetsPanel> | null>(null);

// State
const activeTool = ref<string>("select");
const currentTime = ref<number>(0);
const maxDuration = ref<number>(0);
const selectedTrackId = ref<string | null>(null);

// Data
const tools = ref<Tool[]>([
	{ id: "select", name: "Select", icon: "🖱️" },
	{ id: "cut", name: "Cut", icon: "✂️" },
	{ id: "text", name: "Text", icon: "🔤" },
	{ id: "crop", name: "Crop", icon: "✂️" },
	{ id: "effects", name: "Effects", icon: "✨" },
]);

const mediaAssets = ref<MediaAsset[]>([]);
const tracks = ref<Track[]>([]);
const currentVideoSource = ref<string>("");

// Methods
const setActiveTool = (toolId: string) => {
	activeTool.value = toolId;
};

const handleTimeUpdate = (time: number) => {
	currentTime.value = time;
	if (timeline.value) {
		timeline.value.updatePlayhead(time);
	}
};

const handleLoadedMetadata = (data: { duration: number }) => {
	maxDuration.value = data.duration;
};

const seekToTime = (time: number) => {
	if (videoPlayer.value) {
		videoPlayer.value.seek(time);
	}
};

interface ClipEvent {
	clipId: string;
	trackId: string;
	startTime: number;
	endTime: number;
	layer: number;
}

const handleClipMove = (event: ClipEvent) => {
	// Update clip position in state
};

const handleClipResize = (event: ClipEvent) => {
	// Update clip duration in state
};

interface AddAssetEvent {
	asset: MediaAsset;
	trackId: string;
	startTime: number;
}

const handleAddAsset = (event: AddAssetEvent) => {
	// Add new clip to timeline
};

const handleSelectAsset = (asset: MediaAsset) => {
	// Handle asset selection
};

const exportVideo = () => {
	// Export video logic
};

// Lifecycle
onMounted(() => {
	// Set first track as selected by default
	if (tracks.value.length > 0) {
		selectedTrackId.value = tracks.value[0].id;
	}
});
</script>

<template>
  <div class="video-editor h-screen flex flex-col bg-gray-900 text-white">
    <!-- Header -->
    <header class="p-4 border-b border-gray-800 flex justify-between items-center">
      <h1 class="text-xl font-bold">Video Editor</h1>
      <div class="flex items-center space-x-4">
        <button 
          class="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition flex items-center"
          @click="exportVideo"
        >
          <span class="mr-2">📤</span> Export
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Tools -->
      <aside class="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <button 
          v-for="tool in tools" 
          :key="tool.id"
          :title="tool.name"
          class="p-2 rounded-md hover:bg-gray-700 transition w-12 h-12 flex items-center justify-center"
          :class="{ 'bg-gray-700': activeTool === tool.id }"
          @click="setActiveTool(tool.id)"
        >
          <span class="text-2xl">{{ tool.icon }}</span>
        </button>
      </aside>

      <!-- Main Editor Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Video Preview -->
        <div class="flex-1 flex items-center justify-center bg-black relative">
          <div class="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <VideoPlayer
              ref="videoPlayer"
              :currentSource="currentVideoSource"
              :autoplay="false"
              @timeupdate="handleTimeUpdate"
              @loadedmetadata="handleLoadedMetadata"
            />
          </div>
        </div>

        <!-- Timeline -->
        <div class="h-64 border-t border-gray-700 bg-gray-800">
          <Timeline
            ref="timeline"
            :current-time="currentTime"
            :max-duration="maxDuration"
            :tracks="tracks"
            @update:current-time="seekToTime"
            @clip-move="handleClipMove"
            @clip-resize="handleClipResize"
          />
        </div>
      </div>

      <!-- Right Sidebar - Assets & Properties -->
      <AssetsPanel
        ref="assetsPanel"
        :assets="mediaAssets"
        :selected-track-id="selectedTrackId"
        @add-asset="handleAddAsset"
        @select-asset="handleSelectAsset"
        class="w-80 flex-shrink-0 border-l border-gray-700"
      />
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.video-editor {
  --scrollbar-track: #1f2937;
  --scrollbar-thumb: #4b5563;
}
</style>