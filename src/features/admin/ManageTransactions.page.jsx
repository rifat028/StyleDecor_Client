import React, { useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import {
  DollarSign,
  CreditCard,
  Building,
  TrendingUp,
  Calendar,
  Eye,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Layers,
  Award,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
} from "lucide-react";

const ManageTransactions = () => {
  const axiosSecure = useAxiosSecure();

  // Data States
  const [payments, setPayments] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // View Dossier Modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // Refund Modal
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundPayment, setRefundPayment] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [submittingRefund, setSubmittingRefund] = useState(false);

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

  // Integration 1: GET /payments (Admin Global Query & Filters)
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
      if (typeFilter !== "all") params.append("paymentType", typeFilter);
      if (selectedDecorator !== "all") params.append("decoratorId", selectedDecorator);
      if (searchText.trim()) params.append("search", searchText.trim());

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
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, limit, statusFilter, methodFilter, typeFilter, selectedDecorator, searchText, sortBy]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setMethodFilter("all");
    setTypeFilter("all");
    setSelectedDecorator("all");
    setSearchText("");
    setSearchInput("");
    setSortBy("newest");
    setPage(1);
  };

  // Integration 2: GET /payments/id/:id (Fetch Full Payment Dossier)
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

  // Open Refund Modal
  const handleOpenRefund = (pay) => {
    setRefundPayment(pay);
    setRefundAmount(String(pay.amount || 0));
    setRefundReason("Client requested cancellation and settlement refund.");
    setIsRefundModalOpen(true);
  };

  // Integration 3: POST /payments/:id/refund (Admin Process Refund)
  const handleProcessRefund = async () => {
    if (!refundPayment?._id) return;

    try {
      setSubmittingRefund(true);
      const res = await axiosSecure.post(`/payments/${refundPayment._id}/refund`, {
        refundAmount: Number(refundAmount) || refundPayment.amount,
        refundReason: refundReason,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Refund Processed",
          text: `Successfully refunded ৳${Number(refundAmount).toLocaleString()} for ${refundPayment.paymentCode}.`,
        });
        setIsRefundModalOpen(false);
        loadPayments();
      }
    } catch (err) {
      console.error("Failed to process refund:", err);
      Swal.fire("Refund Failed", err.response?.data?.message || "Failed to process refund.", "error");
    } finally {
      setSubmittingRefund(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    }
    if (s === "refunded") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
          <RotateCcw className="w-3 h-3" /> Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5" /> Financial Supervision & Escrow
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Manage Payment Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit customer deposits, gateway clearances, platform commissions, vendor receivables, and dispute refunds across Bangladesh.
          </p>
        </div>
      </div>

      {/* ================= Filter Controls & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative col-span-1 sm:col-span-2 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search payment code, TRX, or email..."
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

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Gateway Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Gateway:</span>
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Methods</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="sslcommerz">SSLCommerz</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>

          {/* Decorator Agency Filter */}
          <div className="flex items-center gap-1.5">
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
        </div>
      </div>

      {/* ================= Payments Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Payment Transactions Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No transactions match your search and filter criteria. Click Reset Filters to view all.
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
                  <th className="py-4 px-5">Payment Code</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Decorator Agency</th>
                  <th className="py-4 px-4">Gateway & TRX ID</th>
                  <th className="py-4 px-4">Gross Amount</th>
                  <th className="py-4 px-4">Platform Fee (10%)</th>
                  <th className="py-4 px-4">Vendor Share</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => {
                  const clientName = p.customer?.name || p.clientName || "Valued Client";
                  const clientEmail = p.customer?.email || p.clientEmail || "";
                  const agencyName = p.decorator?.businessName || "StyleDecor Partner";
                  const trxId = p.gatewayDetails?.transactionId || "TRX-AUTO";
                  const method = p.paymentMethod || "sslcommerz";
                  const grossAmt = Number(p.amount || 0);
                  const commission = Number(p.breakdown?.platformCommission) || Math.round(grossAmt * 0.10);
                  const receivable = Number(p.breakdown?.vendorReceivable) || Math.round(grossAmt * 0.885);

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/50">
                          {p.paymentCode}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {clientName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                            {clientEmail}
                          </p>
                        </div>
                      </td>

                      {/* Decorator */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                        {agencyName}
                      </td>

                      {/* Gateway & TRX */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {method}
                          </span>
                          <p className="text-[10px] font-mono text-slate-400">
                            {trxId}
                          </p>
                        </div>
                      </td>

                      {/* Gross Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                        ৳{grossAmt.toLocaleString()}
                      </td>

                      {/* Platform Commission */}
                      <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-bold whitespace-nowrap">
                        +৳{commission.toLocaleString()}
                      </td>

                      {/* Net Receivable */}
                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                        ৳{receivable.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(p.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReceipt(p._id)}
                            className="p-2 rounded-xl border border-purple-200 dark:border-purple-900/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 cursor-pointer"
                            title="View Full Payment Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {p.status === "completed" && (
                            <button
                              onClick={() => handleOpenRefund(p)}
                              className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                              title="Issue Dispute Refund"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
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
              transactions
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

      {/* ================= Integration 2: View Payment Dossier Modal (GET /payments/id/:id) ================= */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Payment Clearing Dossier: {selectedPayment?.paymentCode}
                </h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              {receiptLoading || !selectedPayment ? (
                <div className="p-12 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                        Reference Code
                      </span>
                      <h4 className="text-base font-black text-purple-900 dark:text-purple-200 font-mono">
                        {selectedPayment.paymentCode}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Processed on {new Date(selectedPayment.paidAt || selectedPayment.createdAt).toLocaleString("en-US")}
                      </p>
                    </div>
                    <div>{renderStatusBadge(selectedPayment.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Payer Customer</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.customer?.name || selectedPayment.clientName || "Valued Client"}
                      </p>
                      <p className="text-[11px] text-slate-500">{selectedPayment.customer?.email || selectedPayment.clientEmail}</p>
                      <p className="text-[11px] text-slate-500">{selectedPayment.customer?.phone || "N/A"}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Beneficiary Agency</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.decorator?.businessName || "StyleDecor Verified Agency"}
                      </p>
                      <p className="text-[11px] text-slate-500">City: {selectedPayment.decorator?.contactInfo?.city || "Dhaka"}</p>
                      <p className="text-[11px] text-slate-500">Hotline: {selectedPayment.decorator?.contactInfo?.phone || "N/A"}</p>
                    </div>
                  </div>

                  {selectedPayment.booking && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Booking</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.booking.bookingCode} • {selectedPayment.booking.serviceSnapshot?.title || "Decoration Setup"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Venue: {selectedPayment.booking.eventDetails?.venueName || "Convention Venue"}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                      Complete Escrow Split Breakdown
                    </h5>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Gross Amount Received</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">৳{Number(selectedPayment.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Gateway Fee (1.5%)</span>
                      <span>৳{Number(selectedPayment.breakdown?.gatewayFee || Math.round(selectedPayment.amount * 0.015)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                      <span>Platform Commission Earned (10.0%)</span>
                      <span>৳{Number(selectedPayment.breakdown?.platformCommission || Math.round(selectedPayment.amount * 0.10)).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-emerald-600 dark:text-emerald-400">
                      <span>Vendor Payable</span>
                      <span>৳{Number(selectedPayment.breakdown?.vendorReceivable || Math.round(selectedPayment.amount * 0.885)).toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Integration 3: Issue Dispute Refund Modal (POST /payments/:id/refund) ================= */}
      {isRefundModalOpen && refundPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  Issue Dispute Refund
                </h3>
              </div>
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-300">
                  Target Transaction: {refundPayment.paymentCode}
                </span>
                <p className="text-[11px] text-slate-500">
                  Customer: {refundPayment.customer?.name || refundPayment.clientName} (Original Amount: ৳{Number(refundPayment.amount).toLocaleString()})
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Refund Amount (৳):
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Refund Reason / Memo:
                </label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={submittingRefund}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50 cursor-pointer"
              >
                {submittingRefund ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTransactions;
