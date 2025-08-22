import { ref } from 'vue'

interface SidebarItem {
  text: string
  link: string
  icon: string
  collapsed: boolean
  items?: SidebarItem[]
}

export const useSidebar = (initialItems: SidebarItem[]) => {
  const isOpen = ref(false)
  const sidebar = ref(initialItems)
  
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const toggleCollapse = (item: SidebarItem) => {
    item.collapsed = !item.collapsed
  }

  return {
    isOpen,
    sidebar,
    toggle,
    toggleCollapse
  }
}
