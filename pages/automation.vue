<script setup lang="ts">
interface Automation {
	id: string;
	name: string;
	description: string;
	isActive: boolean;
	trigger: {
		type: string;
		condition: string;
	};
	actions: Array<{
		type: string;
		config: Record<string, string | number | boolean | string[] | undefined>;
	}>;
}

const automations = ref<Automation[]>([
	{
		id: "1",
		name: "Auto-responder",
		description: "Send automatic reply to new emails",
		isActive: true,
		trigger: {
			type: "new_email",
			condition: "from:important@example.com",
		},
		actions: [
			{
				type: "send_email",
				config: {
					to: "{{sender}}",
					subject: "Re: {{subject}}",
					body: "Thank you for your email. I will get back to you soon.",
				},
			},
		],
	},
	{
		id: "2",
		name: "Task from Email",
		description: "Create task from starred emails",
		isActive: true,
		trigger: {
			type: "email_starred",
			condition: "label:work",
		},
		actions: [
			{
				type: "create_task",
				config: {
					title: "Follow up: {{subject}}",
					description: "{{body}}",
					dueDate: "{{date + 2 days}}",
					priority: "high",
				},
			},
		],
	},
	{
		id: "3",
		name: "Weekly Report",
		description: "Send weekly summary every Monday",
		isActive: false,
		trigger: {
			type: "schedule",
			condition: "every monday at 9:00am",
		},
		actions: [
			{
				type: "send_email",
				config: {
					to: "team@example.com",
					subject: "Weekly Report - {{date}}",
					body: "Here's your weekly summary...",
				},
			},
		],
	},
]);

const selectedAutomation = ref<Automation | null>(null);
const isCreatingNew = ref(false);
const searchQuery = ref("");

const filteredAutomations = computed(() => {
	if (!searchQuery.value) return automations.value;
	const query = searchQuery.value.toLowerCase();
	return automations.value.filter(
		(a) =>
			a.name.toLowerCase().includes(query) ||
			a.description.toLowerCase().includes(query),
	);
});

const toggleAutomation = (automation: Automation) => {
	automation.isActive = !automation.isActive;
};

const deleteAutomation = (id: string) => {
	const index = automations.value.findIndex((a) => a.id === id);
	if (index !== -1) {
		automations.value.splice(index, 1);
		if (selectedAutomation.value?.id === id) {
			selectedAutomation.value = null;
		}
	}
};
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Left sidebar -->
    <div class="w-80 border-r border-border p-4 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Automation</h1>
        <button 
          @click="isCreatingNew = true; selectedAutomation = null"
          class="p-2 rounded-full hover:bg-muted"
        >
          <span class="i-mdi-plus" />
        </button>
      </div>
      
      <div class="mb-4">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <span class="i-mdi-magnify" />
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search automations..."
            class="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto space-y-2">
        <div 
          v-for="automation in filteredAutomations" 
          :key="automation.id"
          @click="selectedAutomation = automation; isCreatingNew = false"
          class="p-3 rounded-lg border border-border cursor-pointer transition-colors"
          :class="{
            'border-primary bg-primary/5': selectedAutomation?.id === automation.id,
            'hover:bg-muted/30': selectedAutomation?.id !== automation.id
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="font-medium flex items-center">
                <span class="i-mdi-robot mr-2" />
                {{ automation.name }}
              </div>
              <p class="text-sm text-muted-foreground mt-1">
                {{ automation.description }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click.stop="toggleAutomation(automation)"
                class="w-8 h-5 rounded-full p-0.5 transition-colors"
                :class="{
                  'bg-primary': automation.isActive,
                  'bg-muted-foreground/20': !automation.isActive
                }"
              >
                <span 
                  class="block w-4 h-4 bg-background rounded-full shadow-md transform transition-transform"
                  :class="{ 'translate-x-3': automation.isActive }"
                />
              </button>
              <button 
                @click.stop="deleteAutomation(automation.id)"
                class="text-muted-foreground hover:text-destructive p-1"
              >
                <span class="i-mdi-trash-can" />
              </button>
            </div>
          </div>
        </div>
        
        <div 
          v-if="filteredAutomations.length === 0" 
          class="text-center p-8 text-muted-foreground"
        >
          <div class="i-mdi-robot-outline text-4xl mx-auto mb-2 opacity-20" />
          <p>No automations found</p>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <div v-if="isCreatingNew" class="p-8">
        <h2 class="text-2xl font-semibold mb-6">Create New Automation</h2>
        <div class="max-w-2xl space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              class="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="e.g., Auto-responder"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea 
              class="w-full px-3 py-2 border border-border rounded-md bg-background"
              rows="2"
              placeholder="What does this automation do?"
            ></textarea>
          </div>
          
          <div class="border-t border-border pt-4">
            <h3 class="font-medium mb-3">Trigger</h3>
            <div class="space-y-4">
              <div class="flex items-center space-x-3 p-3 border border-border rounded-md">
                <div class="p-2 bg-primary/10 text-primary rounded-md">
                  <span class="i-mdi-email" />
                </div>
                <div class="flex-1">
                  <div class="font-medium">New Email</div>
                  <div class="text-sm text-muted-foreground">When a new email arrives</div>
                </div>
                <span class="i-mdi-chevron-right" />
              </div>
              
              <div class="flex items-center space-x-3 p-3 border border-border rounded-md">
                <div class="p-2 bg-primary/10 text-primary rounded-md">
                  <span class="i-mdi-calendar" />
                </div>
                <div class="flex-1">
                  <div class="font-medium">Scheduled</div>
                  <div class="text-sm text-muted-foreground">Runs at a specific time</div>
                </div>
                <span class="i-mdi-chevron-right" />
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button 
              @click="isCreatingNew = false"
              class="px-4 py-2 border border-border rounded-md"
            >
              Cancel
            </button>
            <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Create Automation
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="selectedAutomation" class="p-8">
        <div class="max-w-4xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-semibold">{{ selectedAutomation.name }}</h2>
              <p class="text-muted-foreground">{{ selectedAutomation.description }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm px-2 py-1 rounded-full" :class="selectedAutomation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ selectedAutomation.isActive ? 'Active' : 'Inactive' }}
              </span>
              <button class="p-2 text-muted-foreground hover:bg-muted rounded-md">
                <span class="i-mdi-pencil" />
              </button>
              <button class="p-2 text-muted-foreground hover:bg-muted rounded-md">
                <span class="i-mdi-dots-vertical" />
              </button>
            </div>
          </div>
          
          <div class="space-y-8">
            <!-- Trigger Section -->
            <div class="bg-muted/30 rounded-lg p-6">
              <h3 class="font-medium mb-4 flex items-center">
                <span class="i-mdi-flash mr-2" />
                Trigger
              </h3>
              
              <div class="bg-background border border-border rounded-md p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-primary/10 text-primary rounded-md mr-3">
                    <span v-if="selectedAutomation.trigger.type === 'new_email'" class="i-mdi-email" />
                    <span v-else-if="selectedAutomation.trigger.type === 'schedule'" class="i-mdi-calendar" />
                    <span v-else class="i-mdi-flash" />
                  </div>
                  <div>
                    <div class="font-medium">
                      {{ 
                        selectedAutomation.trigger.type === 'new_email' ? 'When a new email arrives' :
                        selectedAutomation.trigger.type === 'schedule' ? 'Scheduled' :
                        'Trigger'
                      }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ selectedAutomation.trigger.condition }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions Section -->
            <div class="bg-muted/30 rounded-lg p-6">
              <h3 class="font-medium mb-4 flex items-center">
                <span class="i-mdi-playlist-play mr-2" />
                Actions
              </h3>
              
              <div class="space-y-3">
                <div 
                  v-for="(action, index) in selectedAutomation.actions" 
                  :key="index"
                  class="bg-background border border-border rounded-md p-4"
                >
                  <div class="flex items-start">
                    <div class="p-2 bg-primary/10 text-primary rounded-md mr-3 mt-0.5">
                      <span v-if="action.type === 'send_email'" class="i-mdi-email" />
                      <span v-else-if="action.type === 'create_task'" class="i-mdi-check-circle" />
                      <span v-else class="i-mdi-play" />
                    </div>
                    <div class="flex-1">
                      <div class="font-medium">
                        {{ 
                          action.type === 'send_email' ? 'Send an email' :
                          action.type === 'create_task' ? 'Create a task' :
                          'Action'
                        }}
                      </div>
                      <div class="text-sm text-muted-foreground mt-1">
                        <div v-for="(value, key) in action.config" :key="key" class="truncate">
                          <span class="text-muted-foreground/70">{{ key }}:</span> {{ value }}
                        </div>
                      </div>
                    </div>
                    <button class="p-1 text-muted-foreground hover:text-foreground">
                      <span class="i-mdi-pencil" />
                    </button>
                  </div>
                </div>
                
                <button class="w-full py-2 border-2 border-dashed border-border rounded-md text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center">
                  <span class="i-mdi-plus mr-1" /> Add Action
                </button>
              </div>
            </div>
            
            <!-- Test & Save -->
            <div class="flex justify-end space-x-3 pt-4">
              <button class="px-4 py-2 border border-border rounded-md">
                Test
              </button>
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
        <div class="text-center max-w-md">
          <div class="i-mdi-robot-outline text-5xl mx-auto mb-4 opacity-20" />
          <h3 class="text-xl font-medium mb-2">No Automation Selected</h3>
          <p class="mb-6">Select an automation from the sidebar or create a new one to get started.</p>
          <button 
            @click="isCreatingNew = true"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center mx-auto"
          >
            <span class="i-mdi-plus mr-1" /> New Automation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>