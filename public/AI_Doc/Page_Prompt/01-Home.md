# Home — Improvement Prompt

**Route(s):** `/`
**File(s) in scope:** `src/features/home/Home.page.jsx` and its 9 direct child sections: `Banner.jsx`, `Categories.jsx`, `CoverageMap.jsx`, `LatestServices.jsx`, `TopRatedDecorators.jsx`, `FeaturedReviews.jsx`, `HowItWorks.jsx`, `TrustAssurances.jsx`, `JoinAsDecoratorCTA.jsx` (all under `src/features/home/components/`)
**Related audit references:**
- `01-UI-UX-Issues.md` §7 (carousel no keyboard/touch — `TopRatedDecorators.jsx`), §8 (motion ignores `prefers-reduced-motion` — `Banner.jsx`, `Categories.jsx`), §9 (emoji/icon mismatch — `Banner.jsx`)
- `02-Reusable-Components.md` §3 (EmptyState — cites `LatestServices.jsx:191-205` directly), §9 (formatCurrency — cites `LatestServices.jsx`), §10 (RatingBadge/Avatar)
- `03-Frontend-Issues-And-Solutions.md` §9 (multi-MB images — Categories thumbnails, `Avatar.jpg`), §11 (unused state — `FeaturedReviews.jsx:69-70`)
- `05-Upgrade-Ideas.md` A1 (`CoverageMap.jsx` fakes a map with hardcoded stats; `leaflet`/`react-leaflet` installed unused)
- `06-UI-Upgrade-Guide.md` Phase 2 §8 (carousel fix code), §9 (reduced-motion fix code), Phase 4 §9 (emoji fix code)
- `00-Color-System.md` (canonical palette — see Generic Checklist below)

## Findings

### Page-specific

1. **`coverage` loader data is fetched but never used — dead network request on every homepage load.** `Home.page.jsx:14,25` passes `coverage={coverage}` (from the `/Coverage.json` route loader in `PublicRoutes.jsx`) into `<CoverageMap coverage={coverage}>`, but `CoverageMap.jsx` destructures `{ coverage }` in its props (line 99) and **never references it anywhere in the component body** — the entire component renders from its own hardcoded `CITIES` array instead. Every homepage visit fetches `/Coverage.json` for nothing. — **Critical** (wasted request + confirms A1's "fake map" finding goes deeper than described: even the one piece of real data plumbed in isn't wired up).
2. **Inconsistent "brand gradient" — at least 5 different gradient/accent combinations used for the same conceptual purpose across sibling sections on one page:**
   - `Banner.jsx` (headline span, primary CTA, pill dot): `from-purple-600 to-pink-600`
   - `CoverageMap.jsx`, `FeaturedReviews.jsx`, `TrustAssurances.jsx` (headline span): `from-purple-600 via-indigo-600 to-pink-500`
   - `Categories.jsx`, `HowItWorks.jsx` (headline span): `from-purple-600 to-pink-500`
   - `JoinAsDecoratorCTA.jsx` (headline span): `from-purple-400 via-pink-400 to-amber-300`; (CTA button): `from-purple-600 to-amber-500`
   A first-time visitor scrolls through five near-identical "gradient text" headline treatments that are all subtly different. — **Moderate**, high visibility (every section on the most-visited page).
3. **`gray-*` used instead of the canonical `slate-*` neutral** in `Categories.jsx` (`CategoryCard`, lines 126,129), `CoverageMap.jsx` (extensively — `gray-50/900/600/300/200/700/800`), `HowItWorks.jsx` (lines 115,120,138,141), `TrustAssurances.jsx` (lines 88,96-97,123,129,133,139). Meanwhile `LatestServices.jsx` and `TopRatedDecorators.jsx` correctly use `slate-*` throughout. — **Moderate**.
4. **`CoverageMap.jsx` mixes Tailwind gradient utility syntax**: uses legacy `bg-gradient-to-b` / `bg-gradient-to-r` (lines 128, 139, 205, 258, 394, 442) while every sibling section (`Banner`, `Categories`, `HowItWorks`) uses the Tailwind v4 `bg-linear-to-r` / `bg-linear-to-br` naming. Confirm both still compile correctly under the installed Tailwind v4 + `@tailwindcss/vite` setup and standardize on one. — **Polish**, but a real inconsistency worth a single find-and-replace while other color work is being done in this file.
5. **`FeaturedReviews.jsx` fetches data but shows no loading state at all.** `loading`/`setLoading` (line 69) is set to `true` then `false` around the fetch (lines 77, 86) but **never read anywhere in the render** — the section always renders `fallbackReviews` immediately, then silently swaps to real data with no transition or skeleton once the fetch resolves. Combined with `currentIndex`/`setCurrentIndex` (line 70) being completely unused dead state (confirmed by `03-Frontend-Issues-And-Solutions.md` §11) — this looks like an index-driven carousel that was designed, then replaced by the current scroll-based `handlePrev`/`handleNext` (lines 93-103), leaving both the loading UI and the old carousel state stranded. — **Moderate**.
6. **`TopRatedDecorators.jsx` imports an unused 3.4 MB image.** Line 15: `import pic from "../../../assets/images/Avatar.jpg";` — `pic` is never referenced anywhere else in the file (the actual avatar rendering uses `item.logo || item.avatar || item.photo || getPlaceholderLogo(...)`, all unrelated to `pic`). This contradicts `03-Frontend-Issues-And-Solutions.md` §9's description of `Avatar.jpg` being "used at avatar sizes throughout `TopRatedDecorators.jsx`" — the current code shows a dead import, not active use. Removing it drops a genuinely unused 3.4 MB asset from this page's dependency graph. — **Critical** (bundle weight for zero benefit, and cheap to fix).
7. **`LatestServices.jsx` service cards have a misleading `cursor-pointer`.** The outer card `<div>` (line 226) has `cursor-pointer` in its className, implying the whole card is clickable, but no `onClick` exists on that div — only the small "Book Package" button at the bottom (line 277) actually navigates. Clicking the image, title, or description does nothing. — **Moderate**.
8. **`CoverageMap.jsx` city pins are `<div onClick>`, not buttons.** Lines 368-378: the interactive map pins use a plain `<div onClick={...} onMouseEnter={...}>` with no `role="button"`, no `tabIndex`, no keyboard handler, and no `aria-label` — unreachable via keyboard, unlike the city-selector pills just above them (lines 170-197) which correctly use real `<button>` elements. Inconsistent within the same file. — **Moderate**.
9. **`Register.page.jsx`-style unsplash/placeholder avatar duplication does not apply here** — not a Home finding, listed for completeness only in the Register prompt.
10. **Rating badge (star + number) is hand-rolled independently 5 times within this one page**: `LatestServices.jsx:266-272`, `TopRatedDecorators.jsx:356-362`, `FeaturedReviews.jsx:135-141` (header trust badge) and `:199-204` (per-review), each with slightly different wrapper markup — directly matches `02-Reusable-Components.md` §10's proposed `<RatingBadge>`. Home is the single best page to build and adopt it first, since it alone accounts for more than half the app-wide duplicate count. — **Moderate**.

### Generic checklist

- **Reusable components:** Applies — see finding #10 (`RatingBadge`, 5 instances in this page alone) and the `EmptyState` pattern already cited verbatim in `02-Reusable-Components.md` §3 from `LatestServices.jsx:191-205` (build the shared component here, since this is its canonical example). `Avatar`-with-fallback pattern (`TopRatedDecorators.jsx:317-330`, `getPlaceholderLogo`) is also a second instance of the pattern in `02-Reusable-Components.md` §10 — extract once `ManageUser.page.jsx`'s version is also touched, not required for this page alone.
- **Skeleton/spinner loader:** Applies, mixed — `LatestServices.jsx` (lines 176-189) already does this correctly with a shaped `animate-pulse` skeleton grid; keep it as the reference implementation. `TopRatedDecorators.jsx` (lines 155-164) uses a full-replace centered spinner instead of a carousel-shaped skeleton. `FeaturedReviews.jsx` has no loading UI at all (finding #5). `CoverageMap.jsx`, `HowItWorks.jsx`, `TrustAssurances.jsx`, `JoinAsDecoratorCTA.jsx`, `Categories.jsx` render static/local data only — N/A for those.
- **Tooltip:** N/A — no icon-only controls or truncated critical text on this page beyond what's already handled by visible labels (e.g. `CoverageMap`'s city label cards already function as tooltips).
- **Responsiveness:** No major gaps found in the 9 sections — grids collapse correctly (`grid-cols-1` → `md:grid-cols-2/3` patterns throughout), carousel and marquees are already `hidden lg:block`/responsive-width. Not flagged as an issue for this page.
- **Color consistency:** Applies — see findings #2, #3, #4 above against `00-Color-System.md`. Specifically: converge all "brand gradient" headline spans on the canonical `from-indigo-500 to-purple-600` (or document a deliberate, singular "hero gradient" exception if the team wants the pink accent kept — but it must be the *same* gradient everywhere, not five variants), and migrate all `gray-*` neutral classes to `slate-*` per the §2 pairing table.
- **Design consistency:** Applies — beyond the gradient/gray drift, section header structure (pill badge → `h2` → subtitle paragraph) is actually well-matched across all 9 sections — a genuine strength worth preserving as-is while fixing color.
- **Correctness:** Applies — findings #1, #5, #6, #7, #8.
- **Improvement opportunity:** `05-Upgrade-Ideas.md` A1 applies directly to `CoverageMap.jsx` (real map via already-installed `leaflet`/`react-leaflet`, replacing hardcoded per-city stats) — out of scope for this pass (infrastructure-level, needs its own decision), but flag finding #1 (dead `coverage` prop) as a prerequisite blocker worth fixing regardless of whether A1 is pursued later.
- **Coding standard:** Applies — `Banner.jsx:4` has `// eslint-disable-next-line no-unused-vars` directly above `import { motion } from "framer-motion"`, but `motion` **is** used throughout the file (`motion.div`, `motion.h1`, etc.) — the disable comment is stale and should be removed. `LatestServices.jsx:217` has a hardcoded magic-number price fallback (`|| 20000`) with no named constant explaining why 20000.
- **Comments:** N/A — no non-obvious business logic on this page requiring explanation; the existing `// ===` section-divider comments in `Categories.jsx` and `CoverageMap.jsx` are already clear.
- **Accessibility:** Applies — finding #8 (map pins not keyboard-reachable) and the already-documented carousel keyboard/touch gap in `TopRatedDecorators.jsx` (`01-UI-UX-Issues.md` §7, fix code in `06-UI-Upgrade-Guide.md` Phase 2 §8) and reduced-motion gaps in `Banner.jsx`/`Categories.jsx` (`01-UI-UX-Issues.md` §8, fix code in `06-UI-Upgrade-Guide.md` Phase 2 §9). Emoji/icon mismatch in `Banner.jsx:138,158` (`01-UI-UX-Issues.md` §9, fix code in `06-UI-Upgrade-Guide.md` Phase 4 §9).

## Implementation Prompt

Work through `src/features/home/Home.page.jsx` and its 9 section components under `src/features/home/components/`. Apply changes in this order:

**1. Correctness fixes (do first):**
- In `CoverageMap.jsx`, either wire the unused `coverage` prop into the component (if `/Coverage.json` is meant to eventually drive real per-city data) or remove the prop and the corresponding loader/fetch in `Home.page.jsx` / `PublicRoutes.jsx` if it's not going to be used yet. Don't leave a fetched-and-discarded prop in place.
- In `TopRatedDecorators.jsx`, delete the unused `import pic from "../../../assets/images/Avatar.jpg";` (line 15).
- In `FeaturedReviews.jsx`, either wire up a loading skeleton using the existing `loading` state (see step 3) or, if keeping instant-fallback-then-swap is intentional, remove the dead `loading`/`setLoading` and `currentIndex`/`setCurrentIndex` state entirely. Don't leave unused state that implies unfinished work.
- In `LatestServices.jsx`, either make the whole service card clickable (`onClick={() => navigate(...)}` on the outer div, matching the `cursor-pointer` styling already there) or remove `cursor-pointer` from the outer div so only the actual clickable button shows a pointer cursor.
- In `CoverageMap.jsx`, convert the city-pin `<div onClick>` elements (lines 368-378) to `<button type="button">` with `aria-label={city.name}`, matching the pattern already used correctly by the city-selector pills in the same file.
- Remove the stale `// eslint-disable-next-line no-unused-vars` comment above the `motion` import in `Banner.jsx:4`.

**2. Color consistency — converge on `00-Color-System.md`:**
- Pick one canonical brand gradient for section headline accents across all 9 components (recommend `00-Color-System.md`'s `from-indigo-500 to-purple-600`) and apply it uniformly in `Banner.jsx`, `Categories.jsx`, `CoverageMap.jsx`, `FeaturedReviews.jsx`, `HowItWorks.jsx`, `TrustAssurances.jsx`, `JoinAsDecoratorCTA.jsx` — replacing the 5 currently-divergent gradient combinations.
- Migrate `gray-*` classes to their `slate-*` equivalents (per the §2 pairing table in `00-Color-System.md`) in `Categories.jsx` (`CategoryCard`), `CoverageMap.jsx`, `HowItWorks.jsx`, and `TrustAssurances.jsx`.
- Standardize `CoverageMap.jsx`'s gradient utility classes from `bg-gradient-to-*` to `bg-linear-to-*` to match the rest of the page.

**3. Loading states:**
- Give `TopRatedDecorators.jsx` a skeleton loader shaped like the carousel cards (matching the pattern `LatestServices.jsx` already uses correctly) instead of the current full-replace centered spinner.
- Give `FeaturedReviews.jsx` a horizontal-scroll skeleton (3-4 placeholder cards matching the review-card shape) shown while `loading` is true, using the state that's already there but currently unused.

**4. Reusable component extraction:**
- Create `src/components/ui/RatingBadge.jsx` per the shape proposed in `02-Reusable-Components.md` §10 (`<RatingBadge value={rating} count={reviewsCount} />`), and replace the 5 inline star+rating implementations in `LatestServices.jsx`, `TopRatedDecorators.jsx`, and `FeaturedReviews.jsx` (both instances) with it.
- Create `src/components/ui/EmptyState.jsx` per `02-Reusable-Components.md` §3 and replace `LatestServices.jsx:191-205` (the doc's own cited example) with it.
- Create `src/lib/format.js` with `formatCurrency` per `02-Reusable-Components.md` §9 and replace the hand-typed `৳{Number(price).toLocaleString()}` in `LatestServices.jsx:243`.

**5. Accessibility / motion (already fully specified with code in `06-UI-Upgrade-Guide.md`):**
- Apply Phase 2 §8 (carousel keyboard + touch + `IntersectionObserver` pause) to `TopRatedDecorators.jsx`.
- Apply Phase 2 §9 (`prefers-reduced-motion` gating) to `Banner.jsx`'s floating badges and the CSS marquee/spin keyframes used by `Categories.jsx`.
- Apply Phase 4 §9 (emoji → lucide icon swap) to `Banner.jsx:138,158`.

Preserve all existing data-fetching logic, fallback datasets, and section ordering — none of the above requires restructuring the page, only fixing the specific issues listed. After changes, visually verify both light and dark mode, and at mobile/tablet/desktop widths, using the project's app-running convention.

## Verification Checklist

- [ ] `CoverageMap` either uses the `coverage` prop meaningfully or the dead fetch/prop is removed entirely.
- [ ] `TopRatedDecorators.jsx` no longer imports `Avatar.jpg`.
- [ ] `FeaturedReviews` shows a skeleton (not silent fallback-then-swap) while its first fetch is in flight.
- [ ] Clicking anywhere on a `LatestServices` card either navigates or the card no longer shows a pointer cursor where nothing happens.
- [ ] `CoverageMap` city pins are reachable and activatable via Tab + Enter/Space.
- [ ] All 9 sections' headline gradient accents use the same color stops.
- [ ] No `gray-*` classes remain in `Categories.jsx`, `CoverageMap.jsx`, `HowItWorks.jsx`, `TrustAssurances.jsx` — all migrated to `slate-*`.
- [ ] `TopRatedDecorators` shows a shaped skeleton (not a centered spinner) while loading.
- [ ] `<RatingBadge>` renders identically (visually) to the 5 previous inline implementations it replaced, in both light and dark mode.
- [ ] Carousel in `TopRatedDecorators` responds to arrow keys when focused and pauses auto-advance when scrolled off-screen.
- [ ] No raw emoji remain in `Banner.jsx`.
- [ ] Home page tested at mobile, tablet, and desktop widths in both themes — no visual regression.
