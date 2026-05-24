<template>
  <div class="relative" ref="bellContainer">
    <button
      type="button"
      class="relative p-2 rounded-md text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
      :aria-label="`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`"
      :aria-expanded="panelOpen"
      aria-haspopup="true"
      data-testid="notification-bell-button"
      @click="togglePanel"
      @keydown.escape="closePanel"
    >
      <!-- Bell icon -->
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      <!-- Unread count badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full"
        aria-hidden="true"
        data-testid="notification-bell-badge"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notification Panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <NotificationPanel
        v-if="panelOpen"
        :notifications="notifications"
        :unread-count="unreadCount"
        @mark-as-read="handleMarkAsRead"
        @mark-all-as-read="handleMarkAllAsRead"
        @clear-all="handleClearAll"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  clearAll,
  startPolling,
  stopPolling,
} = useNotifications()

const panelOpen = ref(false)
const bellContainer = ref<HTMLElement | null>(null)

function togglePanel() {
  panelOpen.value = !panelOpen.value
}

function closePanel() {
  panelOpen.value = false
}

function handleMarkAsRead(id: string) {
  markAsRead(id)
}

function handleMarkAllAsRead() {
  markAllAsRead()
}

function handleClearAll() {
  clearAll()
}

// Close panel on outside click
function handleClickOutside(event: MouseEvent) {
  if (bellContainer.value && !bellContainer.value.contains(event.target as Node)) {
    closePanel()
  }
}

// Close panel on Escape key (global)
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && panelOpen.value) {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  startPolling()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  stopPolling()
})
</script>
