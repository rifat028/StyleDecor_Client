# Manage Categories (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-categories`
**File(s) in scope:** `src/features/admin/ManageCategories.page.jsx` (includes a locally-defined `SwitchToggle` sub-component, lines 34-66).
**Related audit references:**
- `02-Reusable-Components.md` §3 (EmptyState), §6 (Modal shell — this file has 4 hand-rolled modals: Create Category, Edit Category, Add Subcategory, Edit Subcategory).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Page chrome uses `indigo-600` as if it were the primary color, throughout.** Banner icon background (line 498), "Add Category" button (line 543), all modal focus rings (`focus:ring-indigo-500`, e.g. lines 581, 598, 850, 868, 909, 950, 1001, 1019, 1037, 1099, 1115, 1133, 1194, 1209, 1227), the "Add Sub" button (line 675), category-icon backgrounds (line 640, 816, 1068), and two of the four modal submit buttons (Create, Add Subcategory — lines 952, 1148). This is the same drift already found in `ManageUser.page.jsx` (`19-ManageUser.md` finding #3) and `JoinAsDecorator.page.jsx` (`09-JoinAsDecorator.md` finding #5) — a recurring pattern specifically in account/catalog-management-flavored admin pages, as opposed to the marketplace-facing pages which correctly use `purple-600`. — **Moderate**.
2. **File is 1255 lines — the largest admin page in the app — with 4 modals accounting for roughly 440 of those lines.** Concrete split points: `src/features/admin/components/ManageCategoriesCreateModal.jsx`, `EditCategoryModal.jsx`, `AddSubCategoryModal.jsx`, `EditSubCategoryModal.jsx` (one file each, matching the 4 modals at lines 811-960, 963-1060, 1063-1156, 1159-1250); the subcategory table drawer inside the accordion (lines 713-803) → a local `<SubCategoryTable categoryId={...} subCategories={...} onToggle={...} onEdit={...} onDelete={...} />`; the category header row itself (lines 634-711) → a local `<CategoryAccordionRow>`. The local `SwitchToggle` (lines 34-66) is already correctly isolated as its own component — no change needed there, it's a model example of what the other split points should look like. — **Polish** (maintainability, not a functional bug — but this file benefits the most of any page in the app from this fix).
3. **Optimistic updates with rollback — a positive pattern worth preserving and citing elsewhere.** `handleToggleCategoryStatus` (lines 207-232) and `handleToggleSubCategoryStatus` (lines 235-275) update local state immediately, then roll back only if the API call fails. This is a better UX pattern than most other admin pages in this codebase, which simply refetch after every mutation. No fix needed — noted so it isn't accidentally "normalized" to the less responsive refetch-only pattern during a broader admin-page pass.

### Generic checklist

- **Reusable components:** Applies — this file has 4 hand-rolled modals (Create Category lines 811-960, Edit Category lines 963-1060, Add Subcategory lines 1063-1156, Edit Subcategory lines 1159-1250), all candidates for the shared `<Modal>` shell (§6). The empty state (lines 612-621) is another instance of §3's `<EmptyState>`. Also worth noting: the local `SwitchToggle` component (lines 34-66) is a clean, reusable active/inactive switch — not currently duplicated elsewhere (other admin pages use button-based or explicit-action toggles instead), but a good candidate to promote to `src/components/ui/Toggle.jsx` if a future page needs the same binary-switch pattern rather than button-based status actions.
- **Component decomposition / file size:** Applies — 1255 lines, the largest admin page in the app; see finding #2 for concrete split points (4 modals, subcategory table drawer, category row).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 608-611) uses the shared `<Spinner />` in a padded box, same pattern noted on several other pages.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — finding #1.
- **Design consistency:** N/A beyond the color chrome issue.
- **Correctness:** N/A — no logic bugs found; all CRUD flows (create/edit/delete category and subcategory, status toggles) are implemented correctly and match the documented category/subcategory data model in `04-Business-Logic.md` §4.
- **Improvement opportunity:** None beyond what's covered above.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered under Reusable Components in other pages' prompts. Note: `SwitchToggle` itself is already correctly built with `role="switch"` and `aria-checked` (lines 49-50) — a good accessible pattern, worth using as the reference if/when a shared `<Toggle>` is extracted.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageCategories.page.jsx`:

**1. Color consistency:**
- Replace `indigo-*` in the page's chrome (banner icon, Add Category/Add Sub buttons, all modal focus rings, icon backgrounds, 2 of the 4 modal submit buttons) with `purple-*` equivalents, matching the canonical primary from `00-Color-System.md`. (The other 2 modal submit buttons — Edit Category, Edit Subcategory — already correctly use `amber-600`, distinguishing "edit" actions from "create" actions; keep that distinction, just fix the create/primary-action buttons to purple instead of indigo.)

**2. Reusable component extraction (coordinate with other admin pages, build once):**
- Build the shared `<Modal>` shell (§6) and migrate all 4 modals in this file onto it.
- Build/reuse `<EmptyState>` (§3) for the empty categories view (lines 612-621).
- Optionally promote the local `SwitchToggle` (lines 34-66) to `src/components/ui/Toggle.jsx` if another page's pass needs the same binary switch pattern; otherwise leave as a well-built local component.

**3. Component decomposition:**
- Extract the 4 modals into `src/features/admin/components/ManageCategoriesCreateModal.jsx`, `EditCategoryModal.jsx`, `AddSubCategoryModal.jsx`, and `EditSubCategoryModal.jsx`.
- Extract the subcategory table drawer into a local `<SubCategoryTable>` component, and the category accordion row into a local `<CategoryAccordionRow>`.

Preserve all existing category/subcategory CRUD logic, the optimistic-update-with-rollback pattern for status toggles, and the expand/collapse accordion behavior — none of the above requires restructuring the page's data flow.

## Verification Checklist

- [ ] Page chrome (banner, primary buttons, focus rings) uses purple, not indigo.
- [ ] Edit actions still visually distinct (amber) from create/primary actions (purple).
- [ ] All 4 modals close on Escape and backdrop click, and trap focus while open, if migrated to the shared `<Modal>`.
- [ ] Status toggles still show the optimistic update immediately and roll back correctly on a simulated API failure.
- [ ] Page renders and behaves identically after extracting the 4 modals, subcategory table, and category row into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
