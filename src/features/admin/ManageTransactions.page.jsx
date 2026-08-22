import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
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

  // Statistics Summary
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    refunded: 0,
    volume: 0,
  });

  // Filter States
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
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

  // Refund Modal
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundPayment, setRefundPayment] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [submittingRefund, setSubmittingRefund] = useState(false);

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

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (methodFilter !== "all") params.append("paymentMethod", methodFilter);
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
  }, [axiosSecure, page, limit, statusFilter, methodFilter, selectedDecorator, debouncedSearch, sortBy]);

  // Load Statistics Counters
  const loadStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/payments/stats");
      if (res.data?.success && res.data?.stats) {
        setStats({
          total: res.data.stats.totalTransactionsCount || 0,
          completed: res.data.stats.completedTransactionsCount || 0,
          refunded: res.data.stats.refundedTransactionsCount || 0,
          volume: res.data.stats.totalVolume || 0,
        });
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
    setStatusFilter("all");
    setMethodFilter("all");
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

  // Open Refund Modal
  const handleOpenRefund = (pay) => {
    setRefundPayment(pay);
    setRefundAmount(String(pay.amount || 0));
    setRefundReason("Customer dispute settlement and order cancellation.");
    setIsRefundModalOpen(true);
  };

  // Process Refund Submission
  const handleProcessRefund = async () => {
    if (!refundPayment?._id) return;

    try {
      setSubmittingRefund(true);
      const res = await axiosSecure.post(`/payments/${refundPayment._id}/refund`, {
        refundAmount: Number(refundAmount) || refundPayment.amount,
        refundReason: refundReason,
      });

      if (res.data?.success) {
        toast.success(`Refund processed for ${refundPayment.paymentCode || "payment"}`);
        setIsRefundModalOpen(false);
        loadPayments();
        loadStats();
      }
    } catch (err) {
      console.error("Failed to process refund:", err);
      toast.error(err.response?.data?.message || "Failed to process refund");
    } finally {
      setSubmittingRefund(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={DollarSign}
        title="Manage Payment Transactions"
        subtitle="Supervise platform escrow, gateway clearances, and dispute refunds across Bangladesh."
        onRefresh={() => {
          setRefreshing(true);
          loadPayments();
          loadStats();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Consolidated Toolbar (~130 lines) */}
      <TransactionManagementToolbar
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatusFilter={(status) => {
          setStatusFilter(status);
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
        methodFilter={methodFilter}
        onMethodFilterChange={(m) => {
          setMethodFilter(m);
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

      {/* 3. Consolidated Table Component (~230 lines) */}
      <TransactionManagementTable
        payments={payments}
        loading={loading}
        onView={handleOpenReceipt}
        onOpenRefund={handleOpenRefund}
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
      <TransactionManagementModals
        isReceiptModalOpen={isReceiptModalOpen}
        onCloseReceipt={() => setIsReceiptModalOpen(false)}
        selectedPayment={selectedPayment}
        receiptLoading={receiptLoading}
        isRefundModalOpen={isRefundModalOpen}
        onCloseRefund={() => setIsRefundModalOpen(false)}
        refundPayment={refundPayment}
        refundAmount={refundAmount}
        onRefundAmountChange={setRefundAmount}
        refundReason={refundReason}
        onRefundReasonChange={setRefundReason}
        onSubmitRefund={handleProcessRefund}
        submittingRefund={submittingRefund}
      />
    </div>
  );
};

export default ManageTransactions;
