<template>
  <div class="flex flex-col min-h-screen">
    <!-- Main Navigation -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              My App
            </NuxtLink>
          </div>
          
          <nav class="flex space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              active-class="text-primary border-b-2 border-primary"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/blog" 
              class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              active-class="text-primary border-b-2 border-primary"
            >
              Blog
            </NuxtLink>
            <NuxtLink 
              to="/docs" 
              class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              active-class="text-primary border-b-2 border-primary"
            >
              Docs
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.router-link-active {
  color: var(--color-primary);
}
</style>
