import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  MessageSquare,
  Star,
  Building2,
  Calendar,
  Eye,
  Trash2,
  CheckCircle2,
  EyeOff,
  Sparkles,
  Tag,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// Helper for default placeholder avatar
const getAvatarUrl = (name = "Customer") => {
  const initials = encodeURIComponent(name || "Customer");
  return `https://ui-avatars.com/api/?name=${initials}&background=9333ea&color=ffffff&bold=true&size=100`;
};

// Helper for status badge (published and hidden only with uniform w-28 and center alignment)
const renderStatusBadge = (status) => {
  const s = String(status || "published").toLowerCase();
  if (s === "hidden") {
    return (
      <span className="w-28 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
        <EyeOff className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Hidden</span>
      </span>
    );
  }
  return (
    <span className="w-28 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">Published</span>
    </span>
  );
};

// Rich Popmenu card for full comment preview on hover
const ReviewCommentPopmenu = ({
  comment,
  rating,
  customerName,
  customerPhoto,
  serviceTitle,
  createdAt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placeAbove: false });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const popoverHeight = 150;
      const placeAbove = spaceAbove > popoverHeight + 20;
      const top = placeAbove ? rect.top - 8 : rect.bottom + 8;
      const left = Math.max(16, Math.min(window.innerWidth - 336, rect.left));
      setCoords({ top, left, placeAbove });
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block w-full max-w-full"
    >
      <p className="text-xs text-slate-600 dark:text-slate-300 italic truncate line-clamp-1 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
        "{comment}"
      </p>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.placeAbove ? undefined : coords.top,
              bottom: coords.placeAbove ? window.innerHeight - coords.top : undefined,
              left: coords.left,
              zIndex: 99999,
            }}
            className="w-80 max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none space-y-2.5"
          >
            {/* Popmenu Header */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                {customerPhoto && (
                  <img
                    src={customerPhoto}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                )}
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {customerName || "Customer"}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
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
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 ml-1">
                  {rating}.0
                </span>
              </div>
            </div>

            {/* Full Comment Body */}
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic whitespace-normal">
              "{comment}"
            </p>

            {/* Popmenu Footer Info */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="truncate max-w-[170px]">
                {serviceTitle || "Event Service"}
              </span>
              <span>
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Verified"}
              </span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Review management table component with Customer, Service & Vendor, Agent, Review & Rating (max-w-80 with popmenu), Status, and Actions
const ReviewManagementTable = ({
  reviews = [],
  loading = false,
  onView,
  onToggleFeatured,
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
                <th className="py-3.5 px-3 w-52 min-w-52">Customer</th>
                <th className="py-3.5 px-3 min-w-44">Service & Vendor</th>
                <th className="py-3.5 px-3 min-w-32">Agent</th>
                <th className="py-3.5 px-3 max-w-80 min-w-52">Review & Rating</th>
                <th className="py-3.5 px-3 text-center min-w-32">Status</th>
                <th className="py-3.5 px-3 text-center min-w-36">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={6} />
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
                <th className="py-3.5 px-3 w-52 min-w-52">Customer</th>
                <th className="py-3.5 px-3 min-w-44">Service & Vendor</th>
                <th className="py-3.5 px-3 min-w-32">Agent</th>
                <th className="py-3.5 px-3 max-w-80 min-w-52">Review & Rating</th>
                <th className="py-3.5 px-3 text-center min-w-32">Status</th>
                <th className="py-3.5 px-3 text-center min-w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {reviews.map((review) => {
                const customerName =
                  review.customerName ||
                  review.user?.name ||
                  review.userName ||
                  "Verified Client";
                const customerEmail =
                  review.customerEmail ||
                  review.user?.email ||
                  review.userEmail ||
                  "client@styledecor.com";
                const customerPhoto =
                  review.customerPhotoUrl ||
                  review.userPhoto ||
                  review.user?.photo ||
                  review.user?.photoUrl ||
                  getAvatarUrl(customerName);

                const serviceTitle =
                  review.serviceTitle ||
                  review.service?.title ||
                  "Event Decoration Service";
                const decoratorName =
                  review.decoratorName ||
                  review.decorator?.businessName ||
                  review.decorator?.name ||
                  "StyleDecor Agency";
                const agentName =
                  review.agentName ||
                  review.agent?.name ||
                  "Field Agent";

                const rating = Math.min(5, Math.max(1, Number(review.rating || 5)));
                const isPublished =
                  review.status === "published" || !review.status;
                const isFeatured = Boolean(review.featured);
                const commentText =
                  review.comment ||
                  review.reviewText ||
                  "No feedback text provided.";

                return (
                  <tr
                    key={review._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* 1. Customer Column: Photo, Name, Email all with line-clamp-1 */}
                    <td className="py-3.5 px-3 w-52 min-w-52">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={customerPhoto}
                          alt={customerName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getAvatarUrl(customerName);
                          }}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate line-clamp-1">
                            {customerName}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate line-clamp-1 mt-0.5">
                            {customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Service & Vendor Column: Service Title & Decorator Name */}
                    <td className="py-3.5 px-3 min-w-44">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate line-clamp-1 flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span className="truncate line-clamp-1">{serviceTitle}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate line-clamp-1 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate line-clamp-1">{decoratorName}</span>
                        </p>
                      </div>
                    </td>

                    {/* 3. Agent Column: Agent Name directly without tag */}
                    <td className="py-3.5 px-3 min-w-32">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate line-clamp-1">
                        {agentName}
                      </p>
                    </td>

                    {/* 4. Review & Rating Column: max-w-80 with hover Popmenu for full comment */}
                    <td className="py-3.5 px-3 max-w-80 min-w-52">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
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
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 ml-1">
                            {rating}.0
                          </span>
                        </div>

                        {/* Hover Popmenu showing full comment card */}
                        <ReviewCommentPopmenu
                          comment={commentText}
                          rating={rating}
                          customerName={customerName}
                          customerPhoto={customerPhoto}
                          serviceTitle={serviceTitle}
                          createdAt={review.createdAt}
                        />
                      </div>
                    </td>

                    {/* 5. Status Column: Published / Hidden Badge */}
                    <td className="py-3.5 px-3 text-center min-w-32">
                      <div className="flex justify-center">
                        {renderStatusBadge(review.status)}
                      </div>
                    </td>

                    {/* 6. Actions Column: Featured Toggle, View, Quick Status, Delete */}
                    <td className="py-3.5 px-3 text-center min-w-36">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Featured True/False Update Button */}
                        <TableActionButton
                          icon={Sparkles}
                          onClick={() => onToggleFeatured && onToggleFeatured(review)}
                          tooltip={
                            isFeatured
                              ? "Remove from Featured Highlights"
                              : "Mark as Featured Showcase"
                          }
                          tone={isFeatured ? "featured" : "amber"}
                        />

                        {/* View Full Review Dossier */}
                        <TableActionButton
                          icon={Eye}
                          onClick={() => onView(review)}
                          tooltip="View Review Dossier"
                          tone="purple"
                        />

                        {/* Quick Toggle Status (Publish / Hide) */}
                        <TableActionButton
                          icon={isPublished ? EyeOff : CheckCircle2}
                          onClick={() =>
                            onUpdateStatus(
                              review._id,
                              isPublished ? "hidden" : "published"
                            )
                          }
                          tooltip={
                            isPublished
                              ? "Hide Review from Public"
                              : "Publish Review to Public"
                          }
                          tone={isPublished ? "danger" : "success"}
                        />

                        {/* Delete Review */}
                        <TableActionButton
                          icon={Trash2}
                          onClick={() => onDelete(review)}
                          tooltip="Permanently Delete Review"
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
