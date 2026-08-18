import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

const STATUS_FILTER_OPTIONS = [
  { id: "all", label: "All Bookings" },
  { id: "confirmed", label: "Confirmed / Active" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending Review" },
  { id: "cancelled", label: "Cancelled / Rejected" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "eventDate_asc", label: "Event Date: Earliest First" },
  { id: "eventDate_desc", label: "Event Date: Latest First" },
  { id: "amount_desc", label: "Amount: High to Low" },
  { id: "amount_asc", label: "Amount: Low to High" },
];

// Toolbar for customer My Bookings page with stat cards, search, and status/sort filters
const MyBookingsToolbar = ({
  stats,
  statusTab,
  onSelectStatusTab,
  loadingStats = false,
  searchText,
  onSearchChange,
  onClearSearch,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

        {/* Confirmed / Active */}
        <StatCard
          icon={Clock}
          title="Confirmed / Active"
          value={stats?.confirmed ?? 0}
          tone="purple"
          active={statusTab === "confirmed"}
          onClick={() => onSelectStatusTab("confirmed")}
          loading={loadingStats}
        />

        {/* Completed Events */}
        <StatCard
          icon={CheckCircle2}
          title="Completed Events"
          value={stats?.completed ?? 0}
          tone="emerald"
          active={statusTab === "completed"}
          onClick={() => onSelectStatusTab("completed")}
          loading={loadingStats}
        />

        {/* Pending / Awaiting */}
        <StatCard
          icon={AlertCircle}
          title="Awaiting Review"
          value={stats?.pending ?? 0}
          tone="amber"
          active={statusTab === "pending"}
          onClick={() => onSelectStatusTab("pending")}
          loading={loadingStats}
        />
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search code, service, agency, or venue..."
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

        {/* Clean Dropdowns on Right */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <select
            value={statusTab}
            onChange={(e) => onSelectStatusTab(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort By Filter */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsToolbar;
