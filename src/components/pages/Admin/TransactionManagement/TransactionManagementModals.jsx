import React from "react";
import {
  CreditCard,
  Building2,
  Calendar,
  FileText,
  User,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Helper to render role badge
const renderRoleBadge = (role) => {
  const r = String(role || "").toLowerCase();
  if (r === "customer") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
        <User className="w-2.5 h-2.5" /> Customer
      </span>
    );
  }
  if (r === "decorator") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
        <Building2 className="w-2.5 h-2.5" /> Decorator
      </span>
    );
  }
  if (r === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
        <ShieldCheck className="w-2.5 h-2.5" /> Admin
      </span>
    );
  }
  if (r === "agent") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
        <UserCheck className="w-2.5 h-2.5" /> Agent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
      {role}
    </span>
  );
};

// Consolidated Payment Dossier Modal
const TransactionManagementModals = ({
  isReceiptModalOpen,
  onCloseReceipt,
  selectedPayment,
  receiptLoading,
}) => {
  return (
    <Modal
      isOpen={isReceiptModalOpen}
      onClose={onCloseReceipt}
      title={
        selectedPayment
          ? `Payment Dossier: #${selectedPayment.paymentCode || selectedPayment._id?.slice(-8)}`
          : "Payment Dossier"
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
          {/* Header Box with Payment Code & Amount */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                #{selectedPayment.paymentCode || selectedPayment._id?.slice(-8)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 uppercase">
                {selectedPayment.paymentType?.replace(/_/g, " ") || "Payment"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Method:{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                  {selectedPayment.paymentMethod || "Online"}
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paid on:{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedPayment.paidAt
                    ? new Date(selectedPayment.paidAt).toLocaleString("en-GB")
                    : "Recent"}
                </span>
              </p>
            </div>
          </div>

          {/* Amount Banner */}
          <div className="p-4 rounded-xl border border-purple-200/60 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
              Settled Amount
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              ৳{Number(selectedPayment.amount || 0).toLocaleString()} {selectedPayment.currency || "BDT"}
            </span>
          </div>

          {/* From (Sender) & To (Receiver) Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* From / Sender */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-400 uppercase text-[10px]">From (Sender)</p>
                {renderRoleBadge(selectedPayment.sender?.role || "customer")}
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {selectedPayment.sender?.name || selectedPayment.sender?.businessName || "Sender"}
              </p>
              {selectedPayment.sender?.email && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selectedPayment.sender.email}
                </p>
              )}
              {selectedPayment.sender?.phone && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selectedPayment.sender.phone}
                </p>
              )}
            </div>

            {/* To / Receiver */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-400 uppercase text-[10px]">To (Receiver)</p>
                {renderRoleBadge(selectedPayment.receiver?.role || "decorator")}
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {selectedPayment.receiver?.name || selectedPayment.receiver?.businessName || "Receiver"}
              </p>
              {selectedPayment.receiver?.phone && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selectedPayment.receiver.phone}
                </p>
              )}
              {selectedPayment.receiver?.district && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Territory: {selectedPayment.receiver.district}
                </p>
              )}
            </div>
          </div>

          {/* Linked Booking Dossier */}
          {selectedPayment.booking && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Associated Booking
              </p>
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-semibold">{selectedPayment.booking.serviceSnapshot?.title || "Event Decor Service"}</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{selectedPayment.booking.bookingCode}</span>
              </div>
              {selectedPayment.booking.eventDetails?.eventDate && (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Event: {new Date(selectedPayment.booking.eventDetails.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {selectedPayment.booking.eventDetails?.venueName && (
                    <span>• {selectedPayment.booking.eventDetails.venueName}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Modal Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onCloseReceipt}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default TransactionManagementModals;
