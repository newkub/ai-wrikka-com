<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'dark',
    validator: (value: string) => ['light', 'dark'].includes(value)
  }
});

const emit = defineEmits(['execute']);
const terminalContent = ref<string[]>(['$ Ready']);
const commandInput = ref('');
const terminalRef = ref<HTMLDivElement | null>(null);

const executeCommand = () => {
  if (!commandInput.value.trim()) return;
  
  const command = commandInput.value.trim();
  terminalContent.value.push(`$ ${command}`);
  
  // Emit the command to parent component
  emit('execute', command);
  
  // Clear input
  commandInput.value = '';
  
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
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    executeCommand();
  }
};

// Watch for content changes from parent
watch(() => props.content, (newContent) => {
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
}, { immediate: true });

// Expose methods if needed
const clearTerminal = () => {
  terminalContent.value = ['$ Terminal cleared'];
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
  addLine
});
</script>

<template>
  <div 
    class="h-full flex flex-col rounded-b-lg overflow-hidden shadow-lg"
    :class="{
      'bg-gray-900 text-gray-100': theme === 'dark',
      'bg-gray-50 text-gray-900': theme === 'light'
    }"
  >
    <!-- Header -->
    <div 
      class="flex items-center justify-between px-4 py-2 border-b" 
      :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'"
    >
      <div class="text-sm font-mono font-medium">Terminal</div>
      <div class="flex space-x-2">
        <button 
          class="p-1 rounded hover:bg-opacity-20 hover:bg-white transition-colors"
          aria-label="Menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Terminal Content -->
    <div 
      ref="terminalRef"
      class="flex-1 p-4 font-mono text-sm overflow-y-auto"
      :class="{
        'bg-gray-900': theme === 'dark',
        'bg-gray-50': theme === 'light'
      }"
    >
      <div 
        v-for="(line, index) in terminalContent" 
        :key="index" 
        class="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
      >
        <span 
          v-if="line.startsWith('$')" 
          class="text-green-400 font-semibold"
        >
          {{ line }}
        </span>
        <template v-else>{{ line }}</template>
      </div>
    </div>
    
    <!-- Command Input -->
    <div 
      class="p-2 border-t" 
      :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'"
    >
      <div class="flex items-center">
        <span class="text-green-400 font-bold mr-2">$</span>
        <input
          v-model="commandInput"
          @keydown="handleKeyDown"
          type="text"
          class="flex-1 bg-transparent outline-none font-mono text-sm"
          :class="{
            'text-gray-100 placeholder-gray-500': theme === 'dark',
            'text-gray-900 placeholder-gray-400': theme === 'light'
          }"
          :placeholder="terminalContent.length <= 1 ? 'Enter command...' : ''"
          spellcheck="false"
          autocomplete="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  </div>
</template>

<style>
.scrollbar-terminal::-webkit-scrollbar {
  @apply w-1.5 h-1.5;
}

.scrollbar-terminal::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.scrollbar-terminal::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded;
}

.scrollbar-terminal::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
