import React, { useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  CreditCard,
  ShieldCheck,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  UserCheck,
} from "lucide-react";

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Statistics Summary
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
  });

  // Filter States
  const [statusTab, setStatusTab] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // View Dossier Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  // Load Bookings with Filters & Pagination
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sortBy,
      });

      if (statusTab !== "all") params.append("status", statusTab);
      if (selectedDecorator !== "all") params.append("decoratorId", selectedDecorator);
      if (searchText.trim()) params.append("search", searchText.trim());

      const res = await axiosSecure.get(`/bookings?${params.toString()}`);
      if (res.data?.success) {
        setBookings(res.data.data || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setBookings(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, limit, statusTab, selectedDecorator, searchText, sortBy]);

  // Load Summary Counters
  const loadStats = useCallback(async () => {
    try {
      const [allRes, accRes, progRes, compRes, pendRes] = await Promise.all([
        axiosSecure.get("/bookings?limit=1"),
        axiosSecure.get("/bookings?status=accepted&limit=1"),
        axiosSecure.get("/bookings?status=in_progress&limit=1"),
        axiosSecure.get("/bookings?status=completed&limit=1"),
        axiosSecure.get("/bookings?status=pending&limit=1"),
      ]);

      setStats({
        total: allRes.data?.totalCount || 0,
        accepted: accRes.data?.totalCount || 0,
        inProgress: progRes.data?.totalCount || 0,
        completed: compRes.data?.totalCount || 0,
        pending: pendRes.data?.totalCount || 0,
      });
    } catch (err) {
      console.warn("Failed to load stats:", err);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadBookings();
    loadStats();
  }, [loadBookings, loadStats]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusTab("all");
    setSelectedDecorator("all");
    setSearchText("");
    setSearchInput("");
    setSortBy("newest");
    setPage(1);
  };

  // Open View Modal
  const handleOpenView = (b) => {
    setSelectedBooking(b);
    setIsViewModalOpen(true);
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "in_draft":
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 uppercase">
            In Draft
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case "advance_paid":
      case "advance paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 uppercase">
            <CreditCard className="w-3 h-3" /> Advance Paid
          </span>
        );
      case "preparing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase">
            <Sparkles className="w-3 h-3" /> Preparing
          </span>
        );
      case "on_the_way":
      case "on the way":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase">
            <Clock className="w-3 h-3" /> On The Way
          </span>
        );
      case "in_progress":
      case "inprogress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "fully_paid":
      case "fully paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 uppercase">
            <ShieldCheck className="w-3 h-3" /> Fully Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" /> Bookings Supervision (Read-Only)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Manage Event Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit and monitor all customer event reservations across Bangladesh. Booking modifications, agent assignments, and progress updates are managed directly by the providing decorator agencies.
          </p>
        </div>
      </div>

      {/* ================= Live Statistics Counters ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Bookings
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats.total}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Accepted
          </span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {stats.accepted}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            In Progress
          </span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.inProgress}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Completed
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Pending Review
          </span>
          <p className="text-2xl font-black text-amber-500">
            {stats.pending}
          </p>
        </div>
      </div>

      {/* ================= Filter Controls & Status Tabs ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "All Bookings" },
            { id: "in_draft", label: "In Draft" },
            { id: "pending", label: "Pending" },
            { id: "accepted", label: "Accepted" },
            { id: "advance_paid", label: "Advance Paid" },
            { id: "preparing", label: "Preparing" },
            { id: "on_the_way", label: "On The Way" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
            { id: "fully_paid", label: "Fully Paid" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => {
            const isSelected = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusTab(tab.id);
                  setPage(1);
                }}
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

        {/* Search & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search code, customer, or venue..."
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

          {/* Decorator Agency Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Vendor:</span>
            <select
              value={selectedDecorator}
              onChange={(e) => {
                setSelectedDecorator(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer truncate"
            >
              <option value="all">All Decorators</option>
              {decorators.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.businessName}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
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
              <option value="newest">Newest First</option>
              <option value="eventDate_asc">Event Date: Earliest First</option>
              <option value="eventDate_desc">Event Date: Latest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Bookings Data Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Bookings Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No bookings matched your filter criteria. Click Reset Filters to view all bookings.
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
                  <th className="py-4 px-5">Booking Code</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Service & Package</th>
                  <th className="py-4 px-4">Decorator Agency</th>
                  <th className="py-4 px-4">Event Date & Venue</th>
                  <th className="py-4 px-4">Amount (৳)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">View Dossier</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => {
                  const code = b.bookingCode || `BK-${b._id.slice(-6).toUpperCase()}`;
                  const clientName = b.customer?.name || b.clientName || "Valued Client";
                  const clientEmail = b.customer?.email || b.clientEmail || "";
                  const serviceTitle = b.serviceSnapshot?.title || b.serviceName || "Decoration Setup";
                  const pkgTier = b.serviceSnapshot?.selectedPackage || "Standard";
                  const agencyName = b.decorator?.businessName || "StyleDecor Agency";
                  const rawDate = b.eventDetails?.eventDate || b.bookingDate;
                  const dateStr = rawDate
                    ? new Date(rawDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD";
                  const venue = b.eventDetails?.venueName || b.location || "Venue TBD";
                  const grandTotal = b.pricingBreakdown?.grandTotal || b.totalCost || 0;

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/50">
                          {code}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {clientName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {clientEmail}
                          </p>
                        </div>
                      </td>

                      {/* Service & Package */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {serviceTitle}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Tier: <span className="font-semibold text-purple-600">{pkgTier}</span>
                          </span>
                        </div>
                      </td>

                      {/* Decorator Agency */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[140px]">
                            {agencyName}
                          </p>
                          {b.assignedAgent && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" /> {b.assignedAgent.name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Event Date & Venue */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {dateStr}
                          </p>
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]">
                            {venue}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                        ৳{Number(grandTotal).toLocaleString()}
                      </td>

                      {/* Read-Only Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(b.status)}
                      </td>

                      {/* Action: View Dossier Only */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleOpenView(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
                          title="View Full Booking Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
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
              bookings
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

      {/* ================= View Dossier Modal (Read-Only) ================= */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Booking Dossier: {selectedBooking.bookingCode || selectedBooking.serviceName}
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
              {/* Customer & Agency Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Profile</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedBooking.customer?.name || selectedBooking.clientName || "Valued Client"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedBooking.customer?.email || selectedBooking.clientEmail}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Phone: {selectedBooking.contact || selectedBooking.customer?.phone || "N/A"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Decorator Agency</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedBooking.decorator?.businessName || "StyleDecor Verified Agency"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    City: {selectedBooking.decorator?.contactInfo?.city || "Dhaka"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Agency Hotline: {selectedBooking.decorator?.contactInfo?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Service & Package Snapshot */}
              <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  {selectedBooking.serviceSnapshot?.category || "Decoration"}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Selected Package: <span className="font-semibold text-purple-600">{selectedBooking.serviceSnapshot?.selectedPackage || "Standard Tier"}</span>
                </p>
              </div>

              {/* Event Schedule & Venue */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                  Event Logistics & Schedule
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400">Date & Timing</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {selectedBooking.eventDetails?.eventDate
                        ? new Date(selectedBooking.eventDetails.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : selectedBooking.bookingDate || "TBD"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Hours: {selectedBooking.eventDetails?.startTime || "16:00"} - {selectedBooking.eventDetails?.endTime || "22:00"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400">Venue & Address</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {selectedBooking.eventDetails?.venueName || selectedBooking.location || "Venue TBD"}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {selectedBooking.eventDetails?.venueAddress || selectedBooking.location || "Dhaka"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Assigned Specialist */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Current Lifecycle Status</span>
                  <div className="pt-1">{renderStatusBadge(selectedBooking.status)}</div>
                </div>
                {selectedBooking.assignedAgent && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Field Lead</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{selectedBooking.assignedAgent.name}</p>
                    <p className="text-[10px] text-slate-500">{selectedBooking.assignedAgent.phone}</p>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                  Financial Accounting
                </h5>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>৳{Number(selectedBooking.pricingBreakdown?.subtotal || selectedBooking.totalCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Service Tax (5%)</span>
                  <span>৳{Number(selectedBooking.pricingBreakdown?.serviceTax || 0).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-slate-100">
                  <span>Grand Total</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    ৳{Number(selectedBooking.pricingBreakdown?.grandTotal || selectedBooking.totalCost || 0).toLocaleString()}
                  </span>
                </div>
              </div>
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

export default ManageBookings;
