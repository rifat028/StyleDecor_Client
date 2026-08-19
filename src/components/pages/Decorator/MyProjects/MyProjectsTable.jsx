import React from "react";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  XCircle,
  Eye,
  Edit,
  Users,
  Phone,
  Calendar,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// Canonical Status Badge Renderer for Projects
const renderProjectStatusBadge = (status) => {
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
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Accepted
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
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 uppercase">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase border border-slate-200 dark:border-slate-700">
          {status}
        </span>
      );
  }
};

// Decorator projects table component with responsive min-widths and pagination
const MyProjectsTable = ({
  bookings,
  loading,
  onOpenAssignModal,
  onOpenViewModal,
  onOpenStatusModal,
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
                <th className="py-3.5 px-2 min-w-40">Project Code</th>
                <th className="py-3.5 px-2 min-w-50">Service & Package</th>
                <th className="py-3.5 px-2 min-w-35">Client Contact</th>
                <th className="py-3.5 px-2 min-w-35">Lead Specialist</th>
                <th className="py-3.5 px-2 min-w-40">Schedule & Venue</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Total (৳)
                </th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={8} />
          </table>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Projects Found"
          message="No event projects matching your filter criteria were found."
          action={{
            label: "Reset Filters",
            onClick: onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-40">Project Code</th>
                <th className="py-3.5 px-2 min-w-50">Service & Package</th>
                <th className="py-3.5 px-2 min-w-35">Client Contact</th>
                <th className="py-3.5 px-2 min-w-35">Lead Specialist</th>
                <th className="py-3.5 px-2 min-w-40">Schedule & Venue</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Total (৳)
                </th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Actions</th>
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
                  "Standard";
                const clientName =
                  b.customer?.name || b.clientName || "Valued Client";
                const clientPhone = b.contact || b.customer?.phone || "N/A";
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

                return (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Project Code */}
                    <td className="py-3.5 px-2 min-w-32.5">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900/50">
                        {code}
                      </span>
                    </td>

                    {/* Service & Package Tier */}
                    <td className="py-3.5 px-2 min-w-50">
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

                    {/* Client Contact */}
                    <td className="py-3.5 px-2 min-w-35">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {clientName}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                          <Phone className="w-3 h-3 text-purple-500 shrink-0" />
                          <span>{clientPhone}</span>
                        </p>
                      </div>
                    </td>

                    {/* Lead Specialist */}
                    <td className="py-3.5 px-2 min-w-35">
                      {b.assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              b.assignedAgent.photoUrl ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                            }
                            alt={b.assignedAgent.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-400 shrink-0"
                          />
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {b.assignedAgent.name}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Schedule & Venue */}
                    <td className="py-3.5 px-2 min-w-40">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-500 shrink-0" />
                          <span>{dateStr}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-37.5">
                          {venue}
                        </p>
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="py-3.5 px-2 text-center min-w-27.5 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                      ৳{Number(total).toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-2 text-center min-w-40 whitespace-nowrap">
                      {renderProjectStatusBadge(b.status)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-2 text-center min-w-32.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Assign Specialist */}
                        <TableActionButton
                          icon={Users}
                          onClick={() => onOpenAssignModal(b)}
                          tooltip="Assign Field Specialist"
                          tone="purple"
                        />

                        {/* View Dossier & Payments */}
                        <TableActionButton
                          icon={Eye}
                          onClick={() => onOpenViewModal(b)}
                          tooltip="View Project Dossier & Payments"
                          tone="slate"
                        />

                        {/* Advance Lifecycle Stage */}
                        <TableActionButton
                          icon={Edit}
                          onClick={() => onOpenStatusModal(b)}
                          tooltip="Update Progress Stage"
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
          itemLabel="projects"
        />
      )}
    </div>
  );
};

export default MyProjectsTable;
