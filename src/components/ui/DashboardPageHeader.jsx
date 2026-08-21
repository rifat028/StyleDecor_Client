import React from "react";
import { RefreshCw } from "lucide-react";

/**
 * Standardized Dashboard Page Header Component
 *
 * @param {React.ElementType} [icon] - Lucide Icon component for the left purple badge
 * @param {string} title - Main header title (text-2xl sm:text-3xl font-bold)
 * @param {string} [subtitle] - Optional descriptive subtitle
 * @param {Function} [onRefresh] - Optional callback to render the standard Refresh Data button
 * @param {boolean} [refreshing=false] - Loading state for the Refresh button
 * @param {boolean} [refreshDisabled=false] - Disabled state for the Refresh button
 * @param {React.ReactNode} [actions] - Custom action buttons (e.g. "Book New Service", "Create Category", "Add Project")
 * @param {React.ReactNode} [children] - Fallback slot for custom action elements
 */
const DashboardPageHeader = ({
  icon: Icon,
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  refreshDisabled = false,
  actions,
  children,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Icon Box & Title/Subtitle */}
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Refresh Button & Custom Action Slots */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshDisabled || refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              <span>Refresh Data</span>
            </button>
          )}

          {/* Any custom buttons */}
          {actions || children}
        </div>
      </div>

      {/* Tapered bottom border line (Thicker & solid in center, tapering & transparent at corners) */}
      <div className="h-[3px] w-full rounded-full bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
    </div>
  );
};

export default DashboardPageHeader;
