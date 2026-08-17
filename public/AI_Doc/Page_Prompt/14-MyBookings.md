# My Bookings — Improvement Prompt

**Route(s):** `/dashboard/my-bookings`
**File(s) in scope:** `src/features/customer/MyBookings.page.jsx`. Cross-referenced: `src/features/home/components/Spinner.jsx` (shared, not modified here).
**Related audit references:**
- `04-Business-Logic.md` §6 — the confirmed 25%-quoted-vs-40%-charged deposit inconsistency. This file (`handleProcessPayment`, the Pay Modal UI) is the exact site of the **40% hardcoded** side of that inconsistency — confirmed present here at lines 303, 1167-1169, 1242.
- `02-Reusable-Components.md` §2 (ConfirmDialog/SweetAlert2 pattern), §6 (Modal shell — this file has **4** hand-rolled modals, the highest count of any single file reviewed so far), §9 (formatCurrency).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **The "Rate & Review" button has no status gating at all, despite a comment saying it should.** Line 771: `{/* Rate & Review Button (if confirmed, advance paid, or completed) */}` — but the actual `<button>` on the very next line has **no conditional wrapper**, unlike the Pay button immediately above it which correctly checks `b.paymentStatus !== "paid" && b.status !== "rejected" && b.status !== "fully_paid"` (line 743). A customer can open the review modal and submit a rating/review for a booking that's still `pending` or was `rejected`, before any service was ever rendered. The comment describes the intended gating logic; the code never implements it. — **Critical**.
2. **Deposit percentage: confirmed 40%-hardcoded, contradicting the 25%-default quoted at booking time.** Lines 303 (`Math.round(grandTotal * 0.40)`), 1167-1169 (UI label "40% Advance Deposit"), 1242 (submit button amount). Per `04-Business-Logic.md` §6, `ServiceBooking.page.jsx` and `ServiceDetails.page.jsx` both quote the deposit using `pricing.depositRequiredPercent` (commonly 25%) — a customer quoted "25% deposit" at booking time is charged 40% here. This is a known, documented, business-critical inconsistency; this file is where the 40% side lives. — **Critical** (already on record in `04-Business-Logic.md`, re-confirmed with exact current line numbers).
3. **Status badges use 9 different hues for 9 statuses, 3 of which fall outside the canonical palette.** `renderStatusBadge` (lines 392-467) uses: `slate` (draft), `amber` (pending), `indigo` (accepted), `rose` (rejected), **`cyan`** (advance_paid), `purple` (preparing), **`orange`** (on_the_way), **`blue`** (in_progress), `emerald` (completed/fully_paid). Per `00-Color-System.md`, `cyan` and `orange` are deprecated/undefined hues, and `blue` is reserved for info-only use, not a lifecycle stage. Nine hues for what's fundamentally a linear progression is also hard to scan at a glance. — **Moderate**.
4. **No pagination — the entire bookings list renders unpaginated**, unlike every admin table and the public listing pages, all of which converge on `<Pagination>` (`02-Reusable-Components.md` §1). For a customer with a long booking history this will eventually become a very tall, all-at-once table. — **Polish** (low urgency for a customer's own bookings, likely a small list in practice, but worth noting for consistency).
5. **Edit action isn't gated by booking status.** `handleOpenEdit` (line 196) can be triggered on any booking regardless of `status` — a customer can open the edit form and change the event date/venue on a `completed` or `in_progress` booking, which shouldn't logically be editable at that point. — **Moderate**.
6. **File is 1380 lines — the largest page file in the entire app — with 4 modals accounting for roughly 580 lines combined.** Concrete split points: `src/features/customer/components/MyBookingsViewModal.jsx` (lines ~800-956), `EditBookingModal.jsx` (lines ~958-1114), `PayModal.jsx` (lines ~1117-1248, including the payment-method/type selector grid), `ReviewModal.jsx` (lines ~1251-1375, including the star picker and quick-feedback-chip UI); the table row (lines ~677-792) → a local `<BookingTableRow>`. This is the single highest-value component-decomposition target found anywhere in this review, both in raw line count and in how directly it overlaps with the Modal-shell migration already planned in finding "Reusable components" above — doing both together (shared `<Modal>` wrapper + page-specific content extracted to its own file per modal) is more efficient than doing either alone. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies heavily — this file has **4** independently hand-rolled modals (View Dossier, Edit, Pay, Review — lines 800-956, 958-1114, 1117-1248, 1251-1375), all sharing the same backdrop/header/close-button boilerplate without `createPortal`, Escape-to-close, or focus trap, matching `02-Reusable-Components.md` §6 exactly. This is the single best candidate file in the app to build the shared `<Modal>` shell against, given the volume of duplication within one file. Also: `৳{Number(...).toLocaleString()}` is hand-typed repeatedly throughout (lines 674, 726, 928, 934, 940, 1145, 1147, 1169, 1184-1187, etc.) — use the shared `formatCurrency` util (§9) if built, or build it here.
- **Component decomposition / file size:** Applies — 1380 lines, the largest page file in the app; see finding #6 for concrete split points (all 4 modals, table row).
- **Skeleton/spinner loader:** Applies, minor — the table's loading state (lines 622-625) uses the shared `<Spinner />`, which forces `h-screen` regardless of its `p-20` wrapper; same shared-component-misuse pattern flagged on several other pages. Consider a table-row skeleton instead.
- **Tooltip:** N/A — action icon buttons already have `title` attributes.
- **Responsiveness:** The data table itself has `overflow-x-auto` (line 643) so it scrolls correctly on mobile; no issues found.
- **Color consistency:** Applies — finding #3.
- **Design consistency:** N/A beyond the status-badge color issue.
- **Correctness:** Applies — findings #1, #2, #5.
- **Improvement opportunity:** None beyond what's covered by the reusable-component and correctness fixes above.
- **Coding standard:** N/A.
- **Comments:** Applies — finding #1's comment should either be deleted (if the gating is intentionally not implemented) or the code should be made to match it. Don't leave a comment describing behavior that isn't there.
- **Accessibility:** N/A beyond the modal focus-trap gap already covered under Reusable Components.

## Implementation Prompt

Apply these changes to `src/features/customer/MyBookings.page.jsx`:

**1. Correctness fixes (do first, highest value):**
- Wire up the Rate & Review button's gating (finding #1): wrap it in a condition matching the comment's stated intent — e.g. `["accepted", "advance_paid", "preparing", "on_the_way", "in_progress", "completed", "fully_paid"].includes(String(b.status).toLowerCase())` (confirm the exact eligible-status list with whoever owns the booking lifecycle, per `04-Business-Logic.md` §5, before finalizing).
- Flag the 25%-vs-40% deposit inconsistency (finding #2) explicitly rather than silently fixing it — this is a cross-file business decision (also involves `ServiceBooking.page.jsx`/`ServiceDetails.page.jsx`), not something to resolve unilaterally in this page's pass. At minimum, add a comment at line 303 noting the discrepancy and citing `04-Business-Logic.md` §6, and raise it for a product decision on which percentage is authoritative.
- Gate the Edit action (finding #5) to only allow editing bookings in early-lifecycle statuses (e.g. `pending`, `accepted` — not `completed`, `in_progress`, or later) — confirm the exact cutoff with the booking lifecycle owner.

**2. Color consistency:**
- Reduce `renderStatusBadge`'s hue palette to stay within `00-Color-System.md`'s canonical set: replace `cyan` (advance_paid) and `orange` (on_the_way) with defined roles (e.g. both could reasonably use `amber` or `purple` variants to signal "in transit/in progress before completion"), and replace `blue` (in_progress) with a role consistent with the lifecycle stage rather than the reserved info color.

**3. Reusable component extraction:**
- Build the shared `<Modal>` component (per `02-Reusable-Components.md` §6: portal rendering, Escape-to-close, backdrop-click-to-close, focus trap) and migrate all 4 modals in this file onto it.
- Build/reuse `formatCurrency` from `src/lib/format.js` (per §9) and replace all hand-typed `৳{Number(...).toLocaleString()}` instances in this file.

**4. Component decomposition:**
- Extract each of the 4 modals' content into its own file in `src/features/customer/components/`: `MyBookingsViewModal.jsx`, `EditBookingModal.jsx`, `PayModal.jsx`, `ReviewModal.jsx`. Do this alongside the shared `<Modal>` shell migration above — each extracted file becomes the `children` passed to `<Modal>`. Extract the table row into a local `<BookingTableRow>`.

Preserve all existing booking-management logic (edit, cancel, pay, review submission) — none of the above requires restructuring the page beyond the modal-shell migration.

## Verification Checklist

- [ ] Reviewing is only possible for bookings in an appropriate lifecycle stage, not `pending`/`rejected`.
- [ ] Editing is disabled or hidden for bookings that are `completed`/`in_progress` or later.
- [ ] All 4 modals close on Escape and on backdrop click, and trap focus while open.
- [ ] Page renders and behaves identically after extracting all 4 modals and the table row into local sub-components.
- [ ] Status badges use a reduced, canonical color set.
- [ ] Table loading state doesn't force a full-viewport-height spinner inside the table container.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
