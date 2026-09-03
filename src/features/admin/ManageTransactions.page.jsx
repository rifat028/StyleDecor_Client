import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { DollarSign } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import TransactionManagementToolbar from "../../components/pages/Admin/TransactionManagement/TransactionManagementToolbar";
import TransactionManagementTable from "../../components/pages/Admin/TransactionManagement/TransactionManagementTable";
import TransactionManagementModals from "../../components/pages/Admin/TransactionManagement/TransactionManagementModals";

// Admin payment transactions supervision page
const ManageTransactions = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [payments, setPayments] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Statistics Summary for 4 Payment Types + Total
  const [stats, setStats] = useState({
    total: 0,
    totalVolume: 0,
    advance_payment: { count: 0, volume: 0 },
    full_payment: { count: 0, volume: 0 },
    platform_fee: { count: 0, volume: 0 },
    agent_fee: { count: 0, volume: 0 },
    advanceCount: 0,
    fullCount: 0,
    platformCount: 0,
    agentCount: 0,
    decoratorStats: {},
  });

  // Filter States (typeFilter, selectedDecorator, sort, search)
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // View Receipt Modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

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

  // Load Payments with Filters
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sortBy,
      });

      if (typeFilter !== "all") params.append("paymentType", typeFilter);
      if (selectedDecorator !== "all") params.append("decoratorId", selectedDecorator);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());

      const res = await axiosSecure.get(`/payments?${params.toString()}`);
      if (res.data?.success) {
        setPayments(res.data.data || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setPayments(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
      toast.error("Failed to load transactions");
      setPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, page, limit, typeFilter, selectedDecorator, debouncedSearch, sortBy]);

  // Load Statistics Counters
  const loadStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/payments/stats");
      if (res.data?.success && res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Failed to load transaction stats:", err);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadPayments();
    loadStats();
  }, [loadPayments, loadStats]);

  // Reset Filters
  const handleResetFilters = () => {
    setTypeFilter("all");
    setSelectedDecorator("all");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("newest");
    setPage(1);
  };

  // Open Receipt Dossier Modal
  const handleOpenReceipt = async (paymentId) => {
    try {
      setReceiptLoading(true);
      setIsReceiptModalOpen(true);
      const res = await axiosSecure.get(`/payments/id/${paymentId}`);
      setSelectedPayment(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch payment dossier:", err);
      toast.error("Failed to load invoice dossier");
      setIsReceiptModalOpen(false);
    } finally {
      setReceiptLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={DollarSign}
        title="Manage Payment Transactions"
        subtitle="Supervise platform escrow, gateway clearances, and fee settlements across Bangladesh."
        onRefresh={() => {
          setRefreshing(true);
          loadPayments();
          loadStats();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Consolidated Toolbar with 5 cards and 3 dropdowns */}
      <TransactionManagementToolbar
        stats={stats}
        typeFilter={typeFilter}
        onSelectTypeFilter={(type) => {
          setTypeFilter(type);
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

      {/* 3. Consolidated Table Component with From, To, Amount, Type columns */}
      <TransactionManagementTable
        payments={payments}
        loading={loading}
        onView={handleOpenReceipt}
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

      {/* 4. Consolidated Dossier Modal Component */}
      <TransactionManagementModals
        isReceiptModalOpen={isReceiptModalOpen}
        onCloseReceipt={() => setIsReceiptModalOpen(false)}
        selectedPayment={selectedPayment}
        receiptLoading={receiptLoading}
      />
    </div>
  );
};

export default ManageTransactions;
