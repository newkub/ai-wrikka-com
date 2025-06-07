<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type * as monaco from 'monaco-editor';

const emit = defineEmits(['update:modelValue']);

const editorRef = ref<HTMLDivElement | null>(null);
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);

const props = withDefaults(defineProps<{
  modelValue: string;
  language?: string;
  fileName?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  theme?: 'vs' | 'vs-dark';
}>(), {
  language: 'javascript',
  fileName: 'code.js',
  readOnly: false,
  showLineNumbers: true,
  theme: 'vs'
});

// Initialize Monaco Editor
const initEditor = async () => {
  if (!editorRef.value) return;

  // Lazy load Monaco Editor
  const monaco = await import('monaco-editor');
  if (!editorRef.value) return; // Check again after import
  
  // Register themes
  monaco.editor.defineTheme('custom-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': 'var(--background)',
      'editor.foreground': 'var(--text)',
      'editor.lineNumbers': 'var(--text)',
    },
  });

  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': 'var(--block)',
      'editor.foreground': 'var(--text)',
      'editor.lineNumbers': 'var(--text)',
    },
  });

  // Create editor instance
  // กำหนด theme ให้ตรงกับ Monaco Editor (vs หรือ vs-dark)
  if (!editorRef.value) return;
  
  editor.value = monaco.editor.create(editorRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme === 'vs-dark' ? 'vs-dark' : 'vs',
    readOnly: props.readOnly,
    lineNumbers: props.showLineNumbers ? 'on' : 'off',
    minimap: { enabled: false },
    automaticLayout: true,
    fontSize: 14,
    lineHeight: 21,
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    wordWrap: 'on',
    fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace',
    fontLigatures: true,
  });

  // Update model value when editor content changes
  editor.value.onDidChangeModelContent(() => {
    const value = editor.value?.getValue() || '';
    emit('update:modelValue', value);
  });
};

// Watch for theme changes
watch(() => props.theme, (newTheme) => {
  if (editor.value) {
    const theme = newTheme === 'vs-dark' ? 'vs-dark' : 'vs';
    editor.value.updateOptions({ theme });
  }
});

// Watch for model value changes from parent
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getValue() !== newValue) {
    editor.value.setValue(newValue);
  }
});

onMounted(() => {
  initEditor();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div 
      v-if="fileName" 
      class="px-4 py-2 text-sm font-mono bg-block  border-b border-border"
    >
      {{ fileName }}
    </div>
    <div ref="editorRef" class="flex-1 w-full"></div>
  </div>
</template>

<style>
/* Import Fira Code for better code font */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

/* Custom scrollbar for editor container */
.monaco-editor .scroll-decoration {
  box-shadow: none !important;
}
</style>
