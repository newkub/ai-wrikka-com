<script setup lang="ts">
import { ref, computed } from "vue";

const timeRange = ref("7d");
const selectedMetric = ref("visitors");

const stats = [
	{
		name: "Total Visits",
		value: "24,492",
		change: "+12%",
		changeType: "positive",
	},
	{
		name: "Page Views",
		value: "89,234",
		change: "+5.4%",
		changeType: "positive",
	},
	{
		name: "Avg. Time on Site",
		value: "2m 34s",
		change: "-2.1%",
		changeType: "negative",
	},
	{
		name: "Bounce Rate",
		value: "34.5%",
		change: "-0.3%",
		changeType: "positive",
	},
];

const pages = [
	{
		name: "/",
		visitors: "4,512",
		pageviews: "12,123",
		bounceRate: "32.1%",
		duration: "2m 45s",
	},
	{
		name: "/blog",
		visitors: "3,890",
		pageviews: "9,876",
		bounceRate: "28.4%",
		duration: "3m 12s",
	},
	{
		name: "/pricing",
		visitors: "2,345",
		pageviews: "5,678",
		bounceRate: "42.3%",
		duration: "1m 56s",
	},
	{
		name: "/about",
		visitors: "1,234",
		pageviews: "3,456",
		bounceRate: "38.7%",
		duration: "2m 15s",
	},
	{
		name: "/contact",
		visitors: "890",
		pageviews: "2,345",
		bounceRate: "45.2%",
		duration: "1m 30s",
	},
];

// Sample chart data
const chartData = computed(() => {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const values = [1200, 1900, 3000, 5000, 2000, 3000, 4000];
	const maxValue = Math.max(...values);

	return {
		days,
		values,
		maxValue,
	};
});

const exportData = () => {
	console.log("Exporting data...");
};
</script>

<template>
  <div>
    <slot name="content">
      <div class="space-y-6">
        <!-- Header and Export Button -->
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Analytics</h2>
            <p class="mt-1 text-sm text-gray-500">Track and analyze your website performance</p>
          </div>
          <button 
            @click="exportData"
            class="px-4 py-2 text-sm rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center"
          >
            <span class="i-mdi-download mr-2" />
            Export
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="stat in stats" :key="stat.name" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ stat.name }}
              </dt>
              <dd class="mt-1 flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ stat.value }}
                </div>
                <div 
                  :class="[
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  ]"
                >
                  <span class="i-mdi-trending-up mr-1" v-if="stat.changeType === 'positive'" />
                  <span class="i-mdi-trending-down mr-1" v-else />
                  {{ stat.change }}
                </div>
              </dd>
            </div>
          </div>
        </div>

        <!-- SVG Chart Section -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 class="text-lg font-medium text-gray-900">Traffic Overview</h3>
            <div class="flex flex-wrap gap-2">
              <select 
                v-model="selectedMetric"
                class="px-3 py-1 text-sm rounded-md border border-gray-300"
              >
                <option value="visitors">Visitors</option>
                <option value="pageviews">Pageviews</option>
              </select>
              <button 
                v-for="range in ['7d', '30d', '90d']" 
                :key="range"
                @click="timeRange = range"
                :class="[
                  timeRange === range ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100',
                  'px-3 py-1 text-sm rounded-md'
                ]"
              >
                {{ range }}
              </button>
            </div>
          </div>
          
          <div class="h-80 relative">
            <!-- SVG Chart -->
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 800 300" 
              class="border-t border-l border-gray-200"
              preserveAspectRatio="none"
            >
              <!-- X-axis labels -->
              <g v-for="(day, index) in chartData.days" :key="day">
                <text 
                  :x="(index * 100) + 50" 
                  y="290" 
                  text-anchor="middle" 
                  class="text-xs fill-gray-500"
                >
                  {{ day }}
                </text>
              </g>
              
              <!-- Y-axis labels -->
              <g v-for="(tick, index) in [0, 0.25, 0.5, 0.75, 1]" :key="index">
                <text 
                  x="30" 
                  :y="270 - (tick * 250)" 
                  text-anchor="end" 
                  class="text-xs fill-gray-500"
                >
                  {{ Math.round(tick * chartData.maxValue) }}
                </text>
                <line 
                  x1="40" 
                  :x2="800" 
                  :y1="270 - (tick * 250)" 
                  :y2="270 - (tick * 250)" 
                  stroke="#e5e7eb" 
                  stroke-width="1" 
                  stroke-dasharray="2,2"
                />
              </g>
              
              <!-- Chart line -->
              <polyline 
                fill="none" 
                stroke="#6366F1" 
                stroke-width="3" 
                stroke-linejoin="round"
                stroke-linecap="round"
                :points="chartData.values.map((val, i) => `${(i * 100) + 50},${270 - (val / chartData.maxValue * 250)}`).join(' ')"
              />
              
              <!-- Data points -->
              <g v-for="(val, index) in chartData.values" :key="index">
                <circle 
                  :cx="(index * 100) + 50" 
                  :cy="270 - (val / chartData.maxValue * 250)" 
                  r="5" 
                  fill="#6366F1" 
                  stroke="white" 
                  stroke-width="2"
                  class="cursor-pointer hover:r-6 transition-all"
                />
                <text 
                  :x="(index * 100) + 50" 
                  :y="270 - (val / chartData.maxValue * 250) - 15" 
                  text-anchor="middle" 
                  class="text-xs font-medium fill-indigo-600"
                >
                  {{ val }}
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Top Pages Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Top Pages</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Most visited pages on your site</p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pageviews
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounce Rate
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Duration
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(page, index) in pages" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ page.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ page.visitors }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ page.pageviews }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ page.bounceRate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ page.duration }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>