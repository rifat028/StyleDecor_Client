import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Building2, Briefcase } from "lucide-react";

const DECORATOR_COLORS = {
  active: "#10b981",
  pending: "#f59e0b",
  suspended: "#ef4444",
  inactive: "#64748b",
  rejected: "#dc2626",
};

const SERVICE_COLORS = {
  active: "#06b6d4",
  pending: "#f59e0b",
  draft: "#8b5cf6",
  inactive: "#64748b",
};

const FALLBACK_PALETTE = ["#9333ea", "#4f46e5", "#10b981", "#f59e0b", "#06b6d4", "#ec4899"];

// Custom Popmenu Tooltip with explicit high-contrast inline colors
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const sliceColor = payload[0].color || payload[0].fill || "#9333ea";

    return (
      <div
        className="p-3.5 rounded-xl shadow-2xl text-xs space-y-2 z-50 min-w-45 pointer-events-none"
        style={{
          backgroundColor: "#0f172a",
          border: "1px solid #334155",
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          className="flex items-center gap-2 pb-2"
          style={{ borderBottom: "1px solid #334155" }}
        >
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: sliceColor }}
          />
          <span className="font-bold text-xs truncate" style={{ color: "#ffffff" }}>
            {data.name}
          </span>
        </div>
        <div className="space-y-1.5 pt-0.5">
          <div className="flex justify-between items-center gap-4">
            <span style={{ color: "#cbd5e1" }}>Count:</span>
            <span className="font-extrabold" style={{ color: "#c084fc" }}>
              {Number(data.value || 0).toLocaleString("en-BD")}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span style={{ color: "#cbd5e1" }}>Share:</span>
            <span className="font-bold" style={{ color: "#34d399" }}>
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const DecoratorServiceCharts = ({
  decoratorData = [],
  serviceData = [],
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Status-Wise Decorator Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Status-Wise Decorator Agencies</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of active, pending, and pipeline decorator partners
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            Agency Status
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="loading loading-spinner text-purple-600 loading-md" />
            </div>
          ) : decoratorData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
              No decorator records found
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={decoratorData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {decoratorData.map((entry, index) => {
                    const color =
                      DECORATOR_COLORS[entry.status] ||
                      FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
                    return <Cell key={`cell-dec-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  content={<CustomPieTooltip />}
                  wrapperStyle={{ outline: "none", zIndex: 1000 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Status-Wise Service Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Status-Wise Service Catalog</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of live decor packages, drafts, and pending listings
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
            Catalog Status
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="loading loading-spinner text-cyan-600 loading-md" />
            </div>
          ) : serviceData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
              No service records found
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {serviceData.map((entry, index) => {
                    const color =
                      SERVICE_COLORS[entry.status] ||
                      FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
                    return <Cell key={`cell-srv-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  content={<CustomPieTooltip />}
                  wrapperStyle={{ outline: "none", zIndex: 1000 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecoratorServiceCharts;
