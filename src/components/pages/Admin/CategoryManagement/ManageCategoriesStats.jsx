import React from "react";
import { Layers, CheckCircle2, XCircle, ListTree } from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Metric summary cards for category management with skeleton fallback
const ManageCategoriesStats = ({
  stats,
  statusFilter,
  onSelectStatusFilter,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Total Categories */}
      <StatCard
        icon={Layers}
        title="Total Categories"
        value={stats?.totalCategories ?? 0}
        tone="purple"
        active={statusFilter === "all"}
        onClick={() => onSelectStatusFilter("all")}
        loading={loading}
      />

      {/* 2. Active Categories */}
      <StatCard
        icon={CheckCircle2}
        title="Active"
        value={stats?.activeCategories ?? 0}
        tone="emerald"
        active={statusFilter === "active"}
        onClick={() => onSelectStatusFilter("active")}
        loading={loading}
      />

      {/* 3. Inactive Categories */}
      <StatCard
        icon={XCircle}
        title="Inactive"
        value={stats?.inactiveCategories ?? 0}
        tone="rose"
        active={statusFilter === "inactive"}
        onClick={() => onSelectStatusFilter("inactive")}
        loading={loading}
      />

      {/* 4. Total Subcategories */}
      <StatCard
        icon={ListTree}
        title="Subcategories"
        value={stats?.totalSubCategories ?? 0}
        tone="indigo"
        loading={loading}
      />
    </div>
  );
};

export default ManageCategoriesStats;
