<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String as () => 'primary' | 'secondary' | 'ghost' | 'danger',
    default: 'primary'
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'md'
  },
  icon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const buttonClasses = computed(() => {
  const base = 'flex items-center justify-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-700 dark:text-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-1.5 text-base',
    lg: 'px-4 py-2 text-lg'
  };
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
});
</script>

<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <div 
      v-if="icon && !loading" 
      :class="icon" 
      class="h-5 w-5"
    />
    <div 
      v-if="loading" 
      class="i-mdi-loading h-5 w-5 animate-spin"
    />
    <span v-if="$slots.default" class="ml-2">
      <slot />
    </span>
  </button>
</template>
