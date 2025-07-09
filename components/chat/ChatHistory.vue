<template>
  <div class="h-full overflow-y-auto" @contextmenu.prevent>
    <div class="p-4">
      <template>
        <div class="flex flex-col h-full">
          <div class="p-4">
            <button
              @click="createNewChat"
              class="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
            >
              <div class="i-mdi-plus w-4 h-4 mr-2" />
              New Chat
            </button>
            
            <!-- Context Menu -->
            <ChatContextMenu
              v-if="showContextMenu"
              v-model="showContextMenu"
              :position="contextMenuPosition"
              :session="selectedSession"
              @delete="handleDeleteSession"
              @rename="handleRenameSession"
              @togglePin="handleTogglePin"
            />
            
            <!-- Rename Modal -->
            <div v-if="showRenameModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-block rounded-lg p-6 w-96">
                <h3 class="text-lg font-medium mb-4">Rename Chat</h3>
                <input
                  v-model="newSessionTitle"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg mb-4"
                  @keyup.enter="confirmRename"
                  placeholder="Enter new chat title"
                  ref="renameInput"
                />
                <div class="flex justify-end gap-2">
                  <button @click="showRenameModal = false" class="px-4 py-2 text-text/80 hover:bg-block-hover rounded-lg">
                    Cancel
                  </button>
                  <button @click="confirmRename" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="chatSessions.length === 0" class="text-center text-gray-500 py-4">
            ยังไม่มีการแชท
          </div>
          
          <!-- Pinned Sessions -->
          <div v-if="pinnedSessions.length > 0" class="mb-4">
            <h3 class="text-xs font-medium text-text/60 mb-2 px-1">PINNED</h3>
            <div class="space-y-1">
              <div
                v-for="session in pinnedSessions"
                :key="session.id"
                @click="selectSession(session.id)"
                @contextmenu.prevent="openContextMenu($event, session)"
                :class="[
                  'group relative w-full text-left p-2 rounded-lg transition-colors cursor-pointer',
                  currentSessionId === session.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-block-hover'
                ]"
              >
                <div class="flex items-center gap-2">
                  <div class="i-mdi-message-text-outline w-4 h-4 mr-2" />
                  <div class="truncate flex-1">{{ session.title || 'แชทใหม่' }}</div>
                </div>
                <div class="text-xs text-text/60 mt-1 ml-5">
                  {{ formatTimeAgo(session.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Unpinned Sessions -->
          <div v-if="unpinnedSessions.length > 0">
            <h3 v-if="pinnedSessions.length > 0" class="text-xs font-medium text-text/60 mb-2 px-1">RECENT</h3>
            <div class="space-y-1">
              <div
                v-for="session in unpinnedSessions"
                :key="session.id"
                @click="selectSession(session.id)"
                @contextmenu.prevent="openContextMenu($event, session)"
                :class="[
                  'group relative w-full text-left p-2 rounded-lg transition-colors cursor-pointer',
                  currentSessionId === session.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-block-hover'
                ]"
              >
                <div class="truncate">{{ session.title || 'แชทใหม่' }}</div>
                <div class="text-xs text-text/60 mt-1">
                  {{ formatTimeAgo(session.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useChatStore } from "~/stores/chat";
import ChatContextMenu from "~/components/chat/ChatContextMenu.vue";

const router = useRouter();
import type { ChatSession } from "~/types/chat";

const route = useRoute();
const chatStore = useChatStore();
const emit = defineEmits(["close"]);

// State
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedSession = ref<ChatSession | null>(null);
const showRenameModal = ref(false);
const newSessionTitle = ref("");
const renameInput = ref<HTMLInputElement | null>(null);

// Computed
const currentSessionId = computed(() => chatStore.currentSessionId);
const pinnedSessions = computed(() => chatStore.getPinnedSessions);
const unpinnedSessions = computed(() => chatStore.getUnpinnedSessions);
const chatSessions = computed(() => [
	...pinnedSessions.value,
	...unpinnedSessions.value,
]);

// Methods
const formatTimeAgo = (date: Date | string) => {
	const now = new Date();
	const targetDate = typeof date === "string" ? new Date(date) : date;
	const diffInSeconds = Math.floor(
		(now.getTime() - targetDate.getTime()) / 1000,
	);

	if (diffInSeconds < 60) return "เมื่อสักครู่";
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
	if (diffInSeconds < 86400)
		return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`;

	// แทนที่ format() ของ date-fns ด้วย toLocaleDateString
	const options = { day: "numeric", month: "short", year: "numeric" } as const;
	return targetDate.toLocaleDateString("th-TH", options);
};

const createNewChat = async () => {
	const newSession = chatStore.startNewSession();
	await router.push(`/chat/${newSession.id}`);
	emit("close");
};

const selectSession = (sessionId: string) => {
	router.push(`/chat/${sessionId}`);
	emit("close");
};

// Context Menu Handlers
const openContextMenu = (event: MouseEvent, session: ChatSession) => {
	selectedSession.value = session;
	contextMenuPosition.value = { x: event.clientX, y: event.clientY };
	showContextMenu.value = true;
};

const handleDeleteSession = async (sessionId: string) => {
	if (confirm("คุณแน่ใจหรือไม่ที่ต้องการลบการสนทนานี้?")) {
		chatStore.deleteSessionById(sessionId);
		if (currentSessionId.value === sessionId) {
			await createNewChat();
		}
	}
};

const handleRenameSession = (session: ChatSession) => {
	selectedSession.value = session;
	newSessionTitle.value = session.title;
	showRenameModal.value = true;
	nextTick(() => {
		renameInput.value?.focus();
		renameInput.value?.select();
	});
};

const confirmRename = () => {
	if (selectedSession.value && newSessionTitle.value.trim()) {
		chatStore.renameSession(
			selectedSession.value.id,
			newSessionTitle.value.trim(),
		);
		showRenameModal.value = false;
	}
};

const handleTogglePin = (session: ChatSession) => {
	chatStore.togglePinSession(session.id);
};
</script>
