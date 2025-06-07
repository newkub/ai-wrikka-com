<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  icon?: string
}>()
</script>

<template>
  <div class="flex flex-col p-4 h-full bg-background rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
    <div v-if="icon" class="text-2xl mb-2">
      <i :class="icon" />
    </div>
    <h3 class="text-lg font-semibold mb-2 text-text">
      {{ title }}
    </h3>
    <p class="text-text/80 text-sm flex-grow">
      {{ description }}
    </p>
  </div>
</template>
