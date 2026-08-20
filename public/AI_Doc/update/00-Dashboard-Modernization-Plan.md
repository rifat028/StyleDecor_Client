# Dashboard Modernization Plan — Charts, Motion, Consistency & Decomposition

**Why this file exists and how it differs from earlier drafts:** an earlier version of this file existed, was reverted by a `git reset --hard` to commit `4c73c42`, and is rebuilt here from a **fresh scan of the current codebase** (not from memory). The project has moved substantially since any prior snapshot: `02-Reusable-Components.md`'s proposed primitives (`Pagination`, `EmptyState`, `StatCard`, `Modal`, `TableSkeleton`, plus two NOT previously documented — `DashboardPageHeader` and `TableActionButton`, and a portal-based `Tooltip`) now exist as real files in `src/components/ui/`, and a decomposition refactor (page → `Toolbar`/`Table`/`Modals` sub-components) is **already underway but incomplete**. This doc's job is to chart what's left, not to re-propose what's already built.

---

## 1. Current adoption state (verified by grep, not assumed)

**Primitives** (`src/components/ui/`, 10 files): `StatCard.jsx`, `EmptyState.jsx`, `Pagination.jsx`, `TableSkeleton.jsx`, `Modal.jsx`, `DashboardPageHeader.jsx`, `TableActionButton.jsx`, `RatingBadge.jsx`, `Tooltip.jsx`, `LogoutModal.jsx`. All are mature, prop-complete components — this is not a "build the primitives" task anymore, it's a "finish the rollout" task.

**Decomposition status by role** (page → dedicated `Toolbar`/`Table`/`Modals` sub-components under `src/components/pages/<Role>/<Feature>/`):

| Role | Decomposed | Still monolithic |
|---|---|---|
| Admin | 9 / 9 (100%) | none |
| Decorator | 3 / 6 — `ManageService`, `MyEarnings`, `MyProjects` | `AgencyProfile` (990 lines), `MyAgents` (827 lines), `AgencyReviews` (524 lines) |
| Customer | 3 / 5 — `MyBookings`, `Transactions`, `MyProfile` | `MyReviews` (520 lines), `PaymentSuccess` (146 lines); `ServiceBooking.page.jsx` (374 lines) is a confirmed-dead unrouted duplicate, not a decomposition target |
| Agent | 0 / 4 | `MySchedule` (543), `AgentProfile` (382), `ActiveExecution` (348), `PerformanceAppraisals` (303) — **all four `src/components/pages/Agent/*/` directories exist but contain only `.gitkeep`, zero real components** |

Every dashboard page uses `DashboardPageHeader` except `AgencyProfile.page.jsx` and `PaymentSuccess.page.jsx`. The 4 monolithic-but-not-fully-unmigrated pages (`MySchedule`, `AgencyReviews`, `MyAgents`, `MyReviews`) already import `TableActionButton` directly for their action columns — they're mid-migration, not untouched.

**Radius consistency correlates with decomposition status, not role.** Decomposed pages have pushed radius choice into their sub-components (which favor `rounded-2xl`, 43 vs 8 occurrences of `rounded-3xl` in the Admin sub-component tree). The 7 still-monolithic pages (all 4 Agent + `AgencyProfile`/`AgencyReviews`/`MyAgents` in Decorator) each hand-mix `rounded-2xl` and `rounded-3xl` within the same file. **Fixing decomposition fixes radius consistency as a side effect** — this is the single highest-leverage remaining move.

---

## 2. Priority 1 — Decompose the Agent dashboard (currently 0%)

This is the largest gap in the codebase. All 4 Agent pages are monolithic, none use `StatCard`/`EmptyState`/`Modal`/`Pagination`/`TableSkeleton` (only `MySchedule.page.jsx` imports `TableActionButton`), and the `src/components/pages/Agent/*/` scaffolding already exists — someone planned this decomposition and never executed it.

For each of `MySchedule` (543 lines), `AgentProfile` (382), `ActiveExecution` (348), `PerformanceAppraisals` (303): follow the exact pattern already proven in `src/components/pages/Decorator/MyEarnings/` (3 files: `MyEarningsToolbar.jsx`, `MyEarningsTable.jsx`, `MyEarningsReceiptModal.jsx`) and `src/components/pages/Admin/*` (Toolbar owns `StatCard` grid, Table owns `TableSkeleton`/`EmptyState`/`Pagination`/`TableActionButton`, Modals owns `Modal`-wrapped dialogs). Populate the existing `.gitkeep` directories rather than creating new ones.

## 3. Priority 2 — Decompose the remaining Decorator and Customer pages

`AgencyProfile.page.jsx` (990 lines, largest file in the dashboard) and `MyAgents.page.jsx` (827 lines) into their already-scaffolded `.gitkeep` directories. `AgencyReviews.page.jsx` (524 lines), `MyReviews.page.jsx` (520 lines), `PaymentSuccess.page.jsx` (146 lines, likely a single small component rather than a full Toolbar/Table/Modals split given its size and single-purpose nature) follow the same pattern. Delete `src/features/customer/ServiceBooking.page.jsx` per `03-Frontend-Issues-And-Solutions.md` §2 rather than decomposing it — it's dead and unrouted.

## 4. Priority 3 — Charts on MyEarnings and PerformanceAppraisals (still zero coverage)

Confirmed via fresh `recharts` grep: **only 2 files in the entire codebase use recharts**, both in `src/components/pages/Admin/Analytics/` (`RevenueChartCard.jsx`, `BookingsDistributionCard.jsx`). `decorator-dashboard/MyEarnings.page.jsx` and its 3 sub-components, and `agent-dashboard/PerformanceAppraisals.page.jsx`, have zero charts and zero SVG/canvas substitutes — metrics are `StatCard` tiles only. Add a monthly revenue/commission trend (`BarChart`, mirroring `RevenueChartCard.jsx`'s structure) to a new `EarningsTrendChart.jsx` under `src/components/pages/Decorator/MyEarnings/`, and a monthly average-rating trend (`LineChart`) to a new `AppraisalTrendChart.jsx` under `src/components/pages/Agent/PerformanceAppraisals/` (create this once Priority 1 populates that directory). Source chart colors from the existing hex values in `BookingsDistributionCard.jsx` rather than re-typing them — no color-token layer currently exists in `src/app/index.css`, so introduce `--color-chart-1..6` there if adding a second chart consumer makes shared tokens worth it.

**Out of scope, flag only**: `src/components/pages/Admin/Analytics/RegionalPerformanceTable.jsx` is a plain table, not a chart, despite living in the Analytics folder — verify whether it's wired to live data or still a placeholder before treating it as "done."

## 5. Priority 4 — Motion (still zero coverage in the dashboard)

Fresh grep confirms `framer-motion` (installed, v12.23.26) is used in exactly **one file in the entire `src/` tree**: `src/features/home/components/Banner.jsx` (public homepage). Zero usage anywhere in `src/features/admin`, `agent-dashboard`, `decorator-dashboard`, `customer`, `profile`, or any `src/components/pages/**` sub-component. Apply shell-first: route-transition fade on `DashboardLayout.jsx`'s `<Outlet />` (cascades to all 24 dashboard pages), then `StatCard` hover/count-up (cascades to every page using it once Priorities 1-3 land), then table-row stagger-in per page as each is decomposed.

## 6. Priority 5 — Typography (confirmed complete absence, not partial)

`index.html` has zero font `<link>` tags. `src/app/index.css`'s `@theme` block has zero `--font-*` tokens — only animation keyframes. There is no typography system to migrate from; this is a from-scratch addition. Recommend a display/body pairing (e.g. `Fraunces` for headings, `Plus Jakarta Sans` for body/tables) self-hosted via `@fontsource-variable/*` packages, wired as `--font-display`/`--font-sans` tokens in the same `@theme` block. Note: `index.html`'s favicon `<link>` also has an empty `href` (`01-UI-UX-Issues.md` §13, still unfixed) — worth bundling into the same pass since both are `index.html`/`<head>` edits.

## 7. Notification library — no single fix needed, pattern already intentional-looking

Fresh grep shows the Swal/toast split is **not** a simple inconsistency to unify — it correlates with decomposition timing. Admin uses both deliberately (toast for status feedback, Swal for destructy-confirm, on 7 of 9 pages). Agent uses Swal-only across all 3 mutating pages (`ActiveExecution`, `AgentProfile`, `MySchedule`), zero toast — internally consistent, no fix needed there. Decorator/Customer's decomposed pages (`ManageService`, `MyEarnings`, `MyProjects`, `Transactions`) use both; their monolithic siblings use Swal-only. **Recommendation: don't force a library migration.** Apply the same intent-based rule already validated earlier — process-completion feedback → toast, destructive-confirm → Swal or `Modal`-based confirm — as each page is decomposed per Priorities 1-2, not as a standalone pass.

## 8. Business-logic items surfaced during this scan (flag to product/backend, not a frontend-only fix)

- **Deposit mismatch confirmed still present**: `ServiceBooking.page.jsx:107-109` quotes `depositRequiredPercent` (defaults 25%); `MyBookings.page.jsx:417-423` charges a hardcoded `0.4` (40%) at payment time. **New finding this scan**: the code now carries a comment — `// Note: 40% advance deposit rate used per checkout business flow` — meaning someone has since looked at this line and annotated it as intentional. This doesn't resolve the customer-facing inconsistency (quoted 25%, charged 40%); it just means the discrepancy may now be a deliberate business decision rather than an oversight. Confirm with whoever owns pricing before treating this as a bug to fix.
- **Dual status machine confirmed still present, values updated**: `MyProjects.page.jsx`'s `STATUS_STEPS` (10 values, `rejected` now last in the array rather than inline after `accepted`) and `ActiveExecution.page.jsx`'s `STAGES` (4 values, unchanged) remain two separate, unreconciled state concepts for the same booking.

## 9. Performance signals (unchanged from prior findings, re-confirmed)

Zero `React.memo` usage anywhere in dashboard code. Zero `lazy()` usage across all 5 route files. No virtualization library installed. Fresh `npx vite build`: single JS chunk now **1,793.39 kB / 462.66 kB gzip** (grown slightly from a prior 1,771.51 kB / 451.64 kB — expected, given new code). Same multi-MB unoptimized images, same `@property --radialprogress` Lightning CSS warning. **New observation**: `react-tooltip` is in `package.json` dependencies alongside the hand-built `ui/Tooltip.jsx` — worth checking whether `react-tooltip` is actually used anywhere or is a leftover unused dependency, since the codebase clearly built its own tooltip component instead.

---

## Sequencing

| Priority | Scope | Depends on |
|---|---|---|
| 1 | Decompose all 4 Agent pages into existing `.gitkeep` scaffolds | none — pattern already proven in Decorator/Admin |
| 2 | Decompose `AgencyProfile`, `MyAgents`, `AgencyReviews`, `MyReviews`, `PaymentSuccess`; delete dead `ServiceBooking.page.jsx` | none, parallel to Priority 1 |
| 3 | Charts on MyEarnings + PerformanceAppraisals | Priority 1 (for PerformanceAppraisals' sub-component directory) |
| 4 | Motion, shell-first then StatCard then per-page | Priorities 1-2 (for max cascade once pages use StatCard) |
| 5 | Typography tokens + favicon fix | none, can run anytime |

This file supersedes any earlier draft under this path. Per-page prompts in `../<page>.md` (e.g. `../30-MyEarnings.md`) should be re-verified against current line counts/sub-component paths before being trusted, since several referenced files have been renamed or resized since those prompts may have last been written.
