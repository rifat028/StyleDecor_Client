# User Management — Improvement Prompt

> **File:** `src/features/admin/ManageUser.page.jsx`  
> **Route:** `/dashboard/manage-users`  
> **Access:** `Admin`

---

## 1. Page Overview & Purpose
The User Management page serves as the administrative hub for managing all user accounts on StyleDecor. Administrators can inspect user profiles, assign and switch system roles (Admin, Decorator, Agent, Customer), modify contact addresses, and delete accounts while maintaining robust security safeguards for the Super Administrator account.

---

## 2. Architecture & Sub-Component Decomposition
To eliminate the bloated monolithic file size (1000+ lines) and ensure maximum maintainability, the page is decomposed into dedicated sub-components under `src/components/pages/Admin/UserManagement/`:

- **Main Page:** [`src/features/admin/ManageUser.page.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/features/admin/ManageUser.page.jsx)
- **Sub-Components Directory:** `src/components/pages/Admin/UserManagement/`
  1. [`ManageUserStats.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/UserManagement/ManageUserStats.jsx) — Ultra-compact stat cards for Total Users, Administrators, Decorators, Field Agents, and Customers with click-to-filter support and pulse skeleton loading states.
  2. [`ManageUserFilters.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/UserManagement/ManageUserFilters.jsx) — Search input on the left with clear button; Role and City dropdown filters on the right without superfluous filter icons.
  3. [`UserTableRow.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/UserManagement/UserTableRow.jsx) — Table row with `px-2` cell padding, canonical `min-w-*` responsive constraints, quick role switch dropdown, and centered bordered action buttons.
  4. [`ManageUserViewModal.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/UserManagement/ManageUserViewModal.jsx) — View full user profile modal utilizing the reusable `<Modal>` shell.
  5. [`ManageUserEditModal.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/components/pages/Admin/UserManagement/ManageUserEditModal.jsx) — Edit user profile and address modal utilizing the reusable `<Modal>` shell.

---

## 3. UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - **Left:** `Users` icon badge in purple container, page title ("User Management"), and descriptive subtitle.
   - **Right:** Primary action button ("Refresh Data") with rotating refresh icon.

2. **Stat Cards Section**:
   - Sits directly below the header in its own responsive grid section.
   - Built with the reusable `<StatCard>` component (`src/components/ui/StatCard.jsx`) supporting categorical tone themes:
     - **Total Users:** Indigo tone (`indigo`), `Users` icon.
     - **Administrators:** Rose tone (`rose`), `Shield` icon.
     - **Decorators:** Purple tone (`purple`), `Palette` icon.
     - **Field Agents:** Amber tone (`amber`), `Briefcase` icon.
     - **Customers:** Emerald tone (`emerald`), `UserCheck` icon.
   - Interactive click filtering: Clicking a stat card sets the corresponding role filter.
   - Skeleton Loading: Displays pulse loading skeleton state (`loading={true}`) when stats data is fetching.

3. **Search & Filters Bar Section**:
   - Sits directly above the table in a rounded card container (`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800`).
   - **Left:** Search input with search icon, live debounce (350ms), and clear `(X)` button.
   - **Right:** Two clean dropdown selectors for **Role** and **City** (without redundant filter icons next to the dropdowns).

4. **Table Redesign**:
   - **Container:** Crisp unrounded container (`rounded-none border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden`).
   - **Header `<thead>`:** Distinct background color (`bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider`).
   - **Cell Padding:** Standard cell padding capped at `px-2` (`py-3.5 px-2`).
   - **Responsiveness & Min-Width:** Every column/cell (`<th>` and `<td>`) MUST have an explicit canonical `min-w-*` class wrapped in `overflow-x-auto` to prevent wrapping or breaking on mobile:
     - *User Profile:* `min-w-55` (Avatar, name, email, super admin badge).
     - *Contact & City:* `min-w-45` (Phone, area, city).
     - *System Role:* `min-w-32.5` (Categorical role badge).
     - *Quick Role Switch:* `min-w-35 text-center` (Inline role dropdown).
     - *Actions:* `min-w-30 text-center` (Centered header label).
   - **Action Buttons:** Small bordered icon buttons (`border border-slate-200 dark:border-slate-700 rounded-md p-1.5 transition-colors`) with hover background colors:
     - View Profile: `hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400`.
     - Edit User: `hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400`.
     - Delete User: `hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400`.
   - **Loading State:** Reusable `<TableSkeleton rows={5} columns={5} />` inside `<tbody>` when loading.
   - **Empty State:** Reusable `<EmptyState icon={Users} title="No Users Found" ... />` when no users match criteria.

5. **Pagination Footer**:
   - Built with the reusable `<Pagination>` component (`src/components/ui/Pagination.jsx`).
   - Shares the **exact same background color** as the table header (`bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800`).
   - 3-part layout:
     - **Left:** Range summary info ("Showing 1 to 10 of 48 users").
     - **Middle:** Per-page dropdown limit selector ("Per page: [10 | 20 | 50]").
     - **Right:** Streamlined `Prev` button, current page indicator (`Page X / Y`), and `Next` button (no redundant numeric buttons).

6. **Modals & Dialogs**:
   - Reusable `<Modal>` component (`src/components/ui/Modal.jsx`) mounted via `createPortal` with backdrop click close and Escape key dismiss.

7. **Coding Standards & Super Admin Protection**:
   - Protected Super Admin email extracted into a single named constant: `SUPER_ADMIN_EMAIL = "admin.styledecor1@gmail.com"`.
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## 4. API Integrations & Data Flow
- `GET /users?page=1&limit=10&role=all&city=all&search=...` — Fetch paginated users list with search & filters.
- `GET /users/stats` — Fetch user role counts for stat cards.
- `PATCH /users/role` — Update user role with confirmation modal.
- `PATCH /users/admin/:id` — Update user profile details and address.
- `DELETE /users/:id` — Permanently delete user with SweetAlert2 confirmation.

---

## 5. Verification Checklist
- [x] Header has icon, title, and subtitle on top-left, and Refresh button on top-right.
- [x] Sub-components live in `src/features/admin/components/`.
- [x] Stat cards use `<StatCard>` with tone styling and skeleton loading fallback.
- [x] Search input has clear button and clean dropdowns without redundant filter icons.
- [x] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, and explicit `min-w-*` on all cells.
- [x] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds.
- [x] Table loading renders reusable `<TableSkeleton>`.
- [x] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [x] Super Admin protection enforced via `SUPER_ADMIN_EMAIL` constant.
- [x] Single-line comments only (`// ...`) with light density.
- [x] `npm run build` compiles with 0 errors.

---

```
=================================================================
-------------------------- Change Log ---------------------------
=================================================================
```
- **Date**: 2026-08-17
- **Target Page**: `src/features/admin/ManageUser.page.jsx`
- **Actions Taken**:
  - Split 1028+ lines monolithic file into 5 dedicated sub-components in `src/components/pages/Admin/UserManagement/` (`ManageUserStats.jsx`, `ManageUserFilters.jsx`, `UserTableRow.jsx`, `ManageUserViewModal.jsx`, `ManageUserEditModal.jsx`).
  - Implemented top header with icon + title + subtitle on top-left, and Refresh button on top-right.
  - Implemented ultra-compact `<StatCard>` section with minimal vertical height (~48px) and pulse skeleton fallback.
  - Created search bar with 350ms debounce and clear button, paired with clean Role and City dropdowns (no redundant filter icons).
  - Redesigned table to unrounded container (`rounded-none`), header/footer background `bg-slate-100 dark:bg-slate-800/80`, `px-2` cell padding, and canonical `min-w-*` classes (`min-w-55`, `min-w-45`, `min-w-32.5`, `min-w-35`, `min-w-30`).
  - Added centered actions column header and bordered `rounded-md` action buttons with hover backgrounds.
  - Implemented 3-part streamlined `<Pagination>` with middle limit dropdown and `<TableSkeleton>` loader.
  - Extracted `SUPER_ADMIN_EMAIL` constant and applied single-line comments with light density.
