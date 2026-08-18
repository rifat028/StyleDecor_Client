import React, { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { MessageSquare, RefreshCw } from "lucide-react";
import ReviewManagementToolbar from "../../components/pages/Admin/ReviewManagement/ReviewManagementToolbar";
import ReviewManagementTable from "../../components/pages/Admin/ReviewManagement/ReviewManagementTable";
import ReviewManagementModals from "../../components/pages/Admin/ReviewManagement/ReviewManagementModals";

// Admin reviews and ratings moderation page
const ManageReviews = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [reviewsData, setReviewsData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // View Dossier Modal State
  const [selectedReview, setSelectedReview] = useState(null);

  // Debounce search query (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load Reviews with Filters & Pagination
  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (starFilter !== "all") params.rating = starFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const res = await axiosSecure.get("/reviews", { params });
      if (res.data?.success) {
        setReviewsData(res.data);
        setReviews(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Failed to load admin reviews:", err);
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, page, limit, statusFilter, starFilter, debouncedSearch]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Reset Filters
  const handleResetFilters = () => {
    setStatusFilter("all");
    setStarFilter("all");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("newest");
    setPage(1);
  };

  // Update Review Status (Publish / Hide / Flag)
  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/reviews/${reviewId}/status`, {
        status: newStatus,
      });

      if (res.data?.success) {
        toast.success(`Review status updated to ${newStatus.toUpperCase()}`);
        if (selectedReview?._id === reviewId) {
          setSelectedReview((prev) => ({ ...prev, status: newStatus }));
        }
        loadReviews();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Failed to update review status");
    }
  };

  // Permanently Delete Review
  const handleDeleteReview = async (review) => {
    const confirm = await Swal.fire({
      title: "Permanently Delete Review?",
      text: `Are you sure you want to permanently delete this customer review?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/reviews/${review._id}`);
      if (res.data?.success) {
        toast.success("Review permanently removed");
        if (selectedReview?._id === review._id) {
          setSelectedReview(null);
        }
        loadReviews();
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error("Failed to delete review");
    }
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
    limit,
    total: reviews.length,
    totalPages: 1,
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Reviews & Ratings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Moderate user testimonials, suppress malicious ratings, and audit feedback authenticity.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadReviews();
          }}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Consolidated Toolbar (~130 lines) */}
      <ReviewManagementToolbar
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatusFilter={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        loadingStats={loading && !stats.totalReviews}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => {
          setSearch("");
          setDebouncedSearch("");
          setPage(1);
        }}
        starFilter={starFilter}
        onStarFilterChange={(star) => {
          setStarFilter(star);
          setPage(1);
        }}
        sortFilter={sortBy}
        onSortFilterChange={(sort) => {
          setSortBy(sort);
          setPage(1);
        }}
      />

      {/* 3. Consolidated Table Component (~240 lines) */}
      <ReviewManagementTable
        reviews={reviews}
        loading={loading}
        onView={setSelectedReview}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteReview}
        onResetFilters={handleResetFilters}
        page={page}
        totalPages={pagination.totalPages || 1}
        totalCount={pagination.total || reviews.length}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* 4. Consolidated Modals Component (~230 lines) */}
      <ReviewManagementModals
        selectedReview={selectedReview}
        onClose={() => setSelectedReview(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteReview}
      />
    </div>
  );
};

export default ManageReviews;
