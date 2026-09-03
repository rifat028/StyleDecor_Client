import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Navigation,
  Activity,
  CheckCircle2,
  XCircle,
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
  searchable = false,
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
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

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  // Filter options if searchable
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [options, searchable, searchTerm]);

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
                const isSelected = String(option.value) === String(value);
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
                            ? "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
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

// Consolidated toolbar for Booking Management with stats and filters
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
  decoratorsList = [],
}) => {
  // Status options derived from seed data lifecycle
  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All Statuses", count: stats?.total },
      { value: "preparing", label: "Preparing", count: stats?.preparing },
      {
        value: "out_for_destination",
        label: "Out for Destination",
        count: stats?.out_for_destination ?? stats?.outForDestination,
      },
      {
        value: "in_progress",
        label: "In Progress",
        count: stats?.in_progress ?? stats?.inProgress,
      },
      { value: "completed", label: "Completed", count: stats?.completed },
      { value: "cancelled", label: "Cancelled", count: stats?.cancelled },
    ],
    [stats]
  );

  // Decorator options with search support
  const decoratorOptions = useMemo(() => {
    return [
      { value: "all", label: "All Decorators" },
      ...decoratorsList.map((dec) => ({
        value: String(dec._id),
        label: dec.businessName || dec.name || "Agency Partner",
      })),
    ];
  }, [decoratorsList]);

  // Sort options
  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Newest First" },
      { value: "event_date", label: "Event Date" },
      { value: "amount_high", label: "Amount: High to Low" },
      { value: "amount_low", label: "Amount: Low to High" },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid - 6 Seed Status Lifecycle Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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

        {/* Preparing */}
        <StatCard
          icon={Clock}
          title="Preparing"
          value={stats?.preparing ?? 0}
          tone="amber"
          active={statusTab === "preparing"}
          onClick={() =>
            onSelectStatusTab(statusTab === "preparing" ? "all" : "preparing")
          }
          loading={loadingStats}
        />

        {/* Out for Destination */}
        <StatCard
          icon={Navigation}
          title="Out for Venue"
          value={stats?.out_for_destination ?? stats?.outForDestination ?? 0}
          tone="indigo"
          active={statusTab === "out_for_destination"}
          onClick={() =>
            onSelectStatusTab(
              statusTab === "out_for_destination" ? "all" : "out_for_destination"
            )
          }
          loading={loadingStats}
        />

        {/* In Progress */}
        <StatCard
          icon={Activity}
          title="In Progress"
          value={stats?.in_progress ?? stats?.inProgress ?? 0}
          tone="blue"
          active={statusTab === "in_progress"}
          onClick={() =>
            onSelectStatusTab(
              statusTab === "in_progress" ? "all" : "in_progress"
            )
          }
          loading={loadingStats}
        />

        {/* Completed */}
        <StatCard
          icon={CheckCircle2}
          title="Completed"
          value={stats?.completed ?? 0}
          tone="emerald"
          active={statusTab === "completed"}
          onClick={() =>
            onSelectStatusTab(statusTab === "completed" ? "all" : "completed")
          }
          loading={loadingStats}
        />

        {/* Cancelled */}
        <StatCard
          icon={XCircle}
          title="Cancelled"
          value={stats?.cancelled ?? 0}
          tone="rose"
          active={statusTab === "cancelled"}
          onClick={() =>
            onSelectStatusTab(statusTab === "cancelled" ? "all" : "cancelled")
          }
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
            value={statusTab}
            onChange={onSelectStatusTab}
            options={statusOptions}
            placeholder="All Statuses"
            minWidth="w-full sm:w-48"
            searchable={false}
          />

          {/* Decorator Vendor Filter Dropdown with Search */}
          <FilterDropdown
            value={decoratorFilter}
            onChange={onDecoratorFilterChange}
            options={decoratorOptions}
            placeholder="All Decorators"
            minWidth="w-full sm:w-48"
            searchable={true}
            searchPlaceholder="Search decorators..."
          />

          {/* Sort Filter Dropdown */}
          <FilterDropdown
            value={sortFilter}
            onChange={onSortFilterChange}
            options={sortOptions}
            placeholder="Sort by"
            minWidth="w-full sm:w-40"
            searchable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingManagementToolbar;
