<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useClipboard, useLocalStorage, useToggle } from '@vueuse/core';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
const showChatHistory = ref(false);
const [isMobileMenuOpen, toggleMobileMenu] = useToggle(false);

// เก็บประวัติการสนทนาแต่ละครั้ง
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

const chatSessions = useLocalStorage<ChatSession[]>('chat-sessions', []);
const currentSessionId = ref<string | null>(null);

// ใช้ Local Storage เพื่อบันทึกประวัติแชท
const chatHistory = useLocalStorage<Message[]>('chat-history', []);

// โหลดประวัติแชทเมื่อโหลดหน้า
onMounted(() => {
  if (chatHistory.value.length > 0) {
    messages.value = chatHistory.value.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } else {
    // ข้อความต้อนรับเริ่มต้น
    addMessage('ai', 'สวัสดีครับ! ผมคือ AI Assistant ยินดีที่ได้รู้จักครับ')
  }
  scrollToBottom();
});

// สร้างหรืออัพเดท session ปัจจุบัน
const updateChatSession = () => {
  if (messages.value.length === 0) return;
  
  const sessionTitle = messages.value.find(m => m.sender === 'user')?.content.slice(0, 50) || 'New Chat';
  const now = new Date();
  
  if (!currentSessionId.value) {
    // สร้าง session ใหม่
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: sessionTitle,
      messages: [...messages.value],
      updatedAt: now
    };
    chatSessions.value.unshift(newSession);
    currentSessionId.value = newSession.id;
  } else {
    // อัพเดท session ที่มีอยู่
    const sessionIndex = chatSessions.value.findIndex(s => s.id === currentSessionId.value);
    if (sessionIndex !== -1) {
      chatSessions.value[sessionIndex] = {
        ...chatSessions.value[sessionIndex],
        title: sessionTitle,
        messages: [...messages.value],
        updatedAt: now
      };
    }
  }
};

// ฟังก์ชันเพิ่มข้อความใหม่
const addMessage = (sender: 'user' | 'ai', content: string) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    content,
    sender,
    timestamp: new Date()
  };
  
  messages.value.push(newMessage);
  updateChatSession();
  
  scrollToBottom();
  return newMessage;
};

// ฟังก์ชันเลื่อนไปยังข้อความล่าสุด
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// ฟังก์ชันส่งข้อความ
const sendMessage = async () => {
  const content = userInput.value.trim();
  if (!content || isLoading.value) return;
  
  // เพิ่มข้อความผู้ใช้
  addMessage('user', content);
  userInput.value = '';
  
  // แสดงข้อความกำลังพิมพ์ของ AI
  const typingMessage = addMessage('ai', '...');
  typingMessage.isTyping = true;
  
  isLoading.value = true;
  
  try {
    // เรียกใช้ AI API (ตัวอย่างใช้ OpenAI)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: content })
    });
    
    const data = await response.json();
    
    // อัพเดทข้อความ AI
    typingMessage.content = data.reply || 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ';
    typingMessage.isTyping = false;
  } catch (error) {
    console.error('Error:', error);
    typingMessage.content = 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ';
    typingMessage.isTyping = false;
  } finally {
    isLoading.value = false;
    chatHistory.value = [...messages.value];
    scrollToBottom();
  }
};

// ฟังก์ชันคัดลอกข้อความ
const { copy } = useClipboard();
const copyToClipboard = (text: string) => {
  copy(text);
  // สามารถเพิ่มการแจ้งเตือนว่าคัดลอกสำเร็จได้ที่นี่
};

// ฟังก์ชันลบ session
const deleteSession = (sessionId: string, event: Event) => {
  event.stopPropagation();
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบการสนทนานี้?')) {
    const index = chatSessions.value.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      chatSessions.value.splice(index, 1);
      if (currentSessionId.value === sessionId) {
        startNewChat();
      }
    }
  }
};

// เริ่มการสนทนาใหม่
const startNewChat = () => {
  messages.value = [];
  currentSessionId.value = null;
  showChatHistory.value = false;
  setTimeout(() => {
    addMessage('ai', 'สวัสดีครับ! ฉันคือ AI Assistant ยินดีที่ได้รู้จักครับ');
  }, 100);
};

// โหลดการสนทนาจาก session
const loadSession = (sessionId: string) => {
  const session = chatSessions.value.find(s => s.id === sessionId);
  if (session) {
    messages.value = session.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    currentSessionId.value = sessionId;
    showChatHistory.value = false;
    nextTick(scrollToBottom);
  }
};

// เมื่อโหลดหน้าแรก
onMounted(() => {
  if (chatSessions.value.length > 0) {
    // โหลด session ล่าสุด
    const latestSession = chatSessions.value[0];
    loadSession(latestSession.id);
  } else {
    // ถ้ายังไม่มี session ให้สร้างใหม่
    startNewChat();
  }
});

// ฟังก์ชันกด Enter เพื่อส่งข้อความ
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const toggleChatHistory = () => {
  showChatHistory.value = !showChatHistory.value;
};
</script>

<template>
    <!-- Mobile menu button -->
    <div class="md:hidden fixed top-4 left-4 z-30">
      <button 
        @click="toggleChatHistory" 
        class="p-2 rounded-md bg-block text-text hover:bg-background/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <div class="i-mdi-menu w-6 h-6"></div>
      </button>
    </div>
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 w-64 bg-block border-r border-border transform transition-transform duration-300 ease-in-out z-20"
      :class="{
        '-translate-x-full': !showChatHistory,
        'translate-x-0': showChatHistory,
        'md:translate-x-0': true
      }"
    >
      <div class="p-4 border-b border-border">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-text">Chat History</h2>
          <button 
            @click="startNewChat"
            class="p-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            title="New Chat"
          >
            <div class="i-mdi-plus w-5 h-5"></div>
          </button>
        </div>
        <div class="relative">
          <input
            type="text"
            placeholder="Search chats..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <div class="i-mdi-magnify w-4 h-4 text-gray-500"></div>
          </div>
        </div>
      </div>
      <div class="overflow-y-auto h-[calc(100%-120px)]">
        <div v-if="chatSessions.length === 0" class="p-4 text-center text-sm text-text/60">
          No chat history
        </div>
        <div v-else>
          <div 
            v-for="session in chatSessions" 
            :key="session.id"
            class="p-3 border-b border-border hover:bg-background/50 cursor-pointer"
            @click="loadSession(session.id)"
          >
            <div class="font-medium text-text truncate">{{ session.title || 'New Chat' }}</div>
            <div class="text-xs text-text/60">
              {{ new Date(session.updatedAt).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="flex-1 flex flex-col h-full overflow-hidden ml-0 md:ml-64 transition-all duration-300 ease-in-out">
      <div 
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <div v-for="message in messages" :key="message.id" class="flex">
          <div 
            :class="[
              'max-w-3xl w-full mx-auto',
              message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'
            ]"
          >
            <div 
              :class="[
                'p-4 rounded-lg',
                message.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-block border border-border'
              ]"
            >
              <div class="whitespace-pre-wrap">
                <template v-if="message.isTyping">
                  <div class="flex gap-1">
                    <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]"></div>
                    <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]"></div>
                    <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]"></div>
                  </div>
                </template>
                <template v-else>
                  {{ message.content }}
                </template>
              </div>
              <div 
                :class="[
                  'text-xs mt-1',
                  message.sender === 'user' ? 'text-white/80' : 'text-text/60'
                ]"
              >
                {{ new Date(message.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }}
                <button 
                  v-if="!message.isTyping"
                  @click="copyToClipboard(message.content)"
                  class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="คัดลอก"
                >
                  <div class="i-mdi-content-copy w-3.5 h-3.5"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
    <div class="border-t border-border bg-block p-4">
      <div class="max-w-3xl mx-auto">
        <div class="relative">
          <textarea
            v-model="userInput"
            @keydown="handleKeyDown"
            :disabled="isLoading"
            placeholder="พิมพ์ข้อความที่นี่..."
            class="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[44px] max-h-[200px]"
            rows="1"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isLoading"
            :class="[
              'absolute right-2 bottom-2 p-2 rounded-full transition-colors',
              !userInput.trim() || isLoading
                ? 'text-text/40 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
            ]"
          >
            <div v-if="isLoading" class="i-svg-spinners-180-ring w-5 h-5"></div>
            <div v-else class="i-mdi-send w-5 h-5"></div>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-center">
          AI อาจสร้างข้อมูลที่ผิดพลาดได้ โปรดตรวจสอบความถูกต้องก่อนนำไปใช้
        </p>
      </div>
    </div>
  </div>
</template>
