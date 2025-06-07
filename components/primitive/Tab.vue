<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  tabs: {
    id: string | number;
    label: string;
    icon?: string;
  }[];
  modelValue: string | number;
  fullWidth?: boolean;
  variant?: 'underline' | 'pills';
  size?: 'sm' | 'md' | 'lg';
}>(), {
  fullWidth: false,
  variant: 'underline',
  size: 'md',
});

const emit = defineEmits(['update:modelValue']);

const tabSizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const isActive = (tabId: string | number) => props.modelValue === tabId;

const tabClasses = (tabId: string | number) => ({
  'flex items-center justify-center whitespace-nowrap border-b-2 font-medium text-sm': true,
  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': !isActive(tabId),
  'border-color-primary text-color-primary': isActive(tabId) && props.variant === 'underline',
  'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white': isActive(tabId) && props.variant === 'pills',
  'rounded-t-lg': props.variant === 'pills',
  'w-full': props.fullWidth,
  [tabSizes[props.size]]: true,
});

const handleTabClick = (tabId: string | number) => {
  emit('update:modelValue', tabId);
};
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="flex -mb-px" :class="{ 'space-x-1': variant === 'pills' }" aria-label="Tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="tabClasses(tab.id)"
        @click="handleTabClick(tab.id)"
      >
        <i v-if="tab.icon" :class="[tab.icon, 'mr-2 h-4 w-4']" />
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>
