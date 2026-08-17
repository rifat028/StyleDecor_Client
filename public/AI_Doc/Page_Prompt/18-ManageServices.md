# Manage Services (Admin) — Improvement Prompt

> **File:** `src/features/admin/ManageServices.page.jsx`  
> **Route:** `/dashboard/manage-services`  
> **Access:** `Admin`

---

## 1. Page Overview & Purpose
The Manage Services page provides platform administrators with oversight of all decoration packages offered by decorators. Administrators can filter services by category/status/price, review detailed service dossiers, toggle active/inactive and featured statuses, and delete services.

---

## 2. Architecture & Sub-Component Decomposition
To maintain clean separation of concerns and reduce file size, the page is decomposed into sub-components under `src/features/admin/components/`:

- **Main Page:** `src/features/admin/ManageServices.page.jsx`
- **Sub-Components:**
  1. `ManageServicesStats.jsx` — Metric summary cards for Total Services, Active, Inactive, and Featured with tone styling and skeleton loading fallback (`loading={true}`).
  2. `ManageServicesFilters.jsx` — Search bar on the left with clear button; Category, Status, and Sorting dropdowns on the right without redundant filter icons.
  3. `ServiceTableRow.jsx` — Table row with `px-2` cell padding, canonical `min-w-*` responsive constraints, status toggles, and centered bordered action buttons.
  4. `ManageServicesViewModal.jsx` — View full service package details modal using `<Modal>`.

---

## 3. UI/UX & Table Design Standards

1. **Top Header Bar**:
   - **Left:** `Sparkles` icon badge in purple container, page title ("Manage Services"), and subtitle.
   - **Right:** Primary "Refresh Data" button with icon.

2. **Stat Cards Section**:
   - Reusable `<StatCard>` component with tone themes (`indigo`, `emerald`, `amber`, `purple`).
   - Sits directly below the header in its own section.
   - Click-to-filter support and pulse skeleton loader fallback state (`loading={true}`) when stats data is not yet available.

3. **Search & Filters Section**:
   - Left: Search input with live debounce (350ms) and clear `(X)` button.
   - Right: Clean dropdown selectors for **Category**, **Status**, and **Sort By** without redundant filter icons next to the dropdowns.

4. **Table Redesign**:
   - **Container:** Unrounded crisp container (`rounded-none border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden`).
   - **Header `<thead>`:** Distinct background (`bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider`).
   - **Cell Padding:** Standard cell padding capped at `px-2` (`py-3.5 px-2`).
   - **Min-Width Rule:** Every cell (`<th>` and `<td>`) MUST have an explicit `min-w-*` class wrapped in `overflow-x-auto` to prevent wrapping or breaking on mobile devices.
   - **Action Buttons:** Small bordered icon buttons (`border border-slate-200 dark:border-slate-700 rounded-md p-1.5`) with hover backgrounds and centered header label (`text-center`).
   - **Loading State:** Reusable `<TableSkeleton rows={5} columns={6} />` inside `<tbody>`.
   - **Empty State:** Reusable `<EmptyState ... />`.

5. **Pagination Footer**:
   - Reusable `<Pagination>` component matching table header background (`bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800`).
   - 3-part layout:
     - **Left:** Range summary info ("Showing 1 to 10 of 42 services").
     - **Middle:** Per-page dropdown selector ("Per page: [10 | 20 | 50]").
     - **Right:** Streamlined `Prev` button, current page indicator (`Page X / Y`), and `Next` button (no redundant numeric buttons).

6. **Code Quality & Comments**:
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## 4. Verification Checklist
- [ ] Sub-components live in `src/features/admin/components/`.
- [ ] Header has icon, title, and subtitle on top-left, and Refresh button on top-right.
- [ ] Stat cards use `<StatCard>` with tone styling and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, and explicit `min-w-*` on all cells.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.
