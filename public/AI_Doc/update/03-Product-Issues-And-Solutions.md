# Overall Product Issues & Solutions

Scope: product-level gaps — business logic, missing enforcement, feature completeness. Rebuilt from a fresh scan after a prior version of this doc was lost to `git reset --hard`. Severity: 🔴 Critical (money, access-control, trust) · 🟡 Moderate · 🟢 Low.

---

## 1. 🔴 Deposit quoted (25% default) vs. charged (hardcoded 40%) — still present, now with a clarifying code comment

**Files:** `src/features/services/ServiceBooking.page.jsx:107-109` quotes the deposit using `service.pricing?.depositRequiredPercent || 25`, shown to the customer at checkout as "Advance Deposit ({depositPercent}%)". `src/features/customer/MyBookings.page.jsx:417-423` charges a hardcoded `Math.round(grandTotal * 0.4)` (40%) at actual payment time regardless of what was quoted.

**What changed since the last scan:** the line now carries a comment — `// Note: 40% advance deposit rate used per checkout business flow` — meaning a developer has since reviewed this exact code and annotated the 40% as intentional. This is new context, not a resolution: the customer-facing inconsistency (quoted 25%, charged 40%) is unchanged. The comment suggests one of two things — either this is now confirmed deliberate business logic (in which case the *quote* at booking time is the wrong number and should also say 40%), or the comment reflects a developer's guess/rationalization without actually fixing the mismatch. Either way, a customer today still sees one number at booking and a different one at payment.

**Fix:** resolve which number is correct with whoever owns pricing, then make both `ServiceBooking.page.jsx` and `MyBookings.page.jsx` read the same source (ideally a backend-supplied deposit amount on the booking record) rather than two independently hardcoded/defaulted percentages.

---

## 2. 🔴 Two parallel, unreconciled status machines for the same booking — still present, values re-confirmed

**Files:** `src/features/decorator-dashboard/MyProjects.page.jsx:16-27`, `STATUS_STEPS` (10 values: `in_draft, pending, accepted, advance_paid, preparing, on_the_way, in_progress, completed, fully_paid, rejected` — note `rejected` is now positioned last in the array, a minor reordering since any prior snapshot, not a semantic change). `src/features/agent-dashboard/ActiveExecution.page.jsx:26-31`, `STAGES` (4 execution-only values: `preparing, on_the_way, in_progress, completed`), updated via a separate endpoint from the decorator's status field.

Nothing in the frontend reconciles these two concepts for the same booking.

**Fix:** unchanged from prior recommendation — surface both values together wherever a booking's progress is shown to a decorator or admin, and treat the actual reconciliation as a backend/data-model decision outside frontend scope.

---

## 3. 🟡 Agent dashboard's incomplete build-out is itself a product risk, not just a code-quality one

**New finding this scan:** the Agent role — the one responsible for real-time, on-site execution during live events — has 0% of its dashboard decomposed/componentized (`02-Dashboard-Code-Quality-Issues-And-Solutions.md` §1) and, per the UI doc, no data visualization, no motion, the most internally inconsistent radius usage of any role. For a role whose job is literally "execute the physical setup on the day of the event," a dashboard that's furthest behind in polish and structure is a weaker tool for the highest-stakes, most time-pressured role in the product. This isn't purely cosmetic — `MySchedule.page.jsx` and `ActiveExecution.page.jsx` are what a field specialist is looking at, possibly on a phone, while physically at a venue.

**Fix:** treat Agent-dashboard decomposition (already planned per the scaffolded-but-empty directories) as a product priority, not just a tech-debt item, given the operational context it serves.

---

## 4. 🟡 `react-tooltip` dependency alongside a hand-built Tooltip component — possible dead weight or duplicate system

**Evidence:** `package.json` includes `react-tooltip` as a dependency. The codebase separately built its own `src/components/ui/Tooltip.jsx` — a materially more sophisticated implementation (portal-rendered, viewport-edge auto-flip, scroll/resize repositioning, hover+focus activation) than a typical off-the-shelf tooltip, and it's the one actually wired into `TableActionButton.jsx` throughout the dashboard. Whether `react-tooltip` itself is still used anywhere (e.g. a public page) wasn't independently confirmed in this pass.

**Fix:** grep the full `src/` tree for `react-tooltip` usage. If unused, remove it — it's shipped bundle weight for a library the team already replaced with better in-house work. If used elsewhere, that's a smaller but real inconsistency worth resolving on its own.

---

## 5. 🟢 Regional performance data — status not re-verified this pass

**Note:** an earlier finding flagged `RegionalPerformanceTable.jsx` in Admin's Analytics area as rendering hardcoded mock data rather than live figures. This pass confirmed the file exists and is a plain HTML table (not a chart, despite living in the Analytics folder) but did **not** re-verify whether it's still backed by mock data or has since been wired to a real endpoint — flagging as unconfirmed rather than re-asserting the earlier claim without evidence.

**Fix:** read `src/components/pages/Admin/Analytics/RegionalPerformanceTable.jsx` directly to confirm current data source before treating this as still-open.

---

## Summary table

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | Deposit quoted (25%) ≠ charged (40%) | 🔴 | Still present; new code comment suggests 40% may now be "intentional" — needs a product decision either way |
| 2 | Decorator `status` / Agent `stage` unreconciled | 🔴 | Still present, values re-confirmed |
| 3 | Agent dashboard is furthest behind despite highest operational stakes | 🟡 | New framing — treat decomposition as product priority |
| 4 | Possible unused `react-tooltip` dependency | 🟡 | Needs a grep to confirm before acting |
| 5 | RegionalPerformanceTable data source | 🟢 | Unconfirmed this pass — re-check before citing as still-mock |
