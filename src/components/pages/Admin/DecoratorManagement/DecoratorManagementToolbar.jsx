import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Building,
  CheckCircle2,
  Clock,
  Ban,
  Search,
  X,
  Star,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";
import { BANGLADESH_DIVISIONS } from "../../../../lib/constants";

// Custom Filter Dropdown matching Admin->Users page design and behavior
const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  minWidth = "min-w-[170px]",
  searchable = false,
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside and reset search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options by search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const lower = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [options, searchTerm]);

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
        <div className="absolute right-0 mt-1.5 w-full min-w-[210px] max-h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1.5 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      setSearchTerm("");
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchTerm("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="overflow-y-auto py-1 max-h-56 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching results
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm("");
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
                            ? "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-300/60 dark:border-purple-700/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {option.count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Consolidated toolbar for Decorator Management with stats and custom filters
const DecoratorManagementToolbar = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  divisionFilter,
  onDivisionFilterChange,
  sortFilter,
  onSortFilterChange,
  divisionsList = BANGLADESH_DIVISIONS,
}) => {
  // Status filter options with real-time stats
  const statusOptions = [
    { value: "all", label: "All Statuses", count: stats?.total ?? 0 },
    { value: "active", label: "Active Agencies", count: stats?.active ?? 0 },
    { value: "verified", label: "Verified Partners", count: stats?.verified ?? 0 },
    { value: "pending", label: "Pending Approval", count: stats?.pending ?? 0 },
    { value: "suspended", label: "Suspended", count: stats?.suspended ?? 0 },
    { value: "featured", label: "Featured Partners", count: stats?.featured ?? 0 },
  ];

  // Helper to count agencies by division with status awareness
  const getDivisionCount = (division, status = statusFilter) => {
    if (!stats) return 0;
    if (status && status !== "all") {
      if (stats.byStatus && stats.byStatus[status]?.divisions) {
        const targetDivisions = stats.byStatus[status].divisions;
        const key = Object.keys(targetDivisions).find(
          (k) => k.toLowerCase().trim() === division.toLowerCase().trim()
        );
        return key ? targetDivisions[key] : 0;
      }
      return 0;
    }
    // Overall total across all statuses
    if (!stats.byDivision) return 0;
    const found = stats.byDivision.find(
      (d) => d._id?.toLowerCase().trim() === division.toLowerCase().trim()
    );
    return found ? found.count : 0;
  };

  // Compute total count for "All Divisions" based on selected statusFilter
  const allDivisionsCount = useMemo(() => {
    if (!statusFilter || statusFilter === "all") return stats?.total ?? 0;
    if (statusFilter === "active") return stats?.active ?? 0;
    if (statusFilter === "verified") return stats?.verified ?? 0;
    if (statusFilter === "pending") return stats?.pending ?? 0;
    if (statusFilter === "suspended") return stats?.suspended ?? 0;
    if (statusFilter === "featured") return stats?.featured ?? 0;
    return stats?.total ?? 0;
  }, [statusFilter, stats]);

  // Division filter options with live count matching selected status
  const divisionOptions = useMemo(() => {
    return [
      { value: "all", label: "All Divisions", count: allDivisionsCount },
      ...divisionsList.map((div) => ({
        value: div,
        label: div,
        count: getDivisionCount(div, statusFilter),
      })),
    ];
  }, [divisionsList, allDivisionsCount, statusFilter, stats]);

  // Sort options
  const sortOptions = [
    { value: "rating", label: "Highest Rating" },
    { value: "experience", label: "Most Experience" },
    { value: "projects", label: "Most Projects" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Agencies */}
        <StatCard
          icon={Building}
          title="Total Decorators"
          value={stats?.total ?? 0}
          tone="purple"
          active={statusFilter === "all"}
          onClick={() => onSelectStatusFilter("all")}
          loading={loadingStats}
        />

        {/* Verified Partners (2nd Position) */}
        <StatCard
          icon={ShieldCheck}
          title="Verified Partners"
          value={stats?.verified ?? 0}
          tone="blue"
          active={statusFilter === "verified"}
          onClick={() => onSelectStatusFilter("verified")}
          loading={loadingStats}
        />

        {/* Active Agencies */}
        <StatCard
          icon={CheckCircle2}
          title="Active Agencies"
          value={stats?.active ?? 0}
          tone="emerald"
          active={statusFilter === "active"}
          onClick={() => onSelectStatusFilter("active")}
          loading={loadingStats}
        />

        {/* Pending Approval */}
        <StatCard
          icon={Clock}
          title="Pending Approval"
          value={stats?.pending ?? 0}
          tone="amber"
          active={statusFilter === "pending"}
          onClick={() => onSelectStatusFilter("pending")}
          loading={loadingStats}
        />

        {/* Suspended */}
        <StatCard
          icon={Ban}
          title="Suspended"
          value={stats?.suspended ?? 0}
          tone="rose"
          active={statusFilter === "suspended"}
          onClick={() => onSelectStatusFilter("suspended")}
          loading={loadingStats}
        />

        {/* Featured Agencies (Rightmost) */}
        <StatCard
          icon={Star}
          title="Featured Partners"
          value={stats?.featured ?? 0}
          tone="indigo"
          active={statusFilter === "featured"}
          onClick={() => onSelectStatusFilter("featured")}
          loading={loadingStats}
        />
      </div>

      {/* 2. Search & Dropdown Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
        <div className="relative w-full md:max-w-xs lg:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by agency name, phone, email..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Custom Styled Filter Dropdowns matching Admin->Users page */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap justify-end">
          {/* Status Dropdown */}
          <FilterDropdown
            value={statusFilter}
            onChange={onSelectStatusFilter}
            options={statusOptions}
            placeholder="Status"
            minWidth="min-w-[170px]"
          />

          {/* Division Dropdown */}
          <FilterDropdown
            value={divisionFilter}
            onChange={onDivisionFilterChange}
            options={divisionOptions}
            placeholder="All Divisions"
            minWidth="min-w-[170px]"
            searchable={true}
            searchPlaceholder="Search division..."
          />

          {/* Sort Dropdown */}
          <FilterDropdown
            value={sortFilter}
            onChange={onSortFilterChange}
            options={sortOptions}
            placeholder="Sort by"
            minWidth="min-w-[160px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DecoratorManagementToolbar;
