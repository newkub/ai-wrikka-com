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

// State
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

// Computed
const hasChanges = computed(() => {
  return (
    gitStatus.value.staged.length > 0 ||
    gitStatus.value.unstaged.length > 0 ||
    gitStatus.value.untracked.length > 0
  );
});

// Methods
const loadGitStatus = async () => {
  try {
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
  gitStatus.value = {
    ...gitStatus.value,
    unstaged: gitStatus.value.unstaged.filter((f: string) => f !== file),
    staged: [...gitStatus.value.staged, file],
  };
};

const unstageFile = (file: string) => {
  gitStatus.value = {
    ...gitStatus.value,
    staged: gitStatus.value.staged.filter((f: string) => f !== file),
    unstaged: [...gitStatus.value.unstaged, file],
  };
};

const stageAll = () => {
  gitStatus.value = {
    ...gitStatus.value,
    staged: [...gitStatus.value.staged, ...gitStatus.value.unstaged],
    unstaged: [],
  };
};

const commitChanges = () => {
  if (!commitMessage.value.trim() || gitStatus.value.staged.length === 0) return;

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    gitStatus.value.hasUnpushedCommits = false;
    gitStatus.value.ahead = 0;
  } catch (error) {
    console.error("Push failed:", error);
  }
};

const pullChanges = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    gitStatus.value.behind = 0;
  } catch (error) {
    console.error("Pull failed:", error);
  }
};

const checkoutBranch = async (branch: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    gitStatus.value.branch = branch;
    branches.value = branches.value.map((b) => ({
      ...b,
      isCurrent: b.name === branch,
    }));
    loadGitStatus();
  } catch (error) {
    console.error(`Failed to checkout branch ${branch}:`, error);
  }
};

// Lifecycle
onMounted(() => {
  loadGitStatus();
});
</script>

<script lang="ts">
export default {
  name: 'GitTab'
};
</script>

<template>
  <div class="h-full flex flex-col bg-block">
    <!-- Branch and Actions Bar -->
    <div class="flex items-center justify-between p-2 border-b border-border">
      <div class="flex items-center gap-2">
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-2 py-1 bg-block rounded text-sm">
            <i class="i-mdi-git text-primary"></i>
            <span class="font-medium text-text">{{ gitStatus.branch }}</span>
            <i class="i-mdi-chevron-down text-xs text-text/50"></i>
            
            <span v-if="gitStatus.ahead > 0 || gitStatus.behind > 0" class="ml-1 flex items-center gap-1">
              <span v-if="gitStatus.ahead > 0" class="text-success text-xs">↑{{ gitStatus.ahead }}</span>
              <span v-if="gitStatus.behind > 0" class="text-primary text-xs">↓{{ gitStatus.behind }}</span>
            </span>
          </button>
          
          <!-- Branch dropdown -->
          <div class="hidden group-hover:block absolute z-10 mt-1 w-56 bg-block rounded-md shadow-lg border border-border">
            <div class="py-1">
              <div v-for="branch in branches" :key="branch.name" class="px-3 py-1.5 text-sm flex items-center justify-between hover:bg-block/70 cursor-pointer"
                   @click="checkoutBranch(branch.name)">
                <span :class="{ 'text-primary font-medium': branch.isCurrent, 'text-text': !branch.isCurrent }">
                  {{ branch.name }}
                </span>
                <i v-if="branch.isCurrent" class="i-mdi-check text-primary"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="h-4 w-px bg-border"></div>
        
        <button 
          class="p-1 text-text/50 hover:text-primary"
          :class="{ 'text-success': gitStatus.hasUnpushedCommits }"
          :title="gitStatus.hasUnpushedCommits ? 'Push changes' : 'Up to date'"
          @click="pushChanges"
        >
          <i class="i-mdi-upload"></i>
        </button>
        <button 
          class="p-1 text-text/50 hover:text-primary"
          :class="{ 'text-primary': gitStatus.behind > 0 }"
          :title="gitStatus.behind > 0 ? `Pull ${gitStatus.behind} commit(s)` : 'Up to date'"
          @click="pullChanges"
        >
          <i class="i-mdi-download"></i>
        </button>
        <button class="p-1 text-text/50 hover:text-primary" title="Refresh" @click="loadGitStatus">
          <i class="i-mdi-refresh"></i>
        </button>
      </div>
      
      <div class="flex items-center gap-1">
        <button 
          v-for="tab in ['changes', 'history', 'branches']" 
          :key="tab"
          class="px-3 py-1 text-xs rounded"
          :class="{
            'bg-primary/50 text-primary': activeTab === tab,
            'text-text/50 hover:bg-block': activeTab !== tab
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
      <div v-if="gitStatus.staged.length > 0" class="border-b border-border">
        <div class="px-3 py-1.5 bg-block/50 text-xs font-medium text-text/50 flex items-center justify-between">
          <span>STAGED CHANGES</span>
          <span class="bg-block rounded-full px-2 py-0.5">{{ gitStatus.staged.length }}</span>
        </div>
        <div class="divide-y divide-block">
          <div v-for="file in gitStatus.staged" :key="'staged-' + file" class="px-3 py-1.5 text-sm flex items-center hover:bg-block/50">
            <i class="i-mdi-check-circle text-success mr-2"></i>
            <span class="truncate flex-1 text-text">{{ file }}</span>
            <button class="p-1 text-text/50 hover:text-primary" @click.stop="unstageFile(file)">
              <i class="i-mdi-close"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Unstaged Changes -->
      <div v-if="gitStatus.unstaged.length > 0" class="border-b border-border">
        <div class="px-3 py-1.5 bg-block/50 text-xs font-medium text-text/50 flex items-center justify-between">
          <span>UNSTAGED CHANGES</span>
          <div class="flex items-center gap-2">
            <span class="bg-block rounded-full px-2 py-0.5">{{ gitStatus.unstaged.length }}</span>
            <button 
              class="text-xs text-primary hover:underline" 
              @click="stageAll"
              :disabled="gitStatus.unstaged.length === 0"
            >
              Stage All
            </button>
          </div>
        </div>
        <div class="divide-y divide-block">
          <div v-for="file in gitStatus.unstaged" :key="'unstaged-' + file" class="px-3 py-1.5 text-sm flex items-center hover:bg-block/50">
            <i class="i-mdi-circle-edit-outline text-alert mr-2"></i>
            <span class="truncate flex-1 text-text">{{ file }}</span>
            <button class="p-1 text-text/50 hover:text-primary" @click.stop="stageFile(file)">
              <i class="i-mdi-plus"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Untracked Files -->
      <div v-if="gitStatus.untracked.length > 0" class="border-b border-border">
        <div class="px-3 py-1.5 bg-block/50 text-xs font-medium text-text/50 flex items-center justify-between">
          <span>UNTRACKED FILES</span>
          <span class="bg-block rounded-full px-2 py-0.5">{{ gitStatus.untracked.length }}</span>
        </div>
        <div class="divide-y divide-block">
            <div v-for="file in gitStatus.untracked" :key="'untracked-' + file" class="px-3 py-1.5 text-sm flex items-center hover:bg-block/50">
              <i class="i-mdi-file-question-outline text-text/50 mr-2"></i>
              <span class="truncate flex-1 text-text">{{ file }}</span>
              <button class="p-1 text-text/50 hover:text-primary" @click.stop="stageFile(file)">
                <i class="i-mdi-plus"></i>
              </button>
            </div>
        </div>
      </div>
      
      <!-- No Changes -->
      <div v-if="!hasChanges" class="flex-1 flex items-center justify-center text-text/50">
        <div class="text-center">
          <i class="i-mdi-git text-4xl mb-2"></i>
          <p>No changes detected</p>
        </div>
      </div>
      
      <!-- Commit Form -->
      <div v-if="hasChanges" class="mt-auto border-t border-border p-2">
        <div class="relative">
          <input
            v-model="commitMessage"
            type="text"
            placeholder="Message (Ctrl+Enter to commit)"
            class="w-full bg-block border border-border rounded px-3 py-2 text-sm text-text placeholder-text/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            @keydown.ctrl.enter="commitChanges"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-3 py-0.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div v-if="commitHistory.length === 0" class="flex items-center justify-center h-full text-text/50">
        <div class="text-center">
          <i class="i-mdi-history text-4xl mb-2"></i>
          <p>No commit history</p>
        </div>
      </div>
      
      <div v-else class="divide-y divide-block">
        <div v-for="commit in commitHistory" :key="commit.hash" class="p-3 hover:bg-block/50">
          <div class="flex items-start gap-3">
            <div class="bg-primary/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="i-mdi-git-commit text-primary"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-text truncate">{{ commit.message }}</h3>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-text/50">{{ commit.hash.substring(0, 7) }}</span>
                  <span v-if="commit.isHead" class="bg-primary/50 text-primary text-xs px-1.5 py-0.5 rounded">
                    HEAD
                  </span>
                </div>
              </div>
              <div class="mt-1 text-xs text-text/50">
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
        <h3 class="text-sm font-medium text-text mb-2">Branches</h3>
        <div class="space-y-1">
          <div 
            v-for="branch in branches" 
            :key="branch.name"
            class="flex items-center justify-between p-2 rounded hover:bg-block/50 cursor-pointer"
            @click="checkoutBranch(branch.name)"
          >
            <div class="flex items-center gap-2">
              <i class="i-mdi-git-branch text-primary"></i>
              <span :class="{ 'text-primary font-medium': branch.isCurrent, 'text-text': !branch.isCurrent }">
                {{ branch.name }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="branch.isCurrent" class="text-xs bg-primary/50 text-primary px-2 py-0.5 rounded">
                Current
              </span>
              <i v-else class="i-mdi-chevron-right text-text/50"></i>
            </div>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-block">
          <h3 class="text-sm font-medium text-text mb-2">Remote Branches</h3>
          <div class="text-sm text-text/50 italic">
            Remote branches will be listed here
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
