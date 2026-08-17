# Manage Transactions / Payments (Admin) — Improvement Prompt

**Route(s):** `/dashboard/manage-transactions`, `/dashboard/manage-payments`
**File(s) in scope:** `src/features/admin/ManageTransactions.page.jsx`.
**Related audit references:**
- `04-Business-Logic.md` §7 (commission/vendor-split fallback formula: gateway fee 1.5%, platform commission 10.0%, vendor receivable 88.5%) — confirmed present exactly as documented at lines 352-353 (table) and 590/594/598 (modal).
- `04-Business-Logic.md` §8 (refunds: "No partial-refund guardrails or approval workflow... visible in the frontend") — this file is the exact site of that gap; see finding #1 for the precise mechanism.
- `05-Upgrade-Ideas.md` B4 (centralize commission/deposit math server-side) — this file is one of the places doing client-side fallback math; infrastructure-level, out of scope for this pass, only flagged for awareness.
- `00-Color-System.md` (canonical palette)

## Findings

### Page-specific

1. **Refund amount input has no upper-bound validation — an admin can refund more than the original payment amount.** Lines 650-655: `<input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} .../>` has no `max` attribute tied to `refundPayment.amount`, and `handleProcessRefund` (lines 157-182) sends whatever numeric value is currently in the field straight to `POST /payments/:id/refund` with zero client-side bound-check. A typo (e.g. an extra zero) or a rushed admin action could submit a refund larger than the customer ever paid. This is the precise, previously-only-generally-described mechanism behind `04-Business-Logic.md` §8's "no partial-refund guardrails" note. — **Critical** (financial-correctness risk on a real money-movement action).
2. **Platform Commission column/field uses `indigo-*` — likely a deliberate categorical choice, not primary-color drift.** Table column (line 402) and modal breakdown (line 592) both use `text-indigo-600 dark:text-indigo-400` for the commission figure, while the rest of the page's chrome correctly uses `purple-600` as primary. Given this sits alongside a `purple` reference-code column and an `emerald` vendor-share column in a 3-way financial breakdown, this reads as an intentional distinct data-visualization color for "platform's cut" rather than a stray primary-color mistake — different in kind from the `ManageUser.page.jsx`/`ManageCategories.page.jsx` indigo-as-primary drift. Flagging for a judgment call rather than a hard fix. — **Polish**.
3. **Gradient utility syntax mismatch, same recurring issue found elsewhere.** N/A — this file doesn't use gradients on its own header (unlike `Transactions.page.jsx`'s customer-facing sibling and `ManageAgents.page.jsx`/`ManageReviews.page.jsx`, which do — see those files' findings).
4. **File is 693 lines, with the two modals accounting for roughly 180 lines combined.** Concrete split points: the receipt/dossier modal body (lines ~526-601, once wrapped in the shared `<Modal>` shell) → `src/features/admin/components/ManageTransactionsReceiptModal.jsx`; the refund modal body (lines ~636-668) → `RefundModal.jsx`; the table row (lines ~345-437) → a local `<PaymentTableRow>`. — **Polish** (maintainability, not a functional bug).

### Generic checklist

- **Reusable components:** Applies, minor — the receipt/dossier modal (lines 507-615) and refund modal (lines 617-688) are two more hand-rolled instances for the shared `<Modal>` shell (`02-Reusable-Components.md` §6).
- **Component decomposition / file size:** Applies — 693 lines; see finding #4 for concrete split points (both modals, table row).
- **Skeleton/spinner loader:** Applies, minor — table loading (lines 307-310) and the receipt-modal loading state (lines 527-530) both use the shared `<Spinner />` in a padded box, same pattern noted on several other pages — the modal instance is a stronger case for a fix since it's nested inside an already-open modal (same layout-shift risk noted in `15-Transactions.md` finding #1).
- **Tooltip:** N/A — action buttons have `title` attributes.
- **Responsiveness:** No issues found.
- **Color consistency:** Applies, minor — finding #2 (judgment call, not a clear violation).
- **Design consistency:** N/A. Pagination uses the "Page X of Y" text-only format, same gap as other admin pages.
- **Correctness:** Applies — finding #1, the clear priority.
- **Improvement opportunity:** `05-Upgrade-Ideas.md` B4 applies at the infrastructure level (centralizing commission math) — out of scope for a single-page pass, noted only.
- **Coding standard:** N/A.
- **Comments:** N/A.
- **Accessibility:** N/A beyond the general Modal-focus-trap gap already covered elsewhere.

## Implementation Prompt

Apply these changes to `src/features/admin/ManageTransactions.page.jsx`:

**1. Correctness fix (do first, highest value):**
- Add `max={refundPayment.amount}` to the refund amount input (line 650-655), and add explicit client-side validation in `handleProcessRefund` rejecting (with a clear error message) any `refundAmount` greater than `refundPayment.amount` before the request is sent — don't rely on the `max` attribute alone, since it doesn't block a value typed in via keyboard on all browsers/input methods. Also reject `refundAmount <= 0`.

**2. Reusable component extraction (coordinate with other admin pages, build once):**
- Build the shared `<Modal>` shell and migrate both the receipt/dossier modal (lines 507-615) and refund modal (lines 617-688) onto it.
- Replace the receipt-modal `<Spinner />` (lines 527-530) with a small inline loading indicator sized for the modal's content area, matching the fix already recommended in `15-Transactions.md` finding #1 for the equivalent customer-facing modal.
- Build `<Pagination>` and replace the text-only pagination footer.

**3. Component decomposition:**
- Extract the receipt modal into `src/features/admin/components/ManageTransactionsReceiptModal.jsx`, the refund modal into `RefundModal.jsx`, and the table row into a local `<PaymentTableRow>`.

Preserve the platform-commission fallback math and all existing filtering/search logic exactly as-is — the commission percentages are a documented business rule (`04-Business-Logic.md` §7), not something to change in this pass.

## Verification Checklist

- [ ] Attempting to refund more than the original payment amount is blocked with a clear error, before any request is sent to the backend.
- [ ] Attempting to refund a zero or negative amount is blocked.
- [ ] A valid partial or full refund still processes successfully exactly as before.
- [ ] Receipt modal loading state doesn't force a full-viewport-height spinner inside the modal.
- [ ] Page renders and behaves identically after extracting both modals and the table row into local sub-components.
- [ ] Page tested at mobile, tablet, and desktop widths in both themes — no regression.
