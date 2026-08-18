# My Schedule (Agent) — Improvement Prompt

**Route(s):** `/dashboard/my-schedule`
**File(s) in scope:** `src/features/agent-dashboard/MySchedule.page.jsx`. Cross-referenced: `src/features/agent-dashboard/ActiveExecution.page.jsx` (duplicated execution-stage constant — see finding #2).
**Related audit references:**
- `04-Business-Logic.md` §5 (agent execution `STAGES`: `preparing → on_the_way → in_progress → completed`) — confirmed this page's stage-update modal offers exactly these 4 values.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`renderStatusBadge` uses `orange` and `blue`, two hues flagged as outside the canonical palette.** Lines 130-175: `on_the_way` uses `orange-*` (deprecated per `00-Color-System.md` §7, no other legitimate use anywhere in the app) and `in_progress` uses `blue-*` (reserved for info-only use, not a lifecycle stage). This is a distinct function from the near-identical one duplicated across `MyBookings.page.jsx`/`ManageBookings.page.jsx`/`MyProjects.page.jsx` (it covers a smaller, agent-specific status set), but shares the same color-palette problem. — **Moderate**.
2. **Execution-stage options are hardcoded independently here and in `ActiveExecution.page.jsx`.** This page's stage-update modal (lines 431-434) hardcodes the same 4 stages as plain `<option>` text; `ActiveExecution.page.jsx`'s `STAGES` constant (lines 26-31) defines the same 4 stages as a structured array with icons and colors. Two independent representations of the same fixed set, confirmed matching `04-Business-Logic.md` §5's documented `STAGES` model. — **Polish** (DRY opportunity, not a live bug since both lists currently agree).

### Generic checklist

- **Reusable components:** Applies — finding #2. The two modals (Milestone Update lines 393-470, View Dossier lines 472-542) are hand-rolled instances for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 244-247) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — finding #1. Page chrome itself (buttons, focus rings) correctly uses `purple-*` throughout — only the status badge hues need fixing.
- **Design consistency:** N/A.
- **Correctness:** N/A — no logic bugs found; the timeline filter, search, and stage-update flow all work correctly.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/agent-dashboard/MySchedule.page.jsx`:

**1. Color consistency:**
- Replace `orange-*` (on_the_way badge) and `blue-*` (in_progress badge) in `renderStatusBadge` (lines 130-175) with hues that stay within `00-Color-System.md`'s canonical set — e.g. `amber` for "on the way" (transit/attention) and a role distinct from `blue`'s reserved info-only use for "in progress."

**2. Reusable extraction (coordinate with `34-ActiveExecution.md`):**
- Extract a shared `EXECUTION_STAGES` constant (id, label, and optionally icon/color) covering the 4 execution stages, and use it to build both this page's `<option>` list (lines 431-434) and `ActiveExecution.page.jsx`'s `STAGES` array — build it in whichever file is processed first, import in the other.

Preserve all existing timeline filtering, search, and milestone-update logic — none of the above requires restructuring the page.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Agent/MySchedule/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Agent/MySchedule/`

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

- [ ] Sub-components live in `src/components/pages/Agent/MySchedule/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.