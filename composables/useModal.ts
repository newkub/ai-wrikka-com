import { ref, onMounted, onUnmounted } from 'vue';

interface UseModalOptions {
  isOpen?: Ref<boolean>;
  onClose?: () => void;
}

export function useModal(options?: UseModalOptions) {
  const isOpen = ref(false);
  const modalRef = ref<HTMLElement | null>(null);

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

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
      close();
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
  });

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';
  });

  return {
    isOpen,
    modalRef,
    open,
    close,
    toggle
  };
}
