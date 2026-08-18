import React from "react";
import { Building, MapPin, TrendingUp, CheckCircle2, Award } from "lucide-react";

// Regional performance data for Bangladesh administrative divisions
const REGIONS = [
  { division: "Dhaka", bookings: 142, revenue: 1850000, commission: 185000, growth: "+24%", status: "High Growth" },
  { division: "Chittagong", bookings: 86, revenue: 980000, commission: 98000, growth: "+18%", status: "High Growth" },
  { division: "Sylhet", bookings: 48, revenue: 640000, commission: 64000, growth: "+12%", status: "Steady" },
  { division: "Rajshahi", bookings: 32, revenue: 380000, commission: 38000, growth: "+8%", status: "Steady" },
  { division: "Khulna", bookings: 26, revenue: 290000, commission: 29000, growth: "+5%", status: "Emerging" },
  { division: "Barisal", bookings: 14, revenue: 150000, commission: 15000, growth: "+3%", status: "Emerging" },
  { division: "Rangpur", bookings: 12, revenue: 120000, commission: 12000, growth: "+2%", status: "Emerging" },
  { division: "Mymensingh", bookings: 10, revenue: 95000, commission: 9500, growth: "+1%", status: "Emerging" },
];

// Geographic division performance table component (140-180 lines)
const RegionalPerformanceTable = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden rounded-none space-y-0">
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/60 rounded-lg text-purple-600 dark:text-purple-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Territorial Division Performance
            </h3>
            <p className="text-xs text-slate-400">
              Regional booking density and marketplace commission yields across Bangladesh
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-2 min-w-40">Division</th>
              <th className="py-3.5 px-2 text-center min-w-30">Total Orders</th>
              <th className="py-3.5 px-2 text-center min-w-35">Gross Revenue</th>
              <th className="py-3.5 px-2 text-center min-w-30">Platform Fee</th>
              <th className="py-3.5 px-2 text-center min-w-40">Market Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {REGIONS.map((region) => (
              <tr
                key={region.division}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Division Name */}
                <td className="py-3.5 px-2 min-w-40">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{region.division} Division</span>
                  </div>
                </td>

                {/* Total Orders */}
                <td className="py-3.5 px-2 text-center min-w-30 font-semibold text-slate-700 dark:text-slate-300">
                  {region.bookings} bookings
                </td>

                {/* Gross Revenue */}
                <td className="py-3.5 px-2 text-center min-w-35 font-bold text-slate-900 dark:text-white">
                  ৳{Number(region.revenue).toLocaleString()}
                </td>

                {/* Platform Fee */}
                <td className="py-3.5 px-2 text-center min-w-30 font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{Number(region.commission).toLocaleString()}
                </td>

                {/* Market Status (min-w-40) */}
                <td className="py-3.5 px-2 text-center min-w-40">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      region.status === "High Growth"
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : region.status === "Steady"
                        ? "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{region.status}</span>
                    <span className="text-[10px] font-normal opacity-75">({region.growth})</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionalPerformanceTable;
