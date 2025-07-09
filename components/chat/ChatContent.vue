<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import type { Message } from "~/types/chat";

const props = defineProps<{
	messages: Message[];
	isLoading: boolean;
	formatTimeAgo: (date: Date | string) => string;
}>();

const emit = defineEmits<{
	(e: "reply", content: string): void;
	(e: "copy", content: string): void;
	(e: "save", message: Message): void;
}>();

const chatContainerRef = ref<HTMLElement | null>(null);

const scrollToBottom = (behavior: ScrollBehavior = "smooth"): void => {
	nextTick(() => {
		if (chatContainerRef.value) {
			chatContainerRef.value.scrollTo({
				top: chatContainerRef.value.scrollHeight,
				behavior,
			});
		}
	});
};

// Auto scroll when messages change
watch(
	() => [...props.messages],
	() => {
		scrollToBottom("auto");
	},
	{ deep: true },
);

// Initial scroll to bottom
onMounted(() => {
	scrollToBottom("auto");
});

defineExpose({
	scrollToBottom,
});
</script>

<template>
  <div ref="chatContainerRef" class="space-y-4">
    <div 
      v-for="(message, index) in messages" 
      :key="index"
      :class="{
        'justify-end': message.sender === 'user',
        'justify-start': message.sender === 'ai'
      }"
      class="flex"
    >
      <div
        :class="{
          'bg-primary text-white': message.sender === 'user',
          'bg-block border border-border': message.sender === 'ai'
        }"
        class="max-w-[80%] rounded-2xl p-4"
      >
        <div class="flex items-start gap-3">
          <div v-if="message.sender === 'ai'" class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <div class="i-mdi-robot-outline text-primary w-5 h-5"></div>
            </div>
          </div>
          <div>
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
          <div v-if="message.sender === 'user'" class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <div class="i-mdi-account text-primary w-5 h-5"></div>
            </div>
          </div>
        </div>
        <div class="mt-2 text-xs opacity-70">{{ formatTimeAgo(message.timestamp) }}</div>
        <div 
          v-if="!message.isTyping"
          class="absolute -bottom-5 right-0 flex items-center space-x-1 bg-block rounded-full px-2 py-1 shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <button 
            @click.stop="emit('copy', message.content)"
            class="p-1 rounded-full hover:bg-block-hover transition-colors"
            title="คัดลอก"
          >
            <div class="i-mdi-content-copy w-4 h-4"></div>
          </button>
          <button 
            v-if="message.sender === 'ai'"
            @click.stop="emit('reply', message.content)"
            class="p-1 rounded-full hover:bg-block-hover transition-colors"
            title="ตอบกลับ"
          >
            <div class="i-mdi-reply w-4 h-4"></div>
          </button>
          <button 
            @click.stop="emit('save', message)"
            class="p-1 rounded-full hover:bg-block-hover transition-colors"
            title="บันทึก"
          >
            <div class="i-mdi-bookmark-outline w-4 h-4"></div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-start">
      <div class="bg-block max-w-[80%] rounded-2xl p-4">
        <div class="flex items-center gap-2">
            <div class="h-2 w-2 bg-text/50 rounded-full animate-pulse"></div>
            <div class="h-2 w-2 bg-text/50 rounded-full animate-pulse"></div>
            <div class="h-2 w-2 bg-text/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>
