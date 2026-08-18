import React from "react";
import { Printer } from "lucide-react";
import Modal from "../../../ui/Modal";
import { PaymentStatusBadge } from "./MyEarningsTable";

// Payment Receipt & Invoice Dossier Modal with Print / Export Support
const MyEarningsReceiptModal = ({
  isOpen,
  onClose,
  selectedPayment,
  decoratorProfile,
  loading = false,
}) => {
  if (!isOpen) return null;

  // Handle Printable Invoice Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Receipt & Invoice Dossier"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300">
        {loading || !selectedPayment ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">
            Loading payment invoice dossier...
          </div>
        ) : (
          <>
            {/* Top Payment Ref Banner */}
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Payment Reference Code
                </span>
                <h4 className="text-base font-black text-purple-900 dark:text-purple-200 font-mono">
                  {selectedPayment.paymentCode}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Paid on{" "}
                  {new Date(
                    selectedPayment.paidAt || selectedPayment.createdAt
                  ).toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <PaymentStatusBadge status={selectedPayment.status} />
              </div>
            </div>

            {/* Customer & Agency Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Paid By Client
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedPayment.customer?.name ||
                    selectedPayment.clientName ||
                    "Valued Client"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedPayment.customer?.email || selectedPayment.clientEmail}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Phone: {selectedPayment.customer?.phone || "N/A"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Beneficiary Agency
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedPayment.decorator?.businessName ||
                    decoratorProfile?.businessName ||
                    "StyleDecor Verified Agency"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  City: {selectedPayment.decorator?.contactInfo?.city || "Dhaka"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hotline: {selectedPayment.decorator?.contactInfo?.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Linked Booking Overview */}
            {selectedPayment.booking && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Linked Booking
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedPayment.booking.bookingCode} •{" "}
                  {selectedPayment.booking.serviceSnapshot?.title ||
                    "Decoration Setup"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Venue:{" "}
                  {selectedPayment.booking.eventDetails?.venueName ||
                    "Convention Venue"}
                </p>
              </div>
            )}

            {/* Gateway Transaction Clearing Details */}
            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Gateway Clearing Details
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400">Payment Gateway</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 uppercase mt-0.5">
                    {selectedPayment.paymentMethod || "SSLCommerz"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400">Transaction ID</span>
                  <p className="font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {selectedPayment.gatewayDetails?.transactionId || "TRX-SETTLED"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400">Payment Type</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                    {(selectedPayment.paymentType || "advance_deposit").replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Accounting Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Payout Accounting Breakdown
              </h5>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Gross Amount Paid by Client</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  ৳{Number(selectedPayment.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Gateway Fee (1.5%)</span>
                <span>
                  -৳
                  {Number(
                    selectedPayment.breakdown?.gatewayFee ||
                      Math.round((selectedPayment.amount || 0) * 0.015)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Commission (10.0%)</span>
                <span>
                  -৳
                  {Number(
                    selectedPayment.breakdown?.platformCommission ||
                      Math.round((selectedPayment.amount || 0) * 0.10)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-emerald-600 dark:text-emerald-400">
                <span>Net Vendor Receivable (88.5%)</span>
                <span>
                  ৳
                  {Number(
                    selectedPayment.breakdown?.vendorReceivable ||
                      Math.round((selectedPayment.amount || 0) * 0.885)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Footer with Print, Download and Close Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs transition-colors"
                  title="Print Invoice Receipt"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-600" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MyEarningsReceiptModal;
