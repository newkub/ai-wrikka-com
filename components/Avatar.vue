<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<(e: 'toggle') => void>();
</script>

<template>
  <button 
    @click="$emit('toggle')" 
    class="flex items-center focus:outline-none"
    :class="{ 'ring-2 ring-offset-2 ring-indigo-500': isOpen }"
    aria-haspopup="true"
    :aria-expanded="isOpen"
  >
    <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
      <div class="i-mdi-account h-5 w-5 text-gray-700 dark:text-gray-200" />
    </div>
  </button>
</template>
