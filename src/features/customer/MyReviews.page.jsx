import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  MessageSquare,
  Star,
  Sparkles,
  ShieldCheck,
  Award,
  Building,
  Edit3,
  Trash2,
  Search,
  Calendar,
  Layers,
  ArrowRight,
  X,
  Send,
  CornerDownRight,
  Clock,
  ThumbsUp,
} from "lucide-react";

const MyReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [filterTab, setFilterTab] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 1. Integration: GET /reviews/customer/my-reviews
  const loadMyReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/reviews/customer/my-reviews");
      const list = res.data?.data || [];
      setReviews(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load customer reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadMyReviews();
  }, [loadMyReviews]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Tab filter
      if (filterTab === "replied" && (!r.vendorReply || !r.vendorReply.reply)) return false;
      if (filterTab === "pending" && r.vendorReply && r.vendorReply.reply) return false;

      // Star filter
      if (starFilter !== "all" && Math.round(Number(r.rating)) !== Number(starFilter)) return false;

      // Search
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const comment = (r.comment || "").toLowerCase();
        const agent = (r.agentName || "").toLowerCase();
        if (!comment.includes(q) && !agent.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, filterTab, starFilter, searchText]);

  // Open Edit Modal
  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(Number(review.rating) || 5);
    setHoverRating(0);
    setEditComment(review.comment || "");
    setIsEditModalOpen(true);
  };

  // Submit Update (PATCH /reviews/:id or PATCH /reviews/customer/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingReview?._id || !editComment.trim()) return;

    try {
      setIsSaving(true);
      const res = await axiosSecure.patch(`/reviews/customer/${editingReview._id}`, {
        rating: Number(editRating),
        comment: editComment.trim(),
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Review Updated 🎉",
          text: "Your modified review has been saved.",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsEditModalOpen(false);
        loadMyReviews();
      }
    } catch (err) {
      console.error("Failed to update review:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update review.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Review (DELETE /reviews/customer/:id)
  const handleDeleteReview = async (review) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to remove your review and rating for this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/reviews/customer/${review._id}`);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Review Deleted",
          text: "Your review was successfully removed.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadMyReviews();
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
      Swal.fire("Error", "Failed to delete review. Please try again.", "error");
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Summary Metrics
  const totalCount = reviews.length;
  const avgGiven =
    totalCount > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalCount).toFixed(1)
      : "5.0";
  const fiveStarsCount = reviews.filter((r) => Math.round(Number(r.rating)) === 5).length;
  const repliedCount = reviews.filter((r) => r.vendorReply && r.vendorReply.reply).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> My Event Feedback & Appraisals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Submitted Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage ratings, feedback, and celebration memories you have shared for executed bookings.
          </p>
        </div>

        <Link
          to="/dashboard/my-bookings"
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          View Completed Bookings
        </Link>
      </div>

      {/* ================= KPI Counters ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Reviews Written
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Submitted celebration reviews
          </p>
        </div>

        {/* Avg Rating Given */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" /> Avg Rating Given
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {avgGiven} <span className="text-base text-purple-200">/ 5.0</span>
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Quality score across events
          </p>
        </div>

        {/* 5-Star Reviews */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 5-Star Ratings
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500">
            {fiveStarsCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Top tier satisfaction events
          </p>
        </div>

        {/* Agency Replies Received */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-500" /> Agency Replies
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {repliedCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Official vendor responses
          </p>
        </div>
      </div>

      {/* ================= Filters & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: `All Reviews (${totalCount})` },
              { id: "replied", label: `With Vendor Reply (${repliedCount})` },
            ].map((tab) => {
              const isSelected = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
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
              onChange={(e) => setStarFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">★ 5 Stars</option>
              <option value="4">★ 4 Stars</option>
              <option value="3">★ 3 Stars</option>
              <option value="2">★ 2 Stars</option>
              <option value="1">★ 1 Star</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search comments or specialists..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= Reviews Stream ================= */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Reviews Found
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You haven't submitted any reviews matching this filter. After completing bookings, rate your setup experience to help others!
              </p>
            </div>
            <Link
              to="/dashboard/my-bookings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
            >
              Go to My Bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          filteredReviews.map((r) => {
            const hasReply = r.vendorReply && r.vendorReply.reply;

            return (
              <div
                key={r._id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-all hover:border-purple-200 dark:hover:border-purple-900/50"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-black bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{r.rating}.0</span>
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Verified Event Order
                      </span>
                      <p className="text-[10px] text-slate-400 pt-0.5">
                        Reviewed on {new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Review
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r)}
                      className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer transition-all"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <p className="italic">"{r.comment}"</p>

                  {/* Attached Photos */}
                  {r.images && r.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-3">
                      {r.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Review attachment"
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Lead Specialist Attribution */}
                {r.agentName && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300 bg-purple-50/60 dark:bg-purple-950/30 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-900/40">
                      <Award className="w-3.5 h-3.5" /> Assigned Lead Specialist: {r.agentName}
                    </span>
                  </div>
                )}

                {/* Official Vendor Response */}
                {hasReply && (
                  <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <h5 className="text-[11px] font-bold text-purple-900 dark:text-purple-200">
                        Official Response from Decorator Agency
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        • {new Date(r.vendorReply.repliedAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 italic pl-5">
                      "{r.vendorReply.reply}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= Edit Review Modal ================= */}
      {isEditModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Edit Your Event Review</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
              {/* Star Selector */}
              <div className="space-y-2 text-center py-2">
                <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                  Update Your Rating:
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || editRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setEditRating(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            isFilled ? "text-amber-400 fill-amber-400 drop-shadow-sm" : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-black text-amber-500">
                  {editRating === 5 && "★★★★★ Outstanding & Flawless!"}
                  {editRating === 4 && "★★★★☆ Great Setup & Execution"}
                  {editRating === 3 && "★★★☆☆ Satisfactory"}
                  {editRating === 2 && "★★☆☆☆ Needs Improvement"}
                  {editRating === 1 && "★☆☆☆☆ Disappointed"}
                </span>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Review Feedback:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about the decoration setup..."
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !editComment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/30 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
