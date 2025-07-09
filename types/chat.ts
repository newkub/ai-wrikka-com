export type SenderType = "user" | "ai";

export interface Message {
	id: string;
	content: string;
	sender: SenderType;
	timestamp: Date;
	isTyping?: boolean;
}

export interface ChatSession {
	id: string;
	title: string;
	messages: Message[];
	createdAt: Date;
	updatedAt: Date;
	isPinned: boolean;
}

export interface ContextMenuPosition {
	x: number;
	y: number;
}

export interface ContextMenuState {
	show: boolean;
	position: ContextMenuPosition;
	sessionId: string | null;
}

export interface UpdateSessionPayload {
	id?: string;
	title?: string;
	updatedAt?: Date;
}
