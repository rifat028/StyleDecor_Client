# Agency Reviews (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/agency-reviews`
**File(s) in scope:** `src/features/decorator-dashboard/AgencyReviews.page.jsx`.
**Related audit references:**
- `04-Business-Logic.md` §9 (`vendorReply` — "the decorator agency can post one official reply per review") — confirmed this page's `handleSubmitReply`/`handleDeleteReply` implement exactly that, matching the documented model.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Delete-reply button uses `hover:text-red-500` instead of the canonical `rose`.** Line 418. One-off instance of the deprecated hue already flagged project-wide in `00-Color-System.md` §5. — **Polish**.
2. **Legacy Tailwind gradient syntax.** Line 206: `bg-gradient-to-br` should be `bg-linear-to-br`, same recurring issue found elsewhere.

### Generic checklist

- **Reusable components:** N/A — the Reply modal (lines 436-523) is a hand-rolled instance for the shared `<Modal>` shell if built elsewhere, but not urgent to build specifically for this page.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 168-174) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A — action buttons are self-labeled text buttons, no icon-only ambiguity.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — findings #1, #2.
- **Design consistency:** N/A.
- **Correctness:** N/A — the reply/delete-reply flow correctly matches the documented one-reply-per-review model.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** Applies — `Edit`, `ThumbsUp`, `User`, and `Image as ImageIcon` are imported (lines 17, 20, 22-23) but never used anywhere in the file's JSX. Four of the file's 18 icon imports are dead. — **Polish**.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found beyond the general Modal-focus-trap pattern already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/AgencyReviews.page.jsx`:

**1. Polish:**
- Change `hover:text-red-500` (line 418) to `hover:text-rose-500`.
- Change `bg-gradient-to-br` (line 206) to `bg-linear-to-br`.
- Remove the unused `Edit`, `ThumbsUp`, `User`, and `Image as ImageIcon` imports (lines 17, 20, 22-23).

Preserve all existing review-filtering, reply-submission, and reply-deletion logic — this is a small, low-risk cleanup pass.

## Verification Checklist

- [ ] Delete-reply hover color matches the app's canonical danger color.
- [ ] No unused imports remain in the file (verify via `npx eslint`).
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
