# Platform Analytics (Admin) — Improvement Prompt

> **File:** `src/features/admin/Analytics.page.jsx`  
> **Route:** `/dashboard/analytics`  
> **Access:** `Admin`  
> **Sub-Components Location:** `src/components/pages/Admin/Analytics/`

---

## 1. Page Overview & Purpose
The Platform Analytics page provides platform administrators with business intelligence, revenue growth charts, booking trends, user acquisition metrics, and geographic performance heatmaps.

---

## 2. Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Admin/Analytics/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals) together.

- **Main Page:** `src/features/admin/Analytics.page.jsx`
- **Sub-Components Directory:** `src/components/pages/Admin/Analytics/`
  1. [`AnalyticsToolbar.jsx (100-140 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/Analytics/AnalyticsToolbar.jsx) — Date range selector and high-level KPI stat cards.
  2. [`RevenueChartCard.jsx (150-220 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/Analytics/RevenueChartCard.jsx) — Revenue and profit trend area/line chart card.
  3. [`BookingsDistributionCard.jsx (150-220 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/Analytics/BookingsDistributionCard.jsx) — Category and status breakdown donut/bar chart card.
  4. [`RegionalPerformanceTable.jsx (140-200 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/Analytics/RegionalPerformanceTable.jsx) — Geographic division performance table with px-2 cell padding and min-w-* constraints.

---

## 3. UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - Built using the standardized reusable `<DashboardPageHeader>` component (`src/components/ui/DashboardPageHeader.jsx`).
   - Frameless structure with no background card, no outer border, and no vertical padding box.
   - **Left:** Contextual icon badge in purple container (`p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl`), responsive title (`text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight`), and descriptive subtitle (`text-xs sm:text-sm text-slate-500 dark:text-slate-400`).
   - **Right:** Standardized "Refresh Data" button (`onRefresh`, `refreshing`, `refreshDisabled`) alongside a custom action button slot (`actions` / `children`) for page-specific primary/secondary actions.
   - **Bottom:** Tapered border line (`h-[3px] w-full rounded-full bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent`).

2. **Stat Cards Section**:
   - Built with the reusable `<StatCard>` component (`src/components/ui/StatCard.jsx`) supporting categorical tone themes.
   - Ultra-compact horizontal layout with minimal height (~48px) and no captions/subtitles.
   - Interactive click-to-filter support and pulse skeleton loader fallback state (`loading={true}`) when stats data is fetching or unavailable.

3. **Search & Filters Bar Section**:
   - Sits directly above the table in a rounded card container (`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800`).
   - **Left:** Search input with search icon, live debounce (350ms), and clear `(X)` button.
   - **Right:** Clean dropdown selectors for filtering without redundant filter icons next to the dropdowns.

4. **Table Redesign**:
   - **Container:** Crisp unrounded container (`rounded-none border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden`).
   - **Header `<thead>`:** Distinct background color (`bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider`).
   - **Cell Padding:** Standard cell padding capped at `px-2` (`py-3.5 px-2`).
   - **Responsiveness & Min-Width:** Every column/cell (`<th>` and `<td>`) MUST have an explicit canonical `min-w-*` class wrapped in `overflow-x-auto` to prevent wrapping or breaking on mobile.
   - **Action Buttons: Small bordered icon buttons (`border border-slate-200 dark:border-slate-700 rounded-md p-1.5 transition-colors`) with hover background colors and centered header label (`text-center`). If any action button is not applicable for a specific row, keep it visible in a disabled state (`disabled` attribute with `disabled:opacity-30 disabled:cursor-not-allowed`) instead of hiding/vanishing it.
   - **Loading State:** Reusable `<TableSkeleton rows={5} columns={5} />` inside `<tbody>` when loading.
   - **Empty State:** Reusable `<EmptyState ... />` when no items match criteria.

5. **Pagination Footer**:
   - Built with the reusable `<Pagination>` component (`src/components/ui/Pagination.jsx`).
   - Shares the **exact same background color** as the table header (`bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800`).
   - 3-part layout:
     - **Left:** Range summary info ("Showing 1 to 10 of N items").
     - **Middle:** Per-page dropdown limit selector ("Per page: [10 | 20 | 50]").
     - **Right:** Streamlined `Prev` button, current page indicator (`Page X / Y`), and `Next` button (no redundant numeric buttons).

6. **Modals & Dialogs**:
   - Reusable `<Modal>` component (`src/components/ui/Modal.jsx`) mounted via `createPortal` with backdrop click close and Escape key dismiss.

7. **Coding Standards**:
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## 4. Verification Checklist
- [x] Sub-components live in `src/components/pages/Admin/Analytics/` and adhere to the 100-350 lines sizing standard.
- [x] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [x] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [x] Search input has clear button and clean dropdowns without redundant filter icons.
- [x] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, and explicit `min-w-*` on all cells.
- [x] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [x] Table loading renders reusable `<TableSkeleton>`.
- [x] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [x] Single-line comments only (`// ...`) with light density.
- [x] `npm run build` compiles with 0 errors.

---

```
=================================================================
-------------------------- Change Log ---------------------------
=================================================================
```
- **Date**: 2026-08-18
- **Target Page**: `src/features/admin/Analytics.page.jsx`
- **Actions Taken**:
  - Decomposed monolithic file into 4 cohesive 120-160 line components under `src/components/pages/Admin/Analytics/` (`AnalyticsToolbar.jsx`, `RevenueChartCard.jsx`, `BookingsDistributionCard.jsx`, `RegionalPerformanceTable.jsx`).
  - Redesigned top header with contextual icon, title, subtitle, and Refresh button.
  - Implemented ultra-compact `<StatCard>` section (~48px height) with skeleton loading fallback.
  - Built interactive monthly revenue trend and marketplace commissions chart card.
  - Built category demand and booking lifecycle status donut distribution charts card.
  - Standardized division performance table with `rounded-none`, `px-2` cell padding, and canonical `min-w-*` classes (`min-w-40`, `min-w-30`, `min-w-35`, `min-w-30`, `min-w-40`).
  - Set status column to `min-w-40` for both header and table cells.
  - Applied single-line comments only (`// ...`) with light density.
