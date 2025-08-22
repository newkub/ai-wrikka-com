<script setup lang="ts">
import { useSidebar } from '~/composables/useSidebar'

interface SidebarItem {
  text: string
  link: string
  icon: string
  collapsed: boolean
  items?: SidebarItem[]
}

const { sidebar, toggleCollapse } = useSidebar([
  {
    text: "Getting Started",
    link: "/docs/getting-started",
    icon: "i-mdi-rocket-launch-outline",
    collapsed: false,
    items: [
      {
        text: "Installation",
        link: "/docs/getting-started/installation",
        icon: "i-mdi-download-box-outline",
        collapsed: false,
      },
      {
        text: "Configuration",
        link: "/docs/getting-started/configuration",
        icon: "i-mdi-cog-outline",
        collapsed: false,
      },
    ],
  },
  {
    text: "Guide",
    link: "/docs/guide",
    icon: "i-mdi-book-open-outline",
    collapsed: false,
    items: [
      {
        text: "Basic Usage",
        link: "/docs/guide/basic-usage",
        icon: "i-mdi-play-circle-outline",
        collapsed: false,
      },
      {
        text: "Advanced Features",
        link: "/docs/guide/advanced-features",
        icon: "i-mdi-star-cog-outline",
        collapsed: false,
      },
    ],
  },
  {
    text: "API Reference",
    link: "/docs/api",
    icon: "i-mdi-code-json",
    collapsed: false,
    items: [
      {
        text: "Endpoints",
        link: "/docs/api/endpoints",
        icon: "i-mdi-api",
        collapsed: false,
      },
      {
        text: "Authentication",
        link: "/docs/api/authentication",
        icon: "i-mdi-shield-lock-outline",
        collapsed: false,
      },
    ],
  },
])
</script>

<template>
  <div class="grid grid-cols-[280px_1fr_240px] min-h-[calc(100vh-64px)]">
    <aside class="p-6 border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <nav>
        <ul>
          <li v-for="item in sidebar" :key="item.text" class="mb-3">
            <div class="flex items-center justify-between cursor-pointer py-2" @click="toggleCollapse(item)">
              <div class="flex items-center">
                <div :class="item.icon" class="mr-2 text-lg"></div>
                <RouterLink :to="item.link" class="text-gray-700 hover:text-indigo-600">{{ item.text }}</RouterLink>
              </div>
              <button class="bg-transparent border-none text-gray-700 hover:text-indigo-600 p-1 ml-2">
                <div :class="!item.collapsed ? 'i-mdi-chevron-down' : 'i-mdi-chevron-right'"></div>
              </button>
            </div>
            <ul v-if="item.items && !item.collapsed" class="pl-4 mt-2">
              <li v-for="subItem in item.items" :key="subItem.text" class="mb-2">
                <RouterLink :to="subItem.link" class="flex items-center text-gray-500 hover:text-indigo-600">
                  <div :class="subItem.icon" class="mr-2 text-[1.1rem]"></div>
                  {{ subItem.text }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
    
    <main class="p-8 max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Getting Started</h1>
      <p class="text-lg text-gray-600 mb-8">Welcome to our documentation. Here's how to get started with our product.</p>
      
      <h2 id="installation" class="text-2xl font-bold mb-2">Installation</h2>
      <p class="text-lg text-gray-600 mb-4">To install our package, run the following command:</p>
      <pre class="bg-gray-100 p-4 rounded-md mb-8"><code class="text-lg text-gray-600">npm install our-package</code></pre>
      
      <h2 id="configuration" class="text-2xl font-bold mb-2">Configuration</h2>
      <p class="text-lg text-gray-600 mb-4">Create a config file in your project root:</p>
      <pre class="bg-gray-100 p-4 rounded-md mb-8"><code class="text-lg text-gray-600">{<br>
  "apiKey": "your-api-key",<br>
  "environment": "production"<br>
}</code></pre>
      
      <h2 id="usage" class="text-2xl font-bold mb-2">Basic Usage</h2>
      <p class="text-lg text-gray-600 mb-4">Import and initialize the SDK:</p>
      <pre class="bg-gray-100 p-4 rounded-md mb-8"><code class="text-lg text-gray-600">import { initSDK } from 'our-package';<br><br>initSDK({<br>
  apiKey: 'your-api-key'<br>
});</code></pre>
    </main>
    
    <aside class="p-8 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div class="p-4 border-l border-gray-200">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">On this page</h3>
        <ul>
          <li class="mb-2"><a href="#installation" class="text-sm text-gray-700 hover:text-indigo-600">Installation</a></li>
          <li class="mb-2"><a href="#configuration" class="text-sm text-gray-700 hover:text-indigo-600">Configuration</a></li>
          <li class="mb-2"><a href="#usage" class="text-sm text-gray-700 hover:text-indigo-600">Basic Usage</a></li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style>
pre {
  background: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>