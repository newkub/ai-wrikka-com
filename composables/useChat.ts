import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '~/stores/chat'
import type { ChatSession } from '~/types/chat';

export const useChat = () => {
  const router = useRouter()
  const chatStore = useChatStore()
  
  // Refs
  const chatContentRef = ref<{ scrollToBottom: () => void } | null>(null)
  const userInput = ref('')
  const isSidebarOpen = ref(false)
  
  // Computed
  const currentSessionTitle = computed(() => chatStore.currentSession?.title || 'New Chat')
  const isLoading = computed(() => chatStore.isLoading)
  const messages = computed(() => chatStore.messages)
  const hasMessages = computed(() => messages.value.length > 0)

  // Format time ago helper
  const formatTimeAgo = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const timestamp = dateObj.getTime()
    
    if (Number.isNaN(timestamp)) return 'ไม่ทราบเวลา'
    
    const now = Date.now()
    const diffInSeconds = Math.floor((now - timestamp) / 1000)
    
    if (diffInSeconds < 60) return 'เพิ่งเมื่อสักครู่'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`
    return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`
  }

  // Handle sidebar click outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null
    const sidebar = document.querySelector('aside')
    const toggleButton = document.querySelector('button[aria-label="Toggle sidebar"]')
    
    if (isSidebarOpen.value && sidebar && target && 
        !sidebar.contains(target) && 
        toggleButton && 
        !toggleButton.contains(target)) {
      isSidebarOpen.value = false
    }
  }

  // Create new chat session
  const createNewSession = async (): Promise<ChatSession> => {
    const newSession = chatStore.startNewSession()
    await router.push(`/chat/${newSession.id}`)
    if (window.innerWidth < 1024) isSidebarOpen.value = false
    return newSession
  }

  // Load session from route
  const loadSessionFromRoute = async (newId: string | string[] | undefined) => {
    try {
      if (newId && typeof newId === 'string') {
        await chatStore.loadSession(newId)
      } else if (chatStore.chatSessions.length > 0) {
        const latestSession = [...chatStore.chatSessions]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
        
        if (latestSession) {
          await router.push(`/chat/${latestSession.id}`)
        } else {
          await createNewSession()
        }
      } else {
        await createNewSession()
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      await createNewSession()
    }
  }

  // Send message
  const sendMessage = async (): Promise<void> => {
    const content = userInput.value.trim()
    if (!content || isLoading.value) return

    try {
      chatStore.addMessage('user', content)
      userInput.value = ''
      chatStore.setLoading(true)
      
      await nextTick()
      chatContentRef.value?.scrollToBottom()


      // Call API and handle response
      const response = await $fetch('/api/chat', {
        method: 'POST',
        body: {
          messages: [
            {
              role: 'system',
              content: 'คุณเป็นผู้ช่วย AI ที่ช่วยตอบคำถามและให้ข้อมูลที่เป็นประโยชน์ ใช้ภาษาไทยในการตอบ'
            },
            ...chatStore.messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
 })),
            {
              role: 'user',
              content: content
            }
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1000
        }
      })
      
      const aiResponse = response.choices[0]?.message?.content || 'ขออภัย ไม่สามารถสร้างคำตอบได้ในขณะนี้'
      chatStore.addMessage('ai', aiResponse)
      
      // Update session title from first message
      if (chatStore.messages.length <= 2) {
        const firstMessage = chatStore.messages[0]?.content || ''
        const sessionTitle = firstMessage.length > 30 
          ? `${firstMessage.substring(0, 30)}...` 
          : firstMessage || 'แชทใหม่'
        
        chatStore.updateCurrentSession({
          title: sessionTitle
        })
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      chatStore.addMessage('ai', 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI กรุณาลองใหม่อีกครั้ง')
    } finally {
      chatStore.setLoading(false)
      await nextTick()
      chatContentRef.value?.scrollToBottom()
    }
  }

  return {
    // Refs
    chatContentRef,
    userInput,
    isSidebarOpen,
    
    // Computed
    currentSessionTitle,
    isLoading,
    messages,
    hasMessages,
    
    // Methods
    formatTimeAgo,
    handleClickOutside,
    createNewSession,
    loadSessionFromRoute,
    sendMessage
  }
}

export default useChat
