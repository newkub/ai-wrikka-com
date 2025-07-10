<template>
  <div class="space-y-6">
    <!-- Database Status -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Database Status</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ database.type }} {{ database.version }} · {{ formatBytes(database.size * 1024 * 1024) }} used
          </p>
        </div>
        <div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span class="i-mdi-check-circle mr-1" />
            {{ database.status }}
          </span>
        </div>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="bg-gray-50 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Tables</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ database.tables.length }}</dd>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Rows</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ database.tables.reduce((sum, table) => sum + table.rows, 0).toLocaleString() }}
            </dd>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 truncate">Database Size</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ formatBytes(database.size * 1024 * 1024) }}
            </dd>
          </div>
        </div>
      </div>
    </div>

    <!-- Database Connection -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Connection Details</h3>
        <button 
          @click="toggleConnectionDetails"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ showConnectionDetails ? 'Hide' : 'Show' }} Connection Details
        </button>
      </div>
      
      <div v-if="showConnectionDetails" class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Connection String</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input 
                type="text" 
                readonly 
                :value="`postgresql://${database.connection.username}:${database.connection.password}@${database.connection.host}:${database.connection.port}/${database.connection.database}?sslmode=require`" 
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
              >
              <button 
                @click="copyToClipboard(`postgresql://${database.connection.username}:${database.connection.password}@${database.connection.host}:${database.connection.port}/${database.connection.database}?sslmode=require`)"
                class="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="i-mdi-content-copy mr-1" />
                Copy
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Host</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="text" 
                  readonly 
                  :value="database.connection.host" 
                  class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Port</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="text" 
                  readonly 
                  :value="database.connection.port" 
                  class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Database</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="text" 
                  readonly 
                  :value="database.connection.database" 
                  class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Username</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="text" 
                  readonly 
                  :value="database.connection.username" 
                  class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                >
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="password" 
                  readonly 
                  :value="database.connection.password" 
                  class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    @click="copyToClipboard(database.connection.password)"
                    class="text-gray-400 hover:text-gray-500"
                    type="button"
                  >
                    <span class="i-mdi-content-copy h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input 
                id="ssl-enabled" 
                type="checkbox" 
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                :checked="database.connection.ssl"
                disabled
              >
            </div>
            <div class="ml-3 text-sm">
              <label for="ssl-enabled" class="font-medium text-gray-700">SSL/TLS Required</label>
              <p class="text-gray-500">All connections must be encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Database Tables -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Database Tables</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ database.tables.length }} tables in your database
        </p>
      </div>
      <div class="border-t border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rows</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="table in database.tables" 
              :key="table.name" 
              class="hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-blue-50': selectedTable === table.name }"
              @click="selectedTable = selectedTable === table.name ? '' : table.name"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center text-indigo-600">
                    <span class="i-mdi-table h-6 w-6" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ table.name }}</div>
                    <div class="text-sm text-gray-500">public</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ table.rows.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatBytes(table.size * 1024 * 1024) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-4">
                  <span class="i-mdi-eye-outline" />
                </button>
                <button class="text-indigo-600 hover:text-indigo-900">
                  <span class="i-mdi-pencil" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Queries -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Queries</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Most recent database queries
        </p>
      </div>
      <div class="border-t border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(query, index) in database.recentQueries" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono text-gray-900 max-w-md truncate" :title="query.query">
                  {{ query.query }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ query.time }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(query.timestamp) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock database data
const database = {
	status: "Running",
	type: "PostgreSQL",
	version: "14.5",
	size: 2.8,
	tables: [
		{ name: "users", rows: 1245, size: 1.2 },
		{ name: "posts", rows: 5432, size: 3.4 },
		{ name: "comments", rows: 9876, size: 2.1 },
		{ name: "categories", rows: 32, size: 0.1 },
		{ name: "tags", rows: 87, size: 0.3 },
	],
	recentQueries: [
		{
			query: "SELECT * FROM users WHERE id = $1",
			time: "5.2ms",
			timestamp: "2025-07-10T10:15:30Z",
		},
		{
			query: "UPDATE posts SET views = views + 1 WHERE id = $1",
			time: "2.1ms",
			timestamp: "2025-07-10T10:14:45Z",
		},
		{
			query:
				"INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)",
			time: "3.7ms",
			timestamp: "2025-07-10T10:12:22Z",
		},
		{
			query: "DELETE FROM sessions WHERE expires_at < NOW()",
			time: "8.9ms",
			timestamp: "2025-07-10T10:10:15Z",
		},
		{
			query: "SELECT * FROM posts ORDER BY created_at DESC LIMIT 10",
			time: "1.5ms",
			timestamp: "2025-07-10T10:05:33Z",
		},
	],
	connection: {
		host: "db.example.com",
		port: 5432,
		database: `project_${projectId.value}`,
		username: `user_${projectId.value}`,
		password: "••••••••",
		ssl: true,
	},
};

const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
};

const selectedTable = ref("");
const showConnectionDetails = ref(false);

const toggleConnectionDetails = () => {
	showConnectionDetails.value = !showConnectionDetails.value;
};

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
	// You might want to show a toast notification here
};
</script>
