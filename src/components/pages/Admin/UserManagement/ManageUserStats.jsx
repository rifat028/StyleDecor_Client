import React from "react";
import { Users, Shield, Palette, Briefcase, UserCheck } from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Metric summary cards for admin user management with skeleton fallback
const ManageUserStats = ({
  stats,
  roleFilter,
  onSelectRoleFilter,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* 1. Total Users */}
      <StatCard
        icon={Users}
        title="Total Users"
        value={stats?.totalUsers ?? 0}
        tone="indigo"
        active={roleFilter === "all"}
        onClick={() => onSelectRoleFilter("all")}
        loading={loading}
      />

      {/* 2. Admins */}
      <StatCard
        icon={Shield}
        title="Admins"
        value={stats?.roles?.admin ?? 0}
        tone="rose"
        active={roleFilter === "admin"}
        onClick={() => onSelectRoleFilter("admin")}
        loading={loading}
      />

      {/* 3. Decorators */}
      <StatCard
        icon={Palette}
        title="Decorators"
        value={stats?.roles?.decorator ?? 0}
        tone="purple"
        active={roleFilter === "decorator"}
        onClick={() => onSelectRoleFilter("decorator")}
        loading={loading}
      />

      {/* 4. Agents */}
      <StatCard
        icon={Briefcase}
        title="Field Agents"
        value={stats?.roles?.agent ?? 0}
        tone="amber"
        active={roleFilter === "agent"}
        onClick={() => onSelectRoleFilter("agent")}
        loading={loading}
      />

      {/* 5. Customers */}
      <StatCard
        icon={UserCheck}
        title="Customers"
        value={stats?.roles?.customer ?? 0}
        tone="emerald"
        active={roleFilter === "customer"}
        onClick={() => onSelectRoleFilter("customer")}
        loading={loading}
      />
    </div>
  );
};

export default ManageUserStats;
