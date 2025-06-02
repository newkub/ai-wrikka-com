<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div 
            class="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl"
            :class="contentClass"
            @click.stop
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <!-- Header Slot -->
            <div v-if="$slots.header || title" class="p-4 border-b border-border">
              <slot name="header">
                <div class="flex items-center justify-between">
                  <h3 v-if="title" :id="titleId" class="text-lg font-medium text-text">
                    {{ title }}
                  </h3>
                  <button 
                    v-if="showCloseButton"
                    @click="$emit('update:modelValue', false)" 
                    class="text-text/50 hover:text-text/70 focus:outline-none transition-colors"
                    aria-label="Close"
                  >
                    <div class="i-mdi-close h-6 w-6" />
                  </button>
                </div>
              </slot>
            </div>
            
            <!-- Default Slot (Body) -->
            <div class="flex-1 overflow-auto" :class="{ 'p-6': !noPadding }">
              <slot></slot>
            </div>
            
            <!-- Footer Slot -->
            <div v-if="$slots.footer" class="p-4 border-t border-border bg-surface/50">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, toRef } from 'vue';
import { useModal } from '~/composables/useModal';

interface ModalProps {
  modelValue: boolean;
  contentClass?: string;
  title?: string;
  titleId?: string;
  showCloseButton?: boolean;
  noPadding?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  contentClass: '',
  title: '',
  titleId: 'modal-title',
  showCloseButton: true,
  noPadding: false,
});

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

const modalRef = ref<HTMLElement | null>(null);

const { isOpen, close } = useModal({
  isOpen: toRef(props, 'modelValue'),
  onClose: () => emit('update:modelValue', false),
});

const handleClose = () => {
  close();
};
</script>
