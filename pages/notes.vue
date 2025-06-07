<script setup lang="ts">
import { ref } from "vue";
import Card from "~/components/primitive/Card.vue";
import TextEditor from "@/components/common/TextEditor.vue";

const isModalOpen = ref(false);
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
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold">{{ currentNote?.title || 'New Note' }}</h3>
            <button 
              @click="isModalOpen = false" 
              class="text-gray-500 hover:text-gray-700"
            >
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="p-4 overflow-auto flex-1">
            <TextEditor 
              v-if="isModalOpen"
              :initial-content="currentNote?.content || ''"
              @save="handleSave"
              class="h-full"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
