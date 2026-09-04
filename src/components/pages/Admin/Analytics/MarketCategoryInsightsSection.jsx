import React from "react";
import {
  PieChart as PieIcon,
  BarChart as BarIcon,
  Layers,
  Activity,
  Filter,
  MapPin,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Currencies and numbers formatter
const formatBDT = (value = 0) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `৳${(value / 1000).toFixed(0)}k`;
  return `৳${Number(value).toLocaleString("en-BD")}`;
};

const PIE_COLORS = [
  "#9333ea", // Purple
  "#4f46e5", // Indigo
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#14b8a6", // Teal
];

// Market & Category Insights section
const MarketCategoryInsightsSection = ({
  divisionUsers = [],
  categoryServices = [],
  categoryBookings = [],
  selectedDivision = "all",
  onDivisionChange,
  availableDivisions = [],
  topCategoriesRevenue = [],
  bookingCurve = [],
  divisionBookings = [],
  loading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Market & Category Insights</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geographic penetration, vendor density, catalog composition, and category booking dynamics.
          </p>
        </div>
      </div>

      {/* Row 1: Division-wise Multi-Bar + Category-wise Service Count */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Division-wise User, Decorator and Agent Multi-Bar Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Division-Wise User, Decorator & Agent Density</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-tier workforce and customer distribution across 8 administrative divisions
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-purple-600 loading-md"></div>
              </div>
            ) : divisionUsers.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No division data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={divisionUsers} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="division"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }} />
                  <Bar dataKey="customers" name="Customers" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="decorators" name="Decorators" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="agents" name="Agents" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Category-Wise Service Count Bar Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <BarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Category-Wise Service Catalog Count</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Active decor package availability categorized by event type
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-indigo-600 loading-md"></div>
              </div>
            ) : categoryServices.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No category service data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryServices} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 9.5, fill: "#94a3b8" }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="servicesCount" name="Active Packages" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Category-Wise Booking with Division Filter + Top Revenue Categories Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Category-Wise Booking With Division Filter Bar Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Category-Wise Bookings Demand
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Total bookings volume per category filtered by territorial division
              </p>
            </div>

            {/* Division Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <select
                value={selectedDivision}
                onChange={(e) => onDivisionChange && onDivisionChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
              >
                {availableDivisions.map((div) => (
                  <option key={div} value={div}>
                    {div === "all" ? "All Divisions (Nationwide)" : `${div} Division`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-purple-600 loading-md"></div>
              </div>
            ) : categoryBookings.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No bookings in selected division
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBookings} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 9.5, fill: "#94a3b8" }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="bookingsCount" name="Total Bookings" fill="#9333ea" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completedCount" name="Completed" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Top Revenue-Generating Categories Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Top Revenue-Generating Categories</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Market share percentage and gross revenue contribution by event vertical
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-emerald-600 loading-md"></div>
              </div>
            ) : topCategoriesRevenue.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No revenue category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCategoriesRevenue}
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
                    {topCategoriesRevenue.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`৳${Number(val).toLocaleString("en-BD")}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "10.5px", paddingTop: "5px" }}
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

      {/* Row 3: Booking Curve Last 365 Days + Division Wise Booking Bar Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Booking Curve Last 365 Days */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Booking Curve (Last 365 Days)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Annual volume velocity and seasonality cadence of event bookings
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              365 Days Trajectory
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-purple-600 loading-md"></div>
              </div>
            ) : bookingCurve.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No curve data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingCurve} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="bookingCurveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    interval={Math.max(1, Math.floor(bookingCurve.length / 8))}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    name="Bookings Velocity"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#bookingCurveGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 6. Division-Wise Booking Bar Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <BarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Division-Wise Booking Distribution</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Regional event execution volume and completed orders by division
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner text-emerald-600 loading-md"></div>
              </div>
            ) : divisionBookings.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No division booking data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={divisionBookings} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis
                    dataKey="division"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }} />
                  <Bar dataKey="bookingsCount" name="Total Bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completedCount" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCategoryInsightsSection;
