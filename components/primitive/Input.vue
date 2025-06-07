<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: "",
	},
	id: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		default: "text",
		validator: (value: string) =>
			["text", "email", "password", "number", "tel", "url", "search"].includes(
				value,
			),
	},
	placeholder: {
		type: String,
		default: "",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	required: {
		type: Boolean,
		default: false,
	},
	autocomplete: {
		type: String,
		default: "off",
	},
	error: {
		type: String,
		default: "",
	},
	icon: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative rounded-md shadow-sm">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i :class="`${icon} h-5 w-5 text-gray-400`" />
      </div>
      
      <input
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
          'dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400',
          error 
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 dark:border-red-600 dark:focus:ring-red-500' 
            : 'border-gray-300 focus:ring-color-primary focus:border-color-primary dark:focus:ring-color-primary',
          icon ? 'pl-10' : 'pl-3',
        ]"
      />
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
