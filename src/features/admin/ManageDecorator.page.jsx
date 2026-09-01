import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Palette } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import DecoratorManagementToolbar from "../../components/pages/Admin/DecoratorManagement/DecoratorManagementToolbar";
import DecoratorManagementTable from "../../components/pages/Admin/DecoratorManagement/DecoratorManagementTable";
import DecoratorManagementModals from "../../components/pages/Admin/DecoratorManagement/DecoratorManagementModals";
import { BANGLADESH_DIVISIONS } from "../../lib/constants";

// Helper to generate consistent placeholder logo
const getPlaceholderLogo = (name = "Decorator") => {
  const initials = encodeURIComponent(name || "Decorator");
  return `https://ui-avatars.com/api/?name=${initials}&background=7C3AED&color=ffffff&bold=true&size=150`;
};

// Admin Decorator Management page
const ManageDecorator = () => {
  const axiosSecure = useAxiosSecure();

  // Data & Loading States
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("rating");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Metrics/Stats Counters
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    verified: 0,
    featured: 0,
  });

  // View Modal State
  const [viewDecorator, setViewDecorator] = useState(null);

  // Debounce search query input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Decorators List
  const fetchDecorators = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sortFilter,
      });

      if (statusFilter === "featured") {
        params.append("featured", "true");
      } else if (statusFilter === "verified") {
        params.append("verified", "true");
      } else if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (divisionFilter !== "all") params.append("division", divisionFilter);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());

      const res = await axiosSecure.get(`/decorators?${params.toString()}`);
      if (res.data?.success) {
        setDecorators(res.data.data || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load decorators:", error);
      toast.error("Failed to load decorators");
      setDecorators([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, page, limit, statusFilter, divisionFilter, sortFilter, debouncedSearch]);

  // Fetch Global Counter Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/decorators/stats");
      const data = res.data?.data || res.data;
      if (data && (data.total !== undefined || data.active !== undefined)) {
        const total = data.total || 0;
        const pending = data.pending || 0;
        const suspended = data.suspended || 0;
        const featured = data.featured || 0;
        const verified = data.verified || 0;
        const active =
          data.active !== undefined &&
          data.active !== null &&
          !(data.active === 0 && total > 0 && pending === 0 && suspended === 0)
            ? data.active
            : total - pending - suspended;

        setStats({
          total,
          active: Math.max(0, active),
          pending,
          suspended,
          verified,
          featured,
          byDivision: data.byDivision || [],
          byStatus: data.byStatus || null,
        });
      }
    } catch (err) {
      console.warn("Failed to load decorator stats:", err);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchDecorators();
  }, [fetchDecorators]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDivisionFilter("all");
    setSortFilter("rating");
    setPage(1);
  };

  // Status Change Workflow (Approve / Suspend / Reactivate)
  const handleStatusTransition = async (decorator, targetStatus) => {
    let confirmTitle = "";
    let confirmText = "";
    let confirmBtnText = "";
    let confirmBtnColor = "#10B981";

    if (targetStatus === "active") {
      if (decorator.status === "pending") {
        confirmTitle = "Approve Decorator Agency?";
        confirmText = `Approving "${decorator.businessName}" will verify the agency and change the user's role to decorator.`;
        confirmBtnText = "Yes, Approve Agency";
        confirmBtnColor = "#10B981";
      } else {
        confirmTitle = "Reactivate Decorator Agency?";
        confirmText = `Reactivating "${decorator.businessName}" will restore their active marketplace listings.`;
        confirmBtnText = "Yes, Reactivate";
        confirmBtnColor = "#10B981";
      }
    } else if (targetStatus === "suspended") {
      confirmTitle = "Suspend Decorator Agency?";
      confirmText = `Suspending "${decorator.businessName}" will hide their listings from the public catalog.`;
      confirmBtnText = "Yes, Suspend Agency";
      confirmBtnColor = "#EF4444";
    }

    const confirm = await Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: targetStatus === "active" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: confirmBtnText,
      confirmButtonColor: confirmBtnColor,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const payload = {
        status: targetStatus,
        isVerified:
          targetStatus === "active"
            ? true
            : decorator.verification?.isVerified,
      };

      await axiosSecure.patch(`/decorators/${decorator._id}/status`, payload);
      toast.success(`Agency status changed to ${targetStatus}`);
      fetchDecorators();
      fetchStats();

      // If viewing in modal, sync modal state
      if (viewDecorator?._id === decorator._id) {
        setViewDecorator((prev) => ({
          ...prev,
          status: targetStatus,
          verification: {
            ...prev?.verification,
            isVerified: targetStatus === "active" ? true : prev?.verification?.isVerified,
          },
        }));
      }
    } catch (error) {
      console.error("Status transition failed:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Delete Decorator
  const handleDeleteDecorator = async (decorator) => {
    const confirm = await Swal.fire({
      title: "Delete Decorator Agency?",
      text: `This will permanently remove "${decorator.businessName}". This action cannot be reversed!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Permanently",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/decorators/${decorator._id}`);
      toast.success(`"${decorator.businessName}" deleted successfully`);
      if (viewDecorator?._id === decorator._id) {
        setViewDecorator(null);
      }
      fetchDecorators();
      fetchStats();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete agency");
    }
  };

  // Toggle Featured State (true/false)
  const handleToggleFeatured = async (decorator) => {
    const nextFeatured = !decorator.featured;
    try {
      await axiosSecure.patch(`/decorators/${decorator._id}/status`, {
        featured: nextFeatured,
      });
      toast.success(
        nextFeatured
          ? `"${decorator.businessName}" marked as Featured`
          : `"${decorator.businessName}" removed from Featured`
      );
      // Optimistically update local list and featured stat counter
      setDecorators((prev) =>
        prev.map((d) =>
          d._id === decorator._id ? { ...d, featured: nextFeatured } : d
        )
      );
      setStats((prev) => ({
        ...prev,
        featured: nextFeatured
          ? (prev.featured || 0) + 1
          : Math.max(0, (prev.featured || 0) - 1),
      }));
      // If modal is open for this decorator, update it
      if (viewDecorator?._id === decorator._id) {
        setViewDecorator((prev) => ({
          ...prev,
          featured: nextFeatured,
        }));
      }
      fetchStats();
    } catch (error) {
      console.error("Failed to update featured state:", error);
      toast.error(
        error.response?.data?.message || "Failed to update featured state"
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={Palette}
        title="Manage Decorator Agencies"
        subtitle="Review vendor applications, approve verified partners, and supervise agency statuses."
        onRefresh={() => {
          setRefreshing(true);
          fetchDecorators();
          fetchStats();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Consolidated Toolbar (~130 lines) */}
      <DecoratorManagementToolbar
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatusFilter={(s) => {
          setStatusFilter(s);
          setPage(1);
        }}
        loadingStats={loading && !stats.total}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => {
          setSearch("");
          setDebouncedSearch("");
          setPage(1);
        }}
        divisionFilter={divisionFilter}
        onDivisionFilterChange={(d) => {
          setDivisionFilter(d);
          setPage(1);
        }}
        sortFilter={sortFilter}
        onSortFilterChange={(s) => {
          setSortFilter(s);
          setPage(1);
        }}
        divisionsList={BANGLADESH_DIVISIONS}
      />

      {/* 3. Consolidated Table Component (~240 lines) */}
      <DecoratorManagementTable
        decorators={decorators}
        loading={loading}
        onView={setViewDecorator}
        onStatusTransition={handleStatusTransition}
        onToggleFeatured={handleToggleFeatured}
        onDelete={handleDeleteDecorator}
        getPlaceholderLogo={getPlaceholderLogo}
        onResetFilters={handleResetFilters}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* 4. Consolidated Modals Component (~260 lines) */}
      <DecoratorManagementModals
        viewDecorator={viewDecorator}
        onCloseView={() => setViewDecorator(null)}
        onStatusTransition={handleStatusTransition}
        onDelete={handleDeleteDecorator}
        getPlaceholderLogo={getPlaceholderLogo}
      />
    </div>
  );
};

export default ManageDecorator;
