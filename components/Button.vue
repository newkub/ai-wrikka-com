<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      variant === 'primary' && 'bg-color-primary text-background hover:opacity-90 focus:ring-color-primary',
      variant === 'secondary' && 'bg-background text-text border border-border hover:bg-block focus:ring-color-primary',
      variant === 'danger' && 'bg-color-error text-background hover:opacity-90 focus:ring-color-error',
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'lg' && 'px-6 py-3 text-base',
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <div v-if="icon && iconPosition === 'left'" class="mr-2">
      <div :class="icon" />
    </div>
    <slot />
    <div v-if="icon && iconPosition === 'right'" class="ml-2">
      <div :class="icon" />
    </div>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  iconPosition: 'left'
});

defineEmits<(e: 'click', event: MouseEvent) => void>();
</script>
