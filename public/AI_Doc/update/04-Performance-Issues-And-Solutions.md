# Performance Issues & Solutions

Scope: runtime/load-time performance, dashboard-focused. Rebuilt from a fresh scan after a prior version of this doc was lost to `git reset --hard`. Severity: 🔴 Critical · 🟡 Moderate · 🟢 Low.

---

## 1. 🔴 No route-level code splitting — bundle grew since last measurement

**Evidence:** fresh `npx vite build` output: single JS chunk now **1,793.39 kB (462.66 kB gzip)**, up from a previously measured 1,771.51 kB (451.64 kB gzip) — consistent with new code (the decomposition refactor, new primitives) added since. `grep -rn "lazy("` across all 5 route files (`AdminRoutes`, `AgentRoutes`, `DecoratorRoutes`, `PrivateRoutes`, `PublicRoutes`) returns zero matches — still no code splitting anywhere.

**Fix:** unchanged from `../03-Frontend-Issues-And-Solutions.md` §8 — `React.lazy()` per route, one `<Suspense>` boundary at the layout level. The bundle will keep growing as the decomposition refactor adds more sub-component files unless this is addressed; the two are compounding, not independent.

---

## 2. 🟡 Zero memoization anywhere in the dashboard — confirmed unchanged

**Evidence:** `grep -rln "React.memo|memo("` across `src/features` and `src/components/pages` returns zero files. This now applies to a larger surface than before, since the decomposition refactor created 49 new sub-component files (10,638 lines) — none of them memoized, including table-row-rendering components that are the highest-payoff memoization targets.

**Fix:** as each Toolbar/Table/Modals split is completed (Agent dashboard, remaining Decorator/Customer pages), wrap row-level components in `React.memo` at creation time rather than as a retrofit — cheaper to do once during the decomposition than to revisit 49+ files afterward.

---

## 3. 🟢 No virtualization library — still not needed at current scale

**Evidence:** `package.json` has no `react-window`/`react-virtualized`/`tanstack-virtual`. Tables remain bounded by `Pagination.jsx`'s page size. No change from prior finding — still a forward-looking flag, not an active problem.

---

## 4. 🟢 Image weight unchanged, plus 2 new smaller logo assets added

**Evidence:** the previously documented multi-MB images (`img-01` through `img-06`, `dark-logo`/`light-logo`) are unchanged in the fresh build output. Two new, appropriately-sized assets have been added since: `dark-square-logo` (357.96 kB) and `light-square-logo` (378.69 kB) — smaller than the original logo files, suggesting some image-weight awareness has already started, just not yet applied to the older/larger assets.

**Fix:** unchanged from `../03-Frontend-Issues-And-Solutions.md` §9 for the still-unoptimized originals. The 2 new square-logo assets are a reasonable size for their apparent use case (favicon/app-icon scale) — no action needed on those specifically, though 357-378 kB is still large for what's likely a small icon; worth a quick check of their actual render dimensions.

---

## 5. 🟢 Possible unused `react-tooltip` dependency adds to bundle weight

**Cross-reference:** flagged in the product-issues doc §4 and code-quality doc as a possible dead dependency, since the codebase built and uses its own `Tooltip.jsx`. If confirmed unused, removing it is a small, free win alongside whatever bundle-size work happens under item #1.

---

## Summary table

| # | Issue | Severity | Change since last scan |
|---|---|---|---|
| 1 | No code splitting; bundle grew to 1,793 kB / 462.66 kB gzip | 🔴 | Grew slightly; unresolved |
| 2 | Zero `React.memo`, now across a larger surface (49 new sub-component files) | 🟡 | Surface area increased |
| 3 | No virtualization library | 🟢 | Unchanged |
| 4 | Image weight unchanged; 2 new smaller logo assets added | 🟢 | Partial improvement (new assets only) |
| 5 | Possible unused `react-tooltip` dependency | 🟢 | New finding this scan |
