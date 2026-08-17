# Manage Reviews (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-reviews`
**File(s) in scope:** `src/features/admin/ManageReviews.page.jsx`.
**Related audit references:**
- `04-Business-Logic.md` §9 (review moderation states: `published`/`hidden`/`flagged`/`archived`) — confirmed all 4 states are correctly rendered with distinct badges (lines 359-380), matching the documented model exactly.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Row actions only support Publish ↔ Hide — there's no way to moderate a review into `flagged` or `archived` from this table.** Lines 405-422: the toggle button only offers `"published"` and `"hidden"` as targets via `handleUpdateStatus`. The filter tabs (lines 220-246) and badge rendering (lines 359-380) both fully support all 4 states, and reviews can clearly *arrive* in `flagged`/`archived` status (presumably via a customer-flagging flow or backend logic not visible from this file) — but an admin reviewing a flagged review has no direct action to archive it, or to flag a published one, only publish/hide. This may be an intentional design (flagging is system/customer-driven, admin only publishes or hides) — worth confirming with whoever owns the moderation workflow rather than assuming it's a gap. — **Moderate** (flag for confirmation, not a certain bug).
2. **Legacy Tailwind gradient syntax.** Line 184: `bg-gradient-to-br` (should be `bg-linear-to-br`) — same recurring inconsistency found in `15-Transactions.md`, `24-ManageAgents.md`, and `01-Home.md`. — **Polish**.
3. **Pagination is Previous/Next only, same minimal pattern as `ManageAgents.page.jsx`.** Lines 442-465. — **Polish**.
4. **File is 578 lines. Split points:** the table row (lines ~310-436) → a local `<ReviewTableRow>`; the View Dossier modal body (lines ~485-560, once wrapped in the shared `<Modal>` shell) → `src/features/admin/components/ManageReviewsDossierModal.jsx`. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies, minor — the View Dossier modal (lines 468-573) is one more hand-rolled instance for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Component decomposition / file size:** Applies — 578 lines; see finding #4 for concrete split points (table row, View Dossier modal).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 285-288) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — finding #2. Otherwise this file is clean, correctly using canonical `purple`/`emerald`/`amber`/`rose`/`slate` for its 4 review-status badges with no deprecated hues.
- **Design consistency:** N/A beyond the pagination-capability gap (finding #3).
- **Correctness:** Applies — finding #1 (flag for confirmation).
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageReviews.page.jsx`:

**1. Correctness/UX fix (confirm intent first):**
- Confirm with whoever owns the review-moderation workflow whether admins should be able to directly set a review to `flagged` or `archived` from this table. If yes, extend the row actions (currently Publish/Hide only, lines 405-422) with additional moderation options (e.g. a small dropdown or extra icon buttons for Flag/Archive) using the existing `handleUpdateStatus(reviewId, newStatus)` function, which already supports any status value. If the current publish/hide-only behavior is intentional, no change needed here — just confirm rather than assume.

**2. Polish:**
- Change `bg-gradient-to-br` (line 184) to `bg-linear-to-br`.
- Add First/Last page-jump buttons to the pagination footer, or migrate to the shared `<Pagination>` component if built by another page's pass (per `18-ManageServices.md`).

**3. Reusable component extraction (coordinate with other admin pages, build once):**
- Build the shared `<Modal>` shell and migrate the View Dossier modal (lines 468-573) onto it.

**4. Component decomposition:**
- Extract the table row into a local `<ReviewTableRow>` and the View Dossier modal content into `src/features/admin/components/ManageReviewsDossierModal.jsx`.

Preserve all existing filtering, search, and status-badge logic — none of the above requires restructuring the page's data flow.

## Verification Checklist

- [ ] If moderation actions are extended, an admin can set a review to any of the 4 states (published/hidden/flagged/archived) and the change persists correctly.
- [ ] Pagination supports jumping to first/last page, or matches the shared `<Pagination>` component if migrated.
- [ ] Page renders identically after extracting the table row and dossier modal into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
