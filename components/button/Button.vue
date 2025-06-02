<script setup lang="ts">
import { computed } from "vue";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  icon: "",
  loading: false,
  disabled: false,
});

const buttonClasses = computed(() => {
  const base =
    "flex items-center justify-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const variants = {
    primary: "bg-brand hover:bg-brand/90 text-white focus:ring-brand",
    secondary: "bg-surface hover:bg-surface/80 text-text focus:ring-border",
    ghost: "hover:bg-surface text-text focus:ring-border",
    danger: "bg-error hover:bg-error/90 text-white focus:ring-error",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-base",
    lg: "px-4 py-2 text-lg",
  };

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`;
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
