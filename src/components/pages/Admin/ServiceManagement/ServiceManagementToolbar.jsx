import React from "react";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Service Management with stats and filters (120-150 lines)
const ServiceManagementToolbar = ({
  stats,
  statusTab,
  onSelectStatusTab,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  categoryFilter,
  onCategoryFilterChange,
  decoratorFilter,
  onDecoratorFilterChange,
  sortFilter,
  onSortFilterChange,
  categoriesList,
  decoratorsList,
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
          active={statusTab === "all"}
          onClick={() => onSelectStatusTab("all")}
          loading={loadingStats}
        />

        {/* Active Packages */}
        <StatCard
          icon={CheckCircle2}
          title="Active"
          value={stats?.active ?? 0}
          tone="emerald"
          active={statusTab === "active"}
          onClick={() => onSelectStatusTab("active")}
          loading={loadingStats}
        />

        {/* Inactive Packages */}
        <StatCard
          icon={XCircle}
          title="Inactive"
          value={stats?.inactive ?? 0}
          tone="rose"
          active={statusTab === "inactive"}
          onClick={() => onSelectStatusTab("inactive")}
          loading={loadingStats}
        />

        {/* Featured Highlights */}
        <StatCard
          icon={Sparkles}
          title="Featured"
          value={stats?.featured ?? 0}
          tone="amber"
          active={statusTab === "featured"}
          onClick={() => onSelectStatusTab("featured")}
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
            placeholder="Search by package name or keyword..."
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
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Decorator Agency Filter */}
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
            <option value="newest">Newest Listed</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagementToolbar;
