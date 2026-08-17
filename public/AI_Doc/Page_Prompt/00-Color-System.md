# Color System (Canonical)

**Why this file exists:** the project has no defined color tokens — no custom Tailwind `@theme` colors, and DaisyUI's semantic classes (`primary`, `base-100`, etc.) are used in only 21 files while 61 files use raw Tailwind palette classes across 12 different hues with no documented role. That's real, measured drift (see `03-Frontend-Issues-And-Solutions.md`-style evidence gathered 2026-08-17: `slate` 5315 uses, `purple` 1412, `emerald` 317, `indigo` 303, `amber` 302, `gray` 193, `rose` 166, `blue` 94, `red` 35, `pink` 28, `cyan` 18, `teal` 3, `yellow` 2).

The drift isn't random, though — a dominant pattern already exists across most of the codebase. This file writes that pattern down as the target every page should converge on. **Every page prompt's "Color consistency" checklist item must check against this doc, not against a sibling page** — sibling pages may themselves be inconsistent.

This is a documentation-only fix, not a refactor: no Tailwind config or DaisyUI theme changes required. Pages get migrated onto these exact classes during their own improvement pass.

---

## Semantic roles → Tailwind classes

### 1. Primary / Brand
- Solid: `purple-600` (buttons, active nav states, links, icons signaling the primary action)
- Brand gradient (hero sections, CTAs, featured badges): `from-indigo-500 to-purple-600` (or `via-purple-500` for 3-stop gradients) — indigo appears **only** as the gradient partner to purple, never as a standalone solid primary color.
- Focus/ring state: `ring-purple-500`
- Hover tint background: `hover:bg-purple-50` (light) / `dark:hover:bg-purple-950/50` (dark)

### 2. Neutral (surfaces, text, borders)
All neutral values are `slate`. Fixed pairing by role:

| Element | Light | Dark |
|---|---|---|
| Page/card surface | `bg-white` | `dark:bg-slate-900` |
| Nested/secondary surface | `bg-slate-50` | `dark:bg-slate-800` |
| Border | `border-slate-200` | `dark:border-slate-800` |
| Heading text | `text-slate-900` | `dark:text-slate-100` |
| Body text | `text-slate-700` | `dark:text-slate-300` |
| Muted/secondary text | `text-slate-500` | `dark:text-slate-400` |
| Disabled/placeholder text | `text-slate-400` | `dark:text-slate-600` |

### 3. Success
`emerald`. Use the **tint-chip quartet** (see §5) for badges/status pills; `text-emerald-600` / `dark:text-emerald-400` for standalone success text/icons.

### 4. Warning
`amber`. Same tint-chip quartet for warning badges. **Also used for star ratings** (`text-amber-500`, e.g. `<RatingBadge>`) — this dual role is intentional and not a conflict (ratings and warnings don't co-occur in the same UI region). Only flag it during a page pass if a single page uses amber for both a warning message and a rating in the same view ambiguously.

### 5. Danger / Destructive
`rose` — **not** `red`. Same tint-chip quartet. The 35 existing `red-*` usages are legacy drift; migrate any line a page prompt touches from `red-*` to the equivalent `rose-*` class if its meaning is "destructive/error." Don't do a project-wide find/replace outside of pages actually being touched — that's out of scope for a per-page prompt.

### 6. Info
`blue` — reserved **only** for genuinely informational, non-primary, non-destructive notices (e.g., "this booking is read-only" banners). It's currently underused (94 instances) with no consistent quartet applied. If a page's existing `blue-*` usage is actually acting as a primary action/link, migrate it to `purple-600` instead of preserving it as "info." If it's a true info notice, apply the tint-chip quartet.

### 7. Deprecated / no defined role — migrate on touch
`gray`, `cyan`, `teal`, `yellow`, standalone `pink` (i.e. not part of the primary gradient). Low usage, no consistent role, almost certainly one-off drift. When a page prompt touches a line using one of these, migrate to the nearest semantic role: `gray` → `slate`, `cyan`/`teal` → `blue` (info) or `emerald` (success) depending on what it's actually communicating, `yellow` → `amber`, standalone `pink` → `rose`.

---

## The "tint-chip" pattern

Status badges, pills, and soft-background alerts across the codebase already converge on a consistent 6-class combo per color — codify it explicitly so new/fixed pages use the same shape instead of inventing new shade pairings:

```
bg-{color}-50 dark:bg-{color}-950
text-{color}-600 dark:text-{color}-400
border-{color}-200 dark:border-{color}-800
```

Example (success chip): `bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800`

Use this exact quartet for any new or corrected status pill/badge, for whichever semantic color (§1–6) applies.

---

## How to apply this during a page pass

1. Identify every color class on the page that isn't already following §1–6.
2. Classify what it's communicating (primary action, neutral surface/text, success, warning, danger, info) — not what hue it happens to be.
3. Replace with the canonical class for that role, preserving the light/dark pairing table in §2 or the tint-chip quartet in the relevant §3–6 entry.
4. If a color use doesn't cleanly map to any role above (e.g., a genuinely decorative one-off), leave it and note it in the page prompt's findings as "decorative, out of scope" rather than forcing a semantic label onto it.
5. Do not introduce a 13th hue. If a page seems to need a role not covered here, flag it in the page prompt as a finding for the guideline owner to decide — don't invent a new convention mid-page.
