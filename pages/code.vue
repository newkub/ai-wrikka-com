<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import CodeEditor from '~/components/CodeEditor.vue';
import Terminal from '~/components/Terminal.vue';
import FileStructure from '~/components/FileStructure.vue';

const code = ref('// Welcome to Code Editor\n// Start coding here...\n\nfunction helloWorld() {\n  console.log("Hello, World!");\n}\n\nhelloWorld();');
const terminalOutput = ref('');
const terminalRef = ref();
const isDark = ref(false);
const editorTheme = computed(() => isDark.value ? 'vs-dark' : 'vs');
const activeFile = ref('index.js');

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  isOpen?: boolean;
  children?: FileItem[];
}

// Sample file structure data
const fileStructure = ref<FileItem[]>([
  {
    name: 'project',
    type: 'directory',
    isOpen: true,
    children: [
      { 
        name: 'src', 
        type: 'directory', 
        isOpen: true, 
        children: [
          { name: 'main.js', type: 'file' },
          { name: 'App.vue', type: 'file' },
          { 
            name: 'assets', 
            type: 'directory', 
            children: [
              { name: 'style.css', type: 'file' }
            ]
          }
        ]
      },
      { 
        name: 'public', 
        type: 'directory', 
        children: [
          { name: 'index.html', type: 'file' }
        ]
      },
      { name: 'package.json', type: 'file' },
      { name: 'vite.config.js', type: 'file' }
    ]
  }
]);

const handleFileSelect = (fileName: string) => {
  activeFile.value = fileName;
  // Here you would typically load the file content
  code.value = `// Content of ${fileName}\n// This is a sample file content.`;
};

// Handle terminal commands
const handleCommand = (command: string) => {
  const terminal = terminalRef.value;
  if (!terminal) return;
  
  switch (command.toLowerCase()) {
    case 'clear':
      terminal.clear();
      break;
    case 'help':
      terminal.write('Available commands:');
      terminal.write('  clear - Clear the terminal');
      terminal.write('  help - Show this help message');
      terminal.write('  run - Execute the current code');
      break;
    case 'run':
      executeCode();
      break;
    default:
      terminal.write(`Command not found: ${command}`);
      terminal.write('Type `help` to see available commands');
  }
};

// Execute the current code
const executeCode = () => {
  const terminal = terminalRef.value;
  if (!terminal) return;
  
  try {
    // In a real app, you would send this to a server or use a sandbox
    terminal.write('$ Executing code...');
    // Simulate execution
    setTimeout(() => {
      terminal.write('Hello, World!');
      terminal.write('Code executed successfully');
      terminal.prompt();
    }, 500);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    terminal.write(`Error: ${errorMessage}`);
    terminal.prompt();
  }
};

// Handle code changes
const handleCodeUpdate = (newCode: string) => {
  code.value = newCode;
};

// Toggle dark/light theme
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
};
</script>


<template>
  <div class="flex transition-colors duration-200">
    <!-- Left Panel - File Explorer and Chat -->
    <div class="w-1/3 border-r border-border bg-block flex flex-col">
      <!-- File Explorer -->
      <div class="flex-1 flex flex-col border-b border-gray-200 dark:border-gray-700">
        <div class="p-2 border-b border-border flex justify-between items-center">
          <h2 class="text-sm font-medium text-black dark:text-white">EXPLORER</h2>
          <div class="flex space-x-2">
            <button 
              @click="toggleTheme"
              class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors"
              :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <div v-if="isDark" class="i-heroicons-sun w-4 h-4 text-yellow-400"></div>
              <div v-else class="i-heroicons-moon w-4 h-4 text-black dark:text-white"></div>
            </button>
          </div>
        </div>
        <FileStructure 
          :files="fileStructure" 
          :active-file="activeFile"
          class="flex-1 overflow-y-auto"
          @file-select="handleFileSelect"
        />
      </div>
      
      <!-- Chat -->
      <div class="h-1/3 flex flex-col border-t border-border">
        <div class="p-2 border-b border-border">
          <h2 class="text-sm font-medium text-black dark:text-white">CHAT</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div class="p-3 bg-primary/10 rounded-lg">
            <h3 class="text-sm font-medium text-primary">Welcome to Code Chat</h3>
            <p class="text-xs text-primary/80 mt-1">
              Ask questions about your code or get help with programming concepts.
            </p>
          </div>
        </div>
        <div class="p-2 border-t border-border">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              class="flex-1 p-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-block text-black dark:text-white"
            />
            <button class="px-3 py-1 text-xs bg-primary hover:opacity-90 text-white rounded-lg transition-opacity">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Editor and Terminal -->
    <div class="flex-1 flex flex-col bg-block">
      <!-- Code Editor -->
      <div class="flex-1 flex flex-col border-b border-border">
        <div class="flex justify-between items-center p-2 border-b border-border">
          <h2 class="text-sm font-medium text-black dark:text-white">{{ activeFile }}</h2>
          <div class="flex space-x-2">
            <button 
              @click="executeCode"
              class="px-3 py-1 text-sm bg-success hover:opacity-90 text-white rounded-md flex items-center space-x-1 transition-opacity"
            >
              <div class="i-heroicons-play w-4 h-4"></div>
              <span>Run</span>
            </button>
          </div>
        </div>
        <CodeEditor 
          v-model="code"
          :theme="isDark ? 'vs-dark' : 'vs'"
          class="flex-1"
          @update:modelValue="handleCodeUpdate"
        />
      </div>

      <!-- Terminal -->
      <div class="h-1/3 flex flex-col border-t border-border">
        <div class="p-2 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-sm font-medium text-black dark:text-white">Terminal</h2>
          <div class="flex space-x-2">
            <button 
              @click="terminalRef?.clear()"
              class="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
              title="Clear terminal"
            >
              <div class="i-heroicons-trash w-4 h-4"></div>
            </button>
          </div>
        </div>
        <Terminal 
          ref="terminalRef"
          :theme="isDark ? 'dark' : 'light'"
          welcome-message="Welcome to the terminal. Type 'help' to see available commands."
          @command="handleCommand"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>