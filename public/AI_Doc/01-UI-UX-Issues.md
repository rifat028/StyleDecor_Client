# UI/UX Issues

Each item lists the affected file(s), what's wrong, why it hurts the user, and a concrete fix. Severity: 🔴 High (breaks task or excludes users) · 🟡 Medium (friction/inconsistency) · 🟢 Low (polish).

---

## 1. 🔴 Theme flash / inconsistent dark-mode wiring
**Files:** `src/layouts/DefaultLayout/NavBar.jsx:176-177`, `src/layouts/DashBoardLayout/DashboardTopBar.jsx:30-33`

`NavBar.jsx` sets the theme directly during render:
```jsx
const html = document.querySelector("html");
html.setAttribute("data-theme", theme);
```
`DashboardTopBar.jsx` does the same thing correctly, inside `useEffect`. There's also no inline script in `index.html` to set `data-theme` before React hydrates, so every page load briefly renders in the default (light) theme before flipping to the user's saved choice — a visible flash for anyone using dark mode.

**Fix:** Add a tiny blocking script in `index.html`'s `<head>` that reads `localStorage.theme` and sets `data-theme` before first paint; remove the render-body mutation from `NavBar.jsx` and rely on the same `useEffect` pattern everywhere (or better, lift theme state into a shared `ThemeContext`/`useTheme` hook — see `02-Reusable-Components.md`).

---

## 2. 🔴 Password visibility toggle is not keyboard accessible
**Files:** `src/features/auth/Login.page.jsx:111-116`, `src/features/auth/Register.page.jsx:182-187`

```jsx
<div className="absolute top-3 right-2" onClick={() => setEye(!eye)}>
  {!eye ? <IoEye /> : <IoMdEyeOff />}
</div>
```
A `<div onClick>` cannot be reached via Tab and has no `aria-label`, so screen-reader and keyboard-only users cannot toggle password visibility (and screen readers announce nothing when it's activated).

**Fix:** Use `<button type="button" aria-label="Show password" aria-pressed={eye}>`.

---

## 3. 🟡 "Forgot your password?" is a dead, non-interactive element
**File:** `src/features/auth/Login.page.jsx:120-129`

```jsx
<h1 className="font-medium text-indigo-600 hover:text-blue-700 hover:underline dark:text-white"
    // onClick={HandleReset}
>
  Forgot your password?
</h1>
```
It's an `<h1>` (wrong semantic element — a page should have exactly one `<h1>`, already used above for "Welcome To StyleDecor"), styled to look clickable (`hover:underline`) but the handler is commented out and there's no `href`. Users will click it expecting a password-reset flow and nothing will happen.

**Fix:** Either wire up Firebase's `sendPasswordResetEmail` and turn it into a real `<button>`/`<Link>`, or remove the affordance (hover/underline styling) until the feature ships.

---

## 4. 🟡 Footer uses full-page `<a>` tags instead of client-side routing
**File:** `src/layouts/DefaultLayout/Footer.jsx:26-44`

All "Quick Links" (`Home`, `Services`, `About`, `Contact`) are plain `<a href="/services">`, which triggers a full browser navigation/reload instead of React Router's client-side transition used everywhere else in the app. Same issue for the logo links in `NavBar.jsx:216` and `SideNavigation.jsx:107` (`<a href="/">`).

**Fix:** Replace with `<Link to="...">` from `react-router`.

---

## 5. 🟡 Footer social icons are dead links
**File:** `src/layouts/DefaultLayout/Footer.jsx:65-76`

All four social buttons (`FaFacebookF`, `FaInstagram`, `FaTwitter`, `FaLinkedinIn`) point to `href="#"`. Clicking them jumps the page to the top and does nothing — confusing on a page with a footer far from the top.

**Fix:** Point to real profile URLs, or remove the icons until they exist. If genuinely absent, render them as disabled/greyed to signal "coming soon" rather than a working link.

---

## 6. 🟡 Mobile nav dropdown doesn't close after selecting a link
**File:** `src/layouts/DefaultLayout/NavBar.jsx:207-213` (the `dropdown-content` `<ul>` rendering `{links}`)

The hamburger menu is a DaisyUI `dropdown` with no close-on-navigate logic. After tapping a link on mobile, the menu can remain visually open/mid-animation, and there's no `onClick` handler to blur/close it, unlike many mobile nav patterns.

**Fix:** On `NavLink` click inside the mobile list, blur `document.activeElement` (DaisyUI dropdowns close on blur) or track an explicit `isMobileMenuOpen` state and close it in the link's `onClick`.

---

## 7. 🟡 Carousel has no keyboard or touch-swipe support
**File:** `src/features/home/components/TopRatedDecorators.jsx`

The 3D coverflow carousel (lines ~182-405) only responds to clicking the prev/next buttons or the pagination dots. There's no `onKeyDown` for arrow keys when the carousel is focused, and no swipe gesture handling — unexpected on a consumer-facing product where most traffic is mobile. It also keeps auto-advancing every 3.5s even when scrolled off-screen (no `IntersectionObserver` pause), burning CPU/battery for no visible benefit.

**Fix:** Add `onKeyDown` (`ArrowLeft`/`ArrowRight`) on the carousel container with `tabIndex={0}` and `role="region" aria-label="Top rated decorators"`; add basic touch handlers (`onTouchStart`/`onTouchEnd` delta) or swap in a small library; pause the `setInterval` when `!isIntersecting`.

---

## 8. 🟡 Motion-heavy homepage ignores `prefers-reduced-motion`
**Files:** `src/app/index.css:4-24` (marquee/spin keyframes), `src/features/home/components/Banner.jsx` (6 infinitely-looping `framer-motion` floating badges), `src/features/home/components/Categories.jsx` (`animate-spin-slow`, `animate-marquee-up/down`)

None of these animations check `prefers-reduced-motion: reduce`. For users with vestibular disorders (a real WCAG 2.1 SC 2.3.3 concern), the homepage is a wall of simultaneous infinite motion — spinning pyramid, two scrolling marquee columns, six independently bobbing floating badges, a sliding nav indicator.

**Fix:** Wrap the CSS animations in `@media (prefers-reduced-motion: no-preference) { ... }`, and gate `framer-motion` loops with `useReducedMotion()` from `framer-motion`.

---

## 9. 🟢 Emoji icons mixed with lucide-react icon components
**File:** `src/features/home/components/Banner.jsx:138,158`

Two of the five floating badges use raw emoji (`💍`, `💐`) while the other three use styled `lucide-react` icons (`Heart`, `Star`, `Gift`) with consistent stroke width and color treatment. Emoji render inconsistently across OS/browser (different art style, can't be recolored, no dark-mode adaptation), breaking the otherwise polished icon language.

**Fix:** Replace the two emoji with matching lucide icons (`Gem`/`Sparkle` already imported elsewhere in the same file for exactly this purpose).

---

## 10. 🟢 Register form has no "confirm password" field
**File:** `src/features/auth/Register.page.jsx`

Password rules (`≥6 chars`, needs uppercase, needs lowercase) are validated but there's no second field to catch a typo — a mistyped password on account creation means the user is locked out immediately with no idea why.

**Fix:** Add a `confirmPassword` field with a match check before the existing rule checks.

---

## 11. 🟢 Password rules only surface after clicking submit
**File:** `src/features/auth/Register.page.jsx:42-54`

`HandleRegister` validates password strength inline and calls `setError(...)`, but this only runs `onSubmit` — there's no live feedback (checklist/strength meter) while the user types, so they discover the 3 separate rules one submit-click at a time.

**Fix:** Compute rule pass/fail on every keystroke and render a small checklist (✓ 6+ characters, ✓ uppercase, ✓ lowercase) under the password field.

---

## 12. 🟢 Invalid HTML input type
**File:** `src/features/auth/Register.page.jsx:163` — `<input name="photoUrl" type="photoUrl" .../>`

`type="photoUrl"` isn't a valid HTML input type; browsers silently fall back to `type="text"`. On mobile this means the URL-optimized keyboard (with `/` and `.com` shortcuts) never appears.

**Fix:** `type="url"`.

---

## 13. 🟢 No favicon
**File:** `index.html:5` — `<link rel="icon" type="image/svg+xml" href="" />`

The `href` is empty, so the browser tab shows a blank/default icon. The brand has square logo assets already (`src/assets/logos/*square*.png`) that could be reused.

**Fix:** Point `href` at a real favicon file (add `.ico`/`.svg` to `public/`).

---

## 14. 🟢 Missing `<meta name="description">`
**File:** `index.html`

No meta description exists, which hurts link previews (social shares) and SEO snippet quality for a public-facing booking marketplace.

**Fix:** Add a one-line `<meta name="description" content="...">` plus Open Graph tags (`og:title`, `og:image`) since this is a consumer product people will share.
