<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "~/stores/chat";
import ChatInput from "~/components/chat/ChatInput.vue";

const router = useRouter();
const chatStore = useChatStore();
const userInput = ref("");
const isLoading = ref(false);

const handleSend = async (): Promise<void> => {
	const content = userInput.value.trim();
	if (!content || isLoading.value) return;

	try {
		isLoading.value = true;
		const newSession = chatStore.startNewSession();
		await router.push(`/chat/${newSession.id}`);

		// Add first message after route change
		chatStore.addMessage("user", content);
		userInput.value = "";
	} catch (error) {
		console.error("Error creating new chat:", error);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-background p-4">
    <div class="w-full max-w-2xl mx-auto">
      <h2 class="text-xl font-medium text-center mb-4">What's on your mind?</h2>
      <ChatInput
        v-model="userInput"
        :loading="isLoading"
        @send="handleSend"
        placeholder="พิมพ์ข้อความเพื่อเริ่มแชท..."
        class="w-full"
      />
    </div>
  </div>
</template>
