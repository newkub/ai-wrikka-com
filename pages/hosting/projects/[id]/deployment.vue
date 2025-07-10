<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock deployment data
const deployments = [
	{
		id: "1",
		status: "SUCCESS",
		commit: "a1b2c3d",
		branch: "main",
		time: new Date(Date.now() - 3600000).toISOString(),
		duration: "1m 23s",
		commitMessage: "Update homepage design",
	},
	{
		id: "2",
		status: "FAILED",
		commit: "d3c2b1a",
		branch: "feature/new-auth",
		time: new Date(Date.now() - 86400000).toISOString(),
		duration: "45s",
		commitMessage: "Add authentication",
	},
];

const formatTime = (dateString: string) => {
	return new Date(dateString).toLocaleString();
};
</script>

<template>
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commit</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="deploy in deployments" :key="deploy.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <span 
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="{
                'bg-green-100 text-green-800': deploy.status === 'SUCCESS',
                'bg-red-100 text-red-800': deploy.status === 'FAILED',
                'bg-yellow-100 text-yellow-800': deploy.status === 'IN_PROGRESS'
              }"
            >
              {{ deploy.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ deploy.commit }}</div>
            <div class="text-sm text-gray-500">{{ deploy.commitMessage }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ deploy.branch }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatTime(deploy.time) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ deploy.duration }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
