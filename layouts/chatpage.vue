<script setup lang="ts">
import Nav from "~/components/Nav.vue";
import ChatInput from "~/components/chat/ChatInput.vue";

// รับ event จาก ChatInput
const handleSend = (event: { text: string; files?: File[] }) => {
  // สามารถเพิ่ม logic การจัดการข้อความที่นี่
  console.log('Message sent:', event.text);
  if (event.files) {
    console.log('Files attached:', event.files);
  }
};
</script>

<template>
  <div class="relative h-screen w-full flex flex-col">
    <Nav />
    
    <!-- Background Slot -->
    <div class="flex-1 overflow-auto">
      <slot name="background" />
    </div>
    
    <!-- Floating Input -->
    <div class="sticky bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
      <div class="max-w-3xl mx-auto">
        <slot name="input">
          <!-- ใช้ ChatInput component แทน -->
          <ChatInput 
            @send="handleSend"
            class="w-full"
          />
        </slot>
      </div>
    </div>
  </div>
</template>