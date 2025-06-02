<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
	layout: "chatpage",
});

interface Model {
	id: string;
	name: string;
}

interface Mode {
	id: string;
	name: string;
}

interface MediaItem {
	id: string;
	imageUrl: string;
	title: string;
	height: number;
}

const availableModels: Model[] = [
	{ id: "gpt-4", name: "GPT-4" },
	{ id: "gpt-3.5", name: "GPT-3.5" },
	{ id: "claude-2", name: "Claude 2" },
];

const availableModes: Mode[] = [
	{ id: "chat", name: "Chat" },
	{ id: "code", name: "Code" },
	{ id: "creative", name: "Creative" },
	{ id: "precise", name: "Precise" },
];

// Sample media items with different heights for the masonry layout
const mediaItems = ref<MediaItem[]>([
	{
		id: "1",
		imageUrl:
			"https://images.unsplash.com/photo-1575722290270-626ffa3e1d44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Modern Architecture",
		height: 500,
	},
	{
		id: "2",
		imageUrl:
			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Fashion Shoes",
		height: 600,
	},
	{
		id: "3",
		imageUrl:
			"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Gourmet Food",
		height: 450,
	},
	{
		id: "4",
		imageUrl:
			"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Travel Destination",
		height: 550,
	},
	{
		id: "5",
		imageUrl:
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Tech Gadgets",
		height: 500,
	},
	{
		id: "6",
		imageUrl:
			"https://images.unsplash.com/photo-1494972308805-463bc619d34e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Home Decor",
		height: 400,
	},
	{
		id: "7",
		imageUrl:
			"https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Abstract Art",
		height: 650,
	},
	{
		id: "8",
		imageUrl:
			"https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Sports Action",
		height: 500,
	},
	{
		id: "9",
		imageUrl:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Music Concert",
		height: 450,
	},
	{
		id: "10",
		imageUrl:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Mountain Lake",
		height: 550,
	},
	{
		id: "11",
		imageUrl:
			"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "City Skyline",
		height: 500,
	},
	{
		id: "12",
		imageUrl:
			"https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		title: "Minimalist Design",
		height: 400,
	},
]);

const selectedModel = ref(availableModels[0].id);
const selectedMode = ref(availableModes[0].id);
const isLoading = ref(false);
const router = useRouter();

async function startNewChat(message = "") {
	const newChatId = Date.now().toString();
	if (message) {
		await router.push({
			path: `/chat/${newChatId}`,
			query: { initialMessage: message },
		});
	} else {
		await router.push(`/chat/${newChatId}`);
	}
}

async function handleSend({
	text,
	model,
	mode,
	files = [],
}: { text: string; model: string; mode: string; files?: File[] }) {
	if (!text.trim() && (!files || files.length === 0)) return;

	try {
		isLoading.value = true;
		await startNewChat(text);
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <!-- Pinterest-style Grid Layout -->
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="item in mediaItems" :key="item.id" class="break-inside-avoid">
          <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            <img 
              :src="item.imageUrl" 
              :alt="item.title" 
              class="w-full h-auto object-cover"
              :style="{ height: `${item.height}px` }"
              loading="lazy"
            />
            <div class="p-4">
              <h3 class="font-medium text-gray-900 truncate">{{ item.title }}</h3>
              <p class="text-sm text-gray-500">Description or metadata</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Ensure proper grid item behavior */
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
