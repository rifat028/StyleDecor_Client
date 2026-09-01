import React from "react";

// Ultra-compact metric stat card with minimal height and skeleton fallback
const StatCard = ({
  icon: Icon,
  title,
  value,
  tone = "purple",
  active = false,
  onClick,
  loading = false,
}) => {
  const tones = {
    indigo: {
      activeRing: "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30",
      iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    rose: {
      activeRing: "ring-2 ring-rose-500 border-rose-500 bg-rose-50/40 dark:bg-rose-950/30",
      iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    },
    purple: {
      activeRing: "ring-2 ring-purple-500 border-purple-500 bg-purple-50/40 dark:bg-purple-950/30",
      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    },
    amber: {
      activeRing: "ring-2 ring-amber-500 border-amber-500 bg-amber-50/40 dark:bg-amber-950/30",
      iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    emerald: {
      activeRing: "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30",
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
    blue: {
      activeRing: "ring-2 ring-blue-500 border-blue-500 bg-blue-50/40 dark:bg-blue-950/30",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
  };

  const selectedTone = tones[tone] || tones.purple;

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 py-2.5 px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3 animate-pulse">
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="w-14 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-sm" />
          <div className="w-10 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`bg-white dark:bg-slate-900 py-2.5 px-3.5 rounded-xl border transition-all duration-150 flex items-center gap-3 text-left ${
        active
          ? selectedTone.activeRing
          : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {Icon && (
        <div className={`p-2 rounded-lg ${selectedTone.iconBg} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mt-0.5 truncate">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
