import React from "react";
import {
  Wallet,
  Percent,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatCard from "../../../ui/StatCard";

// Helper for BDT currency format
const formatBDT = (amount = 0) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

// 4 Top KPI Stat Cards for Admin Analytics
const AnalyticsKpiCards = ({ stats, loading = false }) => {
  const totalVolume = stats?.totalVolume ?? 0;
  const platformCommission = stats?.platformCommission ?? 0;
  const collectedCommission = stats?.collectedCommission ?? 0;
  const pendingCommission = stats?.pendingCommission ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Volume (Total amount paid by customers) */}
      <StatCard
        icon={Wallet}
        title="Total Volume"
        value={formatBDT(totalVolume)}
        subtitle="Total customer payment inflow"
        tone="purple"
        loading={loading}
      />

      {/* 2. Platform Commission (10% on completed bookings) */}
      <StatCard
        icon={Percent}
        title="Platform Commission"
        value={formatBDT(platformCommission)}
        subtitle="10% platform share on completed setups"
        tone="indigo"
        loading={loading}
      />

      {/* 3. Collected Commission (Platform fee paid) */}
      <StatCard
        icon={CheckCircle2}
        title="Collected Commission"
        value={formatBDT(collectedCommission)}
        subtitle="Realized platform fee settlements"
        tone="emerald"
        loading={loading}
      />

      {/* 4. Pending Commission (Outstanding) */}
      <StatCard
        icon={Clock}
        title="Pending Commission"
        value={formatBDT(pendingCommission)}
        subtitle="Uncollected vendor commission dues"
        tone="amber"
        loading={loading}
      />
    </div>
  );
};

export default AnalyticsKpiCards;
