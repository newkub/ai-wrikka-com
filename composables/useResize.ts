import { ref, onUnmounted } from 'vue';

export function useResize() {
  const isResizing = ref(false);
  const startX = ref(0);
  const startY = ref(0);
  const startLeftWidth = ref(0);
  const startEditorHeight = ref(0);
  const leftPanelWidth = ref('33%');
  const editorHeight = ref('70%');

  // Vertical resize handlers
  const startVerticalResize = (e: MouseEvent) => {
    isResizing.value = true;
    startX.value = e.clientX;
    startLeftWidth.value = document.querySelector('.left-panel')?.getBoundingClientRect().width || 0;
    document.addEventListener('mousemove', handleVerticalMouseMove);
    document.addEventListener('mouseup', stopVerticalResize);
  };

  const handleVerticalMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return;
    
    const container = document.querySelector('.main-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const dx = e.clientX - startX.value;
    const newWidth = ((startLeftWidth.value + dx) / containerRect.width) * 100;
    
    // Limit min and max width (20% to 60%)
    if (newWidth >= 20 && newWidth <= 60) {
      leftPanelWidth.value = `${newWidth}%`;
    }
  };

  const stopVerticalResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', handleVerticalMouseMove);
    document.removeEventListener('mouseup', stopVerticalResize);
  };

  // Horizontal resize handlers
  const startHorizontalResize = (e: MouseEvent) => {
    isResizing.value = true;
    startY.value = e.clientY;
    startEditorHeight.value = document.querySelector('.editor-container')?.getBoundingClientRect().height || 0;
    document.addEventListener('mousemove', handleHorizontalMouseMove);
    document.addEventListener('mouseup', stopHorizontalResize);
  };

  const handleHorizontalMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return;
    
    const container = document.querySelector('.right-panel') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const dy = e.clientY - startY.value;
    const newHeight = ((startEditorHeight.value + dy) / containerRect.height) * 100;
    
    // Limit min and max height (30% to 90%)
    if (newHeight >= 30 && newHeight <= 90) {
      editorHeight.value = `${newHeight}%`;
    }
  };

  const stopHorizontalResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', handleHorizontalMouseMove);
    document.removeEventListener('mouseup', stopHorizontalResize);
  };

  // Clean up event listeners
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleVerticalMouseMove);
    document.removeEventListener('mouseup', stopVerticalResize);
    document.removeEventListener('mousemove', handleHorizontalMouseMove);
    document.removeEventListener('mouseup', stopHorizontalResize);
  });

  return {
    isResizing,
    leftPanelWidth,
    editorHeight,
    startVerticalResize,
    startHorizontalResize,
  };
}
