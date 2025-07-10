<script setup lang="ts">
import { computed, ref } from "vue";
import CodeEditor from "~/components/code/CodeEditor.vue";
import FileStructure from "~/components/code/FileStructure.vue";
import LeftPanel from "~/components/code/left/index.vue";
import Preview from "~/components/code/Browser.vue";
import { useFileSystem } from "~/composables/useFileSystem";

interface RawFileItem {
	name: string;
	type: "file" | "directory";
	id?: string;
	isOpen?: boolean;
	children?: RawFileItem[];
	path?: string;
}

interface FileItem {
	id: string;
	name: string;
	type: "file" | "folder";
	isSelected: boolean;
	isEditing: boolean;
	isOpen?: boolean;
	path?: string;
	children?: FileItem[];
}

// File system logic
const {
	activeFile,
	fileStructure,
	handleFileSelect: handleFileSelectOriginal,
} = useFileSystem();

// Mock file structure data
fileStructure.value = [
	{
		id: crypto.randomUUID(),
		name: "src",
		type: "folder",
		isOpen: true,
		children: [
			{
				id: crypto.randomUUID(),
				name: "components",
				type: "folder",
				children: [
					{
						id: crypto.randomUUID(),
						name: "Button.vue",
						type: "file",
						isSelected: false,
						isEditing: false,
					},
					{
						id: crypto.randomUUID(),
						name: "Card.vue",
						type: "file",
						isSelected: false,
						isEditing: false,
					},
				],
			},
			{
				id: crypto.randomUUID(),
				name: "pages",
				type: "folder",
				children: [
					{
						id: crypto.randomUUID(),
						name: "index.vue",
						type: "file",
						isSelected: false,
						isEditing: false,
					},
					{
						id: crypto.randomUUID(),
						name: "about.vue",
						type: "file",
						isSelected: false,
						isEditing: false,
					},
				],
			},
			{
				id: crypto.randomUUID(),
				name: "main.js",
				type: "file",
				isSelected: false,
				isEditing: false,
			},
		],
	},
	{
		id: crypto.randomUUID(),
		name: "package.json",
		type: "file",
		isSelected: false,
		isEditing: false,
	},
	{
		id: crypto.randomUUID(),
		name: "README.md",
		type: "file",
		isSelected: false,
		isEditing: false,
	},
];

// Prepare file structure data with required id
const preparedFileStructure = computed<FileItem[]>(() => {
	const convertType = (item: RawFileItem): FileItem => {
		const baseItem = item;
		const convertedItem: FileItem = {
			id: baseItem.id || `file-${crypto.randomUUID()}`,
			name: baseItem.name,
			type: baseItem.type === "directory" ? "folder" : "file",
			isSelected: baseItem.name === activeFile.value,
			isEditing: false,
			isOpen: baseItem.isOpen,
			path: baseItem.path,
		};

		if (baseItem.children) {
			convertedItem.children = baseItem.children.map((child) => ({
				...convertType(child),
				id: child.id || `file-${crypto.randomUUID()}`,
			}));
		}

		return convertedItem;
	};

	return (fileStructure.value as RawFileItem[]).map(convertType);
});

// Code editor state
const code = ref(
	'// Welcome to Code Editor\n// Start coding here...\n\nfunction helloWorld() {\n  console.log("Hello, World!");\n}\n\nhelloWorld();',
);
const chatInput = ref("");
const editorTheme = "vs";

// Handle file selection with code update
const handleFileSelect = (fileName: string) => {
	const fileContent = handleFileSelectOriginal(fileName);
	if (fileContent) {
		code.value = fileContent;
	}
};

// Handle code changes
const handleCodeUpdate = (newCode: string) => {
	code.value = newCode;
};

// Resize logic
const {
	leftPanelWidth,
	editorHeight,
	startVerticalResize,
	startHorizontalResize,
} = useResize();

// Theme - Using system preference
const isDark = ref(false);
// Note: Dark mode is now handled by CSS variables in uno.config.ts
</script>

<template>
  <div class="flex h-screen">
    <!-- Left Panel -->
    <LeftPanel />

    <!-- Right Panel -->
    <div class="flex flex-col flex-1 h-full">
      <!-- Top Section (50%) -->
      <div class="h-[50%] flex">
        <FileStructure 
          :modelValue="preparedFileStructure"
          @fileSelect="handleFileSelect"
          class="w-64 border-r"
        />
        <CodeEditor 
          v-model="code"
          :theme="editorTheme"
          :is-dark="isDark"
          @update:modelValue="handleCodeUpdate"
          class="flex-1"
        />
      </div>

      <!-- Bottom Section (50%) -->
      <div class="h-[50%] border-t">
        <Preview />
      </div>
    </div>
  </div>
</template>

<style>
/* Custom scrollbar for file explorer */
:global(::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:global(::-webkit-scrollbar-track) {
  background: transparent;
}

:global(::-webkit-scrollbar-thumb) {
  background: var(--border);
  border-radius: 3px;
}
</style>