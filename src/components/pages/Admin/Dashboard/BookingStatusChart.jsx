import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { CalendarCheck, PieChart as PieIcon, Sparkles } from "lucide-react";

const BOOKING_COLORS = {
  completed: "#10b981",
  in_progress: "#3b82f6",
  preparing: "#8b5cf6",
  out_for_destination: "#f59e0b",
  cancelled: "#ef4444",
  pending: "#ec4899",
  rejected: "#dc2626",
};

const FALLBACK_PALETTE = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

// Custom Popmenu Tooltip with explicit high-contrast inline colors
const BookingPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const sliceColor = payload[0].color || payload[0].fill || "#9333ea";

    return (
      <div
        className="p-3.5 rounded-xl shadow-2xl text-xs space-y-2 z-50 min-w-47.5 pointer-events-none"
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
            {data.name} Bookings
          </span>
        </div>
        <div className="space-y-1.5 pt-0.5">
          <div className="flex justify-between items-center gap-4">
            <span style={{ color: "#cbd5e1" }}>Total Orders:</span>
            <span className="font-extrabold" style={{ color: "#c084fc" }}>
              {Number(data.value || 0).toLocaleString("en-BD")}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span style={{ color: "#cbd5e1" }}>Percentage Share:</span>
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

const BookingStatusChart = ({
  bookingData = [],
  totalBookings = 0,
  timeFilter = "max",
  loading = false,
}) => {
  const completedEntry = bookingData.find((b) => b.status === "completed");
  const completionRate =
    totalBookings > 0 && completedEntry
      ? ((completedEntry.count / totalBookings) * 100).toFixed(1)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Date-Filtered Booking Status Distribution</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational pipeline stages of customer event bookings for the selected time window
          </p>
        </div>

        {/* Filter Indicator Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Period: {timeFilter.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Chart + Summary Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Pie Chart (7 Cols) */}
        <div className="lg:col-span-7 h-72 w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="loading loading-spinner text-emerald-600 loading-md" />
            </div>
          ) : bookingData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
              No bookings recorded in this time period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  outerRadius={95}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {bookingData.map((entry, index) => {
                    const color =
                      BOOKING_COLORS[entry.status] ||
                      FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
                    return <Cell key={`cell-bk-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  content={<BookingPieTooltip />}
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

        {/* Breakdown Metric Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Filtered Volume
            </p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {Number(totalBookings || 0).toLocaleString("en-BD")}
              </h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {completionRate}% Completed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {bookingData.map((b) => {
              const color = BOOKING_COLORS[b.status] || "#9333ea";
              return (
                <div
                  key={b.status}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-1"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                      {b.name}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-0.5">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {b.count}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {b.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusChart;
