import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  MessageSquare,
  Star,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Award,
  Building,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Layers,
  Calendar,
  User,
  CornerDownRight,
} from "lucide-react";

const ManageReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [reviewsData, setReviewsData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // View Dossier Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // 1. Integration: GET /reviews (Admin Paginated & Filtered)
  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (starFilter !== "all") params.rating = starFilter;
      if (searchText.trim()) params.search = searchText.trim();

      const res = await axiosSecure.get("/reviews", { params });
      if (res.data?.success) {
        setReviewsData(res.data);
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load admin reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, currentPage, pageSize, statusFilter, starFilter, searchText]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // 2. Integration: PATCH /reviews/:id/status (Admin Moderation)
  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/reviews/${reviewId}/status`, {
        status: newStatus,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: `Status Updated`,
          text: `Review status changed to ${newStatus}.`,
          timer: 1200,
          showConfirmButton: false,
        });
        loadReviews();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update review status.", "error");
    }
  };

  // 3. Integration: DELETE /reviews/:id (Permanent Admin Removal)
  const handleDeleteReview = async (review) => {
    const confirm = await Swal.fire({
      title: "Permanently Delete Review?",
      text: `Are you sure you want to permanently delete review by "${review.customerName || "Customer"}"? This will automatically recalculate the agency rating.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/reviews/${review._id}`);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Review Deleted",
          text: "Review removed from the platform.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadReviews();
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
      Swal.fire("Error", "Failed to delete review. Please try again.", "error");
    }
  };

  const handleOpenView = (review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  const stats = reviewsData?.stats || {
    totalReviews: reviews.length,
    publishedCount: reviews.filter((r) => r.status === "published" || !r.status).length,
    hiddenCount: reviews.filter((r) => r.status === "hidden").length,
    flaggedCount: reviews.filter((r) => r.status === "flagged").length,
    averageRating: 4.8,
  };

  const pagination = reviewsData?.pagination || {
    page: 1,
    limit: pageSize,
    total: reviews.length,
    totalPages: 1,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Trust & Quality Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Manage Reviews & Appraisals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit customer feedback, moderate testimonials, review lead specialist ratings, and enforce platform standards.
          </p>
        </div>
      </div>

      {/* ================= KPI Stats ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Total Reviews
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.totalReviews}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Across all services & agencies</p>
        </div>

        {/* Average Rating */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" /> Platform Rating
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {stats.averageRating} <span className="text-base text-purple-200">/ 5.0</span>
          </p>
          <p className="text-[11px] text-purple-200 pt-1">Overall customer satisfaction</p>
        </div>

        {/* Published */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Published
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.publishedCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Live for public viewing</p>
        </div>

        {/* Flagged / Hidden */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Flagged / Hidden
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {stats.flaggedCount + stats.hiddenCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Pending admin review</p>
        </div>
      </div>

      {/* ================= Filter Controls & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: `All (${stats.totalReviews})` },
              { id: "published", label: `Published (${stats.publishedCount})` },
              { id: "flagged", label: `Flagged (${stats.flaggedCount})` },
              { id: "hidden", label: `Hidden (${stats.hiddenCount})` },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Star Filter & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={starFilter}
              onChange={(e) => {
                setStarFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">★ 5 Stars Only</option>
              <option value="4">★ 4 Stars Only</option>
              <option value="3">★ 3 Stars Only</option>
              <option value="2">★ 2 Stars Only</option>
              <option value="1">★ 1 Star Only</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients, specialists, comments..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= Reviews Table Stream ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Spinner />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              No Reviews Match Your Criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Customer & Review</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Lead Specialist</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Vendor Reply</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reviews.map((r) => {
                  const status = r.status || "published";
                  const hasReply = r.vendorReply && r.vendorReply.reply;

                  return (
                    <tr
                      key={r._id}
                      className="hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition-colors"
                    >
                      {/* Customer & Comment */}
                      <td className="py-4 px-6 max-w-sm">
                        <div className="flex items-start gap-3">
                          <img
                            src={r.customerPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt={r.customerName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-500/20 shrink-0 mt-0.5"
                          />
                          <div className="space-y-1 min-w-0">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                              {r.customerName || "Customer"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{r.customerEmail}</p>
                            <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2 pt-0.5">
                              "{r.comment}"
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-500 font-black">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{r.rating}.0</span>
                        </div>
                      </td>

                      {/* Specialist */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {r.agentName ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-lg border border-purple-100 dark:border-purple-900/40">
                            <Award className="w-3 h-3" /> {r.agentName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Unassigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {status === "published" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900 uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        )}
                        {status === "hidden" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase">
                            <XCircle className="w-3 h-3" /> Hidden
                          </span>
                        )}
                        {status === "flagged" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900 uppercase">
                            <AlertTriangle className="w-3 h-3" /> Flagged
                          </span>
                        )}
                        {status === "archived" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900 uppercase">
                            <ShieldAlert className="w-3 h-3" /> Archived
                          </span>
                        )}
                      </td>

                      {/* Vendor Reply */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {hasReply ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
                            <CornerDownRight className="w-3 h-3" /> Replied
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">No response</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => handleOpenView(r)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-600 cursor-pointer"
                            title="View Full Review Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Status Dropdown / Buttons */}
                          {status !== "published" ? (
                            <button
                              onClick={() => handleUpdateStatus(r._id, "published")}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 font-bold text-[11px] cursor-pointer"
                              title="Publish Review"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(r._id, "hidden")}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 font-bold text-[11px] cursor-pointer"
                              title="Hide Review"
                            >
                              Hide
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteReview(r)}
                            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                            title="Delete Review Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total reviews)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= View Dossier Modal ================= */}
      {isViewModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Review Dossier & Audit</h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              {/* Customer */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={selectedReview.customerPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={selectedReview.customerName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {selectedReview.customerName}
                  </h4>
                  <p className="text-[11px] text-slate-400">{selectedReview.customerEmail}</p>
                  <p className="text-[10px] text-slate-500 pt-0.5">
                    Order ID: <span className="font-mono">{selectedReview.bookingId}</span>
                  </p>
                </div>
              </div>

              {/* Rating & Comment */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 dark:text-purple-200">
                    Client Feedback & Rating:
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-black">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{selectedReview.rating}.0 / 5.0</span>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{selectedReview.comment}"
                </p>
              </div>

              {/* Setup Photos */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Attached Event Photos:
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    {selectedReview.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Event Setup"
                        className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lead Specialist */}
              {selectedReview.agentName && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Assigned Field Specialist:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    {selectedReview.agentName}
                  </span>
                </div>
              )}

              {/* Vendor Reply */}
              {selectedReview.vendorReply && selectedReview.vendorReply.reply && (
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Building className="w-3 h-3 text-purple-500" /> Official Agency Response:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    "{selectedReview.vendorReply.reply}"
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
