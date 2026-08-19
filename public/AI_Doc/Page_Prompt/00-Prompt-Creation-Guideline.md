# Prompt Creation Guideline

**Purpose:** This file defines how to produce one improvement-prompt file per page listed in `Page_List.md`. It exists so all 36 page-prompts are researched and structured the same way, instead of each one being ad-hoc. Whoever (or whichever agent) writes a page prompt must follow this process and this output template exactly.

Do not skip the research step and jump straight to the generic checklist below — every page prompt must contain page-specific findings, not just a copy-pasted checklist.

---

## 1. Inputs to read, per page 

For the page being processed:

1. **`Page_List.md`** — get the page's route(s) and file path.
2. **The page's own source file** — read it in full (not excerpts).
3. **Every component the page directly imports and that isn't a generic/shared UI primitive** — e.g. if `ManageUser.page.jsx` renders a bespoke `<UserRow>` sub-component that only it uses, read that too. Skip components already flagged for extraction as shared (`02-Reusable-Components.md`) — those are handled by the generic checklist, not re-derived per page.
4. **All seven audit docs** (`00-Scan-Overview.md` through `06-UI-Upgrade-Guide.md`) — grep each for the page's file name, route, or feature name to pull any findings already on record for this page. Note the section/line reference so the prompt can point back to it.
5. **Any hook(s) the page uses directly** (e.g. `useAxiosSecure`, `useRole`) only insofar as their behavior affects this page's correctness (e.g. the commented-out 401 handling in `03-Frontend-Issues-And-Solutions.md` §5 affects every authenticated page — note it, don't re-investigate the hook itself).

---

## 2. Research process

1. Read the page source end-to-end. Build a mental model: what data it fetches, what states it renders (loading/empty/error/data), what it lets the user do, what it links to.
2. Search 00-06 for anything already documented about this exact file. Carry those findings forward with their source citation (e.g. "see `03-Frontend-Issues-And-Solutions.md` §10").
3. Walk the **Generic Checklist** (§3 below) against what you actually observed in the page source — for each item, mark it **Applies** (with the concrete evidence: line numbers, what's missing) or **N/A** (state why, e.g. "page has no lists, skeleton loader not applicable"). Never mark an item "Applies" without pointing at where in the file it applies.
4. Identify anything page-specific that isn't covered by the generic checklist or the audit docs — dead code, broken interactions, hardcoded values that should come from state/API, inconsistent spacing/typography versus sibling pages, missing empty states, etc.
5. Rank findings: Critical (breaks the page or misleads the user) → Moderate (real inconsistency/debt) → Polish.
6. Write the output file using the template in §4.

Do not invent issues that aren't backed by something read in the source or the audit docs. If a page is genuinely clean on some checklist dimension, say so briefly — don't pad the prompt.

---

## 3. Generic checklist (cross-cutting, evaluate for every page)

These are the standing quality bars every page should be held to, per the user's requirements. For each, the page-prompt author must check the actual page code, not assume.

| # | Dimension | What to check |
|---|---|---|
| 1 | **Reusable components** | Does this page hand-roll markup that duplicates a pattern documented in `02-Reusable-Components.md` (Pagination, DataTable, EmptyState, StatCard, TableActionButton, Tooltip, Modal, ThemeToggle, UserMenu, RatingBadge, Avatar, format utils)? Should it be migrated to the shared component once built, or does it introduce a *new* duplicate pattern not yet catalogued? |
| 2 | **Skeleton loader vs spinner loader** | Does the page's loading state use a full-replace `<Spinner>` (layout-shift-inducing) where a skeleton (`TableRowSkeleton`, `CardGridSkeleton`, or a page-specific skeleton) would preserve layout? Reserve spinners for short/global/full-page transitions; use skeletons for lists/tables/cards with predictable shape. |
| 3 | **Tooltip usage** | Are there icon-only buttons, truncated text, or non-obvious controls that need a tooltip for clarity, and don't have one? Ensure all table action buttons use `<TableActionButton>` or `<Tooltip>` instead of slow native `title` attributes. |
| 4 | **Responsiveness** | Does the layout hold up at mobile (`<640px`), tablet (`640–1024px`), and desktop widths? Check for fixed-width elements, overflow, tables without a mobile fallback, touch-target size on interactive elements. |
| 5 | **Color consistency** | Does the page reuse the app's existing Tailwind/DaisyUI color tokens and dark-mode classes, or does it introduce one-off hex/RGB values or skip `dark:` variants that exist elsewhere on the same page? |
| 6 | **Design consistency** | Do spacing, border-radius, shadow, typography scale, and component styling match sibling pages in the same dashboard area (e.g. this admin page vs. other `ManageX` pages)? |
| 7 | **Overall correctness** | Any logic bugs, wrong data bindings, race conditions, stale closures, unhandled promise rejections, or state not resetting between navigations? Cross-check against confirmed bugs in `03-Frontend-Issues-And-Solutions.md` and `04-Business-Logic.md` if this page touches booking/payment/commission math. |
| 8 | **Overall improvement** | Any relevant idea from `05-Upgrade-Ideas.md` that specifically targets this page (e.g. rating distribution chart on Service Details) — cite it if so. |
| 9 | **Coding standard** | Prop drilling vs. sensible state placement, naming consistency, no dead state (cross-check the ESLint `no-unused-vars` findings in `03-Frontend-Issues-And-Solutions.md` §11 for this file), no `console.log` left in, no inline magic numbers/strings that should be named constants. |
| 10 | **Comments** | Non-obvious logic (business rules, calculations, key state) should have a concise single-line comment (`// ...`). All comments MUST be single-line only (no `/* ... */`, `/** ... */`, or decorative ASCII banners). Comment density should remain light: annotate component purpose, complex functions/hooks, and sub-components if large, without cluttering the code. |
| 11 | **Accessibility** | Keyboard reachability, `aria-label`s on icon-only controls, focus management on modals/dropdowns opened from this page — cross-check `01-UI-UX-Issues.md` and `06-UI-Upgrade-Guide.md` Phase 2 for patterns already identified elsewhere in the app. |
| 12 | **Action column state persistence** | In table action columns, use `<TableActionButton>` and if any button is not applicable for a specific row (e.g. refund for an uncompleted transaction, delete for super admin, etc.), keep it visible in a disabled state (`disabled={true}` with an explanatory `disabledTooltip="..."`) rather than hiding or vanishing it. |

---

## 4. Output template

Each page prompt file must follow this structure exactly:

```markdown
# <Page Name> — Improvement Prompt

**Route(s):** <from Page_List.md>
**File(s) in scope:** <primary page file, plus any page-only sub-components read>
**Related audit references:** <bullet list of doc + section citations found during research, or "None found in 00-06">

## Findings

### Page-specific
- <finding> — <file:line evidence> — <severity: Critical/Moderate/Polish>
  (repeat)

### Generic checklist
- **Reusable components:** <Applies: evidence | N/A: why>
- **Skeleton/spinner loader:** <Applies: evidence | N/A: why>
- **Tooltip:** <Applies: evidence | N/A: why>
- **Responsiveness:** <Applies: evidence | N/A: why>
- **Color consistency:** <Applies: evidence | N/A: why>
- **Design consistency:** <Applies: evidence | N/A: why>
- **Correctness:** <Applies: evidence | N/A: why>
- **Improvement opportunity:** <Applies: evidence | N/A: why>
- **Coding standard:** <Applies: evidence | N/A: why>
- **Comments:** <Applies: evidence | N/A: why>
- **Accessibility:** <Applies: evidence | N/A: why>

## Implementation Prompt

<A single, self-contained, ready-to-hand-to-a-coding-agent prompt that:
- names the exact file(s) to change
- lists the concrete changes to make, grouped by the findings above, most severe first
- tells the agent to reuse existing shared components/hooks/utils where they already exist, and only introduce a new shared component if this page is the first of several needing the same pattern (cross-reference 02-Reusable-Components.md)
- enforces all comments to be single-line only (// ...) with clean, light density (on functions/components/large subcomponents)
- tells the agent to preserve existing behavior not covered by these findings
- tells the agent to verify responsiveness and dark mode visually after the change (per the project's UI-change testing convention)
- does NOT include vague instructions like "improve the UI" — every instruction traces back to a specific finding above>

## Verification Checklist

- [ ] <concrete, testable item per major change — e.g. "Table shows skeleton rows on load, not a centered spinner">
  (repeat, derived from the findings)
```

---

## 5. File naming & location

- One file per page, saved to `public/AI_Doc/Page_Prompt/`.
- Name format: `<NN>-<PageName>.md`, where `NN` is the page's number from `Page_List.md` (zero-padded to 2 digits) and `PageName` is a short PascalCase/kebab name matching the page (e.g. `13-MyProfile.md`, `18-ManageServices.md`).
- This guideline file itself stays as `00-Prompt-Creation-Guideline.md` and is never overwritten by page generation.

---

## 6. Ground rules

- Every claim in a page prompt must be traceable to either the page's own source code or a specific citation in 00-06. No speculative issues.
- If a generic checklist item is N/A, still write the line — silence reads as "not checked," an explicit N/A reads as "checked, doesn't apply."
- Keep the Implementation Prompt actionable and scoped to this one page. Cross-cutting infrastructure work (React Query adoption, TypeScript migration, CI pipeline) belongs in `05-Upgrade-Ideas.md`, not repeated inside every page prompt — only reference it if this specific page is the natural first candidate.
- Don't duplicate the entire text of 00-06 into the page prompt — cite and summarize, don't paste.
- **Commenting rule**: All code comments must strictly use single-line format (`// ...`), never multi-line block comments (`/* ... */`, `/** ... */`) or ASCII decorative banners (`// =====`). Maintain light comment density focused on functions, top-level components, and large sub-components.

