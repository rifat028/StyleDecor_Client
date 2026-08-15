import React, { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  Award,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  PieChart as PieIcon,
  BarChart3,
  Star,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const [paymentStats, setPaymentStats] = useState(null);
  const [reviewStats, setReviewStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Integration: GET /payments/stats (Live Platform Financial & Revenue KPIs)
  const loadPaymentStats = async () => {
    try {
      const res = await axiosSecure.get("/payments/stats");
      if (res.data?.success) {
        setPaymentStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Failed to load payment statistics:", err);
    }
  };

  // 2. Integration: GET /reviews?limit=1 (Platform Review Stats)
  const loadReviewStats = async () => {
    try {
      const res = await axiosSecure.get("/reviews?limit=1");
      if (res.data?.success) {
        setReviewStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Failed to load review statistics:", err);
    }
  };

  // 3. Fetch all bookings for demand charts
  const fetchAllBookings = async () => {
    try {
      const res = await axiosSecure.get("/bookings?limit=150");
      const list = res.data?.data || res.data || [];
      setAllBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Failed to load bookings for demand:", err);
      setAllBookings([]);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([loadPaymentStats(), loadReviewStats(), fetchAllBookings()]);
      setLoading(false);
    };
    initData();
  }, [axiosSecure]);

  // Category Demand Chart Data
  const demandChartData = useMemo(() => {
    const map = {};
    allBookings.forEach((b) => {
      const cat = b.serviceSnapshot?.category || b.serviceCategory || "General Decoration";
      map[cat] = (map[cat] || 0) + 1;
    });

    return Object.entries(map).map(([category, count]) => ({
      category,
      count,
    }));
  }, [allBookings]);

  // Status Distribution Chart Data
  const statusChartData = useMemo(() => {
    const map = {};
    allBookings.forEach((b) => {
      const st = (b.status || "pending").replace(/_/g, " ");
      map[st] = (map[st] || 0) + 1;
    });

    return Object.entries(map).map(([status, value]) => ({
      name: status.toUpperCase(),
      value,
    }));
  }, [allBookings]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const stats = paymentStats || {
    totalVolume: 0,
    platformCommission: 0,
    vendorReceivables: 0,
    gatewayFees: 0,
    totalRefunded: 0,
    completedTransactionsCount: 0,
    totalTransactionsCount: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Platform Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Financial & Booking Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time revenue monitoring, 10% platform marketplace commission aggregation, vendor payout accounting, and category demand.
          </p>
        </div>
      </div>

      {/* ================= Financial Summary Cards (GET /payments/stats) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platform Revenue */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Platform Revenue (10%)
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            ৳{Number(stats.platformCommission).toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Net marketplace commission earned
          </p>
        </div>

        {/* Total GMV */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Gross Event GMV
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            ৳{Number(stats.totalVolume).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Across {stats.completedTransactionsCount} cleared transactions
          </p>
        </div>

        {/* Vendor Payouts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-indigo-500" /> Vendor Payouts
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            ৳{Number(stats.vendorReceivables).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Net payable to decorator agencies (88.5%)
          </p>
        </div>

        {/* Total Refunds */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" /> Processed Refunds
          </span>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            ৳{Number(stats.totalRefunded).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Dispute settlements & cancellations
          </p>
        </div>
      </div>

      {/* ================= Platform Quality & Reputation Strip (GET /reviews) ================= */}
      {reviewStats && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Platform Rating
            </span>
            <p className="text-xl sm:text-2xl font-black text-amber-500">
              {reviewStats.averageRating} / 5.0
            </p>
            <p className="text-[10px] text-slate-400">Weighted average rating</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Total Feedback
            </span>
            <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
              {reviewStats.totalReviews}
            </p>
            <p className="text-[10px] text-slate-400">Verified customer reviews</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Published Reviews
            </span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {reviewStats.publishedCount}
            </p>
            <p className="text-[10px] text-slate-400">Active public testimonials</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Vendor Response Rate
            </span>
            <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {reviewStats.totalReviews > 0
                ? `${Math.round(((reviewStats.repliedCount || 0) / reviewStats.totalReviews) * 100)}%`
                : "100%"}
            </p>
            <p className="text-[10px] text-slate-400">Official decorator engagement</p>
          </div>
        </div>
      )}

      {/* ================= Charts Section ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Demand Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Service Demand by Category
              </h3>
              <p className="text-xs text-slate-400">
                Total event reservation volume across decoration categories
              </p>
            </div>
            <Layers className="w-5 h-5 text-purple-500" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Lifecycle Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Booking Lifecycle Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Distribution of orders across all operational stages
              </p>
            </div>
            <PieIcon className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
