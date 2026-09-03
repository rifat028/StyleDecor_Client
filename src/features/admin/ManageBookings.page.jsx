import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Calendar } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import BookingManagementToolbar from "../../components/pages/Admin/BookingManagement/BookingManagementToolbar";
import BookingManagementTable from "../../components/pages/Admin/BookingManagement/BookingManagementTable";
import BookingManagementModals from "../../components/pages/Admin/BookingManagement/BookingManagementModals";

// Admin event bookings supervision page (read-only monitoring)
const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Statistics Summary
  const [stats, setStats] = useState({
    total: 0,
    preparing: 0,
    out_for_destination: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  });

  // Filter States
  const [statusTab, setStatusTab] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // View Dossier Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);

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
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());

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
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, page, limit, statusTab, selectedDecorator, debouncedSearch, sortBy]);

  // Load Summary Counters
  const loadStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/bookings/stats");
      if (res.data?.success && res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Failed to load stats:", err);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadBookings();
    loadStats();
  }, [loadBookings, loadStats]);

  // Reset Filters
  const handleResetFilters = () => {
    setStatusTab("all");
    setSelectedDecorator("all");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("newest");
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={Calendar}
        title="Manage Event Bookings"
        subtitle="Supervise booking transactions, execution stages, and field assignments nationwide."
        onRefresh={() => {
          setRefreshing(true);
          loadBookings();
          loadStats();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Consolidated Toolbar (~130 lines) */}
      <BookingManagementToolbar
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
        decoratorsList={decorators}
      />

      {/* 3. Consolidated Table Component (~240 lines) */}
      <BookingManagementTable
        bookings={bookings}
        loading={loading}
        onView={setSelectedBooking}
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

      {/* 4. Consolidated Modals Component (~250 lines) */}
      <BookingManagementModals
        selectedBooking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};

export default ManageBookings;
