import React from "react";
import {
  Calendar,
  CreditCard,
  X,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Project & Payment Audit Dossier Modal
export const MyProjectsViewModal = ({
  isOpen,
  onClose,
  selectedBooking,
  bookingPayments = [],
  paymentsLoading = false,
}) => {
  if (!isOpen || !selectedBooking) return null;

  const total =
    selectedBooking.pricingBreakdown?.grandTotal ||
    selectedBooking.totalCost ||
    0;
  const paid =
    selectedBooking.pricingBreakdown?.paidAmount ||
    selectedBooking.paidAmount ||
    0;
  const due =
    selectedBooking.pricingBreakdown?.dueAmount ||
    Math.max(0, total - paid);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Project Dossier: ${selectedBooking.bookingCode || "Booking Details"}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300">
        {/* Project Snapshot Banner */}
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-1">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Service Package & Tier
          </span>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Selected Tier:{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {selectedBooking.serviceSnapshot?.selectedPackage ||
                selectedBooking.packageTier ||
                "Standard Setup"}
            </span>
          </p>
        </div>

        {/* Client Contact & Venue Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Client Details
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {selectedBooking.customer?.name || selectedBooking.clientName || "Valued Client"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {selectedBooking.customer?.email || selectedBooking.clientEmail || "Email N/A"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-purple-500" />
              <span>{selectedBooking.contact || selectedBooking.customer?.phone || "N/A"}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Venue Logistics
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {selectedBooking.eventDetails?.venueName || selectedBooking.location || "Venue TBD"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {selectedBooking.eventDetails?.venueAddress || selectedBooking.location || "Address TBD"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Timing: {selectedBooking.eventDetails?.startTime || "16:00"} – {selectedBooking.eventDetails?.endTime || "22:00"}
            </p>
          </div>
        </div>

        {/* Payment Financial Audit Trail */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              <span>Payment & Deposit Audit Trail</span>
            </h5>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase">
              Status: {selectedBooking.paymentStatus || "unpaid"}
            </span>
          </div>

          {paymentsLoading ? (
            <div className="p-8 text-center text-slate-400 animate-pulse">
              Loading financial audit trail...
            </div>
          ) : bookingPayments.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-slate-400">
              No payments recorded for this booking yet.
            </div>
          ) : (
            <div className="space-y-2">
              {bookingPayments.map((pay) => {
                const receivable =
                  pay.breakdown?.vendorReceivable || Math.round(pay.amount * 0.885);
                const commission =
                  pay.breakdown?.platformCommission || Math.round(pay.amount * 0.10);

                return (
                  <div
                    key={pay._id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">
                          {pay.paymentCode}
                        </span>
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {pay.paymentMethod || "Online"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        TRX: {pay.gatewayDetails?.transactionId || "TRX-SETTLED"} •{" "}
                        {new Date(pay.paidAt || pay.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="font-black text-slate-900 dark:text-slate-100 text-xs">
                        ৳{Number(pay.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Receivable (88.5%): ৳{receivable.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Balance Breakdown Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">
              Grand Total: ৳{Number(total).toLocaleString()}
            </span>
            <span className="text-purple-600 dark:text-purple-400">
              Paid: ৳{Number(paid).toLocaleString()} | Due: ৳{Number(due).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Advance Project Lifecycle Status Modal
export const UpdateStatusModal = ({
  isOpen,
  onClose,
  selectedBooking,
  nextStatus,
  setNextStatus,
  statusSteps = [],
  onSubmit,
}) => {
  if (!isOpen || !selectedBooking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advance Project Lifecycle"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          <p className="font-bold text-slate-900 dark:text-slate-100">
            {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
          </p>
          <p className="text-slate-400">
            Client: {selectedBooking.customer?.name || selectedBooking.clientName} • Code: {selectedBooking.bookingCode}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Select Operational Stage:
          </label>
          <select
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold capitalize cursor-pointer focus:ring-2 focus:ring-purple-500/20"
          >
            {statusSteps.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-purple-600/25 transition-all"
          >
            Save Progress
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Assign Field Specialist Modal
export const AssignSpecialistModal = ({
  isOpen,
  onClose,
  selectedBooking,
  agencyAgents = [],
  selectedAgentId,
  setSelectedAgentId,
  onSubmit,
}) => {
  if (!isOpen || !selectedBooking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Field Specialist"
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-1">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Project Order
          </span>
          <p className="font-bold text-slate-900 dark:text-slate-100">
            {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Code: {selectedBooking.bookingCode} • Venue: {selectedBooking.eventDetails?.venueName || "Venue"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-100">
            Select Specialist from Agency Roster:
          </label>

          {agencyAgents.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-slate-400">
              No specialists registered yet. Visit "My Agents" to hire specialists.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {agencyAgents.map((ag) => {
                const isChosen = selectedAgentId === ag._id;
                return (
                  <div
                    key={ag._id}
                    onClick={() => setSelectedAgentId(ag._id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isChosen
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-xs"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          ag.photoUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                        }
                        alt={ag.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-purple-500/20 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-xs">{ag.name}</p>
                        <p className="text-[10px] text-slate-400">{ag.designation || "Field Specialist"}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-amber-500 font-bold text-[11px]">
                        ★ {ag.metrics?.rating || 4.8}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {ag.metrics?.activeAssignedBookings || 0} active
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedAgentId}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/25 transition-all"
          >
            Confirm Assignment
          </button>
        </div>
      </form>
    </Modal>
  );
};
