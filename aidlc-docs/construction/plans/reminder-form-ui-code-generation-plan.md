# Code Generation Plan — Unit 4: Reminder Form Integration

## Unit Context

**Unit**: Reminder Form Integration
**Responsibility**: Add reminder time input to todo form, display reminder time on todo cards, visual indicator for upcoming/overdue reminders.
**Dependencies**: Unit 2's API contracts (Todo model includes `reminder_at` in responses and accepts it in create/update)

## Stories Implemented
- US-1: Set Reminder on Todo (frontend portion)
- US-2: View Reminder on Todo Card

## Code Location
- **Application Code**: `frontend/` directory (existing Nuxt 3 project)
- **Documentation**: `aidlc-docs/construction/reminder-form-ui/code/`

---

## Execution Steps

### Step 1: Extend Todo TypeScript Interface
- [x] Modify `frontend/types/index.ts`
- [x] Add `reminder_at: string | null` to Todo interface
- [x] Add `reminder_at?: string` to TodoCreate type
- [x] Add `reminder_at?: string | null` to TodoUpdate type

### Step 2: Create ReminderBadge Component
- [x] Create `frontend/components/ReminderBadge.vue`
- [x] Show "upcoming" badge when reminder_at is in the future
- [x] Show "due" badge (warning style) when reminder_at has passed and todo is not done
- [x] No badge when reminder_at is null
- [x] Add data-testid attributes for automation

### Step 3: Modify TodoForm to Include Reminder Input
- [x] Modify `frontend/components/TodoForm.vue`
- [x] Add datetime-local input for reminder_at
- [x] Include reminder_at in form state and submission
- [x] Allow clearing reminder (set to null)
- [x] Pre-populate reminder_at when editing

### Step 4: Modify TodoItem to Display Reminder
- [x] Modify `frontend/components/TodoItem.vue`
- [x] Display formatted reminder_at when set
- [x] Include ReminderBadge component
- [x] Show reminder info in meta row

### Step 5: Update Dashboard Create Form
- [x] Modify `frontend/pages/dashboard.vue`
- [x] Add reminder_at to createForm reactive object
- [x] Include reminder_at in handleCreateTodo submission
- [x] Add datetime-local input to inline create modal

### Step 6: Generate Code Summary Documentation
- [x] Create `aidlc-docs/construction/reminder-form-ui/code/code-summary.md`
- [x] Document all files created/modified

---

## Story Traceability

| Step | Stories Covered |
|---|---|
| Step 1 | US-1, US-2 (type foundation) |
| Step 2 | US-2 (visual badge) |
| Step 3 | US-1 (set/edit/clear reminder) |
| Step 4 | US-2 (display on card) |
| Step 5 | US-1 (create with reminder) |
| Step 6 | Documentation |

## Total Steps: 6
## Status: COMPLETE
