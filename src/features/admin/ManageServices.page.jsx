import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import {
  Layers,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Tag,
  ArrowRight,
  X,
  Sparkles,
  Eye,
  Building,
  MapPin,
  Clock,
  Calendar,
  Check,
  ShieldCheck,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Filter,
} from "lucide-react";

const CATEGORIES = [
  "Wedding & Pre-Wedding",
  "Birthday & Milestone",
  "Corporate & Commercial",
  "Home & Rooftop Gatherings",
  "Cultural & Religious Festivals",
  "Lighting & Special FX",
];

const ManageServices = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // View Details Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingService, setViewingService] = useState(null);

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
      if (searchText.trim()) params.append("search", searchText.trim());

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
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, limit, statusTab, selectedCategory, selectedDecorator, searchText, sortBy]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusTab("all");
    setSelectedCategory("all");
    setSelectedDecorator("all");
    setSearchText("");
    setSearchInput("");
    setSortBy("newest");
    setPage(1);
  };

  // Open View Details Modal
  const openViewModal = (srv) => {
    setViewingService(srv);
    setIsViewModalOpen(true);
  };

  // 1-Click Status Toggle (Active <-> Inactive)
  const handleToggleStatus = async (srv) => {
    const newStatus = srv.status === "active" ? "inactive" : "active";
    try {
      await axiosSecure.patch(`/services/${srv._id}/status`, { status: newStatus });
      Swal.fire({
        icon: "success",
        title: newStatus === "active" ? "Package Activated" : "Package Deactivated",
        text: `"${srv.title || srv.serviceName}" status is now ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      loadServices();
      loadStats();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update package status.", "error");
    }
  };

  // 1-Click Featured Toggle
  const handleToggleFeatured = async (srv) => {
    const newFeatured = !srv.featured;
    try {
      await axiosSecure.patch(`/services/${srv._id}/status`, { featured: newFeatured });
      Swal.fire({
        icon: "success",
        title: newFeatured ? "Added to Highlights" : "Removed from Highlights",
        text: `Package is now ${newFeatured ? "featured on homepage" : "unfeatured"}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      loadServices();
      loadStats();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to toggle featured state.", "error");
    }
  };

  // Delete Handler
  const handleDelete = async (srv) => {
    const confirm = await Swal.fire({
      title: "Delete Service Package?",
      text: `Are you sure you want to permanently delete "${srv.title || srv.serviceName}" from the marketplace? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Permanent",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/services/${srv._id}`);
      Swal.fire("Deleted!", "Package has been permanently removed.", "success");
      loadServices();
      loadStats();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete package.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" /> Catalog Supervision
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Manage Service Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit verified services listed by registered decorator agencies. As an administrator, you can toggle active status, feature packages on the homepage, or remove non-compliant listings.
          </p>
        </div>
      </div>

      {/* ================= Live Counter Metric Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Catalog Packages
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats.total}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Active Packages
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Inactive / Suspended
          </span>
          <p className="text-2xl font-black text-slate-600 dark:text-slate-400">
            {stats.inactive}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Featured Highlights
          </span>
          <p className="text-2xl font-black text-amber-500">
            {stats.featured}
          </p>
        </div>
      </div>

      {/* ================= Filter Controls & Status Tabs ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "All Packages", count: stats.total },
            { id: "active", label: "Active", count: stats.active },
            { id: "inactive", label: "Inactive", count: stats.inactive },
            { id: "featured", label: "Featured Highlights", count: stats.featured },
          ].map((tab) => {
            const isSelected = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusTab(tab.id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search package title or keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Cat:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Decorator Agency Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Agency:</span>
            <select
              value={selectedDecorator}
              onChange={(e) => {
                setSelectedDecorator(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer truncate"
            >
              <option value="all">All Agencies</option>
              {decorators.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.businessName}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="newest">Newest Added</option>
              <option value="rating">Highest Rated ★</option>
              <option value="popular">Most Booked</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Services Data Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : services.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Services Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No packages matching your query were found. Click Reset Filters to view the full catalog.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Package Details</th>
                  <th className="py-4 px-4">Providing Agency</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Pricing (৳)</th>
                  <th className="py-4 px-4">Deposit</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {services.map((srv) => {
                  const title = srv.title || srv.serviceName || "Package";
                  const cover = srv.coverImage || srv.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=200";
                  const cat = typeof srv.category === "string" ? srv.category : (srv.category?.name || "Decoration");
                  const price = srv.pricing?.discountedPrice || srv.pricing?.basePrice || srv.cost || 20000;
                  const deposit = srv.pricing?.depositRequiredPercent || 25;
                  const rating = srv.metrics?.rating || srv.rating || 5.0;
                  const vendorName = srv.decorator?.businessName || "StyleDecor Agency";
                  const vendorCity = srv.decorator?.contactInfo?.city || "Dhaka";
                  const isActive = srv.status === "active";
                  const isFeatured = Boolean(srv.featured);

                  return (
                    <tr
                      key={srv._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Package Title & Cover */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={cover}
                            alt={title}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="space-y-0.5 max-w-xs">
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                              {title}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {srv.packages?.length || 0} Pricing Packages
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Decorator Agency */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[150px]">
                            {vendorName}
                          </p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-purple-500" /> {vendorCity}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 whitespace-nowrap">
                          {cat}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-black text-purple-600 dark:text-purple-400 text-sm whitespace-nowrap">
                        ৳{Number(price).toLocaleString()}
                      </td>

                      {/* Deposit */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {deposit}%
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4 font-bold text-amber-500 whitespace-nowrap">
                        ★ {Number(rating).toFixed(1)}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(srv)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            isFeatured
                              ? "bg-amber-100 dark:bg-amber-950/50 border-amber-300 text-amber-600"
                              : "border-slate-200 dark:border-slate-700 text-slate-300 hover:text-amber-500"
                          }`}
                          title={isFeatured ? "Featured on Home" : "Click to Feature"}
                        >
                          <Star className={`w-4 h-4 ${isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
                        </button>
                      </td>

                      {/* Status & 1-Click Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(srv)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all cursor-pointer ${
                            isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                          }`}
                          title={`Click to switch to ${isActive ? "inactive" : "active"}`}
                        >
                          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {srv.status || "active"}
                        </button>
                      </td>

                      {/* Action Buttons: View Details & Delete */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openViewModal(srv)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-600 cursor-pointer"
                            title="View Full Package Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(srv)}
                            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                            title="Delete Permanent"
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

        {/* ================= Table Pagination Footer ================= */}
        {totalCount > limit && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs">
            <p className="text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {Math.min(page * limit, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {totalCount}
              </span>{" "}
              services
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= Read-Only View Details Modal ================= */}
      {isViewModalOpen && viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Package Dossier: {viewingService.title || viewingService.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              {/* Cover & Title */}
              <div className="flex gap-4 items-start">
                <img
                  src={viewingService.coverImage || viewingService.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=300"}
                  alt={viewingService.title}
                  className="w-28 h-24 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-md"
                />
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200">
                    {typeof viewingService.category === "string" ? viewingService.category : viewingService.category?.name}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {viewingService.title || viewingService.serviceName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Providing Decorator: <span className="font-semibold text-purple-600 dark:text-purple-400">{viewingService.decorator?.businessName || "StyleDecor Verified Agency"}</span>
                  </p>
                </div>
              </div>

              {/* Pricing & Booking Stats Matrix */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Discounted Price</span>
                  <p className="font-black text-sm text-purple-600 dark:text-purple-400">
                    ৳{Number(viewingService.pricing?.discountedPrice || viewingService.cost || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Deposit Required</span>
                  <p className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                    {viewingService.pricing?.depositRequiredPercent || 25}%
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Rating ★</span>
                  <p className="font-black text-sm text-amber-500">
                    {viewingService.metrics?.rating || 5.0} ({viewingService.metrics?.reviewCount || 0} reviews)
                  </p>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                  Description
                </h5>
                <p className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 leading-relaxed text-xs">
                  {viewingService.shortDescription || viewingService.description || "Custom event package."}
                </p>
              </div>

              {/* Specifications */}
              {viewingService.specifications && (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                    Setup Specifications
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400">Setup Duration</span>
                      <p className="font-bold">{viewingService.specifications.setupDurationHours || 6}h</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400">Teardown</span>
                      <p className="font-bold">{viewingService.specifications.teardownDurationHours || 2}h</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400">Min Notice</span>
                      <p className="font-bold">{viewingService.specifications.minimumNoticeDays || 3}d</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400">Outdoor Safe</span>
                      <p className="font-bold">{viewingService.specifications.isOutdoorSuitable ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Package Variations */}
              {viewingService.packages?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                    Available Package Tiers ({viewingService.packages.length})
                  </h5>
                  <div className="space-y-2">
                    {viewingService.packages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {pkg.tier}
                        </span>
                        <span className="font-black text-purple-600 dark:text-purple-400">
                          ৳{Number(pkg.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
