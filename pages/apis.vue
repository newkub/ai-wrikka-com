<template>
  <div class="docs-container">
    <!-- Left Sidebar -->
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
    
    <!-- Main Content -->
    <main class="content">
      <!-- API Request/Response Section -->
      <div class="api-container">
        <!-- Request Section -->
        <div class="api-section">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">API Request</h2>
            <button 
              @click="sendRequest" 
              :disabled="isLoading"
              class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center"
            >
              <span v-if="isLoading" class="i-mdi-loading animate-spin mr-2"></span>
              <span v-else class="i-mdi-send mr-2"></span>
              Send Request
            </button>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-2">
              <select v-model="requestMethod" class="bg-gray-100 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
              <input 
                v-model="apiUrl" 
                class="flex-1 border-t border-b border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://api.example.com"
              >
              <input 
                v-model="requestPath" 
                class="flex-1 border border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/endpoint"
              >
            </div>
            
            <div class="text-sm text-gray-500 mb-4">
              <span>Full URL: </span>
              <code class="bg-gray-100 px-2 py-1 rounded">{{ fullUrl }}</code>
            </div>
            
            <!-- Headers -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium">Headers</h3>
                <button 
                  @click="addHeader" 
                  class="text-xs text-primary-500 hover:text-primary-600 flex items-center"
                >
                  <span class="i-mdi-plus mr-1"></span>
                  Add Header
                </button>
              </div>
              <div 
                v-for="(header, index) in requestHeaders" 
                :key="index"
                class="flex items-center mb-2"
              >
                <input 
                  v-model="header.key" 
                  placeholder="Header name" 
                  class="w-1/3 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <input 
                  v-model="header.value" 
                  placeholder="Header value" 
                  class="w-2/3 border-t border-b border-r border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <button 
                  @click="removeHeader(index)" 
                  class="p-2 text-gray-400 hover:text-red-500"
                >
                  <span class="i-mdi-close"></span>
                </button>
              </div>
            </div>
            
            <!-- Request Body -->
            <div v-if="['POST', 'PUT', 'PATCH'].includes(requestMethod)">
              <h3 class="font-medium mb-2">Request Body</h3>
              <div class="border border-gray-300 rounded overflow-hidden">
                <div class="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
                  <div class="text-sm font-medium">JSON</div>
                  <button 
                    @click="requestBody = JSON.stringify(JSON.parse(requestBody), null, 2)" 
                    class="text-xs text-primary-500 hover:text-primary-600"
                  >
                    Format JSON
                  </button>
                </div>
                <textarea 
                  v-model="requestBody" 
                  class="w-full p-4 font-mono text-sm h-40 focus:outline-none resize-none"
                  spellcheck="false"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Response Section -->
        <div class="api-section mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Response</h2>
            <div class="flex items-center">
              <div 
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': responseStatus >= 200 && responseStatus < 300,
                  'bg-yellow-100 text-yellow-800': responseStatus >= 300 && responseStatus < 500,
                  'bg-red-100 text-red-800': responseStatus >= 500,
                  'bg-gray-100 text-gray-800': !responseStatus
                }"
              >
                {{ responseStatus || 'No response yet' }}
              </div>
            </div>
          </div>
          
          <div class="border border-gray-300 rounded overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
              <div class="text-sm font-medium">Response</div>
              <div class="flex space-x-2">
                <button 
                  v-if="responseData" 
                  @click="copyToClipboard(responseData)" 
                  class="text-xs text-gray-600 hover:text-primary-500"
                >
                  Copy
                </button>
              </div>
            </div>
            <pre 
              v-if="responseData" 
              class="p-4 bg-gray-50 overflow-auto max-h-96 text-sm"
            ><code>{{ responseData }}</code></pre>
            <div 
              v-else 
              class="p-8 text-center text-gray-400"
            >
              <div class="i-mdi-api-off text-4xl mx-auto mb-2"></div>
              <p>Send a request to see the response here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface SidebarItem {
	text: string;
	icon: string;
	collapsed: boolean;
	link: string;
	items?: {
		text: string;
		link: string;
		icon: string;
	}[];
}

// API request state
const requestMethod = ref("GET");
const apiUrl = ref("https://api.example.com");
const requestPath = ref("/users");
const requestHeaders = ref([
	{ key: "Content-Type", value: "application/json" },
]);
const requestBody = ref(
	JSON.stringify(
		{
			name: "John Doe",
			email: "john@example.com",
		},
		null,
		2,
	),
);
const responseData = ref("");
const responseStatus = ref(0);
const isLoading = ref(false);
const activeTab = ref("request");

const sidebar = ref<SidebarItem[]>([
	{
		text: "Authentication",
		icon: "i-mdi-shield-lock-outline",
		collapsed: false,
		link: "#authentication",
		items: [
			{
				text: "POST /auth/login",
				link: "#login",
				icon: "i-mdi-login",
			},
			{
				text: "POST /auth/refresh",
				link: "#refresh-token",
				icon: "i-mdi-refresh",
			},
			{
				text: "POST /auth/logout",
				link: "#logout",
				icon: "i-mdi-logout",
			},
		],
	},
	{
		text: "Users",
		icon: "i-mdi-account-group",
		collapsed: false,
		link: "#users",
		items: [
			{
				text: "GET /users",
				link: "#get-users",
				icon: "i-mdi-account-multiple",
			},
			{
				text: "POST /users",
				link: "#create-user",
				icon: "i-mdi-account-plus",
			},
			{
				text: "GET /users/:id",
				link: "#get-user",
				icon: "i-mdi-account",
			},
		],
	},
	{
		text: "Posts",
		icon: "i-mdi-post",
		collapsed: false,
		link: "#posts",
		items: [
			{
				text: "GET /posts",
				link: "#get-posts",
				icon: "i-mdi-format-list-bulleted",
			},
			{
				text: "POST /posts",
				link: "#create-post",
				icon: "i-mdi-plus-box",
			},
			{
				text: "PUT /posts/:id",
				link: "#update-post",
				icon: "i-mdi-pencil-box",
			},
			{
				text: "DELETE /posts/:id",
				link: "#delete-post",
				icon: "i-mdi-delete",
			},
		],
	},
]);

// Methods
const addHeader = () => {
	requestHeaders.value.push({ key: "", value: "" });
};

const removeHeader = (index: number) => {
	requestHeaders.value.splice(index, 1);
};

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		// You can add a toast notification here if you want
		console.log("Copied to clipboard");
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

const sendRequest = async () => {
	if (isLoading.value) return;

	isLoading.value = true;
	responseData.value = "";
	responseStatus.value = 0;

	try {
		const headers = requestHeaders.value.reduce(
			(acc, header) => {
				if (header.key) acc[header.key] = header.value;
				return acc;
			},
			{} as Record<string, string>,
		);

		const options: RequestInit = {
			method: requestMethod.value,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			credentials: "omit" as const,
		};

		if (
			["POST", "PUT", "PATCH"].includes(requestMethod.value) &&
			requestBody.value
		) {
			try {
				// Validate JSON
				JSON.parse(requestBody.value);
				options.body = requestBody.value;
			} catch (e) {
				throw new Error("Invalid JSON in request body");
			}
		}

		const response = await fetch(fullUrl.value, options);
		responseStatus.value = response.status;

		try {
			const data = await response.json().catch(() => ({}));
			responseData.value = JSON.stringify(data, null, 2);
		} catch (e) {
			responseData.value = await response.text();
		}
	} catch (error) {
		responseData.value =
			error instanceof Error ? error.message : "An error occurred";
		responseStatus.value = 0;
	} finally {
		isLoading.value = false;
	}
};

// Computed
const fullUrl = computed(() => {
	return apiUrl.value + requestPath.value;
});

const toggleCollapse = (item: SidebarItem) => {
	item.collapsed = !item.collapsed;
};
</script>

<style scoped>
.docs-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 64px);
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
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
  width: 100%;
  margin: 0 auto;
  position: relative;
  max-width: none;
}

.api-container {
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.api-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

pre {
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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