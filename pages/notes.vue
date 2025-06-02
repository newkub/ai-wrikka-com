<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Notes</h1>
      <button 
        @click="openNewNote"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        New Note
      </button>
    </div>

    <!-- Notes Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
      <div 
        v-for="(note, index) in notes" 
        :key="index"
        @click="openNote(note)"
        class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-48 overflow-hidden"
      >
        <h3 class="font-semibold text-lg mb-2 truncate">{{ note.title || 'Untitled Note' }}</h3>
        <div class="text-gray-600 text-sm line-clamp-5">
          <MDC :value="note.content" />
        </div>
      </div>
    </div>

    <!-- Note Editor Modal -->
    <Modal v-model="isOpen" content-class="w-full max-w-4xl h-[80vh] flex flex-col">
      <template #header>
        <div class="flex justify-between items-center w-full p-4">
          <input
            v-model="currentNote.title"
            type="text"
            placeholder="Note Title"
            class="text-xl font-semibold w-full outline-none"
          />
          <button @click="isOpen = false" class="text-gray-500 hover:text-gray-700 ml-2">
            <div class="i-mdi-close h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
      </template>
      
      <div class="flex-1 flex">
        <div class="w-1/2 border-r">
          <textarea
            v-model="currentNote.content"
            class="w-full h-full p-4 outline-none resize-none font-mono"
            placeholder="Write your note in Markdown..."
          ></textarea>
        </div>
        <div class="w-1/2 p-4 overflow-auto">
          <div class="prose max-w-none">
            <MDC :value="currentNote.content" />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="p-4 border-t">
          <div class="flex justify-end space-x-2">
            <button 
              @click="isOpen = false" 
              class="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              @click="saveNote" 
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Modal from "~/components/modal/Modal.vue";

interface Note {
	id?: string;
	title: string;
	content: string;
	updatedAt?: Date;
}

// State
const notes = ref<Note[]>([]);
const currentNote = ref<Note>({ title: "", content: "" });
const isOpen = ref(false);

// Methods
const openNewNote = () => {
	currentNote.value = { title: "", content: "" };
	isOpen.value = true;
};

const openNote = (note: Note) => {
	currentNote.value = { ...note };
	isOpen.value = true;
};

const saveNote = () => {
	if (!currentNote.value.title && !currentNote.value.content) return;

	const now = new Date();

	if (currentNote.value.id) {
		// Update existing note
		const index = notes.value.findIndex((n) => n.id === currentNote.value.id);
		if (index !== -1) {
			notes.value[index] = {
				...currentNote.value,
				updatedAt: now,
			};
		}
	} else {
		// Add new note
		notes.value.unshift({
			...currentNote.value,
			id: Date.now().toString(),
			updatedAt: now,
		});
	}

	close();
};

// Load notes from localStorage on component mount
onMounted(() => {
	const savedNotes = localStorage.getItem("notes");
	if (savedNotes) {
		try {
			notes.value = JSON.parse(savedNotes);
		} catch (e) {
			console.error("Failed to parse saved notes", e);
		}
	}
});

// Watch for changes to notes and save to localStorage
watch(
	notes,
	(newNotes) => {
		localStorage.setItem("notes", JSON.stringify(newNotes));
	},
	{ deep: true },
);
</script>