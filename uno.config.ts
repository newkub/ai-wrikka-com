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
			block: "var(--block)",
			primary: "var(--primary)",
			border: "var(--border)",
			secondary: "var(--secondary)",
			text: "var(--text)",
			alert: "var(--alert)",
			error: "var(--error)",
			success: "var(--success)",
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
		border: {
			DEFAULT: "var(--border)",
		},
		breakpoints: {
			mobile: "var(--breakpoints-mobile)",
			tablet: "var(--breakpoints-tablet)",
			desktop: "var(--breakpoints-desktop)",
		},
		transition: {
			DEFAULT: "var(--transition)",
		},
	},
	shortcuts: {
		'block': '',
		'text': '',
		'grid': '',
		'': '',
	}
});
