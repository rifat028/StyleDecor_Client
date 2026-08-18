import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

// Helper custom tooltip for financial chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-200">{label}</p>
        <p className="text-purple-400 font-semibold">
          Gross: ৳{Number(payload[0]?.value || 0).toLocaleString()}
        </p>
        <p className="text-emerald-400 font-semibold">
          Platform (10%): ৳{Number(payload[1]?.value || 0).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Revenue and financial growth analytics chart card (140-180 lines)
const RevenueChartCard = ({ data }) => {
  // Fallback data if API data is pending
  const chartData = data && data.length > 0 ? data : [
    { month: "Jan", gross: 320000, commission: 32000 },
    { month: "Feb", gross: 450000, commission: 45000 },
    { month: "Mar", gross: 580000, commission: 58000 },
    { month: "Apr", gross: 720000, commission: 72000 },
    { month: "May", gross: 890000, commission: 89000 },
    { month: "Jun", gross: 1100000, commission: 110000 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/60 rounded-lg text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Revenue & Marketplace Commissions Trend
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Monthly Aggregates (BDT)
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#64748b"
              opacity={0.15}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#64748b", opacity: 0.2 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#64748b", opacity: 0.2 }}
              tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
            />
            <Bar
              dataKey="gross"
              name="Gross Volume"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="commission"
              name="Platform 10% Fee"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChartCard;
