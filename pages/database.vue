<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

// Types
type Table = {
	id: string;
	name: string;
	rowCount: number;
	columns: Column[];
	description?: string;
	updatedAt: string;
};

type Column = {
	name: string;
	type: string;
	nullable: boolean;
	primaryKey: boolean;
	defaultValue?: string | number | boolean | null;
};

type QueryResult = {
	columns: string[];
	rows: Record<string, string | number | boolean | null>[];
	executionTime: number;
};

// State
const activeTab = ref<"tables" | "query" | "structure">("tables");
const isLoading = ref(true);
const breadcrumbs = ref<{ name: string; to?: string }[]>([
	{ name: "Database" },
]);
const searchQuery = ref("");
const selectedTable = ref<Table | null>(null);
const tables = ref<Table[]>([
	{
		id: "1",
		name: "users",
		rowCount: 1250,
		updatedAt: "2025-07-09T10:30:00",
		description: "Stores user account information",
		columns: [
			{ name: "id", type: "uuid", primaryKey: true, nullable: false },
			{
				name: "email",
				type: "varchar(255)",
				primaryKey: false,
				nullable: false,
			},
			{ name: "name", type: "varchar(100)", primaryKey: false, nullable: true },
			{
				name: "created_at",
				type: "timestamp",
				primaryKey: false,
				nullable: false,
			},
		],
	},
	{
		id: "2",
		name: "products",
		rowCount: 543,
		updatedAt: "2025-07-08T15:45:00",
		description: "Product catalog",
		columns: [
			{ name: "id", type: "serial", primaryKey: true, nullable: false },
			{
				name: "name",
				type: "varchar(255)",
				primaryKey: false,
				nullable: false,
			},
			{
				name: "price",
				type: "decimal(10,2)",
				primaryKey: false,
				nullable: false,
			},
			{ name: "stock", type: "integer", primaryKey: false, nullable: false },
		],
	},
	{
		id: "3",
		name: "orders",
		rowCount: 8921,
		updatedAt: "2025-07-09T09:15:00",
		description: "Customer orders",
		columns: [
			{ name: "id", type: "serial", primaryKey: true, nullable: false },
			{ name: "user_id", type: "uuid", primaryKey: false, nullable: false },
			{
				name: "total_amount",
				type: "decimal(10,2)",
				primaryKey: false,
				nullable: false,
			},
			{
				name: "status",
				type: "varchar(50)",
				primaryKey: false,
				nullable: false,
			},
		],
	},
]);

const query = ref("SELECT * FROM users LIMIT 10;");
const queryResults = ref<QueryResult | null>(null);
const isQueryRunning = ref(false);

// Computed
const filteredTables = computed(() => {
	if (!searchQuery.value) return tables.value;
	const query = searchQuery.value.toLowerCase();
	return tables.value.filter(
		(table) =>
			table.name.toLowerCase().includes(query) ||
			table.description?.toLowerCase().includes(query),
	);
});

// Methods
// Simulate loading data
onMounted(() => {
	setTimeout(() => {
		isLoading.value = false;
	}, 800);
});

const executeQuery = () => {
	isQueryRunning.value = true;
	// Simulate query execution
	setTimeout(() => {
		queryResults.value = {
			columns: ["id", "name", "email", "created_at"],
			rows: Array(10)
				.fill(0)
				.map((_, i) => ({
					id: `user_${i + 1}`,
					name: `User ${i + 1}`,
					email: `user${i + 1}@example.com`,
					created_at: new Date(Date.now() - Math.random() * 1e12).toISOString(),
				})),
			executionTime: Math.random() * 100 + 50, // Random time between 50-150ms
		};
		isQueryRunning.value = false;
	}, 800);
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString();
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 text-gray-800 dark:(bg-gray-900 text-gray-200)">
    <!-- Sidebar -->
    <div class="w-64 border-r border-gray-200 bg-white flex flex-col dark:(border-gray-700 bg-gray-800)">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">Database</h2>
        <div class="mt-2 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tables..."
            class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span class="absolute right-2 top-1.5 text-gray-400">
            <span class="i-mdi-magnify"></span>
          </span>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-for="table in filteredTables" 
             :key="table.id"
             @click="selectedTable = table"
             class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
             :class="{ 'bg-blue-50 dark:bg-blue-900/30': selectedTable?.id === table.id }"
        >
          <div class="flex items-center">
            <span class="i-mdi-table text-blue-500 mr-2"></span>
            <span>{{ table.name }}</span>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ table.rowCount.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Breadcrumb -->
      <div class="px-6 py-3 bg-white border-b border-gray-200 dark:(bg-gray-800 border-gray-700) flex items-center text-sm">
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <span v-if="index > 0" class="mx-2 text-gray-400">/</span>
          <span :class="{
            'text-gray-600 dark:text-gray-300': index < breadcrumbs.length - 1,
            'text-blue-600 dark:text-blue-400 font-medium': index === breadcrumbs.length - 1
          }">
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <nav class="flex -mb-px">
          <button
            v-for="tab in ['tables', 'query', 'structure']"
            :key="tab"
            @click="activeTab = tab as any"
            class="px-4 py-2 text-sm font-medium"
            :class="{
              'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400': activeTab === tab,
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== tab
            }"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-auto p-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
          </div>
        </div>

        <!-- Tables View -->
        <div v-else-if="activeTab === 'tables'" class="space-y-6">
          <!-- Empty State -->
          <div v-if="filteredTables.length === 0" class="text-center py-12">
            <div class="i-mdi-database-remove text-5xl text-gray-400 mx-auto mb-4"></div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No tables found</h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No tables match your search. Try adjusting your search or create a new table.
            </p>
          </div>

          <!-- Tables List -->
          <div v-if="selectedTable" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedTable.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span class="inline-flex items-center">
                    <span class="i-mdi-table mr-1"></span>
                    {{ selectedTable.rowCount.toLocaleString() }} rows
                  </span>
                  <span class="mx-2">•</span>
                  <span class="inline-flex items-center">
                    <span class="i-mdi-update mr-1"></span>
                    Updated {{ formatDate(selectedTable.updatedAt) }}
                  </span>
                </p>
              </div>
              <div class="flex space-x-2">
                <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:(text-gray-400 hover:bg-gray-700)" title="Refresh">
                  <span class="i-mdi-refresh"></span>
                </button>
                <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:(text-gray-400 hover:bg-gray-700)" title="Export">
                  <span class="i-mdi-download"></span>
                </button>
              </div>
            </div>
            <div v-if="selectedTable.description" class="px-6 py-3 bg-blue-50 text-sm text-blue-700 dark:(bg-blue-900/30 text-blue-200)">
              <div class="flex items-start">
                <span class="i-mdi-information-outline mr-2 mt-0.5 flex-shrink-0"></span>
                <p>{{ selectedTable.description }}</p>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th v-for="col in selectedTable.columns" :key="col.name" 
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div class="flex items-center group">
                        <span class="truncate">{{ col.name }}</span>
                        <span v-if="col.primaryKey" class="ml-1.5 text-yellow-500 i-mdi-key text-xs flex-shrink-0"></span>
                        <button class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                          <span class="i-mdi-chevron-down text-sm"></span>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:(bg-gray-800 divide-gray-700)">
                  <tr v-for="(_, rowIndex) in Math.min(5, selectedTable.rowCount)" :key="rowIndex" 
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td v-for="col in selectedTable.columns" :key="col.name" 
                        class="px-6 py-3 text-sm text-gray-900 dark:text-gray-200 max-w-xs truncate"
                        :title="col.primaryKey ? `${col.type === 'uuid' ? 'uuid-' : ''}${rowIndex + 1}` : `Sample data for ${col.name}`">
                      <div v-if="col.primaryKey" class="text-blue-500 font-medium">
                        {{ col.type === 'uuid' ? 'uuid-' : '' }}{{ rowIndex + 1 }}
                      </div>
                      <template v-else>
                        {{ col.type.includes('varchar') ? 'Sample data' : 
                           col.type.includes('int') ? Math.floor(Math.random() * 1000) :
                           col.type.includes('timestamp') ? new Date().toISOString().split('T')[0] :
                           '...' }}
                      </template>
                    </td>
                  </tr>
                  <tr v-if="selectedTable.rowCount > 5">
                    <td :colspan="selectedTable.columns.length" class="px-4 py-2 text-center text-sm text-gray-500">
                      + {{ (selectedTable.rowCount - 5).toLocaleString() }} more rows
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-else class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <span class="i-mdi-database-search text-4xl mb-2 block mx-auto"></span>
              <p>Select a table to view details</p>
            </div>
          </div>
        </div>

        <!-- Query View -->
        <div v-else-if="activeTab === 'query'" class="h-full flex flex-col">
          <div class="flex-1 flex flex-col space-y-4">
            <div class="flex-1">
              <div class="h-full border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <div class="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span class="text-sm font-medium">SQL Editor</span>
                  <div class="flex space-x-2">
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <span class="i-mdi-content-copy text-sm"></span>
                    </button>
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <span class="i-mdi-delete-outline text-sm"></span>
                    </button>
                  </div>
                </div>
                <textarea
                  v-model="query"
                  class="w-full h-40 p-3 font-mono text-sm bg-white dark:bg-gray-900 focus:outline-none resize-none"
                  placeholder="Enter your SQL query here..."
                ></textarea>
                <div class="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    @click="executeQuery"
                    :disabled="isQueryRunning"
                    class="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    <span v-if="isQueryRunning" class="i-mdi-loading animate-spin mr-1"></span>
                    <span v-else class="i-mdi-play mr-1"></span>
                    Run (Ctrl+Enter)
                  </button>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-hidden flex flex-col">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex-1 flex flex-col">
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 class="text-sm font-medium">Results</h3>
                  <div v-if="queryResults" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ queryResults.rows.length }} rows in {{ queryResults.executionTime.toFixed(2) }}ms
                  </div>
                </div>
                
                <div v-if="queryResults" class="flex-1 overflow-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th v-for="col in queryResults.columns" :key="col" 
                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {{ col }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-for="(row, rowIndex) in queryResults.rows" :key="rowIndex">
                        <td v-for="col in queryResults.columns" :key="col" 
                            class="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                          {{ row[col] || 'NULL' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div v-else class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div class="text-center p-8">
                    <span class="i-mdi-database-search text-4xl mb-2 block mx-auto"></span>
                    <p>Run a query to see results</p>
                    <p class="text-xs mt-2 text-gray-400 dark:text-gray-500">Try: SELECT * FROM users LIMIT 10;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Structure View -->
        <div v-else-if="activeTab === 'structure'" class="space-y-6">
          <div v-if="selectedTable" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium">Table Structure: {{ selectedTable.name }}</h3>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nullable</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Default</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="col in selectedTable.columns" :key="col.name">
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-200 font-mono">{{ col.name }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-200 font-mono">{{ col.type }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                      <span v-if="col.nullable" class="text-green-500">YES</span>
                      <span v-else class="text-red-500">NO</span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-200 font-mono">
                      {{ col.defaultValue || 'NULL' }}
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                      <span v-if="col.primaryKey" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <span class="i-mdi-key mr-1 text-xs"></span>
                        PRIMARY
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h4 class="text-sm font-medium mb-2">Create Table SQL</h4>
              <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <pre class="text-xs font-mono text-gray-800 dark:text-gray-200">
CREATE TABLE "{{ selectedTable.name }}" (
  <span v-for="(col, idx) in selectedTable.columns" :key="col.name" class="block ml-4">
    "{{ col.name }}" {{ col.type.toUpperCase() }}{{ !col.nullable ? ' NOT NULL' : '' }}{{ col.primaryKey ? ' PRIMARY KEY' : '' }}{{ col.defaultValue ? ` DEFAULT ${col.defaultValue}` : '' }}{{ idx < selectedTable.columns.length - 1 ? ',' : '' }}
  </span>
);</pre>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <span class="i-mdi-database-search text-4xl mb-2 block mx-auto"></span>
              <p>Select a table to view its structure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Custom styling for SQL editor */
textarea {
  font-family: 'Fira Code', 'Courier New', monospace;
  line-height: 1.5;
  tab-size: 2;
}

/* Animation for loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>