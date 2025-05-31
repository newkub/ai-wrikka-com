<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'typescript'
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  lineNumbers: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'vs-dark'
  }
});

const emit = defineEmits(['update:modelValue']);

const editorContent = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  if (editorContent.value !== newVal) {
    editorContent.value = newVal;
  }
});

const onContentChange = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  editorContent.value = target.value;
  emit('update:modelValue', target.value);
};

// Expose methods if needed
const getValue = () => editorContent.value;
const setValue = (value: string) => {
  editorContent.value = value;
  emit('update:modelValue', value);
};

defineExpose({
  getValue,
  setValue
});
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden shadow-sm">
    <div class="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 border-b border-gray-700">
      <div class="text-sm font-mono">main.tsx</div>
      <div class="flex space-x-2">
        <button class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <textarea
        v-model="editorContent"
        @input="onContentChange"
        :readonly="readOnly"
        class="w-full h-full min-h-300px font-mono text-sm p-4 bg-gray-900 text-gray-100 focus:outline-none resize-none leading-normal tab-2"
        :class="{ 'cursor-not-allowed opacity-75': readOnly }"
      ></textarea>
    </div>
  </div>
</template>
