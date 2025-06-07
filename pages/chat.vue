

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useToggle } from '@vueuse/core';
import { useChat, type Message, type ChatSession } from '~/composables/useChat';
import ChatContent from '~/components/chat/ChatContent.vue';
import ChatInput from '~/components/chat/ChatInput.vue';

definePageMeta({
  layout: 'fullscreen'
});


// Initialize chat composable
const {
  messages,
  chatSessions,
  currentSessionId,
  addMessage,
  startNewChat: startNewChatInComposable,
  loadSession: loadSessionInComposable,
  deleteSession,
  formatTimeAgo,
  copyToClipboard,
  replyToMessage: replyToMessageInComposable,
  saveMessage: saveMessageInComposable
} = useChat();

// Refs
const userInput = ref('');
const isLoading = ref(false);
const showChatHistory = ref(false);
const chatContainerRef = ref<HTMLElement | null>(null);
const [isMobileMenuOpen, toggleMobileMenu] = useToggle(false);

// Toggle chat history panel
const toggleChatHistory = (): void => {
  showChatHistory.value = !showChatHistory.value;
};

// Start a new chat
const startNewChat = (): void => {
  startNewChatInComposable();
  userInput.value = '';
  showChatHistory.value = false;
  nextTick(() => {
    addMessage('ai', 'สวัสดีครับ! ฉันคือ AI Assistant ยินดีที่ได้รู้จักครับ');
  });};

// Load a chat session
const loadSession = (sessionId: string): void => {
  loadSessionInComposable(sessionId);
  showChatHistory.value = false;
  scrollToBottom();
};

// Handle reply from ChatContent
const handleReply = (content: string): void => {
  userInput.value = replyToMessageInComposable(content);
  nextTick(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      const length = userInput.value.length;
      textarea.setSelectionRange(length, length);
    }
  });
};

// Handle copy message
const handleCopy = (content: string): void => {
  copyToClipboard(content);
};

// Handle save message
const handleSave = (message: Message): void => {
  saveMessageInComposable(message);
};

// Send a new message
const sendMessage = async (): Promise<void> => {
  const content = userInput.value.trim();
  if (!content || isLoading.value) return;
  
  // Add user message
  const userMessage = addMessage('user', content);
  userInput.value = '';
  
  // Show typing indicator
  const typingMessage = addMessage('ai', '');
  typingMessage.isTyping = true;
  
  isLoading.value = true;
  
  try {
    // Simulate AI response (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Replace typing indicator with actual response
    typingMessage.content = `นี่คือการตอบกลับสำหรับ: ${userMessage.content}`;
    typingMessage.isTyping = false;
    
  } catch (error) {
    console.error('Error sending message:', error);
    typingMessage.content = 'ขออภัย เกิดข้อผิดพลาดในการส่งข้อความ';
    typingMessage.isTyping = false;
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// Scroll to bottom of chat using the composable's method
const scrollToBottom = (): void => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

// Initial setup
onMounted(() => {
  // Set up chat container ref
  chatContainerRef.value = document.querySelector('.chat-container');
  
  // Load last session or start new chat
  if (chatSessions.value.length > 0) {
    loadSession(chatSessions.value[0].id);
  } else {
    startNewChat();
  }
  
  // Scroll to bottom on initial load
  nextTick(scrollToBottom);
});
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <!-- Mobile menu button -->
    <div class="md:hidden fixed top-4 left-4 z-30">
      <button 
        @click="toggleChatHistory" 
        class="p-2 rounded-md bg-block hover:bg-background/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <div class="i-mdi-menu w-6 h-6"></div>
      </button>
    </div>
    
    <!-- Chat History Panel (Top Left) -->
    <div 
      class="fixed top-16 left-4 w-64 bg-block border border-border rounded-lg shadow-lg z-20 transition-all duration-300 ease-in-out overflow-hidden"
      :class="{
        'opacity-0 -translate-y-4 pointer-events-none': !showChatHistory,
        'opacity-100 translate-y-0': showChatHistory
      }"
    >
      <div class="p-3 border-b border-border bg-primary/5">
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-semibold">ประวัติการสนทนา</h2>
          <button 
            @click="startNewChat"
            class="p-1 rounded-md hover:bg-primary/10 transition-colors"
            title="New Chat"
          >
            <div class="i-mdi-plus w-4 h-4"></div>
          </button>
        </div>
      </div>
      
      <div class="max-h-[60vh] overflow-y-auto">
        <div v-if="chatSessions.length === 0" class="p-4 text-center text-sm">
          ไม่มีประวัติการสนทนา
        </div>
        <div v-else>
          <div 
            v-for="session in chatSessions" 
            :key="session.id"
            class="p-3 border-b border-border hover:bg-background/50 cursor-pointer group"
            @click="loadSession(session.id)"
          >
            <div class="flex justify-between items-center">
              <div class="font-medium text-sm truncate">
                {{ session.title || 'การสนทนาใหม่' }}
              </div>
              <button 
                @click.stop="deleteSession(session.id, $event)"
                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <div class="i-mdi-close w-4 h-4"></div>
              </button>
            </div>
            <div class="text-xs mt-1 text-gray-500">
              {{ formatTimeAgo(new Date(session.updatedAt)) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col pt-16 md:pt-0">
      <!-- Messages container -->
      <ChatContent 
        ref="chatContentRef"
        :messages="messages"
        :format-time-ago="formatTimeAgo"
        @reply="handleReply"
        @copy="handleCopy"
        @save="handleSave"
      />

      <!-- Input area -->
      <ChatInput
        v-model="userInput"
        :is-loading="isLoading"
        @send="sendMessage"
      />
    </div>
  </div>
</template>