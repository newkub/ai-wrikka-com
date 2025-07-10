<template>
  <div class="flex flex-col h-full">
    <div class="p-6 max-w-6xl mx-auto w-full">
      <!-- Project Type Selection -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-6 text-gray-800 flex justify-center items-center gap-2">
          <span class="i-mdi-rocket-launch text-indigo-600"></span>
          Select Project Type
        </h1>
        
        <div class="grid grid-cols-5 gap-6">
          <div 
            v-for="type in projectTypes"
            :key="type.value"
            @click="selectProjectType(type.value)"
            class="p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
            :class="form.projectType === type.value 
              ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
              : 'border-gray-200 hover:border-indigo-300'"
          >
            <div class="flex flex-col items-center gap-3">
              <span class="text-3xl" :class="type.icon"></span>
              <h3 class="font-medium text-base text-center text-gray-700">{{ type.label }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Indicator -->
      <div v-if="form.projectType" class="flex justify-center mb-8">
        <div 
          v-for="(step, index) in selectedSteps"
          :key="index"
          class="flex items-center"
        >
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="{
                'bg-indigo-600 text-white': currentStep > index + 1,
                'bg-indigo-100 text-indigo-600 border-2 border-indigo-500': currentStep === index + 1,
                'bg-gray-100 text-gray-600': currentStep < index + 1
              }">
              {{ index + 1 }}
            </div>
            <span class="text-xs mt-1 capitalize">{{ step }}</span>
          </div>
          <div v-if="index < selectedSteps.length - 1" class="w-12 h-px bg-gray-300 mx-2"></div>
        </div>
      </div>

      <!-- Step Content -->
      <div v-if="form.projectType" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Basic Info (共通) -->
        <div v-if="currentStep === 1" class="p-6 space-y-6">
          <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
              <span class="i-mdi-form-textbox text-indigo-500"></span>
              Project Name
            </label>
            <input 
              v-model="form.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
              <span class="i-mdi-text-box-outline text-indigo-500"></span>
              Description
            </label>
            <textarea 
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <!-- Application Steps -->
        <div v-if="form.projectType === 'app'">
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">GitHub Repository</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-github text-gray-800"></span>
                GitHub Repository
              </label>
              <div class="flex">
                <div class="flex-shrink-0 px-3 py-2 bg-gray-100 border border-r-0 rounded-l-md text-gray-500">
                  github.com/
                </div>
                <input 
                  v-model="form.githubRepo"
                  type="text" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="username/repo"
                  required
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-source-branch text-gray-800"></span>
                Branch
              </label>
              <input 
                v-model="form.branch"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Environment Variables</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-tune-variant text-indigo-500"></span>
                Environment Variables
              </label>
              
              <div v-for="(env, index) in form.envVars" :key="index" class="grid grid-cols-5 gap-2 mb-2">
                <input 
                  v-model="env.key"
                  type="text" 
                  class="col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Key"
                />
                <input 
                  v-model="env.value"
                  type="text" 
                  class="col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Value"
                />
                <button 
                  type="button"
                  @click="removeEnvVar(index)"
                  class="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <span class="i-mdi-delete" />
                </button>
              </div>
              
              <button 
                type="button"
                @click="addEnvVar"
                class="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-300"
              >
                <span class="i-mdi-plus mr-1" />
                Add Variable
              </button>
            </div>
          </div>
          
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Build Configuration</h2>
            <!-- ... build config form ... -->
          </div>
          
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Domain Setup</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-web text-indigo-500"></span>
                Custom Domain
              </label>
              <input 
                v-model="form.domain"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example.com"
              />
            </div>
            
            <div class="flex items-center">
              <input 
                v-model="form.enableSSL"
                type="checkbox" 
                id="enableSSL"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="enableSSL" class="ml-2 block text-sm text-gray-700 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-lock text-indigo-500"></span>
                Enable SSL Certificate
              </label>
            </div>
          </div>
          
          <div v-if="currentStep === 6" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Review Configuration</h2>
            <!-- ... review config form ... -->
          </div>
        </div>

        <!-- Static Site Steps -->
        <div v-if="form.projectType === 'static'">
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Source Configuration</h2>
            <!-- ... source form ... -->
          </div>
          
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Build Configuration</h2>
            <!-- ... build config form ... -->
          </div>
          
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Domain Setup</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-web text-indigo-500"></span>
                Custom Domain
              </label>
              <input 
                v-model="form.domain"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example.com"
              />
            </div>
            
            <div class="flex items-center">
              <input 
                v-model="form.enableSSL"
                type="checkbox" 
                id="enableSSL"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="enableSSL" class="ml-2 block text-sm text-gray-700 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="i-mdi-lock text-indigo-500"></span>
                Enable SSL Certificate
              </label>
            </div>
          </div>
          
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Review Configuration</h2>
            <!-- ... review config form ... -->
          </div>
        </div>

        <!-- Database Steps -->
        <div v-if="form.projectType === 'database'">
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Database Type</h2>
            <!-- ... database type form ... -->
          </div>
          
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Database Configuration</h2>
            <!-- ... database config form ... -->
          </div>
          
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Security Configuration</h2>
            <!-- ... security config form ... -->
          </div>
          
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Backup Configuration</h2>
            <!-- ... backup config form ... -->
          </div>
          
          <div v-if="currentStep === 6" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Review Configuration</h2>
            <!-- ... review config form ... -->
          </div>
        </div>

        <!-- Function Steps -->
        <div v-if="form.projectType === 'function'">
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Source Configuration</h2>
            <!-- ... source form ... -->
          </div>
          
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Trigger Configuration</h2>
            <!-- ... trigger config form ... -->
          </div>
          
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Schedule Configuration</h2>
            <!-- ... schedule config form ... -->
          </div>
          
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Permissions Configuration</h2>
            <!-- ... permissions config form ... -->
          </div>
          
          <div v-if="currentStep === 6" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Review Configuration</h2>
            <!-- ... review config form ... -->
          </div>
        </div>

        <!-- AI Model Steps -->
        <div v-if="form.projectType === 'ai-model'">
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Files Configuration</h2>
            <!-- ... files config form ... -->
          </div>
          
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">GPU Configuration</h2>
            <!-- ... gpu config form ... -->
          </div>
          
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">API Configuration</h2>
            <!-- ... api config form ... -->
          </div>
          
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Monitoring Configuration</h2>
            <!-- ... monitoring config form ... -->
          </div>
          
          <div v-if="currentStep === 6" class="p-6 space-y-6">
            <h2 class="text-lg font-semibold mb-4">Review Configuration</h2>
            <!-- ... review config form ... -->
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="p-4 bg-gray-50 flex justify-between">
          <button 
            v-if="currentStep > 1"
            @click="prevStep"
            class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300"
          >
            Back
          </button>
          <div v-else></div>
          
          <button 
            v-if="currentStep < maxSteps"
            @click="nextStep"
            class="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Next
          </button>
          
          <button 
            v-else
            @click="submit"
            class="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const projectTypes = [
	{
		value: "app",
		label: "Application",
		steps: ["basic", "github", "env", "build", "domain", "review"],
		icon: "i-mdi-application",
	},
	{
		value: "static",
		label: "Static Site",
		steps: ["basic", "source", "build", "domain", "review"],
		icon: "i-mdi-file-document",
	},
	{
		value: "database",
		label: "Database",
		steps: ["basic", "type", "config", "security", "backup", "review"],
		icon: "i-mdi-database",
	},
	{
		value: "function",
		label: "Function",
		steps: ["basic", "source", "trigger", "schedule", "permissions", "review"],
		icon: "i-mdi-clock-outline",
	},
	{
		value: "ai-model",
		label: "AI Model",
		steps: ["basic", "files", "gpu", "api", "monitoring", "review"],
		icon: "i-mdi-brain",
	},
];

const form = ref({
	projectType: "",
	name: "",
	description: "",
	githubRepo: "",
	branch: "main",
	envVars: [{ key: "", value: "" }],
	domain: "",
	enableSSL: true,
});

const currentStep = ref(1);
const selectedSteps = ref<string[]>([]);

const maxSteps = computed(() => {
	return selectedSteps.value.length;
});

const selectProjectType = (type: string) => {
	form.value.projectType = type;
	const typeConfig = projectTypes.find((t) => t.value === type);
	selectedSteps.value = typeConfig?.steps || [];
	currentStep.value = 1;
};

const addEnvVar = () => {
	form.value.envVars.push({ key: "", value: "" });
};

const removeEnvVar = (index: number) => {
	form.value.envVars.splice(index, 1);
};

const nextStep = () => {
	if (currentStep.value < maxSteps.value) {
		currentStep.value++;
	} else {
		submit();
	}
};

const prevStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
};

const submit = () => {
	router.push("/hosting/projects");
};
</script>