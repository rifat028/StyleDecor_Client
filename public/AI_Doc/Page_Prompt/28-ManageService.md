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

## Verification Checklist

- [ ] Editing a package tier's name, price, or features updates only that tier, and doesn't cause unexpected re-render behavior in adjacent tiers.
- [ ] Creating and editing service packages still works identically after the fix.
- [ ] Page renders and behaves identically after extracting both modals, the package-tier editor, and the table row into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
