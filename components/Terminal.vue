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

const terminalClasses = computed(() => [
  'bg-block',
  'border',
  'border-border',
  'rounded-b-lg',
  'p-4',
  'h-full',
  'w-full',
  'overflow-hidden',
  { 'opacity-80 cursor-not-allowed': props.readOnly }
]);

const inputClasses = computed(() => [
  'bg-transparent',
  'border-none',
  'outline-none',
  'w-full',
  'text-inherit',
  'caret-current'
]);

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
  <div class="relative w-full h-full flex flex-col">
    <div v-if="useStackblitz" class="bg-block text-success p-2 font-mono text-sm border-b border-border">
      <p>Running in StackBlitz environment</p>
    </div>
    <div ref="terminalRef" class="flex-1 w-full p-4 box-border overflow-hidden" :class="[terminalClasses, theme]" />
  </div>
</template>

<style>
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
</style>
