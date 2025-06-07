<script setup lang="ts">
definePageMeta({
  layout: 'fullscreen'
});

const input = ref('');
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const isTyping = ref(false);

const sendMessage = async () => {
  if (!input.value.trim()) return;
  
  const userMessage = input.value;
  input.value = '';
  
  // Add user message to chat
  messages.value.push({
    role: 'user',
    content: userMessage
  });
  
  // Simulate AI response
  isTyping.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    messages.value.push({
      role: 'assistant',
      content: 'นี่คือการตอบกลับจาก AI ครับ'
    });
  } catch (error) {
    console.error('Error getting AI response:', error);
    messages.value.push({
      role: 'assistant',
      content: 'ขออภัย เกิดข้อผิดพลาดในการประมวลผลคำขอของคุณ โปรดลองอีกครั้งในภายหลัง'
    });
  } finally {
    isTyping.value = false;
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// Auto-scroll to bottom when messages change
watch(messages, () => {
  nextTick(() => {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
}, { deep: true });

// Auto-focus input on mount
onMounted(() => {
  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
  input?.focus();
});
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-hidden">
    <!-- Header -->
    <header class="bg-white shadow-sm py-4 px-6 flex-shrink-0">
      <h1 class="text-2xl font-bold text-gray-800">AI Assistant</h1>
    </header>

    <!-- Chat container -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
      <!-- Welcome message -->
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center text-gray-500">
          <div class="i-mdi-robot-happy text-6xl mx-auto mb-4 text-blue-500"></div>
          <p class="text-xl font-medium">สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?</p>
          <p class="text-sm mt-2">พิมพ์ข้อความเพื่อเริ่มการสนทนา</p>
        </div>
      </div>

      <!-- Messages -->
      <div v-else class="space-y-4">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-3/4 rounded-lg px-4 py-2',
              message.role === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 rounded-bl-none'
            ]"
          >
            <div v-if="message.role === 'assistant'" class="font-medium text-sm text-gray-500 mb-1">
              AI Assistant
            </div>
            <div class="whitespace-pre-wrap">{{ message.content }}</div>
          </div>
        </div>
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2 max-w-3/4">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="border-t border-gray-200 bg-white p-4 flex-shrink-0">
      <div class="flex space-x-2">
        <input
          v-model="input"
          type="text"
          placeholder="พิมพ์ข้อความที่นี่..."
          class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keydown="handleKeyDown"
        >
        <button
          @click="sendMessage"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="!input.trim()"
          :class="{'opacity-50 cursor-not-allowed': !input.trim()}"
        >
          ส่ง
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>