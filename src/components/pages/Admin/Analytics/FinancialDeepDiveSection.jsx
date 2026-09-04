import React from "react";
import {
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// Currency formatter
const formatBDT = (value = 0) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `৳${(value / 1000).toFixed(0)}k`;
  return `৳${Number(value).toLocaleString("en-BD")}`;
};

// Custom Tooltip for GMV Line Graph
const GmvTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 z-50">
        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{label}</span>
        </p>
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <p className="text-purple-600 dark:text-purple-400 font-semibold flex justify-between gap-4">
            <span>Total GMV:</span>
            <span className="font-bold">৳{Number(data.gmv || 0).toLocaleString("en-BD")}</span>
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex justify-between gap-4">
            <span>Completed GMV:</span>
            <span className="font-bold">৳{Number(data.completedGmv || 0).toLocaleString("en-BD")}</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 flex justify-between gap-4 text-[11px]">
            <span>Bookings:</span>
            <span className="font-bold">{data.bookingsCount || 0}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Net Commission Line Graph
const CommissionTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 z-50">
        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{label}</span>
        </p>
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold flex justify-between gap-4">
            <span>10% Net Commission:</span>
            <span className="font-bold">৳{Number(data.netCommission || 0).toLocaleString("en-BD")}</span>
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex justify-between gap-4">
            <span>Collected:</span>
            <span className="font-bold">৳{Number(data.collectedCommission || 0).toLocaleString("en-BD")}</span>
          </p>
          <p className="text-amber-600 dark:text-amber-400 font-semibold flex justify-between gap-4">
            <span>Pending:</span>
            <span className="font-bold">৳{Number(data.pendingCommission || 0).toLocaleString("en-BD")}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Financial & Revenue Deep Dive section
const FinancialDeepDiveSection = ({
  gmvData = [],
  commissionData = [],
  loading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Section Title Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Financial & Revenue Deep Dive</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Macro revenue trajectory, transaction velocity, and 10% platform commission yields over time.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <Sparkles className="w-3 h-3 text-purple-500" /> Live Data Stream
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Gross Merchandise Value (GMV) Line Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Gross Merchandise Value (GMV)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Total marketplace transaction volume generated per month
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              Monthly Inflow
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-purple-600 loading-md"></div>
              </div>
            ) : gmvData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No GMV data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gmvData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#94a3b8", opacity: 0.3 }}
                  />
                  <YAxis
                    tickFormatter={formatBDT}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#94a3b8", opacity: 0.3 }}
                  />
                  <Tooltip content={<GmvTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="gmv"
                    name="Total GMV"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#9333ea" }}
                    activeDot={{ r: 5, stroke: "#9333ea", strokeWidth: 2, fill: "#ffffff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completedGmv"
                    name="Completed GMV"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2.5, fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Net Commission Line Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Net Platform Commission
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                10% commission entitlement vs collected platform fees
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              10% Yield
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-indigo-600 loading-md"></div>
              </div>
            ) : commissionData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No Commission data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commissionData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#94a3b8", opacity: 0.3 }}
                  />
                  <YAxis
                    tickFormatter={formatBDT}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#94a3b8", opacity: 0.3 }}
                  />
                  <Tooltip content={<CommissionTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="netCommission"
                    name="10% Net Commission"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#4f46e5" }}
                    activeDot={{ r: 5, stroke: "#4f46e5", strokeWidth: 2, fill: "#ffffff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="collectedCommission"
                    name="Collected Fee"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: "#10b981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pendingCommission"
                    name="Pending Due"
                    stroke="#f59e0b"
                    strokeWidth={1.8}
                    strokeDasharray="3 3"
                    dot={{ r: 2, fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDeepDiveSection;
