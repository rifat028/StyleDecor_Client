import React, { useState } from "react";
import { Calendar, Filter, RefreshCw, ChevronDown, Check } from "lucide-react";

const TIME_FILTER_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last 7 days", label: "Last 7 Days" },
  { id: "this week", label: "This Week" },
  { id: "last 30 days", label: "Last 30 Days" },
  { id: "this month", label: "This Month" },
  { id: "last 365 days", label: "Last 365 Days" },
  { id: "this year", label: "This Year" },
  { id: "max", label: "Max (All Time)" },
  { id: "custom", label: "Custom Date Range" },
];

const DashboardTimeFilter = ({
  timeFilter = "max",
  onTimeFilterChange,
  startDate = "",
  endDate = "",
  onCustomDateChange,
  onRefresh,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const selectedOption =
    TIME_FILTER_OPTIONS.find((opt) => opt.id === timeFilter) ||
    TIME_FILTER_OPTIONS.find((opt) => opt.id === "max");

  const handleSelectOption = (optId) => {
    setIsOpen(false);
    if (optId === "custom") {
      setShowCustomModal(true);
    } else {
      onTimeFilterChange(optId);
    }
  };

  const handleApplyCustomDate = (e) => {
    e.preventDefault();
    if (tempStart) {
      onCustomDateChange(tempStart, tempEnd || tempStart);
      onTimeFilterChange("custom");
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Refresh Data Button */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
        title="Refresh live dashboard data"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${
            loading ? "animate-spin" : ""
          }`}
        />
        <span className="hidden sm:inline">Refresh</span>
      </button>

      {/* Time Filter Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100/70 dark:hover:bg-purple-950/60 shadow-2xs transition-all cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="max-w-32.5 truncate">
            {timeFilter === "custom" && startDate
              ? `${startDate} → ${endDate || "Now"}`
              : selectedOption.label}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Filter className="w-3 h-3 text-purple-500" />
                <span>Time Period Filter</span>
              </div>
              <div className="py-1 max-h-64 overflow-y-auto">
                {TIME_FILTER_OPTIONS.map((option) => {
                  const isSelected = timeFilter === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Select Custom Date Range</span>
              </h4>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCustomDate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTimeFilter;
