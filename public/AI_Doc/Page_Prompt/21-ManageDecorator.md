# Manage Decorators (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-decorators`
**File(s) in scope:** `src/features/admin/ManageDecorator.page.jsx`. Cross-referenced: `src/features/admin/ManageAgents.page.jsx` (reference implementation for single-request stats — see finding #1), `src/features/admin/ManageUser.page.jsx` (same reference).
**Related audit references:**
- `04-Business-Logic.md` §3 (decorator status machine: `pending →approve→ active`, `pending →reject→ suspended`, `active →suspend→ suspended`, `suspended →reactivate→ active`) — confirmed implemented exactly as documented in `handleStatusTransition` (lines 152-222).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`fetchStats` fires 4 separate API requests for 4 counts.** Lines 113-118: `Promise.all([...4 separate axiosSecure.get calls with limit=1...])` for all/active/pending/suspended counts. Same inefficiency pattern already flagged in `18-ManageServices.md` finding #1 — and now confirmed as a **recurring, systemic pattern** across at least 3 admin pages (this file, `ManageServices.page.jsx`, and `ManageBookings.page.jsx`, see `22-ManageBookings.md`). `ManageUser.page.jsx` (`GET /users/stats`) and `ManageAgents.page.jsx` (`GET /agents/stats`) both already prove the single-endpoint pattern works and is available on this backend — this file (and its siblings) should be migrated to match. — **Moderate** (real, measurable inefficiency, now with strong cross-file evidence).
2. **One stray `indigo` hover color in an otherwise-clean purple-consistent file.** Line 661: `hover:text-indigo-600` on the "View Full Profile" button, while every other interactive element on this page correctly uses `purple-*`. Small, isolated inconsistency. — **Polish**.
3. **File is 921 lines, mostly driven by the table row markup and the single View Details modal.** Concrete split points: the View Details modal body (lines ~782-878, once wrapped in the shared `<Modal>` shell) → `src/features/admin/components/ManageDecoratorViewModal.jsx`; the table row (lines ~519-677) → a local `<DecoratorTableRow>` component, since it already branches on 3 different status-action buttons (Approve/Suspend/Activate) and is dense enough to read poorly inline. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies, minor — the single View Details modal (lines 747-916) is one more hand-rolled instance for the shared `<Modal>` shell (`02-Reusable-Components.md` §6). `getPlaceholderLogo` (lines 45-48) is yet another duplicate of the same function found in `TopRatedDecorators.jsx` (Home) and `TopDecorators.page.jsx` — now a third instance, strengthening the case for extracting it (per `06-TopDecorators.md` finding #4).
- **Component decomposition / file size:** Applies — 921 lines; see finding #3 for concrete split points (View Details modal, table row).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 488-491) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — finding #2. Otherwise this file is one of the cleaner admin pages, correctly using `purple-600` as primary throughout (a good contrast to `ManageUser.page.jsx`/`ManageCategories.page.jsx`'s indigo drift — worth using as the reference when fixing those).
- **Design consistency:** N/A. Pagination here (lines 685-744) uses the simpler "X / Y" text format without numbered pills — same gap as `ManageServices.page.jsx`, fix together when `<Pagination>` is built.
- **Correctness:** N/A — the 3-state lifecycle transition logic is correctly implemented and matches `04-Business-Logic.md` §3 precisely; no bugs found.
- **Improvement opportunity:** None beyond the stats-endpoint efficiency win (finding #1).
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageDecorator.page.jsx`:

**1. Efficiency fix:**
- Replace the 4-request `fetchStats` (lines 111-129) with a single call to a decorators-stats endpoint (e.g. `GET /decorators/stats` returning `{ total, active, pending, suspended }`), matching the pattern `ManageUser.page.jsx` (`GET /users/stats`) and `ManageAgents.page.jsx` (`GET /agents/stats`) already use successfully. If no such backend endpoint exists yet, flag as a backend-coordination item — this is now the third admin page needing the same fix (see `18-ManageServices.md`, `22-ManageBookings.md`), so it's worth prioritizing as a single backend addition that fixes all three at once.

**2. Color consistency:**
- Change `hover:text-indigo-600` (line 661) to `hover:text-purple-600` to match the rest of the file.

**3. Reusable component extraction (coordinate with other pages, build once):**
- Build the shared `<Modal>` shell and migrate the View Details modal (lines 747-916) onto it.
- Extract `getPlaceholderLogo` into a shared util (per `06-TopDecorators.md` finding #4) and use it here instead of this file's own copy.
- Build `<Pagination>` (per `02-Reusable-Components.md` §1) and replace the "X / Y" text-only footer (lines 685-744) with the numbered-pill version.

**4. Component decomposition:**
- Extract the View Details modal content into `src/features/admin/components/ManageDecoratorViewModal.jsx` and the table row into a local `<DecoratorTableRow>`.

Preserve all existing status-transition, search/filter, and delete logic — none of the above requires restructuring the page's data flow.

## Verification Checklist

- [ ] Stats tiles load from a single request instead of 4.
- [ ] "View Full Profile" hover color matches the rest of the page's purple theme.
- [ ] Approve/Suspend/Reactivate transitions still work identically for all 3 decorator statuses.
- [ ] Page renders and behaves identically after extracting the view modal and table row into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
