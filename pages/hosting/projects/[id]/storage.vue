<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock storage data
const storage = {
	used: 3.2,
	total: 10,
	files: [
		{
			id: "1",
			name: "profile.jpg",
			size: 1.2,
			type: "image",
			uploaded: "2025-07-08T10:30:00",
			url: "https://example.com/storage/profile.jpg",
		},
		{
			id: "2",
			name: "document.pdf",
			size: 0.8,
			type: "document",
			uploaded: "2025-07-07T15:45:00",
			url: "https://example.com/storage/document.pdf",
		},
		{
			id: "3",
			name: "video.mp4",
			size: 1.2,
			type: "video",
			uploaded: "2025-07-06T09:15:00",
			url: "https://example.com/storage/video.mp4",
		},
	],
};

const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const getFileIcon = (type: string) => {
	const icons: Record<string, string> = {
		image: "i-mdi-image",
		document: "i-mdi-file-document-outline",
		video: "i-mdi-video",
		audio: "i-mdi-music-note",
		archive: "i-mdi-folder-zip-outline",
		code: "i-mdi-code-braces",
		default: "i-mdi-file-outline",
	};

	const fileType = type.split("/")[0];
	return icons[fileType] || icons.default;
};

const uploadProgress = ref(0);
const isUploading = ref(false);

const handleFileUpload = (event: Event) => {
	const input = event.target as HTMLInputElement;
	if (!input.files?.length) return;

	isUploading.value = true;
	uploadProgress.value = 0;

	// Simulate file upload
	const interval = setInterval(() => {
		uploadProgress.value += Math.random() * 10;
		if (uploadProgress.value >= 100) {
			clearInterval(interval);
			isUploading.value = false;

			// Add the new file to the list
			const file = input.files![0];
			storage.files.unshift({
				id: Date.now().toString(),
				name: file.name,
				size: file.size / (1024 * 1024), // Convert to MB
				type: file.type.split("/")[0] || "document",
				uploaded: new Date().toISOString(),
				url: URL.createObjectURL(file),
			});

			// Update used storage
			storage.used += file.size / (1024 * 1024); // Convert to MB
		}
	}, 200);
};
</script>

<template>
    <div class="space-y-6">
      <!-- Storage Usage -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Storage Usage</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ formatBytes(storage.used * 1024 * 1024) }} of {{ storage.total }} GB used
          </p>
        </div>
        <div class="px-4 pb-5 sm:px-6">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              class="bg-indigo-600 h-2.5 rounded-full" 
              :style="{ width: `${(storage.used / storage.total) * 100}%` }"
            ></div>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            {{ ((storage.used / storage.total) * 100).toFixed(1) }}% of storage used
          </p>
        </div>
      </div>

      <!-- Upload Area -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Upload Files</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Upload files to your project's storage
          </p>
        </div>
        <div class="px-4 pb-5 sm:px-6">
          <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <div class="flex text-sm text-gray-600">
                <label 
                  for="file-upload" 
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    class="sr-only"
                    @change="handleFileUpload"
                  >
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">
                PNG, JPG, GIF, PDF, MP4 up to 10MB
              </p>
              
              <!-- Upload Progress -->
              <div v-if="isUploading" class="w-full mt-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{{ Math.min(Math.round(uploadProgress), 100) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="bg-indigo-600 h-2.5 rounded-full" 
                    :style="{ width: `${Math.min(uploadProgress, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Files List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Files</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              {{ storage.files.length }} files, {{ formatBytes(storage.used * 1024 * 1024) }} used
            </p>
          </div>
          <div class="flex space-x-3
          ">
            <button 
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="i-mdi-sort-ascending mr-1.5" />
              Sort
            </button>
            <button 
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="i-mdi-filter-outline mr-1.5" />
              Filter
            </button>
          </div>
        </div>
        <div class="border-t border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="file in storage.files" :key="file.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center text-gray-400">
                      <span :class="[getFileIcon(file.type), 'h-6 w-6']" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
                      <div class="text-sm text-gray-500">{{ file.type }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatBytes(file.size * 1024 * 1024) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(file.uploaded) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a :href="file.url" target="_blank" class="text-indigo-600 hover:text-indigo-900 mr-4">
                    <span class="i-mdi-download" />
                  </a>
                  <button class="text-red-600 hover:text-red-900">
                    <span class="i-mdi-trash-can-outline" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
