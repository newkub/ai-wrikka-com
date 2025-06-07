<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";

interface Props {
	modelValue?: string;
	length?: number;
	disabled?: boolean;
	error?: boolean;
	errorMessage?: string;
	label?: string;
	id?: string;
	name?: string;
	required?: boolean;
	type?: "text" | "number";
	autoFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	length: 6,
	disabled: false,
	error: false,
	errorMessage: "",
	label: "Verification code",
	id: "",
	name: "otp",
	required: false,
	type: "number",
	autoFocus: true,
});

const emit = defineEmits<{
	"update:modelValue": [value: string];
	complete: [value: string];
}>();

const otp = ref<string[]>(Array(props.length).fill(""));
const inputs = ref<Array<HTMLInputElement | null>>([]);
const inputId = computed(
	() => props.id || `otp-${Math.random().toString(36).substr(2, 9)}`,
);

const handleInput = (e: Event, index: number) => {
	const target = e.target as HTMLInputElement;
	let value = target.value;

	// Handle backspace
	if (e instanceof InputEvent && e.inputType === "deleteContentBackward") {
		if (index > 0 && !value) {
			inputs.value[index - 1]?.focus();
		}
		return;
	}

	// Handle paste
	if (value.length > 1) {
		const pastedValues = value.split("").slice(0, props.length - index);
		pastedValues.forEach((val, i) => {
			if (index + i < props.length) {
				otp.value[index + i] = val;
			}
		});

		const nextIndex = Math.min(index + pastedValues.length, props.length - 1);
		inputs.value[nextIndex]?.focus();

		emit("update:modelValue", otp.value.join(""));
		if (otp.value.every((val) => val)) {
			emit("complete", otp.value.join(""));
		}
		return;
	}

	// Handle single character input
	if (props.type === "number") {
		value = value.replace(/[^0-9]/g, "");
		if (!value) return;
	}

	otp.value[index] = value.charAt(value.length - 1);

	emit("update:modelValue", otp.value.join(""));

	if (otp.value.every((val) => val)) {
		emit("complete", otp.value.join(""));
	} else if (value && index < props.length - 1) {
		inputs.value[index + 1]?.focus();
	}
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
	const target = e.target as HTMLInputElement;

	// Handle left/right arrow keys
	if (e.key === "ArrowLeft" && index > 0) {
		e.preventDefault();
		inputs.value[index - 1]?.focus();
	} else if (e.key === "ArrowRight" && index < props.length - 1) {
		e.preventDefault();
		inputs.value[index + 1]?.focus();
	}
	// Handle backspace
	else if (e.key === "Backspace" && !target.value && index > 0) {
		otp.value[index - 1] = "";
		emit("update:modelValue", otp.value.join(""));
		inputs.value[index - 1]?.focus();
	}
};

const handlePaste = (e: ClipboardEvent) => {
	e.preventDefault();
	const pastedData = e.clipboardData?.getData("text/plain") || "";
	if (!pastedData) return;

	const pastedValues = pastedData.split("").slice(0, props.length);
	pastedValues.forEach((val, i) => {
		if (i < props.length) {
			otp.value[i] = props.type === "number" ? val.replace(/[^0-9]/g, "") : val;
		}
	});

	const nextIndex = Math.min(pastedValues.length, props.length - 1);
	inputs.value[nextIndex]?.focus();

	emit("update:modelValue", otp.value.join(""));
	if (otp.value.every((val) => val)) {
		emit("complete", otp.value.join(""));
	}
};

const focusFirstEmptyInput = () => {
	const firstEmptyIndex = otp.value.findIndex((val) => !val);
	const index = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
	inputs.value[index]?.focus();
};

onMounted(() => {
	if (props.autoFocus) {
		nextTick(() => {
			focusFirstEmptyInput();
		});
	}
});

const inputClasses = computed(() => ({
	"w-10 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent": true,
	"border-red-500": props.error,
	"border-gray-300 dark:border-gray-600": !props.error,
	"bg-gray-100 dark:bg-gray-700 cursor-not-allowed": props.disabled,
	"bg-white dark:bg-gray-800": !props.disabled,
	"text-gray-900 dark:text-gray-100": true,
	"transition duration-150 ease-in-out": true,
}));

defineOptions({
	name: "OtpInput",
});
</script>

<template>
  <div class="w-full space-y-3">
    <label v-if="label" :for="`${inputId}-0`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="flex items-center justify-center space-x-2">
      <template v-for="(_, index) in length" :key="index">
        <input
          :ref="el => { if (el) inputs[index] = el as HTMLInputElement }"
          v-model="otp[index]"
          :id="`${inputId}-${index}`"
          :name="`${name}-${index}`"
          :maxlength="index === length - 1 ? 1 : 1"
          :type="type"
          :disabled="disabled"
          :required="required"
          :class="inputClasses"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @input="(e) => handleInput(e, index)"
          @keydown="(e) => handleKeyDown(e, index)"
          @paste="handlePaste"
          @click="focusFirstEmptyInput"
        />
      </template>
    </div>
    
    <p v-if="error && errorMessage" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </p>
  </div>
</template>
