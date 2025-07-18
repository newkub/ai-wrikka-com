

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useChat } from "~/composables/useChat";
import ChatInput from "~/components/chat/ChatInput.vue";
import ChatContent from "~/components/chat/ChatContent.vue";
import ChatHistory from "~/components/chat/ChatHistory.vue";

// Composable
const {
	chatContentRef,
	userInput,
	isSidebarOpen,
	currentSessionTitle,
	isLoading,
	messages,
	hasMessages,
	formatTimeAgo,
	handleClickOutside,
	createNewSession,
	loadSessionFromRoute,
	sendMessage,
} = useChat();

// Event listeners
onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

// เริ่มต้นโหลดเซสชัน
loadSessionFromRoute(useRoute().params.id);

// ติดตามการเปลี่ยนแปลงของ route
watch(
	() => useRoute().params.id,
	(newId) => {
		loadSessionFromRoute(newId);
	},
);
</script>


<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 md:flex-row">
    <!-- Sidebar -->
    <aside 
      class="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Chats</h1>
        <button 
          type="button"
          @click="createNewSession"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          <div class="i-mdi-plus w-4 h-4 mr-2 -ml-1" />
          New Chat
        </button>
      </div>
      <ChatHistory 
        class="flex-1 overflow-y-auto" 
        @select-chat="() => isSidebarOpen = false"
      />
    </aside>
    
    <!-- Mobile components -->
    <button 
      type="button"
      @click="isSidebarOpen = !isSidebarOpen"
      class="fixed left-4 top-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md lg:hidden"
      aria-label="Toggle sidebar"
    >
      <div v-if="isSidebarOpen" class="i-mdi-close h-6 w-6 text-gray-600 dark:text-gray-300" />
      <div v-else class="i-mdi-menu h-6 w-6 text-gray-600 dark:text-gray-300" />
    </button>

    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>
    <aside 
      v-if="isSidebarOpen"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden"
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Chats</h1>
        <button 
          type="button"
          @click="createNewSession"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          <div class="i-mdi-plus w-4 h-4 mr-2 -ml-1" />
          New Chat
        </button>
      </div>
      <ChatHistory 
        class="flex-1 overflow-y-auto" 
        @select-chat="() => isSidebarOpen = false"
      />
    </aside>
      
    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Chat Header -->
      <header class="h-14 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="flex items-center">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ currentSessionTitle }}
          </h1>
        </div>
      </header>

      <!-- Chat Content -->
      <main class="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
        <div class="max-w-3xl mx-auto w-full p-4">
          <div v-if="hasMessages" class="space-y-4">
            <ChatContent 
              ref="chatContentRef"
              :messages="messages"
              :is-loading="isLoading"
              :format-time-ago="formatTimeAgo"
              class="w-full"
            />
            
          </div>
          
          <!-- Empty State -->
          <div v-else class="h-full flex items-center justify-center">
            <div class="text-center max-w-md mx-auto">
              <div class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                <div class="i-mdi-message w-16 h-16" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">เริ่มการสนทนาใหม่</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                เริ่มการสนทนากับ AI Assistant ของคุณได้ทันที
              </p>
            </div>
          </div>
            <!-- Chat Input -->
      <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <ChatInput 
            :model-value="userInput"
            :loading="isLoading"
            @update:model-value="(val: string) => userInput = val"
            @send="sendMessage"
            class="w-full"
            placeholder="Message ChatGPT..."
          />
          <p class="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
       
      </div>
        </div>
      </main>

      
      
    
    </div>
  </div>
</template>