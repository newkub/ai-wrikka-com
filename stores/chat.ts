import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// สร้างฟังก์ชัน generate UUID ที่ทำงานได้ทั้งใน browser และ server
const generateUUID = (): string => {
  // ถ้า browser รองรับ crypto.randomUUID (modern browsers)
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }
  
  // ถ้าไม่รองรับ ใช้วิธีสร้าง UUID v4 แบบทั่วไป
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  model?: string
  provider?: 'openai' | 'gemini'
}

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const currentChatId = ref<string | null>(null)

  // Get current chat
  const currentChat = computed(() => {
    return chats.value.find(chat => chat.id === currentChatId.value) || null
  })

  // Create a new chat
  const createChat = () => {
    const newChat: Chat = {
      id: generateUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    chats.value.push(newChat)
    currentChatId.value = newChat.id
    
    return newChat
  }

  // Add message to chat
  const addMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const chat = chats.value.find(c => c.id === chatId)
    
    if (!chat) return null
    
    const newMessage: Message = {
      id: generateUUID(),
      ...message,
      timestamp: Date.now()
    }
    
    chat.messages.push(newMessage)
    chat.updatedAt = Date.now()
    
    // Update chat title if it's the first user message
    if (chat.title === 'New Chat' && message.role === 'user') {
      chat.title = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
    }
    
    return newMessage
  }

  // Get chat by ID
  const getChatById = (id: string) => {
    return chats.value.find(chat => chat.id === id) || null
  }

  // Delete chat
  const deleteChat = (id: string) => {
    const index = chats.value.findIndex(chat => chat.id === id)
    
    if (index !== -1) {
      chats.value.splice(index, 1)
      
      // If we deleted the current chat, set current to the next available chat
      if (currentChatId.value === id) {
        currentChatId.value = chats.value.length > 0 ? chats.value[0].id : null
      }
      
      return true
    }
    
    return false
  }

  // Set current chat
  const setCurrentChat = (id: string) => {
    const chat = chats.value.find(c => c.id === id)
    
    if (chat) {
      currentChatId.value = id
      return true
    }
    
    return false
  }

  // Update chat metadata
  const updateChat = (id: string, data: Partial<Omit<Chat, 'id' | 'messages'>>) => {
    const chat = chats.value.find(c => c.id === id)
    
    if (chat) {
      Object.assign(chat, {
        ...data,
        updatedAt: Date.now()
      })
      return true
    }
    
    return false
  }

  // Check if running in browser environment
  const isClient = typeof window !== 'undefined'
  
  // Load chats from localStorage on initialization
  const loadChats = () => {
    if (!isClient) return
    
    const savedChats = localStorage.getItem('ai-chats')
    
    if (savedChats) {
      try {
        chats.value = JSON.parse(savedChats)
      } catch (e) {
        console.error('Error loading chats from localStorage:', e)
      }
    }
  }

  // Save chats to localStorage
  const saveChats = () => {
    if (!isClient) return
    localStorage.setItem('ai-chats', JSON.stringify(chats.value))
  }

  // Watch for changes and save to localStorage
  if (isClient) {
    watch(chats, () => {
      saveChats()
    }, { deep: true })
  }

  // Initialize
  loadChats()

  return {
    chats,
    currentChatId,
    currentChat,
    createChat,
    addMessage,
    getChatById,
    deleteChat,
    setCurrentChat,
    updateChat
  }
})
