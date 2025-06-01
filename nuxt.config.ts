// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-21',
  nitro: {
    preset: 'cloudflare_pages',
     experimental: {
      openAPI: true
    }
  },
  devtools: { enabled: false },
  css: ["@unocss/reset/tailwind.css", "@unocss/reset/normalize.css", "~/assets/index.css", "~/assets/content.css"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "My Nuxt App",
      meta: [{ name: "description", content: "My amazing Nuxt application" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  
  hub: {
    ai: true
  },
  modules: [
    "@unocss/nuxt",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/mdc",
    //"@nuxt/content",
    //'nuxt-content-twoslash',
    "@nuxthub/core",
  ],

  
  mdc: {
    highlight: {
      theme: 'github-dark',
      preload: [
        'ts',
        'js',
        'vue',
        'html',
        'css',
        'json',
        'bash',
        'markdown'
      ]
    },
    components: {
      prose: true
    }
  },
  typescript: {
    strict: true,
    typeCheck: true,
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
})