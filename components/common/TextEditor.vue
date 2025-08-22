<template>
  <div class="editor-container border border-gray-300 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="toolbar bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <!-- Text Formatting -->
      <button 
        @click="formatText('strong')" 
        :class="{ 'bg-gray-200': isFormatActive('strong') }"
        class="p-2 rounded hover:bg-gray-100"
        title="ตัวหนา (Ctrl+B)"
      >
        <span class="font-bold">B</span>
      </button>
      
      <button 
        @click="formatText('em')" 
        :class="{ 'bg-gray-200': isFormatActive('em') }"
        class="p-2 rounded hover:bg-gray-100"
        title="ตัวเอียง (Ctrl+I)"
      >
        <em>I</em>
      </button>
      
      <button 
        @click="formatText('u')" 
        :class="{ 'bg-gray-200': isFormatActive('u') }"
        class="p-2 rounded hover:bg-gray-100"
        title="ขีดเส้นใต้ (Ctrl+U)"
      >
        <u>U</u>
      </button>
      
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      
      <!-- Headings -->
      <select 
        v-model="selectedHeading" 
        @change="applyHeading"
        class="p-1 text-sm rounded border border-gray-300 bg-white"
        title="หัวข้อ"
      >
        <option value="">ข้อความปกติ</option>
        <option value="h1">หัวข้อ 1</option>
        <option value="h2">หัวข้อ 2</option>
        <option value="h3">หัวข้อ 3</option>
      </select>
      
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      
      <!-- Lists -->
      <button 
        @click="formatText('ul')" 
        class="p-2 rounded hover:bg-gray-100"
        title="รายการสัญลักษณ์"
      >
        <div class="i-mdi-format-list-bulleted"></div>
      </button>
      
      <button 
        @click="formatText('ol')" 
        class="p-2 rounded hover:bg-gray-100"
        title="รายการตัวเลข"
      >
        <div class="i-mdi-format-list-numbered"></div>
      </button>
      
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      
      <!-- Link -->
      <button 
        @click="showLinkInput = !showLinkInput" 
        :class="{ 'bg-gray-200': showLinkInput }"
        class="p-2 rounded hover:bg-gray-100"
        title="แทรกลิงก์"
      >
        <div class="i-mdi-link"></div>
      </button>
      
      <!-- Image -->
      <button 
        @click="showImageInput = !showImageInput" 
        class="p-2 rounded hover:bg-gray-100"
        title="แทรกรูปภาพ"
      >
        <div class="i-mdi-image"></div>
      </button>
      
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      
      <!-- Clear Formatting -->
      <button 
        @click="clearFormatting" 
        class="p-2 rounded hover:bg-gray-100"
        title="ล้างรูปแบบ"
      >
        <div class="i-mdi-format-clear"></div>
      </button>
      
      <!-- Link Input -->
      <div v-if="showLinkInput" class="absolute bg-white p-2 border rounded shadow-lg z-10 mt-8">
        <input 
          v-model="linkUrl" 
          type="text" 
          placeholder="URL" 
          class="p-1 border rounded text-sm w-48"
          @keyup.enter="insertLinkFromInput"
        >
        <div class="flex justify-end mt-2">
          <button 
            @click="showLinkInput = false" 
            class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
          >
            ยกเลิก
          </button>
          <button 
            @click="insertLinkFromInput" 
            class="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ตกลง
          </button>
        </div>
      </div>
      
      <!-- Image Input -->
      <div v-if="showImageInput" class="absolute bg-white p-2 border rounded shadow-lg z-10 mt-8">
        <input 
          v-model="imageUrl" 
          type="text" 
          placeholder="URL รูปภาพ" 
          class="p-1 border rounded text-sm w-48 mb-2"
        >
        <input 
          v-model="imageAlt" 
          type="text" 
          placeholder="คำอธิบายรูปภาพ" 
          class="p-1 border rounded text-sm w-48"
          @keyup.enter="insertImageFromInput"
        >
        <div class="flex justify-end mt-2">
          <button 
            @click="showImageInput = false" 
            class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
          >
            ยกเลิก
          </button>
          <button 
            @click="insertImageFromInput" 
            class="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            แทรก
          </button>
        </div>
      </div>
    </div>
    
    <!-- Editor Content -->
    <div 
      ref="editorRef" 
      :contenteditable="editable" 
      :class="[
        'editor-content min-h-[200px] p-4 outline-none',
        { 'bg-gray-50': !editable }
      ]"
      :placeholder="placeholder"
      @paste="handlePaste"
      @keydown.ctrl.b.prevent="formatText('strong')"
      @keydown.ctrl.i.prevent="formatText('em')"
      @keydown.ctrl.u.prevent="formatText('u')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useEditor } from "~/composables/useEditor";

interface Props {
	modelValue?: string;
	editable?: boolean;
	placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	editable: true,
	placeholder: "พิมพ์ข้อความที่นี่...",
});

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

// Editor state
const editorRef = ref<HTMLElement | null>(null);
const showLinkInput = ref(false);
const showImageInput = ref(false);
const linkUrl = ref("");
const imageUrl = ref("");
const imageAlt = ref("");
const selectedHeading = ref("");

// Initialize editor
const {
	editor,
	isReady,
	formatText,
	insertLink,
	insertImage,
	clearFormatting,
	setContent,
	clearContent,
	isFormatActive,
} = useEditor({
	initialContent: props.modelValue,
	onUpdate: (newContent: string) => {
		emit("update:modelValue", newContent);
	},
});

// Watch for external modelValue changes
watch(
	() => props.modelValue,
	(newValue: string) => {
		if (newValue !== editor.value?.innerHTML) {
			setContent(newValue);
		}
	},
	{ immediate: true },
);

// Apply heading
const applyHeading = () => {
	if (selectedHeading.value) {
		formatText(selectedHeading.value);
	} else {
		// If normal text, wrap in a div to clear heading
		formatText("div");
	}
	selectedHeading.value = "";
};

// Insert link from input
const insertLinkFromInput = () => {
	if (linkUrl.value) {
		insertLink(linkUrl.value);
		linkUrl.value = "";
		showLinkInput.value = false;
	}
};

// Insert image from input
const insertImageFromInput = () => {
	if (imageUrl.value) {
		insertImage(imageUrl.value, imageAlt.value);
		imageUrl.value = "";
		imageAlt.value = "";
		showImageInput.value = false;
	}
};

// Handle paste event to clean up content
const handlePaste = (e: ClipboardEvent) => {
	e.preventDefault();

	// Get pasted text
	const text = e.clipboardData?.getData("text/plain") || "";

	// Clean up HTML if needed
	const cleanText = text
		.replace(/<[^>]*>/g, "") // Remove HTML tags
		.replace(/\s+/g, " ") // Replace multiple spaces with single space
		.trim();

	// Insert text at cursor position
	document.execCommand("insertText", false, cleanText);
};

// Expose methods
defineExpose({
	clearContent,
	getContent: () => editor.value?.innerHTML || "",
	setContent,
});
</script>

<style scoped>
.editor-content:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
  display: block;
}

/* Basic styling for the editor content */
:deep(.editor-content) {
  line-height: 1.6;
}

:deep(.editor-content h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

:deep(.editor-content h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.83em 0;
}

:deep(.editor-content h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 1em 0;
}

:deep(.editor-content ul),
:deep(.editor-content ol) {
  margin: 1em 0;
  padding-left: 2em;
}

:deep(.editor-content ul) {
  list-style-type: disc;
}

:deep(.editor-content ol) {
  list-style-type: decimal;
}

:deep(.editor-content a) {
  color: #2563eb;
  text-decoration: underline;
}

:deep(.editor-content a:hover) {
  color: #1d4ed8;
}

:deep(.editor-content img) {
  max-width: 100%;
  height: auto;
  margin: 0.5em 0;
  border-radius: 0.25rem;
}
</style>
