# Contact — Improvement Prompt

**Route(s):** `/contact`
**File(s) in scope:** `src/features/contact/Contact.page.jsx`.
**Related audit references:**
- `01-UI-UX-Issues.md` §5 (dead footer social links, `href="#"`) — the exact same pattern found again here, see finding #3.
- `01-UI-UX-Issues.md` §9 (emoji vs. lucide icon mismatch) — same pattern as `10-About.md`, see that file's finding #3 for the combined evidence.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **A developer placeholder note is rendered directly in the live UI.** Line 102-103: `<p className="text-xs text-base-content/60 dark:text-slate-400">(Change this to your real address)</p>` — this is styled identically to the real address text above it and renders on every page load. Any real visitor to `/contact` sees "House 12, Road 5, Dhanmondi, Dhaka" followed immediately by "(Change this to your real address)" in the office-address card. — **Critical** (visible on a public, unauthenticated page; looks unfinished/unprofessional to any real user or prospective decorator evaluating the platform).
2. **The contact form doesn't send anything anywhere.** Lines 4-18: `handleSubmit` has a comment "Beginner-friendly form handler (no backend required)" and its entire implementation is a `setTimeout` that shows a success toast and calls `e.target.reset()` — no `axiosSecure.post(...)`, no email service, no persistence of any kind. Every message a customer "sends" through this form is silently discarded while the UI confirms "Successfully sent." For a page whose stated purpose is "Have a question about a service, package, or booking? Send us a message" this is a functionally broken core feature, not a cosmetic issue. — **Critical**.
3. **All three social links are dead (`href="#"`).** Lines 113-130: Facebook, Instagram, YouTube all point to `#`, clicking any of them jumps the page to the top and does nothing — identical to the pattern already documented for `Footer.jsx` in `01-UI-UX-Issues.md` §5, a new instance here. — **Moderate**.
4. **Root wrapper uses `dark:bg-gray-900`**, same anomaly as `About.page.jsx` and `NotFound.jsx` — see `10-About.md` finding #1 for the shared evidence across all three files. — **Moderate**.
5. **"Social" label has a hover-scale effect applied to non-interactive text.** Line 109: `<p className="font-medium ... hover:scale-105 transition duration-300">Social</p>` — this is a plain label above the social buttons, not a link or button itself; giving it a hover-scale animation implies it's clickable when it isn't. — **Polish**.

### Generic checklist

- **Reusable components:** N/A for this pass.
- **Skeleton/spinner loader:** N/A — no async data fetching on this page; the fake `setTimeout`-based submit (finding #2) is a correctness issue, not a loading-state pattern issue — its `loading` state and disabled-button behavior during the fake delay is otherwise implemented correctly and can stay once the submit handler is fixed to do real work.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — `lg:grid-cols-12` (5/7 split) collapses to a single column correctly.
- **Color consistency:** Applies — finding #4. Same note as `10-About.md`: this page is built on DaisyUI `base-*` tokens consistently and cleanly; leave that system in place, fix only the `gray-900` anomaly.
- **Design consistency:** N/A.
- **Correctness:** Applies — findings #1, #2 are the two highest-value fixes on this page.
- **Improvement opportunity:** None found specific to this page in `05-Upgrade-Ideas.md`.
- **Coding standard:** N/A.
- **Comments:** N/A — the misleading "(no backend required)" comment should be removed as part of fixing finding #2, not kept.
- **Accessibility:** N/A — form fields are correctly labeled via DaisyUI's `label`/`label-text` pattern.

## Implementation Prompt

Apply these changes to `src/features/contact/Contact.page.jsx`:

**1. Correctness fixes (do first, highest value):**
- Remove the placeholder text `(Change this to your real address)` (lines 102-103) and replace the office address with the real address, or — if the real address isn't available yet — remove the Office block entirely rather than shipping a visible TODO note to production.
- Wire `handleSubmit` to actually send the contact form data somewhere real: either `axiosSecure.post("/contact", payload)` if a backend endpoint exists or is planned, or a transactional email service (e.g. via a serverless function) if there's no dedicated backend route. If no backend support exists yet and this is out of scope for a frontend-only pass, at minimum change the success toast and remove the misleading "no backend required" comment so it's clear in the code that this is a stub, not a shipped feature — flag this clearly rather than leaving it silently fake.
- Fix or remove the three dead social links (lines 113-130): point them to real profile URLs, or remove them until real accounts exist (per the same guidance already given for `Footer.jsx` in `06-UI-Upgrade-Guide.md` Phase 1 §5).

**2. Color consistency:**
- Change `dark:bg-gray-900` (line 21) to `dark:bg-slate-950`, matching this page's own internal `slate-*` usage and the same fix applied to `About.page.jsx`.

**3. Polish:**
- Remove `hover:scale-105 transition duration-300` from the "Social" label (line 109) since it isn't an interactive element.

Preserve the existing form layout, field set, and topic dropdown — none of the above requires restructuring the page.

## Verification Checklist

- [ ] No placeholder/TODO text is visible anywhere on the rendered page.
- [ ] Submitting the contact form actually delivers the message somewhere (backend endpoint, email, or an explicitly-labeled stub if backend work is out of scope) — the success toast only fires on genuine success.
- [ ] Social icons either link to real profiles or are removed.
- [ ] Page background is `slate-950` in dark mode, matching the rest of the page's `slate-*` usage.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
