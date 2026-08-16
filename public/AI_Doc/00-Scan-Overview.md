# StyleDecor Client — Frontend Audit Overview

**Date:** 2026-08-16
**Scope:** Full `src/` tree (76 `.jsx` files), `index.html`, `vite.config.js`, global CSS.
**Method:** Direct file reads of every layout/layout-adjacent file, all home-page sections, auth pages, booking flow, representative admin CRUD pages, both custom hooks, app entry points — plus repo-wide `grep` sweeps for anti-patterns (console logs, `alert()`, hardcoded colors, duplicated JSX blocks) and a real `vite build` to get real bundle numbers. Every finding in the three companion documents is backed by a file path and, where useful, a line number — nothing here is speculative.

## Companion documents

| File | Contents |
|---|---|
| `01-UI-UX-Issues.md` | User-facing design, accessibility, and interaction problems |
| `02-Reusable-Components.md` | Concrete duplication evidence + proposed shared components/hooks/utils |
| `03-Frontend-Issues-And-Solutions.md` | Code-level bugs, anti-patterns, and performance issues, each with a fix |

## Headline findings

1. **`main.jsx` imports `./routes/PublicRoutes.jsx` (lowercase) but the folder on disk is `src/Routes/` (capital R).** Works today only because macOS/Windows filesystems are case-insensitive. On a case-sensitive Linux build server this import resolves to nothing. See `03-Frontend-Issues-And-Solutions.md` §1.
2. **Admin pages duplicate ~150-200 lines of table/pagination/modal/stat-card markup verbatim.** Identical pagination JSX appears byte-for-byte in 7 files (`ManageUser`, `ManageServices`, `ManageBookings`, `ManageTransactions`, `ManageDecorator`, `TopDecorators`, `Services`). See `02-Reusable-Components.md`.
3. **Production bundle is 1.77 MB JS (451 KB gzip) in a single chunk, plus 260 KB CSS, plus several 2-3 MB raw PNG images** shipped as-is. No route-level code splitting exists anywhere in `Routes/`. See `03-Frontend-Issues-And-Solutions.md` §8.
4. **A duplicate, unrouted, dead `ServiceBooking.page.jsx` exists in `features/customer/`** (374 lines) alongside the real one in `features/services/` (782 lines, actually routed). The dead copy still uses `alert()`, has a `e.target.reset;` bug (missing `()`), and no validation. See `03-Frontend-Issues-And-Solutions.md` §2.
5. **No `ErrorBoundary` anywhere in the tree**, and `App.jsx`/`App.css` are imported in `main.jsx` but never rendered (dead Vite boilerplate). One uncaught render error = white screen for the whole app.
6. **Dark-mode theme is applied inconsistently**: `DashboardTopBar.jsx` sets `data-theme` inside `useEffect` (correct), but `NavBar.jsx` sets it directly in the render body (`document.querySelector("html").setAttribute(...)` at line 176-177, outside any hook) — a React anti-pattern that also causes a flash of the wrong theme on load.

## What was *not* found (verified, not assumed)

- Missing `alt` text on `<img>` tags: **none** — every `<img>` in the scanned files has a matching `alt` (or empty `alt=""` where decorative). Good baseline.
- `window.confirm()` usage: **none** — the team already standardized on SweetAlert2 for destructive-action confirms (used in 21 files). This is a good, consistent pattern worth protecting via a shared hook (see reusable-components doc).
