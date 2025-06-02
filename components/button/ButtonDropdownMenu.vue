<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

defineOptions({
  name: 'ButtonDropdownMenu'
})

interface MenuItem {
  label: string
  icon?: string
  action?: () => void
  disabled?: boolean
  divider?: boolean
  children?: MenuItem[]
}

interface Props {
  /** Button text */
  label?: string
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Show loading state */
  loading?: boolean
  /** Disable the button */
  disabled?: boolean
  /** Menu items */
  items: MenuItem[]
  /** Menu alignment */
  align?: 'left' | 'right'
  /** Trigger on hover */
  hover?: boolean
  /** Custom button class */
  buttonClass?: string
  /** Custom menu class */
  menuClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false,
  align: 'left',
  hover: false,
  buttonClass: '',
  menuClass: ''
})

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const isOpen = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

// Close menu when clicking outside
onClickOutside(menuRef, (event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
})

// Handle keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

// Handle item click
const handleItemClick = (item: MenuItem) => {
  if (item.disabled) return
  
  if (item.action) {
    item.action()
  } else if (!item.children) {
    emit('select', item)
  }
  
  if (!item.children) {
    isOpen.value = false
  }
}

// Toggle menu
const toggleMenu = () => {
  if (!props.disabled && !props.loading) {
    isOpen.value = !isOpen.value
  }
}

// Handle hover if enabled
const onMouseEnter = () => {
  if (props.hover && !props.disabled) {
    isOpen.value = true
  }
}

const onMouseLeave = () => {
  if (props.hover) {
    isOpen.value = false
  }
}

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Button classes
const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500 dark:text-gray-200 dark:hover:bg-gray-700',
    link: 'text-primary-600 hover:text-primary-800 focus:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const disabledClass = 'opacity-50 cursor-not-allowed'
  const loadingClass = 'opacity-75 cursor-wait'
  
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    props.disabled ? disabledClass : '',
    props.loading ? loadingClass : '',
    props.buttonClass
  ].filter(Boolean).join(' ')
})

// Menu classes
const menuClasses = computed(() => {
  const base = 'absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-100 transform origin-top-right'
  const alignment = props.align === 'right' ? 'right-0' : 'left-0'
  return [base, alignment, props.menuClass].filter(Boolean).join(' ')
})
</script>

<template>
  <div class="relative inline-block text-left" 
       @mouseenter="onMouseEnter" 
       @mouseleave="onMouseLeave">
    <div>
      <button
        ref="buttonRef"
        type="button"
        :class="buttonClasses"
        @click="toggleMenu"
        :disabled="disabled || loading"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
      >
        <span v-if="loading" class="mr-2">
          <span class="animate-spin">
            <div class="i-mdi-loading h-4 w-4"></div>
          </span>
        </span>
        <span v-else-if="$slots.icon" class="mr-2">
          <slot name="icon"></slot>
        </span>
        {{ label }}
        <div 
          class="i-mdi-chevron-down ml-2 h-4 w-4 transition-transform duration-200" 
          :class="{ 'rotate-180': isOpen }"
          aria-hidden="true"
        />
      </button>
    </div>

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
        ref="menuRef"
        :class="menuClasses"
        role="menu"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <template v-for="(item, index) in items" :key="index">
            <div v-if="item.divider" class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            
            <button
              v-else
              :key="index"
              :class="[
                'w-full text-left px-4 py-2 text-sm flex items-center',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                item.children ? 'justify-between' : ''
              ]"
              :disabled="item.disabled"
              @click="handleItemClick(item)"
              role="menuitem"
            >
              <div class="flex items-center">
                <span v-if="item.icon" class="mr-2">
                  <div :class="item.icon" class="h-4 w-4"></div>
                </span>
                {{ item.label }}
              </div>
              <span v-if="item.children" class="ml-4">
                <div class="i-mdi-chevron-right h-4 w-4"></div>
              </span>
            </button>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>