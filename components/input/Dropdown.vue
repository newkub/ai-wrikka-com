<script setup lang="ts">
import { computed } from 'vue';
import { useDropdown } from '~/composables/useDropdown';

const props = defineProps<{
  isOpen: boolean;
  position?: "left" | "right";
}>();

const emit = defineEmits<{
  close: [];
}>();

const { dropdownRef, close } = useDropdown();

// Sync with parent component's isOpen state
const handleClose = () => {
  close();
  emit('close');
};

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
		emit("close");
	}
};

onMounted(() => {
	document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("mousedown", handleClickOutside);
});

const positionClasses = computed(() => ({
	"right-0": props.position === "right",
	"left-0": !props.position || props.position === "left",
}));
</script>

<template>
  <div v-if="isOpen" class="relative">
    <div 
      ref="dropdownRef"
      class="absolute mt-2 w-48 rounded-md shadow-lg bg-surface ring-1 ring-border ring-opacity-5 focus:outline-none z-50"
      :class="[positionClasses]"
      role="menu"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <slot />
      </div>
    </div>
  </div>
</template>
