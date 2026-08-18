import React from "react";
import {
  CreditCard,
  CheckCircle2,
  RotateCcw,
  Sparkles,
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

// Toolbar for customer Payment History page with stat cards, search, and gateway filters
const CustomerTransactionsToolbar = ({
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
        {/* Total Paid Amount */}
        <StatCard
          icon={Sparkles}
          title="Total Paid"
          value={`৳${(stats?.totalSpent ?? 0).toLocaleString()}`}
          tone="purple"
          loading={loadingStats}
        />

        {/* Settled Invoices */}
        <StatCard
          icon={CheckCircle2}
          title="Settled Invoices"
          value={stats?.completedCount ?? 0}
          tone="emerald"
          active={statusFilter === "completed"}
          onClick={() =>
            onStatusFilterChange(
              statusFilter === "completed" ? "all" : "completed"
            )
          }
          loading={loadingStats}
        />

        {/* Refunded / Returned */}
        <StatCard
          icon={RotateCcw}
          title="Refunded"
          value={`৳${(stats?.refundedAmt ?? 0).toLocaleString()}`}
          tone="rose"
          active={statusFilter === "refunded"}
          onClick={() =>
            onStatusFilterChange(
              statusFilter === "refunded" ? "all" : "refunded"
            )
          }
          loading={loadingStats}
        />

        {/* Total Transactions */}
        <StatCard
          icon={CreditCard}
          title="Total Orders"
          value={stats?.totalCount ?? 0}
          tone="amber"
          active={statusFilter === "all"}
          onClick={() => onStatusFilterChange("all")}
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
            placeholder="Search receipt code, TRX ID, or service..."
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
            <option value="all">All Invoices</option>
            <option value="completed">Completed / Paid</option>
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

export default CustomerTransactionsToolbar;
