# Not Found (404) — Improvement Prompt

**Route(s):** `/*` (catch-all, matched by `src/Routes/PublicRoutes.jsx`)
**File(s) in scope:** `src/components/errors/NotFound.jsx`.
**Related audit references:** None specific to this file in `00-06` — it wasn't individually called out in the original audit. Cross-referenced against `10-About.md` finding #1 (shared `dark:bg-gray-900` root anomaly across `About.page.jsx`, `Contact.page.jsx`, and this file).

## Findings

### Page-specific

1. **Root wrapper uses `dark:bg-gray-900`, matching the same anomaly found in `About.page.jsx` and `Contact.page.jsx`** (see `10-About.md` finding #1 for the full cross-file evidence). Here it's paired with `dark:bg-gray-800` on the inner card (line 7) — unlike the other two files, this one is at least internally self-consistent (gray used throughout, not mixed with slate), since there's no other content on the page to compare against. — **Polish** (lower severity here specifically than in `About`/`Contact`, since there's no internal slate/gray mixing to create a visible seam — still worth aligning for app-wide consistency).
2. **Only one recovery action is offered ("Go Home").** No secondary option (e.g. "Go Back", or a link to `/services`) for a user who followed a bad link expecting to land somewhere specific. Minor UX polish, not a functional gap. — **Polish**.

### Generic checklist

- **Reusable components:** N/A — this is intentionally a small, self-contained page; no duplication to extract.
- **Skeleton/spinner loader:** N/A — no data fetching.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — `max-w-md w-full` card centers correctly at all widths.
- **Color consistency:** Applies — finding #1.
- **Design consistency:** N/A.
- **Correctness:** N/A — no bugs found; this page does exactly what it's supposed to do.
- **Improvement opportunity:** Finding #2 (secondary recovery action) is the only enhancement worth considering, and it's optional/low-priority given the page's small scope.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — the "Go Home" link is a real `<Link>` styled as a button; no gaps found.

## Implementation Prompt

Apply these changes to `src/components/errors/NotFound.jsx`:

**1. Color consistency:**
- Change `dark:bg-gray-900` (line 6) and `dark:bg-gray-800` (line 7) to `dark:bg-slate-950` and `dark:bg-slate-900` respectively, aligning with the canonical dark-neutral pairing in `00-Color-System.md` §2 and with the same fix being applied to `About.page.jsx` and `Contact.page.jsx`.

**2. Optional polish (only if the pass has room):**
- Add a secondary action alongside "Go Home" — e.g. a "Browse Services" link to `/services`, since that's the app's primary conversion path and a lost visitor is more likely to still want to browse than to necessarily go to the homepage.

This page is small and low-risk — no correctness fixes are needed, only the color alignment.

## Verification Checklist

- [ ] Page background and card use `slate-950`/`slate-900` in dark mode, matching the rest of the app.
- [ ] "Go Home" still navigates correctly to `/`.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
