# Top Decorators (Listing) — Improvement Prompt

**Route(s):** `/decorators`, `/top-decorators`
**File(s) in scope:** `src/features/decorators/TopDecorators.page.jsx`. Cross-referenced: `src/features/home/components/Spinner.jsx` (shared, not modified here — see finding #3), `src/features/home/components/TopRatedDecorators.jsx` (shares a duplicated helper — see finding #4).
**Related audit references:**
- `02-Reusable-Components.md` §1 (Pagination duplication — this file explicitly cited as one of the 7)
- `03-Frontend-Issues-And-Solutions.md` §11 cites `loadingDetails`/`handleOpenDetails` (lines 68, 103) as unused-per-ESLint, describing "a 'view decorator details' interaction appears to be half-built and not connected to any button" — this read confirms and precisely diagnoses the exact cause (see finding #1).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **A fully-built decorator "quick view" modal exists but has no way to open it.** `selectedDecorator` state (line 67) drives a complete, working modal (lines 448-591: header, performance stats, about section, contact info, service areas, footer CTAs, close button — all fully implemented). The *only* function that calls `setSelectedDecorator(...)` with a real value is `handleOpenDetails` (lines 103-116) — and `handleOpenDetails` is **never called anywhere in the render**. The decorator cards' only interactive element is a `<Link to={`/decorators/${dec._id}`}>` (line 360) that does a full page navigation instead. This precisely explains `03-Frontend-Issues-And-Solutions.md` §11's vaguer "half-built" note: it's not that the modal is unfinished — the modal is complete and correct — it's that nothing triggers it. — **Critical** (a fully-functional feature is completely unreachable; also explains why `loadingDetails` reads as dead code — it *would* work correctly once `handleOpenDetails` is wired up).
2. **`setSearchParams` is destructured but never called.** Line 50: `const [searchParams, setSearchParams] = useSearchParams();`. Initial filter state (`selectedCity`, `sortBy`, `searchTerm`, `page`) is correctly *read* from `searchParams` on mount (lines 59-63), but **no filter change ever writes back to the URL** — city pill clicks, sort changes, search submits, and pagination all update local state only. The URL becomes stale the instant a user interacts with any filter, breaking bookmarking, sharing, and browser back/forward for this page. — **Critical** (silently broken feature — the plumbing for URL sync is half-built, same shape as finding #1).
3. **Loading state uses the shared `<Spinner />` inside a `min-h-[40vh]` wrapper**, same issue as `04-Services.md` finding #2 — `Spinner.jsx` forces `h-screen` on its own root regardless of container size, causing a layout jump on every filter/page change. — **Moderate**.
4. **`getPlaceholderLogo` is duplicated verbatim.** Lines 42-45 here are byte-for-byte identical to the same-named function in `src/features/home/components/TopRatedDecorators.jsx` (cited in `02-Reusable-Components.md` §10's Avatar-primitive evidence). Two independent copies of the same fallback-avatar URL builder. — **Moderate**.
5. **Hero banner and modal header use different gradient stop orders for what's meant to be the same "premium dark" treatment**, even within this single file: hero banner (line 138) is `from-slate-950 via-purple-950 to-indigo-950`, modal header (line 452) is `from-purple-950 via-slate-900 to-indigo-950` — same three hues, different order/composition. Reinforces the page-wide gradient-drift finding already documented at length in `01-Home.md` finding #2 — this is not a Home-only problem. — **Polish**.

### Generic checklist

- **Reusable components:** Applies — `02-Reusable-Components.md` §1 already cites this file's pagination block (lines 374-444) as one of 7 byte-for-byte duplicates; migrate to `<Pagination>` (reuse if already built by an earlier page's pass). Finding #4 (`getPlaceholderLogo` duplication) is a second, independent case for the `<Avatar>` primitive proposed in §10 — reuse if `TopRatedDecorators.jsx` has already been migrated, otherwise this page and that one should be fixed together since the duplication is 1:1 between exactly these two files.
- **Skeleton/spinner loader:** Applies — finding #3, same fix pattern as `04-Services.md`.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — hero, filter bar, and card grid all collapse correctly (`grid-cols-1` → `md:2` → `lg:3`); the modal's `max-h-[90vh] overflow-y-auto` body handles small viewports correctly.
- **Color consistency:** Mostly clean — `slate-*`/`purple-600`/`amber-*` used consistently per `00-Color-System.md`, similar to `Services.page.jsx` and `ServiceDetails.page.jsx`. Only the gradient-order inconsistency (finding #5) is worth touching here.
- **Design consistency:** Applies, minor — see finding #5.
- **Correctness:** Applies — findings #1, #2 are the headline issues for this page.
- **Improvement opportunity:** None beyond wiring up the already-built modal (finding #1), which is itself the single highest-value fix available on this page — no new feature needs to be designed, only connected.
- **Coding standard:** N/A beyond the duplication noted above.
- **Comments:** N/A.
- **Accessibility:** N/A beyond what's already covered — modal has a working close button and backdrop; note (don't fix here, it's a cross-cutting concern covered in `01-UI-UX-Issues.md`/`02-Reusable-Components.md` §6) that this modal, like others in the app, isn't built with `createPortal`, has no Escape-to-close, and has no focus trap — if the shared `<Modal>` shell from `02-Reusable-Components.md` §6 gets built during another page's pass, migrate this modal onto it then; not required as part of this page's own fix.

## Implementation Prompt

Apply these changes to `src/features/decorators/TopDecorators.page.jsx`:

**1. Correctness fixes (do first, highest value):**
- Wire up the decorator quick-view modal (finding #1): add an `onClick={() => handleOpenDetails(dec)}` to each decorator card (e.g. on the card's logo/name area, or a dedicated small "Quick View" button placed alongside the existing "View Agency Profile" `<Link>` so the two affordances don't conflict — the Link should keep navigating to the full profile page, the new trigger should open the modal). Use the already-declared `loadingDetails` state to show a loading indicator on the card (or in the modal itself) while `GET /decorators/id/:id` is in flight.
- Fix the URL sync (finding #2): call `setSearchParams(...)` whenever `selectedCity`, `sortBy`, `searchTerm`, or `page` changes, so the URL reflects current filter state and supports bookmarking/back-forward/sharing. Keep the existing initial-read-from-`searchParams` logic as-is — only add the missing write side.
- Replace the `<Spinner />`-in-`min-h-[40vh]` loading block (lines 260-263) with a shaped skeleton grid matching the decorator card layout.

**2. Reusable component extraction (coordinate with `01-Home.md` and other pages already processed):**
- If `<Pagination>` already exists from an earlier page's pass, replace this file's pagination block (lines 374-444) with it; otherwise build it here.
- Extract `getPlaceholderLogo` into a shared util (or build the `<Avatar>` primitive per `02-Reusable-Components.md` §10) and use it from both this file and `src/features/home/components/TopRatedDecorators.jsx` — don't leave two independent copies.

**3. Polish:**
- Standardize the hero banner and modal header gradients to use the same stop order (pick one of `from-slate-950 via-purple-950 to-indigo-950` or `from-purple-950 via-slate-900 to-indigo-950` and apply it to both).

Preserve all existing fetch logic, filter semantics, and the modal's existing content/structure — none of the above requires restructuring the page, only connecting and fixing what's already built.

## Verification Checklist

- [ ] Clicking a decorator card (or its quick-view trigger) opens the modal with that decorator's details.
- [ ] The modal shows a loading indicator while `GET /decorators/id/:id` is in flight, then updates with fresher data if it differs from the card's cached info.
- [ ] Changing city filter, sort, search, or page updates the URL's query string.
- [ ] Reloading the page with a filtered URL (e.g. `?city=Dhaka&sort=rating&page=2`) restores that exact filtered view.
- [ ] Browser back/forward navigates between filter states correctly.
- [ ] Changing a filter while the grid is populated shows a skeleton, not a full-viewport spinner replacing the grid.
- [ ] `getPlaceholderLogo` is defined in one place only, used by both this file and `TopRatedDecorators.jsx`.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
