import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Users,
  Shield,
  Palette,
  Briefcase,
  UserCheck,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";
import { DIVISION_DISTRICTS_MAP, ALL_BANGLADESH_DISTRICTS } from "../../../../lib/constants";

// Custom Filter Dropdown with justify-between label & count layout
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
          {selectedOption && (
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
        <div className="absolute right-0 mt-1.5 w-full min-w-[200px] max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 scrollbar-thin">
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
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 tabular-nums ${
                    isSelected
                      ? "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-300/60 dark:border-purple-700/60"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Consolidated toolbar containing compact stat cards and search/filter controls
const UserManagementToolbar = ({
  stats,
  roleFilter,
  onSelectRoleFilter,
  loadingStats = false,
  search,
  onSearchChange,
  onClearSearch,
  divisionFilter,
  onDivisionFilterChange,
  districtFilter,
  onDistrictFilterChange,
  allowedRoles,
  divisionsList,
}) => {
  // Helper to get division count with case-insensitive fallback
  const getDivisionCount = (division) => {
    const countsMap = stats?.divisions;
    if (!countsMap) return 0;
    if (countsMap[division] !== undefined) return countsMap[division];
    const matchKey = Object.keys(countsMap).find(
      (k) => k.toLowerCase() === division.toLowerCase()
    );
    return matchKey ? countsMap[matchKey] : 0;
  };

  // Helper to get district count with case-insensitive fallback
  const getDistrictCount = (district) => {
    const countsMap = stats?.districts;
    if (!countsMap) return 0;
    if (countsMap[district] !== undefined) return countsMap[district];
    const matchKey = Object.keys(countsMap).find(
      (k) => k.toLowerCase() === district.toLowerCase()
    );
    return matchKey ? countsMap[matchKey] : 0;
  };

  // Build role options with label, count, and value
  const roleOptions = useMemo(() => {
    return allowedRoles.map((role) => {
      const isAll = role === "all";
      const label = isAll
        ? "All Roles"
        : role.charAt(0).toUpperCase() + role.slice(1);
      const count = isAll ? stats?.totalUsers ?? 0 : stats?.roles?.[role] ?? 0;
      return { value: role, label, count };
    });
  }, [allowedRoles, stats]);

  // Combine predefined divisions with any additional divisions present in stats
  const allDivisions = useMemo(() => {
    const defaultList = [...divisionsList];
    const countsMap = stats?.divisions;
    if (countsMap) {
      Object.keys(countsMap).forEach((division) => {
        if (
          division &&
          !defaultList.some((d) => d.toLowerCase() === division.toLowerCase())
        ) {
          defaultList.push(division);
        }
      });
    }
    return defaultList;
  }, [divisionsList, stats?.divisions]);

  // Build division options with label, count, and value
  const divisionOptions = useMemo(() => {
    return allDivisions.map((division) => {
      const isAll = division === "all";
      const label = isAll ? "All Divisions" : division;
      const count = isAll ? stats?.totalUsers ?? 0 : getDivisionCount(division);
      return { value: division, label, count };
    });
  }, [allDivisions, stats]);

  // Determine districts to display based on selected division
  const allDistricts = useMemo(() => {
    let baseList = [];
    if (divisionFilter && divisionFilter !== "all") {
      baseList = DIVISION_DISTRICTS_MAP[divisionFilter] || [];
    } else {
      baseList = ALL_BANGLADESH_DISTRICTS;
    }

    const list = ["all", ...baseList];

    // Also include any unexpected districts present in stats if relevant
    if (stats?.districts && divisionFilter === "all") {
      Object.keys(stats.districts).forEach((district) => {
        if (
          district &&
          !list.some((d) => d.toLowerCase() === district.toLowerCase())
        ) {
          list.push(district);
        }
      });
    }
    return list;
  }, [divisionFilter, stats?.districts]);

  // Build district options with label, count, and value
  const districtOptions = useMemo(() => {
    return allDistricts.map((district) => {
      const isAll = district === "all";
      const label = isAll ? "All Districts" : district;
      const count = isAll
        ? divisionFilter === "all"
          ? stats?.totalUsers ?? 0
          : getDivisionCount(divisionFilter)
        : getDistrictCount(district);
      return { value: district, label, count };
    });
  }, [allDistricts, divisionFilter, stats]);

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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input on Left */}
        <div className="relative w-full lg:max-w-xs xl:max-w-sm">
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

        {/* Clean Dropdowns on Right with justify-between value and count */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          {/* Role Dropdown */}
          <FilterDropdown
            value={roleFilter}
            onChange={onSelectRoleFilter}
            options={roleOptions}
            placeholder="Select Role"
            minWidth="min-w-[155px]"
          />

          {/* Division Dropdown */}
          <FilterDropdown
            value={divisionFilter}
            onChange={onDivisionFilterChange}
            options={divisionOptions}
            placeholder="Select Division"
            minWidth="min-w-[165px]"
          />

          {/* District Dropdown */}
          <FilterDropdown
            value={districtFilter}
            onChange={onDistrictFilterChange}
            options={districtOptions}
            placeholder="Select District"
            minWidth="min-w-[165px]"
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagementToolbar;
