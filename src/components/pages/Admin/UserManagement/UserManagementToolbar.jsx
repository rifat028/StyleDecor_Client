import React from "react";
import {
  Users,
  Shield,
  Palette,
  Briefcase,
  UserCheck,
  Search,
  X,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Consolidated toolbar containing compact stat cards and search/filter controls (100-150 lines)
const UserManagementToolbar = ({
  stats,
  roleFilter,
  onSelectRoleFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  cityFilter,
  onCityFilterChange,
  allowedRoles,
  citiesList,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Ultra-Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Users */}
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          tone="indigo"
          active={roleFilter === "all"}
          onClick={() => onSelectRoleFilter("all")}
          loading={loadingStats}
        />

        {/* Admins */}
        <StatCard
          icon={Shield}
          title="Admins"
          value={stats?.roles?.admin ?? 0}
          tone="rose"
          active={roleFilter === "admin"}
          onClick={() => onSelectRoleFilter("admin")}
          loading={loadingStats}
        />

        {/* Decorators */}
        <StatCard
          icon={Palette}
          title="Decorators"
          value={stats?.roles?.decorator ?? 0}
          tone="purple"
          active={roleFilter === "decorator"}
          onClick={() => onSelectRoleFilter("decorator")}
          loading={loadingStats}
        />

        {/* Field Agents */}
        <StatCard
          icon={Briefcase}
          title="Field Agents"
          value={stats?.roles?.agent ?? 0}
          tone="amber"
          active={roleFilter === "agent"}
          onClick={() => onSelectRoleFilter("agent")}
          loading={loadingStats}
        />

        {/* Customers */}
        <StatCard
          icon={UserCheck}
          title="Customers"
          value={stats?.roles?.customer ?? 0}
          tone="emerald"
          active={roleFilter === "customer"}
          onClick={() => onSelectRoleFilter("customer")}
          loading={loadingStats}
        />
      </div>

      {/* 2. Search and Dropdown Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
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

        {/* Clean Dropdowns on Right (No redundant filter icon) */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Role Dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => onSelectRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
          >
            {allowedRoles.map((role) => (
              <option key={role} value={role}>
                {role === "all"
                  ? "All Roles"
                  : `Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </option>
            ))}
          </select>

          {/* City Dropdown */}
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
    </div>
  );
};

export default UserManagementToolbar;
