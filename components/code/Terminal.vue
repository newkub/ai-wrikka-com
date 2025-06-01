<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

type TerminalTheme = "light" | "dark";

interface TerminalProps {
	content?: string;
	autoScroll?: boolean;
	theme?: TerminalTheme;
}

const props = withDefaults(defineProps<TerminalProps>(), {
	content: () => "",
	autoScroll: () => true,
	theme: () => "dark" as TerminalTheme,
});

const emit = defineEmits<(e: "execute", command: string) => void>();

const terminalContent = ref<string[]>(["$ Ready"]);
const commandInput = ref("");
const terminalRef = ref<HTMLDivElement | null>(null);

const executeCommand = () => {
	if (!commandInput.value.trim()) return;

	const command = commandInput.value.trim();
	terminalContent.value.push(`$ ${command}`);

	// Emit the command to parent component
	emit("execute", command);

	// Clear input
	commandInput.value = "";

	// Auto-scroll to bottom
	if (props.autoScroll) {
		setTimeout(() => {
			if (terminalRef.value) {
				terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
			}
		}, 0);
	}
};

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === "Enter" && !event.shiftKey) {
		event.preventDefault();
		executeCommand();
	}
};

// Watch for content changes from parent
watch(
	() => props.content,
	(newContent) => {
		if (newContent) {
			terminalContent.value.push(newContent);

			if (props.autoScroll && terminalRef.value) {
				setTimeout(() => {
					if (terminalRef.value) {
						terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
					}
				}, 0);
			}
		}
	},
	{ immediate: true },
);

// Expose methods if needed
const clearTerminal = () => {
	terminalContent.value = ["$ Terminal cleared"];
};

const addLine = (line: string) => {
	terminalContent.value.push(line);

	if (props.autoScroll && terminalRef.value) {
		setTimeout(() => {
			if (terminalRef.value) {
				terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
			}
		}, 0);
	}
};

defineExpose({
	clearTerminal,
	addLine,
});
</script>

<template>
  <div class="h-full flex flex-col rounded-b-lg overflow-hidden shadow-lg bg-surface-1 text-text">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border">
      <div class="text-sm font-mono font-medium">Terminal</div>
      <div class="flex space-x-2">
        <button 
          class="p-1 rounded hover:bg-surface-3 transition-colors"
          aria-label="Menu"
        >
          <div class="i-mdi-menu h-4 w-4"></div>
        </button>
      </div>
    </div>
    
    <!-- Terminal Content -->
    <div 
      ref="terminalRef"
      class="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar scrollbar-rounded scrollbar-thumb-surface-3 hover:scrollbar-thumb-surface-4 scrollbar-track-transparent scrollbar-w-1.5 scrollbar-h-1.5 bg-surface-1"
    >
      <div 
        v-for="(line, index) in terminalContent" 
        :key="index" 
        class="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
      >
        <span 
          v-if="line.startsWith('$')" 
          class="text-brand font-semibold"
        >
          {{ line }}
        </span>
        <template v-else>{{ line }}</template>
      </div>
    </div>
    
    <!-- Command Input -->
    <div class="p-2 border-t border-border">
      <div class="flex items-center">
        <span class="text-green-500 font-bold mr-2">$</span>
        <input
          v-model="commandInput"
          @keydown="handleKeyDown"
          type="text"
          class="flex-1 bg-transparent outline-none font-mono text-sm text-text placeholder-text/50"
          :placeholder="terminalContent.length <= 1 ? 'Enter command...' : ''"
          spellcheck="false"
          autocomplete="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  </div>
</template>
