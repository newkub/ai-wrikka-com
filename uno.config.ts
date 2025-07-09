import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import {
	defineConfig,
	presetIcons,
	presetMini,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	theme: {
		colors: {
			background: "var(--background)",
			block: "var(--block)",
			text: "var(--text)",
			border: "var(--border)",
			color: {
				primary: "var(--primary)",
				secondary: "var(--secondary)",
				alert: "var(--alert)",
				error: "var(--error)",
				success: "var(--success)",
			},
			primary: {
				DEFAULT: "#3b82f6",
				50: "#eff6ff",
				100: "#dbeafe",
				200: "#bfdbfe",
				300: "#93c5fd",
				400: "#60a5fa",
				500: "#3b82f6",
				600: "#2563eb",
				700: "#1d4ed8",
				800: "#1e40af",
				900: "#1e3a8a",
			},
			secondary: {
				DEFAULT: "#64748b",
				50: "#f8fafc",
				100: "#f1f5f9",
				200: "#e2e8f0",
				300: "#cbd5e1",
				400: "#94a3b8",
				500: "#64748b",
				600: "#475569",
				700: "#334155",
				800: "#1e293b",
				900: "#0f172a",
			},
			danger: {
				DEFAULT: "#ef4444",
				50: "#fef2f2",
				100: "#fee2e2",
				200: "#fecaca",
				300: "#fca5a5",
				400: "#f87171",
				500: "#ef4444",
				600: "#dc2626",
				700: "#b91c1c",
				800: "#991b1b",
				900: "#7f1d1d",
			},
		},
	},
	presets: [
		presetMini(),
		presetIcons({
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
			collections: {
				mdi: () =>
					import("@iconify-json/mdi/icons.json").then((i) => i.default),
			},
		}),
		presetWebFonts({
			provider: "none",
			fonts: {
				sans: "Noto Sans Thai",
				mono: "Fira Code",
			},
			processors: createLocalFontProcessor({
				cacheDir: "node_modules/.cache/unocss/fonts",
				fontAssetsDir: "public/assets/fonts",
				fontServeBaseUrl: "/assets/fonts",
			}),
		}),
	],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	shortcuts: {
		block: "bg-block p-4 rounded-md shadow-sm border border",
		text: "text-text font-sans",
		grid: "grid gap-4",
		btn: "px-4 py-2 rounded-md bg-primary text-white hover:opacity-90 transition-opacity",
	},
});
