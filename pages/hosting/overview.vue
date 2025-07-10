<script setup lang="ts">
// Logic will be added here
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center py-12 text-center">
      <h1 class="text-4xl font-bold mb-4">Fast and Reliable Hosting</h1>
      <p class="text-lg text-gray-600 max-w-2xl mb-8">
        Hosting service designed specifically for developers
      </p>
      <button class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
        Create New Project
      </button>
    </section>

    <!-- Feature Highlights -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="border rounded-lg p-6 flex flex-col items-center text-center">
        <div class="i-mdi-server text-4xl text-blue-500 mb-4"></div>
        <h3 class="text-xl font-semibold mb-2">High Performance</h3>
        <p class="text-gray-600">High-speed servers with SSD storage</p>
      </div>
      <div class="border rounded-lg p-6 flex flex-col items-center text-center">
        <div class="i-mdi-shield-check text-4xl text-green-500 mb-4"></div>
        <h3 class="text-xl font-semibold mb-2">Security</h3>
        <p class="text-gray-600">DDoS protection and free SSL</p>
      </div>
      <div class="border rounded-lg p-6 flex flex-col items-center text-center">
        <div class="i-mdi-cog text-4xl text-purple-500 mb-4"></div>
        <h3 class="text-xl font-semibold mb-2">Easy Configuration</h3>
        <p class="text-gray-600">Control via user-friendly Dashboard</p>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="border rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-blue-500">5</div>
        <p class="text-gray-600">Active Projects</p>
      </div>
      <div class="border rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-blue-500">10</div>
        <p class="text-gray-600">Registered Users</p>
      </div>
      <div class="border rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-blue-500">20</div>
        <p class="text-gray-600">Monthly Visits</p>
      </div>
      <div class="border rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-blue-500">99.9%</div>
        <p class="text-gray-600">Uptime</p>
      </div>
    </section>

    <!-- Recent Projects -->
    <section>
      <h2 class="text-2xl font-bold mb-6">Recent Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="project in [
            { name: 'My Portfolio', status: 'active', lastUpdated: '2 hours ago' },
            { name: 'E-commerce Site', status: 'active', lastUpdated: '1 day ago' },
            { name: 'Blog Platform', status: 'inactive', lastUpdated: '1 week ago' }
          ]" 
          :key="project.name"
          class="border rounded-lg p-4 hover:shadow-md transition"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-lg">{{ project.name }}</h3>
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-green-100 text-green-800': project.status === 'active',
                'bg-gray-100 text-gray-800': project.status === 'inactive'
              }"
            >
              {{ project.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mb-4">Last updated: {{ project.lastUpdated }}</p>
          <button class="text-blue-500 hover:text-blue-700 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </section>

    <!-- Getting Started Guide -->
    <section class="bg-gray-50 rounded-xl p-6">
      <h2 class="text-2xl font-bold mb-6">Getting Started</h2>
      <div class="space-y-4">
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
            <div class="w-px h-full bg-gray-300 mt-2"></div>
          </div>
          <div>
            <h3 class="font-semibold">Create New Project</h3>
            <p class="text-gray-600">Click the "Create New Project" button above</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
            <div class="w-px h-full bg-gray-300 mt-2"></div>
          </div>
          <div>
            <h3 class="font-semibold">Configure Project</h3>
            <p class="text-gray-600">Set up your project by defining name and description</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
          </div>
          <div>
            <h3 class="font-semibold">Start Using</h3>
            <p class="text-gray-600">Start using your project by clicking "Get Started"</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom styles will be added here */
</style>