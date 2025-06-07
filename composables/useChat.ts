import { ref, nextTick } from 'vue';
import { useClipboard, useNow } from '@vueuse/core';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export function useChat() {
  const messages = ref<Message[]>([]);
  const chatSessions = useLocalStorage<ChatSession[]>('chat-sessions', []);
  const currentSessionId = ref<string | null>(null);
  const now = useNow();
  const chatContainer = ref<HTMLElement | null>(null);
  const { copy } = useClipboard();

  // Format time ago in Thai
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((now.value.getTime() - new Date(date).getTime()) / 1000);
    
    const intervals = {
      ปี: 31536000,
      เดือน: 2592000,
      สัปดาห์: 604800,
      วัน: 86400,
      ชั่วโมง: 3600,
      นาที: 60,
      วินาที: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : ''}ที่แล้ว`;
      }
    }
    
    return 'เมื่อสักครู่';
  };

  // Add a new message
  const addMessage = (sender: 'user' | 'ai', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      isTyping: sender === 'ai' && content === ''
    };
    
    messages.value.push(message);
    updateChatSession();
    
    nextTick(() => {
      scrollToBottom();
    });
    
    return message;
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  };

  // Update current chat session
  const updateChatSession = () => {
    if (!messages.value.length) return;
    
    const sessionTitle = messages.value[0]?.content.slice(0, 50) || 'การสนทนาใหม่';
    const sessionData = {
      id: currentSessionId.value || Date.now().toString(),
      title: sessionTitle,
      messages: [...messages.value],
      updatedAt: new Date().toISOString()
    };

    if (!currentSessionId.value) {
      // New session
      chatSessions.value.unshift(sessionData);
      currentSessionId.value = sessionData.id;
    } else {
      // Update existing session
      const sessionIndex = chatSessions.value.findIndex(s => s.id === currentSessionId.value);
      if (sessionIndex !== -1) {
        chatSessions.value[sessionIndex] = sessionData;
      } else {
        chatSessions.value.unshift(sessionData);
      }
    }
  };

  // Start a new chat session
  const startNewChat = () => {
    if (messages.value.length > 0) {
      updateChatSession();
    }
    messages.value = [];
    currentSessionId.value = null;
  };

  // Load a chat session
  const loadSession = (sessionId: string) => {
    const session = chatSessions.value.find(s => s.id === sessionId);
    if (session) {
      messages.value = session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      currentSessionId.value = sessionId;
      nextTick(scrollToBottom);
    }
  };

  // Delete a chat session
  const deleteSession = (sessionId: string, event: Event) => {
    event.stopPropagation();
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบการสนทนานี้?')) {
      chatSessions.value = chatSessions.value.filter(s => s.id !== sessionId);
      if (currentSessionId.value === sessionId) {
        messages.value = [];
        currentSessionId.value = null;
      }
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    copy(text);
    // TODO: Add toast notification
  };

  // Reply to a message
  const replyToMessage = (content: string) => {
    return `ตอบกลับ: ${content}\n\n`;
  };

  // Save a message
  const saveMessage = (message: Message) => {
    const savedMessages = JSON.parse(localStorage.getItem('saved-messages') || '[]');
    savedMessages.push({
      ...message,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('saved-messages', JSON.stringify(savedMessages));
    // TODO: Add toast notification
  };

  return {
    messages,
    chatSessions,
    currentSessionId,
    chatContainer,
    formatTimeAgo,
    addMessage,
    scrollToBottom,
    startNewChat,
    loadSession,
    deleteSession,
    copyToClipboard,
    replyToMessage,
    saveMessage
  };
}
