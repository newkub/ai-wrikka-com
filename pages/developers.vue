<script setup lang="ts">
// Add any necessary imports or reactive state here
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Developer Resources</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Explore our developer tools and resources to build amazing applications
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
          <div class="i-mdi-code-braces text-2xl text-indigo-600"></div>
        </div>
        <h3 class="text-xl font-bold mb-2">API Reference</h3>
        <p class="text-gray-600 mb-4">Comprehensive documentation for all our API endpoints and features.</p>
        <a href="#" class="text-indigo-600 font-medium inline-flex items-center">
          View Documentation
          <div class="i-mdi-arrow-right ml-1"></div>
        </a>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
          <div class="i-mdi-github text-2xl text-indigo-600"></div>
        </div>
        <h3 class="text-xl font-bold mb-2">SDKs & Libraries</h3>
        <p class="text-gray-600 mb-4">Official client libraries for popular programming languages.</p>
        <a href="#" class="text-indigo-600 font-medium inline-flex items-center">
          Explore SDKs
          <div class="i-mdi-arrow-right ml-1"></div>
        </a>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
          <div class="i-mdi-book-open-variant text-2xl text-indigo-600"></div>
        </div>
        <h3 class="text-xl font-bold mb-2">Guides</h3>
        <p class="text-gray-600 mb-4">Step-by-step tutorials to help you get started quickly.</p>
        <a href="#" class="text-indigo-600 font-medium inline-flex items-center">
          Read Guides
          <div class="i-mdi-arrow-right ml-1"></div>
        </a>
      </div>

      <!-- Card 4 -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
          <div class="i-mdi-comment-question-outline text-2xl text-indigo-600"></div>
        </div>
        <h3 class="text-xl font-bold mb-2">Support</h3>
        <p class="text-gray-600 mb-4">Get help from our developer community and support team.</p>
        <a href="#" class="text-indigo-600 font-medium inline-flex items-center">
          Get Support
          <div class="i-mdi-arrow-right ml-1"></div>
        </a>
      </div>
    </div>
  </div>
</template>