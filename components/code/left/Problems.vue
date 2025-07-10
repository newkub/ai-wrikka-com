<script setup lang="ts">
import { ref } from "vue";

interface Problem {
	severity: "error" | "warning" | "info";
	message: string;
	source?: string;
	line?: number;
	column?: number;
}

const problems = ref<Problem[]>([
	{
		severity: "error",
		message: "Unexpected token: ;",
		source: "src/components/Button.vue",
		line: 24,
		column: 12,
	},
	{
		severity: "warning",
		message: "Unused variable: unusedVar",
		source: "src/utils/helpers.ts",
		line: 8,
		column: 5,
	},
	{
		severity: "info",
		message: "Type any is not recommended",
		source: "src/store/index.ts",
		line: 15,
		column: 20,
	},
	{
		severity: "error",
		message: "Module not found: Can't resolve 'vuex'",
		source: "src/main.ts",
		line: 5,
		column: 1,
	},
	{
		severity: "warning",
		message: "Missing required prop: icon",
		source: "src/components/IconButton.vue",
		line: 12,
		column: 3,
	},
]);

const addProblem = (problem: Problem) => {
	problems.value.push(problem);
};

const clearProblems = () => {
	problems.value = [];
};

defineExpose({
	addProblem,
	clearProblems,
});
</script>

<template>
  <div class="h-full overflow-auto p-2">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-sm font-medium text-gray-300">Problems</h3>
      <button 
        class="text-xs text-blue-400 hover:text-blue-300"
        @click="problems = []"
      >
        Clear All
      </button>
    </div>
    <div v-if="problems.length === 0" class="text-center text-gray-500 py-8">
      <div class="i-mdi-check-circle-outline text-4xl mx-auto mb-2"></div>
      <p>No problems detected</p>
    </div>
    <div v-else class="space-y-1">
      <div 
        v-for="(problem, index) in problems" 
        :key="index"
        class="p-2 rounded hover:bg-gray-800 cursor-pointer flex items-start gap-2"
      >
        <div 
          :class="[
            'flex-shrink-0 mt-0.5',
            problem.severity === 'error' ? 'text-red-400' :
            problem.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
          ]"
        >
          <i 
            :class="[
              problem.severity === 'error' ? 'i-mdi-close-circle' :
              problem.severity === 'warning' ? 'i-mdi-alert-circle' : 'i-mdi-information'
            ]"
          ></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-200">{{ problem.message }}</div>
          <div v-if="problem.source || problem.line" class="text-xs text-gray-500 mt-0.5">
            <span v-if="problem.source">{{ problem.source }}</span>
            <span v-if="problem.line"> ({{ problem.line }}, {{ problem.column || 1 }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
