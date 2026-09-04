import React from "react";
import { Link } from "react-router";
import {
  LayoutDashboard,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  CreditCard,
  Building,
  ArrowRight,
} from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";

// Admin Dashboard - Overview Landing Page (Coming Soon)
const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Header */}
      <DashboardPageHeader
        icon={LayoutDashboard}
        title="Admin Command Dashboard"
        subtitle="Unified executive command center, system health telemetry, and fast-track administration shortcuts."
      />

      {/* 2. Coming Soon Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-8 sm:p-12 text-center">
        {/* Background glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Next Generation Platform</span>
          </div>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-500/25">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Executive Dashboard Coming Soon
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We are finalizing the real-time operational overview, automated alerts, and fast-track dispatch controls. In the meantime, explore live data and financial reports in the Analytics center.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard/analytics"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/dashboard/manage-bookings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-400 text-xs font-semibold transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Manage Bookings</span>
            </Link>

            <Link
              to="/dashboard/manage-transactions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-400 text-xs font-semibold transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span>Payment Audits</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
