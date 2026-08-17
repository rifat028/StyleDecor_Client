import React from "react";
import {
  Layers,
  CheckCircle2,
  XCircle,
  ListTree,
  Search,
  X,
  ChevronsUpDown,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Category Management with stats and filters (120-150 lines)
const CategoryManagementToolbar = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  areAllExpanded,
  onToggleExpandAll,
  categoriesCount,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Categories */}
        <StatCard
          icon={Layers}
          title="Total Categories"
          value={stats?.totalCategories ?? 0}
          tone="purple"
          active={statusFilter === "all"}
          onClick={() => onSelectStatusFilter("all")}
          loading={loadingStats}
        />

        {/* Active Categories */}
        <StatCard
          icon={CheckCircle2}
          title="Active"
          value={stats?.activeCategories ?? 0}
          tone="emerald"
          active={statusFilter === "active"}
          onClick={() => onSelectStatusFilter("active")}
          loading={loadingStats}
        />

        {/* Inactive Categories */}
        <StatCard
          icon={XCircle}
          title="Inactive"
          value={stats?.inactiveCategories ?? 0}
          tone="rose"
          active={statusFilter === "inactive"}
          onClick={() => onSelectStatusFilter("inactive")}
          loading={loadingStats}
        />

        {/* Total Subcategories */}
        <StatCard
          icon={ListTree}
          title="Subcategories"
          value={stats?.totalSubCategories ?? 0}
          tone="indigo"
          loading={loadingStats}
        />
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search categories or subcategories..."
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

        {/* Right Controls: Status Filter and Expand/Collapse All */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => onSelectStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Expand / Collapse All Toggle Button */}
          {categoriesCount > 0 && (
            <button
              type="button"
              onClick={onToggleExpandAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <ChevronsUpDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{areAllExpanded ? "Collapse All" : "Expand All"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementToolbar;
