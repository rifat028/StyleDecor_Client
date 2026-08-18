import React from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  CreditCard,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

const GATEWAY_OPTIONS = [
  { id: "all", label: "All Gateways" },
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "sslcommerz", label: "SSLCommerz" },
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "stripe", label: "Stripe Card" },
];

// Toolbar for My Earnings page with metric stat cards, search, and gateway filters
const MyEarningsToolbar = ({
  stats,
  statusFilter,
  onStatusFilterChange,
  methodFilter,
  onMethodFilterChange,
  loadingStats = false,
  searchText,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Net Vendor Receivables */}
        <StatCard
          icon={Sparkles}
          title="Net Receivables"
          value={`৳${(stats?.vendorNet ?? 0).toLocaleString()}`}
          tone="emerald"
          loading={loadingStats}
        />

        {/* Gross Volume */}
        <StatCard
          icon={TrendingUp}
          title="Gross Volume"
          value={`৳${(stats?.grossVolume ?? 0).toLocaleString()}`}
          tone="purple"
          loading={loadingStats}
        />

        {/* Platform Commission */}
        <StatCard
          icon={Award}
          title="Platform Fee (10%)"
          value={`৳${(stats?.platformCommission ?? 0).toLocaleString()}`}
          tone="indigo"
          loading={loadingStats}
        />

        {/* Processed Transactions */}
        <StatCard
          icon={CreditCard}
          title="Processed Orders"
          value={stats?.totalTransactions ?? 0}
          tone="amber"
          loading={loadingStats}
        />
      </div>

      {/* 2. Search & Multi-Dropdown Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search payment code, TRX ID, or client..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          {searchText && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Dropdowns on Right (No redundant filter icons) */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Payment Method / Gateway Filter */}
          <select
            value={methodFilter}
            onChange={(e) => onMethodFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            {GATEWAY_OPTIONS.map((gw) => (
              <option key={gw.id} value={gw.id}>
                {gw.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MyEarningsToolbar;
