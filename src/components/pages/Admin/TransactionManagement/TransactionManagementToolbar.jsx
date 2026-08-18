import React from "react";
import {
  DollarSign,
  CheckCircle2,
  RotateCcw,
  CreditCard,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Transaction Management with stats and filters (120-150 lines)
const TransactionManagementToolbar = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  methodFilter,
  onMethodFilterChange,
  decoratorFilter,
  onDecoratorFilterChange,
  sortFilter,
  onSortFilterChange,
  decoratorsList,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Transactions */}
        <StatCard
          icon={DollarSign}
          title="Total Transactions"
          value={stats?.total ?? 0}
          tone="purple"
          active={statusFilter === "all"}
          onClick={() => onSelectStatusFilter("all")}
          loading={loadingStats}
        />

        {/* Completed Payments */}
        <StatCard
          icon={CheckCircle2}
          title="Completed"
          value={stats?.completed ?? 0}
          tone="emerald"
          active={statusFilter === "completed"}
          onClick={() => onSelectStatusFilter("completed")}
          loading={loadingStats}
        />

        {/* Refunded */}
        <StatCard
          icon={RotateCcw}
          title="Refunded"
          value={stats?.refunded ?? 0}
          tone="rose"
          active={statusFilter === "refunded"}
          onClick={() => onSelectStatusFilter("refunded")}
          loading={loadingStats}
        />

        {/* Total Processed Volume */}
        <StatCard
          icon={CreditCard}
          title="Gross Volume"
          value={`৳${Number(stats?.volume || 0).toLocaleString()}`}
          tone="indigo"
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
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search payment code, TRX ID, or customer..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          {search && (
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
            onChange={(e) => onSelectStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Gateway Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => onMethodFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Gateways</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="sslcommerz">SSLCommerz</option>
            <option value="stripe">Stripe</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          {/* Decorator Agency Filter */}
          <select
            value={decoratorFilter}
            onChange={(e) => onDecoratorFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all truncate"
          >
            <option value="all">All Decorators</option>
            {decoratorsList.map((dec) => (
              <option key={dec._id} value={dec._id}>
                {dec.businessName || dec.name}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={sortFilter}
            onChange={(e) => onSortFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="amount_high">Amount: High to Low</option>
            <option value="amount_low">Amount: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagementToolbar;
