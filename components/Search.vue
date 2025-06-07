<template>
  <div class="mb-6">
    <div class="relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2 bg-block border border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <div class="absolute right-3 top-2.5 text/50">
        <i class="i-mdi-magnify text-xl"></i>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
