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
              :src="currentVideoSource"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type VideoPlayer from '~/components/video-editor/VideoPlayer.vue';
import type Timeline from '~/components/video-editor/Timeline.vue';
import type AssetsPanel from '~/components/video-editor/AssetsPanel.vue';

// Types
interface Tool {
  id: string;
  name: string;
  icon: string;
}

interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'text' | 'effect';
  duration: number;
  thumbnail?: string;
  width?: number;
  height?: number;
  [key: string]: string | number | boolean | undefined;
}

interface Clip {
  id: string;
  assetId: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  start: number;
  end: number;
  [key: string]: string | number | boolean | undefined;
}

interface Track {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  clips: Clip[];
  color: string;
}

// Refs
const videoPlayer = ref<InstanceType<typeof VideoPlayer> | null>(null);
const timeline = ref<InstanceType<typeof Timeline> | null>(null);
const assetsPanel = ref<InstanceType<typeof AssetsPanel> | null>(null);

// State
const activeTool = ref('select');
const currentTime = ref(0);
const maxDuration = ref(60 * 5); // 5 minutes default
const currentVideoSource = ref('');
const selectedTrackId = ref<string | null>(null);

// Sample data
const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: '🖱️' },
  { id: 'cut', name: 'Cut', icon: '✂️' },
  { id: 'text', name: 'Text', icon: 'T' },
  { id: 'effects', name: 'Effects', icon: '✨' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'export', name: 'Export', icon: '📤' },
];

const tracks = ref<Track[]>([
  {
    id: 'video-1',
    type: 'video',
    color: '#3b82f6',
    clips: []
  },
  {
    id: 'audio-1',
    type: 'audio',
    color: '#8b5cf6',
    clips: []
  }
]);

const mediaAssets: MediaAsset[] = [
  {
    id: 'video-1',
    name: 'Sample Video 1',
    type: 'video',
    duration: 30,
    thumbnail: 'https://via.placeholder.com/320x180',
    width: 1920,
    height: 1080
  },
  {
    id: 'audio-1',
    name: 'Background Music',
    type: 'audio',
    duration: 120
  },
  {
    id: 'text-1',
    name: 'Title',
    type: 'text',
    duration: 5,
    text: 'Edit me',
    fontSize: 48,
    color: '#ffffff'
  }
];

// Computed
const selectedTrack = computed(() => {
  return tracks.value.find(track => track.id === selectedTrackId.value);
});

// Methods
const setActiveTool = (toolId: string) => {
  activeTool.value = toolId;
  // Add tool-specific logic here
};

const handleTimeUpdate = (time: number) => {
  currentTime.value = time;
  // Update timeline position
  if (timeline.value) {
    // Timeline handles the visualization
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
  clip: {
    id: string;
    start: number;
    end: number;
  };
  start: number;
  end: number;
}

const handleClipMove = (event: ClipEvent) => {
  console.log('Clip moved:', event);
  // Update clip position in the track
  const track = tracks.value.find(t => t.clips.some(c => c.id === event.clip.id));
  if (track) {
    const clip = track.clips.find(c => c.id === event.clip.id);
    if (clip) {
      clip.start = event.start;
      clip.end = event.end;
    }
  }
};

const handleClipResize = (event: ClipEvent) => {
  console.log('Clip resized:', event);
  // Update clip duration in the track
  const track = tracks.value.find(t => t.clips.some(c => c.id === event.clip.id));
  if (track) {
    const clip = track.clips.find(c => c.id === event.clip.id);
    if (clip) {
      clip.start = event.start;
      clip.end = event.end;
    }
  }
};

interface AddAssetEvent {
  asset: MediaAsset;
  trackId: string;
  position: number;
}

const handleAddAsset = (event: AddAssetEvent) => {
  console.log('Add asset to timeline:', event);
  const { asset, trackId, position } = event;
  
  const track = tracks.value.find(t => t.id === trackId);
  if (!track) return;
  
  // ตรวจสอบ type ให้ตรงกับที่กำหนด
  const assetType = asset.type === 'image' ? 'video' : asset.type as 'video' | 'audio' | 'text' | 'effect';
  
  const newClip: Clip = {
    id: `clip-${Date.now()}`,
    assetId: asset.id,
    name: asset.name,
    type: assetType,
    start: position,
    end: position + (asset.duration || 5),
    // เพิ่ม properties เพิ่มเติมจาก asset ที่ไม่ซ้ำกับ properties หลัก
    ...Object.fromEntries(
      Object.entries(asset)
        .filter(([key]) => !['id', 'assetId', 'name', 'type', 'start', 'end'].includes(key))
    )
  };
  
  track.clips.push(newClip);
  selectedTrackId.value = trackId;
};

const handleSelectAsset = (asset: MediaAsset) => {
  console.log('Asset selected:', asset);
  // Handle asset selection (e.g., show properties)
};

const exportVideo = () => {
  // Implement export logic
  console.log('Exporting video...');
  alert('Export functionality will be implemented here');
};

// Lifecycle
onMounted(() => {
  // Set first track as selected by default
  if (tracks.value.length > 0) {
    selectedTrackId.value = tracks.value[0].id;
  }
});
</script>

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