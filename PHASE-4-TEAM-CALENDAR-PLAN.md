# Phase 4 - Team Calendar Implementation Plan

**Task:** Implement full calendar view for Team Schedule tab
**Location:** `src/components/cleaning/TeamScheduleTab.tsx`
**Current Status:** Placeholder "coming soon" message
**Priority:** Phase 4 - Core Functionality
**Estimated Time:** 1 hour

---

## Current State

The Team Schedule tab currently has:
- ✅ KPIs (Total Jobs, Assigned, Needs Assignment)
- ✅ List view with job assignment interface
- ❌ Calendar view shows placeholder "coming soon" message

## Implementation Plan

### Option 1: Shared Calendar Component (Recommended - 45 min)

**Approach:** Use the existing Calendar component from Schedule page

**Steps:**
1. Import Calendar component: `import Calendar from "@/components/calendar/Calendar"`
2. Replace placeholder in calendar view with `<Calendar />`
3. Filter calendar events to show only jobs assigned to team
4. Add visual indicators for assigned vs unassigned jobs

**Pros:**
- Quick implementation (45 minutes)
- Consistent with Schedule page UX
- Full calendar functionality (day/week/month views)
- Google Calendar sync integration ready

**Cons:**
- Shows all jobs (not filtered to team-specific)
- May need additional filtering logic

### Option 2: Custom Team Calendar Grid (1.5 hours)

**Approach:** Build simplified week/month grid specific to team scheduling

**Features:**
- Week view showing M-F with time slots
- Color-coded by assignment status (unassigned = red, assigned = green)
- Click job to assign staff
- Drag-and-drop to reschedule (optional)

**Pros:**
- Tailored UX for team scheduling workflow
- Shows only relevant team assignment info
- Cleaner interface for managers

**Cons:**
- More development time
- Need to maintain separate calendar logic

---

## Recommended Implementation (Option 1)

### Code Changes Required:

**File:** `src/components/cleaning/TeamScheduleTab.tsx`

**Current code (line 143):**
```typescript
<div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
  <CalenderIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
  <p className="text-gray-500 dark:text-gray-400">
    Calendar view coming soon - shows weekly/monthly schedule grid
  </p>
</div>
```

**Replace with:**
```typescript
import Calendar from "@/components/calendar/Calendar";

// ... in render:
{viewMode === "calendar" ? (
  <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
    <Calendar />
  </div>
) : (
  // existing list view
)}
```

### Testing Checklist:
- [ ] Calendar displays correctly in team schedule tab
- [ ] Toggle between list and calendar views works
- [ ] Calendar shows all team jobs
- [ ] Day/week/month views functional
- [ ] Add Event modal works (for creating assignments)
- [ ] Dark mode works correctly

---

## Alternative: Phase 4 Enhanced Implementation

If time permits, add team-specific features:

1. **Filter by Staff Member**
   - Dropdown to view specific team member's schedule
   - "All Team" option to see everyone

2. **Assignment Status Colors**
   - Red border: Unassigned jobs
   - Green border: Assigned jobs
   - Gray: Completed jobs

3. **Quick Assignment from Calendar**
   - Click unassigned job → assign staff modal
   - Drag staff to job for quick assignment

4. **Workload Indicators**
   - Show hours scheduled per day
   - Warn if overbooked

---

## Dependencies

**Required:**
- Calendar component exists at `src/components/calendar/Calendar.tsx` ✅
- CalenderIcon available in icons ✅
- Job data structure compatible ✅

**Optional:**
- Staff assignment modal (can reuse existing modals)
- Filtering logic for team-specific jobs

---

## Acceptance Criteria

**Minimum (Phase 4 - Option 1):**
- [ ] Calendar view displays instead of placeholder
- [ ] Toggle between list/calendar works smoothly
- [ ] Calendar shows scheduled jobs
- [ ] No console errors

**Enhanced (If time permits):**
- [ ] Filter jobs by team member
- [ ] Color-code by assignment status
- [ ] Quick assign from calendar click

---

## Time Breakdown

| Task | Time | Notes |
|------|------|-------|
| Import Calendar component | 5 min | Simple import |
| Replace placeholder | 5 min | Update JSX |
| Test calendar rendering | 10 min | Verify display |
| Test view toggle | 5 min | List ↔ Calendar |
| Fix any styling issues | 15 min | Dark mode, borders |
| Test all calendar features | 10 min | Day/week/month views |
| **Total** | **50 min** | Option 1 |

**Phase 4 Timeline:**
- Start: After Phase 3 completion
- Duration: 1 hour (or 50 minutes for basic implementation)
- Priority: High (needed for full team management workflow)

---

## Notes

- This was intentionally deferred from Phase 2 to avoid scope creep
- Option 1 (shared Calendar) is the pragmatic choice for MVP
- Option 2 (custom grid) can be done later if managers request it
- The list view is fully functional and sufficient for job assignment

**Status:** Ready for Phase 4 implementation ✅
