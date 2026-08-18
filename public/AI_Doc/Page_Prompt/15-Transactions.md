# Transactions — Improvement Prompt

**Route(s):** `/dashboard/transactions`
**File(s) in scope:** `src/features/customer/Transactions.page.jsx`. Cross-referenced: `src/features/customer/MyBookings.page.jsx` (duplicated customer-ID resolution logic — see finding #2), `src/features/home/components/Spinner.jsx` (shared, not modified here).
**Related audit references:**
- `02-Reusable-Components.md` §9 (formatCurrency), §6 (Modal shell).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`Spinner` misuse inside the receipt modal.** Lines 406-409: `<div className="p-12 flex items-center justify-center"><Spinner /></div>` renders while the invoice detail is loading, inside an already-open modal. `Spinner.jsx` forces `h-screen` on its own root regardless of the `p-12` wrapper — the modal will visibly balloon while the receipt loads. Same shared-component-misuse pattern found on several other pages (`05-ServiceDetails.md` finding #2, `14-MyBookings.md` etc.). — **Moderate**.
2. **Customer-ID resolution logic is duplicated with a variation from `MyBookings.page.jsx`.** This file's version (lines 45-66) tries `GET /users/me` and falls back to `GET /users/:email` on failure; `MyBookings.page.jsx`'s version only tries `/users/me`. Two independent implementations of "resolve the logged-in Firebase user to their Mongo customer `_id`," one more defensive than the other. — **Polish** (worth a shared `useCustomerId()` hook, not urgent).
3. **Gradient utility syntax mismatch.** Line 191: `bg-gradient-to-br` (legacy Tailwind v3 naming) while the rest of the app's gradients (already flagged in `01-Home.md` finding #4 for `CoverageMap.jsx`) use the Tailwind v4 `bg-linear-to-*` naming. Another instance of the same inconsistency. — **Polish**.
4. **No pagination — same gap as `MyBookings.page.jsx`.** The transactions table renders every result unpaginated. — **Polish**, consistent with the note in `14-MyBookings.md` finding #4 — fix both together if pagination is added to either.

### Generic checklist

- **Reusable components:** Applies — finding #2. Also `formatCurrency`-style hand-typed `৳{...toLocaleString()}` appears repeatedly (lines 196, 220, 354, 483) — reuse the shared util if built. The receipt modal (lines 386-505) is another hand-rolled modal instance, adding to the count already noted in `14-MyBookings.md` for the shared `<Modal>` shell.
- **Skeleton/spinner loader:** Applies — finding #1. The main table's loading state (lines 278-281) has the same `Spinner`-in-padded-box pattern as other pages; consider a table-row skeleton.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — table has `overflow-x-auto`, summary cards collapse `grid-cols-2` → `lg:grid-cols-3` correctly.
- **Color consistency:** Applies, minor — finding #3. The status-badge implementation here (lines 148-170: 3 states — `emerald` paid, `rose` refunded, `amber` pending) is clean and fully within the canonical palette — a positive contrast to `MyBookings.page.jsx`'s 9-hue chaos; worth using as the reference pattern when fixing that file.
- **Design consistency:** N/A.
- **Correctness:** N/A — no logic bugs found beyond the loading-state UI issue.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found.

## Implementation Prompt

Apply these changes to `src/features/customer/Transactions.page.jsx`:

**1. Correctness/polish fixes:**
- Replace the receipt-modal `<Spinner />` (lines 406-409) with a small inline loading indicator sized for the modal's content area, not the full-screen `Spinner` component.
- Change `bg-gradient-to-br` (line 191) to `bg-linear-to-br` to match the rest of the app's Tailwind v4 gradient syntax.

**2. Reusable extraction (coordinate with `14-MyBookings.md`):**
- If a shared `useCustomerId()` hook is built while processing `MyBookings.page.jsx`, use it here instead of this file's own resolution logic (keep the more defensive fallback-to-email-lookup behavior when merging, since it's strictly safer than the simpler version).
- Reuse `formatCurrency` from `src/lib/format.js` if built; otherwise leave as-is for now (this page alone doesn't need to be the one that builds it, given fewer instances than `MyBookings.page.jsx`).
- If/when the shared `<Modal>` shell is built (per `14-MyBookings.md`), migrate the receipt modal (lines 386-505) onto it.

Preserve all existing transaction-fetching, filtering, and receipt-viewing logic — none of the above requires restructuring the page.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Customer/Transactions/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Customer/Transactions/`

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

- [ ] Sub-components live in `src/components/pages/Customer/Transactions/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.