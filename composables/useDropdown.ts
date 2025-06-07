import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";

export function useDropdown() {
	const isOpen = ref(false);
	const dropdownRef: Ref<HTMLElement | null> = ref(null);

	const toggle = () => {
		isOpen.value = !isOpen.value;
	};

	const open = () => {
		isOpen.value = true;
	};

	const close = () => {
		isOpen.value = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.value &&
			!dropdownRef.value.contains(event.target as Node)
		) {
			close();
		}
	};

	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			close();
		}
	};

	onMounted(() => {
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("mousedown", handleClickOutside);
		document.removeEventListener("keydown", handleEscape);
	});

	return {
		isOpen,
		dropdownRef,
		toggle,
		open,
		close,
	};
}
