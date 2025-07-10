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
