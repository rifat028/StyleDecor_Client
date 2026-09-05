import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { CreditCard } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import CustomerTransactionsToolbar from "../../components/pages/Customer/Transactions/CustomerTransactionsToolbar";
import CustomerTransactionsTable from "../../components/pages/Customer/Transactions/CustomerTransactionsTable";
import CustomerReceiptModal from "../../components/pages/Customer/Transactions/CustomerReceiptModal";

// Main Customer Payment Transactions & History Page
const Transactions = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Customer Profile & Data State
  const [customerId, setCustomerId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Invoice / Receipt Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // 1. Resolve Customer ID
  useEffect(() => {
    const loadCustomerProfile = async () => {
      if (!user?.email) return;
      try {
        setProfileLoading(true);
        let profile = null;
        try {
          const res = await axiosSecure.get("/users/me");
          profile = res.data?.data || res.data;
        } catch {
          const res = await axiosSecure.get(
            `/users/${encodeURIComponent(user.email)}`
          );
          profile = res.data?.data || res.data;
        }

        if (profile?._id) {
          setCustomerId(profile._id);
        }
      } catch (err) {
        console.error("Failed to load customer profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadCustomerProfile();
  }, [axiosSecure, user?.email]);

  // 2. Load Transactions by Customer ID or Email
  const loadTransactions = useCallback(async () => {
    if (!customerId && !user?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      let list = [];
      if (customerId) {
        const res = await axiosSecure.get(`/payments/customer/${customerId}`);
        list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await axiosSecure.get(
          `/payments/transactions?email=${encodeURIComponent(user.email)}`
        );
        list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      }
      setTransactions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      toast.error("Failed to load payment history");
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, customerId, user?.email]);

  useEffect(() => {
    if (customerId || user?.email) {
      loadTransactions();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [customerId, loadTransactions, profileLoading, user?.email]);

  // Combined Loading State for Immediate Skeletons
  const isInitialLoading = profileLoading || loading;

  // 3. Fetch Detailed Invoice Dossier
  const handleOpenReceipt = async (paymentId) => {
    try {
      setReceiptLoading(true);
      setIsReceiptModalOpen(true);
      const res = await axiosSecure.get(`/payments/id/${paymentId}`);
      setSelectedPayment(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch payment invoice dossier:", err);
      Swal.fire("Error", "Failed to retrieve invoice receipt.", "error");
      setIsReceiptModalOpen(false);
    } finally {
      setReceiptLoading(false);
    }
  };

  // Financial Statistics Summary
  const stats = useMemo(() => {
    const completedList = transactions.filter(
      (t) => t.status === "completed" || t.status === "paid"
    );
    const totalSpent = completedList.reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0
    );
    const refundedAmt = transactions
      .filter((t) => t.status === "refunded")
      .reduce(
        (sum, t) =>
          sum +
          (Number(t.refundDetails?.refundAmount) || Number(t.amount) || 0),
        0
      );

    return {
      totalSpent,
      refundedAmt,
      completedCount: completedList.length,
      totalCount: transactions.length,
    };
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== "all") {
        if (
          statusFilter === "completed" &&
          t.status !== "completed" &&
          t.status !== "paid"
        )
          return false;
        if (statusFilter === "refunded" && t.status !== "refunded") return false;
      }
      if (
        methodFilter !== "all" &&
        t.paymentMethod?.toLowerCase() !== methodFilter.toLowerCase()
      )
        return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (t.paymentCode || "").toLowerCase();
        const trx = (
          t.gatewayDetails?.transactionId ||
          t.transactionId ||
          ""
        ).toLowerCase();
        const srv = (
          t.booking?.serviceSnapshot?.title ||
          t.serviceName ||
          ""
        ).toLowerCase();
        const dec = (t.decorator?.businessName || "").toLowerCase();
        if (
          !code.includes(q) &&
          !trx.includes(q) &&
          !srv.includes(q) &&
          !dec.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, statusFilter, methodFilter, searchText]);

  // Paginated View Slice
  const totalCount = filteredTransactions.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredTransactions.slice(start, start + limit);
  }, [filteredTransactions, page, limit]);

  // Filter Handlers
  const handleSearchChange = (val) => {
    setSearchText(val);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleMethodFilterChange = (val) => {
    setMethodFilter(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setMethodFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={CreditCard}
        title="My Payment History"
        subtitle="Audit your advance deposits, settlement receipts, and download official payment verification invoices."
        onRefresh={() => {
          setRefreshing(true);
          loadTransactions();
        }}
        refreshing={refreshing}
        refreshDisabled={isInitialLoading}
      />

      {/* 2. Consolidated Toolbar: Stat Cards & Search/Method Filters */}
      <CustomerTransactionsToolbar
        stats={stats}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        methodFilter={methodFilter}
        onMethodFilterChange={handleMethodFilterChange}
        loadingStats={isInitialLoading}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {/* 3. Invoices Table with Pagination & Skeletons */}
      <CustomerTransactionsTable
        transactions={paginatedTransactions}
        loading={isInitialLoading}
        onOpenReceipt={handleOpenReceipt}
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

      {/* 4. Payment Receipt & Invoice Modal */}
      <CustomerReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        selectedPayment={selectedPayment}
        loading={receiptLoading}
      />
    </div>
  );
};

export default Transactions;
