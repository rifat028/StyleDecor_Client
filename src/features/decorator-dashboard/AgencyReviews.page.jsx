import React, { useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import {
  MessageSquare,
  Star,
  Sparkles,
  Building,
  CheckCircle2,
  Clock,
  Search,
  CornerDownRight,
  Send,
  Trash2,
  Edit,
  ShieldCheck,
  Award,
  ThumbsUp,
  X,
  User,
  Image as ImageIcon,
} from "lucide-react";

const QUICK_REPLY_PRESETS = [
  "Thank you so much for choosing our team! We are thrilled that you and your guests loved the decor.",
  "It was an absolute pleasure bringing your vision to life! Wishing you a lifetime of happiness.",
  "Thank you for the wonderful feedback! Our on-site crew and lead specialists truly appreciate your kind words.",
  "We are honored to have been part of your special milestone celebration. Thank you for trusting our agency!",
];

const AgencyReviews = () => {
  const axiosSecure = useAxiosSecure();

  const [reviewsData, setReviewsData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterTab, setFilterTab] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Reply Modal
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // 1. Integration: GET /reviews/agency/my-reviews
  const loadAgencyReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/reviews/agency/my-reviews");
      if (res.data?.success) {
        setReviewsData(res.data);
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load agency reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadAgencyReviews();
  }, [loadAgencyReviews]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Tab filter
      if (filterTab === "replied" && (!r.vendorReply || !r.vendorReply.reply)) return false;
      if (filterTab === "pending" && r.vendorReply && r.vendorReply.reply) return false;

      // Star filter
      if (starFilter !== "all" && Math.round(Number(r.rating)) !== Number(starFilter)) return false;

      // Search filter
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const client = (r.customerName || "").toLowerCase();
        const comment = (r.comment || "").toLowerCase();
        const agent = (r.agentName || "").toLowerCase();
        if (!client.includes(q) && !comment.includes(q) && !agent.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, filterTab, starFilter, searchText]);

  // Open Reply Modal
  const handleOpenReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.vendorReply?.reply || "");
    setIsReplyModalOpen(true);
  };

  // Submit Official Vendor Response (PATCH /reviews/:id/reply)
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!selectedReview?._id || !replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const res = await axiosSecure.patch(`/reviews/${selectedReview._id}/reply`, {
        reply: replyText.trim(),
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Response Published 🎉",
          text: "Your official vendor response is now live for client viewing.",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsReplyModalOpen(false);
        loadAgencyReviews();
      }
    } catch (err) {
      console.error("Failed to submit reply:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to publish response.", "error");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Delete Official Vendor Response (DELETE /reviews/:id/reply)
  const handleDeleteReply = async (reviewId) => {
    const result = await Swal.fire({
      title: "Remove Response?",
      text: "Are you sure you want to remove your official vendor response from this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Remove",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/reviews/${reviewId}/reply`);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Response Removed",
          text: "Vendor reply was successfully removed.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadAgencyReviews();
      }
    } catch (err) {
      console.error("Failed to delete reply:", err);
      Swal.fire("Error", "Failed to remove vendor response.", "error");
    }
  };

  if (loading && !reviewsData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const stats = reviewsData?.stats || {
    totalReviews: reviews.length,
    publishedCount: reviews.length,
    repliedCount: reviews.filter((r) => r.vendorReply && r.vendorReply.reply).length,
    pendingRepliesCount: reviews.filter((r) => !r.vendorReply || !r.vendorReply.reply).length,
    averageRating: 4.8,
  };

  const dist = reviewsData?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= 1. Standardized Top Header Bar ================= */}
      <DashboardPageHeader
        icon={Building}
        title="Agency Reviews & Appraisals"
        subtitle="Audit verified client ratings, celebrate on-site execution excellence, and publish official agency responses."
        onRefresh={() => {
          loadAgencyReviews();
        }}
        refreshing={loading}
      />

      {/* ================= KPI Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quality Rating */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" /> Quality Rating
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {stats.averageRating} <span className="text-base text-purple-200">/ 5.0</span>
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Across {stats.totalReviews} customer reviews
          </p>
        </div>

        {/* 5-Star Reviews */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 5-Star Reviews
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500">
            {dist[5] || 0}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Highest client satisfaction tier
          </p>
        </div>

        {/* Replied Reviews */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Replied Reviews
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.repliedCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Official vendor responses posted
          </p>
        </div>

        {/* Awaiting Reply */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-500" /> Awaiting Response
          </span>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            {stats.pendingRepliesCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Reviews ready for agency reply
          </p>
        </div>
      </div>

      {/* ================= Filters & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: `All Reviews (${stats.totalReviews})` },
              { id: "pending", label: `Awaiting Reply (${stats.pendingRepliesCount})` },
              { id: "replied", label: `Replied (${stats.repliedCount})` },
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
              <option value="all">All Star Ratings</option>
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
                placeholder="Search reviews or specialists..."
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center space-y-2 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              No Reviews Match Your Criteria
            </p>
            <p className="text-[11px] text-slate-400">
              Try adjusting your star rating or status filter.
            </p>
          </div>
        ) : (
          filteredReviews.map((r) => {
            const hasReply = r.vendorReply && r.vendorReply.reply;

            return (
              <div
                key={r._id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-all hover:border-purple-200 dark:hover:border-purple-900/50"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.customerPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={r.customerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {r.customerName || "Valued Client"}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Verified Order
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {r.customerEmail} • {new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-900/50">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{r.rating}.0</span>
                    </div>

                    <button
                      onClick={() => handleOpenReply(r)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-900/50 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      {hasReply ? "Edit Response" : "Reply to Client"}
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <p className="italic">"{r.comment}"</p>

                  {/* Images */}
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

                {/* Assigned Specialist Tag */}
                {r.agentName && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300 bg-purple-50/60 dark:bg-purple-950/30 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-900/40">
                      <Award className="w-3.5 h-3.5" /> Lead Specialist: {r.agentName}
                    </span>
                  </div>
                )}

                {/* Official Vendor Response */}
                {hasReply && (
                  <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <h5 className="text-[11px] font-bold text-purple-900 dark:text-purple-200">
                          Official Agency Response
                        </h5>
                        <span className="text-[10px] text-slate-400">
                          • {new Date(r.vendorReply.repliedAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteReply(r._id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                        title="Remove Response"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {r.vendorReply.reply}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= Reply Modal ================= */}
      {isReplyModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Official Agency Response
                </h3>
              </div>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReply} className="p-6 space-y-4 text-xs">
              {/* Client Review Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedReview.customerName}
                  </span>
                  <span className="text-amber-500 font-bold">★ {selectedReview.rating}.0</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  "{selectedReview.comment}"
                </p>
              </div>

              {/* Quick Reply Presets */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Quick Reply Suggestions:
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {QUICK_REPLY_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReplyText(preset)}
                      className="w-full text-left p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 text-[11px] text-purple-900 dark:text-purple-200 border border-purple-100 dark:border-purple-900/40 cursor-pointer transition-all line-clamp-2"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Response Textarea */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Your Response Message:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write a warm, professional agency response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingReply ? "Publishing..." : "Publish Response"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyReviews;
