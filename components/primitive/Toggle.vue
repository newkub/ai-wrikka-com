
<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<(e: 'update:modelValue', value: boolean) => void>();
</script>


<template>
  <button
    type="button"
    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    :class="{
      'bg-color-primary': modelValue,
      'bg-block': !modelValue
    }"
    @click="$emit('update:modelValue', !modelValue)"
  >

    <span
      class="inline-block h-5 w-5 transform rounded-full bg-background shadow-md transition-transform"
      :class="{
        'translate-x-6': modelValue,
        'translate-x-1': !modelValue
      }"
    >
      <div
        v-if="modelValue"
        class="flex h-full w-full items-center justify-center"
      >
        <div class="i-mdi-weather-sunny text-color-alert" />
      </div>
      <div v-else class="flex h-full w-full items-center justify-center">
        <div class="i-mdi-weather-night text-color-secondary" />
      </div>
    </span>
  </button>
</template>
