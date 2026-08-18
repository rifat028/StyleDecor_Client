# My Performance (Agent) — Improvement Prompt

**Route(s):** `/dashboard/my-performance`
**File(s) in scope:** `src/features/agent-dashboard/PerformanceAppraisals.page.jsx`.
**Related audit references:** None specific to this file in `00-06` — it wasn't individually called out in the original audit.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Half of this file's icon imports are unused.** Of the 14 icons imported (lines 6-19), 7 are never referenced in the JSX: `Building`, `Calendar`, `Layers`, `TrendingUp`, `User`, `Quote`, and `Image as ImageIcon`. Only `Award`, `Star`, `Sparkles`, `ShieldCheck`, `CheckCircle2`, `ThumbsUp`, and `MessageSquare` are actually used. This is a notably high dead-import ratio for a single file — likely leftover from an earlier draft of the page that included sections (e.g. an agency-affiliation card using `Building`, a "member since" line using `Calendar`) that were removed or never built. — **Polish** (cleanup, but a large enough count to be worth flagging explicitly).
2. **Positive note: this page fetches its entire dossier (metrics, badges, reviews, agent identity) from a single `GET /agents/my-performance` request.** Line 34 — no multi-request stats pattern like the admin pages flagged in `18-ManageServices.md`/`21-ManageDecorator.md`/`22-ManageBookings.md`. Worth citing as a positive reference alongside `ManageUser.page.jsx`/`ManageAgents.page.jsx`'s single-endpoint stats pattern.

### Generic checklist

- **Reusable components:** N/A — no duplicated markup patterns found on this page.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 47-53) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — badges and reviews grids collapse correctly at all widths.
- **Color consistency:** Applies, minor — legacy `bg-gradient-to-br` syntax (line 107), same recurring issue found elsewhere; change to `bg-linear-to-br`. The `ThumbsUp`/"Recommendation" card's `text-blue-500` (line 148) reads as deliberate KPI-dashboard categorical variety, same judgment call made on other KPI-heavy pages — not a hard violation.
- **Design consistency:** Applies, minor — all badges (lines 168-187) render with identical visual treatment (same icon, same color, same "Verified Active" label) regardless of what the badge actually represents — a missed opportunity for quick visual differentiation between badge types, not a correctness issue. Optional polish, not required.
- **Correctness:** N/A — no logic bugs found; the rating-distribution calculation (lines 67-71) is correct and self-contained.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** Applies — finding #1.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found; this page is read-only with no interactive form elements beyond standard content display.

## Implementation Prompt

Apply these changes to `src/features/agent-dashboard/PerformanceAppraisals.page.jsx`:

**1. Coding standard fix:**
- Remove the 7 unused imports: `Building`, `Calendar`, `Layers`, `TrendingUp`, `User`, `Quote`, `Image as ImageIcon` (from the import block at lines 6-19).

**2. Polish:**
- Change `bg-gradient-to-br` (line 107) to `bg-linear-to-br`.

**3. Optional polish (only if the pass has room):**
- Consider giving different badge types (`badges[].name`) distinct icons/colors instead of the identical purple `Award` treatment for every badge, if the badge data model supports categorization (e.g. a `badges[].type` or icon field) — skip if the backend doesn't currently provide enough structure to differentiate badge types meaningfully.

Preserve all existing performance-dossier fetching and review-display logic — this is a small, low-risk cleanup pass.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Agent/PerformanceAppraisals/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Agent/PerformanceAppraisals/`

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

- [ ] Sub-components live in `src/components/pages/Agent/PerformanceAppraisals/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.