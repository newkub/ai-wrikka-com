<script setup lang="ts">
import { ref } from "vue";

defineProps<{
	isOpen: boolean;
}>();

defineEmits<(e: "toggle") => void>();
</script>

<template>
  <button 
    @click="$emit('toggle')" 
    class="flex items-center focus:outline-none"
    :class="{ 'ring-2 ring-offset-2 ring-brand': isOpen }"
    aria-haspopup="true"
    :aria-expanded="isOpen"
  >
    <div class="h-8 w-8 rounded-full bg-surface flex items-center justify-center">
      <div class="i-mdi-account h-5 w-5 text-text" />
    </div>
  </button>
</template>
