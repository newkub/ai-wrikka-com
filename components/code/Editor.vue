<script setup lang="ts">
import { ref, watch } from 'vue';

// Icons for tabs using UnoCSS iconify
const tabs = [
  { 
    id: 'code', 
    label: 'Code', 
    icon: 'i-mdi-code-tags' 
  },
  { 
    id: 'browser', 
    label: 'Browser', 
    icon: 'i-mdi-web' 
  }
];

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
  theme: 'vs-dark'
});

const emit = defineEmits(['update:modelValue']);

const editorContent = ref(props.modelValue);
const activeTab = ref('browser'); // Default to browser tab

watch(() => props.modelValue, (newVal) => {
  if (editorContent.value !== newVal) {
    editorContent.value = newVal;
  }
});

// Expose methods if needed
const getValue = () => editorContent.value;
const setValue = (value: string) => {
  editorContent.value = value;
  emit('update:modelValue', value);
};

// Expose tab control
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
};

defineExpose({
  getValue,
  setValue,
  setActiveTab
});
</script>

<template>
  <div class="h-full flex flex-col bg-surface-1 text-text rounded-lg overflow-hidden shadow-sm">
    <!-- Tabs -->
    <div class="flex items-center bg-surface-2 border-b border-border overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 text-sm font-medium flex items-center border-r border-border cursor-pointer transition-colors"
        :class="{
          'bg-surface-1 text-text': activeTab === tab.id,
          'text-text/60 hover:bg-surface-3': activeTab !== tab.id
        }"
      >
        <div v-if="tab.icon" :class="[tab.icon, 'h-4 w-4 mr-2']" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-auto relative">
      <!-- Code Editor -->
      <div v-show="activeTab === 'code'" class="h-full flex flex-col">
        <div class="flex items-center justify-between bg-surface-2 text-text/80 px-4 py-2 border-b border-border">
          <div class="text-sm font-mono">main.tsx</div>
          <div class="flex space-x-2">
            <button class="text-text/60 hover:text-text transition-colors">
              <div class="i-mdi-dots-vertical h-4 w-4"></div>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-auto">
          <MonacoEditor
            v-model="editorContent"
            :lang="props.language"
            :theme="props.theme"
            :options="{
              readOnly: props.readOnly,
              lineNumbers: props.lineNumbers ? 'on' : 'off'
            }"
            @change="(val: string) => emit('update:modelValue', val)"
            class="w-full h-full"
          />
        </div>
      </div>

      <!-- Browser Preview -->
      <div v-show="activeTab === 'browser'" class="h-full flex flex-col">
        <div class="flex items-center justify-between bg-surface-2 text-text/80 px-4 py-2 border-b border-border">
          <div class="flex items-center space-x-2">
            <button class="text-text/60 hover:text-text p-1 rounded hover:bg-surface-3 transition-colors">
              <div class="i-mdi-arrow-left h-4 w-4" />
            </button>
            <button class="text-text/60 hover:text-text p-1 rounded hover:bg-surface-3 transition-colors">
              <div class="i-mdi-arrow-right h-4 w-4" />
            </button>
            <button class="text-text/60 hover:text-text p-1 rounded hover:bg-surface-3 transition-colors">
              <div class="i-mdi-refresh h-4 w-4" />
            </button>
          </div>
          <div class="flex-1 mx-4">
            <div class="flex items-center bg-surface-3 rounded-md px-3 py-1.5 text-sm text-text/80 border border-border">
              <div class="i-mdi-lock-check text-brand h-3.5 w-3.5 mr-2" />
              <span>http://localhost:3000</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button class="text-text/60 hover:text-text p-1 rounded hover:bg-surface-3 transition-colors">
              <div class="i-mdi-dots-vertical h-4 w-4"></div>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-auto bg-white">
          <!-- Browser preview content would go here -->
          <div class="h-full flex items-center justify-center bg-surface-1 text-text/80">
            <div class="text-center p-6 max-w-md">
              <div class="i-mdi-monitor-cellphone h-12 w-12 mx-auto text-text/40 mb-4" />
              <h3 class="text-lg font-medium text-text mb-1">Browser Preview</h3>
              <p class="text-sm text-text/60 mb-4">Your application will be displayed here when running</p>
              <button class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand hover:bg-brand/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand/50">
                <div class="i-mdi-play-circle-outline -ml-1 mr-2 h-4 w-4" />
                Start Development Server
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
