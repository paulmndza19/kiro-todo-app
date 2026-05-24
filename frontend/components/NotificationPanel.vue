<template>
  <div
    class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 z-50 overflow-hidden"
    role="region"
    aria-label="Notifications panel"
    data-testid="notification-panel"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
      <h3 class="text-sm font-semibold text-secondary-900 dark:text-white">
        Notifications
      </h3>
      <div class="flex items-center gap-2">
        <button
          v-if="notifications.length > 0 && unreadCount > 0"
          type="button"
          class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
          data-testid="notification-panel-mark-all-read"
          @click="$emit('markAllAsRead')"
        >
          Mark all as read
        </button>
        <button
          v-if="notifications.length > 0"
          type="button"
          class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
          data-testid="notification-panel-clear-all"
          @click="handleClearAll"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Notification List -->
    <div class="max-h-80 overflow-y-auto">
      <!-- Empty state -->
      <div
        v-if="notifications.length === 0"
        class="flex flex-col items-center justify-center py-8 px-4"
        data-testid="notification-panel-empty"
      >
        <svg class="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p class="text-sm text-secondary-500 dark:text-secondary-400">No notifications</p>
        <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-1">You're all caught up!</p>
      </div>

      <!-- Notification items -->
      <ul v-else role="list" aria-label="Notification list">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="border-b border-secondary-100 dark:border-secondary-700 last:border-b-0"
        >
          <button
            type="button"
            class="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-750"
            :class="notification.is_read ? 'opacity-60' : ''"
            :aria-label="`${notification.is_read ? 'Read' : 'Unread'} notification: ${notification.message}`"
            :data-testid="`notification-item-${notification.id}`"
            @click="$emit('markAsRead', notification.id)"
          >
            <!-- Type icon -->
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
              :class="notification.type === 'reminder'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
            >
              <!-- Bell icon for reminder -->
              <svg v-if="notification.type === 'reminder'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <!-- Clock icon for overdue -->
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p
                class="text-sm truncate"
                :class="notification.is_read
                  ? 'text-secondary-500 dark:text-secondary-400'
                  : 'text-secondary-900 dark:text-white font-medium'"
              >
                {{ notification.message }}
              </p>
              <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
                {{ formatRelativeTime(notification.created_at) }}
              </p>
            </div>

            <!-- Unread indicator -->
            <div
              v-if="!notification.is_read"
              class="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2"
              aria-hidden="true"
            ></div>
          </button>
        </li>
      </ul>
    </div>

    <!-- Confirm clear dialog -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150"
        leave-active-class="transition-opacity duration-100"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showClearConfirm"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="clear-notifications-title"
        >
          <div class="absolute inset-0 bg-black/50" @click="showClearConfirm = false"></div>
          <div class="relative bg-white dark:bg-secondary-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h4 id="clear-notifications-title" class="text-base font-semibold text-secondary-900 dark:text-white mb-2">
              Clear All Notifications
            </h4>
            <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
              Are you sure you want to clear all notifications? This action cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                class="btn-secondary text-sm"
                @click="showClearConfirm = false"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                data-testid="notification-panel-confirm-clear"
                @click="confirmClear"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/types'

interface Props {
  notifications: Notification[]
  unreadCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  markAsRead: [id: string]
  markAllAsRead: []
  clearAll: []
}>()

const showClearConfirm = ref(false)

function handleClearAll() {
  showClearConfirm.value = true
}

function confirmClear() {
  showClearConfirm.value = false
  emit('clearAll')
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
