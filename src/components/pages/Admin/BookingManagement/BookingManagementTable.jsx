import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  CreditCard,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// Helper to render booking lifecycle status badge
const renderStatusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
          <AlertCircle className="w-3 h-3" /> Pending
        </span>
      );
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Accepted
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    case "advance_paid":
    case "advance paid":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 uppercase">
          <CreditCard className="w-3 h-3" /> Advance Paid
        </span>
      );
    case "in_progress":
    case "inprogress":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
          <Clock className="w-3 h-3" /> In Progress
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
          {status}
        </span>
      );
  }
};

// Booking management table component with responsive min-widths and pagination (220-250 lines)
const BookingManagementTable = ({
  bookings,
  loading,
  onView,
  onResetFilters,
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden rounded-none">
      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Event & Package</th>
                <th className="py-3.5 px-2 min-w-45">Customer & Venue</th>
                <th className="py-3.5 px-2 min-w-40">Decorator Agency</th>
                <th className="py-3.5 px-2 text-center min-w-35">Amount & Payment</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-25">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={6} />
          </table>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Bookings Found"
          message="Try adjusting your status or decorator vendor filter."
          action={{
            label: "Clear All Filters",
            onClick: onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Event & Package</th>
                <th className="py-3.5 px-2 min-w-45">Customer & Venue</th>
                <th className="py-3.5 px-2 min-w-40">Decorator Agency</th>
                <th className="py-3.5 px-2 text-center min-w-35">Amount & Payment</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-25">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {bookings.map((booking) => {
                const totalAmount =
                  booking.totalPrice ||
                  booking.amount ||
                  booking.pricing?.totalPrice ||
                  0;
                const paidAmount =
                  booking.paidAmount ||
                  booking.advancePaid ||
                  booking.pricing?.paidAmount ||
                  0;
                const isPaid = paidAmount >= totalAmount && totalAmount > 0;

                return (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Event & Package Profile Cell */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                          <span>
                            {booking.serviceTitle ||
                              booking.service?.title ||
                              booking.serviceName ||
                              "Event Booking"}
                          </span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                            <Calendar className="w-3 h-3" />
                            {booking.eventDate
                              ? new Date(
                                  booking.eventDate
                                ).toLocaleDateString()
                              : "TBD"}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            #{booking.bookingCode || booking._id?.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer & Venue Cell */}
                    <td className="py-3.5 px-2 min-w-45">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {booking.customerName ||
                              booking.user?.name ||
                              "Customer"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {booking.venueAddress ||
                              booking.address?.city ||
                              "Dhaka Venue"}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Decorator Agency Cell */}
                    <td className="py-3.5 px-2 min-w-40">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {booking.decoratorName ||
                              booking.decorator?.businessName ||
                              "Decorator Agency"}
                          </span>
                        </p>
                        {booking.assignedAgentName && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 truncate">
                            <UserCheck className="w-3 h-3 shrink-0" />
                            <span>{booking.assignedAgentName}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Amount & Payment State Cell */}
                    <td className="py-3.5 px-2 text-center min-w-35">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
                          ৳{Number(totalAmount).toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                            isPaid
                              ? "text-emerald-600 dark:text-emerald-400"
                              : paidAmount > 0
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isPaid
                            ? "Fully Paid"
                            : paidAmount > 0
                            ? `Paid ৳${paidAmount.toLocaleString()}`
                            : "Unpaid"}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge Cell */}
                    <td className="py-3.5 px-2 text-center min-w-40">
                      {renderStatusBadge(booking.status)}
                    </td>

                    {/* Centered Actions Cell */}
                    <td className="py-3.5 px-2 text-center min-w-25">
                      <div className="flex items-center justify-center">
                        <TableActionButton
                          icon={Eye}
                          onClick={() => onView(booking)}
                          tooltip="View Booking Dossier"
                          tone="purple"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Part Streamlined Pagination Footer */}
      {!loading && bookings.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="bookings"
        />
      )}
    </div>
  );
};

export default BookingManagementTable;
