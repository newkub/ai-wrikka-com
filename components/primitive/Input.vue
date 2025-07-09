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
    <label v-if="label" :for="id" class="block text-sm font-medium text-text mb-1">
      {{ label }}
      <span v-if="required" class="text-color-error">*</span>
    </label>
    
    <div class="relative rounded-md shadow-sm">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i :class="`${icon} h-5 w-5 text-text/50`" />
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
          'block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
          'bg-block text-text',
          error 
            ? 'border-color-error text-color-error focus:ring-color-error focus:border-color-error' 
            : 'border-border focus:ring-color-primary focus:border-color-primary',
          icon ? 'pl-10' : 'pl-3',
        ]"
      />
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-color-error">
      {{ error }}
    </p>
  </div>
</template>
