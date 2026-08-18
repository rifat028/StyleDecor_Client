import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { DollarSign } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import MyEarningsToolbar from "../../components/pages/Decorator/MyEarnings/MyEarningsToolbar";
import MyEarningsTable from "../../components/pages/Decorator/MyEarnings/MyEarningsTable";
import MyEarningsReceiptModal from "../../components/pages/Decorator/MyEarnings/MyEarningsReceiptModal";

// Main Decorator Earnings & Payouts Page
const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Decorator Agency State
  const [decoratorId, setDecoratorId] = useState(null);
  const [decoratorProfile, setDecoratorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Payments State
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters and Pagination State
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Receipt Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // 1. Resolve Decorator Agency Profile
  useEffect(() => {
    const loadDecorator = async () => {
      if (!user?.email) return;
      try {
        setProfileLoading(true);
        let dec = null;
        try {
          const res = await axiosSecure.get("/decorators/me");
          dec = res.data?.data || res.data;
        } catch {
          const res = await axiosSecure.get(
            `/decorators/${encodeURIComponent(user.email)}`
          );
          dec = res.data?.data || res.data;
        }

        if (dec?._id) {
          setDecoratorId(dec._id);
          setDecoratorProfile(dec);
        }
      } catch (err) {
        console.error("Failed to load decorator agency profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadDecorator();
  }, [axiosSecure, user?.email]);

  // 2. Fetch Payments for this Decorator
  const loadDecoratorPayments = useCallback(async () => {
    if (!decoratorId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/payments/decorator/${decoratorId}`);
      const list = res.data?.data || [];
      setPayments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load decorator payments:", err);
      toast.error("Failed to load earnings records");
      setPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, decoratorId]);

  useEffect(() => {
    if (decoratorId) {
      loadDecoratorPayments();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [loadDecoratorPayments, decoratorId, profileLoading]);

  // Combined Loading State for Immediate Skeleton Presentation
  const isInitialLoading = profileLoading || loading;

  // 3. Fetch Full Payment Receipt Dossier
  const handleOpenReceipt = async (paymentId) => {
    try {
      setReceiptLoading(true);
      setIsReceiptModalOpen(true);
      const res = await axiosSecure.get(`/payments/id/${paymentId}`);
      setSelectedPayment(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch payment invoice dossier:", err);
      Swal.fire("Error", "Failed to retrieve invoice dossier.", "error");
      setIsReceiptModalOpen(false);
    } finally {
      setReceiptLoading(false);
    }
  };

  // Financial Statistics Summary
  const stats = useMemo(() => {
    const completedList = payments.filter((p) => p.status === "completed");
    const grossVolume = completedList.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
    const platformCommission = completedList.reduce(
      (sum, p) =>
        sum +
        (Number(p.breakdown?.platformCommission) ||
          Math.round(p.amount * 0.10)),
      0
    );
    const vendorNet = completedList.reduce(
      (sum, p) =>
        sum +
        (Number(p.breakdown?.vendorReceivable) ||
          Math.round(p.amount * 0.885)),
      0
    );
    const refunded = payments
      .filter((p) => p.status === "refunded")
      .reduce(
        (sum, p) =>
          sum +
          (Number(p.refundDetails?.refundAmount) || Number(p.amount) || 0),
        0
      );

    return {
      grossVolume,
      platformCommission,
      vendorNet,
      refunded,
      completedCount: completedList.length,
      totalTransactions: payments.length,
    };
  }, [payments]);

  // Filtered Payments List
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (
        methodFilter !== "all" &&
        p.paymentMethod?.toLowerCase() !== methodFilter.toLowerCase()
      )
        return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (p.paymentCode || "").toLowerCase();
        const trx = (p.gatewayDetails?.transactionId || "").toLowerCase();
        const client = (p.customer?.name || p.clientName || "").toLowerCase();
        const bkgCode = (p.booking?.bookingCode || "").toLowerCase();
        if (
          !code.includes(q) &&
          !trx.includes(q) &&
          !client.includes(q) &&
          !bkgCode.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [payments, statusFilter, methodFilter, searchText]);

  // Paginated View Slice
  const totalCount = filteredPayments.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPayments.slice(start, start + limit);
  }, [filteredPayments, page, limit]);

  // Reset pagination on filter change
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
        icon={DollarSign}
        title="My Earnings & Payouts"
        subtitle={`Audit all customer deposits, view platform commission breakdowns, and track net vendor receivables for ${decoratorProfile?.businessName || "your agency"}.`}
        onRefresh={() => {
          setRefreshing(true);
          loadDecoratorPayments();
        }}
        refreshing={refreshing}
        refreshDisabled={isInitialLoading || refreshing}
      />

      {/* 2. Consolidated Toolbar: Stat Cards & Search/Gateway Filters */}
      <MyEarningsToolbar
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

      {/* 3. Payments Table with Pagination & Skeletons */}
      <MyEarningsTable
        payments={paginatedPayments}
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

      {/* 4. Payment Receipt & Invoice Dossier Modal */}
      <MyEarningsReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        selectedPayment={selectedPayment}
        decoratorProfile={decoratorProfile}
        loading={receiptLoading}
      />
    </div>
  );
};

export default MyEarnings;
