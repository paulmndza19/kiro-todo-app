# Code Generation Plan — Unit 1: Notification Backend

## Unit Context

**Unit**: Unit 1 — Notification Backend
**Responsibility**: Notification data layer and CRUD endpoints. Manages notification storage, retrieval, and state changes.

**Stories Implemented**:
- US-3 (supporting): Provide `notification_service.create()` called during GET /api/notifications
- US-4 (supporting): Provide `notification_service.create()` called during GET /api/notifications
- US-5: Provide `GET /api/notifications` returning unread_count
- US-6: Provide `GET /api/notifications` returning notification list
- US-7: Provide `PATCH /api/notifications/{id}/read` endpoint
- US-8: Provide `POST /api/notifications/read-all` endpoint
- US-9: Provide `DELETE /api/notifications` endpoint
- US-10: Provide `GET /api/notifications` endpoint (polled by frontend)

**Dependencies**:
- Unit 2 (ReminderChecker) — Unit 1's GET handler imports `reminder_checker.check_user()`. Since Unit 2 is not yet built, the GET handler will include a try/except import so Unit 1 can function standalone (returns notifications without auto-detection until Unit 2 is merged).

**Files to Modify/Create**:
| File | Action |
|---|---|
| `backend/models.py` | Modify — add NotificationType enum, Notification, NotificationResponse, NotificationsListResponse |
| `backend/services/notification_service.py` | Create — NotificationService class with CRUD methods |
| `backend/routers/notifications.py` | Create — FastAPI router with 4 endpoints |
| `backend/data/notifications.json` | Create — Empty JSON array `[]` |
| `backend/main.py` | Modify — Import and register notifications router, add PATCH to CORS |

---

## Execution Steps

### Step 1: Modify backend/models.py — Add Notification models
- [ ] Add `NotificationType` enum with values "reminder" and "overdue"
- [ ] Add `Notification` model with fields: id, user_id, todo_id, type, message, is_read, created_at
- [ ] Add `NotificationResponse` model (same shape, for API responses)
- [ ] Add `NotificationsListResponse` model with fields: notifications (list), unread_count (int)

### Step 2: Create backend/services/notification_service.py — CRUD operations
- [ ] Create `NotificationService` class with `__init__(self, notification_store: JSONStore)`
- [ ] Implement `create(user_id, todo_id, notification_type, message) -> Notification`
- [ ] Implement `exists(user_id, todo_id, notification_type) -> bool`
- [ ] Implement `get_user_notifications(user_id) -> list[Notification]` (ordered by created_at DESC, max 20)
- [ ] Implement `get_unread_count(user_id) -> int`
- [ ] Implement `mark_as_read(user_id, notification_id) -> Notification`
- [ ] Implement `mark_all_as_read(user_id) -> int` (returns count marked)
- [ ] Implement `clear_all(user_id) -> None`
- [ ] Implement `get_user_notifications_raw(user_id) -> list[dict]` (for reminder_checker integration)

### Step 3: Create backend/data/notifications.json — Empty storage
- [ ] Create file with empty JSON array `[]`

### Step 4: Create backend/routers/notifications.py — HTTP endpoints
- [ ] Create router with prefix `/api/notifications`
- [ ] Initialize notification_store and notification_service
- [ ] Initialize todo_store (shared JSONStore reference to todos.json)
- [ ] Implement `GET /api/notifications` with reminder_checker integration
- [ ] Implement `PATCH /api/notifications/{notification_id}/read`
- [ ] Implement `POST /api/notifications/read-all`
- [ ] Implement `DELETE /api/notifications` (204 No Content)

### Step 5: Modify backend/main.py — Register notifications router
- [ ] Import notifications router
- [ ] Register with `app.include_router()`
- [ ] Add PATCH to allowed methods in CORS middleware

### Step 6: Generate code summary documentation
- [ ] Create `aidlc-docs/construction/unit-1/code/code-summary.md`

---

## Acceptance Criteria

- [ ] Notification CRUD operations work correctly
- [ ] Notifications are scoped to authenticated user
- [ ] Responses match exact JSON shapes in contracts
- [ ] Deduplication check works (exists method)
- [ ] Atomic writes to notifications.json (via JSONStore)
- [ ] GET endpoint integrates with reminder_checker.check_user()
- [ ] PATCH returns 404 for non-existent or non-owned notifications
- [ ] DELETE returns 204 No Content
- [ ] Router is registered in main.py
