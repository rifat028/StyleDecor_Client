# Manage Services (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-services`
**File(s) in scope:** `src/features/admin/ManageServices.page.jsx`. Cross-referenced: `src/features/admin/ManageUser.page.jsx` (reference implementation for both the stats-endpoint pattern and the numbered-pagination pattern this file lacks — see findings #1, #2).
**Related audit references:**
- `02-Reusable-Components.md` §1 (Pagination — this file's pagination is explicitly cited as one of the 7 duplicates, and named specifically as an example of the "Page X of Y, no clickable numbers" drift variant, in contrast to `ManageUser.page.jsx`'s numbered-pill version), §3 (EmptyState — this file's empty state is cited verbatim as an example), §4 (StatCard), §6 (Modal shell — this file's View Details modal is cited verbatim at these exact lines), §2 (ConfirmDialog/SweetAlert2 pattern).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`loadStats` fires 4 separate API requests just to read 4 counts.** Lines 129-134: `Promise.all([...4 separate axiosSecure.get calls, each with limit=1...])`, one per stat (all/active/inactive/featured), each just to read `res.data.totalCount` from a full `/services` query response. Compare against `ManageUser.page.jsx`, which gets all its role-breakdown counts from a **single** `GET /users/stats` call (line 100) — this file could use the same pattern (`GET /services/stats`) if the backend supports it, or should request it be added, rather than issuing 4 round-trips on every page load and after every mutation. — **Moderate** (real, measurable inefficiency — 4x the network calls for what should be one).
2. **Pagination footer shows "Page X of Y" text only — no clickable page numbers**, confirmed exactly matching the drift `02-Reusable-Components.md` §1 already documented ("`ManageServices.page.jsx` and `Services.page.jsx` only show 'Page X of Y' text with no clickable numbers"). `ManageUser.page.jsx` in the same admin section has the more capable numbered-pill+ellipsis version (`pageNumbers` `useMemo`, lines 289-316 there) — this file should be upgraded to match once the shared `<Pagination>` component is built, rather than staying behind as the less-capable sibling. — **Moderate**.
3. **File is 781 lines in a single component — worth splitting even independent of the shared-component extraction above.** Concrete split points: the View Details modal body (lines 661-764, everything inside the `<Modal>` wrapper once §6 is adopted) is ~100 lines of page-specific field display and belongs in its own `src/features/admin/components/ManageServicesViewModal.jsx`, taking `viewingService` as a prop; the table row (lines 452-573, the `.map((srv) => {...})` body) is dense enough to extract as a `<ServiceTableRow service={srv} onToggleStatus={...} onToggleFeatured={...} onView={...} onDelete={...} />`; the `CATEGORIES` array (lines 30-37) is small enough to leave inline. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies extensively — this file is directly cited in `02-Reusable-Components.md` for 4 separate patterns: Pagination (§1, lines 581-639), EmptyState (§3, lines 419-433), StatCard (§4, lines 257-291, static 4-tile variant), and Modal (§6, View Details modal, lines 643-775). All four citations were verified accurate against the current file. Also: delete/status-toggle confirmations use `Swal.fire(...)` directly (lines 216-223, and implicitly via the 1-click toggles) — matches §2's `useConfirm` hook proposal.
- **Component decomposition / file size:** Applies — 781 lines; see finding #3 for concrete split points (View Details modal body, table row).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 414-417) uses the shared `<Spinner />` in a padded box, same pattern noted on several other pages; consider a table-row skeleton instead once the shared skeleton components exist.
- **Tooltip:** N/A — action buttons already have `title` attributes.
- **Responsiveness:** No issues found — filter grid and stat-card grid both collapse correctly.
- **Color consistency:** N/A — this page is clean, consistently using canonical `purple`/`emerald`/`amber`/`slate`/`rose` with no deprecated hues.
- **Design consistency:** N/A beyond the pagination-capability gap already noted (finding #2).
- **Correctness:** Applies — finding #1.
- **Improvement opportunity:** None beyond the stats-endpoint efficiency win (finding #1).
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered under Reusable Components.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageServices.page.jsx`:

**1. Efficiency fix:**
- Replace the 4-request `loadStats` (lines 127-145) with a single call to a services-stats endpoint (e.g. `GET /services/stats` returning `{ total, active, inactive, featured }` in one response), matching the pattern `ManageUser.page.jsx` already uses successfully via `GET /users/stats`. If no such backend endpoint exists yet, flag this as a backend-coordination item rather than working around it client-side with more requests.

**2. Reusable component extraction (coordinate with `19-ManageUser.md` and other admin pages, build once):**
- Build `<Pagination>` (per `02-Reusable-Components.md` §1) with the numbered-pill+ellipsis capability `ManageUser.page.jsx` already has, and use it here — this both fixes finding #2 (bringing this file up to parity) and removes ~60 duplicated lines. If another page's pass already built it, just import and use it.
- Build `<EmptyState>` (§3) using this file's own empty state (lines 419-433) as the reference shape, and replace it here.
- Build `<StatCard>` (§4) for the 4 static metric tiles (lines 256-292).
- Build the shared `<Modal>` shell (§6, portal + Escape-to-close + backdrop-click + focus trap) and migrate the View Details modal (lines 643-775) onto it.
- Build a `useConfirm()` hook wrapping the repeated SweetAlert2 confirm pattern (§2) and use it for the delete confirmation (lines 216-223).

**3. Component decomposition:**
- Extract the View Details modal's field-display content into `src/features/admin/components/ManageServicesViewModal.jsx` (a local, page-specific component, not `src/components/ui/`), and pass it as children to the shared `<Modal>` shell once built.
- Extract the table row markup into a local `<ServiceTableRow>` component in the same `components/` folder.

Preserve all existing filtering, status-toggle, featured-toggle, and delete logic — none of the above requires restructuring the page's data flow, only extracting shared presentation components.

## Verification Checklist

- [ ] Stats tiles load from a single request instead of 4.
- [ ] Pagination shows clickable numbered pages (matching `ManageUser.page.jsx`'s capability), not just "Page X of Y" text.
- [ ] Delete/status-toggle confirmations behave identically to before, now routed through the shared confirm hook if built.
- [ ] View Details modal closes on Escape and backdrop click, and traps focus while open, if migrated to the shared `<Modal>`.
- [ ] Page renders identically after extracting the view-modal content and table row into local sub-components — no visual or behavioral change.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
