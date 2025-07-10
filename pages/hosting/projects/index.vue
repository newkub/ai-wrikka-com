<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const projects = [
	{
		id: 1,
		name: "My Portfolio",
		status: "Active",
		updatedAt: "2025-07-10T10:30:00",
		url: "https://portfolio.example.com",
		image: "i-mdi-briefcase",
		cover:
			"https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
	},
	{
		id: 2,
		name: "E-commerce Store",
		status: "Building",
		updatedAt: "2025-07-09T15:45:00",
		url: "https://store.example.com",
		image: "i-mdi-cart",
		cover:
			"https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
	},
	{
		id: 3,
		name: "Blog Platform",
		status: "Error",
		updatedAt: "2025-07-08T09:15:00",
		url: "https://blog.example.com",
		image: "i-mdi-post",
		cover:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
	},
];

const searchQuery = ref("");
const isLoading = ref(false);

const filteredProjects = computed(() => {
	return projects.filter((project) =>
		project.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
	);
});

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const navigateTo = (path: string) => {
	router.push(path);
};
</script>

<template>
  <div>
    <slot name="content">
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 class="text-2xl font-bold text-gray-900">Projects</h2>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="i-mdi-magnify text-gray-400" />
              </div>
              <input 
                v-model="searchQuery"
                type="text" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Search projects"
              />
            </div>
            
            <button 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="navigateTo('/hosting/projects/new-project')"
            >
              <span class="i-mdi-plus mr-2" />
              New Project
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center py-12">
          <span class="i-mdi-loading animate-spin text-4xl text-indigo-600" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="project in filteredProjects" 
            :key="project.id"
            :to="`/hosting/projects/${project.id}`" 
            class="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
          >
            <div class="aspect-video bg-gray-100 overflow-hidden">
              <img 
                :src="project.cover" 
                :alt="project.name"
                class="w-full h-full object-cover"
              />
            </div>
            
            <div class="p-4">
              <div class="flex items-center mb-2">
                <div class="p-2 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
                  <span :class="project.image" class="text-xl" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ project.name }}</h3>
                  <span class="text-xs px-2 py-1 rounded-full" 
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
              
              <div class="text-sm text-gray-500">
                Last updated: {{ formatDate(project.updatedAt) }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </slot>
  </div>
</template>