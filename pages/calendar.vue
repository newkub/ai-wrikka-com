<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

type ViewMode = "day" | "week" | "month" | "year";

interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	description?: string;
	color?: string;
	allDay?: boolean;
}

interface SerializedCalendarEvent extends Omit<CalendarEvent, "start" | "end"> {
	start: string;
	end: string;
}

const currentDate = ref(new Date());
const viewMode = ref<ViewMode>("month");
const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const showEventModal = ref(false);
const selectedDate = ref<Date | null>(null);
const events = ref<CalendarEvent[]>([]);
const currentEvent = ref<Partial<CalendarEvent>>({
	title: "",
	start: new Date(),
	end: new Date(new Date().setHours(new Date().getHours() + 1)),
	allDay: false,
	color: "#3b82f6",
});

// Load events from localStorage
onMounted(() => {
	const savedEvents = localStorage.getItem("calendarEvents");
	if (savedEvents) {
		const parsedEvents = JSON.parse(savedEvents) as SerializedCalendarEvent[];
		events.value = parsedEvents.map((event) => ({
			...event,
			start: new Date(event.start),
			end: new Date(event.end),
		}));
	}
});

// Save events to localStorage
const saveEvents = () => {
	localStorage.setItem("calendarEvents", JSON.stringify(events.value));
};

const formatDate = (date: Date) => {
	return date.toISOString().split("T")[0];
};

const daysInMonth = (year: number, month: number) => {
	return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (date: Date) => {
	return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const monthName = (month: number) => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return months[month];
};

const navigate = (direction: number) => {
	const newDate = new Date(currentDate.value);

	switch (viewMode.value) {
		case "day":
			newDate.setDate(newDate.getDate() + direction);
			break;
		case "week":
			newDate.setDate(newDate.getDate() + 7 * direction);
			break;
		case "month":
			newDate.setMonth(newDate.getMonth() + direction);
			break;
		case "year":
			newDate.setFullYear(newDate.getFullYear() + direction);
			break;
	}

	currentDate.value = newDate;
};

const prev = () => navigate(-1);
const next = () => navigate(1);

const today = () => {
	currentDate.value = new Date();
};

const setView = (mode: ViewMode) => {
	viewMode.value = mode;
};

const getDaysInMonth = computed(() => {
	const year = currentDate.value.getFullYear();
	const month = currentDate.value.getMonth();
	const days = [];

	const firstDay = firstDayOfMonth(currentDate.value);
	const totalDays = daysInMonth(year, month);
	const prevMonthDays = daysInMonth(year, month - 1);

	// Add days from previous month
	for (let i = firstDay - 1; i >= 0; i--) {
		days.push({
			day: prevMonthDays - i,
			date: new Date(year, month - 1, prevMonthDays - i),
			isCurrentMonth: false,
			isToday: false,
		});
	}

	// Add days of current month
	const today = new Date();
	for (let i = 1; i <= totalDays; i++) {
		const date = new Date(year, month, i);
		days.push({
			day: i,
			date,
			isCurrentMonth: true,
			isToday: date.toDateString() === today.toDateString(),
		});
	}

	// Add days from next month to complete the grid
	const remainingDays = 42 - days.length; // 6 rows x 7 days
	for (let i = 1; i <= remainingDays; i++) {
		days.push({
			day: i,
			date: new Date(year, month + 1, i),
			isCurrentMonth: false,
			isToday: false,
		});
	}

	return days;
});

const getEventsForDate = (date: Date) => {
	return events.value.filter((event) => {
		const eventDate = new Date(event.start).toDateString();
		return eventDate === date.toDateString();
	});
};

const isToday = (date: Date) => {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};

const getFirstDayOfMonth = (month: number) => {
	return new Date(currentDate.value.getFullYear(), month, 1).getDay();
};

const getDaysInYearMonth = (month: number) => {
	const daysInMonth = new Date(
		currentDate.value.getFullYear(),
		month + 1,
		0,
	).getDate();
	const firstDay = getFirstDayOfMonth(month);
	const days = Array(firstDay).fill(0);
	return [...days, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
};

const getWeekDates = computed(() => {
	const startOfWeek = new Date(currentDate.value);
	const day = startOfWeek.getDay();
	const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
	const monday = new Date(startOfWeek.setDate(diff));

	return Array.from({ length: 7 }, (_, i) => {
		const date = new Date(monday);
		date.setDate(monday.getDate() + i);
		return date;
	});
});

const getEventsForHour = (hour: number) => {
	const targetDate = new Date(currentDate.value);
	targetDate.setHours(hour, 0, 0, 0);
	const nextHour = new Date(targetDate);
	nextHour.setHours(hour + 1, 0, 0, 0);

	return events.value.filter((event) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);
		return eventStart < nextHour && eventEnd > targetDate;
	});
};

const getEventsForDateAndHour = (date: Date, hour: number) => {
	const targetDate = new Date(date);
	targetDate.setHours(hour, 0, 0, 0);
	const nextHour = new Date(targetDate);
	nextHour.setHours(hour + 1, 0, 0, 0);

	return events.value.filter((event) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);
		return (
			eventStart < nextHour &&
			eventEnd > targetDate &&
			eventStart.getDate() === date.getDate() &&
			eventStart.getMonth() === date.getMonth() &&
			eventStart.getFullYear() === date.getFullYear()
		);
	});
};

const handleDateClick = (date: Date) => {
	selectedDate.value = date;
	currentEvent.value = {
		title: "",
		start: new Date(date.setHours(9, 0, 0, 0)),
		end: new Date(date.setHours(10, 0, 0, 0)),
		allDay: false,
		color: "#3b82f6",
	};
	showEventModal.value = true;
};

const handleHourClick = (hour: number) => {
	const date = new Date(currentDate.value);
	date.setHours(hour, 0, 0, 0);
	handleDateClick(date);
};

const handleDayHourClick = (date: Date, hour: number) => {
	const newDate = new Date(date);
	newDate.setHours(hour, 0, 0, 0);
	handleDateClick(newDate);
};

const handleMonthDayClick = (month: number, day: number) => {
	if (day === 0) return; // Skip placeholder days

	const date = new Date(currentDate.value.getFullYear(), month, day);
	currentDate.value = date;
	viewMode.value = "day";
};

const saveEvent = () => {
	if (!currentEvent.value.title) return;

	if (!currentEvent.value.id) {
		// New event
		const newEvent: CalendarEvent = {
			id: Date.now().toString(),
			title: currentEvent.value.title,
			start: currentEvent.value.start || new Date(),
			end: currentEvent.value.end || new Date(),
			allDay: currentEvent.value.allDay || false,
			color: currentEvent.value.color || "#3b82f6",
			description: currentEvent.value.description,
		};
		events.value.push(newEvent);
	} else {
		// Update existing event
		const index = events.value.findIndex((e) => e.id === currentEvent.value.id);
		if (index !== -1) {
			events.value[index] = {
				...events.value[index],
				title: currentEvent.value.title || "",
				start: currentEvent.value.start || new Date(),
				end: currentEvent.value.end || new Date(),
				allDay: currentEvent.value.allDay || false,
				color: currentEvent.value.color || "#3b82f6",
				description: currentEvent.value.description,
			};
		}
	}

	saveEvents();
	showEventModal.value = false;
};

const deleteEvent = (id: string) => {
	events.value = events.value.filter((event) => event.id !== id);
	saveEvents();
	showEventModal.value = false;
};

const editEvent = (event: CalendarEvent, e: Event) => {
	e.stopPropagation();
	currentEvent.value = { ...event };
	showEventModal.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto p-4 h-screen flex flex-col">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 class="text-2xl font-bold">
          {{ viewMode === 'month' ? `${monthName(currentDate.getMonth())} ${currentDate.getFullYear()}` : '' }}
          {{ viewMode === 'week' ? `Week of ${formatWeek(currentDate)}` : '' }}
          {{ viewMode === 'day' ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '' }}
          {{ viewMode === 'year' ? currentDate.getFullYear() : '' }}
        </h1>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="today" class="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Today
          </button>
          <div class="flex border border-border rounded-md overflow-hidden">
            <button 
              v-for="mode in ['day', 'week', 'month', 'year']" 
              :key="mode"
              @click="setView(mode as ViewMode)"
              class="px-3 py-1 text-sm transition-colors"
              :class="{
                'bg-primary text-primary-foreground': viewMode === mode,
                'hover:bg-accent': viewMode !== mode
              }"
            >
              {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
            </button>
          </div>
          <div class="flex items-center border border-border rounded-md overflow-hidden">
            <button @click="prev" class="p-2 hover:bg-accent">
              <span class="i-mdi-chevron-left"></span>
            </button>
            <button @click="next" class="p-2 hover:bg-accent">
              <span class="i-mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar View -->
      <div class="flex-1 overflow-hidden flex flex-col border rounded-lg">
        <!-- Day View -->
        <div v-if="viewMode === 'day'" class="flex-1 overflow-auto">
          <div class="divide-y divide-border">
            <div 
              v-for="hour in 24" 
              :key="hour" 
              class="flex h-16 border-b border-border last:border-b-0"
            >
              <div class="w-20 p-2 text-right text-sm text-muted-foreground">
                {{ hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM` }}
              </div>
              <div 
                class="flex-1 border-l border-border p-1 relative"
                @dblclick="handleHourClick(hour - 1)"
              >
                <div 
                  v-for="event in getEventsForHour(hour - 1)" 
                  :key="event.id"
                  @click.stop="editEvent(event, $event)"
                  class="absolute left-0 right-0 mx-1 p-1 rounded text-xs truncate cursor-pointer"
                  :style="{
                    top: `${(new Date(event.start).getMinutes() / 60) * 100}%`,
                    height: `${((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60)) * 100}%`,
                    backgroundColor: `${event.color}20`,
                    borderLeft: `3px solid ${event.color}`
                  }"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-else-if="viewMode === 'week'" class="flex-1 flex flex-col">
          <!-- Week Header -->
          <div class="grid grid-cols-8 border-b">
            <div class="border-r p-2"></div>
            <div 
              v-for="(date, index) in getWeekDates" 
              :key="index"
              class="border-r p-2 text-center"
              :class="{ 'bg-muted/50': isToday(date) }"
            >
              <div class="font-medium">{{ daysInWeek[date.getDay()] }}</div>
              <div class="text-sm">{{ date.getDate() }}</div>
            </div>
          </div>
          <!-- Week Grid -->
          <div class="flex-1 overflow-auto">
            <div 
              v-for="hour in 24" 
              :key="hour" 
              class="grid grid-cols-8 border-b border-border"
            >
              <div class="w-20 p-1 text-right text-sm text-muted-foreground border-r">
                {{ hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM` }}
              </div>
              <div 
                v-for="(date, index) in getWeekDates" 
                :key="index"
                class="border-r border-border p-1 relative min-h-16"
                @dblclick="handleDayHourClick(date, hour - 1)"
              >
                <div 
                  v-for="event in getEventsForDateAndHour(date, hour - 1)" 
                  :key="event.id"
                  @click.stop="editEvent(event, $event)"
                  class="absolute left-0 right-0 mx-1 p-1 rounded text-xs truncate cursor-pointer"
                  :style="{
                    top: `${(new Date(event.start).getMinutes() / 60) * 100}%`,
                    height: `${Math.min(((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60)) * 100, (1 - (new Date(event.start).getMinutes() / 60)) * 100)}%`,
                    backgroundColor: `${event.color}20`,
                    borderLeft: `3px solid ${event.color}`
                  }"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Month View -->
        <div v-else-if="viewMode === 'month'" class="flex-1 flex flex-col">
          <!-- Day Names -->
          <div class="grid grid-cols-7 border-b">
            <div 
              v-for="day in daysInWeek" 
              :key="day" 
              class="text-center font-medium p-2 border-r last:border-r-0"
            >
              {{ day }}
            </div>
          </div>
          
          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-px bg-border flex-1 overflow-auto">
            <div 
              v-for="(dateObj, index) in getDaysInMonth" 
              :key="index"
              @dblclick="handleDateClick(dateObj.date)"
              class="bg-background p-1 min-h-24 flex flex-col"
              :class="{
                'bg-muted/50': dateObj.isToday,
                'text-muted-foreground/50': !dateObj.isCurrentMonth
              }"
            >
              <div class="text-right p-1">
                <span 
                  class="inline-flex items-center justify-center rounded-full w-6 h-6"
                  :class="{
                    'bg-primary text-primary-foreground': dateObj.isToday
                  }"
                >
                  {{ dateObj.day }}
                </span>
              </div>
              <div class="flex-1 overflow-y-auto space-y-1">
                <div 
                  v-for="event in getEventsForDate(dateObj.date)" 
                  :key="event.id"
                  @click.stop="editEvent(event, $event)"
                  class="text-xs p-1 rounded truncate cursor-pointer"
                  :style="{ backgroundColor: `${event.color}20`, borderLeft: `3px solid ${event.color}` }"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Year View -->
        <div v-else-if="viewMode === 'year'" class="p-4 overflow-auto">
          <div class="grid grid-cols-4 gap-4">
            <div 
              v-for="month in 12" 
              :key="month"
              class="border rounded-lg p-2"
            >
              <div class="text-center font-medium mb-2">
                {{ new Date(currentDate.getFullYear(), month - 1).toLocaleDateString('en-US', { month: 'long' }) }}
              </div>
              <div class="grid grid-cols-7 gap-1 text-xs">
                <div 
                  v-for="day in daysInWeek" 
                  :key="day" 
                  class="text-center font-medium text-muted-foreground"
                >
                  {{ day[0] }}
                </div>
              </div>
              <div class="grid grid-cols-7 gap-1 mt-1">
                <div 
                  v-for="(day, index) in getDaysInYearMonth(month - 1)" 
                  :key="index"
                  class="text-center p-1 rounded-full"
                  :class="{
                    'bg-primary text-primary-foreground': isToday(new Date(currentDate.getFullYear(), month - 1, day)),
                    'text-muted-foreground/50': index < getFirstDayOfMonth(month - 1) || day === 0
                  }"
                  @click="handleMonthDayClick(month - 1, day)"
                >
                  {{ day || '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <div v-if="showEventModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-background rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-medium">
            {{ currentEvent.id ? 'Edit Event' : 'New Event' }}
          </h3>
          <button @click="showEventModal = false" class="text-muted-foreground hover:text-foreground">
            <span class="i-mdi-close text-xl"></span>
          </button>
        </div>
        
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input 
              v-model="currentEvent.title"
              type="text" 
              class="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Event title"
            >
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Start</label>
              <input 
                v-model="currentEvent.start"
                type="datetime-local" 
                class="w-full px-3 py-2 border rounded-md bg-background"
                :class="{ 'opacity-50': currentEvent.allDay }"
                :disabled="currentEvent.allDay"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">End</label>
              <input 
                v-model="currentEvent.end"
                type="datetime-local" 
                class="w-full px-3 py-2 border rounded-md bg-background"
                :class="{ 'opacity-50': currentEvent.allDay }"
                :disabled="currentEvent.allDay"
              >
            </div>
          </div>
          
          <div class="flex items-center">
            <input 
              id="allDay"
              v-model="currentEvent.allDay"
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            >
            <label for="allDay" class="ml-2 text-sm">All day</label>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea 
              v-model="currentEvent.description"
              class="w-full px-3 py-2 border rounded-md bg-background"
              rows="3"
              placeholder="Add details..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Color</label>
            <div class="flex space-x-2">
              <div 
                v-for="color in ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']"
                :key="color"
                @click="currentEvent.color = color"
                class="w-6 h-6 rounded-full cursor-pointer border-2"
                :class="{ 'border-primary': currentEvent.color === color }"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t flex justify-between">
          <button 
            v-if="currentEvent.id"
            @click="deleteEvent(currentEvent.id!)" 
            class="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-md"
          >
            Delete
          </button>
          <div class="ml-auto space-x-2">
            <button 
              @click="showEventModal = false"
              class="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button 
              @click="saveEvent"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              :disabled="!currentEvent.title"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Helper function to format week range
export function formatWeek(date: Date): string {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  
  const start = new Date(startOfWeek.setDate(diff));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', { ...formatOptions, year: 'numeric' })}`;
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground)/0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground)/0.5);
}

/* Smooth transitions */
button, .transition-colors {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Event item hover effect */
.event-item {
  transition: transform 0.1s, box-shadow 0.1s;
}

.event-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>