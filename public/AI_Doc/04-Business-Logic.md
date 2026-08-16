# Business Logic — As Implemented in the Frontend

This documents the actual business rules encoded in `src/` today — role model, workflows, state machines, and pricing/commission math — reconstructed by reading the route guards, the admin/decorator/agent dashboards, and every pricing calculation in the code. Where the frontend duplicates a calculation that should be the backend's source of truth, or where two flows disagree, it's flagged explicitly. This is a marketplace platform connecting **customers** to **decorator agencies** for event decoration (weddings, birthdays, corporate events, etc.) in Bangladesh, with agencies dispatching **field agents** to execute the on-site work.

---

## 1. Roles & access model

Four roles, resolved server-side (`GET /users/me`, cached client-side by `useRole.jsx`) and enforced client-side by four route guards (`Routes/PrivateRoutes.jsx`, `AdminRoutes.jsx`, `DecoratorRoutes.jsx`, `AgentRoutes.jsx`):

| Role | Default? | Guarded routes | Dashboard pages |
|---|---|---|---|
| `customer` | Yes — every new signup starts here | none beyond `PrivateRoutes` (just "logged in") | My Profile, My Bookings, Transactions, My Reviews |
| `decorator` | No — requires application + admin approval | `DecoratorRoutes` | Agency Profile, My Services, My Projects, My Earnings, My Agents, Agency Reviews |
| `agent` | No — role is set by an admin (no self-serve agent signup form exists in the scanned routes) | `AgentRoutes` | My Schedule, Active Execution, Agent Profile, My Performance |
| `admin` | No — set manually (there is a hardcoded "Super Admin" email, see §7) | `AdminRoutes` | Manage Users/Categories/Decorators/Agents/Services/Bookings/Payments/Reviews, Analytics |

**Notable gap:** the four "customer" dashboard pages (`my-profile`, `my-bookings`, `transactions`, `my-reviews`) are wrapped only in `PrivateRoutes` (any authenticated user), not a `CustomerRoutes` guard — so a decorator, agent, or admin account can also open `/dashboard/my-bookings` etc. This may be intentional (e.g. an admin wants to see their own bookings too) but it means there's no route-level enforcement that *only* customers see the customer flow — worth confirming against backend API behavior for those endpoints.

**Enforcement caveat:** all four guards are client-side only (`if (role !== "admin") return <Forbidden />`). This is a UX gate, not a security boundary — every `axiosSecure` call must be independently authorized by the backend regardless of what the React route guard shows, since a user can hit the API directly.

---

## 2. Becoming a decorator (agency onboarding)

**File:** `features/decorators/JoinAsDecorator.page.jsx`

1. Any logged-in user (role irrelevant at this point) fills out a form: business name, tagline, about, city + multi-select service areas (from a fixed list of 10 Bangladeshi cities), phone, website, trade license number, Facebook/Instagram links.
2. `POST /decorators` creates a decorator profile with implicit `status: "pending"`.
3. The user's *role* is not changed at this point — the account remains whatever it was; the decorator *agency record* exists independently and starts unverified.
4. Before rendering the form, the page checks `GET /decorators/me` — if the user already has a decorator application (in any status), the form is replaced with an application-status view instead of allowing a duplicate submission.

## 3. Decorator approval (admin)

**File:** `features/admin/ManageDecorator.page.jsx`

Decorator agency status is a 3-state machine, admin-controlled:
```
pending  ──approve──▶  active   (sets verification.isVerified = true)
pending  ──reject───▶  suspended
active   ──suspend──▶  suspended
```
`PATCH /decorators/:id/status` carries `{ status, isVerified }`. Only an `active` + `isVerified: true` decorator should be eligible to be shown publicly (`TopRatedDecorators`, `LatestServices` on the homepage) or to list services — this eligibility check itself lives on the backend and wasn't independently verified here, but the frontend clearly treats "active" as the gate (`ManageDecorator.page.jsx:607-648` branches all agency-facing actions on `dec.status === "active"` vs `"pending"` vs `"suspended"`).

## 4. Categories & service catalog

**Files:** `features/admin/ManageCategories.page.jsx`, `features/decorator-dashboard/ManageService.page.jsx`, `features/admin/ManageServices.page.jsx`

- Admin owns a two-level taxonomy: **categories** (e.g. "Wedding & Pre-Wedding") each containing **sub-categories** — full CRUD from `ManageCategories.page.jsx` (`isCreateModalOpen`, per-category `expandedCategories` accordion, nested sub-category create/edit forms).
- Decorators create **services** (a decoration package) scoped to one category, with:
  - `pricing.basePrice` / `pricing.discountedPrice` / `pricing.unit` / `pricing.depositRequiredPercent` (defaults to 25% wherever a fallback is needed).
  - Optional **package tiers** (`packages[]`, each with its own `tier` name and `price` — e.g. Silver/Gold/Platinum variants of the same service).
  - `specifications` (setup/teardown duration, minimum notice days, outdoor-suitability).
  - `inclusions[]` / `exclusions[]` lists shown on the public service detail page.
  - `status` (`active`/`inactive`) and a `featured` flag — only admins can toggle `featured` (controls homepage placement in `LatestServices.jsx`); decorators presumably control their own `active`/`inactive` toggle from `ManageService.page.jsx` (mirrors the admin table's toggle pattern).
- Admin has full moderation power over any decorator's services (view/deactivate/delete/feature) from `ManageServices.page.jsx` — the copy on that page ("As an administrator, you can toggle active status, feature packages...") confirms this is intentional platform oversight, not a bug.

## 5. Booking lifecycle — the core state machine

**Source of truth for the full sequence:** `MyProjects.page.jsx:31-42`, `STATUS_STEPS`:

```
in_draft → pending → accepted ⇄ rejected → advance_paid → preparing → on_the_way → in_progress → completed → fully_paid
```

- **Customer** browses a service (`ServiceDetails.page.jsx`), picks a package tier, and submits a booking (`ServiceBooking.page.jsx`) → `POST /bookings`, creating it in `pending` (or `in_draft`, if the UI supports partial saves — not confirmed either way from the scanned code).
- **Decorator** reviews the incoming request (accept/reject) and, once accepted, assigns a **field agent** to the job: `PATCH /bookings/:id/assign` (`MyProjects.page.jsx:141`).
- **Decorator** advances the booking through the lifecycle manually via a "Advance Project Lifecycle" modal that lets them pick any of the `STATUS_STEPS` values and `PATCH /bookings/:id/status` (`MyProjects.page.jsx:223-234`) — this is a **decorator-driven, not strictly sequential** status field; the UI doesn't appear to restrict which transitions are legal (any status can jump to any other via the dropdown), so illegal transitions (e.g. `completed` → `pending`) are only preventable server-side, if at all.
- **Field agent** operates a *separate, narrower* state — `STAGES` in `ActiveExecution.page.jsx:26-31`: `preparing → on_the_way → in_progress → completed`, updated via `PATCH /agents/bookings/:id/stage` (a different endpoint/field than the decorator's `/status` call). Each on-site job also carries a `DEFAULT_CHECKLIST` of 6 physical setup tasks (truss/backdrop anchoring, floral installation, lighting/signage, photo-booth backdrop, walkway carpet, final walkthrough) that the agent checks off — this looks like a fixed template rather than being generated per-service, worth confirming.
- Admin's `ManageBookings.page.jsx` is explicitly **read-only** ("Bookings Supervision (Read-Only)" — the page's own subtitle: *"Booking modifications, agent assignments, and progress updates are managed directly by the providing decorator agencies"*). Admin can only view/search/filter, not mutate booking state.

**So there are two parallel status concepts** for the same booking: the decorator-facing `status` (10 values, includes payment states like `advance_paid`/`fully_paid`) and the agent-facing `stage` (4 execution-only values, a subset). These need to be kept in sync by the backend — the frontend doesn't appear to reconcile them (e.g. does marking a `stage` as `completed` auto-advance the booking `status` to `completed`? Not visible from the frontend alone).

## 6. Payments — two-phase deposit model

**Files:** `features/services/ServiceBooking.page.jsx:96-120` (quote calculation at booking time), `features/customer/MyBookings.page.jsx:280-330` (actual payment execution)

**At quote/booking time**, the price shown to the customer is built as:
```
subtotal      = selected package price (or service basePrice/discountedPrice/cost fallback chain)
tax           = round(subtotal × 5%)        // "platform service tax"
grandTotal    = subtotal + tax
depositPercent = service.pricing.depositRequiredPercent  (defaults to 25 if unset)
deposit       = round(grandTotal × depositPercent / 100)
remaining     = grandTotal − deposit
```

**At actual payment time** (from the customer's "My Bookings" dashboard, after the booking is accepted), the payment type toggles between two options and — **this is the important part** — the deposit amount is **not** the same 25%-style value quoted at booking time:
```js
// MyBookings.page.jsx:303
const calcAmount = payType === "advance_deposit"
  ? Math.round(grandTotal * 0.40)                 // hardcoded 40%, regardless of the service's depositRequiredPercent
  : (remainingDue > 0 ? remainingDue : grandTotal); // "full_payment" = pay whatever remains
```

⚠️ **Confirmed inconsistency:** `ServiceDetails.page.jsx` and `ServiceBooking.page.jsx` both quote the deposit using the service's own `depositRequiredPercent` (commonly defaulted to **25%** across the codebase — see `ManageServices.page.jsx:457`, `ServiceDetails.page.jsx:144`). But when the customer actually pays, `MyBookings.page.jsx` charges a **hardcoded 40%** instead, no matter what percent was shown at checkout. A customer who was quoted "25% deposit = ৳6,250" at booking time can be asked to pay ৳10,000 (40%) when they go to actually pay. This should be reconciled to a single source of truth — ideally the backend returning the deposit amount/percent on the booking record itself, with the frontend never recomputing it independently in two different places with two different formulas.

**Payment methods supported** (per the admin filter dropdown, `ManageTransactions.page.jsx:274-279`): **bKash**, **Nagad**, **SSLCommerz**, **Bank Transfer**, **Stripe** — a mix of Bangladesh mobile financial services, a BD payment gateway aggregator, and Stripe for (presumably) card/international payments.

**Payment statuses:** `completed`, `refunded` (per the status filter — only two values are exposed in the admin UI, though real-world payment states like `pending`/`failed` presumably exist server-side even if not filterable here).

## 7. Commission & vendor payout split

**File:** `features/decorator-dashboard/MyEarnings.page.jsx:112-126, 347-348, 538-546`

When a payment's `breakdown` object isn't present on the record, the frontend estimates it client-side with a fixed formula, used consistently across the earnings list, the receipt modal, and the summary stats:
```
gatewayFee         = round(amount × 1.5%)
platformCommission = round(amount × 10.0%)
vendorReceivable    = round(amount × 88.5%)     // = 100% − 10% − 1.5%
```
This is presented to decorators as "Platform Commission (10.0%)" in the receipt breakdown UI (`MyEarnings.page.jsx:541`), so **10% platform take-rate + 1.5% payment gateway fee** appears to be the actual, intentional business model, not just a UI placeholder — but it's a business-critical number being computed and displayed *client-side as a fallback* rather than always trusting the backend-provided `breakdown`. Any future change to the commission rate requires updating this constant in the frontend too, or old cached/offline views will show the wrong number.

## 8. Refunds

**File:** `features/admin/ManageTransactions.page.jsx:148-160+`

Only admins can initiate refunds, from the payments table: opens a modal pre-filled with the full payment amount and a default reason ("Client requested cancellation and settlement refund."), both editable, then `POST /payments/:id/refund`. No partial-refund guardrails or approval workflow (e.g. requiring decorator sign-off) are visible in the frontend — it's a direct admin action.

## 9. Reviews & moderation

**Files:** `features/services/ServiceDetails.page.jsx:379-497` (display), `features/admin/ManageReviews.page.jsx` (moderation)

- Reviews are tied to a specific **service** (`GET /reviews/service/:serviceId`), carry a `rating`, `comment`, optional `images[]` (setup photos), and optionally an `agentName` ("Lead Specialist" attribution) and a `vendorReply` (the decorator agency can post one official reply per review).
- Reviews have a moderation `status`: **`published`** (default), **`hidden`**, **`flagged`**, **`archived`** — admin changes this via `PATCH /reviews/:id/status` (`ManageReviews.page.jsx:78-97`), with the admin table showing live counts per status.
- The aggregate rating and a `ratingDistribution` (count per 1-5 star bucket) are fetched alongside the review list (`ServiceDetails.page.jsx:39-40`), but — per the ESLint findings in `03-Frontend-Issues-And-Solutions.md` §11 — `ratingDistribution` is fetched and stored but **never rendered anywhere**, so the per-star breakdown data exists and is paid for (an API call) but delivers no user-visible value today.

## 10. Super Admin — a hardcoded protected account

**File:** `features/admin/ManageUser.page.jsx:181, 261, 552-556, 589, 622, 904`

One specific email, `admin.styledecor1@gmail.com`, is hardcoded as a "Super Admin" throughout `ManageUser.page.jsx`: their role cannot be changed via the quick-role dropdown, they cannot be deleted, and the UI shows a "SUPER ADMIN" badge next to their name. This is a real business rule (protect the platform-owner account from being demoted/deleted by another admin) but implemented as a magic string comparison repeated 5+ times in one file rather than a backend-enforced `isSuperAdmin` flag or a config constant — see `03-Frontend-Issues-And-Solutions.md` for the general pattern of business-critical constants living inline in JSX rather than a shared config module.
