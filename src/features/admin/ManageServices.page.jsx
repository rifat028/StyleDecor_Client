import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Layers } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import ServiceManagementToolbar from "../../components/pages/Admin/ServiceManagement/ServiceManagementToolbar";
import ServiceManagementTable from "../../components/pages/Admin/ServiceManagement/ServiceManagementTable";
import ServiceManagementModals from "../../components/pages/Admin/ServiceManagement/ServiceManagementModals";

const CATEGORIES = [
  "Wedding & Pre-Wedding",
  "Corporate & Gala",
  "Birthday & Milestone",
  "Cultural & Religious",
  "Home & Rooftop Intimate Setups",
  "Lighting, FX & Rentals",
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
      const res = await axiosSecure.get("/services/stats");
      if (res.data?.success && res.data?.data) {
        setStats({
          total: res.data.data.total || 0,
          active: res.data.data.active || 0,
          inactive: res.data.data.inactive || 0,
          featured: res.data.data.featured || 0,
        });
      }
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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={Layers}
        title="Manage Service Packages"
        subtitle="Supervise decorator offerings, toggle active availability, and curate homepage highlights."
        onRefresh={() => {
          setRefreshing(true);
          loadServices();
          loadStats();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Consolidated Toolbar with Dropdown Filters and Stat Cards */}
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

      {/* 3. Consolidated Table Component */}
      <ServiceManagementTable
        services={services}
        loading={loading}
        onView={setViewingService}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
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

      {/* 4. Consolidated Modals Component */}
      <ServiceManagementModals
        viewingService={viewingService}
        onClose={() => setViewingService(null)}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
};

export default ManageServices;
