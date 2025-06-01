<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Platform</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover amazing features designed to boost your productivity
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="i in 8" 
          :key="i"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <div class="i-mdi-star text-white text-5xl" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Feature {{ i }}</h3>
            <p class="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
            </p>
            <div class="flex items-center text-sm text-blue-600 font-medium">
              <span>Learn more</span>
              <div class="i-mdi-arrow-right ml-1" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-16 text-center">
        <button class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          Get Started
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// You can add any necessary component logic here
</script>