# My Schedule (Agent) — Improvement Prompt

**Route(s):** `/dashboard/my-schedule`
**File(s) in scope:** `src/features/agent-dashboard/MySchedule.page.jsx`. Cross-referenced: `src/features/agent-dashboard/ActiveExecution.page.jsx` (duplicated execution-stage constant — see finding #2).
**Related audit references:**
- `04-Business-Logic.md` §5 (agent execution `STAGES`: `preparing → on_the_way → in_progress → completed`) — confirmed this page's stage-update modal offers exactly these 4 values.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **`renderStatusBadge` uses `orange` and `blue`, two hues flagged as outside the canonical palette.** Lines 130-175: `on_the_way` uses `orange-*` (deprecated per `00-Color-System.md` §7, no other legitimate use anywhere in the app) and `in_progress` uses `blue-*` (reserved for info-only use, not a lifecycle stage). This is a distinct function from the near-identical one duplicated across `MyBookings.page.jsx`/`ManageBookings.page.jsx`/`MyProjects.page.jsx` (it covers a smaller, agent-specific status set), but shares the same color-palette problem. — **Moderate**.
2. **Execution-stage options are hardcoded independently here and in `ActiveExecution.page.jsx`.** This page's stage-update modal (lines 431-434) hardcodes the same 4 stages as plain `<option>` text; `ActiveExecution.page.jsx`'s `STAGES` constant (lines 26-31) defines the same 4 stages as a structured array with icons and colors. Two independent representations of the same fixed set, confirmed matching `04-Business-Logic.md` §5's documented `STAGES` model. — **Polish** (DRY opportunity, not a live bug since both lists currently agree).

### Generic checklist

- **Reusable components:** Applies — finding #2. The two modals (Milestone Update lines 393-470, View Dossier lines 472-542) are hand-rolled instances for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 244-247) uses the shared `<Spinner />` in a padded box, same pattern noted elsewhere.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies — finding #1. Page chrome itself (buttons, focus rings) correctly uses `purple-*` throughout — only the status badge hues need fixing.
- **Design consistency:** N/A.
- **Correctness:** N/A — no logic bugs found; the timeline filter, search, and stage-update flow all work correctly.
- **Improvement opportunity:** None found specific to this page.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/agent-dashboard/MySchedule.page.jsx`:

**1. Color consistency:**
- Replace `orange-*` (on_the_way badge) and `blue-*` (in_progress badge) in `renderStatusBadge` (lines 130-175) with hues that stay within `00-Color-System.md`'s canonical set — e.g. `amber` for "on the way" (transit/attention) and a role distinct from `blue`'s reserved info-only use for "in progress."

**2. Reusable extraction (coordinate with `34-ActiveExecution.md`):**
- Extract a shared `EXECUTION_STAGES` constant (id, label, and optionally icon/color) covering the 4 execution stages, and use it to build both this page's `<option>` list (lines 431-434) and `ActiveExecution.page.jsx`'s `STAGES` array — build it in whichever file is processed first, import in the other.

Preserve all existing timeline filtering, search, and milestone-update logic — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Status badges use only colors within the canonical palette.
- [ ] Stage-update dropdown options remain identical (same 4 stages, same order) after the shared-constant extraction.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
