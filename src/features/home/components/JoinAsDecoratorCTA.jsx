import React from "react";
import { Link } from "react-router";
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  Zap,
  BarChart3
} from "lucide-react";

const JoinAsDecoratorCTA = () => {
  return (
    <section className="py-12 px-4 md:px-8 lg:px-12 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Full-width Banner Container */}
        <div className="relative rounded-3xl bg-linear-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 md:p-12 lg:p-14 shadow-2xl overflow-hidden border border-purple-800/40">
          {/* Decorative Floating Ambient Glow & Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Two-Column Layout (60% / 40% Desktop) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Value Proposition & Benefit Bullets (7 cols / ~60%) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold tracking-wide w-fit">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>Partner With Us</span>
              </div>

              {/* Headline & Sub-headline */}
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Are You an{" "}
                  <span className="text-purple-300">Event Decorator</span>?{" "}
                  <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Grow Your Business 3x Faster.
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-purple-100/80 max-w-2xl font-normal leading-relaxed">
                  Join Bangladesh's premier event decoration marketplace. Get direct bookings from verified hosts, hassle-free automated payouts, and guaranteed business visibility.
                </p>
              </div>

              {/* 3 Key Benefits Grid / Bullet List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Benefit 1 */}
                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-purple-500/20 flex flex-col justify-between space-y-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 w-fit">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Zero Registration Fee</h4>
                    <p className="text-xs text-purple-200/70 mt-1">
                      Get started and list your packages for free.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-purple-500/20 flex flex-col justify-between space-y-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 w-fit">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Guaranteed Payouts</h4>
                    <p className="text-xs text-purple-200/70 mt-1">
                      Instant escrow release upon event completion.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-purple-500/20 flex flex-col justify-between space-y-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 w-fit">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Direct Client Leads</h4>
                    <p className="text-xs text-purple-200/70 mt-1">
                      Manage bookings & dates from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual CTA & Metric Box (5 cols / ~40%) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl space-y-6 text-center">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Partner Access</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Start Accepting Event Bookings Today
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-200/70">
                    Set up your vendor profile in under 5 minutes and reach thousands of event hosts.
                  </p>
                </div>

                {/* Primary CTA Button Routing to /join-as-decorator */}
                <div>
                  <Link
                    to="/join-as-decorator"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all duration-300 scale-100 hover:scale-[1.03] active:scale-95 group cursor-pointer"
                  >
                    <span>Register as Decorator</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Social Proof Metrics & Trust Indicator */}
                <div className="pt-4 border-t border-purple-800/50 space-y-2">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9/5 Vendor Satisfaction Rate</span>
                  </div>
                  <p className="text-xs text-purple-200/60 leading-tight">
                    Joined by 500+ active decorating agencies in Dhaka, Chittagong & Sylhet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinAsDecoratorCTA;
