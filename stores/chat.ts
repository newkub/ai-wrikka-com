import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ChatSession, Message, SenderType } from "~/types/chat";

export const useChatStore = defineStore(
	"chat",
	() => {
		const pinnedSessions = ref<ChatSession[]>([]);
		// State
		const messages = ref<Message[]>([]);
		const chatSessions = ref<ChatSession[]>([]);
		const currentSessionId = ref<string | null>(null);
		const isLoading = ref(false);

		// Getters
		const currentSession = computed(() => {
			return chatSessions.value.find(
				(session) => session.id === currentSessionId.value,
			);
		});

		// Helper function to ensure Date objects
		function ensureDates<T>(data: T): T {
			if (!data) return data;

			if (Array.isArray(data)) {
				return data.map((item) => ensureDates(item)) as unknown as T;
			}

			if (typeof data === "object" && data !== null) {
				const result = {} as Record<string, unknown>;
				for (const key in data) {
					const value = (data as Record<string, unknown>)[key];
					if (
						key === "timestamp" ||
						key === "createdAt" ||
						key === "updatedAt"
					) {
						result[key] = value ? new Date(String(value)) : value;
					} else {
						result[key] = ensureDates(value);
					}
				}
				return result as T;
			}

			return data;
		}

		// Actions
		function startNewSession() {
			const newSession: ChatSession = {
				id: crypto.randomUUID(),
				title: "New Chat",
				messages: [],
				createdAt: new Date(),
				updatedAt: new Date(),
				isPinned: false,
			};

			chatSessions.value.unshift(newSession);
			currentSessionId.value = newSession.id;
			messages.value = [];

			return newSession;
		}

		function loadSession(sessionId: string) {
			const session = chatSessions.value.find((s) => s.id === sessionId);
			if (session) {
				currentSessionId.value = sessionId;
				// Ensure all dates are Date objects
				messages.value = ensureDates([...session.messages]);
			}
		}

		function addMessage(
			sender: SenderType,
			content: string,
			isTyping = false,
		): Message {
			// Create new session if not exists
			if (!currentSessionId.value) {
				startNewSession();
			}

			const message: Message = {
				id: crypto.randomUUID(),
				content,
				sender,
				timestamp: new Date(),
				isTyping,
			};

			messages.value.push(message);

			// Update current session
			if (currentSessionId.value) {
				const session = chatSessions.value.find(
					(s) => s.id === currentSessionId.value,
				);
				if (session) {
					session.messages = [...messages.value];
					session.updatedAt = new Date();

					// Update session title if it's the first user message
					if (sender === "user" && messages.value.length === 1) {
						session.title =
							content.slice(0, 30) + (content.length > 30 ? "..." : "");
					}
				}
			}

			return message;
		}

		function setLoading(loading: boolean) {
			isLoading.value = loading;
		}

		/**
		 * อัพเดทข้อมูลของ session ปัจจุบัน
		 */
		function updateCurrentSession(updates: Partial<ChatSession>) {
			if (!currentSessionId.value) return;

			const sessionIndex = chatSessions.value.findIndex(
				(s) => s.id === currentSessionId.value,
			);
			if (sessionIndex === -1) return;

			chatSessions.value[sessionIndex] = {
				...chatSessions.value[sessionIndex],
				...updates,
				updatedAt: new Date(),
			};
		}

		const saveToLocalStorage = () => {
			localStorage.setItem("chatSessions", JSON.stringify(chatSessions.value));
			localStorage.setItem("currentSessionId", currentSessionId.value || "");
		};

		// Toggle pin session
		const togglePinSession = (sessionId: string) => {
			const session = chatSessions.value.find((s) => s.id === sessionId);
			if (session) {
				session.isPinned = !session.isPinned;
				saveToLocalStorage();
			}
		};

		// Delete session
		const deleteSessionById = (sessionId: string) => {
			const index = chatSessions.value.findIndex(
				(session) => session.id === sessionId,
			);
			if (index !== -1) {
				chatSessions.value.splice(index, 1);
				saveToLocalStorage();

				// If current session is deleted, switch to another session
				if (currentSessionId.value === sessionId) {
					currentSessionId.value = chatSessions.value[0]?.id || null;
					saveToLocalStorage();
				}
			}
		};

		// Rename session
		const renameSession = (sessionId: string, newTitle: string) => {
			const session = chatSessions.value.find((s) => s.id === sessionId);
			if (session) {
				session.title = newTitle;
				session.updatedAt = new Date();
				saveToLocalStorage();
			}
		};

		// Get pinned sessions
		const getPinnedSessions = computed(() =>
			chatSessions.value.filter((session) => session.isPinned),
		);

		// Get unpinned sessions
		const getUnpinnedSessions = computed(() =>
			chatSessions.value.filter((session) => !session.isPinned),
		);

		function copyToClipboard(content: string) {
			navigator.clipboard.writeText(content);
		}

		function replyToMessage(content: string) {
			return `> ${content}\n\n`;
		}

		function saveMessage(message: Message) {
			// TODO: Implement save to favorites or other storage
			console.log("Message saved:", message);
		}

		return {
			messages,
			chatSessions,
			currentSessionId,
			isLoading,
			currentSession,
			pinnedSessions,
			getPinnedSessions,
			getUnpinnedSessions,
			startNewSession,
			loadSession,
			addMessage,
			setLoading,
			updateCurrentSession,
			togglePinSession,
			deleteSessionById,
			renameSession,
			copyToClipboard,
			replyToMessage,
			saveMessage,
		};
	}
);
