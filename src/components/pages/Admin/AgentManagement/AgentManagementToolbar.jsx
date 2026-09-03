import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  Activity,
  UserX,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Custom Filter Dropdown styled identically to Admin -> Users page dropdown
const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  minWidth = "min-w-[170px]",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer shadow-2xs"
      >
        <span className="truncate flex items-center gap-1.5 min-w-0">
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption && selectedOption.count !== undefined && (
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-sm shrink-0 border border-purple-200/60 dark:border-purple-800/60">
              {selectedOption.count}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-purple-600 dark:text-purple-400" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-full min-w-[200px] max-h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          <div className="overflow-y-auto py-1 max-h-56 scrollbar-thin">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate pr-2">
                    <Check
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected
                          ? "text-purple-600 dark:text-purple-400 opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  {option.count !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 tabular-nums ${
                        isSelected
                          ? "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Consolidated toolbar for Agent Management with stats and filters
const AgentManagementToolbar = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  territoryFilter,
  onTerritoryFilterChange,
  territoriesList = [],
}) => {
  const statusOptions = [
    { value: "all", label: "All Statuses", count: stats?.totalAgents },
    { value: "available", label: "Available", count: stats?.availableCount },
    { value: "assigned", label: "Assigned", count: stats?.onAssignmentCount ?? stats?.assignedCount },
    { value: "suspended", label: "Suspended", count: stats?.suspendedCount },
  ];

  const territoryOptions = territoriesList.map((t) => ({
    value: t,
    label: t === "all" ? "All Territories" : t,
  }));

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
          onClick={() => onSelectStatusFilter(statusFilter === "available" ? "all" : "available")}
          loading={loadingStats}
        />

        {/* Assigned */}
        <StatCard
          icon={Activity}
          title="Assigned"
          value={stats?.onAssignmentCount ?? stats?.assignedCount ?? 0}
          tone="indigo"
          active={statusFilter === "assigned" || statusFilter === "on_assignment"}
          onClick={() => onSelectStatusFilter(statusFilter === "assigned" || statusFilter === "on_assignment" ? "all" : "assigned")}
          loading={loadingStats}
        />

        {/* Suspended */}
        <StatCard
          icon={UserX}
          title="Suspended"
          value={stats?.suspendedCount ?? 0}
          tone="rose"
          active={statusFilter === "suspended"}
          onClick={() => onSelectStatusFilter(statusFilter === "suspended" ? "all" : "suspended")}
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
            className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
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

        {/* Custom Styled Dropdowns on Right matching Admin -> Users */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Status Filter Dropdown */}
          <FilterDropdown
            value={statusFilter}
            onChange={onSelectStatusFilter}
            options={statusOptions}
            placeholder="All Statuses"
            minWidth="w-full sm:w-44"
          />

          {/* Territory / Division Filter Dropdown */}
          <FilterDropdown
            value={territoryFilter}
            onChange={onTerritoryFilterChange}
            options={territoryOptions}
            placeholder="All Territories"
            minWidth="w-full sm:w-44"
          />
        </div>
      </div>
    </div>
  );
};

export default AgentManagementToolbar;
