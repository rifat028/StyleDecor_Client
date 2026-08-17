# Login — Improvement Prompt

**Route(s):** `/login`
**File(s) in scope:** `src/features/auth/Login.page.jsx`. Cross-referenced: `src/features/auth/AuthProvider.jsx` (only for the `updateProfileInfo`/Google sign-in behavior this page calls), `src/features/auth/Register.page.jsx` (shares near-identical structure — see `03-Register.md` for the twin findings).
**Related audit references:**
- `01-UI-UX-Issues.md` §1 (theme flash, owned by `NavBar.jsx` — inherited by this page via `RootLayout`, not fixable here), §2 (password toggle not keyboard accessible), §3 (dead "Forgot your password?" element)
- `06-UI-Upgrade-Guide.md` Phase 1 §2 (password-toggle fix code), §3 (forgot-password fix code)
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Form `<label>`s have no `htmlFor`, and inputs are missing matching `id`s aren't consistently used.** `Login.page.jsx:82-95` — the "Email Address" `<label>` is a plain sibling of the `<input id="email">`, not wrapped around it and not linked via `htmlFor="email"`. Same for the password label/input (lines 99-110). Clicking the label text won't focus the input, and screen readers won't reliably announce the field's purpose. — **Critical** (accessibility, easy fix).
2. **Fragile error matching via loose string equality instead of Firebase's `error.code`.** `HandleLogIn`'s catch block (line 32-36): `if (error == "FirebaseError: Firebase: Error (auth/invalid-credential).")`. This compares an `Error`/`FirebaseError` *object* to a string with `==`, relying on implicit `toString()` coercion producing an exact match — brittle, and breaks silently if Firebase ever changes its error message format. The idiomatic, robust check is `error.code === "auth/invalid-credential"`. — **Moderate**.
3. **Register link uses a full-page `<a>` instead of client-side `<Link>`.** Line 160-165: `<a href="/register" ...>Register Now</a>` triggers a full browser reload. `01-UI-UX-Issues.md` §4 flagged this pattern in `Footer.jsx`/`NavBar.jsx` logo links but not here — same anti-pattern, different location. — **Moderate**.
4. **Route casing mismatch (verify, likely harmless):** this link points to `/register` (lowercase), but the actual route in `PublicRoutes.jsx:63` is registered as `path: "/Register"` (capital R). React Router's default `caseSensitive` is `false` on `createBrowserRouter` routes, so this almost certainly still resolves correctly today — but it's worth aligning the casing for clarity, and as defense against a future `caseSensitive: true` change or a switch to a case-sensitive matching library. — **Polish**.
5. **No in-flight loading/disabled state on submit.** `HandleLogIn` and `HandleGoogleLogIn` both fire an async Firebase call with no visual feedback and no button-disable, so a slow network or an impatient double-click can fire duplicate sign-in attempts. — **Moderate**.
6. **Google sign-in handler duplicates logic found identically in `Register.page.jsx`.** `HandleGoogleLogIn` (lines 41-65) builds a `newUser` object and POSTs it to `/users` with the exact same shape, fallback photo URL, and `.catch` pattern as `Register.page.jsx`'s own `HandleGoogleLogIn` (lines 88-110). See `03-Register.md` finding for the full picture — a shared `useGoogleAuth()` hook or `syncUserToBackend(firebaseUser)` utility would remove ~20 duplicated lines from each file. — **Moderate**, cross-file (do this extraction once, referenced from both page prompts — don't implement it twice independently).
7. **Leftover dead code:** commented-out `// ref={emailRef}` (line 90) with no `emailRef` declared anywhere in the file, and commented-out `// console.log(result.user)` / `// console.log(error)` remnants (lines 25, 31, 44, 62). — **Polish**.

### Generic checklist

- **Reusable components:** Applies — see finding #6 (Google sign-in sync logic) and the password-eye-toggle pattern, which is byte-for-byte duplicated with `Register.page.jsx` (already documented, `01-UI-UX-Issues.md` §2). Fix both instances together per `06-UI-Upgrade-Guide.md` Phase 1 §2's exact diff.
- **Skeleton/spinner loader:** Applies narrowly — not a list/table page, but the submit buttons should show a spinner + disabled state during the async Firebase call (finding #5). No skeleton needed anywhere on this page.
- **Tooltip:** Applies, minor — the password-eye icon-only toggle has no `title`/tooltip today; once converted to a `<button>` with `aria-label` (per the existing fix in `06-UI-Upgrade-Guide.md` Phase 1 §2), that alone covers screen readers, a visual tooltip isn't required.
- **Responsiveness:** N/A — single-column card form (`max-w-md w-full p-4`) already collapses cleanly at all widths; no issue found.
- **Color consistency:** Applies — the entire page uses `gray-*` (not the canonical `slate-*`) for its neutral surface/text/border (`bg-gray-50`, `dark:bg-black`, `text-gray-900`, `text-gray-600`, `border-gray-500`, `dark:bg-gray-700`, `dark:bg-gray-800`, `bg-gray-400`). The dark-mode page background is `dark:bg-black`, which doesn't match the canonical dark neutral surface (`dark:bg-slate-900`/`950`) used elsewhere in the app. Input focus rings use `indigo-500` and the submit button uses solid `bg-indigo-600` — per `00-Color-System.md`, indigo is reserved as the brand-gradient partner only, not a standalone primary; the canonical solid primary is `purple-600`. The Google button's `hover:text-yellow-400` uses a deprecated hue (§7) with no other use in the app.
- **Design consistency:** Applies — compare directly against `Register.page.jsx`: focus-ring color differs between the two sibling auth pages (`indigo-500` here vs `emerald-500` there) for equivalent input fields — see `03-Register.md` for the matching finding. Fix both to the same canonical color in the same pass.
- **Correctness:** Applies — findings #1, #2, #3, #5.
- **Improvement opportunity:** None specific to this page found in `05-Upgrade-Ideas.md` beyond the general D1 (tests)/B2 (TypeScript) items, which are infrastructure-level and out of scope here.
- **Coding standard:** Applies — handler names use PascalCase (`HandleLogIn`, `HandleGoogleLogIn`) rather than the conventional React camelCase (`handleLogIn`); rename if the rest of the codebase follows camelCase for event handlers. Finding #7 (dead code) also applies here.
- **Comments:** N/A — no non-obvious business logic here beyond the fragile error-matching (finding #2), which should be fixed rather than explained via comment.
- **Accessibility:** Applies — finding #1 (label/input association), plus the already-documented password-toggle keyboard issue (`01-UI-UX-Issues.md` §2) and the dead "Forgot your password?" `<h1>` (`01-UI-UX-Issues.md` §3, both with ready-to-use fix code in `06-UI-Upgrade-Guide.md` Phase 1 §2-§3). Note: the theme-flash bug (`01-UI-UX-Issues.md` §1) affects this page visually since it's rendered inside `RootLayout` → `NavBar`, but the fix belongs in `NavBar.jsx`/`index.html`, not this file — out of scope for this prompt.

## Implementation Prompt

Apply these changes to `src/features/auth/Login.page.jsx`:

**1. Accessibility & correctness (do first):**
- Add `htmlFor="email"` to the Email Address `<label>` and `htmlFor="password"` to the Password `<label>`, matching the existing `id="email"`/`id="password"` on the inputs.
- Replace the password-visibility `<div onClick>` (lines 111-116) with a `<button type="button" aria-label={eye ? "Hide password" : "Show password"} aria-pressed={eye}>`, exactly per the diff in `06-UI-Upgrade-Guide.md` Phase 1 §2.
- Fix the "Forgot your password?" element per `06-UI-Upgrade-Guide.md` Phase 1 §3 — either wire `sendPasswordResetEmail` (Option A, recommended, Firebase is already installed) or remove the clickable-looking styling until it's built (Option B).
- Change `if (error == "FirebaseError: Firebase: Error (auth/invalid-credential).")` to `if (error.code === "auth/invalid-credential")`.
- Replace `<a href="/register" ...>` with `<Link to="/register">` (import `Link` from `react-router`), and align the casing to `/Register` to match the route definition in `PublicRoutes.jsx` exactly, or lowercase the route in `PublicRoutes.jsx` if that's the team's preferred casing convention — pick one and make both sides match.
- Add a submit-in-progress state: disable the submit button and show a small spinner/"Signing in..." label while `HandleLogIn`'s Firebase call is pending; same for the Google button during `HandleGoogleLogIn`.
- Remove the dead `// ref={emailRef}` comment and the commented-out `console.log` remnants.

**2. Color consistency — converge on `00-Color-System.md`:**
- Replace `gray-*` classes with their `slate-*` equivalents per the §2 pairing table (page background, card background, text, borders).
- Replace `dark:bg-black` on the page wrapper with `dark:bg-slate-950`.
- Replace `focus:ring-indigo-500 focus:border-indigo-500` on both inputs with `focus:ring-purple-500 focus:border-purple-500`.
- Replace the submit button's `bg-indigo-600 hover:bg-indigo-700` with `bg-purple-600 hover:bg-purple-700`.
- Replace `hover:text-yellow-400` on the Google button with an `amber` equivalent (e.g. `hover:text-amber-400`) or a neutral hover state.
- Apply the identical color changes to `Register.page.jsx` in the same pass so the two auth pages match exactly (see `03-Register.md`).

**3. Reusable extraction (coordinate with Register — implement once, use in both):**
- Extract a small `syncUserToBackend(firebaseUser)` utility (or a `useGoogleAuth()` hook) that builds the `newUser` payload and POSTs to `/users`, and use it from both this file's `HandleGoogleLogIn` and `Register.page.jsx`'s `HandleGoogleLogIn` (and optionally its email/password signup path). Don't implement this twice — if you're processing `03-Register.md` separately, do this extraction only once and reference it from both.

Preserve all existing Firebase auth calls, navigation behavior, and toast messaging — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Clicking "Email Address"/"Password" label text focuses the corresponding input.
- [ ] Password-eye toggle is reachable via Tab and activatable via Enter/Space, and announces its state to a screen reader.
- [ ] "Forgot your password?" either sends a reset email or no longer looks clickable.
- [ ] Entering a wrong password shows the "invalid credential" toast (verifies the `error.code` fix didn't break the existing message).
- [ ] "Register Now" navigates client-side (no full page reload) and lands on the registration form.
- [ ] Submit button shows a disabled/loading state during sign-in and can't be double-clicked into firing two requests.
- [ ] Page matches `Register.page.jsx` visually in both light and dark mode (background, input focus color, button color).
- [ ] No `gray-*` classes remain in this file.
