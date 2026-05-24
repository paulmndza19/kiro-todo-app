# Code Generation Plan — Unit 2: Reminder Trigger Logic

## Unit Context

**Unit**: Unit 2 — Reminder Trigger Logic
**Responsibility**: Extend Todo model with `reminder_at` field. Implement logic that detects when reminders are due or todos are overdue.

**Stories Implemented**:
- US-1 (partial): Backend accepts and persists `reminder_at` in todo create/update
- US-3: `check_user()` detects todos with reminder_at <= now
- US-4: `check_user()` detects todos with due_date < today

**Dependencies**: None (standalone — provides `check_user()` consumed by Unit 1's router)

**Files to Modify/Create**:
| File | Action |
|---|---|
| `backend/models.py` | Modify — add `reminder_at` to Todo, TodoCreate, TodoUpdate |
| `backend/services/todo_service.py` | Modify — accept/persist/validate `reminder_at` |
| `backend/services/reminder_checker.py` | Create — pure function `check_user()` |

---

## Execution Steps

### Step 1: Modify backend/models.py — Add reminder_at to Todo models
- [ ] Add `reminder_at: datetime | None = None` field to `Todo` model
- [ ] Add `reminder_at: str | None = None` field to `TodoCreate` model
- [ ] Add `reminder_at: str | None = None` field to `TodoUpdate` model

### Step 2: Modify backend/services/todo_service.py — Accept and persist reminder_at
- [ ] Add `_validate_reminder_at()` helper method for ISO 8601 datetime validation
- [ ] Update `create()` to validate and persist `reminder_at`
- [ ] Update `update()` to validate and persist `reminder_at` (including clearing via null)

### Step 3: Create backend/services/reminder_checker.py — Pure detection logic
- [ ] Create module with `check_user()` function
- [ ] Implement reminder detection: todos with `reminder_at <= now` AND status != "done" AND no existing notification
- [ ] Implement overdue detection: todos with `due_date < today` AND status != "done" AND no existing notification
- [ ] Return list of tuples: `[(todo_id, notification_type, message), ...]`
- [ ] Ensure function is pure (no I/O, no side effects)

### Step 4: Generate code summary documentation
- [ ] Create `aidlc-docs/construction/unit-2/code/code-summary.md`

---

## Acceptance Criteria

- [ ] Todo model includes `reminder_at: datetime | None`
- [ ] TodoCreate and TodoUpdate accept `reminder_at`
- [ ] TodoService validates `reminder_at` format (ISO 8601 datetime)
- [ ] `check_user()` correctly identifies due reminders
- [ ] `check_user()` correctly identifies overdue todos
- [ ] `check_user()` respects deduplication (skips if notification exists)
- [ ] `check_user()` skips completed todos (status = done)
- [ ] Existing todo endpoints return `reminder_at` in responses
