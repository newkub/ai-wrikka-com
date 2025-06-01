<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Nav from "~/components/Nav.vue";
const router = useRouter();
const route = useRoute();
const showSettings = ref(true);

// This would come from your chat store in a real app
const chatHistory = ref([
	{
		id: "1",
		title: "First Chat",
		updatedAt: new Date(Date.now() - 1000 * 60 * 60),
	},
	{
		id: "2",
		title: "Second Chat",
		updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
	},
]);

const isActiveChat = (chatId: string) => {
	return route.params.id === chatId;
};

const newChat = () => {
	// In a real app, this would create a new chat and navigate to it
	const newChatId = Date.now().toString();
	chatHistory.value.unshift({
		id: newChatId,
		title: "New Chat",
		updatedAt: new Date(),
	});
	navigateToChat(newChatId);
};

const navigateToChat = (chatId: string) => {
	router.push(`/chat/${chatId}`);
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};

const theme = ref("system");
const notificationsEnabled = ref(true);
const fontSize = ref("medium");
const autoSave = ref(true);
const messageSound = ref(true);
const apiKey = ref("");
const language = ref("en");
</script>


<template>
  <div class="flex flex-col h-screen bg-background">
    <Nav />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar - Chat History -->
      <div class="w-64 bg-surface border-r border-border flex flex-col h-full">
        <!-- Logo -->
        <div class="p-4 border-b border-border flex-shrink-0">
          <h1 class="text-xl font-semibold text-foreground">Chat App</h1>
        </div>
        
        <!-- New Chat Button -->
        <div class="p-4 flex-shrink-0">
          <button 
            @click="newChat"
            class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <div class="i-mdi-plus h-5 w-5"></div>
            <span>New Chat</span>
          </button>
        </div>
        
        <!-- Chat History -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <div class="px-4 py-2 flex-shrink-0">
            <h2 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Chats</h2>
          </div>
          <div class="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            <div 
              v-for="chat in chatHistory" 
              :key="chat.id"
              @click="navigateToChat(chat.id)"
              :class="[
                'px-3 py-2 rounded-lg cursor-pointer hover:bg-accent',
                { 'bg-accent text-accent-foreground': isActiveChat(chat.id) }
              ]"
            >
              <div class="truncate">{{ chat.title || 'New Chat' }}</div>
              <div class="text-xs text-muted-foreground">{{ formatDate(chat.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <NuxtPage />
      </div>
      
      <!-- Settings Panel -->
      <div class="w-64 bg-surface border-l border-border flex flex-col">
        <div class="p-4 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Settings</h2>
        </div>
        
        <div class="p-4 overflow-y-auto">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-muted-foreground mb-1">Theme</label>
              <select v-model="theme" class="w-full text-sm rounded border-border shadow-sm focus:border-primary focus:ring-primary/50">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-muted-foreground mb-1">Font Size</label>
              <select v-model="fontSize" class="w-full text-sm rounded border-border shadow-sm focus:border-primary focus:ring-primary/50">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-muted-foreground mb-1">Language</label>
              <select v-model="language" class="w-full text-sm rounded border-border shadow-sm focus:border-primary focus:ring-primary/50">
                <option value="en">English</option>
                <option value="th">Thai</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-muted-foreground mb-1">API Key</label>
              <input 
                type="password" 
                v-model="apiKey" 
                placeholder="Enter your API key" 
                class="w-full text-sm rounded border-border shadow-sm focus:border-primary focus:ring-primary/50 bg-background text-foreground"
              />
            </div>
            
            <div class="space-y-2">
              <h3 class="text-xs font-medium text-muted-foreground">Preferences</h3>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="notificationsEnabled" class="rounded border-border text-primary focus:ring-primary/50">
                  <span class="ml-2 text-sm text-foreground">Enable notifications</span>
                </label>
              </div>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="autoSave" class="rounded border-border text-primary focus:ring-primary/50">
                  <span class="ml-2 text-sm text-foreground">Auto-save chats</span>
                </label>
              </div>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="messageSound" class="rounded border-border text-primary focus:ring-primary/50">
                  <span class="ml-2 text-sm text-foreground">Message sounds</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
