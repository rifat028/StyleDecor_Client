# Dashboard UI Issues & Solutions

Scope: the 24 routed dashboard pages (`/dashboard/*`) across Admin/Agent/Decorator/Customer roles — not the public site, covered by `../01-UI-UX-Issues.md`/`../06-UI-Upgrade-Guide.md`. Rebuilt from a fresh codebase scan (an earlier version of this doc existed and was lost to a `git reset --hard`) — findings below reflect current code, not a prior snapshot. Severity: 🔴 High · 🟡 Medium · 🟢 Low.

---

## 1. 🔴 Zero data visualization outside Admin Analytics

**Files:** confirmed via grep — `recharts` is used in exactly 2 files, both `src/components/pages/Admin/Analytics/{RevenueChartCard,BookingsDistributionCard}.jsx`. `decorator-dashboard/MyEarnings.page.jsx` (and its 3 sub-components) and `agent-dashboard/PerformanceAppraisals.page.jsx` — the two other clearest "trend/performance" pages in the app — have zero charts and zero SVG/canvas substitute. Metrics render as `StatCard` tiles only.

**Fix:** add a monthly revenue/commission `BarChart` to MyEarnings and a monthly rating-trend `LineChart` to PerformanceAppraisals, per `../Page_Prompt/update/00-Dashboard-Modernization-Plan.md` §4.

---

## 2. 🔴 Agent dashboard has zero shared-primitive/decomposition adoption

**Files:** all 4 Agent pages (`MySchedule.page.jsx` 543 lines, `AgentProfile.page.jsx` 382, `ActiveExecution.page.jsx` 348, `PerformanceAppraisals.page.jsx` 303) are monolithic. `src/components/pages/Agent/{ActiveExecution,AgentProfile,MySchedule,PerformanceAppraisals}/` directories exist but contain **only `.gitkeep`** — scaffolded, never populated. Only `MySchedule.page.jsx` imports any shared primitive at all (`TableActionButton`, for its action column).

This is escalated from 🟡 to 🔴 relative to other roles because it's not partial drift, it's total absence — every other role has at least started (Admin 100%, Decorator 50%, Customer 60%). Agent-role UI is measurably the least consistent, least componentized surface in the dashboard.

**Fix:** decompose all 4 pages into their existing scaffolds using the pattern already proven in `Decorator/MyEarnings/` and every Admin area — Toolbar (StatCard grid) / Table (TableSkeleton, EmptyState, Pagination, TableActionButton) / Modals (Modal-wrapped dialogs). Detail in modernization plan §2.

---

## 3. 🟡 Card radius inconsistency — now correlated with decomposition status, not role

**Evidence (fresh grep counts):** Admin `.page.jsx` files have **zero** radius classes directly (pushed into sub-components, which favor `rounded-2xl` 43:8 over `rounded-3xl`). The 7 still-monolithic pages (all 4 Agent + Decorator's `AgencyProfile`/`AgencyReviews`/`MyAgents`) each hand-mix `rounded-2xl` and `rounded-3xl` in the same file — e.g. `ActiveExecution.page.jsx` has exactly 5 of each. Decomposed Decorator/Customer pages (`ManageService`, `MyEarnings`, `MyProjects`, `MyBookings`, `Transactions`, `MyProfile`) have zero radius classes at the page level, same pattern as Admin.

This reframes the earlier "Admin vs. everyone else" finding: the real driver is decomposition, not role identity. A page that's been split into sub-components has, as a side effect, consolidated its radius choice.

**Fix:** no separate radius-fixing pass needed — decomposing the remaining 7 monolithic pages (item #2 + modernization plan §3) resolves this as a byproduct. Only if a page is decomposed but its sub-components still mix radii should this be treated as a standalone finding.

---

## 4. 🟡 Two of the largest files in the dashboard have no header component

**Files:** `decorator-dashboard/AgencyProfile.page.jsx` (990 lines, the single largest dashboard file) and `customer/PaymentSuccess.page.jsx` (146 lines) are the only 2 of 24 dashboard pages that don't use `DashboardPageHeader` — every other page has adopted it. `AgencyProfile` hand-rolls its own hero/cover-photo header treatment (which is arguably a deliberate design choice, not an oversight, given it's a profile page with a cover image — `DashboardPageHeader` may not be the right fit there). `PaymentSuccess` is a receipt/confirmation page, also plausibly a deliberate exception.

**Fix:** not a blanket "add DashboardPageHeader everywhere" fix — verify per-page whether the omission is intentional (profile hero banners and receipt pages have different information needs than a list page's title+subtitle+refresh header) before treating as a gap. Flagged for a design decision, not an automatic change.

---

## 5. 🟡 No custom typography — confirmed complete absence

**Files:** `index.html` has zero font `<link>` tags. `src/app/index.css`'s `@theme` block has zero `--font-*` tokens (only animation keyframes). This isn't inconsistent typography, it's the total absence of a chosen typeface — the app renders in each browser's default system-font stack throughout, dashboard and public site alike.

**Fix:** self-hosted display/body font pairing wired into `@theme`, per modernization plan §6. Bundle with the also-broken empty-`href` favicon (`../01-UI-UX-Issues.md` §13) since both are `index.html`/`<head>` edits.

---

## 6. 🟡 No motion anywhere in the dashboard — confirmed still zero

**Evidence:** `framer-motion` (installed, v12) is used in exactly 1 file in the entire `src/` tree — the public homepage's `Banner.jsx`. Zero usage in any dashboard feature file or sub-component.

**Fix:** shell-first route transitions, then StatCard hover/count-up, then table-row entrance — per modernization plan §5.

---

## 7. 🟢 `Modal.jsx` has no focus trap; `LogoutModal.jsx` has no Escape/backdrop-close at all

**Files:** `src/components/ui/Modal.jsx` implements Escape-to-close and backdrop-click-to-close via `useEffect`/`stopPropagation`, but does not implement a focus trap — keyboard users can still Tab out of an open modal into the page behind it. `src/components/ui/LogoutModal.jsx` is older and has neither Escape-key handling nor backdrop-click-to-close, unlike the newer shared `Modal`.

**Fix:** add a focus trap to `Modal.jsx` (small custom hook or a library like `focus-trap-react`) — this fixes every current and future modal built on it at once. Separately, migrate `LogoutModal.jsx`'s dismiss behavior to match `Modal.jsx`'s conventions, or replace it with `Modal` directly if its fixed copy ("Sign Out" / confirm text) can be expressed via `Modal`'s `title`/`children` props.

---

## 8. 🟢 `react-tooltip` dependency alongside a hand-built `Tooltip.jsx`

**Evidence:** `package.json` lists `react-tooltip` as a dependency, but the codebase has its own portal-based `src/components/ui/Tooltip.jsx` (viewport-aware positioning, hover+focus activation, used throughout `TableActionButton.jsx`). Not independently verified whether `react-tooltip` is used anywhere else in the app (e.g. public pages) — if it's unused, it's dead dependency weight; if it's used elsewhere, it's two tooltip systems coexisting.

**Fix:** grep the full `src/` tree for `react-tooltip` imports. If zero hits, remove it from `package.json`. If used elsewhere, evaluate consolidating onto the hand-built `Tooltip.jsx` for consistency — out of scope to resolve without that grep first.

---

## Summary table

| # | Issue | Severity | Primary fix location |
|---|---|---|---|
| 1 | No charts outside Analytics (MyEarnings, PerformanceAppraisals still zero) | 🔴 | Modernization plan §4 |
| 2 | Agent dashboard: 0% primitive/decomposition adoption | 🔴 | Modernization plan §2 |
| 3 | Radius inconsistency (now correlates with decomposition, not role) | 🟡 | Resolved as byproduct of #2 + plan §3 |
| 4 | AgencyProfile/PaymentSuccess lack DashboardPageHeader | 🟡 | Design decision — verify intentional before changing |
| 5 | No typography system (confirmed total absence) | 🟡 | Modernization plan §6 |
| 6 | No motion anywhere (confirmed still zero) | 🟡 | Modernization plan §5 |
| 7 | Modal.jsx no focus trap; LogoutModal.jsx no Escape/backdrop-close | 🟢 | `src/components/ui/Modal.jsx`, `LogoutModal.jsx` |
| 8 | Possible unused `react-tooltip` dependency alongside hand-built Tooltip | 🟢 | Verify via grep, remove if unused |
