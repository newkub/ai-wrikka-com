<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">AI Code Editor</h1>
          <div class="text-sm text-gray-500 dark:text-gray-400">main.tsx</div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar - File Explorer -->
      <div class="w-64 bg-gray-800 text-gray-200 flex flex-col border-r border-gray-700">
        <div class="p-3 border-b border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium">EXPLORER</h2>
            <button class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="py-1">
            <!-- Project Root -->
            <div class="px-2 py-1">
              <button class="flex items-center w-full text-left text-sm text-gray-300 hover:bg-gray-700 rounded px-2 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                my-app
              </button>
              
              <!-- Files -->
              <div class="ml-4 mt-1">
                <div class="mb-1">
                  <div class="text-xs text-gray-400 uppercase font-medium px-2 py-1">src</div>
                  <div class="ml-2">
                    <div class="flex items-center text-sm text-blue-300 px-2 py-1 rounded bg-blue-900 bg-opacity-30">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      main.tsx
                    </div>
                    <div class="flex items-center text-sm text-gray-300 hover:bg-gray-700 rounded px-2 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      App.tsx
                    </div>
                    <div class="flex items-center text-sm text-gray-300 hover:bg-gray-700 rounded px-2 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      index.css
                    </div>
                  </div>
                </div>
                
                <div class="mt-2">
                  <div class="flex items-center text-sm text-gray-300 hover:bg-gray-700 rounded px-2 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    package.json
                  </div>
                  <div class="flex items-center text-sm text-gray-300 hover:bg-gray-700 rounded px-2 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    tsconfig.json
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Editor Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Tabs -->
        <div class="flex items-center bg-gray-800 border-b border-gray-700">
          <div class="flex items-center px-4 py-2 border-r border-gray-700 bg-gray-900 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            main.tsx
            <button class="ml-2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button class="px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- Editor -->
        <div class="flex-1 overflow-hidden">
          <Editor 
            v-model="editorContent"
            class="h-full"
          />
        </div>

        <!-- Terminal -->
        <div class="h-64 border-t border-gray-200 dark:border-gray-700">
          <Terminal 
            ref="terminal"
            @execute="handleTerminalCommand"
            class="h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

useHead({
  title: 'Code Editor - AI Wrikka',
  meta: [
    { name: 'description', content: 'AI-powered code editor with terminal' }
  ]
});

// Editor content
const editorContent = ref(`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

// Terminal reference
const terminal = ref();

// Handle terminal commands
const handleTerminalCommand = (command: string) => {
  // You can add custom command handling here
  const response = `$ ${command}\n> Command executed: ${command}\n`;
  terminal.value.addLine(response);
};

// Example: Add a welcome message to the terminal
onMounted(() => {
  setTimeout(() => {
    if (terminal.value) {
      terminal.value.addLine('Welcome to AI Code Editor!');
      terminal.value.addLine('Type a command and press Enter to execute.');
    }
  }, 500);
});
</script>
