# Service Booking — Improvement Prompt

**Route(s):** `/service-booking/:id`, `/services/:id/book` (both wrapped in `PrivateRoutes`)
**File(s) in scope:** `src/features/services/ServiceBooking.page.jsx` (the live, routed one — **not** `src/features/customer/ServiceBooking.page.jsx`, which is the dead duplicate already flagged for deletion in `03-Frontend-Issues-And-Solutions.md` §2 / `06-UI-Upgrade-Guide.md` Phase 1 §7). Cross-referenced: `src/features/auth/Login.page.jsx` (redirect-state contract this page must match — see finding #1), `src/features/home/components/Spinner.jsx` (shared, not modified here — see finding #2).
**Related audit references:**
- `03-Frontend-Issues-And-Solutions.md` §2 confirms this live file already has `min={minSelectableDate}` and `min="10"` validation that the dead duplicate lacks — verified present and correct here (lines 463, 487-488).
- `04-Business-Logic.md` §6 (quote-time deposit calculation: `subtotal/tax(5%)/grandTotal/deposit(depositPercent||25%)`) — confirmed present here exactly (lines 97-121), matching the doc's citation of this file/line range.
- `05-Upgrade-Ideas.md` B4 (centralize deposit math server-side) — this file is one of the two the doc names.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Post-login redirect is broken for this entire flow — passes an object where `Login.page.jsx` expects a string.** Line 170: `navigate("/login", { state: { from: `/service-booking/${id}` } })`. `Login.page.jsx`'s `HandleLogIn` reads the redirect target as `navigate(location.state || "/dashboard")` (`Login.page.jsx:27`) — it expects `location.state` to **be** the destination path itself (a bare string), not an object with a `.from` key. Since this file passes `{ from: "..." }`, `location.state` becomes that object, and `navigate({from: "/service-booking/xyz"})` is called — React Router's `navigate()` treats an object argument as a partial `Path` (`{pathname, search, hash}`); `{from: ...}` has none of those keys, so it resolves to the *current* location, not the intended booking page. **A user who gets redirected to login from this booking flow will not be returned to it after logging in.** Compare against `JoinAsDecorator.page.jsx`, which passes the state correctly (`state="/join-as-decorator"`, a bare string, via both `<Link state=...>` and `navigate(..., { state: ... })`) — that file's pattern is the one to copy. — **Critical**.
2. **Submit button renders the shared `<Spinner />` inline, inside the button itself.** Lines 748-751: `{submitting ? (<><Spinner /> Placing Reservation...</>) : ...}`. `Spinner.jsx` hardcodes `h-screen flex justify-center items-center` on its own root `<div>` — rendering that *inside* a `<button>` element while submitting a booking will force the button (and likely break the surrounding layout) to a full-viewport-height block. This is the most severe instance of the shared-`Spinner`-misuse pattern found across this review. — **Critical**.
3. **Package-tier selector rows are `<div onClick>`, not buttons.** Lines 406-436 — same anti-pattern already flagged in `ServiceDetails.page.jsx` (`05-ServiceDetails.md` finding #4): not keyboard-reachable, no `role`/`aria-pressed`. — **Moderate**.
4. **Decorator "city" badge uses `emerald-*` (success color) for a neutral location tag.** Lines 387-389: `bg-emerald-100 ... text-emerald-700` used just to display the decorator's city name — no success/positive state is being communicated, it's plain location info. Per `00-Color-System.md`, `emerald` is reserved for success states. — **Polish**.

### Generic checklist

- **Reusable components:** N/A beyond what's already covered by other pages' passes — this page's deposit-calculation block (finding, see Correctness) duplicates the same formula as `ServiceDetails.page.jsx` (already noted there); don't re-derive a shared utility for it in this pass, that's B4-level infrastructure work, out of scope for a single page.
- **Skeleton/spinner loader:** Applies — finding #2. The full-page initial loading state (lines 262-271, `min-h-[70vh]` wrapping `<Spinner />` with an explanatory caption) is an appropriate use and should be left as-is; only the inline submit-button usage is the problem.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — `lg:grid-cols-12` (8/4 split) form/sidebar layout collapses correctly to a single column; sticky sidebar (`sticky top-24`) only applies at `lg:col-span-4`.
- **Color consistency:** Mostly clean — `slate-*`/`purple-600`/`rose-*` (form-error states) used consistently per `00-Color-System.md`. Only finding #4 needs a touch-up.
- **Design consistency:** N/A — internally consistent with `ServiceDetails.page.jsx`'s card styling conventions.
- **Correctness:** Applies — findings #1, #2, #3. Also note (informational only, not a fix item): the booking payload (lines 190-220) includes a "Backward compatibility fields" block sending both new-shape and legacy-shape fields (`clientName`, `location`, `totalCost`, `unit: 1`, etc.) — this is backend-schema-migration debt, not a frontend bug; leave as-is unless the backend contract is being changed in the same effort.
- **Improvement opportunity:** `05-Upgrade-Ideas.md` B4 applies at the infrastructure level (out of scope here) — note only.
- **Coding standard:** N/A.
- **Comments:** Applies — same as `05-ServiceDetails.md`'s recommendation: a short comment on the deposit calculation block (lines 97-121) noting it's duplicated with `ServiceDetails.page.jsx` and referencing `04-Business-Logic.md` §6 would help future maintainers avoid a third independent copy.
- **Accessibility:** Applies — finding #3.

## Implementation Prompt

Apply these changes to `src/features/services/ServiceBooking.page.jsx`:

**1. Correctness fixes (do first, highest value):**
- Fix the broken post-login redirect (finding #1): change line 170 from `navigate("/login", { state: { from: `/service-booking/${id}` } })` to `navigate("/login", { state: `/service-booking/${id}` })` — a bare string, matching the contract `Login.page.jsx` actually reads (`location.state || "/dashboard"`) and matching the working pattern already used in `JoinAsDecorator.page.jsx`. Search the rest of the codebase for any other `navigate("/login", { state: { from: ... } })` call sites using the broken object-wrapped form and fix those too if found within this page's scope.
- Replace the inline `<Spinner />` inside the submit button (lines 748-751) with a small inline CSS spinner (e.g. a spinning border/circle sized for a button, not the full-screen `Spinner` component) plus the "Placing Reservation..." text.
- Convert the package-tier selector `<div onClick>` rows (lines 406-436) to `<button type="button" aria-pressed={isSelected}>`.

**2. Polish:**
- Change the decorator city badge (lines 387-389) from `emerald-*` to a neutral `slate-*` tag, consistent with how city/location tags are styled elsewhere in the app (e.g. `TopDecorators.page.jsx`'s service-area pills).

**3. Comment:**
- Add a short comment above the `pricingCalculations` block (lines 97-121) noting it duplicates `ServiceDetails.page.jsx`'s quote-time deposit math, per `04-Business-Logic.md` §6 — don't change the math itself in this pass.

Preserve all existing form validation, submission flow, and SweetAlert2 confirmation dialogs — none of the above requires restructuring the page.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Customer/ServiceBooking/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Customer/ServiceBooking/`

---

## UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - **Left:** Contextual icon badge in purple container, page title, and descriptive subtitle.
   - **Right:** Primary action button(s) (e.g. "Refresh Data", "Action") with clean styling.

2. **Stat Cards Section (if applicable)**:
   - Built with the reusable `<StatCard>` component (`src/components/ui/StatCard.jsx`) supporting categorical tone themes.
   - Ultra-compact horizontal layout with minimal height (~48px) and no captions/subtitles.
   - Interactive click-to-filter support and pulse skeleton loader fallback state (`loading={true}`) when stats data is fetching or unavailable.

3. **Search & Filters Bar Section (if applicable)**:
   - Sits directly above the table/cards in a rounded card container (`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800`).
   - **Left:** Search input with search icon, live debounce (350ms), and clear `(X)` button.
   - **Right:** Clean dropdown selectors for filtering without redundant filter icons next to the dropdowns.

4. **Card / Form Grid Layout**:
   - Organized into clean, responsive grid layout with proper card borders and dark mode tokens.
   - Interactive elements have clear hover and focus states.

6. **Modals & Dialogs (if applicable)**:
   - Reusable `<Modal>` component (`src/components/ui/Modal.jsx`) mounted via `createPortal` with backdrop click close and Escape key dismiss.

7. **Coding Standards**:
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## Verification Checklist

- [ ] Sub-components live in `src/components/pages/Customer/ServiceBooking/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Interactive controls and form elements have proper disabled, hover, and focus states.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.