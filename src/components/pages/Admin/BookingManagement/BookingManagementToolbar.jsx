import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Booking Management with stats and filters (120-150 lines)
const BookingManagementToolbar = ({
  stats,
  statusTab,
  onSelectStatusTab,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  decoratorFilter,
  onDecoratorFilterChange,
  sortFilter,
  onSortFilterChange,
  decoratorsList,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Bookings */}
        <StatCard
          icon={Calendar}
          title="Total Bookings"
          value={stats?.total ?? 0}
          tone="purple"
          active={statusTab === "all"}
          onClick={() => onSelectStatusTab("all")}
          loading={loadingStats}
        />

        {/* Accepted */}
        <StatCard
          icon={CheckCircle2}
          title="Accepted"
          value={stats?.accepted ?? 0}
          tone="indigo"
          active={statusTab === "accepted"}
          onClick={() => onSelectStatusTab("accepted")}
          loading={loadingStats}
        />

        {/* In Progress */}
        <StatCard
          icon={Clock}
          title="In Progress"
          value={stats?.inProgress ?? 0}
          tone="purple"
          active={statusTab === "in_progress"}
          onClick={() => onSelectStatusTab("in_progress")}
          loading={loadingStats}
        />

        {/* Completed */}
        <StatCard
          icon={Sparkles}
          title="Completed"
          value={stats?.completed ?? 0}
          tone="emerald"
          active={statusTab === "completed"}
          onClick={() => onSelectStatusTab("completed")}
          loading={loadingStats}
        />

        {/* Pending */}
        <StatCard
          icon={AlertCircle}
          title="Pending Review"
          value={stats?.pending ?? 0}
          tone="amber"
          active={statusTab === "pending"}
          onClick={() => onSelectStatusTab("pending")}
          loading={loadingStats}
        />
      </div>

      {/* 2. Search & Dropdown Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer name, phone, or booking ID..."
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
            value={statusTab}
            onChange={(e) => onSelectStatusTab(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="advance_paid">Advance Paid</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Decorator Vendor Filter */}
          <select
            value={decoratorFilter}
            onChange={(e) => onDecoratorFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
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
            <option value="event_date">Event Date</option>
            <option value="amount_high">Amount: High to Low</option>
            <option value="amount_low">Amount: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookingManagementToolbar;
