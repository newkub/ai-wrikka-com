<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock activity data
const activities = [
	{
		id: "1",
		type: "deployment",
		action: "Deployed",
		user: "John Doe",
		time: new Date(Date.now() - 3600000).toISOString(),
		details: "Deployed commit a1b2c3d to production",
	},
	{
		id: "2",
		type: "environment",
		action: "Variable Updated",
		user: "Jane Smith",
		time: new Date(Date.now() - 7200000).toISOString(),
		details: "Updated environment variables",
	},
	{
		id: "3",
		type: "settings",
		action: "Settings Updated",
		user: "John Doe",
		time: new Date(Date.now() - 86400000).toISOString(),
		details: "Changed build settings",
	},
];

const getIcon = (type: string) => {
	const icons: Record<string, string> = {
		deployment: "i-mdi-rocket-launch-outline",
		environment: "i-mdi-tune",
		settings: "i-mdi-cog",
		default: "i-mdi-information",
	};
	return icons[type] || icons.default;
};

const formatTimeAgo = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium leading-6 text-gray-900">Activity Log</h3>
      <p class="mt-1 text-sm text-gray-500">
        Recent activity for this project
      </p>
    </div>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(activity, index) in activities" :key="activity.id">
            <div class="relative pb-8">
              <span v-if="index !== activities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              <div class="relative flex space-x-3">
                <div>
                  <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="{
                    'bg-blue-500': activity.type === 'deployment',
                    'bg-green-500': activity.type === 'environment',
                    'bg-purple-500': activity.type === 'settings',
                    'bg-gray-400': !['deployment', 'environment', 'settings'].includes(activity.type)
                  }">
                    <span :class="[getIcon(activity.type), 'h-5 w-5 text-white']" />
                  </span>
                </div>
                <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ activity.action }} by {{ activity.user }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ activity.details }}
                    </p>
                  </div>
                  <div class="text-right text-sm whitespace-nowrap text-gray-500">
                    <time :datetime="activity.time">{{ formatTimeAgo(activity.time) }}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
