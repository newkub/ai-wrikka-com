<script setup lang="ts">
const usageStats = [
	{
		name: "Bandwidth",
		used: "45.6",
		total: "100",
		unit: "GB",
		percentage: 45.6,
	},
	{ name: "Storage", used: "28.3", total: "50", unit: "GB", percentage: 56.6 },
	{
		name: "Build Minutes",
		used: "1,245",
		total: "2,000",
		unit: "min",
		percentage: 62.3,
	},
	{
		name: "Serverless Functions",
		used: "3.2",
		total: "10",
		unit: "M reqs",
		percentage: 32,
	},
];

const projects = [
	{
		name: "portfolio",
		bandwidth: "12.4 GB",
		storage: "5.2 GB",
		buildTime: "45 min",
		functions: "1.2M reqs",
	},
	{
		name: "ecommerce",
		bandwidth: "24.7 GB",
		storage: "18.5 GB",
		buildTime: "156 min",
		functions: "1.8M reqs",
	},
	{
		name: "blog",
		bandwidth: "8.5 GB",
		storage: "4.6 GB",
		buildTime: "23 min",
		functions: "0.2M reqs",
	},
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Usage</h2>
      <p class="mt-1 text-sm text-gray-500">Monitor your resource consumption and limits</p>
    </div>

    <!-- Usage Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in usageStats" :key="stat.name" class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
            <p class="mt-1 text-2xl font-semibold text-gray-900">
              {{ stat.used }}/{{ stat.total }} {{ stat.unit }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              {{ stat.percentage }}% of plan limit
            </p>
          </div>
          <div class="w-16 h-16">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" class="stroke-gray-200" stroke-width="3" />
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none"
                class="stroke-indigo-600" 
                stroke-width="3"
                stroke-dasharray="100"
                :stroke-dashoffset="100 - stat.percentage"
                stroke-linecap="round"
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="21" text-anchor="middle" class="text-xs font-medium">{{ stat.percentage }}%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage by Project -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Usage by Project</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Resource consumption per project</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bandwidth
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Storage
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Build Time
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Functions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(project, index) in projects" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ project.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ project.bandwidth }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ project.storage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ project.buildTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ project.functions }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upgrade Banner -->
    <div class="bg-indigo-50 p-4 rounded-lg flex items-start md:items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center">
          <span class="i-mdi-alert-circle-outline text-indigo-400 text-xl mr-3" />
          <h3 class="text-sm font-medium text-indigo-800">Approaching plan limits</h3>
        </div>
        <div class="mt-2 text-sm text-indigo-700">
          <p>You've used 62% of your build minutes. Upgrade to a higher plan for more resources.</p>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-6">
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Upgrade Plan
        </button>
      </div>
    </div>
  </div>
</template>