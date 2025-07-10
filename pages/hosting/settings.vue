<script setup lang="ts">
const settings = ref({
	projectName: "my-awesome-project",
	framework: "nuxt",
	buildCommand: "npm run build",
	outputDirectory: ".output/public",
	installCommand: "npm install",
	rootDirectory: "",
	environmentVariables: [
		{ key: "API_URL", value: "https://api.example.com", enabled: true },
		{ key: "API_KEY", value: "••••••••••••", enabled: true },
		{ key: "NODE_ENV", value: "production", enabled: true },
	],
	autoDeploy: true,
	previewComments: true,
	emailNotifications: true,
});

const frameworks = [
	{ id: "nuxt", name: "Nuxt.js" },
	{ id: "next", name: "Next.js" },
	{ id: "vite", name: "Vite" },
	{ id: "create-react-app", name: "Create React App" },
	{ id: "svelte", name: "Svelte" },
	{ id: "other", name: "Other" },
];

const addEnvVar = () => {
	settings.value.environmentVariables.push({
		key: "",
		value: "",
		enabled: true,
	});
};

const removeEnvVar = (index: number) => {
	settings.value.environmentVariables.splice(index, 1);
};

const saveSettings = () => {
	// Implement save logic here
	alert("Settings saved successfully!");
};

const showDeleteConfirm = ref<number | null>(null);
const copiedIndex = ref<number | null>(null);

const copyValue = (index: number) => {
	navigator.clipboard.writeText(
		settings.value.environmentVariables[index].value,
	);
	copiedIndex.value = index;
	setTimeout(() => (copiedIndex.value = null), 2000);
};

const confirmRemove = (index: number) => {
	showDeleteConfirm.value = index;
};

const cancelRemove = () => {
	showDeleteConfirm.value = null;
};
</script>

<template>
  <div>
    <slot name="content">
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Project Settings</h2>
          <p class="mt-1 text-sm text-gray-500">Manage your project configuration and deployment settings</p>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">General</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Basic project information and settings</p>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="project-name" class="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  id="project-name"
                  v-model="settings.projectName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div class="sm:col-span-3">
                <label for="framework" class="block text-sm font-medium text-gray-700">Framework Preset</label>
                <select
                  id="framework"
                  v-model="settings.framework"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option v-for="framework in frameworks" :key="framework.id" :value="framework.id">
                    {{ framework.name }}
                  </option>
                </select>
              </div>

              <div class="sm:col-span-3">
                <label for="build-command" class="block text-sm font-medium text-gray-700">Build Command</label>
                <input
                  type="text"
                  id="build-command"
                  v-model="settings.buildCommand"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div class="sm:col-span-3">
                <label for="output-dir" class="block text-sm font-medium text-gray-700">Output Directory</label>
                <input
                  type="text"
                  id="output-dir"
                  v-model="settings.outputDirectory"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Environment Variables</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Add environment variables for your application</p>
          </div>
          <div class="px-4 py-5 sm:p-6 space-y-4">
            <div 
              v-for="(env, index) in settings.environmentVariables" 
              :key="index"
              class="flex items-start space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-1 grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  <input
                    v-model="env.key"
                    placeholder="KEY"
                    class="w-full px-3 py-2 border rounded focus:(ring-2 ring-blue-500 border-blue-500 outline-none)"
                    :class="{ 'border-red-500': !env.key && env.enabled }"
                  />
                </div>
                <div class="col-span-7 flex items-center">
                  <input
                    v-model="env.value"
                    :type="env.value.includes('••••') ? 'password' : 'text'"
                    placeholder="VALUE"
                    class="w-full px-3 py-2 border rounded focus:(ring-2 ring-blue-500 border-blue-500 outline-none)"
                  />
                  <button 
                    @click="copyValue(index)"
                    class="ml-2 p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    :title="copiedIndex === index ? 'Copied!' : 'Copy to clipboard'"
                  >
                    <div :class="copiedIndex === index ? 'i-mdi-check' : 'i-mdi-content-copy'" />
                  </button>
                </div>
                <div class="col-span-1 flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    v-model="env.enabled" 
                    class="h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              </div>
              <button 
                @click="confirmRemove(index)"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <div class="i-mdi-delete-outline" />
              </button>

              <div 
                v-if="showDeleteConfirm === index"
                class="absolute z-10 mt-8 bg-white p-4 border rounded-lg shadow-lg"
              >
                <p class="mb-3">Are you sure to remove this variable?</p>
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="cancelRemove"
                    class="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="removeEnvVar(index); showDeleteConfirm = null"
                    class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="addEnvVar"
              class="mt-2 flex items-center text-blue-500 hover:text-blue-700 transition-colors"
            >
              <div class="i-mdi-plus mr-1" />
              Add Variable
            </button>
          </div>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Preferences</h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="auto-deploy"
                    v-model="settings.autoDeploy"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="auto-deploy" class="font-medium text-gray-700">Automatic Deployments</label>
                  <p class="text-gray-500">Automatically deploy when pushing to the production branch</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="preview-comments"
                    v-model="settings.previewComments"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="preview-comments" class="font-medium text-gray-700">Preview Comments</label>
                  <p class="text-gray-500">Allow comments on deployment previews</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="email-notifications"
                    v-model="settings.emailNotifications"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="email-notifications" class="font-medium text-gray-700">Email Notifications</label>
                  <p class="text-gray-500">Receive email notifications for deployments and incidents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            @click="saveSettings"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </slot>
  </div>
</template>