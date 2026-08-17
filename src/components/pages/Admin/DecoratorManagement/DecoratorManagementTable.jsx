import React from "react";
import {
  Building,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Eye,
  CheckCircle2,
  Ban,
  Trash2,
  Award,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Helper to render categorical status badge
const renderStatusBadge = (status, isVerified) => {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3 h-3" />
        <span>Active</span>
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        <Award className="w-3 h-3" />
        <span>Pending Approval</span>
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
        <Ban className="w-3 h-3" />
        <span>Suspended</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
      {status}
    </span>
  );
};

// Decorator management table component with responsive min-widths and pagination (210-250 lines)
const DecoratorManagementTable = ({
  decorators,
  loading,
  onView,
  onStatusTransition,
  onDelete,
  getPlaceholderLogo,
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
                <th className="py-3.5 px-2 min-w-55">Agency Profile</th>
                <th className="py-3.5 px-2 min-w-45">Contact & City</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Performance</th>
                <th className="py-3.5 px-2 text-center min-w-35">Status</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={5} />
          </table>
        </div>
      ) : decorators.length === 0 ? (
        <EmptyState
          icon={Building}
          title="No Decorator Agencies Found"
          message="Try adjusting your search criteria or filter selections."
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
                <th className="py-3.5 px-2 min-w-55">Agency Profile</th>
                <th className="py-3.5 px-2 min-w-45">Contact & City</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Performance</th>
                <th className="py-3.5 px-2 text-center min-w-35">Status</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {decorators.map((decorator) => {
                const isVerified = decorator.verification?.isVerified;
                const status = decorator.status;

                return (
                  <tr
                    key={decorator._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Agency Profile Cell */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            decorator.logo ||
                            getPlaceholderLogo(decorator.businessName)
                          }
                          alt={decorator.businessName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPlaceholderLogo(
                              decorator.businessName
                            );
                          }}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/20 shrink-0 bg-slate-100 dark:bg-slate-800"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                            <span className="truncate">
                              {decorator.businessName}
                            </span>
                            {isVerified && (
                              <ShieldCheck
                                className="w-4 h-4 text-emerald-500 shrink-0"
                                title="Verified Agency"
                              />
                            )}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {decorator.tagline ||
                              `${decorator.experienceYears || 1}+ yrs in service`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Location Cell */}
                    <td className="py-3.5 px-2 min-w-45">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{decorator.contact?.phone || "No phone"}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {decorator.location?.area
                              ? `${decorator.location.area}, ${
                                  decorator.location?.city || "Dhaka"
                                }`
                              : `${decorator.location?.city || "Dhaka"}`}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Performance Rating & Projects Cell */}
                    <td className="py-3.5 px-2 text-center min-w-32.5">
                      <div className="inline-flex flex-col items-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>
                            {Number(
                              decorator.rating?.average || 5.0
                            ).toFixed(1)}
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          {decorator.projectsCompleted || 0} projects
                        </span>
                      </div>
                    </td>

                    {/* Status Badge Cell */}
                    <td className="py-3.5 px-2 text-center min-w-35">
                      {renderStatusBadge(status, isVerified)}
                    </td>

                    {/* Centered Actions Cell with Bordered Buttons */}
                    <td className="py-3.5 px-2 text-center min-w-30">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Full Dossier */}
                        <button
                          type="button"
                          onClick={() => onView(decorator)}
                          title="View Agency Dossier"
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status Transition (Approve / Suspend / Reactivate) */}
                        {status === "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              onStatusTransition(decorator, "active")
                            }
                            title="Approve Agency"
                            className="p-1.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {status === "active" && (
                          <button
                            type="button"
                            onClick={() =>
                              onStatusTransition(decorator, "suspended")
                            }
                            title="Suspend Agency"
                            className="p-1.5 rounded-md border border-amber-200 dark:border-amber-800 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}

                        {status === "suspended" && (
                          <button
                            type="button"
                            onClick={() =>
                              onStatusTransition(decorator, "active")
                            }
                            title="Reactivate Agency"
                            className="p-1.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Agency */}
                        <button
                          type="button"
                          onClick={() => onDelete(decorator)}
                          title="Delete Agency"
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
      {!loading && decorators.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="decorators"
        />
      )}
    </div>
  );
};

export default DecoratorManagementTable;
