# Manage Bookings (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-bookings`
**File(s) in scope:** `src/features/admin/ManageBookings.page.jsx`. Cross-referenced: `src/features/customer/MyBookings.page.jsx` (byte-for-byte duplicated status-badge logic — see finding #1), `src/features/admin/ManageUser.page.jsx`/`ManageAgents.page.jsx` (reference implementations for single-request stats — see finding #2).
**Related audit references:**
- `04-Business-Logic.md` §5 — this page's own subtitle ("Bookings Supervision (Read-Only)... Booking modifications, agent assignments, and progress updates are managed directly by the providing decorator agencies") is quoted verbatim in the business logic doc, confirming this file is intentionally view-only. Verified accurate: the only row action is "View Dossier" (line 528-535), no mutation endpoints are called anywhere in this file.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`renderStatusBadge` is byte-for-byte identical to the same function in `src/features/customer/MyBookings.page.jsx`.** Comparing lines 158-233 here against lines 392-467 in `MyBookings.page.jsx`: same case statements, same class strings, same icon imports, same 9-hue palette (including the same out-of-canon `cyan`/`orange`/`blue` usage already flagged in `14-MyBookings.md` finding #3). This is literal, exact duplication between the customer-facing and admin-facing booking pages — a shared `renderBookingStatusBadge(status)` component/util should be extracted and used by both files, fixing the color-palette issue in exactly one place instead of two. — **Moderate** (duplication + inherited color issue).
2. **`loadStats` fires 5 separate API requests — the most of any admin page reviewed.** Lines 111-117: `Promise.all([...5 separate axiosSecure.get calls with limit=1...])` for total/accepted/in_progress/completed/pending counts. This is the same systemic pattern already flagged in `18-ManageServices.md` and `21-ManageDecorator.md`, here at its worst (5 requests instead of 4). `ManageUser.page.jsx` and `ManageAgents.page.jsx` both prove a single-endpoint pattern (`GET /users/stats`, `GET /agents/stats`) is available on this backend. — **Moderate**, now with strong 3-file evidence that this should be fixed as one backend addition (a `GET /bookings/stats` endpoint) covering all affected pages.

3. **File is 756 lines; the table row and View Dossier modal are the two largest blocks once the status-badge duplication (finding #1) is resolved.** Concrete split points: the table row (lines ~437-538) → a local `<BookingTableRow>`; the View Dossier modal body (lines ~626-738, once wrapped in the shared `<Modal>` shell) → `src/features/admin/components/ManageBookingsViewModal.jsx`. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies — finding #1 (status badge, shared with `MyBookings.page.jsx`). The View Dossier modal (lines 607-751) is another hand-rolled instance for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Component decomposition / file size:** Applies — 756 lines; see finding #3 for concrete split points (table row, View Dossier modal).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 400-403) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — finding #1's inherited 9-hue badge issue. The page's own chrome (buttons, focus rings) correctly uses `purple-600` throughout — no separate primary-color drift here, only the shared badge component's palette needs fixing.
- **Design consistency:** N/A. Pagination uses the "Page X of Y" text-only format, same gap as `ManageServices.page.jsx`/`ManageDecorator.page.jsx` — fix together when `<Pagination>` is built.
- **Correctness:** N/A — the read-only nature of this page is correctly and consistently enforced (no mutation UI exists anywhere), matching the documented business rule exactly.
- **Improvement opportunity:** None beyond the stats-endpoint efficiency win (finding #2).
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageBookings.page.jsx`:

**1. Reusable extraction (coordinate with `14-MyBookings.md` — fix the color issue once, use in both):**
- Extract `renderStatusBadge` into a shared `<BookingStatusBadge status={...} />` component (e.g. `src/components/ui/BookingStatusBadge.jsx`), reducing the hue palette to stay within `00-Color-System.md`'s canonical set (replace `cyan`/`orange`/`blue` per the recommendation in `14-MyBookings.md` finding #3), and use it here and in `MyBookings.page.jsx` instead of each file having its own copy. If `MyBookings.page.jsx` has already been processed and the component already exists, just import and use it here — don't duplicate the fix.

**2. Efficiency fix:**
- Replace the 5-request `loadStats` (lines 109-129) with a single call to a bookings-stats endpoint (e.g. `GET /bookings/stats`), matching the pattern already proven by `ManageUser.page.jsx`/`ManageAgents.page.jsx`. This is now the third admin page needing this exact fix (alongside `ManageServices.page.jsx`, `ManageDecorator.page.jsx`) — worth requesting as one backend addition covering all three.

**3. Reusable component extraction (coordinate with other admin pages, build once):**
- Build the shared `<Modal>` shell and migrate the View Dossier modal (lines 607-751) onto it.
- Build `<Pagination>` and replace the text-only pagination footer.

**4. Component decomposition:**
- Extract the table row into a local `<BookingTableRow>` and the View Dossier modal content into `src/features/admin/components/ManageBookingsViewModal.jsx`.

Preserve the page's read-only nature and all existing filtering/search/sort logic — none of the above requires restructuring the page's data flow.

## Verification Checklist

- [ ] Status badges render identically (visually) after extraction into the shared component, in both this page and `MyBookings.page.jsx`.
- [ ] Stats tiles load from a single request instead of 5.
- [ ] No mutation UI has been accidentally introduced — this page remains view-only per its documented business rule.
- [ ] Page renders identically after extracting the table row and view modal into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
