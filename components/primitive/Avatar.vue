<script setup lang="ts">
import { ref } from "vue";

defineProps<{
	imageUrl?: string;
	name?: string;
	size?: "sm" | "md" | "lg";
}>();

const sizeClasses = {
	sm: "h-8 w-8 text-sm",
	md: "h-10 w-10 text-base",
	lg: "h-12 w-12 text-lg",
};
</script>

<template>
  <div 
    class="rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
    :class="[size ? sizeClasses[size] : sizeClasses.md]"
  >
    <img 
      v-if="imageUrl" 
      :src="imageUrl" 
      alt="User avatar"
      class="h-full w-full object-cover"
    >
    <span 
      v-else 
      class="text-gray-600 dark:text-gray-300 font-medium"
    >
      {{ name ? name[0].toUpperCase() : 'U' }}
    </span>
  </div>
</template>
