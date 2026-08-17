import React from "react";
import {
  Users,
  CheckCircle2,
  Activity,
  UserX,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar for Agent Management with stats and filters (120-150 lines)
const AgentManagementToolbar = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  cityFilter,
  onCityFilterChange,
  citiesList,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Agents */}
        <StatCard
          icon={Users}
          title="Total Field Crew"
          value={stats?.totalAgents ?? 0}
          tone="purple"
          active={statusFilter === "all"}
          onClick={() => onSelectStatusFilter("all")}
          loading={loadingStats}
        />

        {/* Available */}
        <StatCard
          icon={CheckCircle2}
          title="Available"
          value={stats?.availableCount ?? 0}
          tone="emerald"
          active={statusFilter === "available"}
          onClick={() => onSelectStatusFilter("available")}
          loading={loadingStats}
        />

        {/* On Assignment */}
        <StatCard
          icon={Activity}
          title="On Assignment"
          value={stats?.onAssignmentCount ?? 0}
          tone="indigo"
          active={statusFilter === "on_assignment"}
          onClick={() => onSelectStatusFilter("on_assignment")}
          loading={loadingStats}
        />

        {/* Suspended */}
        <StatCard
          icon={UserX}
          title="Suspended"
          value={stats?.suspendedCount ?? 0}
          tone="rose"
          active={statusFilter === "suspended"}
          onClick={() => onSelectStatusFilter("suspended")}
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
            placeholder="Search by specialist name, email, phone..."
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
            <option value="available">Available</option>
            <option value="on_assignment">On Assignment</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* City / Territory Filter */}
          <select
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            {citiesList.map((city) => (
              <option key={city} value={city}>
                {city === "all" ? "All Territories" : `Territory: ${city}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AgentManagementToolbar;
