import { ref, computed } from 'vue'
import { notificationsApi } from '~/utils/api'
import type { Notification } from '~/types'

const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

let pollingInterval: ReturnType<typeof setInterval> | null = null

export function useNotifications() {
  async function fetchNotifications(): Promise<void> {
    try {
      loading.value = true
      error.value = null
      const response = await notificationsApi.list()
      notifications.value = response.notifications
      unreadCount.value = response.unread_count
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch notifications'
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id: string): Promise<void> {
    // Optimistic update
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index === -1) return

    const original = { ...notifications.value[index] }
    notifications.value[index] = { ...original, is_read: true }
    if (!original.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }

    try {
      await notificationsApi.markAsRead(id)
    } catch (err: any) {
      // Rollback on failure
      notifications.value[index] = original
      if (!original.is_read) {
        unreadCount.value += 1
      }
      error.value = err?.message || 'Failed to mark notification as read'
    }
  }

  async function markAllAsRead(): Promise<void> {
    // Optimistic update
    const originals = notifications.value.map((n) => ({ ...n }))
    const originalUnread = unreadCount.value
    notifications.value = notifications.value.map((n) => ({ ...n, is_read: true }))
    unreadCount.value = 0

    try {
      await notificationsApi.markAllAsRead()
    } catch (err: any) {
      // Rollback on failure
      notifications.value = originals
      unreadCount.value = originalUnread
      error.value = err?.message || 'Failed to mark all as read'
    }
  }

  async function clearAll(): Promise<void> {
    // Optimistic update
    const originals = notifications.value.map((n) => ({ ...n }))
    const originalUnread = unreadCount.value
    notifications.value = []
    unreadCount.value = 0

    try {
      await notificationsApi.clearAll()
    } catch (err: any) {
      // Rollback on failure
      notifications.value = originals
      unreadCount.value = originalUnread
      error.value = err?.message || 'Failed to clear notifications'
    }
  }

  function startPolling(): void {
    // Fetch immediately
    fetchNotifications()

    // Set up 30-second interval
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }
    pollingInterval = setInterval(fetchNotifications, 30000)
  }

  function stopPolling(): void {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  return {
    // State
    notifications: computed(() => notifications.value),
    unreadCount: computed(() => unreadCount.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    startPolling,
    stopPolling,
  }
}
