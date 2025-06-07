<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
  icon: '',
  iconPosition: 'left',
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => {
  const base = [
    'inline-flex items-center justify-center font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    props.fullWidth ? 'w-full' : '',
  ];

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-color-primary text-white hover:opacity-90 focus:ring-color-primary',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-color-primary dark:border-gray-600 dark:text-white dark:hover:bg-gray-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-color-primary dark:text-white dark:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    link: 'bg-transparent text-color-primary hover:underline focus:ring-color-primary',
  };

  return [
    ...base,
    sizes[props.size],
    variants[props.variant],
    props.loading ? 'opacity-70 cursor-not-allowed' : '',
  ];
});

const iconClasses = computed(() => ({
  'mr-2': props.iconPosition === 'left' && !props.loading,
  'ml-2': props.iconPosition === 'right' && !props.loading,
  'h-4 w-4': true,
}));

const handleClick = (e: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', e);
  }
};
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <template v-if="loading">
      <i class="i-svg-spinners-90-ring-with-bg animate-spin mr-2 h-4 w-4" />
      <span><slot name="loading">Processing...</slot></span>
    </template>
    <template v-else>
      <i v-if="icon && iconPosition === 'left'" :class="[icon, iconClasses]" />
      <span><slot /></span>
      <i v-if="icon && iconPosition === 'right'" :class="[icon, iconClasses]" />
    </template>
  </button>
</template>
