# My Earnings (Decorator) — Improvement Prompt

**Route(s):** `/dashboard/my-earnings`
**File(s) in scope:** `src/features/decorator-dashboard/MyEarnings.page.jsx`. Cross-referenced: `src/features/decorator-dashboard/MyProjects.page.jsx`/`MyAgents.page.jsx` (duplicated decorator-ID resolution — see finding #1).
**Related audit references:**
- `04-Business-Logic.md` §7 (gateway fee 1.5%, platform commission 10.0%, vendor receivable 88.5%) — confirmed present exactly as documented, consistent with `23-ManageTransactions.md`.
- `05-Upgrade-Ideas.md` A7 (PDF invoices / downloadable receipts — "no 'Download PDF' or 'Print Invoice' action anywhere... a lightweight PDF export... is a small add with clear value") — this file has unused imports pointing directly at this unbuilt feature, see finding #2.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Decorator-ID resolution logic (lines 47-69) is duplicated near-identically in `MyProjects.page.jsx` and `MyAgents.page.jsx`.** Same `/decorators/me` → fallback `/decorators/:email` pattern — see `29-MyProjects.md` finding #3 for the full cross-file picture and the recommended `useDecoratorId()` extraction.
2. **`Download` and `Printer` icons are imported but never used anywhere in the file.** Lines 22-23: `import { ..., Download, Printer, ... } from "lucide-react";` — neither icon appears in the JSX. This page's own receipt/invoice modal (lines 430-563) has no export or print action at all, despite the header literally being titled "Payment Receipt & Invoice Dossier." These unused imports are strong circumstantial evidence that a "Download PDF" or "Print Receipt" button was planned for this exact modal and never wired up — directly matching `05-Upgrade-Ideas.md` A7's assessment that this is "a small add with clear value" for a payments-heavy product. — **Moderate** (dead imports + a near-built, high-value feature gap in one finding).

### Generic checklist

- **Reusable components:** Applies — finding #1. The receipt modal (lines 430-563) is another hand-rolled instance for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 309-312) and the receipt-modal loading state (lines 450-453) both use the shared `<Spinner />` in a padded box, same pattern noted on several other pages.
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — legacy `bg-gradient-to-br` syntax (line 207), same recurring issue found elsewhere; change to `bg-linear-to-br`. The `indigo-*` "Platform Fee" stat-card accent (lines 235, 237) reads as deliberate KPI-dashboard categorical variety, same judgment call as `26-Analytics.md` — not a hard violation.
- **Design consistency:** N/A.
- **Correctness:** N/A beyond the DRY/dead-import findings above — no logic bugs found.
- **Improvement opportunity:** `05-Upgrade-Ideas.md` A7 applies directly — see finding #2.
- **Coding standard:** Applies — finding #2 (remove or wire up the unused imports).
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/decorator-dashboard/MyEarnings.page.jsx`:

**1. Feature completion or cleanup (pick one, don't leave the imports dangling either way):**
- Preferred: wire up the `Download`/`Printer` icons into an actual "Download PDF" / "Print Receipt" action in the receipt modal footer (lines 553-560), using a lightweight client-side PDF export (e.g. `jspdf` or `react-to-print`, per `05-Upgrade-Ideas.md` A7) rendering the already-displayed receipt breakdown. This is a well-scoped, high-value addition — the data and layout already exist in the modal, only the export action is missing.
- If PDF export is out of scope for this pass, remove the unused `Download`/`Printer` imports (lines 22-23) rather than leaving dead imports implying unfinished work.

**2. Reusable extraction (coordinate with `29-MyProjects.md`/`31-MyAgents.md`):**
- Replace this file's decorator-ID resolution (lines 47-69) with the shared `useDecoratorId()` hook once built (or build it here if this is the first page processed).
- Migrate the receipt modal onto the shared `<Modal>` shell if built by another page's pass.

**3. Polish:**
- Change `bg-gradient-to-br` (line 207) to `bg-linear-to-br`.

Preserve all existing payment-filtering, search, and commission-breakdown display logic — none of the above requires restructuring the page.

## Verification Checklist

- [ ] Either a working Download/Print action exists in the receipt modal, or the unused icon imports have been removed — no dead imports remain either way.
- [ ] Decorator profile still resolves correctly via the shared hook (once built), matching prior behavior.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
