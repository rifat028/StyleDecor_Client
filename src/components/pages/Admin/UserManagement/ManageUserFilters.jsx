import React from "react";
import { Search, X } from "lucide-react";

// Clean search and dropdown filters bar for user management
const ManageUserFilters = ({
  search,
  onSearchChange,
  onClearSearch,
  roleFilter,
  onRoleFilterChange,
  cityFilter,
  onCityFilterChange,
  allowedRoles,
  citiesList,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input on the Left */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or phone..."
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

      {/* 2 Clean Dropdown Filters on the Right (No redundant filter icon) */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
        {/* Role Filter Dropdown */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
        >
          {allowedRoles.map((role) => (
            <option key={role} value={role}>
              {role === "all" ? "All Roles" : `Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </option>
          ))}
        </select>

        {/* City Filter Dropdown */}
        <select
          value={cityFilter}
          onChange={(e) => onCityFilterChange(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
        >
          {citiesList.map((city) => (
            <option key={city} value={city}>
              {city === "all" ? "All Cities" : `City: ${city}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ManageUserFilters;
