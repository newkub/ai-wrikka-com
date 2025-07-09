<template>
  <div class="h-full flex flex-col bg-gray-800 border-l border-gray-700">
    <!-- Tabs -->
    <div class="flex border-b border-gray-700">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium"
        :class="activeTab === tab.id ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>
    
    <!-- Search -->
    <div class="p-2 border-b border-gray-700">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search assets..."
          class="w-full bg-gray-700 text-white text-sm rounded-md px-3 py-2 pl-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <span class="absolute left-2 top-2.5 text-gray-400">
          🔍
        </span>
      </div>
    </div>
    
    <!-- Asset List -->
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="filteredAssets.length === 0" class="text-center text-gray-400 py-8">
        No assets found
      </div>
      
      <div v-else class="grid grid-cols-2 gap-2">
        <div 
          v-for="asset in filteredAssets" 
          :key="asset.id"
          class="relative group cursor-pointer rounded-md overflow-hidden bg-gray-700 aspect-video"
          @click="handleAssetClick(asset)"
          @dragstart="handleDragStart($event, asset)"
          draggable="true"
        >
          <!-- Thumbnail -->
          <div class="w-full h-full flex items-center justify-center bg-gray-800">
            <template v-if="asset.type === 'video' || asset.type === 'image'">
              <img 
                v-if="asset.thumbnail" 
                :src="asset.thumbnail" 
                class="w-full h-full object-cover"
                :alt="asset.name"
              >
              <div v-else class="text-gray-400">
                {{ asset.type === 'video' ? '🎬' : '🖼️' }}
              </div>
            </template>
            
            <template v-else-if="asset.type === 'audio'">
              <div class="text-4xl">
                🔈
              </div>
            </template>
            
            <template v-else-if="asset.type === 'text'">
              <div class="text-4xl">
                T
              </div>
            </template>
            
            <template v-else-if="asset.type === 'effect'">
              <div class="text-4xl">
                ✨
              </div>
            </template>
          </div>
          
          <!-- Asset Info -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <div class="text-xs font-medium truncate">{{ asset.name }}</div>
            <div class="text-2xs text-gray-400">
              {{ formatDuration(asset.duration) }}
            </div>
          </div>
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="p-2 bg-blue-600 rounded-full text-white">
              ➕
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Selected Asset Details -->
    <div 
      v-if="selectedAsset" 
      class="border-t border-gray-700 p-4 bg-gray-800"
    >
      <h3 class="font-medium mb-2">{{ selectedAsset.name }}</h3>
      
      <div class="space-y-3">
        <div>
          <label class="text-xs text-gray-300 block mb-1">Duration</label>
          <div class="text-sm">{{ formatDuration(selectedAsset.duration) }}</div>
        </div>
        
        <div v-if="selectedAsset.type === 'video' || selectedAsset.type === 'image'">
          <label class="text-xs text-gray-300 block mb-1">
            {{ selectedAsset.type === 'video' ? 'Resolution' : 'Dimensions' }}
          </label>
          <div class="text-sm">
            {{ selectedAsset.width }} × {{ selectedAsset.height }}
          </div>
        </div>
        
        <div v-if="selectedAsset.type === 'video' || selectedAsset.type === 'audio'">
          <label class="text-xs text-gray-300 block mb-1">Bitrate</label>
          <div class="text-sm">
            {{ selectedAsset.bitrate ? formatBitrate(selectedAsset.bitrate) : 'N/A' }}
          </div>
        </div>
        
        <div v-if="selectedAsset.type === 'text' || selectedAsset.type === 'effect'">
          <label class="text-xs text-gray-300 block mb-1">Type</label>
          <div class="text-sm capitalize">
            {{ selectedAsset.subtype || selectedAsset.type }}
          </div>
        </div>
        
        <button 
          class="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          @click="addToTimeline(selectedAsset)"
        >
          Add to Timeline
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Asset {
	id: string;
	name: string;
	type: "video" | "image" | "audio" | "text" | "effect";
	duration: number; // in seconds
	thumbnail?: string;
	width?: number;
	height?: number;
	bitrate?: number; // in kbps
	subtype?: string;
	[key: string]: string | number | boolean | undefined;
}

const props = withDefaults(
	defineProps<{
		assets?: Asset[];
		selectedTrackId?: string | null;
	}>(),
	{
		assets: () => [],
		selectedTrackId: null,
	},
);

const emit = defineEmits(["add-asset", "select-asset"]);

type TabType = "media" | "audio" | "text" | "effects";

interface Tab {
	id: TabType;
	name: string;
}

const activeTab = ref<TabType>("media");
const searchQuery = ref("");
const selectedAsset = ref<Asset | null>(null);

const tabs: Tab[] = [
	{ id: "media", name: "Media" },
	{ id: "audio", name: "Audio" },
	{ id: "text", name: "Text" },
	{ id: "effects", name: "Effects" },
];

// Filter assets based on search query and active tab
const filteredAssets = computed(() => {
	return props.assets.filter((asset) => {
		// Filter by tab
		if (activeTab.value === "media" && !["video", "image"].includes(asset.type))
			return false;
		if (activeTab.value === "audio" && asset.type !== "audio") return false;
		if (activeTab.value === "text" && asset.type !== "text") return false;
		if (activeTab.value === "effects" && asset.type !== "effect") return false;

		// Filter by search query
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			return asset.name.toLowerCase().includes(query);
		}

		return true;
	});
});

// Format duration as MM:SS
const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Format bitrate
const formatBitrate = (bitrate: number): string => {
	if (bitrate < 1000) return `${bitrate} kbps`;
	return `${(bitrate / 1000).toFixed(1)} Mbps`;
};

// Handle asset click
const handleAssetClick = (asset: Asset) => {
	selectedAsset.value = asset;
	emit("select-asset", asset);
};

// Handle drag start
const handleDragStart = (event: DragEvent, asset: Asset) => {
	if (!event.dataTransfer) return;

	event.dataTransfer.setData(
		"text/plain",
		JSON.stringify({
			type: "asset",
			assetId: asset.id,
		}),
	);

	// Set drag image
	const dragImage = document.createElement("div");
	dragImage.textContent = asset.name;
	dragImage.style.padding = "4px 8px";
	dragImage.style.background = "rgba(0, 0, 0, 0.7)";
	dragImage.style.borderRadius = "4px";
	dragImage.style.color = "white";
	dragImage.style.position = "absolute";
	dragImage.style.top = "-1000px";
	document.body.appendChild(dragImage);

	event.dataTransfer.setDragImage(dragImage, 0, 0);

	// Clean up
	setTimeout(() => {
		document.body.removeChild(dragImage);
	}, 0);
};

// Add asset to timeline
const addToTimeline = (asset: Asset) => {
	if (!props.selectedTrackId) {
		console.warn("No track selected");
		return;
	}

	emit("add-asset", {
		asset,
		trackId: props.selectedTrackId,
		position: 0, // Default to start of timeline
	});
};

// Expose methods
defineExpose({
	selectAsset: (asset: Asset) => {
		selectedAsset.value = asset;
	},
	clearSelection: () => {
		selectedAsset.value = null;
	},
});
</script>
