import { ref } from 'vue';

export function useModal(initialValue = false) {
  const isOpen = ref(initialValue);

  const open = () => {
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen.value = false;
    document.body.style.overflow = '';
  };

  const toggle = () => {
    isOpen.value ? close() : open();
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
