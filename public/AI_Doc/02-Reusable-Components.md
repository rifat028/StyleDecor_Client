# Reusable Component & Utility Opportunities

This project has real, measured duplication — not hypothetical. Every section below is backed by a `grep` count across the actual files plus a side-by-side read of at least two of the duplicates. Extracting these would shrink the admin surface (currently ~9 pages, each 500-1000+ lines) dramatically and stop the copy-paste-and-drift pattern already visible (see "Evidence of drift" under §1).

---

## 1. `<DataTable>` + `<Pagination>` — the biggest win

**Evidence:** The exact same pagination footer (first/prev/numbered-or-ellipsis/next/last buttons, `ChevronsLeft/ChevronLeft/ChevronRight/ChevronsRight` icons, identical Tailwind classes) appears in **7 files**:

```
features/admin/ManageBookings.page.jsx
features/admin/ManageTransactions.page.jsx
features/admin/ManageDecorator.page.jsx
features/decorators/TopDecorators.page.jsx
features/admin/ManageUser.page.jsx
features/admin/ManageServices.page.jsx
features/services/Services.page.jsx
```

Compare `ManageUser.page.jsx:667-734` and `ManageServices.page.jsx:598-638` — the JSX structure, class strings, and even the `title="First Page"` tooltip text are byte-for-byte identical, just wired to a different `page`/`totalPages` state.

**Evidence of drift:** `ManageUser.page.jsx` implements numbered page pills with ellipsis (`pageNumbers` via `useMemo`, lines 289-316) while `ManageServices.page.jsx` and `Services.page.jsx` only show "Page X of Y" text with no clickable numbers. Same component, copy-pasted, now diverging — the exact failure mode reusable components prevent.

**Proposed component:**
```jsx
// src/components/ui/Pagination.jsx
<Pagination
  page={page}
  totalPages={totalPages}
  totalCount={totalCount}
  limit={limit}
  onPageChange={setPage}
  itemLabel="users"        // → "Showing 1 to 10 of 84 users"
  showPageSizeSelector      // optional, only ManageUser needs this today
  onPageSizeChange={setLimit}
/>
```

**Proposed table wrapper** (pairs with the above; every admin page has the same loading/empty/data three-way branch — see §3):
```jsx
// src/components/ui/DataTable.jsx
<DataTable
  loading={loading}
  data={users}
  columns={[...]}
  emptyState={{ icon: Users, title: "No Users Found", message: "..." }}
  renderRow={(user) => (...)}
/>
```
Even just extracting `<Pagination>` on its own (leaving each table's `<table>` bespoke) would remove ~60 lines × 7 files ≈ **420 lines** of duplicated markup.

---

## 2. `<ConfirmDialog>` hook around SweetAlert2

**Evidence:** `Swal.fire({...})` for a "destructive action, are you sure?" confirm appears **21 times** across admin pages (`ManageUser.page.jsx:186-193` role-change confirm, `:266-274` delete confirm; `ManageServices.page.jsx:216-223` delete confirm, plus toggle-status/toggle-featured success toasts at `:179-185`, `:199-205`). Every call re-types the same shape:
```js
const confirm = await Swal.fire({
  title: `...`,
  text: `...`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#ef4444", // sometimes present, sometimes not — inconsistent
  confirmButtonText: "Yes, ...",
});
if (!confirm.isConfirmed) return;
```

**Proposed hook:**
```js
// src/hooks/useConfirm.js
const confirmDelete = useConfirm({ danger: true });
...
const ok = await confirmDelete({
  title: `Delete ${user.name}?`,
  text: "This action will permanently remove the user from StyleDecor database.",
  confirmText: "Yes, Delete User",
});
if (!ok) return;
```
This also fixes the inconsistency where some delete confirms set `confirmButtonColor: "#ef4444"` (red) and others don't — `danger: true` would apply it uniformly.

---

## 3. `<EmptyState>` component

**Evidence:** The "no results" pattern (icon + bold title + muted description, optionally a reset-filters button) is hand-rolled **17 times**, e.g.:
```jsx
// ManageUser.page.jsx:506-515
<div className="text-center py-20 px-4">
  <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Users Found</h3>
  <p className="text-sm text-slate-400 mt-1">Try adjusting your search criteria or role filters.</p>
</div>
```
```jsx
// LatestServices.jsx:191-205 — near-identical shape, different icon/copy, plus a button
<div className="bg-white dark:bg-base-200 rounded-3xl p-16 text-center border border-base-300 space-y-4">
  <PackageOpen className="w-12 h-12 text-base-content/30 mx-auto" />
  <h3 className="text-xl font-bold text-base-content">No Packages Found</h3>
  ...
```

**Proposed component:**
```jsx
<EmptyState
  icon={Users}
  title="No Users Found"
  message="Try adjusting your search criteria or role filters."
  action={{ label: "Clear All Filters", onClick: handleResetFilters }} // optional
/>
```

---

## 4. `<StatCard>` for admin dashboard metric tiles

**Evidence:** 8 files build the same "small rounded card, uppercase muted label, big black number" tile by hand — e.g. `ManageServices.page.jsx:256-292` (4 tiles: Total/Active/Inactive/Featured) and the clickable stat-pill variant in `ManageUser.page.jsx:356-431` (Total/Customers/Decorators/Agents/Admins, each toggling a filter on click).

**Proposed component:**
```jsx
<StatCard label="Active Packages" value={stats.active} tone="emerald" />
<StatCard label="Total Users" value={stats.totalUsers} tone="indigo" active={roleFilter === "all"} onClick={() => setRoleFilter("all")} />
```
One component covers both the static (`ManageServices`) and clickable-filter (`ManageUser`) variants via an optional `onClick`.

---

## 5. Loading skeleton components

**Evidence:** Every list/grid re-implements its own skeleton loader with `animate-pulse` divs: `LatestServices.jsx:177-189` (6-card grid skeleton), `SideNavigation.jsx:66-100` (nav skeleton, already reasonably componentized inline), plus every admin table falls back to the shared `<Spinner>` (full replace, not a skeleton) which causes layout shift when data arrives (spinner is centered in an empty area; the table then pops in at full height).

**Proposed components:**
```jsx
<CardGridSkeleton count={6} />       // for ServiceCard/ decorator-card grids
<TableRowSkeleton columns={6} rows={5} />  // for admin tables — replaces the bare <Spinner> centered-in-nothing pattern
```

---

## 6. `<Modal>` shell

**Evidence:** `LogoutModal.jsx` already does this correctly with `createPortal` — but every admin "View Details" / "Edit" modal (`ManageUser.page.jsx:739-843` view modal, `:846-1023` edit modal; `ManageServices.page.jsx:643-776` view modal) reimplements the backdrop (`fixed inset-0 z-50 ... bg-black/60 backdrop-blur-sm`), the `max-h-[90vh] overflow-y-auto` scroll container, and the header-with-X-close-button — but **without** `createPortal`, and **without** the Escape-key/backdrop-click-to-close behavior `LogoutModal` also doesn't have. None of the 3+ modal implementations trap focus or restore it on close, so keyboard/screen-reader users tab out of the modal into the page behind it.

**Proposed component:**
```jsx
<Modal isOpen={!!viewingUser} onClose={() => setViewingUser(null)} title={`Edit User: ${editingUser.name}`} size="lg">
  {/* form content only */}
</Modal>
```
Should own: portal rendering, Escape-to-close, backdrop-click-to-close, and a focus trap (e.g. via a small custom hook or `focus-trap-react`) — fixing an accessibility gap in all current modals at once.

---

## 7. `useTheme()` hook

**Evidence:** The dark/light toggle button (`Sun`/`PiMoonStarsFill` cross-fade), the `localStorage.getItem("theme")` read, and the `setAttribute("data-theme", ...)` write are duplicated verbatim between `NavBar.jsx:57,143-177` and `DashboardTopBar.jsx:12,21-33` — including the exact same button JSX (lines 150-174 vs 35-58), just copy-pasted. This is also *where* the FOUC/render-body-mutation bug from `01-UI-UX-Issues.md` §1 lives — fixing it once in a shared hook fixes it everywhere.

**Proposed hook + component:**
```js
// src/hooks/useTheme.js
const { theme, toggleTheme } = useTheme(); // reads localStorage once, syncs data-theme in one place
```
```jsx
// src/components/ui/ThemeToggle.jsx
<ThemeToggle /> // used identically in NavBar and DashboardTopBar
```

---

## 8. User dropdown menu (profile card + "Join as Decorator" + Logout)

**Evidence:** `NavBar.jsx:263-340` and `DashboardTopBar.jsx:82-151` render the *identical* dropdown: avatar with online-dot, name/email block, gradient accent bar, conditional "Join as Decorator" item (same icon, same copy, same gradient hover), and the Logout button (same icon, same copy, same gradient hover). ~80 lines duplicated once.

**Proposed component:** `<UserMenu user={user} role={role} onLogout={openLogoutModal} />`, used by both `NavBar` and `DashboardTopBar`.

---

## 9. `formatCurrency()` / `formatDate()` utilities

**Evidence:** `৳{Number(x).toLocaleString()}` is hand-typed **~30+ times** across `ServiceCard.jsx`, `LatestServices.jsx`, `ServiceDetails.page.jsx`, `ManageServices.page.jsx`, `ManageTransactions.page.jsx`, etc. — and it's not even consistent: `ServiceBooking` summary panel prints `৳{service?.cost}` with **no** `.toLocaleString()` (features/services/ServiceBooking.page.jsx, "Price" summary box), so a ৳25000 price shows unformatted next to other prices on the same page/app that do show ৳25,000. Similarly, `toLocaleDateString(...)` with the same `{ year: "numeric", month: "short", day: "numeric" }` options object is retyped in multiple files instead of shared.

**Proposed utils:**
```js
// src/lib/format.js
export const formatCurrency = (amount) => `৳${Number(amount || 0).toLocaleString("en-US")}`;
export const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
```

---

## 10. `<RatingBadge>` / `<Avatar>` primitives

**Evidence:** The "amber star + rating number" chip (`<Star className="fill-amber-400 text-amber-400" /> {rating.toFixed(1)}`) appears with slightly different wrapper markup in `ServiceCard.jsx:33-37`, `LatestServices.jsx:266-272`, `TopRatedDecorators.jsx:357-362`, `ServiceDetails.page.jsx:245-249`. Likewise, the "image with `onError` fallback to a `ui-avatars.com` generated placeholder" pattern is reimplemented per-file with slightly different fallback-color logic in `ManageUser.page.jsx:44-55`, `TopRatedDecorators.jsx:84-87`, `ServiceDetails.page.jsx:347`.

**Proposed primitives:**
```jsx
<RatingBadge value={rating} count={reviewsCount} />
<Avatar src={user.photoUrl} name={user.name} fallbackTone="indigo" size="md" />
```

---

## Suggested folder layout for the above

```
src/components/ui/
  DataTable.jsx
  Pagination.jsx
  EmptyState.jsx
  StatCard.jsx
  CardGridSkeleton.jsx
  TableRowSkeleton.jsx
  Modal.jsx
  ThemeToggle.jsx
  UserMenu.jsx
  RatingBadge.jsx
  Avatar.jsx
src/hooks/
  useTheme.js
  useConfirm.js
src/lib/
  format.js
```
`LogoutModal.jsx` and the (already decent) skeleton in `SideNavigation.jsx` are good reference points for style/tone — the new components should match their conventions (Tailwind + `lucide-react`, dark-mode classes inline, no external UI kit needed beyond what's already installed).
