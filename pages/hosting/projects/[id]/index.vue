<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

const tabs = [
	{
		name: "Overview",
		href: `/hosting/projects/${projectId.value}`,
		current: true,
	},
	{
		name: "Deployment",
		href: `/hosting/projects/${projectId.value}/deployment`,
		current: false,
	},
	{
		name: "Activity",
		href: `/hosting/projects/${projectId.value}/activity`,
		current: false,
	},
	{
		name: "Domain",
		href: `/hosting/projects/${projectId.value}/domain`,
		current: false,
	},
	{
		name: "Analytics",
		href: `/hosting/projects/${projectId.value}/analytics`,
		current: false,
	},
	{
		name: "Plugins",
		href: `/hosting/projects/${projectId.value}/plugins`,
		current: false,
	},
	{
		name: "Auth",
		href: `/hosting/projects/${projectId.value}/auth`,
		current: false,
	},
	{
		name: "Storage",
		href: `/hosting/projects/${projectId.value}/storage`,
		current: false,
	},
	{
		name: "Database",
		href: `/hosting/projects/${projectId.value}/database`,
		current: false,
	},
	{
		name: "AI",
		href: `/hosting/projects/${projectId.value}/ai`,
		current: false,
	},
	{
		name: "Team",
		href: `/hosting/projects/${projectId.value}/team`,
		current: false,
	},
	{
		name: "Settings",
		href: `/hosting/projects/${projectId.value}/settings`,
		current: false,
	},
];

// Mock project data - replace with actual data fetching
const project = {
	id: projectId.value,
	name: "Project Name",
	status: "Active",
	url: "https://example.com",
	updatedAt: new Date().toISOString(),
};

// Update current tab based on route
const currentTab = computed(() => {
	const path = route.path;
	return tabs.find((tab) => tab.href === path) || tabs[0];
});
</script>

<template>
  <div class="space-y-6">
    <!-- Project Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ project.name }}</h2>
        <div class="mt-1 flex items-center">
          <span class="text-sm text-gray-500 mr-2">{{ project.url }}</span>
          <span 
            class="px-2 py-0.5 text-xs font-medium rounded-full"
            :class="{
              'bg-green-100 text-green-800': project.status === 'Active',
              'bg-yellow-100 text-yellow-800': project.status === 'Building',
              'bg-red-100 text-red-800': project.status === 'Error'
            }"
          >
            {{ project.status }}
          </span>
        </div>
      </div>
      <div class="flex space-x-3">
        <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="i-mdi-cog mr-1.5" />
          Settings
        </button>
        <button class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="i-mdi-rocket-launch-outline mr-1.5" />
          Deploy
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 overflow-x-auto">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.href"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          :class="{
            'border-indigo-500 text-indigo-600': currentTab.name === tab.name,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': currentTab.name !== tab.name
          }"
        >
          {{ tab.name }}
        </NuxtLink>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{{ currentTab.name }}</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Project details and information.</p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Project ID</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ project.id }}</dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': project.status === 'Active',
                  'bg-yellow-100 text-yellow-800': project.status === 'Building',
                  'bg-red-100 text-red-800': project.status === 'Error'
                }"
              >
                {{ project.status }}
              </span>
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">URL</dt>
            <dd class="mt-1 text-sm text-indigo-600 sm:mt-0 sm:col-span-2">
              <a :href="project.url" target="_blank" class="hover:underline flex items-center">
                {{ project.url }}
                <span class="i-mdi-open-in-new ml-1 text-xs" />
              </a>
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ new Date(project.updatedAt).toLocaleString() }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
