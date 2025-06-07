<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';

interface ConsoleMessage {
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'clear';
  timestamp: number;
  messages: unknown[];
  stack?: string;
}

const props = defineProps<{
  theme?: 'light' | 'dark';
  maxLines?: number;
}>();

const emit = defineEmits(['command']);

const consoleRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const commandHistory = ref<string[]>([]);
const historyIndex = ref(-1);
const messages = ref<ConsoleMessage[]>([]);
const inputValue = ref('');
const showTimestamps = ref(true);
const filter = ref<'all' | 'error' | 'warn' | 'log'>('all');

const filteredMessages = computed(() => {
  if (filter.value === 'all') return messages.value;
  return messages.value.filter(msg => msg.type === filter.value);
});

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = inputValue.value.trim();
    if (command) {
      // Add to history
      commandHistory.value.unshift(command);
      historyIndex.value = -1;
      
      // Process command
      processCommand(command);
      
      // Clear input
      inputValue.value = '';
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (commandHistory.value.length > 0 && historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      inputValue.value = commandHistory.value[historyIndex.value];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex.value > 0) {
      historyIndex.value--;
      inputValue.value = commandHistory.value[historyIndex.value];
    } else if (historyIndex.value === 0) {
      historyIndex.value = -1;
      inputValue.value = '';
    }
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    clear();
  }
};

const processCommand = (command: string) => {
  // Add command to console
  log(`> ${command}`, 'info');
  
  try {
    // In a real implementation, you would evaluate the command in a sandbox
    // For demo purposes, we'll just echo the command
    log(`Command executed: ${command}`, 'log');
    
    // Emit the command to the parent component
    emit('command', command);
  } catch (error) {
    log(error instanceof Error ? error.message : String(error), 'error');
  }
};

// Public methods
const log = (...args: unknown[]) => {
  addMessage('log', args);
};

const info = (...args: unknown[]) => {
  addMessage('info', args);
};

const warn = (...args: unknown[]) => {
  addMessage('warn', args);
};

const error = (...args: unknown[]) => {
  const errorObj = args.find(arg => arg instanceof Error);
  addMessage('error', args, errorObj?.stack);
};

const debug = (...args: unknown[]) => {
  addMessage('debug', args);
};

const clear = () => {
  messages.value = [];
};

const addMessage = (type: ConsoleMessage['type'], messageArgs: unknown[], stack?: string) => {
  messages.value.push({
    type,
    timestamp: Date.now(),
    messages: messageArgs,
    stack
  });
  
  // Limit the number of messages to prevent memory issues
  if (props.maxLines && messages.value.length > props.maxLines) {
    messages.value = messages.value.slice(-props.maxLines);
  }
  
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (consoleRef.value) {
      consoleRef.value.scrollTop = consoleRef.value.scrollHeight;
    }
  });
};

const getMessageTypeIcon = (type: string) => {
  switch (type) {
    case 'error': return 'i-mdi-close-circle text-red-500';
    case 'warn': return 'i-mdi-alert-circle text-yellow-500';
    case 'info': return 'i-mdi-information text-blue-500';
    case 'debug': return 'i-mdi-bug-outline text-purple-500';
    default: return 'i-mdi-console-line';
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

// Expose methods to parent component
defineExpose({
  log,
  info,
  warn,
  error,
  debug,
  clear
});

onMounted(() => {
  // Add welcome message
  info('Console initialized. Type commands below.');
  focusInput();
});
</script>

<template>
  <div class="h-full flex flex-col bg-gray-900 text-gray-200 font-mono text-sm">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-3 py-1.5 border-b border-gray-700 bg-gray-800">
      <div class="flex items-center space-x-2">
        <button 
          v-for="type in [
            { id: 'all', label: 'All', icon: 'i-mdi-format-list-bulleted' },
            { id: 'error', label: 'Errors', icon: 'i-mdi-close-circle', count: messages.filter(m => m.type === 'error').length },
            { id: 'warn', label: 'Warnings', icon: 'i-mdi-alert-circle', count: messages.filter(m => m.type === 'warn').length },
            { id: 'log', label: 'Logs', icon: 'i-mdi-console-line', count: messages.filter(m => m.type === 'log').length }
          ]" 
          :key="type.id"
          @click="filter = type.id as any"
          class="px-2 py-1 text-xs rounded flex items-center gap-1"
          :class="{
            'bg-blue-900/50 text-blue-300': filter === type.id,
            'text-gray-400 hover:bg-gray-700': filter !== type.id
          }"
        >
          <i :class="[type.icon, 'text-xs']"></i>
          <span>{{ type.label }}</span>
          <span v-if="type.count" class="bg-gray-700 rounded-full px-1.5 py-0.5 text-xs">
            {{ type.count }}
          </span>
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="showTimestamps = !showTimestamps" 
          class="p-1 text-gray-400 hover:text-gray-200"
          :title="showTimestamps ? 'Hide timestamps' : 'Show timestamps'"
        >
          <i class="i-mdi-clock-outline"></i>
        </button>
        <button 
          @click="clear" 
          class="p-1 text-gray-400 hover:text-gray-200"
          title="Clear console"
        >
          <i class="i-mdi-broom"></i>
        </button>
      </div>
    </div>
    
    <!-- Console Output -->
    <div 
      ref="consoleRef"
      class="flex-1 overflow-y-auto p-2 select-text"
      @click="focusInput"
    >
      <div v-for="(message, index) in filteredMessages" 
           :key="index" 
           class="py-0.5 flex gap-2 items-start"
           :class="{
             'text-red-400': message.type === 'error',
             'text-yellow-400': message.type === 'warn',
             'text-blue-400': message.type === 'info',
             'text-purple-400': message.type === 'debug',
             'text-gray-300': message.type === 'log'
           }"
      >
        <span v-if="showTimestamps" class="text-gray-500 text-xs flex-shrink-0 w-16">
          {{ formatTimestamp(message.timestamp) }}
        </span>
        <i :class="[getMessageTypeIcon(message.type), 'mt-0.5 flex-shrink-0']"></i>
        <div class="flex-1 overflow-x-auto">
          <template v-for="(msg, i) in message.messages" :key="i">
            <span v-if="typeof msg === 'string'" class="whitespace-pre-wrap break-words">{{ msg }}</span>
            <pre v-else class="whitespace-pre-wrap break-words">{{ JSON.stringify(msg, null, 2) }}</pre>
          </template>
          
          <!-- Stack trace for errors -->
          <div v-if="message.stack" class="text-red-300 text-xs mt-1 ml-4 whitespace-pre-wrap">
            {{ message.stack }}
          </div>
        </div>
      </div>
      
      <div v-if="filteredMessages.length === 0" class="text-center text-gray-500 py-8">
        <i class="i-mdi-console-line text-4xl mb-2"></i>
        <p>No messages to display</p>
      </div>
    </div>
    
    <!-- Input Area -->
    <div class="border-t border-gray-700 p-2 bg-gray-800">
      <div class="flex items-center gap-2">
        <span class="text-green-400">></span>
        <input
          ref="inputRef"
          v-model="inputValue"
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-gray-200"
          :placeholder="'Type a command... (${commandHistory.length} in history, ↑↓ to browse)'"
          @keydown="handleKeyDown"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
