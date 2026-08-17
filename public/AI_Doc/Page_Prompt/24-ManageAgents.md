# Manage Agents (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-agents`
**File(s) in scope:** `src/features/admin/ManageAgents.page.jsx`. Cross-referenced: `src/features/decorators/JoinAsDecorator.page.jsx`/`ManageUser.page.jsx`/`ManageDecorator.page.jsx`/`TopDecorators.page.jsx` (shared Bangladesh city-list constant this file diverges from — see finding #2).
**Related audit references:**
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`loadStats` uses a single `GET /agents/stats` request — a positive reference implementation, not a finding.** Line 52: one call returns `{totalAgents, availableCount, onAssignmentCount, totalCompletedEvents, avgRating}` in one round-trip. This is the correct pattern `ManageServices.page.jsx`, `ManageDecorator.page.jsx`, and `ManageBookings.page.jsx` should all be migrated to match (see their respective prompts) — noted here as the second confirmed working example alongside `ManageUser.page.jsx`.
2. **City filter dropdown is a shorter, differently-spelled list than the shared convention used everywhere else in the app.** Lines 324-329 hardcode only 4 cities: `"Dhaka"`, `"Chittagong"`, `"Sylhet"`, `"Rajshahi"` — note `"Chittagong"` here, while every other city list in the app (`TOP_CITIES` in `JoinAsDecorator.page.jsx`/`TopDecorators.page.jsx`, `citiesList` in `ManageUser.page.jsx`, `TOP_CITIES` in `ManageDecorator.page.jsx`) consistently spells it `"Chattogram"` (the current official name) and includes 10 cities, not 4. An admin filtering agents by city here can't select 6 of the 10 cities the rest of the app supports, and the one overlapping city has a different spelling than everywhere else. — **Moderate** (a real functional gap — agents based in Khulna, Barishal, Rangpur, Mymensingh, Cumilla, or Gazipur can't be filtered by city at all on this page).
3. **`renderStatusBadge` has no case for `"off_duty"`, despite it being a selectable filter option.** The status filter dropdown (line 309) offers `"off_duty"` as an option, but `renderStatusBadge` (lines 173-201) only handles `available`/`on_assignment`/`suspended` explicitly — an off-duty agent's badge falls through to the generic gray default showing the raw status string, unlike the other three statuses which get a distinct icon+color treatment. — **Polish**.
4. **Legacy Tailwind gradient syntax.** Line 230: `bg-gradient-to-br` (should be `bg-linear-to-br` per the Tailwind v4 convention used elsewhere) — same recurring inconsistency flagged in `15-Transactions.md` finding #3 and `01-Home.md` finding #4. — **Polish**.
5. **Pagination is the least capable of any page reviewed — no First/Last jump, no page-count-aware disabling beyond boundaries.** Lines 478-500: only Previous/Next buttons with a "Page X of Y" label, missing even the `ChevronsLeft`/`ChevronsRight` jump-to-first/last buttons present on every other admin table. — **Polish**.
6. **File is 629 lines. Split points:** the table row (lines ~366-472) → a local `<AgentTableRow>`; the Agent Dossier modal body (lines ~522-612, once wrapped in the shared `<Modal>` shell) → `src/features/admin/components/ManageAgentsDossierModal.jsx`. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies — finding #2 (use the shared city-list constant proposed in `09-JoinAsDecorator.md`/`13-MyProfile.md`, extending it to cover agent-city filtering too). The Agent Dossier modal (lines 503-624) is one more hand-rolled instance for the shared `<Modal>` shell.
- **Component decomposition / file size:** Applies — 629 lines; see finding #6 for concrete split points (table row, Agent Dossier modal).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 336-339) and dossier-modal loading (lines 523-526) both use the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — finding #4.
- **Design consistency:** N/A beyond the pagination-capability gap (finding #5).
- **Correctness:** Applies — findings #2, #3.
- **Improvement opportunity:** None beyond what's covered above.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageAgents.page.jsx`:

**1. Correctness fixes:**
- Replace the hardcoded 4-city dropdown (lines 324-329) with the shared Bangladesh city-list constant (`BD_CITIES`, per `09-JoinAsDecorator.md`'s extraction plan — build it there if not already done, otherwise import it here), fixing both the missing 6 cities and the `"Chittagong"` → `"Chattogram"` spelling mismatch.
- Add an explicit `"off_duty"` case to `renderStatusBadge` (lines 173-201) with its own distinct icon/color (e.g. a neutral `slate` badge, distinct from the `rose` "suspended" state, since off-duty isn't a disciplinary status).

**2. Polish:**
- Change `bg-gradient-to-br` (line 230) to `bg-linear-to-br`.
- Add First/Last page-jump buttons to the pagination footer (lines 478-500), matching the fuller pattern used on other admin tables (`ChevronsLeft`/`ChevronsRight`), or build the shared `<Pagination>` component here directly if another page's pass has already started it.

**3. Reusable component extraction (coordinate with other admin pages, build once):**
- Build the shared `<Modal>` shell and migrate the Agent Dossier modal (lines 503-624) onto it.

**4. Component decomposition:**
- Extract the table row into a local `<AgentTableRow>` and the Agent Dossier modal content into `src/features/admin/components/ManageAgentsDossierModal.jsx`.

Preserve all existing agent status-management, search/filter, and delete logic — none of the above requires restructuring the page's data flow.

## Verification Checklist

- [ ] City filter offers all 10 Bangladesh cities with the correct "Chattogram" spelling, matching every other city dropdown in the app.
- [ ] An agent with `status: "off_duty"` shows a distinct badge, not the generic gray fallback.
- [ ] Pagination supports jumping to first/last page, not just Previous/Next.
- [ ] Page renders identically after extracting the table row and dossier modal into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
