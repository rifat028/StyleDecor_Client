# Upgrade Ideas

Grounded in what's actually in the repo — installed-but-unused dependencies, half-built features (unused state from the ESLint sweep), and gaps confirmed by searching for their absence (no test files, no CI config, no i18n library, no PWA manifest). Grouped by theme; each idea says *why it's worth doing here specifically*, not generically.

---

## A. Product features the data model already supports but the UI doesn't expose

### A1. A real map, using dependencies already installed and paid for
`leaflet` and `react-leaflet` are both in `package.json` — and **unused**: `grep -rl "leaflet\|MapContainer" src` returns zero files. `CoverageMap.jsx` fakes a map with hand-picked `{ x: 48, y: 46 }` percentage coordinates positioned over a static background, and its "180+ Agencies", "4,500+ Setup" numbers per city are hardcoded marketing copy, not live counts from `/decorators`.
**Upgrade:** Replace with a real `<MapContainer>` showing actual decorator locations (pull from `/decorators?city=...`), and let customers filter/search decorators geographically instead of only via the `citiesList` dropdown used in `ManageUser.page.jsx`/`Services.page.jsx`. This also fixes the "fake stats" trust problem — showing real counts instead of copy that never changes.

### A2. Rating distribution bar chart
Already fetched from `/reviews/service/:id` and stored in state (`ServiceDetails.page.jsx:40`, `ratingDistribution`) — flagged as dead/unused state in `03-Frontend-Issues-And-Solutions.md` §11. This is the cheapest possible feature add in the whole codebase: the data exists, the API call is already made, only the render is missing. Add a standard "5★ ████░ 82%" bar breakdown under the aggregate rating on `ServiceDetails.page.jsx`.

### A3. Real-time booking status (no polling, no refresh required)
The booking lifecycle documented in `04-Business-Logic.md` §5 is entirely poll-driven — a customer has to reload `MyBookings.page.jsx` to see that a decorator accepted their request or an agent marked "on the way." For a same-day/event-day product (agent en route, setup in progress), this lag matters. `firebase` is already a dependency (used for auth) — Firestore or Firebase Realtime Database could push booking-status changes live with minimal new infrastructure, or a lighter-weight approach (SSE endpoint, or just short-interval polling with `visibilitychange` awareness) would still beat the current "user has to know to refresh" model.

### A4. In-app chat between customer ↔ decorator ↔ agent
The booking flow has real coordination needs (exact venue directions, last-minute changes) that today can only happen off-platform (the `contact` phone number collected at booking is presumably used to call outside the app). A simple threaded-message-per-booking feature (using the same Firestore option as A3) would keep that coordination — and its record — inside the platform instead of leaking to WhatsApp/phone calls, which also means support/disputes have no transcript to reference.

### A5. Decorator availability calendar
Nothing in the scanned booking flow checks whether a decorator is already booked for a requested date before accepting a new one (`ServiceBooking.page.jsx` only validates the date isn't in the past via `minSelectableDate`). Double-booking risk for popular decorators/dates. A calendar view (decorator-side, in `MyProjects.page.jsx` or a new tab) showing confirmed events, plus a client-side warning ("this decorator already has an event on this date") before a customer submits, would reduce accepted-then-cancelled bookings.

### A6. Bangla language support
This is an explicitly Bangladesh-focused product (Bangladeshi cities throughout, ৳ currency, bKash/Nagad payment methods) built entirely in English, with no `i18next`/`react-intl`/any i18n library installed. For a consumer marketplace, offering Bangla (the primary spoken language) alongside English would likely widen the addressable customer base meaningfully beyond an English-literate segment.

### A7. PDF invoices / downloadable receipts
Payment "receipt" modals (`ManageTransactions.page.jsx`, `MyEarnings.page.jsx`, `Transactions.page.jsx`) all render a nice in-app breakdown (gateway fee, commission, deposit, etc.) but there's no "Download PDF" or "Print Invoice" action anywhere (`grep -rn "jspdf\|react-to-print\|window.print" src` — none installed/used). Customers and decorators doing their own bookkeeping currently have to screenshot the modal. A lightweight PDF export (`jspdf` or a server-generated PDF link) is a small add with clear value for a payments-heavy product.

---

## B. Architecture upgrades

### B1. A data-fetching library (React Query / TanStack Query)
Every list page in the app (all 9 admin pages, `Services.page.jsx`, all 3 home-page data sections) hand-rolls the same `useState([...]) + useState(loading) + useCallback(fetch) + useEffect` boilerplate — confirmed by reading `ManageUser.page.jsx`, `ManageServices.page.jsx`, `ManageBookings.page.jsx`, `ManageTransactions.page.jsx` side by side; the shape is identical every time. None of it gets caching, request deduplication, background refetch-on-focus, or automatic retry — e.g. switching from `/dashboard/manage-users` to another admin tab and back re-fetches from scratch every time, and the stale-role problem in `03-Frontend-Issues-And-Solutions.md` §10 is a symptom of not having a cache-invalidation story at all. Adopting `@tanstack/react-query` would delete a large fraction of the ~30 hand-rolled fetch effects and fix several of the "stale data after mutation" edges (e.g. `ManageUser.page.jsx` manually calls `loadUsers(); loadStats();` after every single mutation — 6 separate call sites doing the same two-line dance — where React Query's query invalidation would do it in one place).

### B2. TypeScript (or at minimum JSDoc + `checkJs`)
The amount of defensive optional-chaining fallback logic throughout (`service.title || service.serviceName || "Signature Decor Package"`, repeated with slight variations in `ServiceCard.jsx`, `LatestServices.jsx`, `ServiceDetails.page.jsx`, `ManageServices.page.jsx` — four different files independently guessing at the same object's shape) is a strong signal the API response shape either changed over time or was never formally agreed on between frontend and backend. A shared `Service`/`Booking`/`Decorator`/`Payment` type (even just JSDoc `@typedef`s to start, without a full TS migration) would surface these mismatches at compile time instead of via `||` chains discovered by trial and error.

### B3. A shared API client layer per resource
Right now every page calls `axiosSecure.get("/services?...")`, builds its own `URLSearchParams`, and unpacks `res.data?.success ? res.data.data : ...` inline (this exact unpack pattern is repeated in `Services.page.jsx`, `ManageServices.page.jsx`, `ManageBookings.page.jsx`, `ManageTransactions.page.jsx`). A thin `src/lib/api/services.js`, `bookings.js`, etc. exporting typed functions (`listServices(filters)`, `getService(id)`) would remove the duplicated response-unwrapping logic and give React Query (B1) natural query-key boundaries.

### B4. Centralize the commission/deposit math server-side, remove client-side fallbacks
`04-Business-Logic.md` §6-7 documents two places where financial math is duplicated client-side as a fallback (`Math.round(amount * 0.10)` for commission, `Math.round(grandTotal * 0.40)` for deposit) and one confirmed inconsistency between the 25%-default deposit quoted at booking time and the 40% hardcoded at payment time. Business-critical money math shouldn't have two independent implementations that can silently drift — the frontend should always render whatever the backend computed and never recompute it as a "fallback," even for a nicer empty state.

---

## C. Performance

### C1. Route-level code splitting
Already covered in `03-Frontend-Issues-And-Solutions.md` §8 with real numbers (1.77 MB single JS chunk) — repeating here because it's the highest-leverage performance win available: `React.lazy()` on every `Routes/*.jsx` page import, one `<Suspense>` boundary per layout.

### C2. Image pipeline
Also covered in §9 of the same doc (several 2-3 MB PNGs rendered at ~100-150px). Beyond one-time compression, consider `vite-imagetools` or moving to a CDN with on-the-fly resizing (Cloudinary/imgix) so decorator-uploaded cover images (which will vary wildly in size once real vendors start uploading their own photos, unlike the current curated placeholder set) don't repeat this problem at scale.

### C3. Skeleton loaders instead of full-replace spinners
Every admin table currently swaps its entire content area for a centered `<Spinner>` on load/refetch (`ManageUser.page.jsx:502-505` etc.), causing a layout jump when data arrives. Pairs naturally with the `TableRowSkeleton`/`CardGridSkeleton` components proposed in `02-Reusable-Components.md` §5 — worth prioritizing once React Query (B1) is in place, since query-level `isFetching` (vs `isLoading`) makes "skeleton on first load, subtle inline indicator on refetch" easy to express.

---

## D. Quality & operational maturity

### D1. Automated tests
`find . -iname "*.test.*" -o -iname "*.spec.*"` returns nothing, and no `vitest`/`jest`/`@testing-library` dependency exists in `package.json`. For a payments-and-role-permissions-heavy app (four route guards, a hardcoded super-admin email, a two-phase deposit calculation with a known inconsistency — see B4), even a thin layer of tests around the highest-risk logic would catch regressions the current manual-QA-only process can't: the route guards (`AdminRoutes`/`DecoratorRoutes`/`AgentRoutes` — do they correctly block/allow?), the pricing calculation in `ServiceBooking.page.jsx`, and the commission math in `MyEarnings.page.jsx`.

### D2. CI pipeline
No `.github/workflows` directory exists. At minimum, a workflow that runs `npm run lint` and `npm run build` on every PR would have caught the 38 ESLint errors currently in the tree (`03-Frontend-Issues-And-Solutions.md` §11) and would catch the case-sensitive-import class of bug (§1 of the same doc) *before* it reaches a production deploy, rather than relying on a developer's local (case-insensitive) machine happening to build successfully.

### D3. Error tracking (Sentry or similar)
Paired with the "add an ErrorBoundary" fix in `03-Frontend-Issues-And-Solutions.md` §3 — right now a production crash produces a white screen and the team finds out only if a user reports it. An error-tracking SDK reporting from both the new ErrorBoundary and the axios response interceptor would turn "silent failure" into "actionable alert."

### D4. PWA / installability
No `manifest.json`, no service worker (`find . -iname "manifest.json" -o -iname "sw.js"` — none). Given the mobile-first payment methods already central to the business (bKash, Nagad), a lot of the real customer base is likely primarily on mobile. `vite-plugin-pwa` would add installability and basic offline caching (at least "view your upcoming bookings without a connection") for close to zero custom code.

---

## E. Suggested sequencing

These aren't equally urgent — a rough priority order, front-loading fixes that either stop money/trust problems or unblock everything after them:

1. **Fix the deposit-percent inconsistency (B4)** and the case-sensitive import (see `03-Frontend-Issues-And-Solutions.md` §1) — both are live correctness bugs, not upgrades.
2. **CI pipeline (D2)** — cheap, and prevents every future regression of the above two from silently happening again.
3. **React Query (B1)** — unlocks cleaner code for everything built after it; do this before building A3/A4 (real-time features are much easier to reason about on top of a proper query cache).
4. **Route code splitting (C1)** — one afternoon of work, immediate bundle-size win, no architecture prerequisite.
5. Everything in section A, roughly in the order listed (A2 is nearly free; A1/A6 are the biggest differentiators for this specific market).
