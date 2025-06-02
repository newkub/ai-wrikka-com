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
	title: string;
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

// Sample media items
const mediaItems = ref<MediaItem[]>([
	{ id: "1", title: "Modern Architecture" },
	{ id: "2", title: "Fashion Shoes" },
	{ id: "3", title: "Gourmet Food" },
	{ id: "4", title: "Travel Destination" },
	{ id: "5", title: "Tech Gadgets" },
	{ id: "6", title: "Home Decor" },
	{ id: "7", title: "Abstract Art" },
	{ id: "8", title: "Sports Action" },
	{ id: "9", title: "Music Concert" },
	{ id: "10", title: "Mountain Lake" },
	{ id: "11", title: "City Skyline" },
	{ id: "12", title: "Minimalist Design" },
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
    <!-- Text Card Grid Layout -->
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="item in mediaItems" :key="item.id" class="break-inside-avoid">
          <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <div class="i-mdi-text-box-outline text-blue-600 text-xl" />
              </div>
              <h3 class="font-medium text-gray-900 truncate">{{ item.title }}</h3>
            </div>
            <p class="text-gray-600 text-sm">
              This is a sample text card content. You can replace this with actual content or metadata.
              The card has a clean design with proper spacing and typography.
            </p>
            <div class="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span>2 days ago</span>
              <span>3 min read</span>
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
