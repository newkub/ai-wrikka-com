import { useColorMode } from "@vueuse/core";

export function useTheme() {
	const mode = useColorMode({
		selector: "html",
		attribute: "class",
		modes: {
			light: "light",
			dark: "dark",
		},
	});

	const isDark = computed(() => mode.value === "dark");
	const toggleTheme = () => {
		mode.value = isDark.value ? "light" : "dark";
	};

	return {
		isDark,
		toggleTheme,
		mode: readonly(mode),
	};
}
