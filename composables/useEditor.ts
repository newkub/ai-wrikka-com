import { ref, watch } from 'vue';
import type * as monaco from 'monaco-editor';
import type { editor } from 'monaco-editor';
type IStandaloneCodeEditor = editor.IStandaloneCodeEditor

export interface EditorTab {
  id: string;
  label: string;
  icon: string;
  content?: string;
  language?: string;
  isDirty?: boolean;
}

export interface EditorOptions {
  theme?: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  minimap?: {
    enabled: boolean;
  };
  readOnly?: boolean;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
}

export function useEditor(initialContent = '', options: EditorOptions = {}) {
  const editorContent = ref(initialContent);
  const isEditorReady = ref(false);
  const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  const editorOptions = ref({
    theme: 'vs-dark',
    lineNumbers: 'on',
    minimap: { enabled: true },
    readOnly: false,
    wordWrap: 'on',
    ...options
  });

  const tabs = ref<EditorTab[]>([
    {
      id: 'code',
      label: 'Code',
      icon: 'i-mdi-code-tags',
      language: 'typescript',
      content: initialContent
    },
    {
      id: 'browser',
      label: 'Browser',
      icon: 'i-mdi-web'
    }
  ]);

  const activeTabId = ref(tabs.value[0]?.id || '');

  const setActiveTab = (tabId: string) => {
    activeTabId.value = tabId;
  };

  const updateContent = (newContent: string) => {
    editorContent.value = newContent;
    const activeTab = tabs.value.find(tab => tab.id === activeTabId.value);
    if (activeTab) {
      activeTab.content = newContent;
      activeTab.isDirty = true;
    }
  };

  const getActiveTab = () => {
    return tabs.value.find(tab => tab.id === activeTabId.value);
  };

  const addTab = (tab: Omit<EditorTab, 'isDirty'>) => {
    if (!tabs.value.some(t => t.id === tab.id)) {
      tabs.value.push({ ...tab, isDirty: false });
    }
    setActiveTab(tab.id);
  };

  const closeTab = (tabId: string) => {
    const index = tabs.value.findIndex(tab => tab.id === tabId);
    if (index !== -1 && tabs.value.length > 1) {
      tabs.value.splice(index, 1);
      if (activeTabId.value === tabId) {
        setActiveTab(tabs.value[Math.max(0, index - 1)].id);
      }
    }
  };

  const onEditorMounted = (editor: IStandaloneCodeEditor) => {
    editorInstance.value = editor;
    isEditorReady.value = true;
  };

  watch(editorContent, (newVal) => {
    const activeTab = getActiveTab();
    if (activeTab && activeTab.content !== newVal) {
      activeTab.content = newVal;
      activeTab.isDirty = true;
    }
  });

  watch(activeTabId, (newTabId) => {
    const tab = tabs.value.find(t => t.id === newTabId);
    if (tab?.content !== undefined) {
      editorContent.value = tab.content || '';
    }
  });

  return {
    editorContent,
    editorOptions,
    tabs,
    activeTabId,
    isEditorReady,
    editorInstance,
    setActiveTab,
    updateContent,
    getActiveTab,
    addTab,
    closeTab,
    onEditorMounted
  };
}

export type UseEditorReturn = ReturnType<typeof useEditor>;
