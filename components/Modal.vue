<template>
  <Teleport to="body">
    <Transition name="fade" enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div 
        v-if="modelValue"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="$emit('update:modelValue', false)"
      >
        <div 
          class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
          :class="contentClass"
          @click.stop
        >
          <!-- Header Slot -->
          <div v-if="$slots.header" class="p-4 border-b">
            <slot name="header"></slot>
          </div>
          
          <!-- Default Slot (Body) -->
          <div class="flex-1 overflow-auto">
            <slot></slot>
          </div>
          
          <!-- Footer Slot -->
          <div v-if="$slots.footer" class="p-4 border-t">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  contentClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Handle escape key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('update:modelValue', false)
  }
}

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

// Cleanup event listener
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>
