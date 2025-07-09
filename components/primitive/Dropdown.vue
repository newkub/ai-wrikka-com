<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

defineProps<{
	align?: "left" | "right";
	width?: "48" | "56" | "64" | "auto";
}>();

const open = ref(false);
const dropdown = ref<HTMLElement | null>(null);

const widthClass = {
	"48": "w-48",
	"56": "w-56",
	"64": "w-64",
	auto: "w-auto",
};

const alignClasses = {
	left: "left-0",
	right: "right-0",
};

const closeOnEscape = (e: KeyboardEvent) => {
	if (open.value && e.key === "Escape") {
		open.value = false;
	}
};

const closeOnClickOutside = (event: MouseEvent) => {
	if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
		open.value = false;
	}
};

onMounted(() => {
	document.addEventListener("keydown", closeOnEscape);
	document.addEventListener("click", closeOnClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("keydown", closeOnEscape);
	document.removeEventListener("click", closeOnClickOutside);
});
</script>

<template>
  <div class="relative" ref="dropdown">
    <div @click="open = !open">
      <slot name="trigger" :open="open" />
    </div>

    <!-- Full Screen Dropdown Overlay -->
    <div v-show="open" class="fixed inset-0 z-40" />

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="open"
        class="absolute z-50 mt-2 rounded-md shadow-lg"
        :class="[width ? widthClass[width] : widthClass['48'], align ? alignClasses[align] : alignClasses.right]"
        @click="open = false"
      >
        <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>
