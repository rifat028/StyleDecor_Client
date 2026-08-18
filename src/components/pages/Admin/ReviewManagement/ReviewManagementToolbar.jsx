import React from "react";
import {
  MessageSquare,
  CheckCircle2,
  EyeOff,
  AlertTriangle,
  Search,
  X,
  Star,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Review Management with stats and filters (120-150 lines)
const ReviewManagementToolbar = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  starFilter,
  onStarFilterChange,
  sortFilter,
  onSortFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Reviews */}
        <StatCard
          icon={MessageSquare}
          title="Total Reviews"
          value={stats?.totalReviews ?? 0}
          tone="purple"
          active={statusFilter === "all"}
          onClick={() => onSelectStatusFilter("all")}
          loading={loadingStats}
        />

        {/* Published */}
        <StatCard
          icon={CheckCircle2}
          title="Published"
          value={stats?.publishedCount ?? 0}
          tone="emerald"
          active={statusFilter === "published"}
          onClick={() => onSelectStatusFilter("published")}
          loading={loadingStats}
        />

        {/* Hidden */}
        <StatCard
          icon={EyeOff}
          title="Hidden / Suppressed"
          value={stats?.hiddenCount ?? 0}
          tone="rose"
          active={statusFilter === "hidden"}
          onClick={() => onSelectStatusFilter("hidden")}
          loading={loadingStats}
        />

        {/* Flagged */}
        <StatCard
          icon={AlertTriangle}
          title="Flagged Disputes"
          value={stats?.flaggedCount ?? 0}
          tone="amber"
          active={statusFilter === "flagged"}
          onClick={() => onSelectStatusFilter("flagged")}
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
            placeholder="Search review comments, customers, or services..."
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
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="flagged">Flagged</option>
          </select>

          {/* Star Rating Filter */}
          <select
            value={starFilter}
            onChange={(e) => onStarFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars & Above</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star Only</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortFilter}
            onChange={(e) => onSortFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="highest_rating">Highest Rating</option>
            <option value="lowest_rating">Lowest Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagementToolbar;
