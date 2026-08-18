# Manage Bookings (Admin) — Improvement Prompt

> **File:** `src/features/admin/ManageBookings.page.jsx`  
> **Route:** `/dashboard/manage-bookings`  
> **Access:** `Admin`  
> **Sub-Components Location:** `src/components/pages/Admin/BookingManagement/`

---

## 1. Page Overview & Purpose
The Manage Bookings page provides platform administrators with oversight of all booking requests, payment states, execution stages, and field agent assignments.

---

## 2. Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Admin/BookingManagement/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals) together.

- **Main Page:** `src/features/admin/ManageBookings.page.jsx`
- **Sub-Components Directory:** `src/components/pages/Admin/BookingManagement/`
  1. [`BookingManagementToolbar.jsx (120-150 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/BookingManagement/BookingManagementToolbar.jsx) — Consolidated toolbar with stat cards and search/status/city/date range filters.
  2. [`BookingManagementTable.jsx (180-240 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/BookingManagement/BookingManagementTable.jsx) — Table component with px-2 cell padding, canonical min-w-* constraints, status pill badges, TableSkeleton, and 3-part Pagination.
  3. [`BookingManagementModals.jsx (240-320 lines)`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/BookingManagement/BookingManagementModals.jsx) — Consolidated booking dossier view modal and decorator/agent assignment modal.

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
- [x] Sub-components live in `src/components/pages/Admin/BookingManagement/` and adhere to the 100-350 lines sizing standard.
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
- **Target Page**: `src/features/admin/ManageBookings.page.jsx`
- **Actions Taken**:
  - Decomposed 757-line monolithic file into 3 cohesive 100-250 line components under `src/components/pages/Admin/BookingManagement/` (`BookingManagementToolbar.jsx`, `BookingManagementTable.jsx`, `BookingManagementModals.jsx`).
  - Redesigned top header with contextual icon, title, subtitle, and Refresh button.
  - Implemented ultra-compact `<StatCard>` section (~48px height) with skeleton loading fallback.
  - Created clean search input with 350ms debounce and clear button, paired with clean Status, Decorator, and Sort dropdowns.
  - Standardized table with `rounded-none`, `px-2` cell padding, and canonical `min-w-*` classes (`min-w-55`, `min-w-45`, `min-w-40`, `min-w-35`, `min-w-30`, `min-w-25`).
  - Added centered actions column header and bordered `rounded-md` action buttons with hover backgrounds.
  - Integrated 3-part streamlined `<Pagination>` matching table header background.
  - Built comprehensive booking dossier modal with event schedule, customer contact, delivery address, financial ledger, and assigned personnel.
  - Applied single-line comments only (`// ...`) with light density.
