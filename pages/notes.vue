<script setup lang="ts">
import Card from "~/components/primitive/Card.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import TextEditor from "@/components/common/TextEditor.vue";

const isModalOpen = ref(false);
const modalRef = ref<HTMLElement | null>(null);

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
	if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
		isModalOpen.value = false;
	}
};

// Handle escape key
const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === "Escape") {
		isModalOpen.value = false;
	}
};

// Add and remove event listeners
onMounted(() => {
	document.addEventListener("mousedown", handleClickOutside);
	document.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
	document.removeEventListener("mousedown", handleClickOutside);
	document.removeEventListener("keydown", handleKeyDown);
});
interface Note {
	id: number;
	title: string;
	content: string;
}

const currentNote = ref<Note | null>(null);

// Sample data - replace with your actual notes data
const notes = Array(12)
	.fill(0)
	.map((_, i) => ({
		id: i + 1,
		title: `Note ${i + 1}`,
		content: "This is a sample note content. Click to edit or view details.",
	}));

const openNoteEditor = (note: Note) => {
	currentNote.value = note;
	isModalOpen.value = true;
};

const handleSave = (content: string) => {
	// Handle save logic here
	console.log("Note saved:", content);
	isModalOpen.value = false;
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 ">My Notes</h1>
    
    <div class="grid grid-cols-6 gap-4">
      <Card 
        v-for="note in notes" 
        :key="note.id" 
        class="h-40 cursor-pointer hover:shadow-lg transition-shadow"
        @click="openNoteEditor(note)"
      >
        <h3 class="font-semibold mb-2">{{ note.title }}</h3>
        <div class="text-sm">
          <p class="text-sm line-clamp-4">{{ note.content }}</p>
        </div>
      </Card>
    </div>

    <!-- TextEditor Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="isModalOpen" 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
        >
          <div 
            ref="modalRef"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95"
            :class="{ 'scale-100': isModalOpen }"
          >
            <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ currentNote?.title || 'New Note' }}
              </h3>
              <button 
                @click="isModalOpen = false" 
                class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-5 overflow-auto flex-1">
              <TextEditor 
                v-if="isModalOpen"
                :initial-content="currentNote?.content || ''"
                @save="handleSave"
                class="h-full"
              />
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                @click="isModalOpen = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                @click="handleSave(currentNote?.content || '')"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  animation: modal-zoom 0.3s ease-out;
}

@keyframes modal-zoom {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
