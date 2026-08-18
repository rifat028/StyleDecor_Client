# My Reviews — Improvement Prompt

**Route(s):** `/dashboard/my-reviews`
**File(s) in scope:** `src/features/customer/MyReviews.page.jsx`.
**Related audit references:**
- `02-Reusable-Components.md` §6 (Modal shell — one more hand-rolled instance here).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **A "pending" filter tab is fully implemented in the filtering logic but has no UI control to select it.** Line 71: `if (filterTab === "pending" && r.vendorReply && r.vendorReply.reply) return false;` — but the rendered tab list (lines 265-267) only offers `"all"` and `"replied"`; there is no third tab for `"pending"`, so this branch of the filter can never actually be reached by a user. Minor instance of the "half-wired state" pattern found repeatedly across this review (dead prop in `CoverageMap`, unreachable modal in `TopDecorators`, etc.), here at low stakes. — **Polish**.
2. **Loading state is a positive example — noted, not a finding.** `if (loading && reviews.length === 0) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>;` (lines 163-169) sizes its wrapper generously enough that the shared `Spinner`'s forced `h-screen` doesn't create a visible layout problem in practice, unlike the padded-box patterns seen on several other pages. No fix needed here — worth using as a reference if a `min-h` convention for `Spinner` usage is ever formalized.

### Generic checklist

- **Reusable components:** Applies, minor — the Edit Review modal (lines 434-520) is one more hand-rolled modal instance, adding to the count from `14-MyBookings.md`; migrate it onto the shared `<Modal>` shell if/when built. The star-rating picker (lines 456-476) is structurally identical to the one in `MyBookings.page.jsx`'s Review submission modal (same 5-star hover/click pattern) — a shared `<StarRatingInput>` component would remove this duplication; build it if this is the second page reaching the pattern (it is — `14-MyBookings.md` has the same picker in its own review modal).
- **Skeleton/spinner loader:** N/A — see finding #2, this page's usage is already appropriate.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — filter bar and review cards collapse correctly at all widths.
- **Color consistency:** N/A — this page is clean, using canonical `purple`/`emerald`/`amber`/`rose` throughout with no deprecated hues.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #1.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found; star-rating buttons are real `<button>` elements.

## Implementation Prompt

Apply these changes to `src/features/customer/MyReviews.page.jsx`:

**1. Correctness/polish fix:**
- Resolve finding #1: either add a third "Pending Reply" tab to the filter-tab list (lines 264-284) so the existing filtering logic becomes reachable, or remove the dead `filterTab === "pending"` branch (line 71) if a pending-only view isn't actually wanted. Prefer adding the tab — the logic is already correct and tested by its presence, it's just missing a UI trigger.

**2. Reusable extraction (coordinate with `14-MyBookings.md`):**
- If a shared `<StarRatingInput>` component is warranted (two instances now: this file's edit-review modal and `MyBookings.page.jsx`'s submit-review modal), build it once and use it in both places — a `<StarRatingInput value={editRating} onChange={setEditRating} />`-shaped component covering the hover-preview + click-to-set + descriptive label behavior already implemented identically in both files.
- If/when the shared `<Modal>` shell is built (per `14-MyBookings.md`), migrate this file's Edit Review modal onto it.

Preserve all existing review-fetching, filtering, editing, and deletion logic — none of the above requires restructuring the page.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Customer/MyReviews/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Customer/MyReviews/`

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

- [ ] Sub-components live in `src/components/pages/Customer/MyReviews/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.