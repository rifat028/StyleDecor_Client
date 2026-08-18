# Agency Reviews (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/agency-reviews`
**File(s) in scope:** `src/features/decorator-dashboard/AgencyReviews.page.jsx`.
**Related audit references:**
- `04-Business-Logic.md` §9 (`vendorReply` — "the decorator agency can post one official reply per review") — confirmed this page's `handleSubmitReply`/`handleDeleteReply` implement exactly that, matching the documented model.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Delete-reply button uses `hover:text-red-500` instead of the canonical `rose`.** Line 418. One-off instance of the deprecated hue already flagged project-wide in `00-Color-System.md` §5. — **Polish**.
2. **Legacy Tailwind gradient syntax.** Line 206: `bg-gradient-to-br` should be `bg-linear-to-br`, same recurring issue found elsewhere.

### Generic checklist

- **Reusable components:** N/A — the Reply modal (lines 436-523) is a hand-rolled instance for the shared `<Modal>` shell if built elsewhere, but not urgent to build specifically for this page.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 168-174) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A — action buttons are self-labeled text buttons, no icon-only ambiguity.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — findings #1, #2.
- **Design consistency:** N/A.
- **Correctness:** N/A — the reply/delete-reply flow correctly matches the documented one-reply-per-review model.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** Applies — `Edit`, `ThumbsUp`, `User`, and `Image as ImageIcon` are imported (lines 17, 20, 22-23) but never used anywhere in the file's JSX. Four of the file's 18 icon imports are dead. — **Polish**.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found beyond the general Modal-focus-trap pattern already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/AgencyReviews.page.jsx`:

**1. Polish:**
- Change `hover:text-red-500` (line 418) to `hover:text-rose-500`.
- Change `bg-gradient-to-br` (line 206) to `bg-linear-to-br`.
- Remove the unused `Edit`, `ThumbsUp`, `User`, and `Image as ImageIcon` imports (lines 17, 20, 22-23).

Preserve all existing review-filtering, reply-submission, and reply-deletion logic — this is a small, low-risk cleanup pass.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Decorator/AgencyReviews/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Decorator/AgencyReviews/`

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

- [ ] Sub-components live in `src/components/pages/Decorator/AgencyReviews/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.