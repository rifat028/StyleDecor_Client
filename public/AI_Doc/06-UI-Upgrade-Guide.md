# UI Upgrade Guide — Fixing Every Issue in `01-UI-UX-Issues.md`

A step-by-step implementation guide, not just a diagnosis. Each item below maps 1:1 to an issue number in `01-UI-UX-Issues.md`, gives the exact file/line, and shows the actual code change — copy-paste ready, not pseudocode. Ordered into phases so the work can be done incrementally without a big-bang rewrite.

**How to use this doc:** work top to bottom within a phase; phases are ordered by dependency (Phase 1 fixes are prerequisites for some later ones — e.g. the shared `ThemeToggle` in Phase 3 replaces the two theme implementations you'll have already debugged in Phase 1 §1).

---

## Phase 1 — Correctness fixes (bugs, not polish)

### 1. Theme flash / render-body DOM mutation → §1

**Step 1 — stop mutating the DOM during render.** `src/layouts/DefaultLayout/NavBar.jsx:176-177`:
```diff
-  const html = document.querySelector("html");
-  html.setAttribute("data-theme", theme);
-
   return (
```
Replace with a `useEffect`, matching what `DashboardTopBar.jsx` already does correctly:
```jsx
useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);
```

**Step 2 — kill the flash on first paint.** Add a blocking inline script to `index.html`, before the app mounts:
```html
<!-- index.html, inside <head>, before any stylesheet -->
<script>
  (function () {
    var theme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
```
This runs synchronously before first paint, so the page never renders in the wrong theme even for a frame.

*(Full dedup of the theme logic into a shared `useTheme()` hook + `<ThemeToggle>` component happens in Phase 3 §7 — do that once, not per-file.)*

---

### 2. Password toggle not keyboard accessible → §2

`src/features/auth/Login.page.jsx:111-116` and `src/features/auth/Register.page.jsx:182-187` — identical fix in both files:
```diff
-              <div
-                className="absolute top-3 right-2"
-                onClick={() => setEye(!eye)}
-              >
-                {!eye ? <IoEye /> : <IoMdEyeOff />}
-              </div>
+              <button
+                type="button"
+                onClick={() => setEye(!eye)}
+                aria-label={eye ? "Hide password" : "Show password"}
+                aria-pressed={eye}
+                className="absolute top-2.5 right-2 p-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-300"
+              >
+                {!eye ? <IoEye /> : <IoMdEyeOff />}
+              </button>
```
(`type="button"` is required here — without it, inside a `<form>`, this button would submit the form when clicked.)

---

### 3. Dead "Forgot your password?" element → §3

`src/features/auth/Login.page.jsx:120-129`. Two valid fixes — pick one:

**Option A (ship the feature — recommended, it's ~10 lines with Firebase already installed):**
```diff
+import { sendPasswordResetEmail } from "firebase/auth";
+import { auth } from "../../lib/firebase.init";
...
+  const HandleReset = () => {
+    const email = prompt("Enter your account email to receive a reset link:");
+    if (!email) return;
+    sendPasswordResetEmail(auth, email)
+      .then(() => toast.success("Password reset email sent"))
+      .catch((error) => toast.error(error.message));
+  };
...
-              <h1
-                className="font-medium text-indigo-600 hover:text-blue-700 hover:underline dark:text-white"
-                // onClick={HandleReset}
-              >
+              <button
+                type="button"
+                onClick={HandleReset}
+                className="font-medium text-indigo-600 hover:text-blue-700 hover:underline dark:text-white"
+              >
                 Forgot your password?
-              </h1>
+              </button>
```
(A `prompt()` is a stopgap — swap for a small modal/input if you want a nicer flow, but even this un-breaks the affordance.)

**Option B (defer the feature):** remove the `hover:underline`/`hover:text-blue-700` classes and the element's button-like affordance entirely until it's wired up, so it stops looking clickable.

---

### 4. Footer `<a>` tags instead of `<Link>` → §4

`src/layouts/DefaultLayout/Footer.jsx:26-44`:
```diff
+import { Link } from "react-router";
...
-            <li><a href="/" className="link link-hover">Home</a></li>
-            <li><a href="/services" className="link link-hover">Services</a></li>
-            <li><a href="/about" className="link link-hover">About</a></li>
-            <li><a href="/contact" className="link link-hover">Contact</a></li>
+            <li><Link to="/" className="link link-hover">Home</Link></li>
+            <li><Link to="/services" className="link link-hover">Services</Link></li>
+            <li><Link to="/about" className="link link-hover">About</Link></li>
+            <li><Link to="/contact" className="link link-hover">Contact</Link></li>
```
Apply the same swap to the logo links: `NavBar.jsx:216` (`<a href="/">` → `<Link to="/">`) and `SideNavigation.jsx:107` (same).

---

### 5. Dead footer social links → §5

`src/layouts/DefaultLayout/Footer.jsx:65-76`. Either supply real URLs:
```diff
-            <a href="#" className="btn btn-circle btn-sm btn-outline">
+            <a href="https://facebook.com/styledecor" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-outline">
               <FaFacebookF />
             </a>
```
...or, if the accounts don't exist yet, remove the four icons entirely rather than shipping dead links — a missing social row reads as "not launched yet," a dead link reads as broken.

---

### 6. Mobile nav doesn't close after tapping a link → §6

`src/layouts/DefaultLayout/NavBar.jsx` — the mobile dropdown `<ul>` at lines 207-213 renders `{links}`. Close it on selection by blurring the active element (DaisyUI's `dropdown` closes on blur):
```diff
       {navLinks
         .filter((link) => !link.authOnly || user)
         .map(({ to, label, icon: Icon }) => (
           <li key={to} ref={(el) => (itemRefs.current[to] = el)}>
-            <NavLink to={to} className={linkClasses}>
+            <NavLink
+              to={to}
+              className={linkClasses}
+              onClick={() => document.activeElement?.blur()}
+            >
```
Since `links` is shared between the desktop center nav and the mobile dropdown (`NavBar.jsx:108-127`), this one change fixes mobile without touching desktop (blurring an already-non-focused desktop link is a no-op).

---

### 7. Duplicate/dead `ServiceBooking` page → *(covered operationally in `03-Frontend-Issues-And-Solutions.md` §2, listed here because deleting it also removes the `alert()` calls that would otherwise resurface as a UI inconsistency if this file were ever reconnected)*
```bash
rm src/features/customer/ServiceBooking.page.jsx
```
Already confirmed zero references outside itself.

---

## Phase 2 — Accessibility & motion

### 8. Carousel has no keyboard/touch support → §7

`src/features/home/components/TopRatedDecorators.jsx`. Add keyboard support and pause-when-offscreen:

```diff
   const [isHovered, setIsHovered] = useState(false);
+  const [isVisible, setIsVisible] = useState(true);
+  const carouselRef = useRef(null);
+
+  useEffect(() => {
+    const el = carouselRef.current;
+    if (!el) return;
+    const observer = new IntersectionObserver(
+      ([entry]) => setIsVisible(entry.isIntersecting),
+      { threshold: 0.2 }
+    );
+    observer.observe(el);
+    return () => observer.disconnect();
+  }, []);
```
```diff
   useEffect(() => {
-    if (isHovered || displayList.length === 0) return;
+    if (isHovered || !isVisible || displayList.length === 0) return;
     const interval = setInterval(() => {
       setActiveIndex((prev) => (prev + 1) % displayList.length);
     }, 3500);
     return () => clearInterval(interval);
-  }, [isHovered, displayList.length]);
+  }, [isHovered, isVisible, displayList.length]);
```
```diff
       <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
+        {/* attach the ref + keyboard handling to the outer carousel wrapper */}
+        <div
+          ref={carouselRef}
+          tabIndex={0}
+          role="region"
+          aria-label="Top rated decorators carousel"
+          onKeyDown={(e) => {
+            if (e.key === "ArrowLeft") handlePrev();
+            if (e.key === "ArrowRight") handleNext();
+          }}
+          className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-3xl"
+        >
         {/* Navigation Buttons ... existing content unchanged ... */}
+        </div>
```
(Wrap the existing prev/next buttons + viewport + pagination dots inside this new `div` rather than duplicating them — the diff above shows the wrapper boundary only.)

---

### 9. Motion ignores `prefers-reduced-motion` → §8

**CSS keyframes** — `src/app/index.css`, gate the marquee/spin animations:
```diff
 @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
+
+@media (prefers-reduced-motion: reduce) {
+  * {
+    animation-duration: 0.01ms !important;
+    animation-iteration-count: 1 !important;
+    transition-duration: 0.01ms !important;
+  }
+}
```
This is the blanket, low-effort version (freezes all CSS animation/transition for users who've opted out at the OS level) — safe to apply globally since none of the current CSS-driven animations (marquee, spin, sliding nav indicator) are functionally required, only decorative.

**`framer-motion` loops** — `src/features/home/components/Banner.jsx`, gate the 6 floating-badge `animate={{ y: [...] }}` loops:
```diff
+import { motion, useReducedMotion } from "framer-motion";
...
 const Banner = () => {
   const navigate = useNavigate();
+  const shouldReduceMotion = useReducedMotion();
...
       <div className="hidden lg:block absolute left-10 xl:left-24 top-[20%]">
         <motion.div
-          animate={{ y: [0, -15, 0] }}
-          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
+          animate={shouldReduceMotion ? {} : { y: [0, -15, 0] }}
+          transition={shouldReduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
```
Apply the same `shouldReduceMotion ? {} : {...}` pattern to the other 5 `motion.div` blocks in the same file (lines ~141-195).

---

### 10. Modals have no focus trap / Escape-to-close → *(referenced under §6 "Modal shell" in `02-Reusable-Components.md`, fixed here since it's user-facing accessibility)*

Add to `src/components/ui/LogoutModal.jsx` (and reuse this pattern in the shared `<Modal>` built in Phase 3 §6):
```diff
+import { useEffect, useRef } from 'react';
...
 const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
+  const dialogRef = useRef(null);
+
+  useEffect(() => {
+    if (!isOpen) return;
+    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
+    document.addEventListener("keydown", handleKeyDown);
+    dialogRef.current?.focus();
+    return () => document.removeEventListener("keydown", handleKeyDown);
+  }, [isOpen, onClose]);
+
   if (!isOpen) return null;
 
   return createPortal(
-    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
-      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
+    <div
+      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
+      onClick={onClose}
+    >
+      <div
+        ref={dialogRef}
+        tabIndex={-1}
+        role="dialog"
+        aria-modal="true"
+        aria-labelledby="logout-modal-title"
+        onClick={(e) => e.stopPropagation()}
+        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800"
+      >
```
And tag the title: `<h3 id="logout-modal-title" ...>Sign Out</h3>`. (A full focus *trap* — preventing Tab from leaving the dialog — needs a small library like `focus-trap-react`; the Escape + backdrop-click + initial-focus above covers the highest-impact 80% without a new dependency.)

---

## Phase 3 — Consolidate into shared components (do this once, benefits every future page)

This phase builds the components proposed in `02-Reusable-Components.md` — do it here so Phase 1/2 fixes (theme, modal a11y) live in exactly one place instead of being re-patched per file.

### 7. `useTheme()` hook + `<ThemeToggle>` component

```js
// src/hooks/useTheme.js
import { useState, useEffect, useCallback } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
};
```
```jsx
// src/components/ui/ThemeToggle.jsx
import { Sun } from "lucide-react";
import { PiMoonStarsFill } from "react-icons/pi";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title="Toggle Dark Mode"
      aria-label="Toggle dark mode"
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200/70 bg-linear-to-br from-white to-blue-50 text-blue-500 shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/20 active:translate-y-0 active:scale-95 dark:border-white/10 dark:from-slate-800 dark:to-slate-900 dark:text-blue-300 dark:ring-white/5"
    >
      <span className="relative block h-5 w-5 overflow-hidden">
        <Sun className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-out ${theme !== "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
        <PiMoonStarsFill className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-out ${theme !== "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
      </span>
    </button>
  );
};
export default ThemeToggle;
```
Then in both `NavBar.jsx` and `DashboardTopBar.jsx`, delete the local `theme`/`setTheme`/`toggleTheme`/`themeToggleButton` block entirely and replace with:
```jsx
<ThemeToggle />
```
This deletes ~25 duplicated lines from each of the two files and is the single fix point for issue §1 going forward.

### 11. `<UserMenu>` component (dedupe the profile dropdown)

```jsx
// src/components/ui/UserMenu.jsx
import { NavLink } from "react-router";
import { Palette, LogOut, ArrowRight } from "lucide-react";

const UserMenu = ({ user, role, roleLoading, onLogoutClick }) => (
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="relative rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all p-0.5">
      <img src={user.photoURL} alt="profile" className="rounded-full h-10 w-10 sm:h-11 sm:w-11 object-cover" />
      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-base-100" />
    </div>
    <ul tabIndex={0} className="dropdown-content mt-4 w-72 rounded-2xl shadow-2xl z-100 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 p-3 space-y-2">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <li className="px-4 py-2 hover:bg-transparent cursor-default">
        <div className="flex flex-col gap-1 items-start">
          <span className="font-bold text-base truncate w-full text-gray-800 dark:text-gray-100">{user?.displayName || "User"}</span>
          <span className="text-xs opacity-70 truncate w-full text-gray-500 dark:text-gray-400">{user?.email}</span>
        </div>
      </li>
      <div className="h-px bg-gray-200 dark:bg-white/10 mx-2 my-2" />
      {!roleLoading && (role === "customer" || role === "client") && (
        <li>
          <NavLink to="/join-as-decorator" className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-linear-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-300 ease-out">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
              <Palette className="h-4 w-4" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold">Join as Decorator</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300">Showcase your talent</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </NavLink>
        </li>
      )}
      <li>
        <button onClick={onLogoutClick} className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-linear-to-r hover:from-red-500 hover:to-rose-600 hover:shadow-md hover:shadow-red-500/25 transition-all duration-300 ease-out">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
            <LogOut className="h-4 w-4" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold">Log Out</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300">See you later</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
        </button>
      </li>
    </ul>
  </div>
);
export default UserMenu;
```
Usage in `NavBar.jsx` (replaces lines 264-340) and `DashboardTopBar.jsx` (replaces lines 83-151):
```jsx
<UserMenu user={user} role={role} roleLoading={roleLoading} onLogoutClick={() => setIsLogoutModalOpen(true)} />
```

### 6. `<Modal>` shell (wraps the Phase 2 §10 a11y fix so every future modal gets it for free)

```jsx
// src/components/ui/Modal.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SIZES = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

const Modal = ({ isOpen, onClose, title, children, size = "md", footer }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-slate-900 rounded-3xl w-full ${SIZES[size]} border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 shrink-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
export default Modal;
```
Migrate `ManageUser.page.jsx`'s view/edit modals (lines 739-1023) and `ManageServices.page.jsx`'s view modal (lines 643-776) onto this — each becomes `<Modal isOpen={...} onClose={...} title="...">{/* just the form/content */}</Modal>`, dropping the hand-rolled backdrop/header/close-button boilerplate from both.

---

## Phase 4 — Form & polish fixes

### 12. Register form UX (§10, §11, §12 together — same file, do in one pass)

`src/features/auth/Register.page.jsx`:

**Confirm-password field (§10):**
```diff
   const [error, setError] = useState("");
+  const [confirmPassword, setConfirmPassword] = useState("");
...
     const password = e.target.password.value;
+    if (password !== confirmPassword) {
+      setError("Passwords do not match");
+      return;
+    }
```
```diff
             <div className="mt-1 relative">
               <input name="password" type={eye ? "text" : "password"} ... />
               ...
             </div>
           </div>
+
+          <div>
+            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
+              Confirm Password<span className="text-red-500">*</span>
+            </label>
+            <input
+              type={eye ? "text" : "password"}
+              required
+              value={confirmPassword}
+              onChange={(e) => setConfirmPassword(e.target.value)}
+              placeholder="Re-enter your password"
+              className="dark:bg-gray-700 appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
+            />
+          </div>
```

**Live password-rule checklist (§11)** — replace the submit-only `setError` checks with a derived live status, rendered under the password field:
```diff
+  const [passwordInput, setPasswordInput] = useState("");
+  const passwordRules = [
+    { label: "At least 6 characters", pass: passwordInput.length >= 6 },
+    { label: "One uppercase letter", pass: passwordUpperCase.test(passwordInput) },
+    { label: "One lowercase letter", pass: passwordLowerCase.test(passwordInput) },
+  ];
```
```diff
               <input
                 name="password"
                 type={eye ? "text" : "password"}
+                value={passwordInput}
+                onChange={(e) => setPasswordInput(e.target.value)}
                 placeholder="Create a strong password"
                 required
                 className="..."
               />
+              <ul className="mt-1.5 space-y-0.5 text-xs">
+                {passwordRules.map((r) => (
+                  <li key={r.label} className={r.pass ? "text-emerald-600" : "text-gray-400"}>
+                    {r.pass ? "✓" : "○"} {r.label}
+                  </li>
+                ))}
+              </ul>
```
(Keep the existing submit-time `setError` checks as the final gate — the checklist is progressive disclosure, not a replacement for validation.)

**Invalid input type (§12):**
```diff
-                type="photoUrl"
+                type="url"
```

### 13. Missing favicon → §13

Add a real icon file, e.g. `public/favicon.svg` (reuse `src/assets/logos/*square-logo.png`, exported/converted to `.svg` or `.ico`), then:
```diff
-    <link rel="icon" type="image/svg+xml" href="" />
+    <link rel="icon" type="image/png" href="/favicon.png" />
```

### 14. Missing meta description → §14

```diff
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <meta name="description" content="Book verified decorators for weddings, birthdays, and corporate events across Bangladesh — transparent pricing, instant booking, escrow-safe payments." />
+    <meta property="og:title" content="StyleDecor — Book Verified Event Decorators" />
+    <meta property="og:description" content="Book verified decorators for weddings, birthdays, and corporate events across Bangladesh." />
+    <meta property="og:type" content="website" />
     <title>StyleDecor</title>
```

### 9. Emoji/icon mismatch (§9)

`src/features/home/components/Banner.jsx:138,158`:
```diff
-import { ArrowRight, Calendar, Users, Percent, Gift, Sparkles, Gem, Star, Heart } from "lucide-react";
+import { ArrowRight, Calendar, Users, Percent, Gift, Sparkles, Gem, Star, Heart, Ring } from "lucide-react";
...
-          <div className="text-3xl">💍</div>
+          <Ring className="w-8 h-8 text-purple-500" />
...
-          <div className="text-3xl">💐</div>
+          <Sparkles className="w-8 h-8 text-pink-500" />
```
(`lucide-react` doesn't ship a bouquet icon — reusing `Sparkles`, already imported for the top pill, keeps the icon vocabulary closed; swap for whichever lucide icon best matches your taste — the point is "no raw emoji next to styled icon components," not this exact pair.)

---

## Phase 4 — Dashboard Layout Standard: `<DashboardPageHeader>`

Every dashboard view across Admin, Decorator, Agent, and Customer panels must utilize the centralized `<DashboardPageHeader>` component (`src/components/ui/DashboardPageHeader.jsx`).

**Key Architectural Rules:**
1. **Frameless Header**: Never place the page header inside a white/dark card container with borders or internal padding.
2. **Responsive Typography**: Title must be `text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight` with a purple rounded icon box (`p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400`).
3. **Action Button Slots**: Standard Refresh Data button rendered via `onRefresh` prop; custom action buttons (e.g. "Create Service", "Add Project", "Book Service") passed via `actions` prop.
4. **Tapered Bottom Border**: Uses `h-[3px] w-full rounded-full bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent` to separate the header from the toolbar / data table below.

```jsx
<DashboardPageHeader
  icon={Calendar}
  title="My Bookings"
  subtitle="Track all your scheduled event setups, monitor assigned decorator agencies, and manage venue logistics."
  onRefresh={loadBookings}
  refreshing={refreshing}
  refreshDisabled={loading}
  actions={
    <Link to="/services" className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      <span>Book New Service</span>
    </Link>
  }
/>
```

---

## Verification checklist

After applying each phase, confirm:

- [ ] Toggle dark mode, hard-refresh (Cmd+Shift+R) on both `/` and `/dashboard` — no flash of the wrong theme.
- [ ] Tab through the Login/Register forms using only the keyboard — the password-eye toggle and (once wired) "Forgot password" are both reachable and announce correctly with a screen reader.
- [ ] Open the mobile hamburger menu on a narrow viewport, tap a link — menu closes.
- [ ] `npx eslint src --quiet` — should show fewer unused-var errors as dead state gets connected (rating distribution, etc. — tracked in `03-Frontend-Issues-And-Solutions.md` §11, not strictly a UI issue but touched by Phase 3 modal work).
- [ ] `npx vite build` — bundle warnings unrelated to this doc (code splitting, image size) are tracked separately in `03-Frontend-Issues-And-Solutions.md` §8-9 and `05-Upgrade-Ideas.md` §C1-C2.
- [ ] Every deleted/replaced component (`ThemeToggle`, `UserMenu`, `Modal`) is used identically in both `NavBar.jsx`/`DashboardTopBar.jsx` and both admin pages touched — no visual regression between light/dark and desktop/mobile.
