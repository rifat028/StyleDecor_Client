# Frontend Issues & Solutions

Verified via direct code reads, `npx eslint src`, and an actual `npx vite build`. Severity: 🔴 Critical (can break the app / production) · 🟡 Moderate (real bug or debt) · 🟢 Minor (cleanup).

---

## 1. 🔴 Case-mismatched import — latent production build breaker

**File:** `src/main.jsx:6`
```js
import router from "./routes/PublicRoutes.jsx";
```
The actual folder on disk is `src/Routes/` (capital **R**) — confirmed via `ls src/`. This resolves today only because the developer's filesystem (macOS/Windows) is case-insensitive. **Vite/Rollup module resolution on a case-sensitive Linux CI/build server (Vercel, Netlify, most Docker-based CI) will fail to resolve this import**, breaking the production build entirely. A local `npx vite build` here succeeds silently for the same reason — it gives false confidence.

**Fix:**
```js
import router from "./Routes/PublicRoutes.jsx";
```
Then add a guard so this class of bug can't recur silently: enable `import/no-unresolved` (via `eslint-plugin-import`) or simply rename the folder to lowercase `routes` (matching the rest of the codebase's lowercase folder convention — `hooks`, `lib`, `layouts`, `features`) and fix the import to match, whichever direction the team prefers.

---

## 2. 🔴 Dead, duplicate `ServiceBooking` page with real bugs still in it

**File:** `src/features/customer/ServiceBooking.page.jsx` (374 lines) — **not imported by any route** (verified: `grep -rn "ServiceBooking" src/Routes/` only matches `src/features/services/ServiceBooking.page.jsx`, the one actually used).

The dead file is a strictly worse, earlier version of the same screen and still contains bugs a future developer could reintroduce by editing the wrong file:
- `alert("✅ Booking submitted!")` / `alert("❌ Failed to create booking...")` (lines 79, 84) — blocking native browser dialogs, inconsistent with the app's toast/SweetAlert2 convention used everywhere else.
- `e.target.reset;` (line ~85, verify exact) — missing `()`, so the form never actually resets (a no-op statement).
- No `min` on the unit/date inputs, so negative units and past booking dates are accepted — the *live* `features/services/ServiceBooking.page.jsx` already fixed this (`min={minSelectableDate}` at line 463, `min="10"` at line 487), meaning this fix was made in one copy and never removed from the other.

**Fix:** Delete `src/features/customer/ServiceBooking.page.jsx`. Confirm nothing else references it first (already confirmed — zero references outside itself).

---

## 3. 🔴 No ErrorBoundary anywhere — one bad render = white screen

**Files:** entire `src/` tree — `grep -rl "ErrorBoundary\|componentDidCatch" src` returns nothing.

Given the amount of optional chaining and fallback-heavy data shaping throughout the app (`service?.cost * unit`, `metrics?.rating || rating || 5.0`, etc.), a single unexpected API response shape will throw during render and — with no boundary anywhere in the tree — take down the *entire* app to a blank white page, with no recovery UI and no error reporting.

**Fix:** Add a top-level `ErrorBoundary` around `<RouterProvider />` in `main.jsx`, and a second one per dashboard route group (`AdminRoutes`, `DecoratorRoutes`, `AgentRoutes`) so a crash in one admin page doesn't nuke the whole authenticated shell. React Router 7's route-level `errorElement` can also be used per-route in the `Routes/*.jsx` files for finer granularity.

---

## 4. 🔴 Dead `App.jsx` still imported (unused) in the entry point

**Files:** `src/main.jsx:4`, `src/app/App.jsx`, `src/app/App.css`

```jsx
// main.jsx
import App from "./app/App.jsx";   // imported...
...
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />   {/* ...but App is never rendered here */}
    </AuthProvider>
  </StrictMode>,
);
```
`App.jsx` itself is still the unmodified Vite template:
```jsx
function App() {
  return <h1 className="text-4xl font-bold">Vite + React</h1>;
}
```
Dead code and a dead CSS import, kept alive only by the unused `import App from "./app/App.jsx"` line, which is also unnecessary bytes in the bundle since Vite can't tree-shake a component that's imported even if unused in JSX (the import itself has side effects via `App.css`).

**Fix:** Delete the `import App from "./app/App.jsx";` line, delete `src/app/App.jsx` and `src/app/App.css`.

---

## 5. 🟡 Auth token refresh (401/403) handling is commented out

**File:** `src/hooks/useAxiosSecure.jsx:40-50`
```js
const resInterceptor = axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    const statusCode = error.status;
    if (statusCode === 401 || statusCode === 403) {
      //   logOutUser().then(() => {
      //     navigate("/login");
      //   });
    }
    return Promise.reject(error);
  },
);
```
When a Firebase token expires or the backend rejects a stale token, the interceptor detects it but does nothing — the user stays on the page with silently failing requests (spinners that never resolve, empty tables, toasts saying "Failed to load X") instead of being redirected to log back in. This directly explains *why* so many components need defensive `catch` blocks with generic "Failed to load..." toasts — they're masking auth expiry as a generic error.

Also note: `error.status` is very likely wrong — Axios puts the HTTP status on `error.response.status`, not `error.status`, so even if uncommented this check would rarely fire.

**Fix:**
```js
(error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    logOutUser().finally(() => navigate("/login"));
  }
  return Promise.reject(error);
}
```
Remove the `console.log(error)` (see §6).

---

## 6. 🟡 124 `console.log`/`console.warn`/`console.error` calls ship to production

**Files:** entire tree — `grep -rn "console\.\(log\|warn\|error\)" src` returns 124 matches, including request/response noise like the interceptor above and pure debug leftovers (e.g. `// console.log(result.user)` commented-out lines that were clearly active during development in `Login.page.jsx`, `Register.page.jsx`).

This isn't just noise: several of these (`useRole.jsx:55`, `useAxiosSecure.jsx:41`) log full error objects — potentially including response bodies or tokens — to the browser console in production, visible to anyone who opens devtools.

**Fix:** Add `no-console` to `eslint.config.js` (allow `warn`/`error` if desired, ban bare `log`), and either strip remaining `console.error` calls or route them through a single `logError()` utility that can be swapped for a real error-tracking service (Sentry, etc.) later without touching 124 call sites.

---

## 7. 🟡 Hardcoded production API URL, no environment variables

**File:** `src/hooks/useAxiosSecure.jsx:6-9`
```js
const axiosSecure = axios.create({
  baseURL: "https://style-decor-server-woad.vercel.app",
  // baseURL: "http://localhost:3000",
});
```
No `.env` file exists in the repo (verified — `ls .env*` finds nothing) and no `import.meta.env.VITE_*` usage anywhere. Switching to a local backend for development means editing source code and remembering not to commit the swap — an easy way to accidentally deploy a build pointed at `localhost:3000`, or to permanently lose the ability to point staging builds at a different API without a code change.

**Fix:**
```
# .env
VITE_API_BASE_URL=https://style-decor-server-woad.vercel.app
```
```js
baseURL: import.meta.env.VITE_API_BASE_URL,
```
Add `.env` to `.gitignore` (check first — it may already be covered by a wildcard) and commit a `.env.example`.

---

## 8. 🟡 No code splitting — 1.77 MB single JS chunk

**Evidence:** real `npx vite build` output:
```
dist/assets/index-8182Ol80.css   260.05 kB │ gzip:  33.26 kB
dist/assets/index-lBG0QsWS.js  1,771.51 kB │ gzip: 451.64 kB
(!) Some chunks are larger than 500 kB after minification.
```
Every route (`Routes/PublicRoutes.jsx`, `AdminRoutes.jsx`, `DecoratorRoutes.jsx`, `AgentRoutes.jsx`) statically imports its page component (`import ManageUser from "../features/admin/ManageUser.page"`, etc. — verified pattern), so a first-time visitor hitting the public homepage downloads the entire admin dashboard, agent dashboard, and decorator dashboard bundles up front, even though 99% of visitors will only ever see the public site.

**Fix:** Convert route-level imports to `React.lazy()` + `<Suspense>`:
```jsx
const ManageUser = lazy(() => import("../features/admin/ManageUser.page"));
```
wrapped once at the router/layout level with a single `<Suspense fallback={<Spinner />}>`. This alone should cut the initial public-site bundle by a large fraction, since the admin/agent/decorator dashboards make up a large share of the 76 `.jsx` files.

---

## 9. 🟡 Multi-megabyte unoptimized images shipped as-is

**Evidence:** same build output:
```
dist/assets/Avatar-BGKKuyfl.jpg           3,438.06 kB
dist/assets/img-03-CtUCiCUm.png           3,230.84 kB
dist/assets/img-05-UbHwPIwE.png           2,907.80 kB
dist/assets/img-04-D2faDmix.png           2,849.62 kB
dist/assets/img-02-Dyh5d4Ms.png           2,674.03 kB
dist/assets/img-06-DjkylK6s.png           2,211.66 kB
dist/assets/img-01-Btx9QDFx.png           2,039.97 kB
dist/assets/dark-logo-CNtCVYpo.png          971.11 kB
dist/assets/light-logo-CI3k3RpO.png         887.74 kB
```
These six `img-0*` files are the **Categories** homepage thumbnails — rendered at `w-28 h-28`/`w-40 h-40` (`Categories.jsx:89`, i.e. ~112-160px on screen) but shipped as multi-megabyte, presumably multi-thousand-pixel PNGs. `Avatar.jpg` (3.4MB) is a single fallback avatar image, imported and used at avatar sizes (~40-100px) throughout `TopRatedDecorators.jsx`. The two logo PNGs (~900KB each) render at `h-10`/`h-14` in the nav — roughly 40-56px tall.

**Fix:** Convert to WebP/AVIF and resize to realistic display dimensions (2x for retina is plenty — e.g. 320px for the category thumbnails, not whatever multi-thousand-pixel source these currently are). A quick pass through `vite-plugin-image-optimizer` or manually re-exporting the source assets would likely cut total image weight by >90%, which matters a lot on the mobile connections this Bangladesh-focused product's users are likely on.

---

## 10. 🟡 Stale role cache after an admin changes a user's role

**File:** `src/Hooks/useRole.jsx:30-34`
```js
const cachedRole = localStorage.getItem(`styledecor_user_role_${email}`);
if (cachedRole) {
  setRole(cachedRole);
  setLoading(false);
}
```
The role is cached in `localStorage` indefinitely per email, with no expiry and no invalidation hook. If an admin promotes/demotes a user via `ManageUser.page.jsx`'s "Quick Role Switch" while that user has an active session elsewhere, their sidebar/nav (`SideNavigation.jsx`) will keep showing the *old* role's menu items until they manually log out and back in — the fetch does happen in the background and *will* eventually call `setRole(fetchedRole)`, but only after already having shown the stale cached role first, and there's no re-fetch trigger (window focus, interval, etc.) for an already-mounted session.

**Fix:** This is a reasonable "instant paint" optimization to keep, but pair it with either a short TTL (store `{ role, cachedAt }` and refetch if `cachedAt` is older than e.g. 5 minutes) or a `visibilitychange`/`focus` listener that revalidates in the background.

---

## 11. 🟢 38 ESLint `no-unused-vars` errors — dead state, half-wired features

**Evidence:** `npx eslint src --quiet` output, 38 errors across 16 files. A sample of the more meaningful ones (not just leftover imports):

- `features/home/components/FeaturedReviews.jsx:69-70` — `loading`, `currentIndex`, `setCurrentIndex` are all declared and set but never read anywhere in the render — strongly suggests a carousel/loading-state UI that was designed but never wired into JSX.
- `features/decorators/TopDecorators.page.jsx:68,103` — `loadingDetails` and `handleOpenDetails` unused — a "view decorator details" interaction appears to be half-built and not connected to any button.
- `features/services/ServiceDetails.page.jsx:40` — `ratingDistribution` is fetched from `/reviews/service/:id` (`revRes.data.ratingDistribution`) and stored in state, but never rendered — the per-star rating breakdown bar chart implied by this data is missing from the actual reviews UI (`ServiceDetails.page.jsx:379-497` only shows the aggregate average, not the distribution).
- `features/decorators/DecoratorProfile.page.jsx:157-158` — `facebook`, `instagram` declared but unused — social links likely intended for the profile but not rendered.
- `layouts/DefaultLayout/NavBar.jsx:112` — `Icon` destructured from the nav link map but never used in that scope (the actual icon render on line 117 shadows it via a different binding) — harmless today but a sign the component could use a cleanup pass.

**Fix:** Run `npx eslint src --fix` for the mechanical parts (unused imports), then for each unused *state variable* (as opposed to unused imports), decide per-case: either finish wiring the feature (rating distribution bar chart is a good, cheap win — the data is already fetched) or remove the dead state.

---

## 12. 🟢 Unknown DaisyUI `@property` at-rule build warning

**Evidence:** `npx vite build` output:
```
Found 1 warning while optimizing generated CSS:
@property --radialprogress { ... }
Unknown at rule: @property
```
Cosmetic today (build still succeeds), but worth tracking — it means the CSS minifier (Lightning CSS via Tailwind v4) doesn't yet recognize `@property`, which DaisyUI's `radialprogress` component relies on for its animated gradient. If `radialprogress` is used anywhere (not currently found in the scanned files) it may not animate correctly in all browsers.

**Fix:** No action needed unless `radial-progress` DaisyUI class is adopted; if it is, verify the animation renders correctly cross-browser and consider pinning/upgrading the Tailwind/Lightning CSS version if the warning persists.
