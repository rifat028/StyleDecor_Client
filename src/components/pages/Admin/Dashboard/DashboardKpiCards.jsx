import React from "react";
import {
  Building2,
  Clock,
  Users,
  UserCheck,
  Briefcase,
  ShoppingBag,
} from "lucide-react";

const CARD_CONFIGS = [
  {
    key: "totalDecorators",
    title: "Total Decorators",
    subtitle: "Registered decor agencies",
    icon: Building2,
    gradient: "from-purple-500 to-indigo-600",
    textClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-800/40",
    badge: "Agencies",
  },
  {
    key: "pendingDecorators",
    title: "Pending Decorators",
    subtitle: "Awaiting agency verification",
    icon: Clock,
    gradient: "from-amber-500 to-orange-600",
    textClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/40",
    badge: "Review Queue",
  },
  {
    key: "totalAgents",
    title: "Total Agents",
    subtitle: "On-field event coordinators",
    icon: Users,
    gradient: "from-indigo-500 to-blue-600",
    textClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/40",
    badge: "Field Force",
  },
  {
    key: "totalCustomers",
    title: "Total Customers",
    subtitle: "Active client accounts",
    icon: UserCheck,
    gradient: "from-emerald-500 to-teal-600",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40",
    badge: "Clients",
  },
  {
    key: "totalActiveServices",
    title: "Active Services",
    subtitle: "Live decor packages in catalog",
    icon: Briefcase,
    gradient: "from-cyan-500 to-sky-600",
    textClass: "text-cyan-600 dark:text-cyan-400",
    bgClass: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-800/40",
    badge: "Catalog",
  },
  {
    key: "totalBookings",
    title: "Total Bookings",
    subtitle: "Order bookings generated",
    icon: ShoppingBag,
    gradient: "from-fuchsia-500 to-pink-600",
    textClass: "text-fuchsia-600 dark:text-fuchsia-400",
    bgClass: "bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-200/80 dark:border-fuchsia-800/40",
    badge: "Orders",
  },
];

const DashboardKpiCards = ({ stats = {}, loading = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      {CARD_CONFIGS.map((cfg) => {
        const Icon = cfg.icon;
        const val = stats[cfg.key] !== undefined ? stats[cfg.key] : 0;

        return (
          <div
            key={cfg.key}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} text-white flex items-center justify-center shadow-md shadow-purple-500/10 shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {cfg.badge}
              </span>
            </div>

            {/* Value & Labels */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {cfg.title}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                {loading ? (
                  <div className="skeleton h-8 w-20 rounded-md dark:bg-slate-800/60" />
                ) : (
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {Number(val).toLocaleString("en-BD")}
                  </h3>
                )}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                {cfg.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardKpiCards;
