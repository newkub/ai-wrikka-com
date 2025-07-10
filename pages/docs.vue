<template>
  <div class="docs-container">
    <aside class="sidebar">
      <nav>
        <ul>
          <li v-for="item in sidebar" :key="item.text">
            <div class="menu-header" @click="toggleCollapse(item)">
              <div class="flex items-center">
                <div :class="item.icon" class="mr-2 text-lg"></div>
                <RouterLink :to="item.link" class="menu-title">{{ item.text }}</RouterLink>
              </div>
              <button class="collapse-btn">
                <div class="i-mdi-chevron-down" v-if="!item.collapsed"></div>
                <div class="i-mdi-chevron-right" v-else></div>
              </button>
            </div>
            <ul v-if="item.items && !item.collapsed" class="sub-menu">
              <li v-for="subItem in item.items" :key="subItem.text">
                <RouterLink :to="subItem.link" class="flex items-center">
                  <div :class="subItem.icon" class="mr-2 text-gray-500"></div>
                  {{ subItem.text }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
    
    <main class="content">
      <h1>Getting Started</h1>
      <p>Welcome to our documentation. Here's how to get started with our product.</p>
      
      <h2 id="installation">Installation</h2>
      <p>To install our package, run the following command:</p>
      <pre><code>npm install our-package</code></pre>
      
      <h2 id="configuration">Configuration</h2>
      <p>Create a config file in your project root:</p>
      <pre><code>{
  "apiKey": "your-api-key",
  "environment": "production"
}</code></pre>
      
      <h2 id="usage">Basic Usage</h2>
      <p>Import and initialize the SDK:</p>
      <pre><code>import { initSDK } from 'our-package';

initSDK({
  apiKey: 'your-api-key'
});</code></pre>
    </main>
    
    <aside class="toc">
      <div class="toc-container">
        <h3>On this page</h3>
        <ul>
          <li><a href="#installation">Installation</a></li>
          <li><a href="#configuration">Configuration</a></li>
          <li><a href="#usage">Basic Usage</a></li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const sidebar = ref([
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
			},
			{
				text: "Configuration",
				link: "/docs/getting-started/configuration",
				icon: "i-mdi-cog-outline",
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
			},
			{
				text: "Advanced Features",
				link: "/docs/guide/advanced-features",
				icon: "i-mdi-star-cog-outline",
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
			},
			{
				text: "Authentication",
				link: "/docs/api/authentication",
				icon: "i-mdi-shield-lock-outline",
			},
		],
	},
]);

const toggleCollapse = (item: any) => {
	item.collapsed = !item.collapsed;
};
</script>

<style scoped>
.docs-container {
  display: grid;
  grid-template-columns: 280px 1fr 240px;
  min-height: calc(100vh - 64px);
}

.sidebar {
  padding: 24px;
  border-right: 1px solid #e2e8f0;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.content {
  padding: 32px 48px;
  max-width: 800px;
  margin: 0 auto;
}

.toc {
  padding: 32px 16px;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.toc-container {
  padding: 16px;
  border-left: 1px solid #e2e8f0;
}

/* Existing styles */
nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav li {
  margin-bottom: 12px;
}

nav a {
  color: #4a5568;
  text-decoration: none;
  display: block;
  padding: 4px 0;
}

nav a:hover {
  color: #4f46e5;
}

.sub-menu {
  padding-left: 16px;
  margin-top: 8px;
}

/* Content styles */
h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

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

/* เพิ่ม style สำหรับ collapse menu */
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 0;
}

.menu-title {
  flex: 1;
}

.collapse-btn {
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
}

.collapse-btn:hover {
  color: #4f46e5;
}

/* เพิ่ม style สำหรับ icon */
.menu-header .flex {
  flex: 1;
}

/* เพิ่ม style สำหรับ submenu icon */
.sub-menu .flex {
  padding-left: 8px;
}

.sub-menu .text-gray-500 {
  font-size: 1.1rem;
}

.toc h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #4a5568;
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc li {
  margin-bottom: 8px;
}

.toc a {
  font-size: 0.875rem;
  color: #4a5568;
  text-decoration: none;
}

.toc a:hover {
  color: #4f46e5;
}
</style>