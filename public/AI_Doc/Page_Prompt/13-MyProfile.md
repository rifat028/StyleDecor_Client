# My Profile — Improvement Prompt

**Route(s):** `/dashboard` (index), `/dashboard/my-profile`
**File(s) in scope:** `src/features/profile/MyProfile.page.jsx`. Cross-referenced: `src/features/decorators/JoinAsDecorator.page.jsx` (duplicated Bangladesh city-list constant — see finding #4), `src/features/home/components/Spinner.jsx` (shared, not modified here — see finding #3).
**Related audit references:** None specific to this file in `00-06` — it wasn't individually called out in the original audit.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **The "primary" accent color switches from `indigo` to `purple` within this single file, for what should be the same semantic role.** The personal-profile section uses `indigo-*` throughout: banner gradient (`from-indigo-900 via-indigo-800 to-purple-900`, line 258), Edit button focus/hover, `focus:ring-indigo-500` on every profile-edit input, the Account Details icon (`text-indigo-600`, line 315). The Decorator Agency sub-section (rendered lower on the same page when `userData.role === "decorator"`) instead uses `purple-*` throughout: `focus:ring-purple-500`, the Edit Agency icon, badges. Two sections of one component tree use two different colors for the identical "primary interactive accent" role. — **Moderate** (more surgical than typical page-to-page drift since it's inconsistent within one file).
2. **`roleBadgeStyles` (lines 244-253) uses `red-*` for the admin badge**, one of the deprecated/legacy hues per `00-Color-System.md` §5 (which specifies `rose` as the standard, not `red`) — though note this is a categorical role-badge palette (admin/decorator/agent/customer each get a distinct color), not strictly a "danger" semantic use, so a full rose migration is a judgment call rather than a clear-cut fix; flagging for the implementer to decide, with `rose` as the safe default recommendation if migrating. — **Polish**.
3. **The full-page `loading` state returns a bare `<Spinner />` (line 224-226) with no wrapping container**, rendered *inside* `DashboardLayout`'s already-mounted sidebar/topbar chrome. `Spinner.jsx` hardcodes `h-screen` on its own root — nested inside the dashboard's content area (which itself sits beside a sidebar and below a topbar), a `h-screen` block will likely overflow past the visible content area or create a double-scrollbar situation, rather than centering cleanly within just the content region. — **Moderate** (same shared-`Spinner`-misuse family found on several other pages, here manifesting inside a nested dashboard layout rather than a top-level route).
4. **`topCitiesInBD` (lines 24-35) duplicates the same 10-city list independently defined in `JoinAsDecorator.page.jsx` (`TOP_CITIES`) and `TopDecorators.page.jsx` (`TOP_CITIES`, plus `"all"`).** Three independent copies of the same constant — see `09-JoinAsDecorator.md` finding #4 for the shared fix. — **Polish**.
5. **The "Account Status: Verified & Active Member" card is fully static — not driven by any real verification field.** Lines 361-375: this card always renders the same "Verified & Active Member" message regardless of the actual user record; there's no check against something like `userData.emailVerified` or a KYC/verification flag. On a marketplace platform that markets "100% verified" decorators and escrow protection as core trust signals (per `04-Business-Logic.md` and the homepage's `TrustAssurances` section), a "Verified" badge that isn't backed by real data is a credibility risk if it's ever noticed to be unconditional. Flagging for review rather than asserting it's definitely wrong — if the backend genuinely verifies every account by the time it reaches this page (e.g. Firebase email verification is enforced at signup), this may be intentional; if not, it should be conditional. — **Moderate**.

### Generic checklist

- **Reusable components:** Applies — finding #4. Also note: the service-area city-toggle-pill pattern (lines 725-744) is structurally near-identical to `JoinAsDecorator.page.jsx`'s own city-toggle (lines 392-411) — a `<CityMultiSelect>` component would remove both; build it during whichever of these two pages is processed second, referencing the first.
- **Skeleton/spinner loader:** Applies — finding #3.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — `lg:grid-cols-3` main layout collapses to a single column correctly; all inner form grids use standard responsive patterns.
- **Color consistency:** Applies — findings #1, #2.
- **Design consistency:** N/A beyond the color-role inconsistency already noted.
- **Correctness:** Applies — finding #5 (flagged for review, not a confirmed bug).
- **Improvement opportunity:** None found specific to this page in `05-Upgrade-Ideas.md`.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — all interactive elements are real `<button>`/`<input>`/`<select>` with visible labels; no gaps found.

## Implementation Prompt

Apply these changes to `src/features/profile/MyProfile.page.jsx`:

**1. Correctness / trust (do first):**
- Review finding #5: check whether a real verification field exists on the user record (e.g. `userData.emailVerified`, or an admin-set verification flag). If one exists, make the "Account Status" card conditional on it (showing an accurate unverified state otherwise). If no such field exists yet, either remove the unconditional "Verified" claim or clearly scope this as a placeholder pending backend support — don't leave an unconditional trust claim in place without confirming it's accurate.
- Replace the bare `<Spinner />` full-page loading return (line 224-226) with a version that fits within the dashboard's content area rather than forcing full-viewport height — e.g. wrap it in a `min-h-[60vh] flex items-center justify-center` container sized to the content region, or use a page-appropriate skeleton matching this page's card layout.

**2. Color consistency — converge on `00-Color-System.md`:**
- Pick one accent color for the entire page's primary interactive elements (recommend `purple-600`, matching the majority of comparable dashboard/profile pages already reviewed) and apply it consistently to both the personal-profile section (currently `indigo-*`) and the decorator-agency section (currently `purple-*`) — don't leave the two halves of this file using different accents for the same role.
- Consider migrating the admin role badge from `red-*` to `rose-*` per the canonical palette's legacy-hue guidance (finding #2) — treat this as a judgment call, not a hard requirement, since role-badge colors may reasonably function as a separate categorical palette.

**3. Reusable extraction (coordinate with `09-JoinAsDecorator.md`):**
- Move the Bangladesh city list to the shared `src/lib/constants.js` export described in `09-JoinAsDecorator.md`'s Implementation Prompt (build it here if `JoinAsDecorator.page.jsx` hasn't been processed yet; otherwise just import it).

Preserve all existing profile-editing and decorator-agency-editing form logic — none of the above requires restructuring the page.

## Verification Checklist

- [ ] The "Verified & Active Member" card either reflects real account-verification state or has been scoped/removed as a placeholder — confirmed with whoever owns the backend user-verification logic if uncertain.
- [ ] Loading state fits within the dashboard's content area, not the full viewport, when navigating to this page inside the authenticated shell.
- [ ] Personal-profile and decorator-agency sections use the same primary accent color throughout.
- [ ] `BD_CITIES`/`topCitiesInBD` is defined in one shared location, matching `09-JoinAsDecorator.md`'s extraction.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
