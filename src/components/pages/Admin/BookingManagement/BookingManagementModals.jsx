import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  FileText,
  UserCheck,
  Tag,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Consolidated Booking Dossier Modal (240-280 lines)
const BookingManagementModals = ({
  selectedBooking,
  onClose,
}) => {
  if (!selectedBooking) return null;

  const totalAmount =
    selectedBooking.totalPrice ||
    selectedBooking.amount ||
    selectedBooking.pricing?.totalPrice ||
    0;
  const paidAmount =
    selectedBooking.paidAmount ||
    selectedBooking.advancePaid ||
    selectedBooking.pricing?.paidAmount ||
    0;
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  return (
    <Modal
      isOpen={!!selectedBooking}
      onClose={onClose}
      title={`Booking Dossier: #${selectedBooking.bookingCode || selectedBooking._id?.slice(-6)}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header Summary Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedBooking.serviceTitle ||
                selectedBooking.service?.title ||
                selectedBooking.serviceName ||
                "Custom Event Decoration"}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase">
              {selectedBooking.status || "Pending"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Booking created on{" "}
            {selectedBooking.createdAt
              ? new Date(selectedBooking.createdAt).toLocaleDateString()
              : "Standard Date"}
          </p>
        </div>

        {/* Detailed Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Profile */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Customer Information
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {selectedBooking.customerName ||
                selectedBooking.user?.name ||
                "Customer"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>
                {selectedBooking.customerPhone ||
                  selectedBooking.phone ||
                  "Not provided"}
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>
                {selectedBooking.customerEmail ||
                  selectedBooking.email ||
                  "Not provided"}
              </span>
            </p>
          </div>

          {/* Event Schedule & Timing */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Event Execution Schedule
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>
                {selectedBooking.eventDate
                  ? new Date(
                      selectedBooking.eventDate
                    ).toLocaleDateString()
                  : "Date TBD"}
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{selectedBooking.timeSlot || "Full Day (Morning to Evening)"}</span>
            </p>
          </div>

          {/* Venue & Location */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Venue & Setup Address
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {[
                selectedBooking.venueAddress,
                selectedBooking.address?.street,
                selectedBooking.address?.area,
                selectedBooking.address?.city || selectedBooking.city,
              ]
                .filter(Boolean)
                .join(", ") || "Address recorded on file"}
            </p>
          </div>

          {/* Assigned Decorator & Specialist Agent */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Decorator Vendor
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {selectedBooking.decoratorName ||
                selectedBooking.decorator?.businessName ||
                "StyleDecor Partner"}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Assigned Field Specialist
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {selectedBooking.assignedAgentName ||
                selectedBooking.assignedAgent?.name ||
                "Pending Assignment"}
            </p>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-purple-50/40 dark:bg-purple-950/20 sm:col-span-2">
            <p className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> Financial Summary & Payment Breakdown
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900/50 shadow-2xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Total Package
                </p>
                <p className="text-base font-black text-slate-900 dark:text-slate-100">
                  ৳{Number(totalAmount).toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-2xs">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Paid
                </p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  ৳{Number(paidAmount).toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-amber-900/50 shadow-2xs">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Balance Due
                </p>
                <p className="text-base font-black text-amber-600 dark:text-amber-400">
                  ৳{Number(dueAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingManagementModals;
