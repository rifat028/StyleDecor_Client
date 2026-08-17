import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Reusable 3-part pagination bar component with header-matching background
const Pagination = ({
  page = 1,
  totalPages = 1,
  totalCount = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  itemLabel = "items",
}) => {
  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
      {/* Left: Summary Info */}
      <div className="font-medium">
        Showing <span className="font-bold text-slate-900 dark:text-slate-100">{startItem}</span> to{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{endItem}</span> of{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{totalCount}</span> {itemLabel}
      </div>

      {/* Middle: Per-Page Selector */}
      {onLimitChange && (
        <div className="flex items-center gap-2">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-purple-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}

      {/* Right: Prev, Current / Total, Next Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <span className="px-2 font-bold text-slate-800 dark:text-slate-200">
          Page {page} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
