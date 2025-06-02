<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  debounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue)
let timeout: ReturnType<typeof setTimeout> | null = null

const updateSearch = (value: string) => {
  if (timeout) clearTimeout(timeout)
  
  timeout = setTimeout(() => {
    emit('update:modelValue', value)
  }, props.debounce)
}

watch(() => props.modelValue, (newVal) => {
  searchQuery.value = newVal
})
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <div class="i-mdi-magnify text-gray-400" />
    </div>
    <input
      v-model="searchQuery"
      type="text"
      class="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      :placeholder="placeholder"
      @input="updateSearch(($event.target as HTMLInputElement).value)"
    >
  </div>
</template>