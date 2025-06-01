
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ChatInput from "~/components/chat/ChatInput.vue";

interface Model {
	id: string;
	name: string;
}

interface Mode {
	id: string;
	name: string;
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

const selectedModel = ref(availableModels[0].id);
const selectedMode = ref(availableModes[0].id);
const inputMessage = ref("");
const isLoading = ref(false);
const router = useRouter();

async function startNewChat(message = "") {
	const newChatId = Date.now().toString();

	// If there's a message, navigate with it as a query parameter
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
  <div class="flex-1 flex flex-col h-full items-center justify-center">
    <div class="w-full max-w-4xl px-4">
      <ChatInput
        v-model:selectedModel="selectedModel"
        v-model:selectedMode="selectedMode"
        :available-models="availableModels"
        :available-modes="availableModes"
        @send="handleSend"
        class="w-full"
      />
    </div>
  </div>
</template>
