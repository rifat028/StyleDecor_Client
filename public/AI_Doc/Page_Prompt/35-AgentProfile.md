# Agent Profile — Improvement Prompt

**Route(s):** `/dashboard/agent-profile`
**File(s) in scope:** `src/features/agent-dashboard/AgentProfile.page.jsx`. Cross-referenced: `src/features/decorator-dashboard/MyAgents.page.jsx` (matching status vocabulary — confirms `31-MyAgents.md` finding #2), `src/features/admin/ManageAgents.page.jsx` (conflicting `suspended` status).
**Related audit references:**
- `31-MyAgents.md` finding #2 / `24-ManageAgents.md` finding #3 — this file's own status options independently confirm the vocabulary mismatch already flagged between the decorator-side and admin-side agent pages; see finding #1 for the sharpest instance of the conflict.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **An agent can self-set their own operational status via 4 buttons that don't include `suspended` — meaning a suspended agent's own profile shows no status as selected at all.** The status-selector buttons (lines 268-272) offer exactly `available`/`on_assignment`/`off_duty`/`on_leave` — the same 4-value set already found in `MyAgents.page.jsx`'s Edit modal (`31-MyAgents.md` finding #2), and missing `suspended`, which `ManageAgents.page.jsx` (admin) uses as one of its 4 statuses. Since `formData.status` is initialized directly from `ag.status || "available"` (line 60) with no fallback mapping, an agent whose account an admin has set to `"suspended"` would load this page and see **none** of the 4 status buttons highlighted as current (the `formData.status === st.id` check, line 279, never matches `"suspended"` against any of the 4 listed ids) — a confusing, ambiguous UI for exactly the account state where clarity matters most. Compounding this: there is no confirmation dialog before submitting any status change via `PATCH /agents/me` (lines 77-98) — an agent can silently self-set their own availability with a single click-and-save, unlike the admin's confirmation-gated equivalent action. — **Critical** (a real, reproducible broken state for suspended accounts, plus an unconfirmed self-service status change on a field-dispatch-affecting value).

### Generic checklist

- **Reusable components:** N/A — this page correctly uses a plain inline form instead of a modal, a simpler and better pattern than most of the app's edit flows; no duplication to extract.
- **Skeleton/spinner loader:** N/A — the one loading state (lines 100-106) is an appropriate full-page use of `<Spinner />`.
- **Tooltip:** N/A.
- **Responsiveness:** No issues found — the 1/3-2/3 identity-card/form-column split collapses to a single column below `lg`.
- **Color consistency:** N/A — the online-status dot (`emerald`/`blue`/`slate`, lines 152-159) is a small, reasonable 3-way indicator; no fix needed. Page chrome is otherwise clean, consistently `purple`.
- **Design consistency:** N/A.
- **Correctness:** Applies — finding #1, the clear priority.
- **Improvement opportunity:** None beyond fixing finding #1.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A — the status buttons are real `<button type="button">` elements, form fields are correctly labeled.

## Implementation Prompt

Apply these changes to `src/features/agent-dashboard/AgentProfile.page.jsx`:

**1. Correctness fix (do first, highest value):**
- Resolve the status-vocabulary conflict alongside `31-MyAgents.md`/`24-ManageAgents.md`: confirm with whoever owns the agent-status model whether `suspended` (admin-imposed) and this page's 4 self-service options are meant to be entirely separate concerns (e.g. an admin-only `accountStatus` field distinct from an agent-editable `availabilityStatus` field) or the same field. If the same field, add a read-only "Suspended by Administrator" state display when `agent.status === "suspended"` (disable the self-service buttons entirely in that case, since an agent shouldn't be able to un-suspend themselves), rather than silently showing an unhighlighted button grid. If genuinely separate fields, rename this page's field (e.g. to `availabilityStatus`) to avoid the naming collision with the admin-controlled `status`.
- Add a confirmation step (e.g. a lightweight SweetAlert2 confirm) before submitting a status change that would make the agent unavailable for dispatch (`off_duty`/`on_leave`), matching the confirmation pattern already used for equivalent status transitions on the admin side (`ManageAgents.page.jsx`'s `handleUpdateStatus`).

Preserve all existing profile-field editing (name, phone, designation, specialization, bio, emergency contact) — only the status-handling logic needs to change.

---

## Architecture & Sub-Component Sizing Standard
All split sub-components for this page MUST reside in their dedicated directory under `src/components/pages/Agent/AgentProfile/`.

> [!IMPORTANT]
> **Component Sizing Rule:** Each decomposed sub-component must contain **at least 100–150 lines to a maximum of 250–350 lines**. Avoid fragmenting code into tiny micro-files (< 100 lines); group related cohesive functionality (e.g. Toolbar/Stats+Filters, Table+Rows+Pagination, Modals/Forms) together.

- **Sub-Components Directory:** `src/components/pages/Agent/AgentProfile/`

---

## UI/UX & Layout Enhancements

1. **Top Header Bar**:
   - Built using the standardized reusable `<DashboardPageHeader>` component (`src/components/ui/DashboardPageHeader.jsx`).
   - Frameless structure with no background card, no outer border, and no vertical padding box.
   - **Left:** Contextual icon badge in purple container (`p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl`), responsive title (`text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight`), and descriptive subtitle (`text-xs sm:text-sm text-slate-500 dark:text-slate-400`).
   - **Right:** Standardized "Refresh Data" button (`onRefresh`, `refreshing`, `refreshDisabled`) alongside a custom action button slot (`actions` / `children`) for page-specific primary/secondary actions.
   - **Bottom:** Tapered border line (`h-[3px] w-full rounded-full bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent`).

2. **Stat Cards Section (if applicable)**:
   - Built with the reusable `<StatCard>` component (`src/components/ui/StatCard.jsx`) supporting categorical tone themes.
   - Ultra-compact horizontal layout with minimal height (~48px) and no captions/subtitles.
   - Interactive click-to-filter support and pulse skeleton loader fallback state (`loading={true}`) when stats data is fetching or unavailable.

3. **Search & Filters Bar Section (if applicable)**:
   - Sits directly above the table/cards in a rounded card container (`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800`).
   - **Left:** Search input with search icon, live debounce (350ms), and clear `(X)` button.
   - **Right:** Clean dropdown selectors for filtering without redundant filter icons next to the dropdowns.

4. **Card / Form Grid Layout**:
   - Organized into clean, responsive grid layout with proper card borders and dark mode tokens.
   - Interactive elements have clear hover and focus states.

6. **Modals & Dialogs (if applicable)**:
   - Reusable `<Modal>` component (`src/components/ui/Modal.jsx`) mounted via `createPortal` with backdrop click close and Escape key dismiss.

7. **Coding Standards**:
   - Single-line comments only (`// ...`) with light density.
   - Strictly no block comments (`/* ... */`).

---

## Verification Checklist

- [ ] Sub-components live in `src/components/pages/Agent/AgentProfile/` and adhere to the 100-350 lines sizing standard.
- [ ] Header has icon, title, and subtitle on top-left, and Action button on top-right.
- [ ] Stat cards use `<StatCard>` with ultra-compact minimal height (~48px) and skeleton loading fallback.
- [ ] Interactive controls and form elements have proper disabled, hover, and focus states.
- [ ] Single-line comments only (`// ...`) with light density.
- [ ] `npm run build` compiles with 0 errors.