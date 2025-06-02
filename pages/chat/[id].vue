<template>
  <div class="flex-1 flex flex-col h-full w-full overflow-hidden">
    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto w-full p-4">
      <div class="w-full space-y-6">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="[
            'flex',
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-3xl rounded-lg px-4 py-3',
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-surface text-foreground border border-border rounded-bl-none shadow-sm'
            ]"
          >
            <MDC :value="message.text" />
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="sticky bottom-0 left-0 right-0 bg-surface border-t border-border w-full">
      <ChatInput
        v-model:selectedModel="selectedModel"
        :available-models="availableModels"
        @send="handleSend"
        @file-select="handleFileAdd"
        class="w-full border-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "chat",
});

import { ref, onUnmounted, nextTick, watch, onMounted, computed } from "vue";

import { useRoute, useRouter } from "vue-router";
import ChatInput from "~/components/chat/ChatInput.vue";

interface FileWithPreview extends File {
	preview: string;
}

const route = useRoute();
const router = useRouter();

// Refs
const messageInput = ref<HTMLTextAreaElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);

// Messages array
const messages = ref<Array<{ text: string; sender: "user" | "ai" }>>([]);
const userInput = ref("");
const files = ref<FileWithPreview[]>([]);
const selectedModel = ref("gpt-4");
const selectedMode = ref("chat");
const chatId = route.params.id as string;
const isLoading = ref(false);

// Check if there's an initial message in the query params
const initialMessage = computed(() => {
	const message = Array.isArray(route.query.initialMessage)
		? route.query.initialMessage[0]
		: route.query.initialMessage;
	return message || "";
});

const availableModels = [
	{ id: "gpt-4", name: "GPT-4" },
	{ id: "gpt-3.5", name: "GPT-3.5" },
	{ id: "claude-2", name: "Claude 2" },
];

const availableModes = [
	{ id: "chat", name: "Chat" },
	{ id: "code", name: "Code" },
	{ id: "creative", name: "Creative" },
	{ id: "precise", name: "Precise" },
];

const canSend = computed(() => {
	return userInput.value.trim() !== "" || files.value.length > 0;
});

// Load chat when component mounts or chatId changes
onMounted(() => {
	loadChat();

	// If there's an initial message, send it
	if (initialMessage.value) {
		userInput.value = initialMessage.value;
		sendMessage({
			text: initialMessage.value,
			model: selectedModel.value,
			mode: selectedMode.value,
			files: [],
		});
	}
});

// Auto-resize textarea
watch(userInput, () => {
	nextTick(() => {
		if (messageInput.value) {
			messageInput.value.style.height = "auto";
			messageInput.value.style.height = `${Math.min(messageInput.value.scrollHeight, 200)}px`;
		}
	});
});

function loadChat() {
	if (!chatId) return;

	// In a real app, you would load the chat from your database/API
	// For now, we'll just clear the messages for the demo
	messages.value = [];
}

function handleFileAdd(fileList: FileWithPreview[]) {
	files.value = [...files.value, ...fileList];
}

function handleFileRemove(file: FileWithPreview) {
	const index = files.value.findIndex(
		(f) => f.name === file.name && f.size === file.size,
	);
	if (index !== -1) {
		URL.revokeObjectURL(files.value[index].preview);
		files.value.splice(index, 1);
	}
}

function handlePaste(event: ClipboardEvent) {
	if (!event.clipboardData) return;

	const items = event.clipboardData.items;
	let hasPastedImage = false;

	for (let i = 0; i < items.length; i++) {
		if (items[i].type.indexOf("image") !== -1) {
			const file = items[i].getAsFile();
			if (file) {
				const fileWithPreview = Object.assign(file, {
					preview: URL.createObjectURL(file),
				}) as FileWithPreview;
				files.value = [...files.value, fileWithPreview];
				hasPastedImage = true;
			}
		}
	}

	if (hasPastedImage) {
		event.preventDefault();
	}
}

function removeFile(index: number) {
	// Revoke the object URL to prevent memory leaks
	URL.revokeObjectURL(files.value[index].preview);
	files.value.splice(index, 1);
	focusInput();
}

function focusInput() {
	nextTick(() => {
		if (messageInput.value) {
			messageInput.value.focus();
			// Auto-scroll to the bottom after focusing
			scrollToBottom();
		}
	});
}

interface SendMessageParams {
	text: string;
	model: string;
	mode: string;
	files?: FileWithPreview[];
}

async function sendMessage({
	text,
	model,
	mode,
	files: messageFiles = [],
}: SendMessageParams) {
	if (!text.trim() && (!messageFiles || messageFiles.length === 0)) return;

	try {
		isLoading.value = true;

		// Add user message
		if (text.trim()) {
			messages.value.push({
				text: text,
				sender: "user" as const,
			});
		}

		// Add file messages if any
		if (messageFiles && messageFiles.length > 0) {
			for (const file of messageFiles) {
				messages.value.push({
					text: `[File: ${file.name}]`,
					sender: "user" as const,
				});
			}
		}

		// Clear input and files
		userInput.value = "";
		files.value = [];

		// Scroll to bottom
		nextTick(() => {
			scrollToBottom();
		});

		// Simulate AI response
		setTimeout(() => {
			const aiResponse = getAIResponse(text);
			messages.value.push({
				text: aiResponse,
				sender: "ai" as const,
			});

			// Scroll to bottom after AI responds
			nextTick(() => {
				scrollToBottom();
			});
		}, 500);
	} catch (error) {
		console.error("Error sending message:", error);
	} finally {
		isLoading.value = false;
	}
}

function getAIResponse(message: string): string {
	// In a real app, this would call your AI API
	return `This is a simulated response to: "${message}"`;
}

function scrollToBottom() {
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
}

// Watch for messages changes to auto-scroll
watch(
	messages,
	() => {
		nextTick(() => {
			scrollToBottom();
		});
	},
	{ deep: true },
);

// Handle send event from ChatInput
function handleSend({
	text,
	files: messageFiles = [],
}: { text: string; files?: FileWithPreview[] }) {
	// Clear the input after sending
	userInput.value = "";

	// Call sendMessage with all required parameters
	sendMessage({
		text,
		model: selectedModel.value,
		mode: selectedMode.value,
		files: messageFiles || [],
	});
}

// Scroll to bottom when component is mounted
onMounted(() => {
	scrollToBottom();
});

// Clean up object URLs when component is unmounted
onUnmounted(() => {
	for (const file of files.value) {
		URL.revokeObjectURL(file.preview);
	}
});
</script>
