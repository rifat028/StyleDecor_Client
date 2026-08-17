# Analytics (Admin) — Improvement Prompt

**Route(s):** `/dashboard/analytics`
**File(s) in scope:** `src/features/admin/Analytics.page.jsx`.
**Related audit references:**
- `04-Business-Logic.md` §7 (10% platform commission, 88.5% vendor receivable) — confirmed present in the KPI cards, consistent with `ManageTransactions.page.jsx`/`MyEarnings.page.jsx`.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Demand and lifecycle charts are built from a hardcoded 150-booking sample, not "all bookings" as the code implies.** Line 70: `axiosSecure.get("/bookings?limit=150")`, stored in a variable literally named `allBookings` (line 40, 72). Both charts (`demandChartData`, `statusChartData`, lines 89-114) derive their counts by reducing over this array client-side. Once the platform has more than 150 bookings, these charts silently become inaccurate — they'll reflect only the most recent (or however the backend orders an unsorted-by-param query) 150 records, not the true distribution, with no indication anywhere in the UI that the admin is looking at a partial sample. The other stat cards on this same page (`GET /payments/stats`, `GET /reviews?limit=1`) correctly get pre-aggregated counts from the backend instead of fetching raw records to reduce client-side — this file should follow the same pattern for booking-category and status-distribution counts. — **Critical** (silently inaccurate business-intelligence data past a fixed, unannounced threshold).

### Generic checklist

- **Reusable components:** N/A — no duplicated markup patterns found on this page.
- **Skeleton/spinner loader:** Applies, minor — the one loading state (lines 116-122) is an appropriate full-page use of `<Spinner />` (nothing else on screen while all 3 data sources load in parallel).
- **Tooltip:** N/A — chart tooltips are already correctly implemented via Recharts' `<Tooltip>`.
- **Responsiveness:** No issues found — charts use `<ResponsiveContainer>` and the KPI/quality grids collapse correctly.
- **Color consistency:** Applies, minor — several stat-card icons use `indigo-*` (Vendor Payouts icon line 182, Vendor Response Rate line 241/243, Booking Lifecycle Pipeline icon line 301) alongside `purple`/`emerald`/`rose`/`amber` elsewhere. Given this is a KPI dashboard where each card intentionally gets a distinct accent color for quick visual scanning, this reads as deliberate categorical variety rather than primary-color drift (similar judgment call made in `23-ManageTransactions.md` finding #2) — flagging for awareness, not a hard requirement to fix. The `COLORS` array (line 33, raw hex values for the pie chart) is a necessary exception since Recharts requires literal color values, not Tailwind classes.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #1, the clear priority.
- **Improvement opportunity:** None beyond fixing finding #1.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — charts render with standard Recharts accessibility defaults; no interactive-element gaps found elsewhere on the page.

## Implementation Prompt

Apply this change to `src/features/admin/Analytics.page.jsx`:

**1. Correctness fix (do first, highest value):**
- Replace the client-side `fetchAllBookings` + `demandChartData`/`statusChartData` reduction (lines 67-114) with backend-aggregated data: request a `GET /bookings/analytics` (or similar) endpoint returning pre-computed category-demand and status-distribution counts across the **entire** dataset, not a capped sample. If no such endpoint exists yet, flag this as a backend-coordination item rather than raising the `limit` parameter further (any fixed limit reintroduces the same silent-inaccuracy problem at a different threshold — the fix is aggregation, not a bigger cap).

Preserve the existing chart rendering (BarChart/PieChart components, colors, tooltips) and the payment/review KPI cards exactly as-is — only the data source for the two booking-derived charts needs to change.

## Verification Checklist

- [ ] Category-demand and status-distribution charts reflect the full booking dataset, not a capped sample, verified against the total booking count shown elsewhere in the admin dashboard (e.g. `ManageBookings.page.jsx`'s stats).
- [ ] Charts still render correctly with the same visual styling after the data-source change.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
