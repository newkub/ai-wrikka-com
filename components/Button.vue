<script setup lang="ts">
withDefaults(
	defineProps<{
		variant?: "primary" | "secondary" | "danger";
		size?: "sm" | "md" | "lg";
		type?: "button" | "submit" | "reset";
		disabled?: boolean;
		icon?: string;
		iconPosition?: "left" | "right";
	}>(),
	{
		variant: "primary",
		size: "md",
		type: "button",
		disabled: false,
		iconPosition: "left",
	},
);

defineEmits<(e: "click", event: MouseEvent) => void>();
</script>


<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2"
    :class="[
      {
        'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500': variant === 'primary',
        'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500': variant === 'secondary',
        'bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-500': variant === 'danger',
        'opacity-50 cursor-not-allowed': disabled,
      },
      {
        'px-2 py-1 text-xs': size === 'sm',
        'px-4 py-2 text-sm': size === 'md',
        'px-6 py-3 text-base': size === 'lg',
      },
      {
        'flex-row-reverse': iconPosition === 'right',
      },
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