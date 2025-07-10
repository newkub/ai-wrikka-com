<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface GitStatus {
	staged: string[];
	unstaged: string[];
	untracked: string[];
	branch: string;
	ahead: number;
	behind: number;
	hasUnpushedCommits: boolean;
}

interface Commit {
	hash: string;
	message: string;
	author: string;
	date: string;
	isHead: boolean;
}

const activeTab = ref<"changes" | "history" | "branches">("changes");
const commitMessage = ref("");
const gitStatus = ref<GitStatus>({
	staged: [],
	unstaged: [],
	untracked: [],
	branch: "main",
	ahead: 0,
	behind: 0,
	hasUnpushedCommits: false,
});

const commitHistory = ref<Commit[]>([]);
const branches = ref<{ name: string; isCurrent: boolean }[]>([]);
const selectedFiles = ref<Set<string>>(new Set());

const hasChanges = computed(() => {
	return (
		gitStatus.value.staged.length > 0 ||
		gitStatus.value.unstaged.length > 0 ||
		gitStatus.value.untracked.length > 0
	);
});

const loadGitStatus = async () => {
	try {
		// In a real app, this would call your backend to get git status
		// This is a mock implementation
		await new Promise((resolve) => setTimeout(resolve, 300));

		gitStatus.value = {
			staged: ["src/components/HelloWorld.vue", "src/App.vue"],
			unstaged: ["src/main.ts", "vite.config.ts"],
			untracked: ["src/new-component.vue"],
			branch: "feature/git-integration",
			ahead: 2,
			behind: 0,
			hasUnpushedCommits: true,
		};

		commitHistory.value = [
			{
				hash: "a1b2c3d",
				message: "Add git integration",
				author: "John Doe",
				date: "2023-05-15T14:30:00Z",
				isHead: true,
			},
			{
				hash: "b2c3d4e",
				message: "Update README",
				author: "Jane Smith",
				date: "2023-05-14T10:15:00Z",
				isHead: false,
			},
		];

		branches.value = [
			{ name: "main", isCurrent: false },
			{ name: "develop", isCurrent: false },
			{ name: "feature/git-integration", isCurrent: true },
		];
	} catch (error) {
		console.error("Failed to load git status:", error);
	}
};

const stageFile = (file: string) => {
	// In a real app, this would call git add
	gitStatus.value = {
		...gitStatus.value,
		unstaged: gitStatus.value.unstaged.filter((f: string) => f !== file),
		staged: [...gitStatus.value.staged, file],
	};
};

const unstageFile = (file: string) => {
	// In a real app, this would call git reset HEAD
	gitStatus.value = {
		...gitStatus.value,
		staged: gitStatus.value.staged.filter((f: string) => f !== file),
		unstaged: [...gitStatus.value.unstaged, file],
	};
};

const stageAll = () => {
	// In a real app, this would call git add .
	gitStatus.value = {
		...gitStatus.value,
		staged: [...gitStatus.value.staged, ...gitStatus.value.unstaged],
		unstaged: [],
	};
};

const commitChanges = () => {
	if (!commitMessage.value.trim() || gitStatus.value.staged.length === 0)
		return;

	// In a real app, this would call git commit -m "..."
	const newCommit: Commit = {
		hash: Math.random().toString(16).substring(2, 9),
		message: commitMessage.value,
		author: "Current User",
		date: new Date().toISOString(),
		isHead: true,
	};

	commitHistory.value = [newCommit, ...commitHistory.value];
	gitStatus.value = {
		...gitStatus.value,
		staged: [],
		ahead: gitStatus.value.ahead + 1,
		hasUnpushedCommits: true,
	};

	commitMessage.value = "";
};

const pushChanges = async () => {
	try {
		// In a real app, this would call git push
		await new Promise((resolve) => setTimeout(resolve, 1000));
		gitStatus.value.hasUnpushedCommits = false;
		gitStatus.value.ahead = 0;
	} catch (error) {
		console.error("Push failed:", error);
	}
};

const pullChanges = async () => {
	try {
		// In a real app, this would call git pull
		await new Promise((resolve) => setTimeout(resolve, 1000));
		gitStatus.value.behind = 0;
	} catch (error) {
		console.error("Pull failed:", error);
	}
};

const checkoutBranch = async (branch: string) => {
	try {
		// In a real app, this would call git checkout <branch>
		await new Promise((resolve) => setTimeout(resolve, 500));
		gitStatus.value.branch = branch;
		branches.value = branches.value.map((b) => ({
			...b,
			isCurrent: b.name === branch,
		}));
		// Reload status after checkout
		loadGitStatus();
	} catch (error) {
		console.error(`Failed to checkout branch ${branch}:`, error);
	}
};

onMounted(() => {
	loadGitStatus();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Branch and Actions Bar -->
    <div class="flex items-center justify-between p-2 border-b border-gray-700">
      <div class="flex items-center gap-2">
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded text-sm">
            <i class="i-mdi-git text-blue-400"></i>
            <span class="font-medium text-gray-200">{{ gitStatus.branch }}</span>
            <i class="i-mdi-chevron-down text-xs text-gray-400"></i>
            
            <span v-if="gitStatus.ahead > 0 || gitStatus.behind > 0" class="ml-1 flex items-center gap-1">
              <span v-if="gitStatus.ahead > 0" class="text-green-400 text-xs">↑{{ gitStatus.ahead }}</span>
              <span v-if="gitStatus.behind > 0" class="text-blue-400 text-xs">↓{{ gitStatus.behind }}</span>
            </span>
          </button>
          
          <!-- Branch dropdown -->
          <div class="hidden group-hover:block absolute z-10 mt-1 w-56 bg-gray-800 rounded-md shadow-lg border border-gray-700">
            <div class="py-1">
              <div v-for="branch in branches" :key="branch.name" class="px-3 py-1.5 text-sm flex items-center justify-between hover:bg-gray-700 cursor-pointer"
                   @click="checkoutBranch(branch.name)">
                <span :class="{ 'text-blue-400 font-medium': branch.isCurrent, 'text-gray-300': !branch.isCurrent }">
                  {{ branch.name }}
                </span>
                <i v-if="branch.isCurrent" class="i-mdi-check text-blue-400"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="h-4 w-px bg-gray-700"></div>
        
        <button 
          class="p-1 text-gray-400 hover:text-blue-400"
          :class="{ 'text-green-400': gitStatus.hasUnpushedCommits }"
          :title="gitStatus.hasUnpushedCommits ? 'Push changes' : 'Up to date'"
          @click="pushChanges"
        >
          <i class="i-mdi-upload"></i>
        </button>
        <button 
          class="p-1 text-gray-400 hover:text-blue-400"
          :class="{ 'text-blue-400': gitStatus.behind > 0 }"
          :title="gitStatus.behind > 0 ? `Pull ${gitStatus.behind} commit(s)` : 'Up to date'"
          @click="pullChanges"
        >
          <i class="i-mdi-download"></i>
        </button>
        <button class="p-1 text-gray-400 hover:text-blue-400" title="Refresh" @click="loadGitStatus">
          <i class="i-mdi-refresh"></i>
        </button>
      </div>
      
      <div class="flex items-center gap-1">
        <button 
          v-for="tab in ['changes', 'history', 'branches']" 
          :key="tab"
          class="px-3 py-1 text-xs rounded"
          :class="{
            'bg-blue-900/50 text-blue-300': activeTab === tab,
            'text-gray-400 hover:bg-gray-800': activeTab !== tab
          }"
          @click="activeTab = tab as any"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </div>
    </div>
    
    <!-- Changes Tab -->
    <div v-if="activeTab === 'changes'" class="flex-1 flex flex-col overflow-hidden">
      <!-- Staged Changes -->
      <div v-if="gitStatus.staged.length > 0" class="border-b border-gray-700">
        <div class="px-3 py-1.5 bg-gray-800/50 text-xs font-medium text-gray-400 flex items-center justify-between">
          <span>STAGED CHANGES</span>
          <span class="bg-gray-700 rounded-full px-2 py-0.5">{{ gitStatus.staged.length }}</span>
        </div>
        <div class="divide-y divide-gray-800">
          <div v-for="file in gitStatus.staged" :key="'staged-' + file" class="px-3 py-1.5 text-sm flex items-center hover:bg-gray-800/50">
            <i class="i-mdi-check-circle text-green-500 mr-2"></i>
            <span class="truncate flex-1">{{ file }}</span>
            <button class="p-1 text-gray-500 hover:text-blue-400" @click.stop="unstageFile(file)">
              <i class="i-mdi-close"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Unstaged Changes -->
      <div v-if="gitStatus.unstaged.length > 0" class="border-b border-gray-700">
        <div class="px-3 py-1.5 bg-gray-800/50 text-xs font-medium text-gray-400 flex items-center justify-between">
          <span>UNSTAGED CHANGES</span>
          <div class="flex items-center gap-2">
            <span class="bg-gray-700 rounded-full px-2 py-0.5">{{ gitStatus.unstaged.length }}</span>
            <button 
              class="text-xs text-blue-400 hover:underline" 
              @click="stageAll"
              :disabled="gitStatus.unstaged.length === 0"
            >
              Stage All
            </button>
          </div>
        </div>
        <div class="divide-y divide-gray-800">
          <div v-for="file in gitStatus.unstaged" :key="'unstaged-' + file" class="px-3 py-1.5 text-sm flex items-center hover:bg-gray-800/50">
            <i class="i-mdi-circle-edit-outline text-yellow-500 mr-2"></i>
            <span class="truncate flex-1">{{ file }}</span>
            <button class="p-1 text-gray-500 hover:text-blue-400" @click.stop="stageFile(file)">
              <i class="i-mdi-plus"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Untracked Files -->
      <div v-if="gitStatus.untracked.length > 0" class="border-b border-gray-700">
        <div class="px-3 py-1.5 bg-gray-800/50 text-xs font-medium text-gray-400 flex items-center justify-between">
          <span>UNTRACKED FILES</span>
          <span class="bg-gray-700 rounded-full px-2 py-0.5">{{ gitStatus.untracked.length }}</span>
        </div>
        <div class="divide-y divide-gray-800">
            <div v-for="file in gitStatus.untracked" :key="'untracked-' + file" class="px-3 py-1.5 text-sm flex items-center hover:bg-gray-800/50">
              <i class="i-mdi-file-question-outline text-gray-500 mr-2"></i>
              <span class="truncate flex-1">{{ file }}</span>
              <button class="p-1 text-gray-500 hover:text-blue-400" @click.stop="stageFile(file)">
                <i class="i-mdi-plus"></i>
              </button>
            </div>
        </div>
      </div>
      
      <!-- No Changes -->
      <div v-if="!hasChanges" class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <i class="i-mdi-git text-4xl mb-2"></i>
          <p>No changes detected</p>
        </div>
      </div>
      
      <!-- Commit Form -->
      <div v-if="hasChanges" class="mt-auto border-t border-gray-700 p-2">
        <div class="relative">
          <input
            v-model="commitMessage"
            type="text"
            placeholder="Message (Ctrl+Enter to commit)"
            class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            @keydown.ctrl.enter="commitChanges"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-0.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!commitMessage.trim() || gitStatus.staged.length === 0"
            @click="commitChanges"
          >
            Commit
          </button>
        </div>
      </div>
    </div>
    
    <!-- History Tab -->
    <div v-else-if="activeTab === 'history'" class="flex-1 overflow-auto">
      <div v-if="commitHistory.length === 0" class="flex items-center justify-center h-full text-gray-500">
        <div class="text-center">
          <i class="i-mdi-history text-4xl mb-2"></i>
          <p>No commit history</p>
        </div>
      </div>
      
      <div v-else class="divide-y divide-gray-800">
        <div v-for="commit in commitHistory" :key="commit.hash" class="p-3 hover:bg-gray-800/50">
          <div class="flex items-start gap-3">
            <div class="bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="i-mdi-git-commit text-blue-400"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-200 truncate">{{ commit.message }}</h3>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">{{ commit.hash.substring(0, 7) }}</span>
                  <span v-if="commit.isHead" class="bg-blue-900/50 text-blue-300 text-xs px-1.5 py-0.5 rounded">
                    HEAD
                  </span>
                </div>
              </div>
              <div class="mt-1 text-xs text-gray-400">
                {{ commit.author }} committed {{ new Date(commit.date).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Branches Tab -->
    <div v-else-if="activeTab === 'branches'" class="flex-1 overflow-auto">
      <div class="p-3">
        <h3 class="text-sm font-medium text-gray-200 mb-2">Branches</h3>
        <div class="space-y-1">
          <div 
            v-for="branch in branches" 
            :key="branch.name"
            class="flex items-center justify-between p-2 rounded hover:bg-gray-800/50 cursor-pointer"
            @click="checkoutBranch(branch.name)"
          >
            <div class="flex items-center gap-2">
              <i class="i-mdi-git-branch text-blue-400"></i>
              <span :class="{ 'text-blue-400 font-medium': branch.isCurrent, 'text-gray-300': !branch.isCurrent }">
                {{ branch.name }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="branch.isCurrent" class="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                Current
              </span>
              <i v-else class="i-mdi-chevron-right text-gray-500"></i>
            </div>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-800">
          <h3 class="text-sm font-medium text-gray-200 mb-2">Remote Branches</h3>
          <div class="text-sm text-gray-400 italic">
            Remote branches will be listed here
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// This is needed for TypeScript to recognize the component
export default {
  name: 'GitTab'
};
</script>
