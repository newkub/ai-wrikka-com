<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
// Icons will be used from UnoCSS
import { onClickOutside } from "@vueuse/core";

defineOptions({
	name: "ComboBox",
});

type ItemValue = string | number | boolean | object | null | undefined;

interface Item {
	value: ItemValue;
	label: string;
	disabled?: boolean;
	[key: string]: unknown;
}

type ItemValueArray = ItemValue[];

interface Props {
	/** Selected value */
	modelValue?: ItemValue | ItemValue[];
	/** List of items */
	items: Item[];
	/** Label text */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Disable the combobox */
	disabled?: boolean;
	/** Show loading state */
	loading?: boolean;
	/** Allow clearing the selection */
	clearable?: boolean;
	/** Allow searching/filtering */
	searchable?: boolean;
	/** Custom item text key */
	itemText?: string;
	/** Custom item value key */
	itemValue?: string;
	/** Custom no results text */
	noResultsText?: string;
	/** Custom loading text */
	loadingText?: string;
	/** Custom clear button text */
	clearText?: string;
	/** Custom dropdown width */
	dropdownWidth?: string;
	/** Custom dropdown max height */
	dropdownMaxHeight?: string;
	/** Custom class for the combobox */
	class?: string;
	/** Custom class for the dropdown */
	dropdownClass?: string;
	/** Custom class for the input */
	inputClass?: string;
	/** Custom class for the label */
	labelClass?: string;
	/** Custom class for the error message */
	errorClass?: string;
	/** Error message */
	error?: string;
	/** Show error state */
	hasError?: boolean;
	/** Allow multiple selection */
	multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: null,
	items: () => [],
	label: "",
	placeholder: "Select an option",
	disabled: false,
	loading: false,
	clearable: true,
	searchable: true,
	itemText: "label",
	itemValue: "value",
	noResultsText: "No results found",
	loadingText: "Loading...",
	clearText: "Clear",
	dropdownWidth: "w-full",
	dropdownMaxHeight: "max-h-60",
	class: "",
	dropdownClass: "",
	inputClass: "",
	labelClass: "",
	errorClass: "",
	error: "",
	hasError: false,
	multiple: false,
});

const emit = defineEmits<{
	(e: "update:modelValue", value: ItemValue | ItemValue[]): void;
	(e: "update:search", value: string): void;
	(e: "change", value: ItemValue | ItemValue[]): void;
	(e: "open"): void;
	(e: "close"): void;
	(e: "clear"): void;
}>();

const comboboxRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref("");
const highlightedIndex = ref(-1);
const selectedItems = ref<Item[]>([]);

// Type guard to check if a value is an array of ItemValue
const isItemValueArray = (value: unknown): value is ItemValue[] => {
	return (
		Array.isArray(value) &&
		value.every(
			(v) =>
				typeof v === "string" ||
				typeof v === "number" ||
				typeof v === "boolean" ||
				v === null ||
				v === undefined ||
				typeof v === "object",
		)
	);
};

// Update selected items when modelValue changes
watch(
	() => props.modelValue,
	(newVal: ItemValue | ItemValue[] | null | undefined) => {
		updateSelectedItems(newVal);
	},
	{ immediate: true },
);

// Update search query when items change
watch(
	() => props.items,
	() => {
		if (searchQuery.value) {
			highlightedIndex.value = 0;
		}
	},
	{ deep: true },
);

// Filter items based on search query
const filteredItems = computed(() => {
	if (!props.searchable || !searchQuery.value) {
		return props.items;
	}

	const query = searchQuery.value.toLowerCase();
	return props.items.filter((item) => {
		const label = getItemLabel(item);
		return typeof label === "string" && label.toLowerCase().includes(query);
	});
});

// Check if an item is selected
const isSelected = (item: Item): boolean => {
	const itemValue = getItemValue(item);
	if (itemValue === null || itemValue === undefined) return false;

	if (props.multiple && Array.isArray(props.modelValue)) {
		return props.modelValue.some(
			(val) => val !== null && val !== undefined && val === itemValue,
		);
	}

	return itemValue === props.modelValue;
};

// Get item label
const getItemLabel = (item: Item): string => {
	const label = item[props.itemText];
	return typeof label === "string" ? label : String(label || "");
};

// Get item value
const getItemValue = (item: Item): ItemValue => {
	if (props.itemValue in item) {
		const value = item[props.itemValue];
		if (value !== undefined && value !== null) {
			return value as ItemValue;
		}
	}

	if ("value" in item && item.value !== undefined) {
		return item.value as ItemValue;
	}

	return null;
};

// Update selected items based on modelValue
const updateSelectedItems = (
	value: ItemValue | ItemValue[] | null | undefined,
) => {
	if (value === null || value === undefined) {
		selectedItems.value = [];
		return;
	}

	if (Array.isArray(value)) {
		selectedItems.value = value
			.filter((val): val is ItemValue => val !== null && val !== undefined)
			.map((val) => {
				// Find the item with matching value
				const foundItem = props.items.find((item) => {
					const itemVal = getItemValue(item);
					return itemVal !== null && itemVal !== undefined && itemVal === val;
				});

				// Return the found item or create a new one
				return (
					foundItem || {
						value: val,
						label: typeof val === "object" ? JSON.stringify(val) : String(val),
						disabled: false,
					}
				);
			});
	} else {
		// Handle single value
		const selectedItem = props.items.find((item) => {
			const itemVal = getItemValue(item);
			return itemVal !== null && itemVal !== undefined && itemVal === value;
		});

		selectedItems.value = selectedItem ? [selectedItem] : [];
	}
};

// Handle item selection
const selectItem = (item: Item) => {
	if (item.disabled) return;

	if (props.multiple) {
		const itemValue = getItemValue(item);
		if (itemValue === null || itemValue === undefined) return;

		const currentValue = Array.isArray(props.modelValue)
			? [...props.modelValue].filter(
					(v): v is ItemValue => v !== null && v !== undefined,
				)
			: [];

		const index = currentValue.findIndex((val) => val === itemValue);

		const newValue = [...currentValue];
		if (index === -1) {
			newValue.push(itemValue);
		} else {
			newValue.splice(index, 1);
		}

		emit("update:modelValue", newValue);
		emit("change", newValue);
	} else {
		const newValue = getItemValue(item);
		emit("update:modelValue", newValue);
		emit("change", newValue);

		// Close dropdown for single select
		closeDropdown();
	}

	// Reset search query
	searchQuery.value = "";
};

// Handle input change
const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement | null;
	if (!target) return;

	const value = target.value || "";
	searchQuery.value = value;
	emit("update:search", value);

	// Reset highlighted index when searching
	highlightedIndex.value = -1;

	if (!isOpen.value) {
		openDropdown();
	}
};

// Toggle dropdown
const toggleDropdown = () => {
	if (props.disabled || props.loading) return;

	if (isOpen.value) {
		closeDropdown();
	} else {
		openDropdown();
	}
};

// Open dropdown
const openDropdown = () => {
	if (isOpen.value || props.disabled || props.loading) return;

	isOpen.value = true;
	emit("open");

	// Focus input when dropdown opens
	nextTick(() => {
		if (props.searchable && inputRef.value) {
			inputRef.value.focus();
		}
	});
};

// Close dropdown
const closeDropdown = () => {
	if (!isOpen.value) return;

	isOpen.value = false;
	searchQuery.value = "";
	highlightedIndex.value = -1;
	emit("close");
};

// Handle clear button click
const handleClear = (event: Event) => {
	event.stopPropagation();
	clearSelection(event);

	if (inputRef.value) {
		inputRef.value.focus();
	}

	// Reset search query
	searchQuery.value = "";
	emit("update:search", "");
};

// Clear selection
const clearSelection = (event: Event) => {
	event.stopPropagation();

	if (props.disabled || props.loading) return;

	const newValue = props.multiple ? [] : null;
	emit("update:modelValue", newValue);
	emit("change", newValue);
	emit("clear");

	// Close dropdown if open
	if (isOpen.value) {
		closeDropdown();
	}
};

// Handle keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
	if (!isOpen.value) {
		if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
			event.preventDefault();
			openDropdown();
		}
		return;
	}

	const handleArrowDown = () => {
		event.preventDefault();
		if (highlightedIndex.value < filteredItems.value.length - 1) {
			highlightedIndex.value++;
			scrollToHighlighted();
		}
	};

	const handleArrowUp = () => {
		event.preventDefault();
		if (highlightedIndex.value > 0) {
			highlightedIndex.value--;
			scrollToHighlighted();
		}
	};

	const handleEnterOrSpace = () => {
		event.preventDefault();
		const item = filteredItems.value[highlightedIndex.value];
		if (item && !item.disabled) {
			selectItem(item);
		}
	};

	const keyHandlers: Record<string, () => void> = {
		Escape: () => {
			event.preventDefault();
			closeDropdown();
		},
		ArrowDown: handleArrowDown,
		ArrowUp: handleArrowUp,
		Enter: handleEnterOrSpace,
		" ": handleEnterOrSpace,
		Tab: () => closeDropdown(),
	};

	const handler = keyHandlers[event.key];
	if (handler) {
		handler();
	}
};

// Scroll to highlighted item
const scrollToHighlighted = () => {
	if (!dropdownRef.value) return;

	const items =
		dropdownRef.value.querySelectorAll<HTMLElement>('[role="option"]');
	const targetItem = items[highlightedIndex.value];

	if (targetItem) {
		targetItem.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "nearest",
		});
	}
};

// Handle click outside
onClickOutside(comboboxRef, () => {
	closeDropdown();
});

// Add/remove event listeners
onMounted(() => {
	document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
});

// Computed classes
const comboboxClasses = computed(() => {
	const base = "relative w-full";
	return [base, props.class].filter(Boolean).join(" ");
});

const inputWrapperClasses = computed(() => {
	const base = "relative mt-1 rounded-md shadow-sm";
	return [base].filter(Boolean).join(" ");
});

const inputClasses = computed(() => {
	const base =
		"block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm";
	const disabled = "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700";
	const error =
		"border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500";

	return [
		base,
		props.disabled ? disabled : "",
		props.hasError || props.error ? error : "",
		props.inputClass,
	]
		.filter(Boolean)
		.join(" ");
});

const labelClasses = computed(() => {
	const base = "block text-sm font-medium text-gray-700 dark:text-gray-300";
	return [base, props.labelClass].filter(Boolean).join(" ");
});

const errorClasses = computed(() => {
	const base = "mt-1 text-sm text-red-600 dark:text-red-400";
	return [base, props.errorClass].filter(Boolean).join(" ");
});

const dropdownClasses = computed(() => {
	const base =
		"absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto";
	return [
		base,
		props.dropdownWidth,
		props.dropdownMaxHeight,
		props.dropdownClass,
	]
		.filter(Boolean)
		.join(" ");
});
</script>

<template>
  <div :class="comboboxClasses" ref="comboboxRef">
    <!-- Label -->
    <label v-if="label" :class="labelClasses">
      {{ label }}
    </label>
    
    <!-- Input -->
    <div :class="inputWrapperClasses">
      <div 
        :class="inputClasses"
        @click="toggleDropdown"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        role="combobox"
        :aria-owns="`combobox-${$attrs.id || 'dropdown'}`"
        :aria-labelledby="label ? `${$attrs.id}-label` : undefined"
        :aria-disabled="disabled"
      >
        <!-- Selected items (multiple) -->
        <div v-if="multiple && selectedItems.length > 0" class="flex flex-wrap gap-1 p-1">
          <span 
            v-for="(item, index) in selectedItems" 
            :key="index"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
          >
            {{ getItemLabel(item) }}
            <button 
              type="button" 
              class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 dark:hover:bg-primary-700"
              @click.stop="selectItem(item)"
              :aria-label="`Remove ${getItemLabel(item)}`"
            >
              <span class="i-mdi-close h-3 w-3" />
            </button>
          </span>
        </div>
        
        <!-- Selected item (single) -->
        <div v-else-if="!multiple && selectedItems.length > 0" class="p-2">
          {{ getItemLabel(selectedItems[0]) }}
        </div>
        
        <!-- Placeholder -->
        <div v-else class="p-2 text-gray-400">
          {{ placeholder }}
        </div>
        
        <!-- Search input (when open) -->
        <input
          v-if="searchable && isOpen"
          ref="inputRef"
          :value="searchQuery"
          type="text"
          class="w-full p-2 border-0 focus:ring-0 bg-transparent"
          :placeholder="placeholder"
          autocomplete="off"
          @input="handleInput"
          @click.stop
        >
        
        <!-- Icons -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2">
          <!-- Clear button -->
          <button
            v-if="clearable && selectedItems.length > 0 && !disabled && !loading"
            type="button"
            class="text-gray-400 hover:text-gray-500 p-1"
            @click.stop="handleClear"
            :aria-label="clearText"
          >
            <span class="i-mdi-close h-4 w-4" />
          </button>
          
          <!-- Loading indicator -->
          <span v-else-if="loading" class="text-gray-400">
            <span class="animate-spin">
              <span class="i-mdi-loading h-4 w-4"></span>
            </span>
          </span>
          
          <!-- Dropdown icon -->
          <span 
            v-if="!clearable || selectedItems.length === 0 || disabled || loading"
            class="i-mdi-chevron-down h-5 w-5 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            aria-hidden="true"
          />
        </div>
      </div>
      
      <!-- Dropdown -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-show="isOpen"
          ref="dropdownRef"
          :class="dropdownClasses"
          role="listbox"
          :id="`combobox-${$attrs.id || 'dropdown'}`"
        >
          <!-- Loading state -->
          <div v-if="loading" class="p-4 text-center text-sm text-gray-500">
            {{ loadingText }}
          </div>
          
          <!-- No results -->
          <div v-else-if="filteredItems.length === 0" class="p-4 text-center text-sm text-gray-500">
            {{ noResultsText }}
          </div>
          
          <!-- Items -->
          <ul v-else class="py-1">
            <li 
              v-for="(item, index) in filteredItems" 
              :key="index"
              :class="[
                'relative cursor-default select-none py-2 pl-3 pr-9',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none',
                highlightedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : '',
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
              role="option"
              :aria-selected="isSelected(item)"
              :aria-disabled="item.disabled"
              @click="!item.disabled && selectItem(item)"
              @mouseenter="highlightedIndex = index"
            >
              <div class="flex items-center">
                <!-- Checkbox for multiple selection -->
                <span v-if="multiple" class="mr-2">
                  <span 
                    :class="[
                      'inline-block h-4 w-4 rounded border-2',
                      isSelected(item) 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'border-gray-300 dark:border-gray-600',
                      {
                        'opacity-50': item.disabled
                      }
                    ]"
                  >
                    <span 
                      v-if="isSelected(item)" 
                      class="block h-2 w-2 bg-white rounded-sm m-auto"
                    />
                  </span>
                </span>
                
                <!-- Item content -->
                <span :class="['block truncate', isSelected(item) ? 'font-medium' : 'font-normal']">
                  {{ getItemLabel(item) }}
                </span>
              </div>
              
              <!-- Selected checkmark -->
              <span 
                v-if="!multiple && isSelected(item)" 
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-500"
              >
                <span class="i-mdi-check h-5 w-5" />
              </span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    
    <!-- Error message -->
    <p v-if="error" :class="errorClasses">
      {{ error }}
    </p>
  </div>
</template>