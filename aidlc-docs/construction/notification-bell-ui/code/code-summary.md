# Code Summary — Unit 3: Notification Bell UI

## Files Created

| File | Purpose |
|---|---|
| `frontend/composables/useNotifications.ts` | Composable managing notification state, API calls, optimistic updates, and 30-second polling |
| `frontend/components/NotificationBell.vue` | Bell icon button with unread count badge, toggles panel, manages outside-click/Escape close |
| `frontend/components/NotificationPanel.vue` | Dropdown panel showing notification list, mark-as-read, mark-all-as-read, clear-all with confirmation |

## Files Modified

| File | Changes |
|---|---|
| `frontend/types/index.ts` | Added `Notification` interface and `NotificationsListResponse` interface |
| `frontend/utils/api.ts` | Added `notificationsApi` object with list(), markAsRead(), markAllAsRead(), clearAll() methods |
| `frontend/pages/dashboard.vue` | Added `<NotificationBell />` component to header navbar (before DarkModeToggle) |

## Architecture Decisions

- **Shared state via module-level refs**: The `useNotifications` composable uses module-level `ref()` variables so all components share the same notification state (singleton pattern matching existing `useTodos` approach with Pinia store)
- **Optimistic updates**: All mutation actions (markAsRead, markAllAsRead, clearAll) update UI immediately and rollback on API failure
- **Polling lifecycle**: Polling starts on `NotificationBell` mount and stops on unmount — tied to the bell component's lifecycle
- **Accessibility**: Bell has aria-label with unread count, aria-expanded, keyboard navigation. Panel has role="region", notification list has role="list", items have descriptive aria-labels
- **Automation-friendly**: All interactive elements have `data-testid` attributes

## Stories Covered

- [x] US-5: Bell icon with unread count badge in navbar
- [x] US-6: Dropdown panel with notification list (type icon, message, relative time)
- [x] US-7: Mark individual notification as read (click notification)
- [x] US-8: Mark all as read button
- [x] US-9: Clear all button with confirmation dialog
- [x] US-10: 30-second polling via useNotifications composable
