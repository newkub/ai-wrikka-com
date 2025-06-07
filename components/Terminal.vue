<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';

const props = withDefaults(defineProps<{
  welcomeMessage?: string;
  prompt?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
}>(), {
  welcomeMessage: 'Terminal initialized. Type `help` to see available commands.',
  prompt: '$ ',
  theme: 'dark',
  readOnly: false,
});

const emit = defineEmits(['command']);

const terminalRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const output = ref<{ text: string; type?: 'input' | 'output' | 'error' }[]>([]);
const commandHistory = ref<string[]>([]);
let historyIndex = -1;

const terminalClasses = computed(() => ({
  'bg-block text-text': true,
  'border border-border': true,
}));

const inputClasses = computed(() => ({
  'bg-transparent border-none outline-none w-full text-inherit': true,
  'caret-text': true,
}));

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = inputRef.value?.value.trim() || '';
    if (command) {
      output.value.push({ text: `${props.prompt}${command}`, type: 'input' });
      commandHistory.value.unshift(command);
      historyIndex = -1;
      
      // Emit command to parent
      emit('command', command);
      
      // Clear input
      if (inputRef.value) {
        inputRef.value.value = '';
      }
      
      // Auto-scroll to bottom
      nextTick(() => {
        if (terminalRef.value) {
          terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
        }
      });
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (commandHistory.value.length > 0 && historyIndex < commandHistory.value.length - 1) {
      historyIndex++;
      if (inputRef.value) {
        inputRef.value.value = commandHistory.value[historyIndex];
      }
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      if (inputRef.value) {
        inputRef.value.value = commandHistory.value[historyIndex];
      }
    } else if (historyIndex === 0) {
      historyIndex--;
      if (inputRef.value) {
        inputRef.value.value = '';
      }
    }
  }
};

// Public methods
const write = (text: string) => {
  output.value.push({ text, type: 'output' });
  scrollToBottom();
};

const writeln = (text: string) => {
  output.value.push({ text, type: 'output' });
  scrollToBottom();
};

const clear = () => {
  output.value = [];
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
    output.value.push({ text: props.welcomeMessage, type: 'output' });
  }
  focusInput();
});

// Cleanup on unmount
onUnmounted(() => {
  // Removed StackBlitz-related code
});

defineExpose({
  write,
  writeln,
  clear
});

const useStackblitz = false;
</script>

<template>
  <div class="terminal-wrapper">
    <div v-if="useStackblitz" class="stackblitz-notice">
      <p>Running in StackBlitz environment</p>
    </div>
    <div ref="terminalRef" class="terminal-container" :class="[theme, { 'read-only': readOnly }]" />
  </div>
</template>

<style scoped>
.terminal-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stackblitz-notice {
  background-color: var(--block);
  color: var(--color-success);
  padding: 0.5rem 1rem;
  font-family: monospace;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border);
}

.terminal-container {
  flex: 1;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 0 0 0.5rem 0.5rem;
}

.terminal-container.read-only {
  opacity: 0.8;
  cursor: not-allowed;
}

:deep(.xterm) {
  height: 100%;
}

:deep(.xterm-viewport) {
  width: 100% !important;
  overflow-y: auto !important;
  scrollbar-width: thin;
}

:deep(.xterm-screen) {
  width: 100% !important;
}

:deep(.xterm-rows) {
  width: 100% !important;
}

/* StackBlitz specific styles */
:global([data-theme="dark"]) {
  --sb-foreground: #f8f8f8;
  --sb-background: #1e1e1e;
  --sb-primary: #4CAF50;
}

:global([data-theme="light"]) {
  --sb-foreground: #1e1e1e;
  --sb-background: #f8f8f8;
  --sb-primary: #2e7d32;
}
</style>
