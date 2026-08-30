# StyleDecor_Client — Codebase Audit

**Date:** 2026-08-30
**Stack:** Vite 7 · React 19 · React Router 7 (data router) · Tailwind v4 / DaisyUI · Firebase Auth · Axios
**Size:** ~144 JS/JSX files · ~30,800 LOC · 0 tests · no CI

---

## Overall Score: **58 / 100**

A functional, feature-rich marketplace (customer / decorator / agent / admin roles) with a large, mostly coherent product surface. The score is held down by engineering hygiene — not by the product.

---

## Score Table

| # | Parameter | Score | Weight |
|---|---|---|---|
| 1 | Architecture & Structure | 13 | / 20 |
| 2 | Code Quality & Consistency | 11 | / 20 |
| 3 | State & Data Layer | 8 | / 15 |
| 4 | Auth & Security | 9 | / 15 |
| 5 | Tooling & CI | 4 | / 10 |
| 6 | Testing | 0 | / 10 |
| 7 | Performance | 4 | / 10 |
| 8 | Documentation & Repo Hygiene | 6 | / 10 |
| | **Total** | **58** | **/ 100** |

---

## 1. Architecture & Structure — 13 / 20

### Current state
- Three parallel component homes: `src/features/*` (page containers), `src/components/pages/{Admin,Customer,Decorator}/*` (Toolbar/Table/Modals triplets), `src/components/ui/*` (shared primitives). A reader cannot predict where a screen's code lives.
- `src/Routes/PublicRoutes.jsx` is misnamed — it is the **entire** router (public + private + dashboard + admin/agent/decorator), and it imports `AdminRoutes`, `AgentRoutes`, etc.
- Route protection is per-element: every admin route individually wrapped `<AdminRoutes><ManageX/></AdminRoutes>` (~15 repetitions).
- `AdminRoutes.jsx` / `DecoratorRoutes.jsx` / `AgentRoutes.jsx` are near-duplicate files (differ only by the role string; `AgentRoutes` even uses `useContext` vs `use()`).
- Duplicate/alias routes to the same component: `/decorators` & `/top-decorators`; `/join-as-decorator` & `/become-a-decorator`; `/service-booking/:id` & `/services/:id/book`; `/dashboard/manage-transactions` & `/dashboard/manage-payments`.
- Dead file: `src/features/customer/ServiceBooking.page.jsx` (374 lines, old `alert()` version) — imported nowhere; the routed one is `src/features/services/ServiceBooking.page.jsx` (782 lines).
- `src/app/App.jsx` is still the Vite starter stub (`<h1>Vite + React</h1>`), imported only for its CSS side-effect.
- Directory-casing inconsistency: `src/Routes`, `src/Hooks`, `src/layouts/DashBoardLayout` (PascalCase / mixed) vs `src/features`, `src/lib` (lowercase). Imports use lowercase (`../hooks/...`, `./routes/...`) — see §4/§5, this is also a build risk.

### Steps to reach 20 / 20
1. **Pick one component taxonomy.** Move each screen's Toolbar/Table/Modals from `src/components/pages/<Role>/<Screen>/` into that screen's feature folder: `src/features/<feature>/components/`. Delete `src/components/pages/`. Keep only genuinely cross-feature primitives in `src/components/ui/`.
2. **Rename the router file** `PublicRoutes.jsx` → `router.jsx` (or split into `router.jsx` + `routes/*.jsx` fragments).
3. **Convert per-element guards to nested route objects.** One guarded layout route per role:
   ```jsx
   { path: "manage", element: <RoleRoute allow="admin" />, children: [
       { path: "users", element: <ManageUser/> }, ... ] }
   ```
4. **Collapse the three guard files into one** `src/routes/RoleRoute.jsx` taking `allow="admin" | "decorator" | "agent"` (and a plain `PrivateRoute` for auth-only). Use `use(AuthContext)` consistently.
5. **Delete dead code:** `src/features/customer/ServiceBooking.page.jsx`, `src/app/App.jsx` + `App.css` (import `index.css` from `main.jsx` instead), `migrate.cjs`.
6. **Remove alias routes** — keep one canonical path per screen, add redirects only if external links depend on the old ones.
7. **Normalize directory casing** to lowercase (`hooks/`, `routes/`, `layouts/dashboard-layout/`) via `git mv`, and add a Vite path alias (`@/`) so imports stop climbing `../../../`.

---

## 2. Code Quality & Consistency — 11 / 20

### Current state
- **`npm run lint` fails: 30 errors** (all `no-unused-vars` — dead imports/vars across ~15 files) + 4 `react-hooks/exhaustive-deps` warnings.
- **~110 live `console.*`** across 40+ files (`useAxiosSecure.jsx:41` logs every axios error; empty `console.log();` in `about/components/HowItWorks.jsx:8`).
- **God components:** 14 files > 400 lines — `ServiceBooking.page.jsx` (782), `DecoratorProfile.page.jsx` (666), `MyBookingsModals.jsx` (652), `MyBookings.page.jsx` (630), `ManageCategories.page.jsx` (565, holds 6 separate form-state objects).
- **Prop-drilling** from the partial decomposition: `ManageUser.page.jsx` passes 13 props to `<UserManagementToolbar>`, 17 to `<UserManagementTable>`, 11 to `<UserManagementModals>` — including inline-closure props and helper functions passed down instead of imported.
- **Duplication:** the `ui-avatars.com` avatar-URL builder is copy-pasted in **12 files** with slightly different hex colors; `res.data?.data || res.data` unwrap is everywhere; a hand-rolled `SearchableSelect` is reimplemented in several `*Modals.jsx`; per-page debounce-search and pagination state are re-written each time.
- Inline BD city list re-declared in `TopDecorators.page.jsx` although `src/lib/constants.js` exports `TOP_CITIES_BD`.
- `NavBar.jsx` writes `document.querySelector("html").setAttribute("data-theme", ...)` during render (should be `useEffect`).
- Mixed React 19 idioms: `use(AuthContext)` in most files, `useContext` in ~4.
- Commit messages: terse, no convention, stray trailing quotes ("Payemnt apis integration updated'").

### Steps to reach 20 / 20
1. **Get lint to zero.** `npx eslint . --fix` for the unused vars, manually resolve the rest, fix the 4 `exhaustive-deps` warnings (add deps or extract stable callbacks). Lint must exit 0.
2. **Strengthen ESLint:** add `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-import` (with `import/order`), and `eslint-config-prettier`. Turn `no-console` on as `warn` (allow `console.error`/`console.warn`).
3. **Add Prettier** (`.prettierrc` + `npm run format`) and enforce via lint-staged.
4. **Remove debug logging.** Delete stray `console.log`s; introduce `src/lib/logger.js` that no-ops in production; route the axios interceptor error through it.
5. **Extract shared helpers to `src/lib/`:** `getAvatarUrl(name, color?)`, `unwrap(res)` for `res.data?.data ?? res.data`, and a reusable `<SearchableSelect>` in `src/components/ui/`. Replace all 12 avatar copies and every inline unwrap.
6. **Break up God components.** Target < 250 lines per file. Split by concern: a `useXdata()` hook for fetching/mutation, presentational sub-components, and a thin page container. Replace multi-prop drilling with a per-screen context or `useReducer` passed via one `value`.
7. **Import shared constants** — delete the inline city list, use `TOP_CITIES_BD`.
8. **Move render side-effects into effects** (`NavBar.jsx` theme write).
9. **Adopt a commit convention** (Conventional Commits) and add `commitlint` via Husky.

---

## 3. State & Data Layer — 8 / 15

### Current state
- No state library and no server-cache library. One React Context (`AuthContext`) for auth only.
- **~39 components hand-roll the same pattern:** `useAxiosSecure()` + `useState` for data/loading/error + `useCallback` loader + `useEffect(() => loader(), [loader])` + manual refetch after mutations. No dedup, no caching, no stale-while-revalidate, no request cancellation (one ad-hoc `calledRef` guard in `PaymentSuccess`).
- Pagination / filtering / sorting reimplemented per page (client-side in `MyBookings`, server-side in `ManageUser`).
- `useRole.jsx`: module-level mutable `rolePromiseCache = {}` never invalidated on account switch; `localStorage` role trusted before the network confirms; a stale key `styledecor_user_role` (no email) only ever removed; internal state var `loading` renamed to `roleLoading` on return.
- `useDecoratorId.jsx`: correct extraction idea, but only `MyAgents.page.jsx` uses it — `ManageService`, `MyProjects`, `MyEarnings`, `MyProfile`, `AgencyProfile` still inline the same `/decorators/me` call.
- Theme in `localStorage`, read/written independently in `NavBar.jsx` and `DashboardTopBar.jsx`.
- Endpoint strings are inline literals scattered across 38 files; several defensively try two URLs (`/payments/payment-success` then `/payment-success`).

### Steps to reach 15 / 15
1. **Adopt TanStack Query** (`@tanstack/react-query`). Wrap the app in `QueryClientProvider`. Replace the hand-rolled fetch pattern with `useQuery` / `useMutation` + `queryClient.invalidateQueries` after writes. This removes ~39 copies of loading/error/refetch boilerplate and gives caching, dedup, retries, and cancellation for free.
2. **Create an API module** `src/lib/api/`: a typed-ish `endpoints.js` (no scattered string literals) and thin functions (`getUsers(params)`, `initiatePayment(body)`), each returning `unwrap(res)`.
3. **Centralize list state.** One `useTableState()` hook returning `{ page, limit, sort, search, setters }` with URL-sync (`useSearchParams`), used by every admin/list page.
4. **Rework role fetching** as a `useQuery(['me'])` — cache is now managed, invalidated on login/logout via `queryClient.clear()`. Drop the module-level `rolePromiseCache` and the legacy `localStorage` key. Keep a short-TTL `localStorage` seed only as `initialData`.
5. **Apply `useDecoratorId` everywhere** it's needed (or replace it with `useQuery(['decorator','me'])`) and delete the 4+ inline copies.
6. **Move theme into a `ThemeProvider`** (context + one `useTheme()` hook + one `localStorage` read). Delete the duplicated logic in both nav components.

---

## 4. Auth & Security — 9 / 15

### Current state
- Firebase client SDK, config from `VITE_*` env vars; `.env.local` is gitignored and **never** entered history. (Firebase web keys are public-by-design, so low severity — but there's no `.env.example`.)
- `src/Hooks/useAxiosSecure.jsx`:
  - **`baseURL: "http://localhost:3000"` hardcoded**, prod URL commented out on the line above. Not env-driven. **This is a release blocker.**
  - Interceptors registered inside a `useEffect` on a single module-level instance → every one of ~39 consumers adds/removes its own interceptor pair.
  - Request interceptor uses `user.getIdToken?.()` without `true` — no forced refresh.
  - **Response interceptor's 401/403 → logout + redirect is entirely commented out.** Expired sessions silently fail every request.
- Authorization: role comes from `/users/me`, cached in `localStorage` + module promise cache, and the UI trusts the cached value before revalidation. Route guards do re-check `roleLoading`, so the hard gate holds, but "super admin" is a hardcoded email literal in `ManageUser.page.jsx` (`SUPER_ADMIN_EMAIL = "admin.styledecor1@gmail.com"`).
- Backend user-sync (`POST /users`) is fire-and-forget in `Login.page.jsx` and `Register.page.jsx` (three near-identical payload builders, different fallback avatars). If it fails the user still navigates to `/dashboard` — DB and Firebase can silently diverge.
- No password reset (button's `onClick` commented out), no email-verification gate, no logout on token expiry.
- Post-login redirect: `setTimeout(() => navigate(location.state || "/dashboard"), 1000)` — arbitrary 1s delay; `location.state` is a bare string from `PrivateRoutes` but `{from}` from `ServiceBooking`.

### Steps to reach 15 / 15
1. **Env-drive the API base URL:** `baseURL: import.meta.env.VITE_API_BASE_URL` with a `.env` default and a committed `.env.example`. Remove the hardcoded/commented URLs.
2. **Create the axios instance once at module scope with a single interceptor pair.** Read the current user/token from a module ref or a getter set by `AuthProvider`, not from a per-component `useEffect`.
3. **Restore global auth-failure handling:** on 401/403, call `logOutUser()` once (guard against loops), then `navigate("/login", { state: { from } })` and surface one toast.
4. **Force-refresh tokens** where needed: `getIdToken(true)` on 401 retry, or rely on Firebase's `onIdTokenChanged` to push fresh tokens into the instance.
5. **Standardize the redirect contract:** always `state: { from: location.pathname }`; read `location.state?.from`. Drop the `setTimeout`.
6. **Make user-sync reliable:** `await` the `POST /users`, block navigation on failure with a retry/toast, or move the upsert server-side (verify Firebase ID token in a backend middleware and upsert there). Extract one `buildUserPayload(firebaseUser, extra)` helper.
7. **Move the super-admin check server-side** (a role/flag on the user record), not a client-side email literal.
8. **Add password reset** (`sendPasswordResetEmail`) and an **email-verification gate** for sensitive actions.
9. **Never trust the cached role for gating** — it's fine for optimistic menu rendering, but every guard already awaits `roleLoading`; keep it that way and add a server authorization check on protected endpoints.

---

## 5. Tooling & CI — 4 / 10

### Current state
- ESLint: minimal flat config (`js.recommended` + react-hooks + react-refresh). No jsx-a11y, no import ordering, no react plugin. `no-unused-vars` relaxed for `^[A-Z_]` (silently permits unused imported components).
- Vite: 8 lines, defaults only. No path aliases, no build/chunk config.
- No Prettier, no Husky, no lint-staged, no `prepare` script.
- **No CI** — no `.github/` directory at all.
- **No TypeScript** — no `tsconfig.json`, but `@types/react` / `@types/react-dom` are installed (dead weight).
- No `engines` field; no `.nvmrc`.
- Scripts: only `dev`, `build`, `lint`, `preview` (no `test`, no `format`, no `typecheck`).

### Steps to reach 10 / 10
1. **Add a GitHub Actions workflow** `.github/workflows/ci.yml` running on PR + push to `main`: `npm ci` → `npm run lint` → `npm run typecheck` (if TS) → `npm test` → `npm run build`. Fail the job on any step.
2. **Strengthen ESLint** (see §2 step 2). Remove the loose `varsIgnorePattern` or scope it tightly.
3. **Add Prettier** + `npm run format` + `npm run format:check` (the latter in CI).
4. **Add Husky + lint-staged**: pre-commit runs `eslint --fix` + `prettier --write` on staged files; `commit-msg` runs `commitlint`.
5. **Adopt TypeScript** (or remove `@types/*`). Even a loose `tsconfig` with `allowJs` + incremental `.tsx` migration adds real safety; add `npm run typecheck`.
6. **Configure Vite:** add `resolve.alias` (`@` → `src`), `build.rollupOptions.output.manualChunks` for vendor splitting, and `build.chunkSizeWarningLimit` tuned after code-splitting.
7. **Pin the toolchain:** add `"engines": { "node": ">=20" }` and an `.nvmrc`.

---

## 6. Testing — 0 / 10

### Current state
- **Zero tests.** No `*.test.*` / `*.spec.*` / `*.cy.*` files, no `__tests__` dirs.
- No runner: no vitest, jest, @testing-library, playwright, or cypress in `package.json`.
- No `test` script.
- 0% coverage on an app with payments, refunds, and role-based admin CRUD.

### Steps to reach 10 / 10
1. **Install Vitest + Testing Library:** `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `msw` (mock the API). Add `"test"`, `"test:watch"`, `"test:coverage"` scripts and `vitest.config` with `environment: 'jsdom'` + `setupFiles`.
2. **Unit-test the critical pure logic:** `format.js`, the future `getAvatarUrl` / `unwrap` helpers, price/tax/deposit math currently inline in `ServiceBooking.page.jsx`, and the district/division maps in `constants.js`.
3. **Test the hooks:** `useRole` (cache hit, cache miss, account switch, network failure fallback), `useDecoratorId` (primary + fallback endpoint), the axios interceptor (adds bearer token, triggers logout on 401) — with `msw`.
4. **Test the route guards:** `PrivateRoute` redirects when logged out; `RoleRoute` renders `<Forbidden/>` for the wrong role and children for the right one; loading shows the spinner.
5. **Component tests for the money paths:** `ServiceBooking` (validation blocks submit, price breakdown updates, successful submit calls the API), `MyBookings` pay modal, `PaymentSuccess` (idempotent — doesn't double-post on re-render).
6. **Add coverage thresholds** in `vitest.config` (start at 40% lines / 50% for `src/lib` and `src/Hooks`, ratchet up) and enforce in CI.
7. **Optional E2E:** one Playwright smoke test — log in, browse a service, reach the booking page — run in CI against a preview build.

---

## 7. Performance — 4 / 10

### Current state
- **Single 1.8 MB JS bundle** (466 KB gzip). ~40 routes in the router, all statically imported — no code-splitting.
- **~20 MB of unoptimized PNGs** bundled: `src/assets/images/img-0*.png` are 2–3.2 MB each (`img-03` is 3.23 MB); logos are 350–970 KB each.
- CSS bundle 271 KB (35 KB gzip) — acceptable.
- `NavBar.jsx` writes `data-theme` during render.
- No `React.lazy`, no `Suspense` boundaries beyond the router's `hydrateFallbackElement`.
- Client-side filtering/sorting of potentially large lists in some pages.

### Steps to reach 10 / 10
1. **Route-level code-splitting:** convert every route `Component` to `const X = lazy(() => import(...))` and wrap `<Outlet/>` areas in `<Suspense fallback={<Spinner/>}>`. Target main chunk < 200 KB gzip.
2. **Vendor chunking:** `manualChunks` to separate `react`, `firebase`, `recharts`, `leaflet`/`react-leaflet`, `framer-motion` — the heavy, rarely-changing deps — from app code.
3. **Optimize images:** compress and convert `img-0*.png` to WebP/AVIF (expect 90%+ size reduction), serve responsive sizes, add `loading="lazy"` + `decoding="async"`. Move large static images to `public/` or an image CDN/`vite-imagetools`.
4. **Shrink logos** to actual display size (they're used at ~40–160 px but shipped at 1000+ px).
5. **Lazy-load the map:** `react-leaflet` + `leaflet` only where `CoverageMap` renders; dynamic-import it below the fold.
6. **Move list filtering/sorting/pagination server-side** for any list that can exceed ~100 rows.
7. **Add a bundle budget** (`rollup-plugin-visualizer` in CI, or `size-limit`) so regressions are caught.
8. **Fix the render-time theme write** (into `useEffect`) to avoid layout thrash on mount.
9. Verify: `npm run build` produces multiple chunks, main < 200 KB gzip, total image payload < 1 MB. Lighthouse performance ≥ 90.

---

## 8. Documentation & Repo Hygiene — 6 / 10

### Current state
- `README.md` is a readable overview but inaccurate: lists `react-router-dom` (actual: `react-router` v7), mentions Stripe (no dep in this client), says `cd client` (repo root *is* the client), truncates mid-"Client Setup", no env-var docs, no screenshot.
- **52 tracked `.md` files under `public/AI_Doc/`** — AI-generated scan reports + per-page redesign prompt specs. Because they're in `public/`, they are **bundled and deployed**: anyone can fetch `https://<site>/AI_Doc/03-Frontend-Issues-And-Solutions.md` and read the app's own known-issues list. (This audit file is currently here too — move the set together.)
- `migrate.cjs` (dead one-shot migration script) and `UserManagement_Upgrade_Prompts.md` (AI chat transcript containing local Windows paths `E:\Projects\...`) sit in the repo root.
- No `.env.example`, `LICENSE`, `CONTRIBUTING.md`, or `CHANGELOG.md`.
- `.claude/` directory is empty (no repo instructions file).
- Commit messages terse/inconsistent with stray quotes.
- Good: `dist/` and `node_modules/` are gitignored and untracked; `.env.local` never committed.

### Steps to reach 10 / 10
1. **Move `AI_Doc/` out of `public/`.** Relocate to `/docs` at the repo root (not served). If any of it is truly internal, `.gitignore` it. Nothing describing the app's weaknesses should be web-reachable.
2. **Fix the README:** correct the dependency list (`react-router` v7), remove or clarify Stripe, fix the clone/`cd` steps, finish the setup section, add an **Environment Variables** table, add a real screenshot, add "Scripts", "Testing", and "Deployment" sections.
3. **Add `.env.example`** listing every `VITE_*` var with placeholder values and a one-line comment each.
4. **Delete root cruft:** `migrate.cjs`, `UserManagement_Upgrade_Prompts.md`.
5. **Add `LICENSE`** (choose one), **`CONTRIBUTING.md`** (branch naming, commit convention, how to run lint/test), and a **`CHANGELOG.md`** (or generate from Conventional Commits).
6. **Add `CLAUDE.md` / repo instructions** in `.claude/` capturing the conventions this audit establishes (component taxonomy, API module, testing expectations).
7. **Clean commit history going forward** with Conventional Commits + commitlint (see §2/§5).

---

## Priority Order (fastest ROI first)

| Step | Effort | Points |
|---|---|---|
| Env-drive API base URL (§4.1) + normalize dir casing (§1.7) | ~1 hr | +6 |
| `eslint --fix` to zero + add CI lint/build workflow (§5.1, §2.1) | ~2 hr | +5 |
| Top-level error boundary + route `errorElement` (§1, §7) | ~1 hr | +4 |
| Restore 401/403 logout handling (§4.3) | ~1 hr | +3 |
| Route-level `React.lazy` + compress images (§7.1, §7.3) | ~half day | +6 |
| Stand up Vitest, cover auth + guards + booking/payment happy paths (§6) | ~2 days | +8 |
| Move `AI_Doc/` out of `public/`, delete root cruft, fix README (§8) | ~2 hr | +3 |

Completing the above lands the project at roughly **77–80 / 100**. The remaining points (TanStack Query migration, God-component decomposition, TypeScript adoption, server-side authz) are larger refactors tracked in §2–§4.
