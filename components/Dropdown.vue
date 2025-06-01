<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  position?: 'left' | 'right';
}>();

const emit = defineEmits<(e: 'close') => void>();

const dropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);  
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const positionClasses = computed(() => ({
  'right-0': props.position === 'right',
  'left-0': !props.position || props.position === 'left',
}));
</script>

<template>
  <div v-if="isOpen" class="relative">
    <div 
      ref="dropdownRef"
      class="absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
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
