import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Layers, RefreshCw } from "lucide-react";
import ServiceManagementToolbar from "../../components/pages/Admin/ServiceManagement/ServiceManagementToolbar";
import ServiceManagementTable from "../../components/pages/Admin/ServiceManagement/ServiceManagementTable";
import ServiceManagementModals from "../../components/pages/Admin/ServiceManagement/ServiceManagementModals";

const CATEGORIES = [
  "Wedding & Pre-Wedding",
  "Birthday & Milestone",
  "Corporate & Commercial",
  "Home & Rooftop Gatherings",
  "Cultural & Religious Festivals",
  "Lighting & Special FX",
];

// Admin service packages management page
const ManageServices = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Statistics Summary
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
  });

  // Filter States
  const [statusTab, setStatusTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // View Details Modal State
  const [viewingService, setViewingService] = useState(null);

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
        console.warn("Failed to load decorators for dropdown:", err);
      }
    };
    fetchDecorators();
  }, [axiosSecure]);

  // Load Services with Filters
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sortBy,
      });

      if (statusTab === "featured") {
        params.append("featured", "true");
        params.append("status", "all");
      } else if (statusTab !== "all") {
        params.append("status", statusTab);
      } else {
        params.append("status", "all");
      }

      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedDecorator !== "all") params.append("decoratorId", selectedDecorator);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());

      const res = await axiosSecure.get(`/services?${params.toString()}`);
      if (res.data?.success) {
        setServices(res.data.data || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setServices(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
      toast.error("Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, page, limit, statusTab, selectedCategory, selectedDecorator, debouncedSearch, sortBy]);

  // Load Stats Overview
  const loadStats = useCallback(async () => {
    try {
      const [allRes, actRes, inactRes, featRes] = await Promise.all([
        axiosSecure.get("/services?status=all&limit=1"),
        axiosSecure.get("/services?status=active&limit=1"),
        axiosSecure.get("/services?status=inactive&limit=1"),
        axiosSecure.get("/services?featured=true&status=all&limit=1"),
      ]);

      setStats({
        total: allRes.data?.totalCount || 0,
        active: actRes.data?.totalCount || 0,
        inactive: inactRes.data?.totalCount || 0,
        featured: featRes.data?.totalCount || 0,
      });
    } catch (err) {
      console.warn("Failed to load stats:", err);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadServices();
    loadStats();
  }, [loadServices, loadStats]);

  // Reset Filters
  const handleResetFilters = () => {
    setStatusTab("all");
    setSelectedCategory("all");
    setSelectedDecorator("all");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("newest");
    setPage(1);
  };

  // 1-Click Status Toggle (Active <-> Inactive)
  const handleToggleStatus = async (srv) => {
    const newStatus = srv.status === "active" ? "inactive" : "active";
    try {
      await axiosSecure.patch(`/services/${srv._id}/status`, { status: newStatus });
      toast.success(`Package status is now ${newStatus.toUpperCase()}`);
      if (viewingService?._id === srv._id) {
        setViewingService((prev) => ({ ...prev, status: newStatus }));
      }
      loadServices();
      loadStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update package status");
    }
  };

  // 1-Click Featured Toggle
  const handleToggleFeatured = async (srv) => {
    const newFeatured = !srv.featured;
    try {
      await axiosSecure.patch(`/services/${srv._id}/status`, { featured: newFeatured });
      toast.success(
        newFeatured ? "Package added to highlights" : "Package removed from highlights"
      );
      if (viewingService?._id === srv._id) {
        setViewingService((prev) => ({ ...prev, featured: newFeatured }));
      }
      loadServices();
      loadStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle featured status");
    }
  };

  // Delete Service Package
  const handleDelete = async (srv) => {
    const confirm = await Swal.fire({
      title: "Delete Service Package?",
      text: `Are you sure you want to permanently delete "${
        srv.title || srv.serviceName
      }" from the marketplace?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Permanent",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/services/${srv._id}`);
      toast.success("Package permanently removed");
      if (viewingService?._id === srv._id) {
        setViewingService(null);
      }
      loadServices();
      loadStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Service Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Supervise decorator offerings, toggle active availability, and curate homepage highlights.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadServices();
            loadStats();
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
      <ServiceManagementToolbar
        stats={stats}
        statusTab={statusTab}
        onSelectStatusTab={(tab) => {
          setStatusTab(tab);
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
        categoryFilter={selectedCategory}
        onCategoryFilterChange={(cat) => {
          setSelectedCategory(cat);
          setPage(1);
        }}
        decoratorFilter={selectedDecorator}
        onDecoratorFilterChange={(dec) => {
          setSelectedDecorator(dec);
          setPage(1);
        }}
        sortFilter={sortBy}
        onSortFilterChange={(sort) => {
          setSortBy(sort);
          setPage(1);
        }}
        categoriesList={CATEGORIES}
        decoratorsList={decorators}
      />

      {/* 3. Consolidated Table Component (~240 lines) */}
      <ServiceManagementTable
        services={services}
        loading={loading}
        onView={setViewingService}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
        onDelete={handleDelete}
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

      {/* 4. Consolidated Modals Component (~230 lines) */}
      <ServiceManagementModals
        viewingService={viewingService}
        onClose={() => setViewingService(null)}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageServices;
