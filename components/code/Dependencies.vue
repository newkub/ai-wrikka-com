<script setup lang="ts">
import { ref } from "vue";

interface Dependency {
	name: string;
	version: string;
	type: "dependencies" | "devDependencies";
}

interface InstallationOutput {
	type: "success" | "error" | "warning" | "info";
	text: string;
}

const props = defineProps<{
	dependencies: Dependency[];
	installationOutput: InstallationOutput[];
}>();

const emit = defineEmits(["install-dependency"]);

const searchQuery = ref("");
const packageName = ref("");
const packageVersion = ref("latest");
const isDevDependency = ref(false);
const addDependencyModal = ref<HTMLDialogElement | null>(null);

const installNewDependency = () => {
	if (!packageName.value) return;

	emit("install-dependency", {
		name: packageName.value,
		version: packageVersion.value,
		isDev: isDevDependency.value,
	});

	// Reset form
	packageName.value = "";
	packageVersion.value = "latest";
};

const filteredDependencies = () => {
	if (!searchQuery.value) return props.dependencies;
	return props.dependencies.filter((dep) =>
		dep.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
	);
};
</script>

<template>
  <div class="h-full p-4 overflow-auto">
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium text-text">Dependencies</h3>
        <button 
          class="text-sm text-brand hover:text-brand/80 flex items-center"
          @click="() => addDependencyModal?.showModal()"
        >
          <div class="i-mdi-plus h-4 w-4 mr-1" />
          Add Dependency
        </button>
      </div>
      
      <div class="bg-surface-2 rounded-lg p-4 mb-4 border border-border">
        <div class="flex items-center mb-3">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search packages..." 
            class="flex-1 bg-surface-3 border border-border rounded-md px-3 py-1.5 text-sm text-text placeholder-text/50 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
          >
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="(dep, index) in filteredDependencies()" 
            :key="index" 
            class="flex items-center justify-between p-2 hover:bg-surface-3 rounded-lg transition-colors"
          >
            <div>
              <div class="font-medium text-text">{{ dep.name }}</div>
              <div class="text-xs text-text/60">{{ dep.version }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                class="text-xs px-2 py-0.5 rounded-full font-medium" 
                :class="{
                  'bg-green-100 text-green-800': dep.type === 'dependencies',
                  'bg-purple-100 text-purple-800': dep.type === 'devDependencies'
                }"
              >
                {{ dep.type === 'dependencies' ? 'Production' : 'Dev' }}
              </span>
              <button class="text-text/40 hover:text-alert transition-colors">
                <div class="i-mdi-delete h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-if="filteredDependencies().length === 0" class="text-center py-4 text-text/60">
            No dependencies found
          </div>
        </div>
      </div>
      
      <div class="bg-surface-2 rounded-lg p-4 border border-border">
        <h4 class="text-sm font-medium text-text mb-2">Installation Output</h4>
        <div class="bg-surface-3 p-3 rounded font-mono text-xs text-text/80 h-24 overflow-y-auto">
          <div v-for="(line, index) in installationOutput" :key="index" class="mb-1">
            <span 
              :class="{
                'text-green-500': line.type === 'success',
                'text-red-500': line.type === 'error',
                'text-yellow-500': line.type === 'warning',
                'text-brand': line.type === 'info'
              }"
            >
              $ {{ line.text }}
            </span>
          </div>
          <div v-if="installationOutput.length === 0" class="text-text/40 italic">
            No installation output yet...
          </div>
        </div>
      </div>
    </div>

    <!-- Add Dependency Modal -->
    <dialog ref="addDependencyModal" class="modal">
      <div class="modal-box bg-surface-2 text-text border border-border">
        <h3 class="font-bold text-lg mb-4">Add New Dependency</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text/80 mb-1">Package Name</label>
            <input 
              v-model="packageName"
              type="text" 
              placeholder="e.g., lodash"
              class="w-full bg-surface-3 border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            >
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text/80 mb-1">Version</label>
              <input 
                v-model="packageVersion"
                type="text" 
                placeholder="e.g., ^4.17.21"
                class="w-full bg-surface-3 border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
              >
            </div>
            <div class="flex items-end">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input 
                  v-model="isDevDependency"
                  type="checkbox" 
                  class="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                >
                <span class="text-sm text-text/80">Development Dependency</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-action mt-6">
          <form method="dialog" class="flex space-x-2">
            <button class="px-4 py-2 text-sm font-medium rounded-md border border-border bg-surface-3 text-text hover:bg-surface-4">
              Cancel
            </button>
            <button 
              class="px-4 py-2 text-sm font-medium rounded-md bg-brand text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!packageName"
              @click="installNewDependency"
            >
              Install
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-black/50">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
