<template>
  <div 
    v-if="modelValue"
    class="fixed bg-white shadow-lg rounded-lg py-1 z-50 w-48 border border-gray-200"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    @click.stop
  >
    <button 
      v-for="item in menuItems" 
      :key="item.action"
      :class="[
        'w-full text-right px-4 py-2 text-sm text-gray-700',
        'hover:bg-gray-100 flex items-center gap-2',
        item.class
      ]"
      @click="handleClick(item.action)"
    >
      <span class="flex-1 text-right">{{ item.label }}</span>
      <div :class="`i-mdi-${item.icon} w-4 h-4 flex-shrink-0`" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ChatSession } from "~/types/chat";

const props = defineProps<{
	modelValue: boolean;
	position: { x: number; y: number };
	session: ChatSession | null;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "delete", sessionId: string): void;
	(e: "rename", session: ChatSession): void;
	(e: "togglePin", session: ChatSession): void;
}>();

const show = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const menuItems = computed(() => [
	{
		label: "เปลี่ยนชื่อ",
		icon: "pencil",
		action: "rename",
	},
	{
		label: props.session?.isPinned ? "เลิกปักหมุด" : "ปักหมุด",
		icon: props.session?.isPinned ? "pin-off" : "pin",
		action: "togglePin",
	},
	{
		label: "ลบ",
		icon: "trash-can-outline",
		action: "delete",
		class: "text-red-600",
	},
]);

const handleClick = (action: string) => {
	if (!props.session) return;

	switch (action) {
		case "delete":
			if (confirm("ยืนยันการลบแชทนี้?")) {
				emit("delete", props.session.id);
			}
			break;
		case "rename":
			emit("rename", props.session);
			break;
		case "togglePin":
			emit("togglePin", props.session);
			break;
	}

	emit("update:modelValue", false);
};

// Close menu when clicking outside
document.addEventListener(
	"click",
	(e) => {
		if (show.value) {
			show.value = false;
		}
	},
	{ capture: true },
);
</script>
