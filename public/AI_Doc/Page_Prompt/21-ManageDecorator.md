# Manage Decorators (Admin) — Improvement Prompt

> **File:** `src/features/admin/ManageDecorator.page.jsx`  
> **Route:** `/dashboard/manage-decorators`  
> **Access:** `Admin`  
> **Sub-Components Location:** `src/components/pages/Admin/DecoratorManagement/`

---

## 1. Page Overview & Purpose
The Manage Decorators page allows platform administrators to verify decorator applications, inspect portfolios, approve/suspend accounts, and track decorator performance metrics.

---

## 2. Architecture & Sub-Component Decomposition
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Admin/DecoratorManagement/`:

- **Main Page:** `src/features/admin/ManageDecorator.page.jsx`
- **Sub-Components Directory:** `src/components/pages/Admin/DecoratorManagement/`
  1. [`ManageDecoratorStats.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/DecoratorManagement/ManageDecoratorStats.jsx) — Ultra-compact stat cards for Total Decorators, Verified, Pending Approval, and Suspended with skeleton fallback.
  2. [`ManageDecoratorFilters.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/DecoratorManagement/ManageDecoratorFilters.jsx) — Search input on the left with clear button; Status and City dropdowns on the right without redundant filter icons.
  3. [`DecoratorTableRow.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/DecoratorManagement/DecoratorTableRow.jsx) — Table row with px-2 cell padding, canonical min-w-* constraints, status badge, and centered bordered action buttons.
  4. [`ManageDecoratorViewModal.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/DecoratorManagement/ManageDecoratorViewModal.jsx) — View decorator application and portfolio modal using reusable Modal.
  5. [`ManageDecoratorStatusModal.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/DecoratorManagement/ManageDecoratorStatusModal.jsx) — Update status and verification modal using reusable Modal.

---

## 3. UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - **Left:** Contextual icon badge in purple container, page title, and descriptive subtitle.
   - **Right:** Primary action button(s) (e.g. "Refresh Data", "Add New") with clean styling.

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
   - **Action Buttons:** Small bordered icon buttons (`border border-slate-200 dark:border-slate-700 rounded-md p-1.5 transition-colors`) with hover background colors and centered header label (`text-center`).
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
- [ ] Sub-components live in `src/components/pages/Admin/DecoratorManagement/`.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, and explicit `min-w-*` on all cells.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.
