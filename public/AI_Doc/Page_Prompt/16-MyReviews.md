# My Reviews — Improvement Prompt

**Route(s):** `/dashboard/my-reviews`
**File(s) in scope:** `src/features/customer/MyReviews.page.jsx`.
**Related audit references:**
- `02-Reusable-Components.md` §6 (Modal shell — one more hand-rolled instance here).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **A "pending" filter tab is fully implemented in the filtering logic but has no UI control to select it.** Line 71: `if (filterTab === "pending" && r.vendorReply && r.vendorReply.reply) return false;` — but the rendered tab list (lines 265-267) only offers `"all"` and `"replied"`; there is no third tab for `"pending"`, so this branch of the filter can never actually be reached by a user. Minor instance of the "half-wired state" pattern found repeatedly across this review (dead prop in `CoverageMap`, unreachable modal in `TopDecorators`, etc.), here at low stakes. — **Polish**.
2. **Loading state is a positive example — noted, not a finding.** `if (loading && reviews.length === 0) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>;` (lines 163-169) sizes its wrapper generously enough that the shared `Spinner`'s forced `h-screen` doesn't create a visible layout problem in practice, unlike the padded-box patterns seen on several other pages. No fix needed here — worth using as a reference if a `min-h` convention for `Spinner` usage is ever formalized.

### Generic checklist

- **Reusable components:** Applies, minor — the Edit Review modal (lines 434-520) is one more hand-rolled modal instance, adding to the count from `14-MyBookings.md`; migrate it onto the shared `<Modal>` shell if/when built. The star-rating picker (lines 456-476) is structurally identical to the one in `MyBookings.page.jsx`'s Review submission modal (same 5-star hover/click pattern) — a shared `<StarRatingInput>` component would remove this duplication; build it if this is the second page reaching the pattern (it is — `14-MyBookings.md` has the same picker in its own review modal).
- **Skeleton/spinner loader:** N/A — see finding #2, this page's usage is already appropriate.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — filter bar and review cards collapse correctly at all widths.
- **Color consistency:** N/A — this page is clean, using canonical `purple`/`emerald`/`amber`/`rose` throughout with no deprecated hues.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #1.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found; star-rating buttons are real `<button>` elements.

## Implementation Prompt

Apply these changes to `src/features/customer/MyReviews.page.jsx`:

**1. Correctness/polish fix:**
- Resolve finding #1: either add a third "Pending Reply" tab to the filter-tab list (lines 264-284) so the existing filtering logic becomes reachable, or remove the dead `filterTab === "pending"` branch (line 71) if a pending-only view isn't actually wanted. Prefer adding the tab — the logic is already correct and tested by its presence, it's just missing a UI trigger.

**2. Reusable extraction (coordinate with `14-MyBookings.md`):**
- If a shared `<StarRatingInput>` component is warranted (two instances now: this file's edit-review modal and `MyBookings.page.jsx`'s submit-review modal), build it once and use it in both places — a `<StarRatingInput value={editRating} onChange={setEditRating} />`-shaped component covering the hover-preview + click-to-set + descriptive label behavior already implemented identically in both files.
- If/when the shared `<Modal>` shell is built (per `14-MyBookings.md`), migrate this file's Edit Review modal onto it.

Preserve all existing review-fetching, filtering, editing, and deletion logic — none of the above requires restructuring the page.

## Verification Checklist

- [ ] A "Pending Reply" (or equivalently-named) tab is selectable and correctly filters to reviews without a vendor reply — or the dead filter branch is removed if the tab isn't wanted.
- [ ] Star rating picker behaves identically after any shared-component extraction, in both this page and `MyBookings.page.jsx`.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
