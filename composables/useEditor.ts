import { ref, onMounted, onBeforeUnmount } from 'vue';

interface EditorOptions {
  initialContent?: string;
  placeholder?: string;
  editable?: boolean;
  onUpdate?: (content: string) => void;
}

export function useEditor(options: EditorOptions = {}) {
  const content = ref<string>(options.initialContent || '');
  const htmlContent = ref<string>('');
  const _selection = ref<Range | null>(null);
  const isFocused = ref<boolean>(false);
  const editorRef = ref<HTMLElement | null>(null);

  // ฟังก์ชันสำหรับอัพเดท content
  const updateContent = (newContent: string) => {
    content.value = newContent;
    options.onUpdate?.(newContent);
  };

  // ฟังก์ชันสำหรับบันทึก selection ปัจจุบัน
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  // ฟังก์ชันสำหรับเรียกใช้ selection ที่บันทึกไว้
  const restoreSelection = (savedRange: Range | null) => {
    if (!savedRange) return;
    
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  };

  // ฟังก์ชันสำหรับใส่รูปแบบข้อความ
  const formatText = (tag: string, attributes: Record<string, string> = {}) => {
    const savedSelection = saveSelection();
    
    if (!savedSelection || !savedSelection.toString().trim()) {
      // ถ้าไม่ได้เลือกข้อความ ให้แทรกแท็กเปล่า
      const element = document.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
      
      const range = savedSelection || document.createRange();
      const node = document.createElement('span');
      node.appendChild(document.createTextNode('\u200B')); // Zero-width space
      range.insertNode(node);
      range.selectNodeContents(node);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      updateContent(editorRef.value?.innerHTML || '');
      return;
    }
    
    // สร้าง element ใหม่
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    
    // ครอบ selection ด้วย element ใหม่
    const range = savedSelection;
    const selectedContent = range.extractContents();
    element.appendChild(selectedContent);
    range.insertNode(element);
    
    // อัพเดท content
    updateContent(editorRef.value?.innerHTML || '');
    
    // คืนค่า selection
    restoreSelection(savedSelection);
  };

  // ฟังก์ชันสำหรับใส่ลิงก์
  const insertLink = (url: string, text?: string) => {
    const savedSelection = saveSelection();
    
    if (!savedSelection) return;
    
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    
    if (text) {
      a.textContent = text;
      savedSelection.insertNode(a);
    } else if (!savedSelection.collapsed) {
      const selectedContent = savedSelection.extractContents();
      a.appendChild(selectedContent);
      savedSelection.insertNode(a);
    } else {
      a.textContent = url;
      savedSelection.insertNode(a);
    }
    
    updateContent(editorRef.value?.innerHTML || '');
    restoreSelection(savedSelection);
  };

  // ฟังก์ชันสำหรับแทรกรูปภาพ
  const insertImage = (url: string, alt = '') => {
    const savedSelection = saveSelection();
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    if (savedSelection) {
      savedSelection.insertNode(img);
    } else if (editorRef.value) {
      editorRef.value.appendChild(img);
    }
    
    updateContent(editorRef.value?.innerHTML || '');
  };

  // ฟังก์ชันสำหรับล้างรูปแบบ
  const clearFormatting = () => {
    const savedSelection = saveSelection();
    if (!savedSelection) return;
    
    const range = savedSelection;
    const selectedContent = range.extractContents();
    
    // สร้าง element ใหม่ที่มีเฉพาะข้อความ
    const div = document.createElement('div');
    div.textContent = selectedContent.textContent;
    
    range.insertNode(div);
    updateContent(editorRef.value?.innerHTML || '');
    restoreSelection(savedSelection);
  };

  // ฟังก์ชันสำหรับตั้งค่า content
  const setContent = (newContent: string) => {
    content.value = newContent;
    if (editorRef.value) {
      editorRef.value.innerHTML = newContent;
    }
  };

  // ฟังก์ชันสำหรับล้าง content
  const clearContent = () => {
    content.value = '';
    if (editorRef.value) {
      editorRef.value.innerHTML = '';
    }
    options.onUpdate?.('');
  };

  // ฟังก์ชันสำหรับตรวจสอบว่า selection ปัจจุบันอยู่ในรูปแบบที่กำหนดหรือไม่
  const isFormatActive = (tagName: string, attributes: Record<string, string> = {}): boolean => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // ถ้าเป็น collapsed selection ตรวจสอบ parent element
      let parent = selection.anchorNode?.parentElement;
      while (parent && parent !== editorRef.value) {
        if (parent.tagName.toLowerCase() === tagName.toLowerCase()) {
          // ตรวจสอบ attributes
          return Object.entries(attributes).every(([key, value]) => 
            parent?.getAttribute(key) === value
          );
        }
        parent = parent.parentElement;
      }
      return false;
    }
    // สำหรับ non-collapsed selection ตรวจสอบว่า selection อยู่ใน element ที่ระบุหรือไม่
    const commonAncestor = range.commonAncestorContainer as HTMLElement;
    return commonAncestor.closest(tagName) !== null;
  };

  // Lifecycle hooks
  onMounted(() => {
    if (editorRef.value) {
      editorRef.value.innerHTML = content.value;
      
      // ตั้งค่า event listeners
      editorRef.value.addEventListener('input', () => {
        updateContent(editorRef.value?.innerHTML || '');
      });
      
      editorRef.value.addEventListener('focus', () => {
        isFocused.value = true;
      });
      
      editorRef.value.addEventListener('blur', () => {
        isFocused.value = false;
      });
      
      // บันทึก selection เมื่อมีการเปลี่ยนแปลง
      document.addEventListener('selectionchange', saveSelection);
    }
  });
  
  onBeforeUnmount(() => {
    // ลบ event listeners
    document.removeEventListener('selectionchange', saveSelection);
  });

  return {
    content,
    htmlContent,
    editorRef,
    isFocused,
    updateContent,
    formatText,
    insertLink,
    insertImage,
    clearFormatting,
    setContent,
    clearContent,
    isFormatActive,
    // Export functions for testing
    _saveSelection: saveSelection,
    _restoreSelection: restoreSelection,
  };
}
