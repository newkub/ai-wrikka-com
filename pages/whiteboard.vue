<script setup lang="ts">
import Whiteboard from '~/components/Whiteboard.vue'

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="flex flex-col">
    <header class="bg-block shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="2xl font-bold ">Whiteboard</h1>
      </div>
    </header>
    
    <main class="flex-1 overflow-hidden">
      <Whiteboard class="h-full" />
    </main>
  </div>
</template>