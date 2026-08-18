import React, { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { MessageSquare } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
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
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={MessageSquare}
        title="Manage Reviews & Ratings"
        subtitle="Moderate user testimonials, suppress malicious ratings, and audit feedback authenticity."
        onRefresh={() => {
          setRefreshing(true);
          loadReviews();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

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
