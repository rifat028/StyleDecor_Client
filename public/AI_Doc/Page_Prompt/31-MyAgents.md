# My Agents (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/my-agents`
**File(s) in scope:** `src/features/decorator-dashboard/MyAgents.page.jsx`. Cross-referenced: `src/features/decorator-dashboard/MyProjects.page.jsx`/`MyEarnings.page.jsx` (shared decorator-ID resolution pattern — see finding #1), `src/features/admin/ManageAgents.page.jsx` (mismatched agent-status vocabulary — see finding #2).
**Related audit references:**
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Decorator-ID resolution is duplicated *three times* — twice across effects in this single file, plus matching copies in `MyProjects.page.jsx`/`MyEarnings.page.jsx`.** The `resolveDecorator` effect (lines 65-86) does `/decorators/me` → fallback `/decorators/:email`. Separately, `loadAgents` (lines 89-113) has its **own** inline fallback: if `decoratorId` isn't set yet, it calls `/decorators/:email` directly (skipping the `/decorators/me` attempt entirely — a third, slightly different variant of the same lookup, lines 97-104). So this one file contains two different implementations of "resolve the decorator ID," and a third (fourth, counting `MyEarnings.page.jsx`) near-identical copy exists in sibling decorator-dashboard pages. This is the strongest evidence yet for the `useDecoratorId()` extraction recommended in `29-MyProjects.md` finding #3 — it would eliminate the internal duplication here too, not just the cross-file copies. — **Moderate** (high-value DRY fix, no live bug since all variants resolve to the same result).
2. **Agent status vocabulary here doesn't match the admin-side page controlling the same underlying agents.** This file's filter dropdown offers `available`/`on_assignment`/`off_duty` (lines 378-382), while the Edit modal's status `<select>` additionally offers `on_leave` (line 688) — a fourth value not present in the filter. Neither list includes `suspended`, which `ManageAgents.page.jsx` (admin) uses as one of its 4 statuses (`24-ManageAgents.md`). So a decorator viewing their own roster has a *different* set of selectable/filterable statuses than the admin managing the same agents — `on_leave` exists here but not on the admin side, `suspended` exists on the admin side but not here. If an agent is suspended by an admin, a decorator opening the Edit modal for that agent would see a status dropdown that doesn't even include their agent's actual current value. — **Moderate** (cross-file status-model inconsistency, similar in kind to the `AgencyProfile`/`ManageDecorator` mismatch in `27-AgencyProfile.md` finding #2).
3. **`renderStatusBadge` has no case for `off_duty` or `on_leave`, despite both being selectable.** Lines 297-318: only `available` and `on_assignment` get distinct badges; everything else (including the two statuses this page's own dropdowns offer) falls through to the generic gray default. Same gap independently found in `ManageAgents.page.jsx` (`24-ManageAgents.md` finding #3) — confirming this is a recurring pattern across both the admin and decorator agent-management pages, not a one-off. — **Polish**.
4. **File is 824 lines with 3 modals (Add Agent, Edit Agent, Appraise) accounting for roughly 320 lines combined.** Concrete split points: `src/features/decorator-dashboard/components/AddAgentModal.jsx` (lines ~500-621), `EditAgentModal.jsx` (lines ~624-721), `AppraiseAgentModal.jsx` (lines ~724-819, including the star picker and event-outcome selector); the agent card (lines ~404-495, the `.map((a) => {...})` body in the grid) → a local `<AgentCard>`. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies — finding #1. The three modals (Add Agent lines 500-621, Edit Agent lines 624-721, Appraise lines 724-819) are further hand-rolled instances for the shared `<Modal>` shell (`02-Reusable-Components.md` §6). The 5-star appraisal picker (lines 746-760) uses a numbered-button style distinct from the hover-preview star picker used in `MyBookings.page.jsx`/`MyReviews.page.jsx` — not necessarily wrong (this is an internal appraisal, not a public rating), but worth noting the app now has two different star-input UI patterns; not required to unify in this pass.
- **Component decomposition / file size:** Applies — 824 lines; see finding #4 for concrete split points (3 modals, agent card).
- **Skeleton/spinner loader:** Applies, minor — the grid loading state (lines 387-390) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found — agent cards collapse `grid-cols-1` → `md:2` → `lg:3` correctly.
- **Color consistency:** N/A — this page is clean, consistently using canonical `purple`/`emerald`/`amber`/`rose`/`slate` with no deprecated hues or drift.
- **Design consistency:** N/A.
- **Correctness:** Applies — findings #2, #3.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** Applies — finding #1.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/MyAgents.page.jsx`:

**1. Reusable extraction (coordinate with `29-MyProjects.md`/`30-MyEarnings.md`):**
- Replace both this file's `resolveDecorator` effect **and** `loadAgents`' internal fallback (lines 65-86, 89-113) with a single shared `useDecoratorId()` hook (build it here if not already built by another page's pass) — this removes the internal duplication within this file, not just the cross-file copies.

**2. Correctness fixes:**
- Reconcile the agent-status vocabulary with `ManageAgents.page.jsx` (admin): confirm with whoever owns the agent-status model whether `suspended` and `on_leave` are meant to be the same conceptual state under different names, or genuinely distinct. Align both files' filter dropdowns and Edit-modal `<select>` options to offer the same complete set of statuses (`available`, `on_assignment`, `off_duty`, plus whichever of `suspended`/`on_leave` is confirmed correct — likely both if they're distinct, unified to one term if they're duplicates).
- Add explicit `renderStatusBadge` cases for every status value both this file and `ManageAgents.page.jsx` can produce (matching the fix recommended in `24-ManageAgents.md` finding #3), so no agent status ever falls through to the generic gray default in either page.

**3. Component decomposition:**
- Extract the 3 modals into `src/features/decorator-dashboard/components/AddAgentModal.jsx`, `EditAgentModal.jsx`, and `AppraiseAgentModal.jsx`, and the agent card into a local `<AgentCard>`.

Preserve all existing agent hire/edit/delete/appraisal logic — none of the above requires restructuring the page's data flow beyond the ID-resolution and status-vocabulary fixes.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Decorator/MyAgents/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Decorator/MyAgents/`

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

- [ ] Sub-components live in `src/components/pages/Decorator/MyAgents/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Search input has clear button and clean dropdowns without redundant filter icons.
- [ ] Table has `rounded-none`, header/footer matching background, `px-2` cell padding, explicit `min-w-*` on all cells, and `min-w-40` on status column.
- [ ] Actions column header is center-aligned with bordered `rounded-md` buttons that show hover backgrounds, and inapplicable action buttons remain visible in disabled state.
- [ ] Table loading renders reusable `<TableSkeleton>`.
- [ ] Pagination has 3-part layout with limit dropdown in the middle and `Prev` / `Page X / Y` / `Next` on the right.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.