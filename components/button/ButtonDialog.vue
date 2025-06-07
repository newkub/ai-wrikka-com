<script setup lang="ts">
import { ref, computed } from "vue";
// Icons will be used from UnoCSS
import { onClickOutside } from "@vueuse/core";

defineOptions({
	name: "ButtonDialog",
});

interface Props {
	/** Dialog title */
	title?: string;
	/** Show/hide the dialog */
	modelValue?: boolean;
	/** Dialog width */
	width?: string;
	/** Show close button */
	showClose?: boolean;
	/** Show footer */
	showFooter?: boolean;
	/** Show backdrop */
	showBackdrop?: boolean;
	/** Close on click outside */
	closeOnClickOutside?: boolean;
	/** Close on press escape */
	closeOnEscape?: boolean;
	/** Prevent body scroll when dialog is open */
	preventScroll?: boolean;
	/** Custom dialog class */
	dialogClass?: string;
	/** Custom header class */
	headerClass?: string;
	/** Custom body class */
	bodyClass?: string;
	/** Custom footer class */
	footerClass?: string;
	/** Custom overlay class */
	overlayClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "",
	modelValue: false,
	width: "max-w-2xl",
	showClose: true,
	showFooter: true,
	showBackdrop: true,
	closeOnClickOutside: true,
	closeOnEscape: true,
	preventScroll: true,
	dialogClass: "",
	headerClass: "",
	bodyClass: "",
	footerClass: "",
	overlayClass: "",
});

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
	open: [];
	close: [];
	confirm: [];
	cancel: [];
}>();

const dialogRef = ref<HTMLElement | null>(null);
const isOpen = ref(props.modelValue);

// Update isOpen when modelValue changes
watch(
	() => props.modelValue,
	(newVal) => {
		isOpen.value = newVal;
		if (newVal) {
			emit("open");
			if (props.preventScroll) {
				document.body.style.overflow = "hidden";
			}
		} else {
			emit("close");
			if (props.preventScroll) {
				document.body.style.overflow = "";
			}
		}
	},
	{ immediate: true },
);

// Handle escape key
const handleKeydown = (e: KeyboardEvent) => {
	if (props.closeOnEscape && e.key === "Escape" && isOpen.value) {
		closeDialog();
	}
};

// Handle click outside
onClickOutside(dialogRef, () => {
	if (props.closeOnClickOutside && isOpen.value) {
		closeDialog();
	}
});

// Add/remove event listeners
onMounted(() => {
	document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
	if (props.preventScroll) {
		document.body.style.overflow = "";
	}
});

// Dialog classes
const dialogClasses = computed(() => {
	const base =
		"relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:my-8 w-full max-h-[90vh] flex flex-col overflow-hidden";
	return [base, props.width, props.dialogClass].filter(Boolean).join(" ");
});

const headerClasses = computed(() => {
	const base =
		"px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between";
	return [base, props.headerClass].filter(Boolean).join(" ");
});

const bodyClasses = computed(() => {
	const base = "px-6 py-4 flex-1 overflow-y-auto";
	return [base, props.bodyClass].filter(Boolean).join(" ");
});

const footerClasses = computed(() => {
	const base =
		"px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3";
	return [base, props.footerClass].filter(Boolean).join(" ");
});

const overlayClasses = computed(() => {
	const base =
		"fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity z-50 flex items-center justify-center p-4";
	return [base, props.overlayClass].filter(Boolean).join(" ");
});

// Dialog methods
const openDialog = () => {
	isOpen.value = true;
	emit("update:modelValue", true);
	emit("open");
	if (props.preventScroll) {
		document.body.style.overflow = "hidden";
	}
};

const closeDialog = () => {
	isOpen.value = false;
	emit("update:modelValue", false);
	emit("close");
	if (props.preventScroll) {
		document.body.style.overflow = "";
	}
};

const confirmDialog = () => {
	emit("confirm");
	closeDialog();
};

const cancelDialog = () => {
	emit("cancel");
	closeDialog();
};

// Expose methods
defineExpose({
	open: openDialog,
	close: closeDialog,
	confirm: confirmDialog,
	cancel: cancelDialog,
});
</script>

<template>
  <div>
    <slot name="trigger" :open="openDialog">
      <button @click="openDialog" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <slot name="button-content">
          Open Dialog
        </slot>
      </button>
    </slot>


    <teleport to="body">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen" :class="overlayClasses" v-bind="$attrs">
          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div ref="dialogRef" :class="dialogClasses">
              <!-- Header -->
              <div :class="headerClasses">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </h3>
                <button
                  v-if="showClose"
                  type="button"
                  class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  @click="closeDialog"
                  aria-label="Close"
                >
                  <span class="i-mdi-close h-5 w-5" />
                </button>
              </div>

              <!-- Body -->
              <div :class="bodyClasses">
                <slot></slot>
              </div>


              <!-- Footer -->
              <div v-if="showFooter || $slots.footer" :class="footerClasses">
                <slot name="footer">
                  <button
                    type="button"
                    class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="cancelDialog"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="confirmDialog"
                  >
                    Confirm
                  </button>
                </slot>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </div>
</template>