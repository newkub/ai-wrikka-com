// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-21",

	nitro: {
		preset: "cloudflare_pages",
		experimental: {
			openAPI: true,
		},
	},
	devtools: { enabled: false },
	css: ["@unocss/reset/tailwind.css", "~/assets/design-tokens.css"],
	app: {
		head: {
			title: "AI Wrikka",
			htmlAttrs: {
				lang: "en",
			},
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "description", content: "AI Wrikka Application" },
			],
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},

	modules: ["@unocss/nuxt", "@vueuse/nuxt", "@pinia/nuxt"],

	typescript: {
		strict: true,
	},
	runtimeConfig: {
		openaiApiKey: process.env.OPENAI_API_KEY,
		workos: {
			apiKey: process.env.WORKOS_API_KEY || "",
			clientId: process.env.WORKOS_CLIENT_ID || "",
		},
		public: {
			baseUrl: process.env.BASE_URL || "http://localhost:3000",
			apiBase: process.env.API_BASE_URL || "https://api.example.com",
			workosApiKey: process.env.WORKOS_API_KEY,
		},
	},
});
