# My Services (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/my-services`
**File(s) in scope:** `src/features/decorator-dashboard/ManageService.page.jsx`.
**Related audit references:**
- `04-Business-Logic.md` §4 (service data model: pricing, package tiers, specifications, inclusions/exclusions, status/featured) — confirmed this page's create/edit form matches the documented model exactly, field-for-field.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`handleTierChange` mutates a package-tier object in place before returning a "new" array.** Lines 247-253:
   ```js
   const updated = [...prev.packageTiers];
   updated[idx][field] = value;
   return { ...prev, packageTiers: updated };
   ```
   Spreading `prev.packageTiers` only copies the outer array — `updated[idx]` is still the exact same object reference as `prev.packageTiers[idx]`, so `updated[idx][field] = value` mutates that shared object directly instead of creating a new one. No currently-visible bug results (nothing in this component relies on the tier objects' referential stability), but it's a real React anti-pattern that will silently break if a future optimization (e.g. `React.memo` on a tier row, or reusing the same tier object elsewhere) is ever added. — **Polish** (correctness risk, not a live bug).
2. **File is 1050 lines. The Create/Edit Form modal (lines 733-1045, ~310 lines) is one of the two largest modals found anywhere in the app**, bundling general info, pricing, package-tier management, media/description fields, and inclusions/exclusions all in one block. Concrete split points: `src/features/decorator-dashboard/components/ManageServiceFormModal.jsx` for the modal shell, with the package-tier add/remove/edit UI (lines ~888-949) further extracted into its own `<PackageTiersEditor>` sub-component (it already has its own add/remove handlers, `handleAddTier`/`handleRemoveTier`/`handleTierChange`, making it a natural self-contained unit); the View Preview modal (lines 656-731) → `ManageServiceViewModal.jsx`; the table row (lines ~545-648) → a local `<ServiceTableRow>`. — **Polish** (maintainability, not a functional bug — but a high-value split given the form modal's size).

### Generic checklist

- **Reusable components:** Applies, minor — the two modals (View Preview lines 656-731, Create/Edit Form lines 733-1045) are hand-rolled instances for the shared `<Modal>` shell (`02-Reusable-Components.md` §6). This file's status-toggle button pattern (lines 605-619) is structurally identical to `ManageServices.page.jsx`'s admin equivalent — both could share a `<StatusToggleBadge>` if a third instance appears.
- **Component decomposition / file size:** Applies — 1050 lines; see finding #2, including one of the two largest single modals found in this review.
- **Skeleton/spinner loader:** Applies, minor — both loading states (lines 372-378, 514-517) use the shared `<Spinner />` in a padded box, same pattern noted on several other pages.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** N/A — this page is clean, consistently using canonical `purple`/`emerald`/`amber`/`rose`/`slate` with no deprecated hues or stray primary-color drift.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #1. Worth noting positively: the Deposit (%) field correctly has `min="10" max="100"` bounds (lines 878-880) — a good contrast to `23-ManageTransactions.md`'s unbounded refund-amount input; use this file's pattern as the reference when fixing that one.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** Applies — finding #1.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply this change to `src/features/decorator-dashboard/ManageService.page.jsx`:

**1. Coding standard fix:**
- Fix `handleTierChange` (lines 247-253) to avoid mutating the shared tier object:
  ```js
  const updated = prev.packageTiers.map((t, i) =>
    i === idx ? { ...t, [field]: value } : t
  );
  return { ...prev, packageTiers: updated };
  ```

**2. Reusable component extraction (coordinate with other pages, build once):**
- Build the shared `<Modal>` shell and migrate both modals in this file onto it, if built by another page's pass.

**3. Component decomposition:**
- Extract the Create/Edit Form modal into `src/features/decorator-dashboard/components/ManageServiceFormModal.jsx`, with the package-tier management UI inside it further extracted into a `<PackageTiersEditor>` sub-component. Extract the View Preview modal into `ManageServiceViewModal.jsx` and the table row into a local `<ServiceTableRow>`.

Preserve all existing package-tier management, form validation, and CRUD logic exactly as-is — this is a targeted, low-risk fix.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Decorator/ManageService/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Decorator/ManageService/`

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

- [ ] Sub-components live in `src/components/pages/Decorator/ManageService/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.