# My Earnings (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/my-earnings`
**File(s) in scope:** `src/features/decorator-dashboard/MyEarnings.page.jsx`. Cross-referenced: `src/features/decorator-dashboard/MyProjects.page.jsx`/`MyAgents.page.jsx` (duplicated decorator-ID resolution — see finding #1).
**Related audit references:**
- `04-Business-Logic.md` §7 (gateway fee 1.5%, platform commission 10.0%, vendor receivable 88.5%) — confirmed present exactly as documented, consistent with `23-ManageTransactions.md`.
- `05-Upgrade-Ideas.md` A7 (PDF invoices / downloadable receipts — "no 'Download PDF' or 'Print Invoice' action anywhere... a lightweight PDF export... is a small add with clear value") — this file has unused imports pointing directly at this unbuilt feature, see finding #2.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Decorator-ID resolution logic (lines 47-69) is duplicated near-identically in `MyProjects.page.jsx` and `MyAgents.page.jsx`.** Same `/decorators/me` → fallback `/decorators/:email` pattern — see `29-MyProjects.md` finding #3 for the full cross-file picture and the recommended `useDecoratorId()` extraction.
2. **`Download` and `Printer` icons are imported but never used anywhere in the file.** Lines 22-23: `import { ..., Download, Printer, ... } from "lucide-react";` — neither icon appears in the JSX. This page's own receipt/invoice modal (lines 430-563) has no export or print action at all, despite the header literally being titled "Payment Receipt & Invoice Dossier." These unused imports are strong circumstantial evidence that a "Download PDF" or "Print Receipt" button was planned for this exact modal and never wired up — directly matching `05-Upgrade-Ideas.md` A7's assessment that this is "a small add with clear value" for a payments-heavy product. — **Moderate** (dead imports + a near-built, high-value feature gap in one finding).

### Generic checklist

- **Reusable components:** Applies — finding #1. The receipt modal (lines 430-563) is another hand-rolled instance for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 309-312) and the receipt-modal loading state (lines 450-453) both use the shared `<Spinner />` in a padded box, same pattern noted on several other pages.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — legacy `bg-gradient-to-br` syntax (line 207), same recurring issue found elsewhere; change to `bg-linear-to-br`. The `indigo-*` "Platform Fee" stat-card accent (lines 235, 237) reads as deliberate KPI-dashboard categorical variety, same judgment call as `26-Analytics.md` — not a hard violation.
- **Design consistency:** N/A.
- **Correctness:** N/A beyond the DRY/dead-import findings above — no logic bugs found.
- **Improvement opportunity:** `05-Upgrade-Ideas.md` A7 applies directly — see finding #2.
- **Coding standard:** Applies — finding #2 (remove or wire up the unused imports).
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/MyEarnings.page.jsx`:

**1. Feature completion or cleanup (pick one, don't leave the imports dangling either way):**
- Preferred: wire up the `Download`/`Printer` icons into an actual "Download PDF" / "Print Receipt" action in the receipt modal footer (lines 553-560), using a lightweight client-side PDF export (e.g. `jspdf` or `react-to-print`, per `05-Upgrade-Ideas.md` A7) rendering the already-displayed receipt breakdown. This is a well-scoped, high-value addition — the data and layout already exist in the modal, only the export action is missing.
- If PDF export is out of scope for this pass, remove the unused `Download`/`Printer` imports (lines 22-23) rather than leaving dead imports implying unfinished work.

**2. Reusable extraction (coordinate with `29-MyProjects.md`/`31-MyAgents.md`):**
- Replace this file's decorator-ID resolution (lines 47-69) with the shared `useDecoratorId()` hook once built (or build it here if this is the first page processed).
- Migrate the receipt modal onto the shared `<Modal>` shell if built by another page's pass.

**3. Polish:**
- Change `bg-gradient-to-br` (line 207) to `bg-linear-to-br`.

Preserve all existing payment-filtering, search, and commission-breakdown display logic — none of the above requires restructuring the page.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Decorator/MyEarnings/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Decorator/MyEarnings/`

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

- [ ] Sub-components live in `src/components/pages/Decorator/MyEarnings/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.