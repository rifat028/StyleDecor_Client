# Services (Listing) — Improvement Prompt

**Route(s):** `/services`
**File(s) in scope:** `src/features/services/Services.page.jsx`, `src/features/services/components/ServiceCard.jsx`, `src/features/services/components/TopSection.jsx`. Cross-referenced: `src/features/home/components/Spinner.jsx` (shared, not modified here — see finding #2).
**Related audit references:**
- `02-Reusable-Components.md` §1 (Pagination/DataTable duplication — this file is explicitly cited as one of the 7), §9 (formatCurrency — hand-typed `৳{...toLocaleString()}` pattern present here too)
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Min/Max Budget inputs fire a new API request on every keystroke — no debounce, no explicit "Apply".** `minCost`/`maxCost` (lines 41-42) are direct dependencies of `loadServices`'s `useCallback` (line 79), and their `onChange` handlers call `setMinCost`/`setMaxCost` **and** `setPage(1)` on every character typed (lines 181-184, 198-201). Typing "50000" into Min Budget fires 5 separate `/services` requests in rapid succession. The text-search input avoids this correctly (it's submit-gated via `searchInput`/`searchText`, lines 38-39, 85-89) — the budget fields should follow the same pattern or be debounced. — **Critical** (real backend load + visibly janky typing experience).
2. **Loading state uses the shared `<Spinner />` inside a `min-h-[40vh]` wrapper, but `Spinner.jsx` hardcodes `h-screen` on its own root div** (`src/features/home/components/Spinner.jsx`), so every time a filter/page change triggers `loadServices`, the grid area collapses to a small `40vh` box that then gets forced to fill the full 100vh by the Spinner's own styling — a visible layout jump on every filter interaction, not just first load. `Spinner` is a shared component (out of scope to modify here), but this page's *usage* of it for a partial-content loading state is the bug. — **Moderate** (same pattern will need addressing in `05-ServiceDetails.md` and `06-TopDecorators.md` too — fix each page's usage independently, don't wait on a `Spinner.jsx` rewrite).
3. **No URL/search-param sync for filters at all** — unlike `TopDecorators.page.jsx` (which at least *reads* initial filter state from `useSearchParams`, see `06-TopDecorators.md`), this page's `category`/`minCost`/`maxCost`/`sortBy`/`page` state is pure component state with no relationship to the URL. A user can't bookmark, share, or use browser back/forward to return to a filtered view. — **Moderate**.

### Generic checklist

- **Reusable components:** Applies — `02-Reusable-Components.md` §1 already cites this exact file's pagination block (lines 260-330) as one of 7 byte-for-byte duplicates; build `<Pagination>` here as one of the target migrations. `ServiceCard.jsx`'s rating badge (lines 33-37) is another instance of the duplicate star+rating pattern cataloged in §10 (RatingBadge) — if `01-Home.md`'s `<RatingBadge>` extraction has already happened, use it here; otherwise this page is an equally good candidate to build it first.
- **Skeleton/spinner loader:** Applies — see finding #2. Replace the `Spinner`-in-a-`min-h-[40vh]`-box pattern with a shaped grid skeleton (`CardGridSkeleton`, matching `LatestServices.jsx`'s existing correct pattern from `01-Home.md`) so re-filtering doesn't cause a layout jump.
- **Tooltip:** N/A — filter controls are self-labeled (`<label>` above each field), no icon-only affordances needing a tooltip.
- **Responsiveness:** No issues found — filter grid collapses `grid-cols-1` → `sm:grid-cols-2` → `md:grid-cols-4`, card grid collapses `grid-cols-1` → `sm:2` → `lg:3` → `xl:4`. Clean.
- **Color consistency:** Mostly clean — this page already uses `slate-*` consistently (not `gray-*`) and `purple-600` as the solid primary, matching `00-Color-System.md`. No migration needed here; use this file as a positive reference when fixing other pages.
- **Design consistency:** Applies — `TopSection.jsx` mixes DaisyUI semantic tokens (`bg-base-200`, `text-base-content`) with the page's own raw `purple-500`/`slate-*` — not wrong, but worth noting it's the only place in this page's scope using `base-*` tokens; harmless, no action required unless the wider DaisyUI-adoption question (raised during `00-Color-System.md`'s creation) is revisited later.
- **Correctness:** Applies — finding #1.
- **Improvement opportunity:** None specific to this page beyond what's already covered by the reusable-component and debounce fixes above.
- **Coding standard:** Applies, minor — `ServiceCard.jsx:10` and `Services.page.jsx` share the same hardcoded magic-number price fallback (`|| 20000`) seen in `01-Home.md`'s `LatestServices.jsx` finding; same fix (named constant or backend-guaranteed field) applies here too.
- **Comments:** N/A — logic is straightforward and self-explanatory.
- **Accessibility:** N/A — all interactive elements are real `<button>`/`<select>`/`<input>` elements with visible labels; no gaps found.

## Implementation Prompt

Apply these changes to `src/features/services/Services.page.jsx` and `src/features/services/components/ServiceCard.jsx`:

**1. Correctness fixes (do first):**
- Debounce the Min/Max Budget inputs (e.g. 400-500ms after the last keystroke) before they trigger `setMinCost`/`setMaxCost`, or add an explicit "Apply" affordance instead of firing a request per character. Keep `setPage(1)` behavior tied to the same debounced/applied moment, not every keystroke.
- Replace the `<Spinner />`-in-`min-h-[40vh]` loading block (lines 231-234) with a shaped skeleton grid (e.g. 6-12 placeholder cards matching `ServiceCard`'s dimensions with `animate-pulse`), so filter changes don't cause the content area to jump to full viewport height and back.

**2. Reusable component extraction (coordinate with other pages already processed):**
- If `<Pagination>` (per `02-Reusable-Components.md` §1) hasn't been built yet by another page's pass, build it here and replace lines 260-330 with it. If it already exists (built while processing an earlier page), just replace this file's pagination block with the shared component — don't reimplement.
- Same for `<RatingBadge>` in `ServiceCard.jsx:33-37` — reuse if it exists, build here if this is the first page reaching this finding.
- Optionally add URL/search-param sync (`useSearchParams`) for `category`/`minCost`/`maxCost`/`sortBy`/`page` so filtered views are bookmarkable/shareable — match the (partial) pattern `TopDecorators.page.jsx` already uses, and complete it correctly (see `06-TopDecorators.md` finding about that page's own broken sync) rather than copying its bug.

Preserve all existing fetch logic, filter semantics, and empty/error states — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Typing a multi-digit number into Min or Max Budget fires at most one API request, not one per keystroke.
- [ ] Changing a filter or page while the grid is populated shows a skeleton in place, not a full-viewport-height spinner replacing the grid.
- [ ] Pagination behaves identically to before the refactor (page numbers, disabled states at boundaries, scroll-to-top on page change).
- [ ] Service cards render identically (visually) after any `<RatingBadge>` migration, in both light and dark mode.
- [ ] Page tested at mobile, tablet, and desktop widths — no regression.
