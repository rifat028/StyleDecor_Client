import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Eye,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Layers,
  Sparkles,
  Building,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Transactions = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [customerId, setCustomerId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Invoice / Receipt Modal (GET /payments/id/:id)
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // 1. Resolve Customer ID
  useEffect(() => {
    const loadCustomerProfile = async () => {
      if (!user?.email) return;
      try {
        let profile = null;
        try {
          const res = await axiosSecure.get("/users/me");
          profile = res.data?.data || res.data;
        } catch (meErr) {
          const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`);
          profile = res.data?.data || res.data;
        }

        if (profile?._id) {
          setCustomerId(profile._id);
        }
      } catch (err) {
        console.error("Failed to load customer profile:", err);
      }
    };
    loadCustomerProfile();
  }, [axiosSecure, user?.email]);

  // 2. Integration: GET /payments/customer/:customerId
  const loadTransactions = useCallback(async () => {
    if (!customerId && !user?.email) return;
    try {
      setLoading(true);
      let list = [];
      if (customerId) {
        const res = await axiosSecure.get(`/payments/customer/${customerId}`);
        list = res.data?.data || [];
      } else {
        const res = await axiosSecure.get(`/payments/transactions?email=${encodeURIComponent(user.email)}`);
        list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      }
      setTransactions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, customerId, user?.email]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // 3. Integration: GET /payments/id/:id (Fetch Detailed Invoice Dossier)
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
    const completedList = transactions.filter((t) => t.status === "completed" || t.status === "paid");
    const totalSpent = completedList.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const refundedAmt = transactions
      .filter((t) => t.status === "refunded")
      .reduce((sum, t) => sum + (Number(t.refundDetails?.refundAmount) || Number(t.amount) || 0), 0);

    return {
      totalSpent,
      refundedAmt,
      completedCount: completedList.length,
      totalCount: transactions.length,
    };
  }, [transactions]);

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== "all") {
        if (statusFilter === "completed" && t.status !== "completed" && t.status !== "paid") return false;
        if (statusFilter === "refunded" && t.status !== "refunded") return false;
      }
      if (methodFilter !== "all" && t.paymentMethod?.toLowerCase() !== methodFilter.toLowerCase()) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (t.paymentCode || "").toLowerCase();
        const trx = (t.gatewayDetails?.transactionId || t.transactionId || "").toLowerCase();
        const srv = (t.booking?.serviceSnapshot?.title || t.serviceName || "").toLowerCase();
        const dec = (t.decorator?.businessName || "").toLowerCase();
        if (!code.includes(q) && !trx.includes(q) && !srv.includes(q) && !dec.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, statusFilter, methodFilter, searchText]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed" || s === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Paid
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
            <CreditCard className="w-3.5 h-3.5" /> Invoices & Receipts
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Payment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit your advance deposits, settlement receipts, and download official payment verification invoices.
          </p>
        </div>
      </div>

      {/* ================= Summary Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Total Paid Amount
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            ৳{stats.totalSpent.toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Across {stats.completedCount} completed reservations
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Settled Invoices
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.completedCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Verified by StyleDecor escrow
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" /> Refunded / Returned
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            ৳{stats.refundedAmt.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Reimbursed on cancelled events
          </p>
        </div>
      </div>

      {/* ================= Filter Controls & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search code, TRX ID, or service..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Invoices</option>
              <option value="completed">Completed / Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Methods</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="sslcommerz">SSLCommerz</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="stripe">Stripe Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Invoices Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Payment Transactions Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any transaction records matching your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Receipt Code</th>
                  <th className="py-4 px-4">Service & Package</th>
                  <th className="py-4 px-4">Decorator Agency</th>
                  <th className="py-4 px-4">Gateway & TRX ID</th>
                  <th className="py-4 px-4">Amount Paid</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">View Invoice</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((t) => {
                  const payCode = t.paymentCode || `PAY-${(t._id || t.transactionId || "").slice(-6).toUpperCase()}`;
                  const srvTitle = t.booking?.serviceSnapshot?.title || t.serviceName || "Decoration Setup";
                  const agency = t.decorator?.businessName || "StyleDecor Verified Agency";
                  const trxId = t.gatewayDetails?.transactionId || t.transactionId || "TRX-AUTO";
                  const method = t.paymentMethod || "sslcommerz";
                  const amt = Number(t.amount || 0);
                  const dateStr = t.paidAt || t.paidAT || t.createdAt;

                  return (
                    <tr
                      key={t._id || trxId}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/50">
                          {payCode}
                        </span>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs line-clamp-1">
                        {srvTitle}
                      </td>

                      {/* Decorator Agency */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {agency}
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

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                        ৳{amt.toLocaleString()}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {dateStr ? new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(t.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleOpenReceipt(t._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
                          title="View Official Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" /> Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= Printable Receipt / Invoice Modal (GET /payments/id/:id) ================= */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Payment Receipt & Invoice
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
                        Invoice Reference
                      </span>
                      <h4 className="text-base font-black text-purple-900 dark:text-purple-200 font-mono">
                        {selectedPayment.paymentCode}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Paid on {new Date(selectedPayment.paidAt || selectedPayment.createdAt).toLocaleString("en-US")}
                      </p>
                    </div>
                    <div>{renderStatusBadge(selectedPayment.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Billing Profile</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.customer?.name || selectedPayment.clientName || "Valued Client"}
                      </p>
                      <p className="text-[11px] text-slate-500">{selectedPayment.customer?.email || selectedPayment.clientEmail}</p>
                      <p className="text-[11px] text-slate-500">Phone: {selectedPayment.customer?.phone || "N/A"}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Service Providing Agency</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.decorator?.businessName || "StyleDecor Verified Agency"}
                      </p>
                      <p className="text-[11px] text-slate-500">City: {selectedPayment.decorator?.contactInfo?.city || "Dhaka"}</p>
                      <p className="text-[11px] text-slate-500">Hotline: {selectedPayment.decorator?.contactInfo?.phone || "N/A"}</p>
                    </div>
                  </div>

                  {selectedPayment.booking && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Event Reservation Details</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.booking.bookingCode} • {selectedPayment.booking.serviceSnapshot?.title || "Decoration Setup"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Venue: {selectedPayment.booking.eventDetails?.venueName || "Event Venue"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                      Payment & Settlement Information
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400">Payment Gateway</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedPayment.paymentMethod || "SSLCommerz"}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400">Transaction ID</span>
                        <p className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedPayment.gatewayDetails?.transactionId || "N/A"}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400">Payment Type</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 capitalize">{(selectedPayment.paymentType || "advance_deposit").replace("_", " ")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Total Amount Cleared</span>
                      <p className="text-lg font-black text-purple-900 dark:text-purple-200">
                        ৳{Number(selectedPayment.amount).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <span>Currency: BDT</span>
                      <p>Secured via Escrow</p>
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
    </div>
  );
};

export default Transactions;
