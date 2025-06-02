<script setup lang="ts">
import { computed } from 'vue'

export interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'tel' | 'number' | 'search' | 'password'
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  label?: string
  id?: string
  name?: string
  required?: boolean
  autocomplete?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  errorMessage: '',
  label: '',
  id: '',
  name: '',
  required: false,
  autocomplete: 'off'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => ({
  'w-full px-3 py-2 border rounded-md': true,
  'border-red-500': props.error,
  'border-gray-300 dark:border-gray-600': !props.error,
  'bg-gray-100 dark:bg-gray-700 cursor-not-allowed': props.disabled,
  'bg-white dark:bg-gray-800': !props.disabled,
  'focus:ring-2 focus:ring-primary-500 focus:border-transparent': !props.error,
  'focus:ring-red-500 focus:border-transparent': props.error,
  'text-gray-900 dark:text-gray-100': true,
  'placeholder-gray-400 dark:placeholder-gray-500': true,
  'transition duration-150 ease-in-out': true
}))

defineOptions({
  name: 'Input'
})
</script>

<template>
  <div class="w-full space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      v-model="computedValue"
      :type="type"
      :name="name || inputId"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :class="inputClasses"
      class="w-full px-3 py-2 border rounded-md focus:outline-none"
    >
    <p v-if="error && errorMessage" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </p>
  </div>
</template>
