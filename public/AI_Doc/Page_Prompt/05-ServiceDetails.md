# Service Details — Improvement Prompt

**Route(s):** `/services/:id`
**File(s) in scope:** `src/features/services/ServiceDetails.page.jsx`. Cross-referenced: `src/features/home/components/Spinner.jsx` (shared, not modified here — see finding #2).
**Related audit references:**
- `03-Frontend-Issues-And-Solutions.md` §11 (`ratingDistribution` fetched at `ServiceDetails.page.jsx:40` but never rendered — confirmed directly in this read)
- `04-Business-Logic.md` §6 (deposit calculated client-side at booking-quote time: `subtotal/tax/grandTotal/deposit` formula) — confirmed present here (line 148) using the same `depositRequiredPercent || 25` default the doc describes
- `05-Upgrade-Ideas.md` A2 (rating distribution bar chart — "cheapest possible feature... only the render is missing"), B4 (centralize deposit math server-side, stop recomputing client-side as a fallback)
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`ratingDistribution` is fetched and stored but never rendered — confirmed.** Line 40 declares the state, line 69 populates it from `revRes.data.ratingDistribution`, and it is never referenced again anywhere in the JSX. This matches `03-Frontend-Issues-And-Solutions.md` §11 and is exactly the feature `05-Upgrade-Ideas.md` A2 describes as the cheapest available win in the whole codebase — the API call is already made and paid for. — **Moderate** (confirmed, not new, but now precisely re-verified against current line numbers).
2. **Reviews-loading spinner will visually break the page layout.** Lines 408-411: `{reviewsLoading ? <div className="py-8 flex justify-center"><Spinner /></div> : ...}`. `Spinner.jsx` hardcodes `h-screen` on its own root `<div>` regardless of its parent's size — so while reviews are loading, this small `py-8` section inside the page (already scrolled well below the fold, inside a `lg:col-span-8` content column) balloons to a full 100vh block, then collapses back once reviews arrive. This is a real, visible layout defect, not a style nitpick — a returning visitor scrolling through package details will see a huge blank/centered-spinner jump mid-page. — **Critical**.
3. **Package-tier price shown with the base-price strikethrough, even when the two aren't comparable.** Lines 507-516: whenever `basePrice > selectedPrice`, the UI shows `~~৳{basePrice}~~ ৳{selectedPrice}` as if it's a "you're saving X" discount — but once a package tier is selected, `selectedPrice = currentPackage.price` (line 147), which is a **different pricing tier's** price, not a discount off `basePrice`. If a customer selects a cheaper "Silver" tier priced well below `basePrice`, the strikethrough implies they're getting the *base* package at a discount, when they're actually buying a smaller/different package. On a payments-sensitive page, this is a misleading-pricing risk worth fixing precisely, not just noting. — **Moderate**.
4. **Package-tier selector rows are `<div onClick>`, not buttons/radios.** Lines 532-539 — same anti-pattern as the auth pages' password toggle and Home's `CoverageMap` city pins: not reachable via keyboard, no `role`/`aria-pressed`. This directly affects the primary purchase-decision control on the page. — **Moderate**.

### Generic checklist

- **Reusable components:** Applies, minor — the star+rating display (lines 245-249) and per-review star badge (lines 451-454) are two more instances of the duplicate rating-badge pattern cataloged in `02-Reusable-Components.md` §10; reuse `<RatingBadge>` if it already exists from an earlier page's pass. The reviews list card (lines 424-494) is structurally similar to `FeaturedReviews.jsx`'s review card (see `01-Home.md`) but not identical enough to force a shared component in this pass — note only.
- **Skeleton/spinner loader:** Applies — finding #2. The top-level full-page loading state (lines 93-98, `min-h-[80vh]` wrapping `<Spinner />`) is an appropriate use of a full-screen spinner (initial page load, nothing else on screen yet) and should be left as-is; only the *reviews-section* spinner usage is the problem.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — the `lg:grid-cols-12` (8/4 split) layout collapses to a single column below `lg`, and the sticky booking panel (`sticky top-24`) only applies at `lg:col-span-4`, which is safe since it's not sticky on mobile where it would otherwise crowd the viewport.
- **Color consistency:** Mostly clean — this page already uses the canonical `slate-*`/`purple-600`/`emerald-*` (inclusions)/`rose-*` (exclusions) roles correctly and consistently per `00-Color-System.md`. No migration needed; this is one of the better-aligned pages in the app.
- **Design consistency:** N/A — internally consistent card styling throughout (`bg-white dark:bg-slate-900 rounded-3xl border ... shadow-xs` repeated identically across every content block on the page).
- **Correctness:** Applies — findings #1, #2, #3.
- **Improvement opportunity:** `05-Upgrade-Ideas.md` A2 applies directly (finding #1) — implement the rating-distribution bar chart, the data is already there. B4 (centralize deposit math server-side) is infrastructure-level and out of scope for a single-page pass, but note it: this file is one of the two places (`04-Business-Logic.md` §6 names both) doing the client-side deposit-quote math that B4 wants to eventually eliminate — don't let a page-level pass here start recomputing it differently, keep the existing formula exactly as-is unless doing the full B4 migration.
- **Coding standard:** Applies, minor — same hardcoded price-fallback magic number pattern (`|| 25000` line 142) as other service-related pages.
- **Comments:** Applies — the deposit calculation block (lines 142-148) is exactly the kind of business-critical, easy-to-get-wrong math `04-Business-Logic.md` flags as duplicated across the codebase; a one-line comment noting "quote-time estimate only — see `04-Business-Logic.md` §6, actual payment percentage is computed separately at payment time in `MyBookings.page.jsx`" would help the next person avoid assuming this is the single source of truth.
- **Accessibility:** Applies — finding #4.

## Implementation Prompt

Apply these changes to `src/features/services/ServiceDetails.page.jsx`:

**1. Correctness fixes (do first):**
- Replace the reviews-loading `<Spinner />` (lines 408-411) with a small inline skeleton (e.g. 2-3 `animate-pulse` placeholder review cards matching the real review card's shape) instead of the full-viewport-height `Spinner` component.
- Fix the strikethrough-pricing logic (finding #3): only show the `basePrice` strikethrough when no package tier is selected (i.e. `selectedPrice === discountedPrice`, comparing like-for-like against `basePrice`). When a package tier is selected, either show no strikethrough at all, or show the tier's own "compare-at" price if the data model has one — don't compare a selected tier's price against the unrelated base price.
- Convert the package-tier selector `<div onClick>` rows (lines 532-539) to `<button type="button" aria-pressed={isSelected}>` so tier selection is keyboard-reachable.

**2. Feature completion (data already fetched, per `05-Upgrade-Ideas.md` A2):**
- Render `ratingDistribution` as a per-star breakdown (e.g. "5★ ████░ 82%" horizontal bars) near the aggregate rating display (around lines 392-404), using the state that's already populated and currently unused.

**3. Reusable component extraction (coordinate with other pages already processed):**
- Replace the two inline star+rating renderings (lines 245-249, 451-454) with `<RatingBadge>` if it exists from an earlier page's pass; otherwise leave as-is for now rather than building it here (this page has fewer instances than `01-Home.md`, which is the better place to build it first).

**4. Comment:**
- Add a short comment above the deposit calculation (lines 142-148) noting it's a quote-time estimate, per `04-Business-Logic.md` §6's documented duplication with `MyBookings.page.jsx`'s separate payment-time calculation — don't change the math itself in this pass.

Preserve all existing data-fetching logic, package-tier selection behavior, and booking-navigation flow — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Scrolling to the reviews section while reviews are loading shows a small in-place skeleton, not a full-viewport spinner.
- [ ] Selecting different package tiers no longer shows a misleading "discount" strikethrough against an unrelated base price.
- [ ] Package tier rows are reachable via Tab and selectable via Enter/Space.
- [ ] A per-star rating distribution bar chart is visible under the aggregate rating.
- [ ] Deposit/pricing numbers shown to the customer are unchanged from before this pass (verify against a known service record).
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
