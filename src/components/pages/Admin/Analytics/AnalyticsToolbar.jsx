import React from "react";
import {
  DollarSign,
  TrendingUp,
  Award,
  RotateCcw,
  Calendar,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Platform Analytics with stats and period selector (110-140 lines)
const AnalyticsToolbar = ({
  stats,
  timeframe,
  onTimeframeChange,
  loadingStats = false,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Gross Escrow Volume */}
        <StatCard
          icon={DollarSign}
          title="Gross Escrow Volume"
          value={`৳${Number(stats?.totalVolume || 0).toLocaleString()}`}
          tone="purple"
          loading={loadingStats}
        />

        {/* Platform Commissions */}
        <StatCard
          icon={Award}
          title="Platform Commission"
          value={`৳${Number(stats?.platformCommission || 0).toLocaleString()}`}
          tone="emerald"
          loading={loadingStats}
        />

        {/* Vendor Receivables */}
        <StatCard
          icon={TrendingUp}
          title="Vendor Payables"
          value={`৳${Number(stats?.vendorReceivables || 0).toLocaleString()}`}
          tone="indigo"
          loading={loadingStats}
        />

        {/* Dispute Refunds */}
        <StatCard
          icon={RotateCcw}
          title="Dispute Refunds"
          value={`৳${Number(stats?.totalRefunded || 0).toLocaleString()}`}
          tone="rose"
          loading={loadingStats}
        />
      </div>

      {/* 2. Timeframe Filter Selector */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Analytics Reporting Scope
          </span>
        </div>

        <div className="flex items-center gap-2">
          {["all", "30d", "90d", "year"].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => onTimeframeChange(period)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === period
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {period === "all"
                ? "All Time"
                : period === "30d"
                ? "Last 30 Days"
                : period === "90d"
                ? "Last 90 Days"
                : "This Year"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsToolbar;
