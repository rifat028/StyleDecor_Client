import React from "react";
import {
  Building2,
  Users,
  Star,
  Trophy,
  Award,
  CheckCircle2,
  Tag,
} from "lucide-react";

// Helper for default placeholder avatar
const getAvatarUrl = (name = "Agent") => {
  const initials = encodeURIComponent(name || "Agent");
  return `https://ui-avatars.com/api/?name=${initials}&background=9333ea&color=ffffff&bold=true&size=100`;
};

// Vendor & Operational Performance Section
const VendorPerformanceSection = ({
  topDecorators = [],
  topAgents = [],
  loading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Vendor & Operational Performance</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Leaderboards for top grossing decorator agencies and most active field execution agents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 1. Top 10 Decorator Agencies Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Top 10 Decorator Agencies</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Ranked by verified event execution volume and completed revenue
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              Agency Leaderboard
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="loading loading-spinner text-purple-600 loading-md"></div>
              </div>
            ) : topDecorators.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No decorator leaderboard data available
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3 min-w-44">Agency & Owner</th>
                    <th className="py-3 px-2">Division</th>
                    <th className="py-3 px-2 text-center">Completed</th>
                    <th className="py-3 px-3 text-right">Total Revenue</th>
                    <th className="py-3 px-3 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topDecorators.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Rank Badge */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-extrabold ${
                            d.rank === 1
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300"
                              : d.rank === 2
                              ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                              : d.rank === 3
                              ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                              : "text-slate-400 dark:text-slate-500 font-medium"
                          }`}
                        >
                          {d.rank}
                        </span>
                      </td>

                      {/* Agency Name & Owner */}
                      <td className="py-3 px-3 min-w-44">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {d.businessName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {d.ownerName}
                        </p>
                      </td>

                      {/* Division */}
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {d.division}
                        </span>
                      </td>

                      {/* Completed */}
                      <td className="py-3 px-2 text-center font-bold text-slate-800 dark:text-slate-200">
                        {d.completedBookings}
                      </td>

                      {/* Total Revenue */}
                      <td className="py-3 px-3 text-right font-extrabold text-purple-600 dark:text-purple-400">
                        ৳{Number(d.totalRevenue || 0).toLocaleString("en-BD")}
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                            {d.rating}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 2. Top 10 Agent Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Top 10 Field Agents</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Top operational specialists ranked by verified setups and customer appraisal ratings
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              Agent Leaderboard
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="loading loading-spinner text-indigo-600 loading-md"></div>
              </div>
            ) : topAgents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No agent leaderboard data available
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3 min-w-44">Agent Specialist</th>
                    <th className="py-3 px-2">Division</th>
                    <th className="py-3 px-3 text-center">Executions</th>
                    <th className="py-3 px-3 text-center">Appraisal Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topAgents.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Rank Badge */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-extrabold ${
                            a.rank === 1
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300"
                              : a.rank === 2
                              ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                              : a.rank === 3
                              ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                              : "text-slate-400 dark:text-slate-500 font-medium"
                          }`}
                        >
                          {a.rank}
                        </span>
                      </td>

                      {/* Agent Avatar + Name + Email */}
                      <td className="py-3 px-3 min-w-44">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={a.photoUrl || getAvatarUrl(a.name)}
                            alt={a.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getAvatarUrl(a.name);
                            }}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                              {a.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {a.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Division */}
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
                          {a.division}
                        </span>
                      </td>

                      {/* Executions Completed */}
                      <td className="py-3 px-3 text-center font-extrabold text-emerald-600 dark:text-emerald-400">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{a.completedExecutions}</span>
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                            {a.rating}.0
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({a.reviewCount})
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPerformanceSection;
