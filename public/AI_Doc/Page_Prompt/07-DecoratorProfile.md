# Decorator Profile (Public) — Improvement Prompt

**Route(s):** `/decorators/:id`
**File(s) in scope:** `src/features/decorators/DecoratorProfile.page.jsx`.
**Related audit references:**
- `02-Reusable-Components.md` §10 (Avatar-with-fallback pattern — `getPlaceholderLogo` duplicated here) — this file is a further instance beyond the ones already cited (`TopRatedDecorators.jsx`, `TopDecorators.page.jsx`, `ManageDecorator.page.jsx`).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Secondary data (services, agents, reviews) loads sequentially instead of in parallel.** Lines 55-93: the primary decorator fetch (`GET /decorators/id/:id`) is awaited first, then three more independent fetches (`GET /services/decorator/:id`, `GET /agents/decorator/:id`, `GET /reviews/decorator/:id`) are awaited **one after another** inside sequential `try/catch` blocks rather than run concurrently via `Promise.all`/`Promise.allSettled`. Since none of the three secondary calls depends on another's result, this needlessly triples the wait time for the page to finish loading (on a connection with 300ms round-trip latency, that's roughly 900ms of avoidable sequential waiting after the initial fetch). — **Moderate**.
2. **`getPlaceholderLogo` is duplicated yet again.** Lines 32-35 — the same function now exists independently in this file, `TopRatedDecorators.jsx` (Home), `TopDecorators.page.jsx`, and `ManageDecorator.page.jsx` — four confirmed copies of the same avatar-fallback URL builder. — **Polish** (reinforces the extraction already recommended in `06-TopDecorators.md` finding #4 and `21-ManageDecorator.md` finding #1).

### Generic checklist

- **Reusable components:** Applies — finding #2. The star-row review display (lines 627-638, rendering 5 individual `<Star>` icons filled/unfilled based on rating) is a distinct pattern from the single-badge `<RatingBadge>` proposed elsewhere (`02-Reusable-Components.md` §10) — both are legitimate, different UI needs (a compact badge vs. a full star row); not a duplication to fix, just noting the app now has two star-display conventions.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 118-124) is an appropriate full-page use of `<Spinner />` for the initial profile load.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — the sticky tab bar and content grid collapse correctly at all widths.
- **Color consistency:** N/A — this page is clean, consistently using canonical `purple`/`amber`/`emerald` with no deprecated hues.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #1.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — the tab navigation is real `<button>` elements with `scrollIntoView`, and images have descriptive `alt` text throughout.

## Implementation Prompt

Apply these changes to `src/features/decorators/DecoratorProfile.page.jsx`:

**1. Efficiency fix:**
- Replace the sequential `try/catch` chain for services/agents/reviews (lines 65-86) with `Promise.allSettled([...])` so all three independent fetches run concurrently, each still failing gracefully on its own without blocking the others (matching the existing per-fetch `console.warn`-and-continue behavior, just running in parallel instead of in series).

**2. Reusable extraction (coordinate with `06-TopDecorators.md`/`21-ManageDecorator.md`):**
- Replace the local `getPlaceholderLogo` (lines 32-35) with the shared util once extracted by another page's pass; otherwise build it here.

Preserve all existing tab navigation, data display, and share-link logic — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Page load time for a decorator profile with services, agents, and reviews all populated is noticeably faster than before (parallel fetches vs. sequential).
- [ ] Any one secondary fetch failing (e.g. reviews endpoint down) still shows the other two sections correctly, matching prior graceful-degradation behavior.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
