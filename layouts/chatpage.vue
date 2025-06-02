<script setup lang="ts">
import { ref } from "vue";
import Nav from "~/components/Nav.vue";
import ChatInput from "~/components/input/BaseInput.vue";

// รับ event จาก ChatInput
const handleSend = (event: { text: string; files?: File[] }) => {
	// สามารถเพิ่ม logic การจัดการข้อความที่นี่
	console.log("Message sent:", event.text);
	if (event.files) {
		console.log("Files attached:", event.files);
	}
};

const selectedModel = ref("");
const selectedMode = ref("");
</script>

<template>
  <div class="relative h-screen w-full flex flex-col">
    <Nav />
    
    <!-- Background -->
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
    
    <!-- Floating Input -->
    <ChatInput
      :selectedModel="selectedModel"
      :selectedMode="selectedMode"
      class="w-full"
      @send="handleSend"
    />
  </div>
</template>