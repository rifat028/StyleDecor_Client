# Join as Decorator — Improvement Prompt

**Route(s):** `/join-as-decorator`, `/become-a-decorator`
**File(s) in scope:** `src/features/decorators/JoinAsDecorator.page.jsx`. Cross-referenced: `src/features/services/ServiceBooking.page.jsx` (the broken redirect-state pattern this file correctly avoids — see finding #2), `src/features/profile/MyProfile.page.jsx` (duplicated Bangladesh city-list constant — see finding #4).
**Related audit references:**
- `04-Business-Logic.md` §2 (decorator onboarding: business name, tagline, about, city + multi-select service areas, phone, website, trade license, **Facebook/Instagram links**) — the form is missing two of these documented fields, see finding #1.
- `04-Business-Logic.md` §3 (decorator status is a 3-state machine: `pending` → `active`/`suspended`) — this page's UI only distinguishes 2 states, see finding #3.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Facebook and Instagram fields are collected in state and sent to the backend, but no input for either exists anywhere in the form.** `formData` initializes `facebook`/`instagram` (lines 57-58), and the submit payload sends `facebook: formData.facebook.trim(), instagram: formData.instagram.trim()` (lines 133-134) — but the form's "3. Contact & Social Links" section (lines 416-450, literally titled "Social Links") only renders `phone` and `website` inputs. There is no way for a user to ever populate `facebook`/`instagram` — every application submitted through this UI sends empty strings for both, silently, even though `04-Business-Logic.md` §2 documents these as part of the intended onboarding data. — **Critical** (a documented, business-relevant feature is fully unreachable, exact same "half-wired state" pattern found in `01-Home.md`'s `CoverageMap`, `06-TopDecorators.md`'s quick-view modal, and `01-Home.md`'s `FeaturedReviews`).
2. **This file's login-redirect pattern is correct — use it as the reference when fixing the broken one.** Lines 112 (`navigate("/login", { state: "/join-as-decorator" })`) and 284-286 (`<Link to="/login" state="/join-as-decorator">`) both pass a bare string as the redirect state, matching what `Login.page.jsx` actually expects (`location.state || "/dashboard"`). `ServiceBooking.page.jsx` gets this wrong (see `08-ServiceBooking.md` finding #1) — no fix needed here, this is a confirmation, not an issue.
3. **Existing-application status banner only distinguishes 2 of the 3 documented decorator statuses.** Lines 214-264: the banner branches only on `existingDecorator.status === "active"` (green/approved messaging) vs. everything else (amber/"Under Review" messaging). `04-Business-Logic.md` §3 documents a third status, `suspended` (set when an admin suspends a previously-active agency) — a suspended decorator would incorrectly see "Application Status: Under Review" / "We are reviewing your trade license..." instead of an accurate suspended/rejected message. — **Moderate**.
4. **`TOP_CITIES` (this file, lines 26-37) duplicates the same 10-city Bangladesh list independently defined in `MyProfile.page.jsx` (`topCitiesInBD`) and `TopDecorators.page.jsx` (`TOP_CITIES`, with an extra `"all"` entry).** Three separate hardcoded copies of the same constant. — **Polish** (low risk, but a real DRY opportunity worth a shared `src/lib/constants.js` export).
5. **This page uses `indigo-*` as its primary solid/accent color throughout — the only listing/form page in the app that does.** Every comparable page already reviewed (`Services`, `ServiceDetails`, `TopDecorators`, `ServiceBooking`, `MyProfile`'s decorator section) uses `purple-600` as the solid primary per `00-Color-System.md`. This file instead uses `indigo-600`/`indigo-500`/`indigo-400` for: the hero's value-prop icons, the submit button (`bg-indigo-600 hover:bg-indigo-700`), every input's focus ring (`focus:ring-indigo-500`), section header labels ("1. Agency & Brand Details" etc., `text-indigo-600`), the city-toggle buttons (`bg-indigo-600` when selected), and the "Log In" link. Per the canonical palette, indigo is reserved as the brand-gradient partner only, not a standalone primary — this is the single most extensive, consistent single-page color deviation found across the pages reviewed so far. — **Moderate**.

### Generic checklist

- **Reusable components:** Applies — finding #4 (city-list constant duplication, 3 files). Also note: the city-toggle-pill pattern (lines 392-411) is structurally similar to `MyProfile.page.jsx`'s decorator-form service-area toggle (lines 725-744) — nearly identical markup, worth a shared `<CityMultiSelect>` component if a third instance appears; not required for this pass alone.
- **Skeleton/spinner loader:** N/A — the one loading state (`authLoading || loading`, lines 159-165) is an appropriate full-page use of `<Spinner />` (nothing else on screen while checking existing-application status).
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — form grids collapse `grid-cols-1` → `sm:grid-cols-2` correctly; hero value-props grid collapses `grid-cols-1` → `sm:grid-cols-3`.
- **Color consistency:** Applies — finding #5.
- **Design consistency:** N/A beyond the color deviation already noted.
- **Correctness:** Applies — findings #1, #3.
- **Improvement opportunity:** None beyond wiring up the missing social-link fields (finding #1), which is itself the highest-value fix on this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — form fields are correctly labeled, city-toggle buttons are real `<button>` elements (unlike the `<div onClick>` pattern flagged elsewhere in the app).

## Implementation Prompt

Apply these changes to `src/features/decorators/JoinAsDecorator.page.jsx`:

**1. Correctness fixes (do first):**
- Add `facebook` and `instagram` input fields to the "3. Contact & Social Links" section (alongside the existing `phone`/`website` inputs), wired to `formData.facebook`/`formData.instagram` via the existing `handleInputChange`, so the data already being sent in the payload can actually be filled in by the applicant.
- Extend the existing-application status banner (lines 214-264) to handle `existingDecorator.status === "suspended"` as a distinct third visual state (e.g. a red/rose-toned card with accurate "Your agency's account has been suspended — contact support" messaging), rather than falling into the generic amber "Under Review" branch.

**2. Color consistency — converge on `00-Color-System.md`:**
- Replace all `indigo-*` primary/accent usages (submit button, focus rings, section header labels, city-toggle selected state, "Log In" link) with `purple-*` equivalents, matching every other comparable page in the app (`purple-600` solid, `focus:ring-purple-500`).

**3. Reusable extraction:**
- Move the Bangladesh city list into a shared `src/lib/constants.js` export (e.g. `BD_CITIES`), and use it here, in `MyProfile.page.jsx`, and in `TopDecorators.page.jsx` (which additionally prepends `"all"` — keep that as a local addition on top of the shared base list rather than duplicating the whole array).

Preserve all existing form validation, submission flow, and status-banner logic for the `active` and `pending` cases — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Facebook and Instagram fields are visible in the form and their values appear in the submitted application payload.
- [ ] A decorator account with `status: "suspended"` (test via a mocked/seeded record if available) shows distinct suspended messaging, not the generic "Under Review" banner.
- [ ] No `indigo-*` classes remain on this page except where used correctly as a gradient partner (if any gradient is kept) — solid buttons and focus rings use `purple-*`.
- [ ] `BD_CITIES` is defined in one shared location and used identically by this file, `MyProfile.page.jsx`, and `TopDecorators.page.jsx`.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
