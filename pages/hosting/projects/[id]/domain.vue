<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock domain data
const domains = [
	{
		id: "1",
		name: "example.com",
		status: "ACTIVE",
		type: "PRIMARY",
		target: "cname.vercel-dns.com",
		verified: true,
	},
	{
		id: "2",
		name: "www.example.com",
		status: "ACTIVE",
		type: "ALIAS",
		target: "example.com",
		verified: true,
	},
	{
		id: "3",
		name: "app.example.com",
		status: "PENDING",
		type: "SUBDOMAIN",
		target: "cname.vercel-dns.com",
		verified: false,
	},
];

const newDomain = ref("");
const isAddingDomain = ref(false);

const addDomain = () => {
	if (!newDomain.value) return;

	// In a real app, you would make an API call here
	domains.push({
		id: Date.now().toString(),
		name: newDomain.value,
		status: "PENDING",
		type: "CUSTOM",
		target: "cname.vercel-dns.com",
		verified: false,
	});

	newDomain.value = "";
	isAddingDomain.value = false;
};
</script>

<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Domains</h3>
          <button 
            @click="isAddingDomain = !isAddingDomain"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Domain
          </button>
        </div>
      </div>

      <!-- Add Domain Form -->
      <div v-if="isAddingDomain" class="px-4 py-5 sm:p-6 border-b border-gray-200">
        <div class="flex">
          <div class="flex-grow">
            <input
              v-model="newDomain"
              type="text"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="example.com"
            />
            <p class="mt-2 text-sm text-gray-500">
              Enter the domain you'd like to add to your project.
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              type="button"
              @click="addDomain"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
            <button
              type="button"
              @click="isAddingDomain = false"
              class="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Domains List -->
      <div class="bg-white overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="domain in domains" :key="domain.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900">{{ domain.name }}</div>
                  <span v-if="!domain.verified" class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': domain.status === 'ACTIVE',
                    'bg-yellow-100 text-yellow-800': domain.status === 'PENDING',
                    'bg-red-100 text-red-800': domain.status === 'ERROR'
                  }"
                >
                  {{ domain.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ domain.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ domain.target }}</code>
                  <button class="ml-2 text-gray-400 hover:text-gray-500">
                    <span class="i-mdi-content-copy text-sm" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button class="text-red-600 hover:text-red-900">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
