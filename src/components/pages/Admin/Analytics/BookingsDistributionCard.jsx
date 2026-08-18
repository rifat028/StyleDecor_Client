import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Layers, PieChart as PieIcon } from "lucide-react";

const PALETTE = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];

// Bookings and category distribution analytics card (150-190 lines)
const BookingsDistributionCard = ({ demandData, statusData }) => {
  const categories = demandData && demandData.length > 0 ? demandData : [
    { category: "Wedding & Pre-Wedding", count: 45 },
    { category: "Birthday & Milestone", count: 28 },
    { category: "Corporate & Commercial", count: 18 },
    { category: "Home & Rooftop", count: 22 },
  ];

  const statuses = statusData && statusData.length > 0 ? statusData : [
    { name: "COMPLETED", value: 65 },
    { name: "IN PROGRESS", value: 20 },
    { name: "ACCEPTED", value: 15 },
    { name: "PENDING", value: 10 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Demand Pie */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/60 rounded-lg text-purple-600 dark:text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Category Demand Distribution
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} bookings`, "Demand"]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Execution Status Distribution Pie */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-lg text-emerald-600 dark:text-emerald-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Booking Lifecycle Statuses
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statuses}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
              >
                {statuses.map((entry, index) => (
                  <Cell
                    key={`cell-st-${index}`}
                    fill={PALETTE[(index + 2) % PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} bookings`, "Volume"]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BookingsDistributionCard;
