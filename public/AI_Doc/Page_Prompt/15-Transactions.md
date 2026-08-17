# Transactions — Improvement Prompt

**Route(s):** `/dashboard/transactions`
**File(s) in scope:** `src/features/customer/Transactions.page.jsx`. Cross-referenced: `src/features/customer/MyBookings.page.jsx` (duplicated customer-ID resolution logic — see finding #2), `src/features/home/components/Spinner.jsx` (shared, not modified here).
**Related audit references:**
- `02-Reusable-Components.md` §9 (formatCurrency), §6 (Modal shell).
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`Spinner` misuse inside the receipt modal.** Lines 406-409: `<div className="p-12 flex items-center justify-center"><Spinner /></div>` renders while the invoice detail is loading, inside an already-open modal. `Spinner.jsx` forces `h-screen` on its own root regardless of the `p-12` wrapper — the modal will visibly balloon while the receipt loads. Same shared-component-misuse pattern found on several other pages (`05-ServiceDetails.md` finding #2, `14-MyBookings.md` etc.). — **Moderate**.
2. **Customer-ID resolution logic is duplicated with a variation from `MyBookings.page.jsx`.** This file's version (lines 45-66) tries `GET /users/me` and falls back to `GET /users/:email` on failure; `MyBookings.page.jsx`'s version only tries `/users/me`. Two independent implementations of "resolve the logged-in Firebase user to their Mongo customer `_id`," one more defensive than the other. — **Polish** (worth a shared `useCustomerId()` hook, not urgent).
3. **Gradient utility syntax mismatch.** Line 191: `bg-gradient-to-br` (legacy Tailwind v3 naming) while the rest of the app's gradients (already flagged in `01-Home.md` finding #4 for `CoverageMap.jsx`) use the Tailwind v4 `bg-linear-to-*` naming. Another instance of the same inconsistency. — **Polish**.
4. **No pagination — same gap as `MyBookings.page.jsx`.** The transactions table renders every result unpaginated. — **Polish**, consistent with the note in `14-MyBookings.md` finding #4 — fix both together if pagination is added to either.

### Generic checklist

- **Reusable components:** Applies — finding #2. Also `formatCurrency`-style hand-typed `৳{...toLocaleString()}` appears repeatedly (lines 196, 220, 354, 483) — reuse the shared util if built. The receipt modal (lines 386-505) is another hand-rolled modal instance, adding to the count already noted in `14-MyBookings.md` for the shared `<Modal>` shell.
- **Skeleton/spinner loader:** Applies — finding #1. The main table's loading state (lines 278-281) has the same `Spinner`-in-padded-box pattern as other pages; consider a table-row skeleton.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — table has `overflow-x-auto`, summary cards collapse `grid-cols-2` → `lg:grid-cols-3` correctly.
- **Color consistency:** Applies, minor — finding #3. The status-badge implementation here (lines 148-170: 3 states — `emerald` paid, `rose` refunded, `amber` pending) is clean and fully within the canonical palette — a positive contrast to `MyBookings.page.jsx`'s 9-hue chaos; worth using as the reference pattern when fixing that file.
- **Design consistency:** N/A.
- **Correctness:** N/A — no logic bugs found beyond the loading-state UI issue.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — no gaps found.

## Implementation Prompt

Apply these changes to `src/features/customer/Transactions.page.jsx`:

**1. Correctness/polish fixes:**
- Replace the receipt-modal `<Spinner />` (lines 406-409) with a small inline loading indicator sized for the modal's content area, not the full-screen `Spinner` component.
- Change `bg-gradient-to-br` (line 191) to `bg-linear-to-br` to match the rest of the app's Tailwind v4 gradient syntax.

**2. Reusable extraction (coordinate with `14-MyBookings.md`):**
- If a shared `useCustomerId()` hook is built while processing `MyBookings.page.jsx`, use it here instead of this file's own resolution logic (keep the more defensive fallback-to-email-lookup behavior when merging, since it's strictly safer than the simpler version).
- Reuse `formatCurrency` from `src/lib/format.js` if built; otherwise leave as-is for now (this page alone doesn't need to be the one that builds it, given fewer instances than `MyBookings.page.jsx`).
- If/when the shared `<Modal>` shell is built (per `14-MyBookings.md`), migrate the receipt modal (lines 386-505) onto it.

Preserve all existing transaction-fetching, filtering, and receipt-viewing logic — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Opening a receipt shows an appropriately-sized loading indicator, not a full-viewport spinner inside the modal.
- [ ] Gradient renders identically after the `bg-linear-to-br` change.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
