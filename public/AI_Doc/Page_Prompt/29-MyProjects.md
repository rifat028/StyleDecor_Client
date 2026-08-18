# My Projects (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/my-projects`
**File(s) in scope:** `src/features/decorator-dashboard/MyProjects.page.jsx`. Cross-referenced: `src/features/customer/MyBookings.page.jsx` and `src/features/admin/ManageBookings.page.jsx` (byte-for-byte duplicated status badge — see finding #1), `src/features/decorator-dashboard/MyEarnings.page.jsx`/`MyAgents.page.jsx` (duplicated decorator-ID resolution — see finding #3).
**Related audit references:**
- `04-Business-Logic.md` §5 — this doc's exact concern ("this is a decorator-driven, not strictly sequential status field; the UI doesn't appear to restrict which transitions are legal... illegal transitions... are only preventable server-side, if at all") is confirmed precisely in finding #2, with exact line numbers.
- `04-Business-Logic.md` §7 (10% commission / 88.5% vendor receivable fallback math) — confirmed present and consistent with `ManageTransactions.page.jsx`/`MyEarnings.page.jsx`.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`renderStatusBadge` is byte-for-byte identical to the same function in `MyBookings.page.jsx` (customer) and `ManageBookings.page.jsx` (admin) — now a third confirmed instance.** Same case statements, same 9-hue palette including the out-of-canon `cyan`/`orange`/`blue` usage already flagged in `14-MyBookings.md` finding #3 and `22-ManageBookings.md` finding #1. Three files, one function — the shared `<BookingStatusBadge>` extraction recommended in `22-ManageBookings.md` should also cover this file. — **Moderate**.
2. **"Advance Project Lifecycle" modal lets the decorator jump to any of the 10 booking statuses via a plain dropdown, with no legal-transition restriction.** `STATUS_STEPS` (lines 31-42) lists all 10 values in lifecycle order, but the modal (lines 735-749) renders them as a flat `<select>` with no logic preventing an illegal jump (e.g. `completed` → `pending`, or skipping straight from `pending` to `fully_paid`). This is the exact, precise site of the concern `04-Business-Logic.md` §5 raises generically — now pinpointed to this file's exact lines. — **Moderate** (a real gap, but likely intentional per the business doc's own framing — "decorator-driven, not strictly sequential" — so this needs a product decision, not an assumed fix).
3. **Decorator-ID resolution logic (lines 71-93) is duplicated near-identically in `MyEarnings.page.jsx` and `MyAgents.page.jsx`.** Same `/decorators/me` → fallback `/decorators/:email` try/catch pattern, copy-pasted across at least 3 decorator-dashboard files (and further duplicated *within* `MyAgents.page.jsx` itself — see `31-MyAgents.md` finding #1). A shared `useDecoratorId()` hook would remove all of these copies at once. — **Moderate** (cross-file DRY opportunity, high-value given the count).
4. **"Assign Field Specialist" and "Update Progress Stage" action buttons use `indigo-*`, inconsistent with the rest of the page's `purple-*` chrome.** Lines 554, 568. Isolated stray usage, not a page-wide drift like `ManageUser.page.jsx`. — **Polish**.
5. **File is 871 lines with 3 separate modals (View Dossier, Update Status, Assign Specialist) totaling roughly 280 lines combined.** Concrete split points: `src/features/decorator-dashboard/components/MyProjectsViewModal.jsx` (lines ~603-694, including the payments-audit-trail sub-section), `UpdateStatusModal.jsx` (lines ~725-750), `AssignSpecialistModal.jsx` (lines ~790-845, which already has its own self-contained agent-picker list UI worth keeping together); the table row (lines ~471-575) → a local `<ProjectTableRow>`. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies — findings #1, #3. The three modals (View Dossier lines 585-707, Update Status lines 710-769, Assign Specialist lines 772-866) are further hand-rolled instances for the shared `<Modal>` shell.
- **Component decomposition / file size:** Applies — 871 lines; see finding #5 for concrete split points (3 modals, table row).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 423-426) and the payments-audit-trail loading inside the View Dossier modal (lines 645-648) both use the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — finding #4.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #2 (flag for product decision, not an assumed bug fix).
- **Improvement opportunity:** None beyond what's covered above.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/MyProjects.page.jsx`:

**1. Reusable extraction (coordinate with `14-MyBookings.md`/`22-ManageBookings.md` — fix once, use everywhere):**
- If the shared `<BookingStatusBadge>` component has been built while processing an earlier page, import and use it here instead of this file's own `renderStatusBadge` copy. If not yet built, build it here (or wherever it's built first) with the reduced, canonical color palette from `00-Color-System.md`, and note that it needs to be adopted by `MyBookings.page.jsx` and `ManageBookings.page.jsx` too.
- Extract decorator-ID resolution into a shared `useDecoratorId()` hook (e.g. `src/hooks/useDecoratorId.js`) encapsulating the `/decorators/me` → fallback `/decorators/:email` lookup, and use it here, in `MyEarnings.page.jsx`, and in `MyAgents.page.jsx` (which additionally needs its own internal duplicate removed — see `31-MyAgents.md`).

**2. Correctness (flag for decision, don't assume):**
- Raise finding #2 with whoever owns the booking-lifecycle business rules: should the "Advance Project Lifecycle" dropdown restrict which transitions are selectable based on the current status (e.g. only show the next 1-2 logical steps, or grey out illegal jumps), or is fully-manual status-setting intentional? Implement whichever is confirmed — don't silently add transition restrictions without confirming they're wanted, since the business doc's own phrasing suggests this may be deliberate flexibility for decorators handling edge cases.

**3. Polish:**
- Change `indigo-*` on the "Assign Field Specialist" and "Update Progress Stage" buttons (lines 554, 568) to `purple-*`.

**4. Component decomposition:**
- Extract the 3 modals into `src/features/decorator-dashboard/components/MyProjectsViewModal.jsx`, `UpdateStatusModal.jsx`, and `AssignSpecialistModal.jsx`, and the table row into a local `<ProjectTableRow>`.

Preserve all existing booking-management, agent-assignment, and payment-audit logic — none of the above requires restructuring the page's data flow.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Decorator/MyProjects/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Decorator/MyProjects/`

---

## UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - Built using the standardized reusable `<DashboardPageHeader>` component (`src/components/ui/DashboardPageHeader.jsx`).
   - Frameless structure with no background card, no outer border, and no vertical padding box.
   - **Left:** Contextual icon badge in purple container (`p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl`), responsive title (`text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight`), and descriptive subtitle (`text-xs sm:text-sm text-slate-500 dark:text-slate-400`).
   - **Right:** Standardized "Refresh Data" button (`onRefresh`, `refreshing`, `refreshDisabled`) alongside a custom action button slot (`actions` / `children`) for page-specific primary/secondary actions.
   - **Bottom:** Tapered border line (`h-[3px] w-full rounded-full bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent`).

2. **Stat Cards Section (if applicable)**:
   - Built with the reusable `<StatCard>` component (`src/components/ui/StatCard.jsx`) supporting categorical tone themes.
   - Ultra-compact horizontal layout with minimal height (~48px) and no captions/subtitles.
   - Interactive click-to-filter support and pulse skeleton loader fallback state (`loading={true}`) when stats data is fetching or unavailable.

3. **Search & Filters Bar Section (if applicable)**:
   - Sits directly above the table/cards in a rounded card container (`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800`).
   - **Left:** Search input with search icon, live debounce (350ms), and clear `(X)` button.
   - **Right:** Clean dropdown selectors for filtering without redundant filter icons next to the dropdowns.

4. **Table Redesign**:
   - **Container:** Crisp unrounded container (`rounded-none border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden`).
   - **Header `<thead>`:** Distinct background color (`bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider`).
   - **Cell Padding:** Standard cell padding capped at `px-2` (`py-3.5 px-2`).
   - **Responsiveness & Min-Width:** Every column/cell (`<th>` and `<td>`) MUST have an explicit canonical `min-w-*` class wrapped in `overflow-x-auto` to prevent wrapping or breaking on mobile. Status column must have `min-w-40`.
   - **Action Buttons:** Small bordered icon buttons (`border border-slate-200 dark:border-slate-700 rounded-md p-1.5 transition-colors`) with hover background colors and centered header label (`text-center`). If any action button is not applicable for a specific row, keep it visible in a disabled state (`disabled` attribute with `disabled:opacity-30 disabled:cursor-not-allowed`) instead of hiding/vanishing it.
   - **Loading State:** Reusable `<TableSkeleton rows={5} columns={5} />` inside `<tbody>` when loading.
   - **Empty State:** Reusable `<EmptyState ... />` when no items match criteria.

5. **Pagination Footer**:
   - Built with the reusable `<Pagination>` component (`src/components/ui/Pagination.jsx`).
   - Shares the **exact same background color** as the table header (`bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800`).
   - 3-part layout:
     - **Left:** Range summary info ("Showing 1 to 10 of N items").
     - **Middle:** Per-page dropdown limit selector ("Per page: [10 | 20 | 50]").
     - **Right:** Streamlined `Prev` button, current page indicator (`Page X / Y`), and `Next` button (no redundant numeric buttons).

6. **Modals & Dialogs (if applicable)**:
   - Reusable `<Modal>` component (`src/components/ui/Modal.jsx`) mounted via `createPortal` with backdrop click close and Escape key dismiss.

7. **Coding Standards**:
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## Verification Checklist

- [ ] Sub-components live in `src/components/pages/Decorator/MyProjects/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.