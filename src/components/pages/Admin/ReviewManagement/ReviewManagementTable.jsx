import React from "react";
import {
  MessageSquare,
  Star,
  Building,
  Calendar,
  Eye,
  Trash2,
  CheckCircle2,
  EyeOff,
  AlertTriangle,
  Tag,
  User,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Helper for default placeholder avatar
const getAvatarUrl = (name = "Customer") => {
  const initials = encodeURIComponent(name || "Customer");
  return `https://ui-avatars.com/api/?name=${initials}&background=9333ea&color=ffffff&bold=true&size=100`;
};

// Helper for status badge
const renderStatusBadge = (status) => {
  const s = String(status || "published").toLowerCase();
  if (s === "published") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
        <CheckCircle2 className="w-3 h-3" /> Published
      </span>
    );
  }
  if (s === "hidden") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
        <EyeOff className="w-3 h-3" /> Hidden
      </span>
    );
  }
  if (s === "flagged") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
        <AlertTriangle className="w-3 h-3" /> Flagged
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
      {status}
    </span>
  );
};

// Review management table component with responsive min-widths and pagination (220-250 lines)
const ReviewManagementTable = ({
  reviews,
  loading,
  onView,
  onUpdateStatus,
  onDelete,
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
                <th className="py-3.5 px-2 min-w-55">Customer & Rating</th>
                <th className="py-3.5 px-2 min-w-45">Service & Decorator</th>
                <th className="py-3.5 px-2 min-w-50">Review Comment</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={5} />
          </table>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Reviews Found"
          message="Try adjusting your status, star rating, or search criteria."
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
                <th className="py-3.5 px-2 min-w-55">Customer & Rating</th>
                <th className="py-3.5 px-2 min-w-45">Service & Decorator</th>
                <th className="py-3.5 px-2 min-w-50">Review Comment</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {reviews.map((review) => {
                const customerName =
                  review.customerName ||
                  review.user?.name ||
                  review.userName ||
                  "Verified Client";
                const rating = Number(review.rating || 5);
                const isPublished =
                  review.status === "published" || !review.status;

                return (
                  <tr
                    key={review._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Customer & Rating Profile Cell */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.userPhoto ||
                            review.user?.photo ||
                            getAvatarUrl(customerName)
                          }
                          alt={customerName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getAvatarUrl(customerName);
                          }}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {customerName}
                          </p>
                          <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                            ))}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                              {rating}.0
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Service & Decorator Cell */}
                    <td className="py-3.5 px-2 min-w-45">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>
                            {review.serviceTitle ||
                              review.service?.title ||
                              "Event Decoration"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {review.decoratorName ||
                              review.decorator?.businessName ||
                              "StyleDecor Agency"}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Review Snippet Cell */}
                    <td className="py-3.5 px-2 min-w-50">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 italic">
                          "{review.comment || review.reviewText || "No feedback text provided."}"
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : "Recent"}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Status Badge Cell (min-w-40) */}
                    <td className="py-3.5 px-2 text-center min-w-40">
                      {renderStatusBadge(review.status)}
                    </td>

                    {/* Centered Actions Cell with Bordered Buttons */}
                    <td className="py-3.5 px-2 text-center min-w-30">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Full Review Dossier */}
                        <button
                          type="button"
                          onClick={() => onView(review)}
                          title="View Review Dossier"
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Toggle Status (Publish / Hide) */}
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStatus(
                              review._id,
                              isPublished ? "hidden" : "published"
                            )
                          }
                          title={
                            isPublished
                              ? "Hide Review from Public"
                              : "Publish Review"
                          }
                          className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                            isPublished
                              ? "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                              : "border-emerald-200 dark:border-emerald-800 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
                          }`}
                        >
                          {isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete Review */}
                        <button
                          type="button"
                          onClick={() => onDelete(review)}
                          title="Delete Review"
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
      {!loading && reviews.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="reviews"
        />
      )}
    </div>
  );
};

export default ReviewManagementTable;
