<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";

export interface FileItem {
	id: string;
	name: string;
	type: "file" | "folder";
	children?: FileItem[];
	isOpen?: boolean;
	isEditing?: boolean;
	isSelected?: boolean;
	path?: string;
}

const props = defineProps<{
	modelValue: FileItem[];
}>();

const emit = defineEmits([
	"update:modelValue",
	"fileSelect",
	"fileRename",
	"fileDelete",
	"fileCreate",
]);

const searchQuery = ref("");
const contextMenu = ref({
	show: false,
	x: 0,
	y: 0,
	item: null as FileItem | null,
});

const filteredItems = computed(() => {
	if (!searchQuery.value) return props.modelValue;

	const searchLower = searchQuery.value.toLowerCase();
	const filterItems = (items: FileItem[]): FileItem[] => {
		return items
			.map((item) => ({ ...item }))
			.filter((item) => {
				if (item.name.toLowerCase().includes(searchLower)) return true;
				if (item.children) {
					const filteredChildren = filterItems(item.children);
					item.children = filteredChildren;
					return filteredChildren.length > 0;
				}
				return false;
			});
	};

	return filterItems([...props.modelValue]);
});

const toggleFolder = (item: FileItem) => {
	if (item.type === "folder") {
		item.isOpen = !item.isOpen;
		emit("update:modelValue", [...props.modelValue]);
	} else {
		selectItem(item);
	}
};

const selectItem = (item: FileItem) => {
	// Reset selection
	const resetSelection = (items: FileItem[]) => {
		items.forEach((i) => {
			i.isSelected = false;
			if (i.children) resetSelection(i.children);
		});
	};

	resetSelection(props.modelValue);
	item.isSelected = true;
	emit("fileSelect", item);
};

const showContextMenu = (e: MouseEvent, item: FileItem) => {
	e.preventDefault();
	contextMenu.value = {
		show: true,
		x: e.clientX,
		y: e.clientY,
		item,
	};
};

const hideContextMenu = () => {
	contextMenu.value.show = false;
};

const startRename = (item: FileItem) => {
	item.isEditing = true;
	hideContextMenu();

	// Focus the input after it's rendered
	nextTick(() => {
		const input = document.querySelector(
			`#rename-${item.id}`,
		) as HTMLInputElement;
		if (input) {
			input.focus();
			input.select();
		}
	});
};

const finishRename = (item: FileItem) => {
	item.isEditing = false;
	emit("fileRename", { id: item.id, newName: item.name });
};

const createNewFile = (parent?: FileItem) => {
	const newFile: FileItem = {
		id: `file-${Date.now()}`,
		name: "new-file.txt",
		type: "file",
		isEditing: true,
	};

	if (parent && parent.type === "folder") {
		if (!parent.children) parent.children = [];
		parent.children.push(newFile);
		if (!parent.isOpen) parent.isOpen = true;
	} else {
		emit("update:modelValue", [...props.modelValue, newFile]);
	}

	nextTick(() => {
		const input = document.querySelector(
			`#rename-${newFile.id}`,
		) as HTMLInputElement;
		if (input) {
			input.focus();
			input.select();
		}
	});
};

const createNewFolder = (parent?: FileItem) => {
	const newFolder: FileItem = {
		id: `folder-${Date.now()}`,
		name: "New Folder",
		type: "folder",
		isOpen: false,
		isEditing: true,
		children: [],
	};

	if (parent && parent.type === "folder") {
		if (!parent.children) parent.children = [];
		parent.children.push(newFolder);
		if (!parent.isOpen) parent.isOpen = true;
	} else {
		emit("update:modelValue", [...props.modelValue, newFolder]);
	}

	nextTick(() => {
		const input = document.querySelector(
			`#rename-${newFolder.id}`,
		) as HTMLInputElement;
		if (input) {
			input.focus();
			input.select();
		}
	});
};

const deleteItem = (item: FileItem) => {
	const deleteFromItems = (items: FileItem[]): boolean => {
		const index = items.findIndex((i) => i.id === item.id);
		if (index !== -1) {
			items.splice(index, 1);
			return true;
		}

		for (const i of items) {
			if (i.children && deleteFromItems(i.children)) {
				return true;
			}
		}

		return false;
	};

	const itemsCopy = [...props.modelValue];
	deleteFromItems(itemsCopy);
	emit("update:modelValue", itemsCopy);
	emit("fileDelete", item);
	hideContextMenu();
};

const getFileIcon = (fileName: string) => {
	const extension = fileName.split(".").pop()?.toLowerCase();

	switch (extension) {
		case "vue":
			return "i-mdi-vuejs";
		case "js":
			return "i-mdi-language-javascript";
		case "ts":
			return "i-mdi-language-typescript";
		case "html":
			return "i-mdi-language-html5";
		case "css":
			return "i-mdi-language-css3";
		case "json":
			return "i-mdi-code-json";
		case "md":
			return "i-mdi-language-markdown";
		default:
			return "i-mdi-file-outline";
	}
};

const getFolderIcon = (isOpen: boolean | undefined) => {
	return isOpen ? "i-mdi-folder-open-outline" : "i-mdi-folder-outline";
};

// Close context menu when clicking outside
onMounted(() => {
	document.addEventListener("click", hideContextMenu);
	document.addEventListener("contextmenu", hideContextMenu);
});

onUnmounted(() => {
	document.removeEventListener("click", hideContextMenu);
	document.removeEventListener("contextmenu", hideContextMenu);
});
</script>

<template>
  <div class="file-structure" @contextmenu.prevent="$event.stopPropagation()">
    <!-- Search Bar -->
    <div class="search-bar">
      <div class="relative">
        <i class="i-mdi-magnify absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search files..."
          class="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- File Tree -->
    <div class="file-tree mt-2">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        class="file-item"
        :class="{ selected: item.isSelected }"
      >
        <div class="flex items-center py-1 px-2 hover:bg-gray-100 rounded" :style="{ 'padding-left': '1rem' }" :data-id="item.id">
          <!-- Folder/File Icon -->
          <span 
            class="mr-1 text-base" 
            :class="[
              item.type === 'folder' 
                ? getFolderIcon(item.isOpen) 
                : getFileIcon(item.name),
              item.type === 'folder' ? 'text-yellow-400' : 'text-blue-400'
            ]"
          />
          
          <!-- Item Name (Editable) -->
          <div v-if="item.isEditing" class="flex-1">
            <input
              :id="'rename-' + item.id"
              v-model="item.name"
              type="text"
              class="w-full px-1 text-sm border border-blue-300 rounded"
              @click.stop
              @keyup.enter="finishRename(item)"
              @blur="finishRename(item)"
            />
          </div>
          <span v-else class="flex-1 text-sm truncate">
            {{ item.name }}
          </span>
          
          <!-- Toggle Button for Folders -->
          <button 
            v-if="item.type === 'folder' && item.children && item.children.length > 0"
            class="p-1 text-gray-500 hover:text-gray-700"
            @click.stop="toggleFolder(item)"
          >
            <i :class="item.isOpen ? 'i-mdi-chevron-down' : 'i-mdi-chevron-right'" class="text-base" />
          </button>
        </div>
        
        <!-- Children (Recursive) -->
        <div v-if="item.type === 'folder' && item.isOpen && item.children" class="children">
          <FileStructure 
            v-model="item.children"
            @fileSelect="(child) => $emit('fileSelect', child)"
            @fileRename="$emit('fileRename', $event)"
            @fileDelete="$emit('fileDelete', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <div 
      v-if="contextMenu.show" 
      class="context-menu" 
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      @click.stop
    >
      <button v-if="contextMenu.item?.type === 'file'" class="menu-item" @click="startRename(contextMenu.item)">
        <i class="i-mdi-pencil mr-2 text-base" />
        Rename
      </button>
      <button v-else class="menu-item" @click="createNewFolder(contextMenu.item || undefined)">
        <i class="i-mdi-folder-plus mr-2 text-base" />
        New Folder
      </button>
      <button class="menu-item" @click="createNewFile(contextMenu.item || undefined)">
        <i class="i-mdi-file-plus mr-2 text-base" />
        New File
      </button>
      <div class="border-t my-1"></div>
      <button class="menu-item text-red-500" @click="deleteItem(contextMenu.item!)">
        <i class="i-mdi-trash-can-outline mr-2 text-base" />
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.file-structure {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Fira Code', monospace;
}

.search-bar {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
}

.file-item {
  cursor: pointer;
}

.file-item.selected > div:first-child {
  background-color: #eff6ff;
  color: #2563eb;
}

.children {
  margin-left: 1rem;
}

.context-menu {
  position: absolute;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-radius: 0.375rem;
  padding: 0.25rem 0;
  z-index: 50;
  border: 1px solid #e5e7eb;
  min-width: 180px;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background-color: #f3f4f6;
}
</style>