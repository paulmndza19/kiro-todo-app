# Code Summary — Unit 4: Reminder Form Integration

## Files Created

| File | Purpose |
|---|---|
| `frontend/components/ReminderBadge.vue` | Visual badge showing "Upcoming" (blue) or "Due" (orange) based on reminder_at vs current time |

## Files Modified

| File | Changes |
|---|---|
| `frontend/types/index.ts` | Added `reminder_at: string \| null` to Todo interface; added `reminder_at` to TodoCreate and TodoUpdate types |
| `frontend/components/TodoForm.vue` | Added datetime-local input for reminder_at with clear button; included in form state, pre-population, and submission logic; added ISO conversion helpers |
| `frontend/components/TodoItem.vue` | Added reminder time display with bell icon; added ReminderBadge component; added formattedReminderAt computed |
| `frontend/pages/dashboard.vue` | Added reminder_at to createForm, handleCreateTodo, resetCreateForm; added datetime-local input to inline create modal |
| `frontend/composables/useTodos.ts` | Added reminder_at to optimistic todo creation |

## Architecture Decisions

- **datetime-local input**: Uses native HTML5 datetime-local input for cross-browser compatibility
- **ISO conversion**: Local datetime values are converted to ISO 8601 UTC strings before sending to API, and converted back to local format when populating the edit form
- **Clear button**: Reminder can be explicitly cleared via an X button that sets the value to empty string (sent as null to API)
- **ReminderBadge logic**: Compares reminder_at against current time — "upcoming" if future, "due" if past and todo not done, hidden if null or done

## Stories Covered

- [x] US-1: Set Reminder on Todo (datetime-local input in create/edit form, clear capability, ISO format submission)
- [x] US-2: View Reminder on Todo Card (formatted time display, ReminderBadge with upcoming/due states)
