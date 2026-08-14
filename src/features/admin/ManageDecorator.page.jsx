import React, { useEffect, useState, useCallback, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Palette,
  Search,
  Filter,
  Trash2,
  Eye,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  AlertTriangle,
} from "lucide-react";

const TOP_CITIES = [
  "all",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
];

const getPlaceholderLogo = (name = "Decorator") => {
  const initials = encodeURIComponent(name || "Decorator");
  return `https://ui-avatars.com/api/?name=${initials}&background=7C3AED&color=ffffff&bold=true&size=150`;
};

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
  const [cityFilter, setCityFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Metrics/Stats Counters
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
  });

  // View Modal State
  const [viewDecorator, setViewDecorator] = useState(null);

  // Fetch Decorators List
  const fetchDecorators = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sortFilter,
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (cityFilter !== "all") params.append("city", cityFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

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
  }, [axiosSecure, page, limit, statusFilter, cityFilter, sortFilter, searchQuery]);

  // Fetch Global Counter Stats
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, activeRes, pendingRes, suspendedRes] = await Promise.all([
        axiosSecure.get("/decorators?status=all&limit=1"),
        axiosSecure.get("/decorators?status=active&limit=1"),
        axiosSecure.get("/decorators?status=pending&limit=1"),
        axiosSecure.get("/decorators?status=suspended&limit=1"),
      ]);

      setStats({
        total: allRes.data?.totalCount || 0,
        active: activeRes.data?.totalCount || 0,
        pending: pendingRes.data?.totalCount || 0,
        suspended: suspendedRes.data?.totalCount || 0,
      });
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

  // Search Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  // Status Change Workflow:
  // - If pending -> Approve (active + verified)
  // - If active -> Suspend (suspended)
  // - If suspended -> Reactivate (active)
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

      // If viewing in modal, update modal state too
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
      Swal.fire(
        "Deleted!",
        `"${decorator.businessName}" has been removed.`,
        "success"
      );
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-200 dark:border-purple-800">
              <Palette className="w-6 h-6" />
            </div>
            Manage Decorator Agencies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review vendor requests, approve active partners, and manage agency statuses.
          </p>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            fetchDecorators();
            fetchStats();
          }}
          disabled={loading || refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-600" : ""}`}
          />
          Refresh Data
        </button>
      </div>

      {/* Metrics Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Agencies
            </span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats.total}
          </p>
        </div>

        {/* Active */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Active (Approved)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </p>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.pending}
            </p>
            {stats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 animate-pulse">
                Needs Approval
              </span>
            )}
          </div>
        </div>

        {/* Suspended */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Suspended
            </span>
            <Ban className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.suspended}
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "All Agencies", count: stats.total },
            { id: "active", label: "Approved / Active", count: stats.active },
            { id: "pending", label: "Pending Requests", count: stats.pending },
            { id: "suspended", label: "Suspended", count: stats.suspended },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, City & Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md flex items-center"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search agency name, city, email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-20 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
            >
              Go
            </button>
          </form>

          {/* City & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* City */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                City:
              </span>
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {TOP_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Locations" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Sort:
              </span>
              <select
                value={sortFilter}
                onChange={(e) => {
                  setSortFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="rating">Top Rating ★</option>
                <option value="completedEvents">Most Events Done</option>
                <option value="newest">Newest Registered</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Per Page */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Show:
              </span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabular View */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Spinner />
          </div>
        ) : decorators.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Palette className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Decorators Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No decorator agency matched the selected filters or search keyword.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Agency / Brand</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Coverage Areas</th>
                  <th className="py-3.5 px-4 text-center">Performance</th>
                  <th className="py-3.5 px-4 text-center">Current Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Status Action & Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {decorators.map((dec) => {
                  const isVerified = Boolean(dec.verification?.isVerified);
                  return (
                    <tr
                      key={dec._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Agency Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={dec.logo || getPlaceholderLogo(dec.businessName)}
                            alt={dec.businessName}
                            onError={(e) => {
                              e.currentTarget.src = getPlaceholderLogo(dec.businessName);
                            }}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[180px] sm:max-w-xs">
                                {dec.businessName}
                              </h4>
                              {isVerified && (
                                <ShieldCheck
                                  className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0"
                                  title="Verified Agency"
                                />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                              {dec.tagline || dec.about || "Professional Decoration Agency"}
                            </p>
                            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {dec.contactInfo?.city || "Dhaka"} Base
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            {dec.contactInfo?.phone || "N/A"}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate max-w-[170px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            {dec.contactInfo?.email || "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* Coverage Areas */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(dec.serviceAreas || [dec.contactInfo?.city || "Dhaka"])
                            .slice(0, 2)
                            .map((area, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-100 dark:border-purple-900/40"
                              >
                                {area}
                              </span>
                            ))}
                          {(dec.serviceAreas?.length || 0) > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold">
                              +{(dec.serviceAreas?.length || 0) - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Performance Metrics */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                            ★ {dec.metrics?.rating ? Number(dec.metrics.rating).toFixed(1) : "5.0"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {dec.metrics?.completedEvents || 0} Events Done
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            dec.status === "active"
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : dec.status === "pending"
                              ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse"
                              : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          }`}
                        >
                          {dec.status === "active"
                            ? "Active / Approved"
                            : dec.status === "pending"
                            ? "Pending"
                            : "Suspended"}
                        </span>
                      </td>

                      {/* Actions: Strict Lifecycle Status Changes + View + Delete */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1. If Pending -> Action: Approve */}
                          {dec.status === "pending" && (
                            <button
                              onClick={() => handleStatusTransition(dec, "active")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                              title="Approve decorator application"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {/* 2. If Active (Approved) -> Action: Suspend */}
                          {dec.status === "active" && (
                            <button
                              onClick={() => handleStatusTransition(dec, "suspended")}
                              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Suspend active decorator"
                            >
                              <Ban className="w-3.5 h-3.5" /> Suspend
                            </button>
                          )}

                          {/* 3. If Suspended -> Action: Activate */}
                          {dec.status === "suspended" && (
                            <button
                              onClick={() => handleStatusTransition(dec, "active")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Reactivate suspended decorator"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Activate
                            </button>
                          )}

                          {/* View Full Profile */}
                          <button
                            onClick={() => setViewDecorator(dec)}
                            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
                            title="View Full Agency Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Permanent */}
                          <button
                            onClick={() => handleDeleteDecorator(dec)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Delete Agency Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination Bar */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {Math.min(page * limit, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalCount}
              </span>{" "}
              agencies
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= View Details Modal ================= */}
      {viewDecorator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-linear-to-r from-purple-950 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    viewDecorator.logo ||
                    getPlaceholderLogo(viewDecorator.businessName)
                  }
                  alt={viewDecorator.businessName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {viewDecorator.businessName}
                    {viewDecorator.verification?.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                    )}
                  </h3>
                  <p className="text-xs text-purple-200/80">
                    {viewDecorator.tagline || "Registered Decorator"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewDecorator(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
              {/* Performance & Status Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Status
                  </span>
                  <p className="font-bold text-xs capitalize text-purple-600 dark:text-purple-400">
                    {viewDecorator.status}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Rating
                  </span>
                  <p className="font-bold text-xs text-amber-500">
                    ★ {viewDecorator.metrics?.rating || "5.0"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Completed Events
                  </span>
                  <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {viewDecorator.metrics?.completedEvents || 0}
                  </p>
                </div>
              </div>

              {/* About */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-1.5">
                  About Agency
                </h4>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {viewDecorator.about || "No description provided."}
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-1.5">
                  Official Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Phone Number
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewDecorator.contactInfo?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Email Address
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewDecorator.contactInfo?.email || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Base City
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewDecorator.contactInfo?.city || "Dhaka"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Trade License No
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewDecorator.tradeLicenseNo || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-1.5">
                  Coverage Areas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(viewDecorator.serviceAreas || []).map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold border border-purple-100 dark:border-purple-900"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {/* Quick Status Action from Inside the Modal */}
              {viewDecorator.status === "pending" ? (
                <button
                  onClick={() => handleStatusTransition(viewDecorator, "active")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" /> Approve Agency
                </button>
              ) : viewDecorator.status === "active" ? (
                <button
                  onClick={() => handleStatusTransition(viewDecorator, "suspended")}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" /> Suspend Agency
                </button>
              ) : (
                <button
                  onClick={() => handleStatusTransition(viewDecorator, "active")}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Reactivate Agency
                </button>
              )}

              <button
                onClick={() => setViewDecorator(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

export default ManageDecorator;
