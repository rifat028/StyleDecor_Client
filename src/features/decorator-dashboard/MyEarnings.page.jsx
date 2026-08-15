import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
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
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [decoratorId, setDecoratorId] = useState(null);
  const [decoratorProfile, setDecoratorProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [netReceivablesTotal, setNetReceivablesTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Modals
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // 1. Resolve Decorator Agency Profile
  useEffect(() => {
    const loadDecorator = async () => {
      if (!user?.email) return;
      try {
        let dec = null;
        try {
          const res = await axiosSecure.get("/decorators/me");
          dec = res.data?.data || res.data;
        } catch (meErr) {
          const res = await axiosSecure.get(`/decorators/${encodeURIComponent(user.email)}`);
          dec = res.data?.data || res.data;
        }

        if (dec?._id) {
          setDecoratorId(dec._id);
          setDecoratorProfile(dec);
        }
      } catch (err) {
        console.error("Failed to load decorator agency profile:", err);
      }
    };
    loadDecorator();
  }, [axiosSecure, user?.email]);

  // 2. Integration 1: GET /payments/decorator/:decoratorId
  const loadDecoratorPayments = useCallback(async () => {
    if (!decoratorId) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/payments/decorator/${decoratorId}`);
      const list = res.data?.data || [];
      setPayments(Array.isArray(list) ? list : []);
      setNetReceivablesTotal(res.data?.netReceivables || 0);
    } catch (err) {
      console.error("Failed to load decorator payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, decoratorId]);

  useEffect(() => {
    loadDecoratorPayments();
  }, [loadDecoratorPayments]);

  // 3. Integration 2: GET /payments/id/:id (Fetch Full Payment Receipt Dossier)
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
    const grossVolume = completedList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const platformCommission = completedList.reduce(
      (sum, p) => sum + (Number(p.breakdown?.platformCommission) || Math.round(p.amount * 0.10)),
      0
    );
    const vendorNet = completedList.reduce(
      (sum, p) => sum + (Number(p.breakdown?.vendorReceivable) || Math.round(p.amount * 0.885)),
      0
    );
    const refunded = payments
      .filter((p) => p.status === "refunded")
      .reduce((sum, p) => sum + (Number(p.refundDetails?.refundAmount) || Number(p.amount) || 0), 0);

    return {
      grossVolume,
      platformCommission,
      vendorNet,
      refunded,
      completedCount: completedList.length,
      totalTransactions: payments.length,
    };
  }, [payments]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (methodFilter !== "all" && p.paymentMethod?.toLowerCase() !== methodFilter.toLowerCase()) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (p.paymentCode || "").toLowerCase();
        const trx = (p.gatewayDetails?.transactionId || "").toLowerCase();
        const client = (p.customer?.name || p.clientName || "").toLowerCase();
        const bkgCode = (p.booking?.bookingCode || "").toLowerCase();
        if (!code.includes(q) && !trx.includes(q) && !client.includes(q) && !bkgCode.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [payments, statusFilter, methodFilter, searchText]);

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
          <AlertCircle className="w-3 h-3" /> Refunded
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
            <DollarSign className="w-3.5 h-3.5" /> Agency Financial Accounting
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Earnings & Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit all customer deposits, view platform commission breakdowns, and track net vendor receivables.
          </p>
        </div>

        {decoratorProfile && (
          <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-200/80 dark:border-purple-900/50">
            <Building className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-900 dark:text-slate-100">{decoratorProfile.businessName}</p>
              <p className="text-[11px] text-slate-500">{decoratorProfile.contactInfo?.city || "Dhaka"} • Verified Payout Account</p>
            </div>
          </div>
        )}
      </div>

      {/* ================= Financial Summary Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Receivables */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Net Vendor Receivables
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            ৳{stats.vendorNet.toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            After 10% platform fee & 1.5% gateway charge
          </p>
        </div>

        {/* Gross Volume */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Gross Event Volume
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            ৳{stats.grossVolume.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Across {stats.completedCount} completed payments
          </p>
        </div>

        {/* Platform Commission */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-500" /> Platform Fee (10%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            ৳{stats.platformCommission.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Escrow, client guarantees & support
          </p>
        </div>

        {/* Total Transactions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-purple-500" /> Processed Orders
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.totalTransactions}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            {stats.refunded > 0 ? `৳${stats.refunded.toLocaleString()} refunded` : "0 refund disputes"}
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
              placeholder="Search payment code, TRX, or client..."
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
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Gateway:</span>
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
              <option value="stripe">Stripe</option>
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
        ) : filteredPayments.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Payment Transactions Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No financial records match your current filter settings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Payment Code</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Booking Ref</th>
                  <th className="py-4 px-4">Gateway & TRX ID</th>
                  <th className="py-4 px-4">Gross Amount</th>
                  <th className="py-4 px-4">Platform Fee (10%)</th>
                  <th className="py-4 px-4">Your Receivable</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Invoice</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.map((p) => {
                  const custName = p.customer?.name || p.clientName || "Valued Client";
                  const bkgCode = p.booking?.bookingCode || `BK-${p.bookingId ? p.bookingId.toString().slice(-6).toUpperCase() : "REF"}`;
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
                            {custName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {p.customer?.phone || p.clientEmail || ""}
                          </p>
                        </div>
                      </td>

                      {/* Booking Code */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {bkgCode}
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
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        -৳{commission.toLocaleString()}
                      </td>

                      {/* Net Receivable */}
                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                        ৳{receivable.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(p.status)}
                      </td>

                      {/* Action: Open Invoice */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleOpenReceipt(p._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
                          title="View Official Invoice Dossier"
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
      </div>

      {/* ================= Integration 2: Invoice & Receipt Dossier Modal (GET /payments/id/:id) ================= */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Payment Receipt & Invoice Dossier
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
                  {/* Top Payment Ref Banner */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                        Payment Reference Code
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

                  {/* Customer & Agency Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Paid By Client</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.customer?.name || selectedPayment.clientName || "Valued Client"}
                      </p>
                      <p className="text-[11px] text-slate-500">{selectedPayment.customer?.email || selectedPayment.clientEmail}</p>
                      <p className="text-[11px] text-slate-500">{selectedPayment.customer?.phone || "N/A"}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Beneficiary Agency</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedPayment.decorator?.businessName || decoratorProfile?.businessName || "StyleDecor Verified Agency"}
                      </p>
                      <p className="text-[11px] text-slate-500">City: {selectedPayment.decorator?.contactInfo?.city || "Dhaka"}</p>
                      <p className="text-[11px] text-slate-500">Hotline: {selectedPayment.decorator?.contactInfo?.phone || "N/A"}</p>
                    </div>
                  </div>

                  {/* Linked Booking Overview */}
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

                  {/* Gateway Transaction Details */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                      Gateway Clearing Details
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

                  {/* Financial Breakdown */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                      Payout Accounting Breakdown
                    </h5>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Gross Amount Paid by Client</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">৳{Number(selectedPayment.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Gateway Fee (1.5%)</span>
                      <span>-৳{Number(selectedPayment.breakdown?.gatewayFee || Math.round(selectedPayment.amount * 0.015)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Platform Commission (10.0%)</span>
                      <span>-৳{Number(selectedPayment.breakdown?.platformCommission || Math.round(selectedPayment.amount * 0.10)).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-emerald-600 dark:text-emerald-400">
                      <span>Net Vendor Receivable</span>
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
    </div>
  );
};

export default MyEarnings;
