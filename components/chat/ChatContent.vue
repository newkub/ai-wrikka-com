<template>
  <div class="flex-1 overflow-y-auto p-4 pb-32 space-y-4" ref="chatContainer">
    <div 
      v-for="message in messages" 
      :key="message.id" 
      class="group flex px-2"
      :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
    >
      <div class="flex max-w-3xl w-full space-x-3">
        <!-- AI Avatar -->
        <div 
          v-if="message.sender !== 'user'"
          class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <div class="i-mdi-robot-outline text-primary w-5 h-5"></div>
        </div>
        
        <!-- Message Content -->
        <div class="relative">
          <div 
            :class="[
              'p-4 rounded-2xl shadow-sm transition-all duration-200',
              message.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-block border border-border rounded-tl-none'
            ]"
          >
            <div class="whitespace-pre-wrap break-words">
              <template v-if="message.isTyping">
                <div class="flex gap-1">
                  <div class="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]"></div>
                  <div class="w-2 h-2 rounded-full bg-current opacity-80 animate-bounce [animation-delay:150ms]"></div>
                  <div class="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:300ms]"></div>
                </div>
              </template>
              <template v-else>
                {{ message.content }}
              </template>
            </div>
          </div>
          
          <!-- Message Actions -->
          <div 
            v-if="!message.isTyping"
            class="absolute -bottom-5 right-0 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <button 
              @click.stop="$emit('copy', message.content)"
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="คัดลอก"
            >
              <div class="i-mdi-content-copy w-4 h-4"></div>
            </button>
            <button 
              v-if="message.sender === 'ai'"
              @click.stop="$emit('reply', message.content)"
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="ตอบกลับ"
            >
              <div class="i-mdi-reply w-4 h-4"></div>
            </button>
            <button 
              @click.stop="$emit('save', message)"
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="บันทึก"
            >
              <div class="i-mdi-bookmark-outline w-4 h-4"></div>
            </button>
            <span class="text-xs text-gray-500 dark:text-gray-400 px-1">
              {{ formatTimeAgo(message.timestamp) }}
            </span>
          </div>
        </div>
        
        <!-- User Avatar -->
        <div 
          v-if="message.sender === 'user'"
          class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <div class="i-mdi-account text-primary w-5 h-5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

defineProps<{
	messages: Array<{
		id: string;
		content: string;
		sender: "user" | "ai";
		timestamp: Date;
		isTyping?: boolean;
	}>;
	formatTimeAgo: (date: Date) => string;
}>();

defineEmits(["reply", "copy", "save"]);

const chatContainer = ref<HTMLElement | null>(null);

// Scroll to bottom when messages change
onMounted(() => {
	nextTick(() => {
		if (chatContainer.value) {
			chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
		}
	});
});
</script>
