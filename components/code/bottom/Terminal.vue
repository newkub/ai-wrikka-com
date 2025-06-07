<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue"; // defineProps and defineEmits are compiler macros

const props = defineProps<{
	welcomeMessage?: string;
	prompt?: string;
	readOnly?: boolean;
}>();

const emit = defineEmits(["command"]);

const terminalRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const output = ref<{ text: string; type?: "input" | "output" | "error" }[]>([]);
const commandHistory = ref<string[]>([]);
let historyIndex = -1;

const inputClasses = computed(() => [
	"bg-transparent",
	"border-none",
	"outline-none",
	"w-full",
	"text-inherit",
	"caret-current",
]);

const focusInput = () => {
	if (inputRef.value) {
		inputRef.value.focus();
	}
};

const handleKeyDown = (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		e.preventDefault();
		const command = inputRef.value?.value.trim() || "";
		if (command) {
			output.value.push({ text: `${props.prompt}${command}`, type: "input" });
			commandHistory.value.unshift(command);
			historyIndex = -1;

			emit("command", command);

			if (inputRef.value) {
				inputRef.value.value = "";
			}

			nextTick(() => {
				if (terminalRef.value) {
					terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
				}
			});
		}
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		if (
			commandHistory.value.length > 0 &&
			historyIndex < commandHistory.value.length - 1
		) {
			historyIndex++;
			if (inputRef.value) {
				inputRef.value.value = commandHistory.value[historyIndex];
			}
		}
	} else if (e.key === "ArrowDown") {
		e.preventDefault();
		if (historyIndex > 0) {
			historyIndex--;
			if (inputRef.value) {
				inputRef.value.value = commandHistory.value[historyIndex];
			}
		} else if (historyIndex === 0) {
			historyIndex--;
			if (inputRef.value) {
				inputRef.value.value = "";
			}
		}
	}
};

const write = (text: string) => {
	output.value.push({ text, type: "output" });
	scrollToBottom();
};

const writeln = (text: string) => {
	output.value.push({ text, type: "output" });
	scrollToBottom();
};

const clear = () => {
	output.value = [];
};

const copyAll = () => {
	const text = output.value.map((line) => line.text).join("\n");
	navigator.clipboard.writeText(text).catch((err) => {
		console.error("Failed to copy:", err);
	});
};

const scrollToBottom = () => {
	nextTick(() => {
		if (terminalRef.value) {
			terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
		}
	});
};

onMounted(() => {
	if (props.welcomeMessage) {
		output.value.push({ text: props.welcomeMessage, type: "output" });
	}
	focusInput();
});

defineExpose({
	write,
	writeln,
	clear,
	copyAll,
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Terminal Output -->
    <div 
      ref="terminalRef"
      class="flex-1 overflow-y-auto p-2 font-mono text-sm text-gray-200 whitespace-pre-wrap"
    >
      <div v-for="(line, index) in output" :key="index" 
        :class="[
          'py-0.5',
          line.type === 'input' ? 'text-blue-300' : 
          line.type === 'error' ? 'text-red-400' : 'text-gray-300'
        ]"
      >
        {{ line.text }}
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-700 p-2 flex items-center">
      <span class="text-green-400 mr-2">{{ prompt }}</span>
      <input
        ref="inputRef"
        type="text"
        :class="inputClasses"
        :readonly="readOnly"
        @keydown="handleKeyDown"
        @click="focusInput"
      />
    </div>
  </div>
</template>
