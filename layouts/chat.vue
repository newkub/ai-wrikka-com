<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Nav from '~/components/Nav.vue';
const router = useRouter();
const route = useRoute();
const showSettings = ref(true);

// This would come from your chat store in a real app
const chatHistory = ref([
  { id: '1', title: 'First Chat', updatedAt: new Date(Date.now() - 1000 * 60 * 60) },
  { id: '2', title: 'Second Chat', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
]);

const isActiveChat = (chatId: string) => {
  return route.params.id === chatId;
};

const newChat = () => {
  // In a real app, this would create a new chat and navigate to it
  const newChatId = Date.now().toString();
  chatHistory.value.unshift({
    id: newChatId,
    title: 'New Chat',
    updatedAt: new Date()
  });
  navigateToChat(newChatId);
};

const navigateToChat = (chatId: string) => {
  router.push(`/chat/${chatId}`);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

const theme = ref('system');
const notificationsEnabled = ref(true);
const fontSize = ref('medium');
const autoSave = ref(true);
const messageSound = ref(true);
const apiKey = ref('');
const language = ref('en');
</script>


<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <Nav />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar - Chat History -->
      <div class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <!-- Logo -->
        <div class="p-4 border-b border-gray-200">
          <h1 class="text-xl font-semibold text-gray-800">Chat App</h1>
        </div>
        
        <!-- New Chat Button -->
        <div class="p-4">
          <button 
            @click="newChat"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
        
        <!-- Chat History -->
        <div class="flex-1 overflow-y-auto">
          <div class="px-4 py-2">
            <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Chats</h2>
            <ul class="space-y-1">
              <li 
                v-for="chat in chatHistory" 
                :key="chat.id"
                @click="navigateToChat(chat.id)"
                :class="[
                  'px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100',
                  { 'bg-blue-50 text-blue-600': isActiveChat(chat.id) }
                ]"
              >
                <div class="truncate">{{ chat.title || 'New Chat' }}</div>
                <div class="text-xs text-gray-400">{{ formatDate(chat.updatedAt) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <NuxtPage />
      </div>
      
      <!-- Settings Panel -->
      <div class="w-64 bg-white border-l border-gray-200 flex flex-col">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Settings</h2>
        </div>
        
        <div class="p-4 overflow-y-auto">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Theme</label>
              <select v-model="theme" class="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
              <select v-model="fontSize" class="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Language</label>
              <select v-model="language" class="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="th">Thai</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">API Key</label>
              <input 
                type="password" 
                v-model="apiKey" 
                placeholder="Enter your API key" 
                class="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div class="space-y-2">
              <h3 class="text-xs font-medium text-gray-700">Preferences</h3>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="notificationsEnabled" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <span class="ml-2 text-sm text-gray-700">Enable notifications</span>
                </label>
              </div>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="autoSave" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <span class="ml-2 text-sm text-gray-700">Auto-save chats</span>
                </label>
              </div>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="messageSound" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <span class="ml-2 text-sm text-gray-700">Message sounds</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
