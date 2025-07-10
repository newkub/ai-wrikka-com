import { ref, onMounted, onBeforeUnmount } from 'vue';

interface UseEditorOptions {
  initialContent?: string;
  onUpdate?: (content: string) => void;
}

export function useEditor(options: UseEditorOptions = {}) {
  const editor = ref<HTMLElement | null>(null);
  const isReady = ref(false);
  const content = ref(options.initialContent || '');

  const formatText = (format: string, value?: string) => {
    if (!editor.value) return;
    document.execCommand(format, false, value);
    updateContent();
  };

  const insertLink = (url: string, text: string = '') => {
    if (!editor.value) return;
    const link = `<a href="${url}" target="_blank">${text || url}</a> `;
    document.execCommand('insertHTML', false, link);
    updateContent();
  };

  const insertImage = (src: string, alt: string = '') => {
    if (!editor.value) return;
    const img = `<img src="${src}" alt="${alt}" style="max-width: 100%;">`;
    document.execCommand('insertHTML', false, img);
    updateContent();
  };

  const clearFormatting = () => {
    if (!editor.value) return;
    document.execCommand('removeFormat');
    updateContent();
  };

  const setContent = (newContent: string) => {
    if (!editor.value) return;
    editor.value.innerHTML = newContent;
    content.value = newContent;
  };

  const clearContent = () => {
    setContent('');
  };

  const isFormatActive = (format: string) => {
    if (!editor.value) return false;
    return document.queryCommandState(format);
  };

  const updateContent = () => {
    if (!editor.value) return;
    const newContent = editor.value.innerHTML;
    content.value = newContent;
    options.onUpdate?.(newContent);
  };

  onMounted(() => {
    if (editor.value) {
      editor.value.addEventListener('input', updateContent);
      isReady.value = true;
    }
  });

  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.removeEventListener('input', updateContent);
    }
  });

  return {
    editor,
    isReady,
    content,
    formatText,
    insertLink,
    insertImage,
    clearFormatting,
    setContent,
    clearContent,
    isFormatActive,
  };
}

export default useEditor;
