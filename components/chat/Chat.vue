<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../../stores/chat";
import type { SenderType } from "~/types/chat";

const props = defineProps<{
	session: {
		id: string;
		messages: Array<{
			id: string;
			content: string;
			sender: SenderType;
			timestamp: Date;
		}>;
	};
}>();

const chatStore = useChatStore();
const userInput = ref("");
const isTyping = ref(false);

const handleSend = async (content: string) => {
	if (!content.trim()) return;

	chatStore.addMessage("user" as SenderType, content);
	userInput.value = "";
	isTyping.value = true;

	try {
		const response = await $fetch<{
			success: boolean;
			reply?: string;
			error?: string;
		}>("/api/chat", {
			method: "POST",
			body: {
				sessionId: props.session.id,
				message: content,
			},
		});

		if (response.success && response.reply) {
			chatStore.addMessage("assistant" as SenderType, response.reply);
		} else {
			chatStore.addMessage("assistant" as SenderType, "ไม่สามารถสร้างคำตอบได้");
		}
	} catch (error) {
		chatStore.addMessage("assistant" as SenderType, "เกิดข้อผิดพลาดในการเชื่อมต่อ");
	} finally {
		isTyping.value = false;
	}
};
</script>

<template>
  <!-- ส่วน template ที่มีอยู่ -->
</template>
