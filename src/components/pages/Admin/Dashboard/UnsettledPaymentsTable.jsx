import React, { useState } from "react";
import {
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Building,
  User,
  Calendar,
  DollarSign,
  TrendingDown,
} from "lucide-react";

const UnsettledPaymentsTable = ({
  unsettledData = [],
  totalUnsettled = 0,
  totalUnsettledAmount = 0,
  totalOrderValue = 0,
  page = 1,
  limit = 10,
  totalPages = 1,
  onPageChange,
  onLimitChange,
  onSearchChange,
  search = "",
  loading = false,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden space-y-4">
      {/* Top Banner & Summary */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Unsettled Platform Fee Orders</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Completed bookings awaiting 10% platform commission fee settlement from decorator agencies
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-slate-500 dark:text-slate-400">Unsettled Orders:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400">
                {totalUnsettled.toLocaleString("en-BD")}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Due Platform Fee (10%):</span>
              <span className="font-extrabold text-purple-600 dark:text-purple-400">
                ৳{Number(totalUnsettledAmount).toLocaleString("en-BD")}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Gross Value:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                ৳{Number(totalOrderValue).toLocaleString("en-BD")}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by booking code, customer, decorator, or package..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold">
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Service & Category</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Decorator Agency</th>
              <th className="py-3 px-4">Order Value</th>
              <th className="py-3 px-4 text-purple-600 dark:text-purple-400">Platform Fee (10%)</th>
              <th className="py-3 px-4">Completion Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center">
                  <div className="loading loading-spinner text-purple-600 loading-md" />
                </td>
              </tr>
            ) : unsettledData.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  No unsettled payments found for this time period
                </td>
              </tr>
            ) : (
              unsettledData.map((row) => (
                <tr
                  key={row._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Booking Ref */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[11px]">
                      {row.bookingCode}
                    </span>
                  </td>

                  {/* Service Title */}
                  <td className="py-3.5 px-4 max-w-50">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {row.serviceTitle}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {row.category}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 max-w-45">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {row.customer.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 pl-4.5">
                      {row.customer.email}
                    </p>
                  </td>

                  {/* Decorator Agency */}
                  <td className="py-3.5 px-4 max-w-45">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {row.decorator.agencyName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 pl-4.5">
                      {row.decorator.division !== "N/A" ? `${row.decorator.division} Division` : row.decorator.phone}
                    </p>
                  </td>

                  {/* Order Value */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ৳{Number(row.grandTotal).toLocaleString("en-BD")}
                  </td>

                  {/* Platform Fee (10%) */}
                  <td className="py-3.5 px-4 font-extrabold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                    ৳{Number(row.platformFee).toLocaleString("en-BD")}
                  </td>

                  {/* Completion Date */}
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                    {new Date(row.completionDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Settlement Status */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Unsettled</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 outline-hidden"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>
            Page {page} of {totalPages} ({totalUnsettled} items)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-bold text-slate-700 dark:text-slate-200">
            {page}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsettledPaymentsTable;
