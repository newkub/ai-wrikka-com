

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChatInput from '~/components/chat/ChatInput.vue';

// Components are used in template but TypeScript can't infer their types properly
import type { Component } from 'vue';
import Terminal from '~/components/code/Terminal.vue';
import Editor from '~/components/code/Editor.vue';
import Dependencies from '~/components/code/Dependencies.vue';

// Component types
type EditorComponent = Component & {
  // Add editor specific methods if needed
};

type DependenciesComponent = Component & {
  // Add dependencies specific methods if needed
};

interface Model {
  id: string;
  name: string;
}

interface Mode {
  id: string;
  name: string;
}

// Mock data for chat input
const availableModels = ref<Model[]>([
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5', name: 'GPT-3.5' },
]);

const availableModes = ref<Mode[]>([
  { id: 'precise', name: 'Precise' },
  { id: 'balanced', name: 'Balanced' },
  { id: 'creative', name: 'Creative' },
]);

const selectedModel = ref('gpt-4');
const selectedMode = ref('balanced');
const chatInput = ref('');
const chatMessages = ref<{ role: 'user' | 'assistant'; content: string }[]>([]);
const terminal = ref<{ addLine: (text: string) => void } | null>(null);

// Type for the terminal component
type TerminalComponent = {
  addLine: (text: string) => void;
};

// Cast the terminal ref to the correct type
const terminalRef = terminal as unknown as { value: TerminalComponent | null };

// Active tab state
const activeTab = ref('terminal');

// Dependencies data
const dependencies = ref([
  { name: 'vue', version: '^3.3.0', type: 'dependencies' as const },
  { name: 'pinia', version: '^2.1.0', type: 'dependencies' as const },
  { name: 'vue-router', version: '^4.2.0', type: 'dependencies' as const },
  { name: '@vitejs/plugin-vue', version: '^4.3.0', type: 'devDependencies' as const },
  { name: 'typescript', version: '^5.0.0', type: 'devDependencies' as const },
  { name: 'vite', version: '^4.4.0', type: 'devDependencies' as const },
]);

const installationOutput = ref<Array<{ type: 'success' | 'error' | 'warning' | 'info'; text: string }>>([
  { type: 'info', text: 'Installing dependencies...' },
  { type: 'success', text: 'Successfully installed all dependencies' },
]);

const editorContent = ref(`import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

createApp(App).mount('#app');
`);

// Bottom Panel Tabs
const bottomTabs = ref([
  { id: 'terminal', label: 'Terminal' },
  { id: 'dependencies', label: 'Dependencies' },
]);

useHead({
  title: 'Code Editor - AI Wrikka',
  meta: [
    { name: 'description', content: 'AI-powered code editor with terminal' }
  ]
});

// Handle terminal commands
const handleTerminalCommand = (command: string) => {
  // You can add custom command handling here
  const response = `$ ${command}\n> Command executed: ${command}\n`;
  terminalRef.value?.addLine(response);
};

// Browser URL state
const browserUrl = ref('https://example.com');

// Handle browser navigation
const handleBrowserNavigate = (url: string) => {
  browserUrl.value = url;
  // Additional navigation logic can be added here
};

// Handle dependency installation
const installDependency = (options: { name: string; version: string; isDev?: boolean }) => {
  const { name, version, isDev = false } = options;
  const type = isDev ? 'devDependencies' : 'dependencies';
  
  // Check if dependency already exists
  const existingIndex = dependencies.value.findIndex(dep => dep.name === name);
  
  if (existingIndex >= 0) {
    // Update existing dependency
    dependencies.value[existingIndex] = { name, version, type };
  } else {
    // Add new dependency
    dependencies.value.push({ name, version, type });
  }
  
  installationOutput.value.push({
    type: 'info',
    text: `Installing ${name}@${version} as ${isDev ? 'dev' : 'production'} dependency...`
  });
  
  // Simulate installation
  setTimeout(() => {
    installationOutput.value.push({
      type: 'success',
      text: `Successfully installed ${name}@${version}`
    });
  }, 1000);
};

</script>

<template>
  <div class="h-screen flex flex-col bg-background">
    <!-- Header -->
    <header class="bg-surface border-b border-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-lg font-semibold text-white">AI Code Editor</h1>
          <div class="text-sm text-gray-400">main.tsx</div>
        </div>
        <div class="flex items-center space-x-2 ml-auto text-gray-400">
          <button class="p-1.5 rounded-md hover:bg-gray-200">
            <div class="i-mdi-dots-vertical text-gray-500 h-5 w-5"></div>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar - File Explorer -->
      <div class="w-64 bg-surface/50 text-text flex flex-col border-r border-border">
        <div class="p-3 border-b border-border">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-text">EXPLORER</h2>
            <button class="text-muted hover:text-text">
              <div class="i-mdi-plus h-4 w-4"></div>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="py-1">
            <!-- Project Root -->
            <div class="px-2 py-1">
              <button class="flex items-center w-full text-left text-sm text-text hover:bg-surface/50 rounded px-2 py-1">
                <div class="i-mdi-folder h-4 w-4 mr-1"></div>
                my-app
              </button>
              
              <!-- Files -->
              <div class="ml-4 mt-1">
                <div class="mb-1">
                  <div class="text-xs text-muted uppercase font-medium px-2 py-1">src</div>
                  <div class="ml-2">
                    <div class="flex items-center text-sm text-text hover:bg-surface/50 rounded px-2 py-1">
                      <div class="i-mdi-file-document-outline h-4 w-4 mr-1 text-muted"></div>
                      main.tsx
                    </div>
                    <div class="flex items-center text-sm text-muted hover:bg-surface/50 rounded px-2 py-1">
                      <div class="i-mdi-file-document-outline h-4 w-4 mr-1 text-muted"></div>
                      App.tsx
                    </div>
                    <div class="flex items-center text-sm text-muted hover:bg-surface/50 rounded px-2 py-1">
                      <div class="i-mdi-file-document-outline h-4 w-4 mr-1 text-muted"></div>
                      index.css
                    </div>
                  </div>
                </div>
                
                <div class="mt-2">
                  <div class="flex items-center text-sm text-muted hover:bg-surface/50 rounded px-2 py-1">
                    <div class="i-mdi-lightning-bolt h-4 w-4 mr-1 text-muted"></div>
                    package.json
                  </div>
                  <div class="flex items-center text-sm text-muted hover:bg-surface/50 rounded px-2 py-1">
                    <div class="i-mdi-file-document-outline h-4 w-4 mr-1 text-muted"></div>
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
        <div class="flex items-center bg-surface/50 border-b border-border">
          <div class="flex items-center px-4 py-2 border-r border-border bg-surface text-white">
            <div class="i-mdi-file-document-outline h-4 w-4 mr-2 text-white"></div>
            main.tsx
            <button class="ml-2 text-muted hover:text-text">
              <div class="i-mdi-close h-4 w-4"></div>
            </button>
          </div>
          <button class="px-4 py-2 text-muted hover:bg-surface/50">
            <div class="i-mdi-plus h-4 w-4"></div>
          </button>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden bg-muted">
          <!-- Editor -->
          <div class="flex-1 overflow-auto">
            <Editor 
              v-model="editorContent"
              class="h-full"
            />
          </div>

          <!-- Bottom Panel Tabs -->
          <div class="h-1/2 flex flex-col border-t border-border">
            <!-- Tabs -->
            <div class="h-12 border-t border-border flex items-center px-4 bg-muted">
              <button 
                v-for="tab in bottomTabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200"
                :class="{
                  'border-brand text-brand': activeTab === tab.id,
                  'border-transparent text-muted hover:text-text': activeTab !== tab.id
                }"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="flex-1 overflow-hidden">
              <!-- Terminal -->
              <div v-if="activeTab === 'terminal'" class="h-full">
                <Terminal 
                  ref="terminal"
                  @execute="handleTerminalCommand"
                  class="h-full"
                />
              </div>


              <!-- Browser -->
              <div v-else-if="activeTab === 'browser'" class="h-full">
                <Browser 
                  :url="browserUrl"
                  @update:url="(url: string) => browserUrl = url"
                  @navigate="handleBrowserNavigate"
                  class="h-full"
                />
              </div>

              <!-- Dependencies -->
              <Dependencies 
                v-else
                :dependencies="dependencies"
                :installation-output="installationOutput"
                @install-dependency="installDependency"
                class="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
