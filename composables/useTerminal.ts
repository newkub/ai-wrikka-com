import { ref } from "vue";

export type TerminalTheme = "light" | "dark";

export type TerminalLineType =
	| "command"
	| "output"
	| "error"
	| "info"
	| "success"
	| "warning";

export interface TerminalLine {
	text: string;
	type?: TerminalLineType;
}

export function useTerminal(initialContent: string[] = ["$ Ready"]) {
	const terminalContent = ref<TerminalLine[]>(
		initialContent.map((text) => ({
			text,
			type: text.startsWith("$") ? "command" : "info",
		})),
	);
	const commandInput = ref("");
	const terminalRef = ref<HTMLElement | null>(null);
	const autoScroll = ref(true);

	const scrollToBottom = () => {
		if (autoScroll.value && terminalRef.value) {
			requestAnimationFrame(() => {
				if (terminalRef.value) {
					terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
				}
			});
		}
	};

	const executeCommand = (command: string) => {
		if (!command.trim()) return;

		// Add command to history
		terminalContent.value.push({
			text: `$ ${command.trim()}`,
			type: "command",
		});

		// Clear input
		commandInput.value = "";
		scrollToBottom();

		// Return the command that was executed
		return command;
	};

	const addOutput = (text: string, type: TerminalLine["type"] = "info") => {
		terminalContent.value.push({ text, type });
		scrollToBottom();
	};

	const clearTerminal = () => {
		terminalContent.value = [{ text: "$ Terminal cleared", type: "info" }];
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			const command = commandInput.value.trim();
			if (command) {
				const executedCommand = executeCommand(command);
				return executedCommand;
			}
		}
		return null;
	};

	return {
		terminalContent,
		commandInput,
		terminalRef,
		autoScroll,
		executeCommand,
		addOutput,
		clearTerminal,
		handleKeyDown,
		scrollToBottom,
	};
}

export type UseTerminalReturn = ReturnType<typeof useTerminal>;
