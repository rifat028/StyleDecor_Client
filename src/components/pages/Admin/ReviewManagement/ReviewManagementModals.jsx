import React from "react";
import {
  MessageSquare,
  Star,
  Building,
  Calendar,
  User,
  CheckCircle2,
  EyeOff,
  AlertTriangle,
  Trash2,
  Tag,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Helper for default placeholder avatar
const getAvatarUrl = (name = "Customer") => {
  const initials = encodeURIComponent(name || "Customer");
  return `https://ui-avatars.com/api/?name=${initials}&background=9333ea&color=ffffff&bold=true&size=100`;
};

// Consolidated Review Dossier Modal (200-240 lines)
const ReviewManagementModals = ({
  selectedReview,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!selectedReview) return null;

  const customerName =
    selectedReview.customerName ||
    selectedReview.user?.name ||
    selectedReview.userName ||
    "Verified Client";
  const rating = Number(selectedReview.rating || 5);
  const status = selectedReview.status || "published";

  return (
    <Modal
      isOpen={!!selectedReview}
      onClose={onClose}
      title="Customer Review Dossier"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Reviewer Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <img
            src={
              selectedReview.userPhoto ||
              selectedReview.user?.photo ||
              getAvatarUrl(customerName)
            }
            alt={customerName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getAvatarUrl(customerName);
            }}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="font-bold text-slate-900 dark:text-white truncate">
                {customerName}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 uppercase">
                {status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {rating}.0 / 5.0
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-400">
                {selectedReview.createdAt
                  ? new Date(selectedReview.createdAt).toLocaleDateString()
                  : "Recent"}
              </span>
            </div>
          </div>
        </div>

        {/* Target Service & Agency Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
              <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Booked Service Package
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {selectedReview.serviceTitle ||
                selectedReview.service?.title ||
                "Event Decoration Package"}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
              <Building className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Decorator Vendor
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {selectedReview.decoratorName ||
                selectedReview.decorator?.businessName ||
                "StyleDecor Agency"}
            </p>
          </div>
        </div>

        {/* Review Feedback Commentary */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-purple-50/30 dark:bg-purple-950/20 space-y-2">
          <p className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> Client Feedback Commentary
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
            "{selectedReview.comment || selectedReview.reviewText || "No written review comments provided."}"
          </p>
        </div>

        {/* Modal Controls & Moderation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onDelete(selectedReview)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Review</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>

            {/* Flag Button */}
            <button
              type="button"
              disabled={status === "flagged"}
              onClick={() => onUpdateStatus(selectedReview._id, "flagged")}
              className="px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Flag
            </button>

            {/* Hide / Suppress Button */}
            <button
              type="button"
              disabled={status === "hidden"}
              onClick={() => onUpdateStatus(selectedReview._id, "hidden")}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Hide
            </button>

            {/* Publish Button */}
            <button
              type="button"
              disabled={status === "published"}
              onClick={() => onUpdateStatus(selectedReview._id, "published")}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewManagementModals;
