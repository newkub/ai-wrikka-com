<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		modelValue?: boolean;
		id?: string;
		label?: string;
		name?: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
	}>(),
	{
		modelValue: false,
		id: "",
		label: "",
		name: "",
		disabled: false,
		required: false,
		error: "",
	},
);

const emit = defineEmits(["update:modelValue"]);

const checkboxId = computed(
	() => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
);

const handleChange = (e: Event) => {
	const target = e.target as HTMLInputElement;
	emit("update:modelValue", target.checked);
};
</script>

<template>
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="checkboxId"
        type="checkbox"
        :checked="modelValue"
        :name="name || checkboxId"
        :disabled="disabled"
        :required="required"
        class="h-4 w-4 rounded border-gray-300 text-color-primary focus:ring-color-primary disabled:opacity-50"
        :class="error ? 'border-red-500' : 'border-gray-300'"
        @change="handleChange"
      />
    </div>
    <div class="ml-3 text-sm">
      <label :for="checkboxId" class="font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>
