# Register — Improvement Prompt

**Route(s):** `/Register`
**File(s) in scope:** `src/features/auth/Register.page.jsx`. Cross-referenced: `src/features/auth/AuthProvider.jsx` (only for `updateProfileInfo`'s photo-fallback behavior this page depends on), `src/features/auth/Login.page.jsx` (near-identical structure — see `02-Login.md` for the twin findings; several fixes below must be applied to both files together).
**Related audit references:**
- `01-UI-UX-Issues.md` §1 (theme flash, owned by `NavBar.jsx` — inherited via `RootLayout`, not fixable here), §2 (password toggle not keyboard accessible), §10 (no confirm-password field), §11 (password rules only surface on submit), §12 (invalid `type="photoUrl"` input)
- `03-Frontend-Issues-And-Solutions.md` §2 cites this exact bug pattern (`e.target.reset;` missing `()`) in the *dead* `features/customer/ServiceBooking.page.jsx` copy — this page has the same bug independently, in a live, routed file, not previously documented here.
- `06-UI-Upgrade-Guide.md` Phase 1 §2 (password-toggle fix code), Phase 4 §12 (confirm-password + live checklist + input-type fix code, all ready to use)
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`e.target.reset;` is a no-op — missing `()`.** Line 85: `e.target.reset;` (statement, not a call) means the form fields never actually clear. Low visible impact today since the user is navigated to `/dashboard` a second later on success, but on any failure path partway through the nested `.then()`/`.catch()` chain (e.g. `updateProfileInfo` rejecting), the form is left filled with a submitted password. — **Critical**, one-character fix (`e.target.reset();`).
2. **Dead `newUser` object — computed, discarded, never sent anywhere.** Lines 32-40 build a `newUser` object with a smart initials-based `placehold.co` fallback avatar, but this variable is never referenced again — the actual object POSTed to the backend is a *separate* `newUserWithUid` (lines 60-67) built later inside the `.then()`, using a **different**, generic Unsplash stock-photo fallback instead. This is dead code that also reveals a real inconsistency (see finding #3). — **Moderate**.
3. **Three different avatar-fallback strategies for the same signup flow, producing a mismatch between Firebase Auth and the backend DB record.** When a user registers without supplying a Photo URL:
   - Firebase Auth's `photoURL` gets the **initials placeholder** (`AuthProvider.jsx:28-33`, `updateProfileInfo`'s own fallback: `https://placehold.co/150x150/4F46E5/FFFFFF?text=<initials>`).
   - The backend `/users` DB record's `photoUrl` gets a **generic Unsplash stock photo** instead (`Register.page.jsx:64-66`: `https://images.unsplash.com/photo-1534528741775-...`).
   - The dead `newUser` (finding #2) independently re-derives the initials fallback a third time, matching Firebase's version but never used.
   Net effect: any UI reading from Firebase's `user.photoURL` (e.g. `NavBar`/`UserMenu`) shows a different avatar than any UI reading from the backend user record (e.g. `Avatar` components in admin tables) for the same freshly-registered user. — **Critical** (visible, confusing, and easy to fix by picking one fallback and using it consistently).
4. **Fragile error matching via string equality**, same anti-pattern as `Login.page.jsx`: line 81, `if (error.message == "Firebase: Error (auth/email-already-in-use).")`. Should be `error.code === "auth/email-already-in-use"`. — **Moderate**.
5. **Login link uses a full-page `<a>` instead of client-side `<Link>`.** Line 224-229: `<a href="/login">Log In</a>` — same anti-pattern as the equivalent link in `Login.page.jsx` (see `02-Login.md` finding #3). — **Moderate**.
6. **No in-flight loading/disabled state on submit** — same as `Login.page.jsx` finding #5; `HandleRegister` and `HandleGoogleLogIn` both fire async work with no button-disable or spinner. — **Moderate**.
7. **Google sign-in handler duplicates `Login.page.jsx`'s `HandleGoogleLogIn` almost verbatim** (lines 88-110 here vs. lines 41-65 there) — see `02-Login.md` finding #6. Extract once, use in both — don't implement the extraction twice.
8. **Labels have no `htmlFor`, and unlike `Login.page.jsx`, the inputs here don't even have `id` attributes** (only `name`) — e.g. line 131-137 (`name="name"`, no `id`), line 146-153 (`name="email"`, no `id`). Clicking label text does nothing; screen readers can't associate labels with fields at all. — **Critical**.
9. **Leftover dead code:** commented-out `// console.log(name, email, photoUrl, password);` (line 30). — **Polish**.

### Generic checklist

- **Reusable components:** Applies — see finding #7 (Google sign-in sync logic, shared with `Login.page.jsx`) and the password-eye-toggle pattern (byte-for-byte duplicate of `Login.page.jsx`, already documented in `01-UI-UX-Issues.md` §2, fix in `06-UI-Upgrade-Guide.md` Phase 1 §2).
- **Skeleton/spinner loader:** Applies narrowly — submit buttons should show a loading/disabled state during the async Firebase calls (finding #6). No list/skeleton pattern applies to this page.
- **Tooltip:** N/A beyond what the accessible password-toggle button (once fixed) already covers via `aria-label`.
- **Responsiveness:** N/A — `max-w-lg w-full p-4` card form collapses cleanly at all widths; no issue found.
- **Color consistency:** Applies — same drift as `Login.page.jsx`: `gray-*` used throughout instead of `slate-*`, `dark:bg-black` page background instead of `dark:bg-slate-950`. This page's inputs use `focus:ring-emerald-500 focus:border-emerald-500` — a **different** focus color than `Login.page.jsx`'s `indigo-500`, for the equivalent kind of field on a sibling page. Per `00-Color-System.md`, neither is the canonical choice for a generic input; both should converge on `focus:ring-purple-500 focus:border-purple-500`. Submit button uses `bg-indigo-600` (same issue as Login — should be `bg-purple-600`). `hover:text-yellow-400` on the Google button uses the same deprecated hue as Login.
- **Design consistency:** Applies — this page's `<Toaster>` has an extra `className="z-10"` (line 114) that `Login.page.jsx`'s `<Toaster>` doesn't have; both position `top-center`, so verify whether the z-index override is masking a real stacking issue or is leftover cruft, and make both files consistent either way.
- **Correctness:** Applies — findings #1, #2, #3, #4, #6.
- **Improvement opportunity:** `01-UI-UX-Issues.md` §10 (confirm-password field) and §11 (live password-rule checklist) apply directly, with ready-to-use diff code in `06-UI-Upgrade-Guide.md` Phase 4 §12 — implement both.
- **Coding standard:** Applies — PascalCase handler names (`HandleRegister`, `HandleGoogleLogIn`), same as `Login.page.jsx`; rename to camelCase if that's the project convention elsewhere. Finding #9 (dead comment).
- **Comments:** N/A — no non-obvious logic requiring explanation beyond the avatar-fallback inconsistency (finding #3), which should be fixed in code rather than commented around.
- **Accessibility:** Applies — finding #8 (missing `id`/`htmlFor` entirely — worse than `Login.page.jsx`'s partial version of the same gap), the already-documented password-toggle issue (`01-UI-UX-Issues.md` §2), and the invalid `type="photoUrl"` input (`01-UI-UX-Issues.md` §12, one-line fix in `06-UI-Upgrade-Guide.md` Phase 4 §12).

## Implementation Prompt

Apply these changes to `src/features/auth/Register.page.jsx`:

**1. Correctness fixes (do first):**
- Fix `e.target.reset;` → `e.target.reset();` (line 85).
- Resolve the avatar-fallback inconsistency (findings #2 + #3): delete the dead `newUser` object (lines 32-40), and change `newUserWithUid`'s fallback (currently the generic Unsplash photo, lines 64-66) to reuse the **same** initials-based fallback that `AuthProvider.updateProfileInfo` already applies to the Firebase Auth profile, so the backend DB record and the Firebase Auth profile show the identical avatar when no photo URL is supplied. Consider centralizing this fallback logic (e.g. a `getDefaultAvatar(name)` util in `src/lib/`) so it isn't a third independent copy.
- Change `if (error.message == "Firebase: Error (auth/email-already-in-use).")` to `if (error.code === "auth/email-already-in-use")`.
- Replace `<a href="/login">` with `<Link to="/login">` (import `Link` from `react-router`).
- Add a submit-in-progress state: disable the submit button and show a small spinner/"Creating account..." label while `HandleRegister`'s Firebase call is pending; same for the Google button during `HandleGoogleLogIn`.
- Add `id` attributes to all inputs (`name`, `email`, `photoUrl`, `password`) and `htmlFor` on their corresponding `<label>`s.
- Remove the dead `// console.log(...)` comment (line 30).

**2. Accessibility & UX (ready-to-use code in `06-UI-Upgrade-Guide.md` Phase 4 §12):**
- Add a confirm-password field with a match check (§10).
- Add a live password-rule checklist that updates on every keystroke instead of only on submit (§11).
- Fix `type="photoUrl"` → `type="url"` (§12).
- Replace the password-visibility `<div onClick>` with an accessible `<button aria-label aria-pressed>`, exactly per `06-UI-Upgrade-Guide.md` Phase 1 §2 (identical fix to `Login.page.jsx`).

**3. Color consistency — converge on `00-Color-System.md`:**
- Replace `gray-*` with `slate-*` equivalents throughout.
- Replace `dark:bg-black` with `dark:bg-slate-950`.
- Replace `focus:ring-emerald-500 focus:border-emerald-500` on all inputs with `focus:ring-purple-500 focus:border-purple-500`.
- Replace the submit button's `bg-indigo-600 hover:bg-indigo-700` with `bg-purple-600 hover:bg-purple-700`.
- Replace `hover:text-yellow-400` on the Google button with an `amber` equivalent.
- These must match `Login.page.jsx` exactly after this pass — apply the identical changes there if not already done (see `02-Login.md`).

**4. Reusable extraction (coordinate with Login — implement once, use in both):**
- Extract the shared Google sign-in → backend-sync logic into a `syncUserToBackend(firebaseUser)` utility or `useGoogleAuth()` hook, used by this file's `HandleGoogleLogIn` and by `Login.page.jsx`'s `HandleGoogleLogIn`. If `Login.page.jsx` has already been processed and this extraction already exists, just import and use it here — don't create a second copy.

Preserve all existing Firebase auth calls, navigation behavior, and toast messaging — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Submitting the form (success or failure) actually clears the fields where expected.
- [ ] A freshly registered user (no photo URL supplied) shows the **same** avatar in the navbar (Firebase `photoURL`) as in any admin/user-list view reading the backend DB record.
- [ ] Attempting to register with an already-used email shows the "Email Already in Use" toast (verifies the `error.code` fix didn't break the existing message).
- [ ] "Log In" link navigates client-side (no full page reload).
- [ ] Confirm-password field rejects a mismatched confirmation before submit.
- [ ] Password rule checklist updates live as the user types, not only after a failed submit.
- [ ] Photo URL field shows the URL-optimized mobile keyboard (verifies `type="url"`).
- [ ] Clicking any label text focuses its corresponding input.
- [ ] Submit button shows a disabled/loading state during account creation and can't be double-clicked into firing two requests.
- [ ] Page matches `Login.page.jsx` visually in both light and dark mode (background, input focus color, button color).
- [ ] No `gray-*` classes remain in this file.
