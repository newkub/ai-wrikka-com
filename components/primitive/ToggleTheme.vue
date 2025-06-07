<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

const toggleTheme = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <button
    type="button"
    class="p-2 text-2xl focus:outline-none"
    @click="toggleTheme"
    :aria-label="modelValue ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <div v-if="modelValue" class="i-mdi-weather-night text-gray-700 dark:text-gray-300" />
    <div v-else class="i-mdi-weather-sunny text-yellow-500" />
  </button>
</template>
