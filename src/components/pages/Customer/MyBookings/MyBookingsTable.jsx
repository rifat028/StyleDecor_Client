import React from "react";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  XCircle,
  CreditCard,
  MapPin,
  Eye,
  Edit3,
  Star,
  Trash2,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// Canonical Status Badge Component for Customer Bookings
export const BookingStatusBadge = ({ status }) => {
  const s = String(status || "")
    .toLowerCase()
    .replace(/[\s-]/g, "_");
  switch (s) {
    case "in_draft":
    case "draft":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
          Draft
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
          <AlertCircle className="w-3 h-3" /> Pending
        </span>
      );
    case "accepted":
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Confirmed
        </span>
      );
    case "advance_paid":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Advance Paid
        </span>
      );
    case "preparing":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase">
          <Sparkles className="w-3 h-3" /> Preparing
        </span>
      );
    case "on_the_way":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
          <Clock className="w-3 h-3" /> On The Way
        </span>
      );
    case "in_progress":
    case "inprogress":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase">
          <Clock className="w-3 h-3" /> In Progress
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    case "fully_paid":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
          <ShieldCheck className="w-3 h-3" /> Fully Paid
        </span>
      );
    case "rejected":
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 uppercase">
          <XCircle className="w-3 h-3" /> Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
          {status}
        </span>
      );
  }
};

// Payment Status Badge Component
export const BookingPaymentBadge = ({ booking }) => {
  const pStatus = booking.paymentStatus || (booking.paid ? "paid" : "unpaid");
  if (pStatus === "paid" || booking.status === "fully_paid") {
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 uppercase">
        Paid
      </span>
    );
  }
  if (pStatus === "partially_paid" || booking.status === "advance_paid") {
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 uppercase">
        Partial
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 uppercase">
      Unpaid
    </span>
  );
};

// Customer bookings table component with responsive min-widths and pagination
const MyBookingsTable = ({
  bookings,
  loading,
  onOpenPayModal,
  onOpenViewModal,
  onOpenEditModal,
  onOpenReviewModal,
  onDeleteBooking,
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
                <th className="py-3.5 px-2 min-w-40">Booking Code</th>
                <th className="py-3.5 px-2 min-w-45">Service & Package</th>
                <th className="py-3.5 px-2 min-w-35">Decorator Agency</th>
                <th className="py-3.5 px-2 min-w-40">Schedule & Venue</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Total (৳)
                </th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-25">Payment</th>
                <th className="py-3.5 px-2 text-center min-w-35">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={8} />
          </table>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Bookings Found"
          message="You don't have any bookings matching this criteria. Try clearing your search and filters or explore decoration packages."
          action={{
            label: "Clear All Filters",
            onClick: onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-40">Booking Code</th>
                <th className="py-3.5 px-2 min-w-45">Service & Package</th>
                <th className="py-3.5 px-2 min-w-35">Decorator Agency</th>
                <th className="py-3.5 px-2 min-w-40">Schedule & Venue</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Total (৳)
                </th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-25">Payment</th>
                <th className="py-3.5 px-2 text-center min-w-35">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map((b) => {
                const code =
                  b.bookingCode ||
                  `BK-${b._id?.slice(-6).toUpperCase() || "AUTO"}`;
                const title =
                  b.serviceSnapshot?.title ||
                  b.serviceName ||
                  "Decoration Setup";
                const pkgTier =
                  b.serviceSnapshot?.selectedPackage ||
                  b.packageTier ||
                  "Standard Package";
                const agencyName =
                  b.decorator?.businessName || "StyleDecor Agency";
                const agencyCity = b.decorator?.contactInfo?.city || "Dhaka";
                const rawDate = b.eventDetails?.eventDate || b.bookingDate;
                const dateStr = rawDate
                  ? new Date(rawDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "TBD";
                const venue =
                  b.eventDetails?.venueName || b.location || "Venue TBD";
                const total =
                  b.pricingBreakdown?.grandTotal || b.totalCost || 0;

                // Action Gating Rules
                const canPay =
                  b.paymentStatus !== "paid" &&
                  b.status !== "rejected" &&
                  b.status !== "cancelled" &&
                  b.status !== "fully_paid";

                const canEdit = [
                  "pending",
                  "accepted",
                  "confirmed",
                  "in_draft",
                  "draft",
                ].includes(String(b.status || "").toLowerCase());

                const canReview = [
                  "accepted",
                  "confirmed",
                  "advance_paid",
                  "advance paid",
                  "preparing",
                  "on_the_way",
                  "on the way",
                  "in_progress",
                  "inprogress",
                  "completed",
                  "fully_paid",
                  "fully paid",
                ].includes(String(b.status || "").toLowerCase());

                return (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Booking Code */}
                    <td className="py-3.5 px-2 min-w-32.5">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900/50">
                        {code}
                      </span>
                    </td>

                    {/* Service & Package */}
                    <td className="py-3.5 px-2 min-w-45">
                      <div className="space-y-0.5 max-w-xs">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Tier:{" "}
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {pkgTier}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Decorator Agency */}
                    <td className="py-3.5 px-2 min-w-35">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-35">
                          {agencyName}
                        </p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                          <span>{agencyCity}</span>
                        </span>
                      </div>
                    </td>

                    {/* Event Date & Venue */}
                    <td className="py-3.5 px-2 min-w-40">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {dateStr}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-35">
                          {venue}
                        </p>
                      </div>
                    </td>

                    {/* Total Cost */}
                    <td className="py-3.5 px-2 text-center min-w-27.5 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                      ৳{Number(total).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-2 text-center min-w-40 whitespace-nowrap">
                      <BookingStatusBadge status={b.status} />
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-2 text-center min-w-25 whitespace-nowrap">
                      <BookingPaymentBadge booking={b} />
                    </td>

                    {/* Action Buttons: Pay, View, Edit, Review, Cancel */}
                    <td className="py-3.5 px-2 text-center min-w-35">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Pay Now Button */}
                        <TableActionButton
                          icon={CreditCard}
                          onClick={() => onOpenPayModal(b)}
                          disabled={!canPay}
                          tooltip="Make Payment / Deposit"
                          disabledTooltip="Payment Settled or Ineligible"
                          tone="primary"
                        />

                        {/* View Dossier Button */}
                        <TableActionButton
                          icon={Eye}
                          onClick={() => onOpenViewModal(b)}
                          tooltip="View Full Booking Dossier"
                          tone="purple"
                        />

                        {/* Edit Button (Gated to early lifecycle) */}
                        <TableActionButton
                          icon={Edit3}
                          onClick={() => onOpenEditModal(b)}
                          disabled={!canEdit}
                          tooltip="Edit Event Details"
                          disabledTooltip="Locked (In Progress or Completed)"
                          tone="slate"
                        />

                        {/* Rate & Review Button (Gated to rendered/in-flight events) */}
                        <TableActionButton
                          icon={Star}
                          onClick={() => onOpenReviewModal(b)}
                          disabled={!canReview}
                          tooltip="Rate & Review Celebration"
                          disabledTooltip="Review Available After Confirmation"
                          tone="amber"
                        />

                        {/* Delete / Cancel Button */}
                        <TableActionButton
                          icon={Trash2}
                          onClick={() => onDeleteBooking(b)}
                          tooltip="Cancel / Remove Booking"
                          tone="rose"
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

export default MyBookingsTable;
