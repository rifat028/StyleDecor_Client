# My Performance (Agent) — Improvement Prompt

**Route(s):** `/dashboard/my-performance`
**File(s) in scope:** `src/features/agent-dashboard/PerformanceAppraisals.page.jsx`.
**Related audit references:** None specific to this file in `00-06` — it wasn't individually called out in the original audit.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Half of this file's icon imports are unused.** Of the 14 icons imported (lines 6-19), 7 are never referenced in the JSX: `Building`, `Calendar`, `Layers`, `TrendingUp`, `User`, `Quote`, and `Image as ImageIcon`. Only `Award`, `Star`, `Sparkles`, `ShieldCheck`, `CheckCircle2`, `ThumbsUp`, and `MessageSquare` are actually used. This is a notably high dead-import ratio for a single file — likely leftover from an earlier draft of the page that included sections (e.g. an agency-affiliation card using `Building`, a "member since" line using `Calendar`) that were removed or never built. — **Polish** (cleanup, but a large enough count to be worth flagging explicitly).
2. **Positive note: this page fetches its entire dossier (metrics, badges, reviews, agent identity) from a single `GET /agents/my-performance` request.** Line 34 — no multi-request stats pattern like the admin pages flagged in `18-ManageServices.md`/`21-ManageDecorator.md`/`22-ManageBookings.md`. Worth citing as a positive reference alongside `ManageUser.page.jsx`/`ManageAgents.page.jsx`'s single-endpoint stats pattern.

### Generic checklist

- **Reusable components:** N/A — no duplicated markup patterns found on this page.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 47-53) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — badges and reviews grids collapse correctly at all widths.
- **Color consistency:** Applies, minor — legacy `bg-gradient-to-br` syntax (line 107), same recurring issue found elsewhere; change to `bg-linear-to-br`. The `ThumbsUp`/"Recommendation" card's `text-blue-500` (line 148) reads as deliberate KPI-dashboard categorical variety, same judgment call made on other KPI-heavy pages — not a hard violation.
- **Design consistency:** Applies, minor — all badges (lines 168-187) render with identical visual treatment (same icon, same color, same "Verified Active" label) regardless of what the badge actually represents — a missed opportunity for quick visual differentiation between badge types, not a correctness issue. Optional polish, not required.
- **Correctness:** N/A — no logic bugs found; the rating-distribution calculation (lines 67-71) is correct and self-contained.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** Applies — finding #1.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found; this page is read-only with no interactive form elements beyond standard content display.

## Implementation Prompt

Apply these changes to `src/features/agent-dashboard/PerformanceAppraisals.page.jsx`:

**1. Coding standard fix:**
- Remove the 7 unused imports: `Building`, `Calendar`, `Layers`, `TrendingUp`, `User`, `Quote`, `Image as ImageIcon` (from the import block at lines 6-19).

**2. Polish:**
- Change `bg-gradient-to-br` (line 107) to `bg-linear-to-br`.

**3. Optional polish (only if the pass has room):**
- Consider giving different badge types (`badges[].name`) distinct icons/colors instead of the identical purple `Award` treatment for every badge, if the badge data model supports categorization (e.g. a `badges[].type` or icon field) — skip if the backend doesn't currently provide enough structure to differentiate badge types meaningfully.

Preserve all existing performance-dossier fetching and review-display logic — this is a small, low-risk cleanup pass.

## Verification Checklist

- [ ] No unused imports remain in the file (verify via `npx eslint`).
- [ ] Gradient renders identically after the `bg-linear-to-br` change.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
