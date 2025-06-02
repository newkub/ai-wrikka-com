<script setup lang="ts">
import { computed } from 'vue'

export interface TextAreaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  label?: string
  id?: string
  name?: string
  required?: boolean
  rows?: number
  maxlength?: number
  autogrow?: boolean
}

const props = withDefaults(defineProps<TextAreaProps>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  error: false,
  errorMessage: '',
  label: '',
  id: '',
  name: '',
  required: false,
  rows: 3,
  maxlength: undefined,
  autogrow: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputId = computed(() => props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`)

const textareaClasses = computed(() => ({
  'w-full px-3 py-2 border rounded-md focus:outline-none': true,
  'border-red-500': props.error,
  'border-gray-300 dark:border-gray-600': !props.error,
  'bg-gray-100 dark:bg-gray-700 cursor-not-allowed': props.disabled,
  'bg-white dark:bg-gray-800': !props.disabled,
  'focus:ring-2 focus:ring-primary-500 focus:border-transparent': !props.error,
  'focus:ring-red-500 focus:border-transparent': props.error,
  'text-gray-900 dark:text-gray-100': true,
  'placeholder-gray-400 dark:placeholder-gray-500': true,
  'transition duration-150 ease-in-out': true,
  'resize-none': !props.autogrow
}))

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  if (props.autogrow) {
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }
}

defineOptions({
  name: 'TextArea'
})
</script>

<template>
  <div class="w-full space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <textarea
        :id="inputId"
        v-model="computedValue"
        :name="name || inputId"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxlength"
        :rows="!autogrow ? rows : 1"
        :class="textareaClasses"
        class="w-full px-3 py-2 border rounded-md focus:outline-none"
        @input="handleInput"
      />
      <span 
        v-if="maxlength" 
        class="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400"
      >
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </span>
    </div>
    <p v-if="error && errorMessage" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </p>
  </div>
</template>
