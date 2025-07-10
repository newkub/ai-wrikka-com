<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock analytics data
const pageViews = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
	datasets: [
		{
			label: "Page Views",
			data: [65, 59, 80, 81, 56, 55, 40],
			fill: false,
			borderColor: "rgb(99, 102, 241)",
			tension: 0.1,
		},
	],
};

const visitors = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
	datasets: [
		{
			label: "Visitors",
			data: [45, 39, 60, 71, 46, 45, 30],
			fill: false,
			borderColor: "rgb(236, 72, 153)",
			tension: 0.1,
		},
	],
};

const metrics = [
	{
		name: "Total Visits",
		value: "12,345",
		change: "+12%",
		changeType: "increase",
	},
	{
		name: "Avg. Time on Page",
		value: "2m 45s",
		change: "+8%",
		changeType: "increase",
	},
	{ name: "Bounce Rate", value: "42%", change: "-5%", changeType: "decrease" },
	{
		name: "Pages per Visit",
		value: "3.2",
		change: "+0.4",
		changeType: "increase",
	},
];

const topPages = [
	{ name: "/", visitors: "4,512", uniqueVisitors: "3,210", bounceRate: "38%" },
	{
		name: "/blog",
		visitors: "3,210",
		uniqueVisitors: "2,456",
		bounceRate: "45%",
	},
	{
		name: "/pricing",
		visitors: "2,890",
		uniqueVisitors: "1,987",
		bounceRate: "52%",
	},
	{
		name: "/docs",
		visitors: "2,145",
		uniqueVisitors: "1,543",
		bounceRate: "41%",
	},
	{
		name: "/contact",
		visitors: "1,876",
		uniqueVisitors: "1,234",
		bounceRate: "48%",
	},
];
</script>

<template>
    <div class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="metric in metrics" :key="metric.name" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ metric.name }}
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ metric.value }}
            </dd>
            <div class="mt-1">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': metric.changeType === 'increase',
                  'bg-red-100 text-red-800': metric.changeType === 'decrease',
                  'bg-gray-100 text-gray-800': !['increase', 'decrease'].includes(metric.changeType)
                }"
              >
                <span 
                  v-if="metric.changeType === 'increase'" 
                  class="i-mdi-arrow-up mr-1"
                />
                <span 
                  v-else-if="metric.changeType === 'decrease'" 
                  class="i-mdi-arrow-down mr-1"
                />
                {{ metric.change }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Page Views</h3>
          <div class="h-64">
            <!-- In a real app, you would use a charting library like Chart.js here -->
            <div class="h-full flex items-center justify-center bg-gray-50 rounded border border-gray-200">
              <p class="text-gray-500">Page Views Chart</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Visitors</h3>
          <div class="h-64">
            <!-- In a real app, you would use a charting library like Chart.js here -->
            <div class="h-full flex items-center justify-center bg-gray-50 rounded border border-gray-200">
              <p class="text-gray-500">Visitors Chart</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Pages -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Top Pages</h3>
          <p class="mt-1 text-sm text-gray-500">Most visited pages in the last 30 days</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Visitors</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="page in topPages" :key="page.name" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ page.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ page.visitors }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ page.uniqueVisitors }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ page.bounceRate }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
