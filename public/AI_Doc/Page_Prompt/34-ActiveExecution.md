# Active Execution (Agent) — Improvement Prompt

**Route(s):** `/dashboard/active-execution`
**File(s) in scope:** `src/features/agent-dashboard/ActiveExecution.page.jsx`. Cross-referenced: `src/features/agent-dashboard/MySchedule.page.jsx` (duplicated execution-stage constant — see finding #3).
**Related audit references:**
- `04-Business-Logic.md` §5 — confirms `DEFAULT_CHECKLIST`'s 6 items are "a fixed template rather than being generated per-service" and flags this as "worth confirming." Confirmed precisely here (finding #1): the checklist isn't just a fixed template, it's not persisted or scoped per-event at all.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **The safety/quality checklist is local component state, never scoped per-event and never persisted anywhere.** `checklist` (line 52) initializes from the module-level `DEFAULT_CHECKLIST` constant and is only ever mutated by `toggleChecklistItem` (lines 78-82) — there is no `useEffect` resetting it when `selectedEvent` changes (clicking a different active project in the left column, line 176-179, does not touch `checklist` at all), and `handleAdvanceStage` (lines 90-122) only sends a single boolean summary (`checklistCompleted: allChecklistDone`, line 100) to the backend — the actual per-item checked/unchecked state is never fetched from or saved to any endpoint. Concrete consequences: (a) an agent managing multiple simultaneous active events sees the **same** checklist progress on every event — checking "floral installation" while viewing Event A also shows it checked when switching to Event B; (b) a page refresh silently discards all checklist progress, resetting every item to unchecked, with no warning to the agent. — **Critical** (a safety/quality-control checklist that doesn't actually track anything per-event is a real operational risk for a physical setup process, not just a UI polish issue).
2. **The "Live Field Operations" header pill is the only one in the entire app using `blue` instead of `purple`.** Line 137: `bg-blue-100 dark:bg-blue-950/60 text-blue-700`. Every other page in this review uses the identical purple pill pattern (`bg-purple-100 ... text-purple-700`) for this exact "section eyebrow" badge — this is the sole exception found across all 36 pages. — **Moderate** (easy, high-confidence fix — direct comparison against every sibling page confirms this is the outlier, not the standard).
3. **Execution-stage definitions duplicated with `MySchedule.page.jsx`.** `STAGES` (lines 26-31) — see `33-MySchedule.md` finding #2 for the shared-extraction recommendation.
4. **Switching the selected active event triggers a full network refetch of the entire event list.** `loadActiveEvents` (lines 56-71) is a `useCallback` with `selectedEvent` in its dependency array; the mount `useEffect` (lines 73-75) depends on `[loadActiveEvents]`. Every time `setSelectedEvent(evt)` runs (line 177, when the agent clicks a different project card), `loadActiveEvents` is redefined with a new reference, which re-triggers the effect, which re-fetches `GET /agents/active-events` from scratch — purely to change which already-loaded event is displayed. This doesn't cause an infinite loop (the `!selectedEvent` guard on line 62 prevents that), but it does mean every click between project cards costs an unnecessary full-list network round-trip. — **Moderate**.

### Generic checklist

- **Reusable components:** Applies — finding #3.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 124-130) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — the 1/3-2/3 project-list/console split collapses to a single column below `lg`.
- **Color consistency:** Applies — finding #2. The `STAGES` array's `orange`/`blue` color mapping (lines 28-29) reads as a deliberate categorical stage-color scheme (similar to role badges elsewhere) rather than primary-color drift — not required to change, though `orange` specifically has no other legitimate use anywhere in the app per `00-Color-System.md` §7 and could reasonably migrate to `amber` if this constant is touched during the shared-extraction work in finding #3.
- **Design consistency:** N/A.
- **Correctness:** Applies — findings #1 (critical), #4.
- **Improvement opportunity:** None beyond fixing finding #1 — the checklist feature is well-designed visually, it just needs real per-event persistence.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — checklist items are clickable divs without `role="checkbox"`/keyboard support, though this is a lower priority than the persistence bug; note for a follow-up pass if this page is revisited.

## Implementation Prompt

Apply these changes to `src/features/agent-dashboard/ActiveExecution.page.jsx`:

**1. Correctness fix (do first, highest value):**
- Fix the checklist persistence gap (finding #1): either (a) fetch the per-event checklist state from the backend when `selectedEvent` changes (requires a backend field/endpoint storing per-booking checklist progress — coordinate with whoever owns the `/agents/bookings/:id/stage` API, since `checklistCompleted` is already sent one-way but never read back), and save each toggle immediately or on "Save Milestone," or (b) at minimum, reset `checklist` to `DEFAULT_CHECKLIST` whenever `selectedEvent._id` changes, so different events don't visually share progress they don't actually share — this is the safe minimum fix if backend persistence is out of scope for this pass, but flag clearly that checklist progress still won't survive a refresh under this minimal option.

**2. Correctness fix:**
- Fix the refetch-on-select issue (finding #4): remove `selectedEvent` from `loadActiveEvents`'s dependency array, and instead auto-select the first event only once after the initial successful fetch (e.g. track "has auto-selected" with a `useRef` or a separate `hasInitialized` state flag), so switching between already-loaded project cards is a pure client-side state change with no network call.

**3. Color consistency:**
- Change the header pill (line 137) from `blue-*` to `purple-*`, matching every other page's identical badge pattern.

**4. Reusable extraction (coordinate with `33-MySchedule.md`):**
- Extract the shared `EXECUTION_STAGES` constant as recommended there.

Preserve the milestone-advancement flow, event-selection UI, and overall page layout — none of the above requires restructuring beyond the checklist-persistence and refetch fixes.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Agent/ActiveExecution/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Agent/ActiveExecution/`

---

## UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - **Left:** Contextual icon badge in purple container, page title, and descriptive subtitle.
   - **Right:** Primary action button(s) (e.g. "Refresh Data", "Action") with clean styling.

2. **Stat Cards Section (if applicable)**:
   - Built with the reusable `<StatCard>` component (`src/components/ui/StatCard.jsx`) supporting categorical tone themes.
   - Ultra-compact horizontal layout with minimal height (~48px) and no captions/subtitles.
   - Interactive click-to-filter support and pulse skeleton loader fallback state (`loading={true}`) when stats data is fetching or unavailable.

3. **Search & Filters Bar Section (if applicable)**:
   - Sits directly above the table/cards in a rounded card container (`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800`).
   - **Left:** Search input with search icon, live debounce (350ms), and clear `(X)` button.
   - **Right:** Clean dropdown selectors for filtering without redundant filter icons next to the dropdowns.

4. **Card / Form Grid Layout**:
   - Organized into clean, responsive grid layout with proper card borders and dark mode tokens.
   - Interactive elements have clear hover and focus states.

6. **Modals & Dialogs (if applicable)**:
   - Reusable `<Modal>` component (`src/components/ui/Modal.jsx`) mounted via `createPortal` with backdrop click close and Escape key dismiss.

7. **Coding Standards**:
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## Verification Checklist

- [ ] Sub-components live in `src/components/pages/Agent/ActiveExecution/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Interactive controls and form elements have proper disabled, hover, and focus states.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.