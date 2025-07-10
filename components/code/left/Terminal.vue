<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { useClipboard } from "@vueuse/core";

interface TerminalLine {
	text: string;
	type?: "input" | "output" | "error" | "info";
	timestamp?: number;
}

const props = withDefaults(
	defineProps<{
		welcomeMessage?: string;
		prompt?: string;
		readOnly?: boolean;
		maxHistoryLines?: number;
		showTimestamp?: boolean;
	}>(),
	{
		prompt: "> ",
		maxHistoryLines: 1000,
		showTimestamp: true,
	},
);

const emit = defineEmits<{
	(e: "command", command: string): void;
	(e: "clear"): void;
	(e: "copy", text: string): void;
}>();

const terminalRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const output = ref<TerminalLine[]>([]);
const commandHistory = ref<string[]>([]);
const currentInput = ref("");
const isProcessing = ref(false);
const showCursor = ref(true);
const isInputFocused = ref(false);

let historyIndex = -1;
let commandCache = "";
let cursorBlinkInterval: number;

const terminalClasses = computed(() => [
	"h-full",
	"flex",
	"flex-col",
	"bg-gray-900",
	"rounded-lg",
	"overflow-hidden",
	"border",
	"border-gray-700",
	"font-mono",
	"text-sm",
	"text-gray-200",
	"select-text",
	"transition-all",
	"duration-200",
]);

const inputClasses = computed(() => [
	"bg-transparent",
	"border-none",
	"outline-none",
	"w-full",
	"text-inherit",
	"caret-current",
	"flex-1",
	"font-mono",
	"text-sm",
	"focus:ring-0",
	"focus:ring-offset-0",
	"focus:outline-none",
	"focus:border-none",
	"selection:bg-blue-600",
	"selection:text-white",
	"pr-1",
]);

const lineClasses = (type?: string) => ({
	"text-blue-300": type === "input",
	"text-red-400": type === "error",
	"text-yellow-300": type === "info",
	"text-gray-300": !type || type === "output",
});

const formatTimestamp = (timestamp: number) => {
	return new Date(timestamp).toLocaleTimeString();
};

const focusInput = () => {
	if (inputRef.value) {
		inputRef.value.focus();
		isInputFocused.value = true;
	}
};

const blurInput = () => {
	if (inputRef.value) {
		inputRef.value.blur();
		isInputFocused.value = false;
	}
};

const toggleInputFocus = () => {
	if (isInputFocused.value) {
		blurInput();
	} else {
		focusInput();
	}
};

const handleKeyDown = async (e: KeyboardEvent) => {
	if (!inputRef.value) return;

	const { key, ctrlKey, metaKey, shiftKey } = e;
	const input = inputRef.value;
	const currentValue = input.value;
	const cursorPosition = input.selectionStart || 0;

	// Handle keyboard shortcuts
	if ((ctrlKey || metaKey) && key === "l") {
		e.preventDefault();
		clear();
		return;
	}

	if ((ctrlKey || metaKey) && key === "c") {
		if (window.getSelection()?.toString()) {
			return; // Allow default copy behavior for selection
		}
		e.preventDefault();
		copyAll();
		return;
	}

	// Handle command history
	if (key === "ArrowUp") {
		e.preventDefault();
		if (historyIndex < commandHistory.value.length - 1) {
			if (historyIndex === -1) {
				commandCache = currentValue;
			}
			historyIndex++;
			input.value = commandHistory.value[historyIndex] || "";
		}
		return;
	}

	if (key === "ArrowDown") {
		e.preventDefault();
		if (historyIndex > 0) {
			historyIndex--;
			input.value = commandHistory.value[historyIndex];
		} else if (historyIndex === 0) {
			historyIndex--;
			input.value = commandCache;
			commandCache = "";
		}
		return;
	}

	// Handle tab completion
	if (key === "Tab") {
		e.preventDefault();
		// Basic tab completion - can be enhanced with custom completion logic
		if (currentValue.trim()) {
			// Find matching commands in history
			const match = commandHistory.value.find(
				(cmd) => cmd.startsWith(currentValue) && cmd !== currentValue,
			);

			if (match) {
				input.value = match;
				input.setSelectionRange(currentValue.length, match.length);
			}
		}
		return;
	}

	// Handle command execution
	if (key === "Enter") {
		e.preventDefault();
		const command = currentValue.trim();

		if (command) {
			// Add to command history if not a duplicate of the last command
			if (commandHistory.value[0] !== command) {
				commandHistory.value.unshift(command);
				// Keep history size in check
				if (commandHistory.value.length > 100) {
					commandHistory.value.pop();
				}
			}

			// Reset history index and command cache
			historyIndex = -1;
			commandCache = "";

			// Add command to output
			addLine(command, "input");

			// Clear input
			input.value = "";
			currentInput.value = "";

			try {
				isProcessing.value = true;
				await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay for UI feedback
				emit("command", command);
			} catch (error) {
				addLine(`Error executing command: ${error}`, "error");
			} finally {
				isProcessing.value = false;
				scrollToBottom();
			}
		}
	}
};

const addLine = (text: string, type: TerminalLine["type"] = "output") => {
	output.value.push({
		text,
		type,
		timestamp: Date.now(),
	});

	// Limit the number of lines in the output
	if (output.value.length > props.maxHistoryLines) {
		output.value = output.value.slice(-props.maxHistoryLines);
	}

	scrollToBottom();
};

const write = (text: string, type: TerminalLine["type"] = "output") => {
	if (
		output.value.length === 0 ||
		output.value[output.value.length - 1].type !== type
	) {
		addLine(text, type);
	} else {
		const lastLine = output.value[output.value.length - 1];
		lastLine.text += text;
		output.value = [...output.value]; // Trigger reactivity
	}
	scrollToBottom();
};

const writeln = (text: string, type: TerminalLine["type"] = "output") => {
	write(text + "\n", type);
};

const clear = () => {
	output.value = [];
	emit("clear");
	if (props.welcomeMessage) {
		addLine(props.welcomeMessage, "info");
	}
};

const copyAll = () => {
	const text = output.value
		.map((line) => {
			const timestamp =
				props.showTimestamp && line.timestamp
					? `[${formatTimestamp(line.timestamp)}] `
					: "";
			return `${timestamp}${line.text}`;
		})
		.join("\n");

	useClipboard()
		.copy(text)
		.then(() => {
			addLine("Terminal output copied to clipboard", "info");
			emit("copy", text);
		})
		.catch((err) => {
			addLine(`Failed to copy: ${err}`, "error");
			console.error("Failed to copy:", err);
		});
};

const handleTerminalClick = (e: MouseEvent) => {
	// Only focus input if clicking on the terminal content, not on a button or other interactive element
	if (
		e.target === terminalRef.value ||
		(e.target as HTMLElement).classList.contains("terminal-content")
	) {
		focusInput();
	}
};

const scrollToBottom = () => {
	nextTick(() => {
		if (terminalRef.value) {
			terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
		}
	});
};

const handleInput = (e: Event) => {
	currentInput.value = (e.target as HTMLInputElement).value;
};

// Cursor blink animation
onMounted(() => {
	// Start cursor blink animation
	cursorBlinkInterval = window.setInterval(() => {
		showCursor.value = !showCursor.value;
	}, 600);

	// Add welcome message if provided
	if (props.welcomeMessage) {
		addLine(props.welcomeMessage, "info");
	}

	// Initial focus
	nextTick(() => {
		focusInput();
	});

	// Add global keyboard shortcut (Ctrl+`) to focus terminal
	const handleGlobalKeyDown = (e: KeyboardEvent) => {
		if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			toggleInputFocus();
		}
	};

	window.addEventListener("keydown", handleGlobalKeyDown);

	// Cleanup
	return () => {
		clearInterval(cursorBlinkInterval);
		window.removeEventListener("keydown", handleGlobalKeyDown);
	};
});

// Watch for changes in the output and auto-scroll
watch(
	() => output.value.length,
	() => {
		scrollToBottom();
	},
);

// Expose methods to parent component
defineExpose({
	write,
	writeln,
	clear,
	copyAll,
	focus: focusInput,
	blur: blurInput,
	toggleFocus: toggleInputFocus,
	executeCommand: (command: string) => {
		if (inputRef.value) {
			inputRef.value.value = command;
			const event = new KeyboardEvent("keydown", {
				key: "Enter",
				code: "Enter",
			});
			inputRef.value.dispatchEvent(event);
		}
	},
});
</script>

<template>
  <div 
    :class="terminalClasses"
    @click="handleTerminalClick"
    @keydown.ctrl.`="toggleInputFocus"
    tabindex="0"
  >
    <!-- Terminal Header -->
    <div class="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700 select-none">
      <div class="flex space-x-2">
        <div 
          class="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400 transition-colors"
          title="Stop"
          @click="blurInput"
        ></div>
        <div 
          class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:bg-yellow-400 transition-colors"
          title="Minimize"
          @click="toggleInputFocus"
        ></div>
        <div 
          class="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:bg-green-400 transition-colors"
          title="Maximize"
          @click="focusInput"
        ></div>
      </div>
      
      <div class="flex-1 text-center text-gray-400 text-sm font-medium">
        Terminal
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          v-if="output.length > 0"
          class="text-xs text-gray-400 hover:text-white transition-colors"
          @click.stop="copyAll"
          title="Copy all (Ctrl+C)"
        >
          <span class="i-mdi-content-copy text-base"></span>
        </button>
        <button 
          class="text-xs text-gray-400 hover:text-white transition-colors"
          @click.stop="clear"
          title="Clear terminal (Ctrl+L)"
        >
          <span class="i-mdi-delete-outline text-base"></span>
        </button>
      </div>
    </div>

    <!-- Terminal Content -->
    <div 
      ref="terminalRef"
      class="terminal-content flex-1 overflow-y-auto p-4 whitespace-pre-wrap leading-relaxed"
    >
      <!-- Command Output -->
      <div 
        v-for="(line, index) in output" 
        :key="index" 
        class="py-1 flex items-start group"
      >
        <!-- Timestamp -->
        <span 
          v-if="showTimestamp && line.timestamp" 
          class="text-gray-500 text-xs mr-2 flex-shrink-0"
        >
          [{{ formatTimestamp(line.timestamp) }}]
        </span>
        
        <!-- Line Content -->
        <div class="flex-1 min-w-0 break-words">
          <span 
            v-if="line.type === 'input'" 
            class="text-green-400 font-medium select-none"
          >
            {{ prompt }}
          </span>
          <span :class="lineClasses(line.type)">
            {{ line.text }}
          </span>
        </div>
        
        <!-- Copy button for each line -->
        <button 
          v-if="line.text"
          class="ml-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity"
          @click.stop="() => {
            useClipboard().copy(line.text);
            addLine('Copied to clipboard', 'info');
          }"
          title="Copy line"
        >
          <span class="i-mdi-content-copy text-xs"></span>
        </button>
      </div>
      
      <!-- Input Line -->
      <div v-if="!readOnly" class="flex items-center mt-2">
        <span class="text-green-400 font-medium select-none mr-2">{{ prompt }}</span>
        
        <div class="relative flex-1">
          <input
            ref="inputRef"
            v-model="currentInput"
            type="text"
            :class="inputClasses"
            :readonly="readOnly || isProcessing"
            @keydown="handleKeyDown"
            @input="handleInput"
            @click.stop
            spellcheck="false"
            :placeholder="isProcessing ? 'Processing...' : 'Type a command...'"
            :disabled="isProcessing"
            aria-label="Terminal input"
          />
          
          <!-- Cursor -->
          <span 
            v-if="!readOnly && showCursor && isInputFocused"
            class="absolute top-0 bottom-0 w-0.5 bg-green-400 animate-pulse"
            :style="{ left: `${(inputRef?.selectionStart || 0) * 0.6}em` }"
          ></span>
        </div>
        
        <!-- Processing indicator -->
        <div 
          v-if="isProcessing" 
          class="ml-2 w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>
    
    <!-- Status Bar -->
    <div class="px-4 py-1 text-xs text-gray-500 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <span class="i-mdi-console-line text-xs"></span>
        <span>{{ isInputFocused ? 'Input' : 'Ready' }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <span v-if="currentInput" class="hidden sm:inline">
          {{ currentInput.length }} chars
        </span>
        <span>
          {{ output.length }} line{{ output.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>
