<template>
  <span
    class="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
    :class="[
      // Base styles
      'ring-1',
      
      // Active state
      active 
        ? [
            'bg-color-primary text-white',
            'ring-color-primary/20 shadow-sm',
          ]
        : [
            // Inactive state
            'bg-block/80 text-text/80',
            'ring-border/50 hover:ring-border',
            'hover:bg-block hover:text-text hover:shadow-sm'
          ],
      
      // Clickable state
      {
        'cursor-pointer hover:-translate-y-0.5': clickable,
        'ring-0': !clickable && !active
      }
    ]"
    @click="handleClick"
  >
    <slot>{{ props.name }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  /** Text to display in the tag */
  name: string
  /** Active state of the tag */
  active?: boolean
  /** Make tag clickable */
  clickable?: boolean
  /** Custom background color when active */
  activeBgColor?: string
  /** Custom text color when active */
  activeTextColor?: string
  /** Custom background color when inactive */
  inactiveBgColor?: string
  /** Custom text color when inactive */
  inactiveTextColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  clickable: false,
  activeBgColor: 'bg-color-primary',
  activeTextColor: 'text-white',
  inactiveBgColor: 'bg-block/80',
  inactiveTextColor: 'text-text/80'
})

const emit = defineEmits<(e: 'click', event: MouseEvent) => void>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>
