# Code Generation Plan — Unit 3: Notification Bell UI

## Unit Context

**Unit**: Notification Bell UI
**Responsibility**: Bell icon in navbar, unread count badge, dropdown panel with notification list, read/clear actions, 30-second polling.
**Dependencies**: Unit 1's HTTP API contracts (GET /api/notifications, PATCH /api/notifications/{id}/read, POST /api/notifications/read-all, DELETE /api/notifications)

## Stories Implemented
- US-5: View Notifications via Bell Icon
- US-6: View Notification Panel
- US-7: Mark Notification as Read
- US-8: Mark All Notifications as Read
- US-9: Clear All Notifications
- US-10: Automatic Notification Polling

## Code Location
- **Application Code**: `frontend/` directory (existing Nuxt 3 project)
- **Documentation**: `aidlc-docs/construction/notification-bell-ui/code/`

---

## Execution Steps

### Step 1: Add Notification TypeScript Interface
- [x] Modify `frontend/types/index.ts`
- [x] Add `Notification` interface with fields: id, user_id, todo_id, type, message, is_read, created_at
- [x] Add `NotificationsListResponse` interface with fields: notifications, unread_count

### Step 2: Add Notifications API Client
- [x] Modify `frontend/utils/api.ts`
- [x] Add `notificationsApi` object with methods: list(), markAsRead(id), markAllAsRead(), clearAll()
- [x] Follow existing `apiFetch` pattern used by `todosApi` and `authApi`

### Step 3: Create useNotifications Composable
- [x] Create `frontend/composables/useNotifications.ts`
- [x] Implement reactive state: notifications, unreadCount, loading, error
- [x] Implement fetchNotifications() - calls notificationsApi.list()
- [x] Implement markAsRead(id) - optimistic update + API call
- [x] Implement markAllAsRead() - optimistic update + API call
- [x] Implement clearAll() - optimistic update + API call
- [x] Implement startPolling() - 30-second interval + immediate first call
- [x] Implement stopPolling() - clears interval
- [x] Export all state and actions

### Step 4: Create NotificationPanel Component
- [x] Create `frontend/components/NotificationPanel.vue`
- [x] Display list of notifications (up to 20)
- [x] Each notification shows: type icon, message, relative time
- [x] Visual distinction between read/unread notifications
- [x] "Mark all as read" button
- [x] "Clear all" button with confirmation
- [x] Empty state when no notifications
- [x] Accessible: aria attributes, keyboard navigation
- [x] Add data-testid attributes for automation

### Step 5: Create NotificationBell Component
- [x] Create `frontend/components/NotificationBell.vue`
- [x] Bell icon SVG
- [x] Unread count badge (hidden when 0)
- [x] Click toggles NotificationPanel dropdown
- [x] Close on outside click or Escape key
- [x] Accessible: aria-label, aria-expanded, keyboard navigable
- [x] Add data-testid attributes for automation

### Step 6: Integrate NotificationBell into Dashboard
- [x] Modify `frontend/pages/dashboard.vue`
- [x] Add NotificationBell component to header right-side actions (before DarkModeToggle)
- [x] Start polling on mount via useNotifications
- [x] Stop polling on unmount / logout

### Step 7: Generate Code Summary Documentation
- [x] Create `aidlc-docs/construction/notification-bell-ui/code/code-summary.md`
- [x] Document all files created/modified with descriptions

---

## Story Traceability

| Step | Stories Covered |
|---|---|
| Step 1 | US-5, US-6, US-7, US-8, US-9, US-10 (type foundation) |
| Step 2 | US-5, US-6, US-7, US-8, US-9, US-10 (API layer) |
| Step 3 | US-5, US-7, US-8, US-9, US-10 (state + polling) |
| Step 4 | US-6, US-7, US-8, US-9 (panel UI) |
| Step 5 | US-5, US-10 (bell + badge) |
| Step 6 | US-5, US-10 (integration + lifecycle) |
| Step 7 | Documentation |

## Total Steps: 7
## Status: COMPLETE
