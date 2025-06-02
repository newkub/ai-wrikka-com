<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useTerminal, type TerminalLine, type TerminalLineType, type TerminalTheme } from '~/composables/useTerminal';

interface TerminalProps {
  content?: string;
  autoScroll?: boolean;
  theme?: TerminalTheme;
  lines?: TerminalLine[];
}

const props = withDefaults(defineProps<TerminalProps>(), {
  content: () => '',
  autoScroll: () => true,
  theme: () => 'dark' as TerminalTheme,
});

const emit = defineEmits<{
  (e: 'execute', command: string): void;
  (e: 'output', output: string): void;
}>();

const {
  terminalContent,
  commandInput,
  terminalRef,
  autoScroll,
  executeCommand,
  addOutput,
  clearTerminal,
  handleKeyDown
} = useTerminal();

// Handle command execution
const handleCommand = (command: string) => {
  const executedCommand = executeCommand(command);
  if (executedCommand) {
    emit('execute', executedCommand);
  }
};

// Watch for content changes from parent
watch(
  () => props.content,
  (newContent) => {
    if (newContent) {
      addOutput(newContent, 'info');
    }
  },
  { immediate: true }
);

// Handle keydown events
const onKeyDown = (event: KeyboardEvent) => {
  const command = handleKeyDown(event);
  if (command) {
    handleCommand(command);
  }
};

defineExpose({
  clearTerminal,
  addLine: (text: string) => addOutput(text, 'info')
});
</script>

<template>
  <div class="h-full flex flex-col rounded-b-lg overflow-hidden shadow-lg bg-surface-1 text-text">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border">
      <div class="text-sm font-mono font-medium">Terminal</div>
      <div class="flex space-x-2">
        <button 
          @click="clearTerminal"
          class="p-1 rounded hover:bg-surface-3 transition-colors"
          aria-label="Clear terminal"
          title="Clear terminal"
        >
          <div class="i-mdi-notification-clear-all h-4 w-4"></div>
        </button>
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
        :class="{
          'text-brand font-semibold': line.type === 'command',
          'text-green-500': line.type === 'success',
          'text-red-500': line.type === 'error',
          'text-yellow-500': line.type === 'warning',
          'text-blue-500': line.type === 'info',
          'text-foreground': line.type !== 'command' && 
                           line.type !== 'success' && 
                           line.type !== 'error' && 
                           line.type !== 'warning' && 
                           line.type !== 'info'
        }"
      >
        {{ line.text }}
      </div>
    </div>
    
    <!-- Command Input -->
    <div class="p-2 border-t border-border">
      <div class="flex items-center">
        <span class="text-brand font-bold mr-2">$</span>
        <input
          v-model="commandInput"
          @keydown="onKeyDown"
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
