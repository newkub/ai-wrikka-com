<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Input from "./BaseInput.vue";

interface Props {
	modelValue?: string | Date;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
	errorMessage?: string;
	label?: string;
	id?: string;
	name?: string;
	required?: boolean;
	min?: string;
	max?: string;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	placeholder: "Select a date",
	disabled: false,
	error: false,
	errorMessage: "",
	label: "Date",
	id: "",
	name: "date",
	required: false,
	min: "",
	max: "",
});

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const showPicker = ref(false);
const datePickerRef = ref<HTMLElement | null>(null);
const inputId = computed(
	() => props.id || `date-${Math.random().toString(36).substr(2, 9)}`,
);

const formattedDate = computed(() => {
	if (!props.modelValue) return "";
	const date = new Date(props.modelValue);
	return date.toISOString().split("T")[0];
});

const handleDateChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.value);
	showPicker.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
	if (
		datePickerRef.value &&
		!datePickerRef.value.contains(event.target as Node)
	) {
		showPicker.value = false;
	}
};

onMounted(() => {
	document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("mousedown", handleClickOutside);
});

const today = new Date().toISOString().split("T")[0];

defineOptions({
	name: "DateInput",
});
</script>

<template>
  <div class="relative w-full" ref="datePickerRef">
    <div class="relative">
      <Input
        :id="inputId"
        :model-value="formattedDate"
        type="text"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error"
        :error-message="errorMessage"
        :label="label"
        :required="required"
        readonly
        @focus="showPicker = true"
        class="cursor-pointer"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <i class="i-mdi-calendar text-xl" />
      </div>
    </div>

    <div
      v-if="showPicker"
      class="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <input
        type="date"
        class="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :min="min"
        :max="max || today"
        :value="formattedDate"
        @change="handleDateChange"
      />
    </div>
  </div>
</template>
