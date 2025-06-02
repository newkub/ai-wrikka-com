<script setup lang="ts">
import { watch } from 'vue';
import { useEditor } from '~/composables/useEditor';

interface EditorProps {
  modelValue: string;
  language?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  theme?: string;
  [key: string]: string | boolean | undefined; // Index signature for component props
}

const props = withDefaults(defineProps<EditorProps>(), {
  modelValue: '',
  language: 'typescript',
  readOnly: false,
  lineNumbers: true,
  theme: 'vs-dark',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const {
  editorContent,
  editorOptions,
  tabs,
  activeTabId,
  isEditorReady,
  editorInstance,
  setActiveTab,
  updateContent,
  getActiveTab,
  addTab,
  closeTab,
  onEditorMounted,
} = useEditor(props.modelValue, {
  theme: props.theme as 'vs' | 'vs-dark' | 'hc-black' | 'hc-light',
  lineNumbers: props.lineNumbers ? 'on' : 'off',
  minimap: { enabled: true },
  readOnly: props.readOnly,
  wordWrap: 'on',
});

// Watch for content changes from parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== editorContent.value) {
      updateContent(newVal);
    }
  }
);

// Emit updates from the editor
watch(editorContent, (newVal) => {
  emit('update:modelValue', newVal);
});

// Expose methods
const getValue = () => editorContent.value;
const setValue = (value: string) => {
  updateContent(value);
};

defineExpose({
  getValue,
  setValue,
  setActiveTab,
  editor: editorInstance,
  isReady: isEditorReady,
});
</script>

<template>
  <div class="h-full flex flex-col bg-surface-1 text-text rounded-lg overflow-hidden shadow-sm">
    <!-- Tabs -->
    <div class="flex items-center bg-surface-2 border-b border-border overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="setActiveTab(tab.id)"
        class="px-4 py-2 text-sm font-medium flex items-center border-r border-border cursor-pointer transition-colors group"
        :class="{
          'bg-surface-1 text-text': activeTabId === tab.id,
          'text-text/60 hover:bg-surface-3': activeTabId !== tab.id
        }"
      >
        <div v-if="tab.icon" :class="[tab.icon, 'h-4 w-4 mr-2 flex-shrink-0']" />
        <span class="truncate max-w-[120px]">{{ tab.label }}</span>
        <button 
          v-if="tab.id !== 'browser'"
          @click.stop="closeTab(tab.id)"
          class="ml-2 opacity-0 group-hover:opacity-60 hover:opacity-100 text-text/60 hover:text-text transition-opacity"
        >
          <div class="i-mdi-close h-3.5 w-3.5" />
        </button>
      </button>
      
      <!-- Add Tab Button -->
      <button 
        @click="addTab({
          id: `tab-${Date.now()}`,
          label: 'New Tab',
          icon: 'i-mdi-file-document-outline',
          language: 'typescript',
          content: '// Start coding...\n'
        })"
        class="p-2 text-text/60 hover:text-text hover:bg-surface-3 transition-colors"
        title="New Tab"
      >
        <div class="i-mdi-plus h-4 w-4" />
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-auto relative">
      <!-- Code Editor -->
      <div v-show="activeTabId === 'code'" class="h-full flex flex-col">
        <div class="flex items-center justify-between bg-surface-2 text-text/80 px-4 py-2 border-b border-border">
          <div class="text-sm font-mono">{{ getActiveTab()?.label || 'Untitled' }}</div>
          <div class="flex items-center space-x-2">
            <div v-if="!isEditorReady" class="flex items-center">
              <div class="i-mdi-loading h-3.5 w-3.5 mr-1 animate-spin text-text/60"></div>
              <span class="text-xs text-text/60">Loading editor...</span>
            </div>
            <button 
              v-if="getActiveTab()?.isDirty"
              class="text-xs px-2 py-0.5 rounded bg-surface-3 text-text/80 hover:bg-surface-4"
            >
              Unsaved Changes
            </button>
            <button class="text-text/60 hover:text-text transition-colors p-1 rounded hover:bg-surface-3">
              <div class="i-mdi-dots-vertical h-4 w-4"></div>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-hidden">
          <MonacoEditor
            v-model="editorContent"
            :lang="getActiveTab()?.language || props.language"
            :theme="editorOptions.theme"
            :options="{
              ...editorOptions,
              readOnly: props.readOnly
            }"
            @mount="onEditorMounted"
            class="w-full h-full"
          />
        </div>
      </div>

      <!-- Browser Preview -->
      <div v-show="activeTabId === 'browser'" class="h-full flex flex-col">
        <div class="flex items-center justify-between bg-surface-2 text-text/80 px-4 py-2 border-b border-border">
          <div class="flex items-center space-x-1">
            <button 
              class="text-text/60 hover:text-text p-1.5 rounded hover:bg-surface-3 transition-colors"
              title="Back"
            >
              <div class="i-mdi-arrow-left h-4 w-4" />
            </button>
            <button 
              class="text-text/60 hover:text-text p-1.5 rounded hover:bg-surface-3 transition-colors"
              title="Forward"
            >
              <div class="i-mdi-arrow-right h-4 w-4" />
            </button>
            <button 
              class="text-text/60 hover:text-text p-1.5 rounded hover:bg-surface-3 transition-colors"
              title="Refresh"
            >
              <div class="i-mdi-refresh h-4 w-4" />
            </button>
          </div>
          <div class="flex-1 mx-2 max-w-2xl">
            <div class="flex items-center bg-surface-3 rounded-md px-3 py-1.5 text-sm text-text/80 border border-border">
              <div class="i-mdi-lock-check text-brand h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span class="truncate">http://localhost:3000</span>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <button 
              class="text-text/60 hover:text-text p-1.5 rounded hover:bg-surface-3 transition-colors"
              title="Open in new window"
            >
              <div class="i-mdi-open-in-new h-4 w-4" />
            </button>
            <button 
              class="text-text/60 hover:text-text p-1.5 rounded hover:bg-surface-3 transition-colors"
              title="More options"
            >
              <div class="i-mdi-dots-vertical h-4 w-4"></div>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-auto bg-white">
          <!-- Browser preview content would go here -->
          <div class="h-full flex flex-col items-center justify-center bg-surface-1 text-text/80 p-6 text-center">
            <div class="i-mdi-monitor-cellphone h-16 w-16 mx-auto text-text/40 mb-4" />
            <h3 class="text-lg font-medium text-text mb-1">Browser Preview</h3>
            <p class="text-sm text-text/60 mb-4 max-w-md">
              Your application will be displayed here when running the development server.
              The preview updates automatically as you make changes to your code.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand hover:bg-brand/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand/50">
                <div class="i-mdi-play-circle-outline -ml-1 mr-2 h-4 w-4" />
                Start Development Server
              </button>
              <button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-text/80 bg-surface-2 hover:bg-surface-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-4">
                <div class="i-mdi-cog-outline -ml-1 mr-2 h-4 w-4" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
