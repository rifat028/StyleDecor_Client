import React, { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { MessageSquare } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import TimeFilter from "../../components/ui/TimeFilter";
import ReviewManagementToolbar from "../../components/pages/Admin/ReviewManagement/ReviewManagementToolbar";
import ReviewManagementTable from "../../components/pages/Admin/ReviewManagement/ReviewManagementTable";
import ReviewManagementModals from "../../components/pages/Admin/ReviewManagement/ReviewManagementModals";

// Admin reviews and ratings moderation page
const ManageReviews = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [reviewsData, setReviewsData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Time Filtering State (Default: "max")
  const [timeFilter, setTimeFilter] = useState("max");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState("all");
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

  // Load Decorators List for Vendor Filter Dropdown
  useEffect(() => {
    const fetchDecorators = async () => {
      try {
        const res = await axiosSecure.get("/decorators?limit=100&status=all");
        const list = res.data?.data || res.data || [];
        setDecorators(Array.isArray(list) ? list : []);
      } catch (err) {
        console.warn("Failed to load decorators for review dropdown:", err);
      }
    };
    fetchDecorators();
  }, [axiosSecure]);

  // Load Reviews with Filters & Pagination
  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sort: sortBy,
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (selectedDecorator !== "all") params.decoratorId = selectedDecorator;
      if (starFilter !== "all") params.rating = starFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (timeFilter && timeFilter !== "max") params.timeFilter = timeFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

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
  }, [axiosSecure, page, limit, statusFilter, selectedDecorator, starFilter, debouncedSearch, sortBy, timeFilter, startDate, endDate]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Reset Filters
  const handleResetFilters = () => {
    setStatusFilter("all");
    setSelectedDecorator("all");
    setStarFilter("all");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("newest");
    setTimeFilter("max");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Update Review Status (Publish / Hide)
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

  // Toggle Featured Status
  const handleToggleFeatured = async (review) => {
    try {
      const newFeatured = !Boolean(review.featured);
      const res = await axiosSecure.patch(`/reviews/${review._id}/featured`, {
        featured: newFeatured,
      });

      if (res.data?.success) {
        toast.success(
          newFeatured
            ? "Review featured on platform showcase"
            : "Review removed from featured showcase"
        );
        if (selectedReview?._id === review._id) {
          setSelectedReview((prev) => ({ ...prev, featured: newFeatured }));
        }
        loadReviews();
      }
    } catch (err) {
      console.error("Failed to toggle featured status:", err);
      toast.error(err.response?.data?.message || "Failed to update featured status");
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

  const stats = {
    totalReviews:
      reviewsData?.stats?.totalReviews ??
      reviewsData?.stats?.all ??
      reviewsData?.stats?.total ??
      reviewsData?.totalCount ??
      reviews.length,
    publishedCount:
      reviewsData?.stats?.publishedCount ??
      reviewsData?.stats?.published ??
      reviews.filter((r) => r.status === "published" || !r.status).length,
    hiddenCount:
      reviewsData?.stats?.hiddenCount ??
      reviewsData?.stats?.hidden ??
      reviews.filter((r) => r.status === "hidden").length,
    featuredCount:
      reviewsData?.stats?.featuredCount ??
      reviewsData?.stats?.featured ??
      reviews.filter((r) => r.featured).length,
    decoratorStats: reviewsData?.stats?.decoratorStats || {},
    averageRating: reviewsData?.stats?.averageRating ?? 4.8,
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
        actions={
          <TimeFilter
            timeFilter={timeFilter}
            onTimeFilterChange={(newFilter) => {
              setTimeFilter(newFilter);
              setPage(1);
            }}
            startDate={startDate}
            endDate={endDate}
            onCustomDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setPage(1);
            }}
            loading={loading || refreshing}
            showRefresh={false}
          />
        }
      />

      {/* 2. Consolidated Toolbar with styled dropdowns matching Admin -> Users */}
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
        decoratorFilter={selectedDecorator}
        onDecoratorFilterChange={(dec) => {
          setSelectedDecorator(dec);
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
        decoratorsList={decorators}
      />

      {/* 3. Consolidated Table Component */}
      <ReviewManagementTable
        reviews={reviews}
        loading={loading}
        onView={setSelectedReview}
        onToggleFeatured={handleToggleFeatured}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteReview}
        onResetFilters={handleResetFilters}
        page={page}
        totalPages={reviewsData?.totalPages || 1}
        totalCount={reviewsData?.totalCount || reviews.length}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* 4. Consolidated Modals Component */}
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
