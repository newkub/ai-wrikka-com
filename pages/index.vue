<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">4-Column Grid</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Grid Item 1 -->
      <div 
        v-for="i in 8" 
        :key="i"
        class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-300"
      >
        <div class="h-32 bg-gray-200 rounded mb-3"></div>
        <h3 class="font-semibold text-lg">Item {{ i }}</h3>
        <p class="text-gray-600 text-sm">Description for item {{ i }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Your script logic here
</script>