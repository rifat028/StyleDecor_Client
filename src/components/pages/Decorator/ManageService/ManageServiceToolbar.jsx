import React from "react";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Star,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Decorator Service Management with stats and filters
const ManageServiceToolbar = ({
  myDecorator,
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  searchText,
  onSearchChange,
  onClearSearch,
  selectedCategory,
  onCategoryChange,
  categoriesList,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Packages */}
        <StatCard
          icon={Layers}
          title="Total Packages"
          value={stats?.total ?? 0}
          tone="purple"
          active={statusFilter === "all"}
          onClick={() => onSelectStatusFilter("all")}
          loading={loadingStats}
        />

        {/* Active Packages */}
        <StatCard
          icon={CheckCircle2}
          title="Active"
          value={stats?.active ?? 0}
          tone="emerald"
          active={statusFilter === "active"}
          onClick={() => onSelectStatusFilter("active")}
          loading={loadingStats}
        />

        {/* Paused / Drafts */}
        <StatCard
          icon={XCircle}
          title="Paused / Drafts"
          value={stats?.inactive ?? 0}
          tone="rose"
          active={statusFilter === "inactive"}
          onClick={() => onSelectStatusFilter("inactive")}
          loading={loadingStats}
        />

        {/* Agency Rating */}
        <StatCard
          icon={Star}
          title="Agency Rating"
          value={`★ ${Number(myDecorator?.metrics?.rating || 5.0).toFixed(1)}`}
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
            placeholder="Search your packages by title or keyword..."
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
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onSelectStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Paused Only</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="newest">Newest Listed</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ManageServiceToolbar;
