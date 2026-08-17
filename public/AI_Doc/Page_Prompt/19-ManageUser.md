# Manage Users (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-users`
**File(s) in scope:** `src/features/admin/ManageUser.page.jsx`. Cross-referenced: `src/features/admin/ManageServices.page.jsx` (this file is the *better* reference for stats-endpoint and pagination patterns — see `18-ManageServices.md`), `src/features/profile/MyProfile.page.jsx` (role-badge color inconsistency — see finding #2).
**Related audit references:**
- `04-Business-Logic.md` §10 (hardcoded Super Admin email `admin.styledecor1@gmail.com`, described as "repeated 5+ times") — confirmed present **6** times in this file (see finding #1), one more than the audit's "5+" estimate.
- `02-Reusable-Components.md` §1 (Pagination — this file's numbered-pill+ellipsis version is cited as the *more advanced* implementation, in contrast to `ManageServices.page.jsx`'s plainer version), §4 (StatCard — this file's clickable filter-toggling variant is cited by name), §6 (Modal shell — both View and Edit modals cited at these exact lines).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Super Admin email hardcoded as a magic string literal 6 times.** `"admin.styledecor1@gmail.com"` appears at lines 181 (role-change guard), 261 (delete guard), 552 (name badge), 589 (quick-switch dropdown disabled), 622 (delete button hidden), and 904 (edit-modal role select disabled) — one more occurrence than `04-Business-Logic.md` §10's "5+" estimate. This is a real business rule (protect the platform-owner account) implemented as repeated magic-string comparison instead of a single named constant or a backend-enforced `isSuperAdmin` flag. — **Moderate** (already on record in `04-Business-Logic.md`, re-confirmed with exact count and line numbers).
2. **This file's admin role-badge color (`rose`) is correct; `MyProfile.page.jsx`'s equivalent badge (`red`) is not — a concrete cross-file inconsistency.** `getRoleBadge`'s admin case here (line 153) correctly uses `bg-rose-100 text-rose-700`, matching `00-Color-System.md`'s danger-color standard. `MyProfile.page.jsx`'s `roleBadgeStyles.admin` (flagged in `13-MyProfile.md` finding #2 as a judgment call) uses `red-100`/`red-700` instead — this file proves the canonical choice was already correctly made elsewhere in the codebase; `MyProfile.page.jsx` should be updated to match this file, not treated as an open question. — **Polish** (cross-reference only; the actual fix belongs to `MyProfile.page.jsx`, already flagged there — noting here since this file is the evidence that resolves that earlier judgment call).
3. **Page chrome (not role badges) uses `indigo-600` as if it were the site's primary color, throughout.** Banner icon background (line 329), focus rings on every input/select (`focus:ring-indigo-500`, e.g. lines 445, 472, 489, 879, 893, 909, 927, 950, 966, 981, 1000), avatar rings (line 547, 754), the active numbered-pagination-pill color (line 705), and the modal Save button (line 1015) all use `indigo-*`. Per `00-Color-System.md`, indigo is reserved as the brand-gradient partner only — the canonical solid primary is `purple-600`, which every comparable admin page (`ManageServices.page.jsx`, `ManageDecorator.page.jsx` per its own likely pass) uses correctly. **Important distinction:** this is different from the `getRoleBadge`/`getPlaceholderAvatar` role-color mapping (rose/purple/amber/indigo per role, lines 149-176, 44-55) — that's a legitimate categorical palette for visually distinguishing 4 account types and should be **kept as-is**, including its own use of indigo for the "customer" role badge specifically. Only the page's own UI chrome (buttons, focus rings, pagination, banner) needs to migrate from indigo to purple. — **Moderate**.

4. **File is 1028 lines — the two modals alone account for nearly 30% of it.** Concrete split points: the View User Details modal body (lines ~757-831, once wrapped in the shared `<Modal>` shell) → `src/features/admin/components/ManageUserViewModal.jsx`; the Edit User form (lines ~866-1020, the largest single block in the file) → `src/features/admin/components/ManageUserEditModal.jsx`, taking `editFormData`/`setEditFormData`/`handleSaveEdit` as props; the table row (lines ~529-634) → a local `<UserTableRow>` component. `getPlaceholderAvatar` and `getRoleBadge` (lines 44-55, 149-176) are small enough to leave inline unless the shared role-theme util noted in `13-MyProfile.md` gets built, in which case they'd move there instead. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies — this file is cited in `02-Reusable-Components.md` for Pagination (§1, this file's numbered-pill version, lines 668-734, `pageNumbers` logic at 289-316 — confirmed as the more capable reference implementation `ManageServices.page.jsx` should be upgraded to match), StatCard (§4, clickable filter-toggling stat pills, lines 356-431), and Modal (§6, View modal lines 739-843 and Edit modal lines 846-1023 — both citations verified exact). Also worth noting positively: this file's `getPlaceholderAvatar` (lines 44-55) and `getRoleBadge` (lines 149-176) role-color mapping is a reasonable, already-correct categorical palette — use it as the canonical reference if/when a shared role-theme util is extracted (per the note in `13-MyProfile.md`).
- **Component decomposition / file size:** Applies — 1028 lines; see finding #4 for concrete split points (both modals, table row).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 502-505) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere; consider a table-row skeleton.
- **Tooltip:** N/A — action buttons already have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — findings #2 (cross-reference), #3.
- **Design consistency:** N/A beyond the color chrome issue.
- **Correctness:** N/A — no logic bugs found; the Super Admin protection logic (finding #1) works correctly, it's just implemented with repeated magic strings rather than a single source of truth.
- **Improvement opportunity:** None beyond what's covered above. Worth noting positively: this file's **debounced search** (lines 89-95, 350ms) is already exactly the pattern recommended for `Services.page.jsx`'s un-debounced Min/Max Budget inputs in `04-Services.md` finding #1 — use this file's implementation as the reference when applying that fix. Also worth noting: this file's **single-request stats loading** (`GET /users/stats`, line 100) is the reference pattern `18-ManageServices.md` finding #1 recommends `ManageServices.page.jsx` adopt.
- **Coding standard:** Applies — finding #1 (magic-string repetition).
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered under Reusable Components in other pages' prompts.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageUser.page.jsx`:

**1. Coding standard fix:**
- Extract `"admin.styledecor1@gmail.com"` into a single named constant (e.g. `SUPER_ADMIN_EMAIL` at the top of the file, or ideally a shared `src/lib/constants.js` export if other files ever need it) and replace all 6 occurrences (lines 181, 261, 552, 589, 622, 904) with a reference to it. This doesn't change behavior, only removes the repeated magic string — if a backend-enforced `isSuperAdmin` flag exists or gets added later, this constant becomes the single place to swap the check.

**2. Color consistency — converge page chrome on `00-Color-System.md`, but preserve the categorical role palette:**
- Replace `indigo-*` in the page's own UI chrome (banner icon background, all input/select focus rings, avatar rings, active pagination-pill color, modal Save button) with `purple-*` equivalents.
- **Do not** change `getRoleBadge`'s or `getPlaceholderAvatar`'s indigo usage for the "customer" role — that's a legitimate categorical color, not primary-action chrome, and should stay as one of the 4 distinct role colors (rose/purple/amber/indigo).

**3. Reusable component extraction (coordinate with `18-ManageServices.md`, build once):**
- If `<Pagination>` hasn't been built yet by another page's pass, build it here using this file's numbered-pill+ellipsis logic (lines 289-316, 668-734) as the reference shape — it's the more capable of the two variants found in the app. If it already exists, migrate this file onto it.
- Build `<StatCard>` (§4) for the 5 clickable filter-toggling stat pills (lines 356-431), supporting the `onClick`/`active` variant.
- Build the shared `<Modal>` shell and migrate both the View Details modal (lines 739-843) and Edit User modal (lines 846-1023) onto it.

**4. Component decomposition:**
- Extract the View modal's and Edit modal's content into `src/features/admin/components/ManageUserViewModal.jsx` and `ManageUserEditModal.jsx` respectively (local, page-specific, not `src/components/ui/`).
- Extract the table row markup into a local `<UserTableRow>` component in the same `components/` folder.

Preserve all existing search/filter/role-management/delete logic — none of the above requires restructuring the page's data flow, only extracting shared presentation components and removing the magic-string repetition.

## Verification Checklist

- [ ] Super Admin protection (role-change blocked, delete blocked, badge shown, dropdowns disabled) works identically after the constant extraction — test against the actual super-admin account.
- [ ] Page chrome (banner, buttons, focus rings, active pagination pill) uses purple, not indigo.
- [ ] The 4 role badges (admin/decorator/agent/customer) still show their original 4 distinct colors (rose/purple/amber/indigo) — unchanged.
- [ ] Both modals close on Escape and backdrop click, and trap focus while open, if migrated to the shared `<Modal>`.
- [ ] Page renders and behaves identically after extracting both modals and the table row into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
