# Agency Profile — Improvement Prompt

**Route(s):** `/dashboard/agency-profile`
**File(s) in scope:** `src/features/decorator-dashboard/AgencyProfile.page.jsx`. Cross-referenced: `src/features/admin/ManageDecorator.page.jsx` (conflicting status vocabulary — see finding #2), `src/features/decorators/JoinAsDecorator.page.jsx` (this file proves the Facebook/Instagram fields flagged as missing there are the intended UI shape — see finding #4).
**Related audit references:**
- `04-Business-Logic.md` §3 (decorator status machine: `pending`/`active`/`suspended`, admin-controlled) — this file writes a **different** status vocabulary to what is very likely the same field; see finding #2.
- `09-JoinAsDecorator.md` finding #1 (missing Facebook/Instagram inputs at onboarding) — confirmed via this file that the fields belong in the form; they're just absent from the onboarding version.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **"Partner Status: Approved" is hardcoded and unconditional — directly contradicting the "Verification Pending" badge shown elsewhere on the same page.** Lines 693-697 always render `<CheckCircle2 /> Approved` in the "Trade & Verification" card, regardless of the agency's actual state. Meanwhile the hero banner on the very same render (lines 380-388) correctly shows either "✓ Verified Partner" or "⏳ Verification Pending" based on `isVerified = Boolean(agency.verification?.isVerified)`. A decorator whose agency is still pending admin approval would see **both** "Verification Pending" (hero, correct) **and** "Partner Status: Approved" (verification card, wrong) on the same screen at the same time — a direct, visible internal contradiction, not just a stale-badge concern like `13-MyProfile.md` finding #5. — **Critical**.
2. **The decorator can self-set `status` to `busy`/`on_leave`/`suspended` via a plain dropdown with no confirmation dialog — a different vocabulary than the admin-controlled lifecycle, likely writing the same field.** Lines 412-421: `handleStatusChange` PATCHes `status` directly on the decorator record with zero confirmation. `04-Business-Logic.md` §3 documents `status` as a 3-value, **admin-controlled** state machine (`pending`/`active`/`suspended`) gating public marketplace visibility, changed only through `ManageDecorator.page.jsx`'s `handleStatusTransition` — which *does* require SweetAlert2 confirmation for every transition. If this dropdown writes to the same `status` field, a decorator could accidentally select "🔴 Closed" and instantly remove their own agency from public listings with a single misclick, using a status value (`"suspended"`) that's supposed to mean "admin took punitive action," not "decorator temporarily paused." — **Critical** (needs a decision, not just a UI tweak — see Implementation Prompt).
3. **Trade license fallback text looks like a real, specific license number, not a placeholder.** Line 689: `{agency.verification?.tradeLicenseNo || "TL-2026-DH-0918"}` — when the decorator hasn't entered a real license number, this displays a fabricated-looking value with real-license formatting instead of an obvious "Not provided" state. Shown only on the decorator's own private dashboard (not the public profile), so the risk is limited to the decorator themselves being misled about whether they've actually submitted real license info — still worth fixing since it's easy to mistake for genuine onboarding data. — **Moderate**.
4. **`loadAgencyProfile` and `handleOpenEdit` duplicate the exact same `agency` → `formData` field-mapping (~25 lines each, lines 104-123 and 142-161).** Since `loadAgencyProfile` already populates `formData` from the fetched record on mount, `handleOpenEdit`'s re-derivation from `agency` state (set by the same fetch) is redundant — a shared `buildFormDataFromAgency(dec)` helper would remove the duplication and the risk of the two copies drifting apart if one is edited without the other. — **Polish**.
5. **Confirms `09-JoinAsDecorator.md` finding #1: Facebook/Instagram fields exist here (lines 866-888) but are missing from the initial application form.** This is only a cross-reference, not a new issue for this file — this page's implementation is correct and can serve as the reference shape when fixing the onboarding form.
6. **File is 990 lines. The single Edit/Create modal (lines 709-985, ~275 lines) is the largest individual modal found anywhere in the app.** It bundles branding fields, contact/address fields, social links, coverage-zone tag management, and category-specialization toggles all in one block. Concrete split points: `src/features/decorator-dashboard/components/AgencyProfileEditModal.jsx` for the modal shell + form-field sections, further broken into `<CoverageZonesEditor>` (the zone tag add/remove UI, lines ~891-935) and `<CategorySpecializationPicker>` (the category toggle grid, lines ~938-962) as nested sub-components, since each is a self-contained interactive widget in its own right. — **Polish** (maintainability, not a functional bug — but the highest-value split target of any single modal in the app given its size).

### Generic checklist

- **Reusable components:** Applies — finding #4. The Edit/Create modal (lines 709-985) is another hand-rolled instance for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Component decomposition / file size:** Applies — 990 lines; see finding #6, the largest single modal found in this entire review.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 283-289) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — legacy `bg-gradient-to-t`/`bg-gradient-to-br` syntax (lines 340, 443) should be `bg-linear-to-*`, same recurring issue found elsewhere. The `indigo-*` KPI-card accents (Coverage Zones stat, line 480/482; Rating card gradient, line 443) read as deliberate categorical variety on a KPI dashboard, same judgment call as `26-Analytics.md` — not a hard violation.
- **Design consistency:** N/A.
- **Correctness:** Applies — findings #1, #2 are both high-priority.
- **Improvement opportunity:** None beyond what's covered above.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/AgencyProfile.page.jsx`:

**1. Correctness fixes (do first, highest value):**
- Fix finding #1: make "Partner Status" reflect the real state — either derive it from `agency.verification?.isVerified` / `agency.status` (matching the hero banner's logic exactly) or remove the hardcoded card entirely if it duplicates the hero banner's information. Never leave two contradictory status claims visible on the same render.
- Investigate finding #2 before changing code: confirm with whoever owns the backend booking/decorator-status model whether `handleStatusChange`'s dropdown (`active`/`busy`/`on_leave`/`suspended`) writes to the **same** `status` field `ManageDecorator.page.jsx` controls, or a genuinely separate "operational availability" field. If it's the same field, this is a real conflict: add a SweetAlert2 confirmation before any transition to `"suspended"` at minimum (matching the admin page's pattern), and consider renaming this dropdown's options to avoid colliding with the admin-controlled lifecycle values (e.g. a separate `availabilityStatus` field distinct from the admin-controlled `status`). If it's already a separate field, no fix needed — just note the finding as resolved/non-issue in your summary.
- Replace the fake-looking trade license placeholder (line 689) with an honest "Not yet provided" state, styled distinctly from a real license number (e.g. italic/muted, matching the pattern used for "No categories assigned yet." elsewhere on this same page).

**2. Reusable extraction:**
- Extract a `buildFormDataFromAgency(dec, userEmail)` helper and use it in both `loadAgencyProfile` and `handleOpenEdit` instead of the duplicated inline mapping.
- Build the shared `<Modal>` shell and migrate the Edit/Create modal onto it, if built by another page's pass.

**3. Polish:**
- Change `bg-gradient-to-t`/`bg-gradient-to-br` to `bg-linear-to-t`/`bg-linear-to-br`.

**4. Component decomposition:**
- Extract the Edit/Create modal into `src/features/decorator-dashboard/components/AgencyProfileEditModal.jsx`, and further extract the coverage-zone editor and category-specialization picker within it into their own `<CoverageZonesEditor>` and `<CategorySpecializationPicker>` sub-components.

Preserve all existing profile-editing, zone/category-management, and social-link logic — none of the above requires restructuring the page beyond the two correctness fixes and the DRY extraction.

## Verification Checklist

- [ ] A decorator whose agency is `pending`/unverified sees consistent status messaging everywhere on the page — no card claims "Approved" while another says "Pending."
- [ ] Selecting a new operational status either shows a confirmation dialog (if it affects public visibility) or is confirmed to be a separate, non-conflicting field.
- [ ] A decorator with no trade license entered sees an honest empty state, not a fabricated-looking license number.
- [ ] Page renders and behaves identically after extracting the Edit/Create modal and its two sub-widgets into local components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
