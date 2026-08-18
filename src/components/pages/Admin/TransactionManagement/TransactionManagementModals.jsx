import React from "react";
import {
  DollarSign,
  CreditCard,
  Building,
  Calendar,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  User,
  ShieldAlert,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Consolidated Transaction Invoice & Refund Modals (240-280 lines)
const TransactionManagementModals = ({
  isReceiptModalOpen,
  onCloseReceipt,
  selectedPayment,
  receiptLoading,
  isRefundModalOpen,
  onCloseRefund,
  refundPayment,
  refundAmount,
  onRefundAmountChange,
  refundReason,
  onRefundReasonChange,
  onSubmitRefund,
  submittingRefund,
}) => {
  return (
    <>
      {/* 1. View Invoice & Payment Dossier Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={onCloseReceipt}
        title={
          selectedPayment
            ? `Invoice Dossier: #${selectedPayment.paymentCode || selectedPayment._id?.slice(-8)}`
            : "Invoice Dossier"
        }
        maxWidth="max-w-xl"
      >
        {receiptLoading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Fetching payment dossier...</p>
          </div>
        ) : selectedPayment ? (
          <div className="space-y-6">
            {/* Header Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  TRX: {selectedPayment.transactionId || "TRX-STANDARD"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 uppercase">
                  {selectedPayment.status || "Completed"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Processed via{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400 uppercase">
                  {selectedPayment.paymentMethod || "Online"}
                </span>{" "}
                on{" "}
                {selectedPayment.createdAt
                  ? new Date(selectedPayment.createdAt).toLocaleString()
                  : "Standard Date"}
              </p>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
              <p className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Financial Escrow Ledger
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                  <span>Gross Transaction Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ৳{Number(selectedPayment.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                  <span>Platform Commission Fee (10%):</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    ৳
                    {Number(
                      selectedPayment.platformFee ||
                        (selectedPayment.amount || 0) * 0.1
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-800/60 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                  <span>Net Vendor Payable:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ৳
                    {Number(
                      (selectedPayment.amount || 0) -
                        (selectedPayment.platformFee ||
                          (selectedPayment.amount || 0) * 0.1)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Booking Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px]">
                  Customer Account
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {selectedPayment.customerEmail ||
                    selectedPayment.userEmail ||
                    "Customer"}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px]">
                  Decorator Vendor
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {selectedPayment.decoratorName ||
                    selectedPayment.decorator?.businessName ||
                    "StyleDecor Partner"}
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCloseReceipt}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* 2. Process Dispute Refund Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={onCloseRefund}
        title="Process Transaction Refund"
        maxWidth="max-w-lg"
      >
        {refundPayment && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitRefund();
            }}
            className="space-y-5"
          >
            {/* Warning Banner */}
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <p>
                This action will debit the platform escrow and issue a dispute refund back to the customer's payment account.
              </p>
            </div>

            {/* Refund Amount Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Refund Amount (BDT)
              </label>
              <input
                type="number"
                min="1"
                max={refundPayment.amount}
                value={refundAmount}
                onChange={(e) => onRefundAmountChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                Max allowable refund: ৳
                {Number(refundPayment.amount || 0).toLocaleString()}
              </p>
            </div>

            {/* Refund Reason */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Reason for Refund & Memo
              </label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={(e) => onRefundReasonChange(e.target.value)}
                required
                placeholder="Explain the cancellation reason or customer dispute..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCloseRefund}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingRefund}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submittingRefund ? "Processing..." : "Confirm & Issue Refund"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default TransactionManagementModals;
