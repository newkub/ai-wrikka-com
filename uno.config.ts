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
				sans: "Roboto",
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
	theme: {
		colors: {
			background: "var(--background)",
			brand: "var(--brand)",
			text: "var(--text)",
			alert: "var(--alert)",
			error: "var(--error)",
			success: "var(--success)",
			surface: "var(--surface)",
			border: "var(--border)",
		},
		spacing: {
			sm: "var(--spacing-unit)",
			DEFAULT: "calc(var(--spacing-unit) * 2)",
			lg: "calc(var(--spacing-unit) * 4)",
		},
		borderRadius: {
			sm: "var(--border-radius-sm)",
			DEFAULT: "var(--border-radius-md)",
			lg: "var(--border-radius-lg)",
		},
		boxShadow: {
			sm: "var(--shadow-sm)",
			DEFAULT: "var(--shadow-md)",
			lg: "var(--shadow-lg)",
		},
		transitionDuration: {
			DEFAULT: "var(--transition-duration)",
			fast: "150ms",
			slow: "var(--transition-duration-slow)",
		},
		transitionTimingFunction: {
			DEFAULT: "var(--transition-timing)",
			ease: "var(--transition-timing-ease)",
			linear: "var(--transition-timing-linear)",
		},
	},
});
