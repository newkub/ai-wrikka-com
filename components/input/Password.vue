<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from './Input.vue'

interface Props {
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  label?: string
  id?: string
  name?: string
  required?: boolean
  showStrength?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Enter your password',
  disabled: false,
  error: false,
  errorMessage: '',
  label: 'Password',
  id: '',
  name: 'password',
  required: false,
  showStrength: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const showPassword = ref(false)
const inputId = computed(() => props.id || `password-${Math.random().toString(36).substr(2, 9)}`)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const passwordStrength = computed(() => {
  if (!props.modelValue) return 0
  let strength = 0
  const value = String(props.modelValue)
  
  if (value.length >= 8) strength += 1
  if (/[A-Z]/.test(value)) strength += 1
  if (/[0-9]/.test(value)) strength += 1
  if (/[^A-Za-z0-9]/.test(value)) strength += 1
  
  return Math.min(4, strength)
})

const strengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'bg-red-500'
  if (strength === 2) return 'bg-yellow-500'
  if (strength === 3) return 'bg-blue-500'
  return 'bg-green-500'
})

defineOptions({
  name: 'PasswordInput'
})
</script>

<template>
  <div class="w-full space-y-2">
    <div class="relative">
      <Input
        :id="inputId"
        v-model="computedValue"
        :type="showPassword ? 'text' : 'password'"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error"
        :error-message="errorMessage"
        :label="label"
        :required="required"
        :autocomplete="name"
        class="pr-10"
      />
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        @click="togglePassword"
      >
        <i v-if="showPassword" class="i-mdi-eye-off text-xl" />
        <i v-else class="i-mdi-eye text-xl" />
      </button>
    </div>
    
    <div v-if="showStrength && modelValue" class="space-y-1">
      <div class="flex space-x-1">
        <div
          v-for="i in 4"
          :key="i"
          class="h-1 flex-1 rounded-full"
          :class="i <= passwordStrength ? strengthColor : 'bg-gray-200 dark:bg-gray-700'"
        />
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        <span v-if="passwordStrength <= 1">Weak</span>
        <span v-else-if="passwordStrength === 2">Fair</span>
        <span v-else-if="passwordStrength === 3">Good</span>
        <span v-else>Strong</span>
      </p>
    </div>
  </div>
</template>
