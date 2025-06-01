
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChatInput from '~/components/chat/ChatInput.vue';

interface Model {
  id: string;
  name: string;
}

interface Mode {
  id: string;
  name: string;
}

const availableModels: Model[] = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5', name: 'GPT-3.5' },
  { id: 'claude-2', name: 'Claude 2' }
];

const availableModes: Mode[] = [
  { id: 'chat', name: 'Chat' },
  { id: 'code', name: 'Code' },
  { id: 'creative', name: 'Creative' },
  { id: 'precise', name: 'Precise' }
];

const selectedModel = ref(availableModels[0].id);
const selectedMode = ref(availableModes[0].id);
const inputMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

async function startNewChat(message = '') {
  const newChatId = Date.now().toString();
  
  // If there's a message, navigate with it as a query parameter
  if (message) {
    await router.push({
      path: `/chat/${newChatId}`,
      query: { initialMessage: message }
    });
  } else {
    await router.push(`/chat/${newChatId}`);
  }
}

async function handleSend({ text, model, mode, files = [] }: { text: string; model: string; mode: string; files?: File[] }) {
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
  <div class="flex-1 flex flex-col h-full">
    <!-- Empty state -->
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center p-8 max-w-md">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <div class="i-mdi-chat-outline text-blue-600 text-2xl" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Start a new chat</h2>
        <p class="text-gray-500 mb-6">Type a message below to begin your conversation</p>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div class="max-w-3xl mx-auto">
        <ChatInput
          v-model:selectedModel="selectedModel"
          v-model:selectedMode="selectedMode"
          :available-models="availableModels"
          :available-modes="availableModes"
          @send="handleSend"
          class="border-0 border-t border-gray-200"
        />
      </div>
    </div>
  </div>
</template>
