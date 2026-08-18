import React from "react";
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

const STATUS_OPTIONS = [
  { id: "all", label: "All Projects" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "advance_paid", label: "Advance Paid" },
  { id: "preparing", label: "Preparing" },
  { id: "on_the_way", label: "On The Way" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "fully_paid", label: "Fully Paid" },
  { id: "rejected", label: "Rejected" },
];

// Toolbar for My Projects page containing stat cards, search, and status filters
const MyProjectsToolbar = ({
  stats,
  statusTab,
  onSelectStatusTab,
  loadingStats = false,
  searchText,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Projects */}
        <StatCard
          icon={Layers}
          title="Total Projects"
          value={stats?.total ?? 0}
          tone="purple"
          active={statusTab === "all"}
          onClick={() => onSelectStatusTab("all")}
          loading={loadingStats}
        />

        {/* Active / In Progress */}
        <StatCard
          icon={Clock}
          title="Active / Execution"
          value={stats?.active ?? 0}
          tone="purple"
          active={statusTab === "active_group"}
          onClick={() => onSelectStatusTab("active_group")}
          loading={loadingStats}
        />

        {/* Completed / Settled */}
        <StatCard
          icon={CheckCircle2}
          title="Completed & Paid"
          value={stats?.completed ?? 0}
          tone="emerald"
          active={statusTab === "completed_group"}
          onClick={() => onSelectStatusTab("completed_group")}
          loading={loadingStats}
        />

        {/* Awaiting Action / Pending */}
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
            placeholder="Search code, service, customer, or venue..."
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

        {/* Status Dropdown Selector on Right */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusTab}
            onChange={(e) => onSelectStatusTab(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
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

export default MyProjectsToolbar;
