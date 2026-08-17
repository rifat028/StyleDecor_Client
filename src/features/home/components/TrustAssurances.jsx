import React from "react";
import {
  Clock,
  ShieldCheck,
  Lock,
  Headphones,
  CheckCircle2,
  Shield,
  Sparkles,
  Award,
  BadgeCheck,
  CreditCard,
  RefreshCw
} from "lucide-react";

// Trust Pillars Data Configuration
const TRUST_PILLARS = [
  {
    id: "on-time",
    icon: Clock,
    secondaryIcon: CheckCircle2,
    badgeText: "100% Guaranteed",
    title: "On-Time Setup",
    description:
      "Decorators arrive and complete venue setup at least 2 hours before your event starts—guaranteed.",
    gradient: "from-purple-500 to-indigo-600",
    lightBg: "bg-purple-50/80 dark:bg-purple-950/30",
    borderAccent: "border-purple-200 dark:border-purple-800/60",
    hoverGlow: "group-hover:shadow-purple-500/20"
  },
  {
    id: "verified-vendors",
    icon: ShieldCheck,
    secondaryIcon: BadgeCheck,
    badgeText: "Vetted Agencies",
    title: "Verified Vendors",
    description:
      "Every agency goes through identity, trade license, and past work verification. What you see is what you get.",
    gradient: "from-indigo-500 to-blue-600",
    lightBg: "bg-indigo-50/80 dark:bg-indigo-950/30",
    borderAccent: "border-indigo-200 dark:border-indigo-800/60",
    hoverGlow: "group-hover:shadow-indigo-500/20"
  },
  {
    id: "escrow-protection",
    icon: Lock,
    secondaryIcon: CreditCard,
    badgeText: "Zero Risk",
    title: "Escrow Protection",
    description:
      "Your money stays safely in escrow and is only released to the decorator after your event is successfully set up.",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    borderAccent: "border-emerald-200 dark:border-emerald-800/60",
    hoverGlow: "group-hover:shadow-emerald-500/20"
  },
  {
    id: "dedicated-support",
    icon: Headphones,
    secondaryIcon: RefreshCw,
    badgeText: "24/7 Assistance",
    title: "24/7 Dedicated Support",
    description:
      "Emergency venue issue or date change? Our support team and free rescheduling policy have got you covered.",
    gradient: "from-amber-500 to-rose-500",
    lightBg: "bg-amber-50/80 dark:bg-amber-950/30",
    borderAccent: "border-amber-200 dark:border-amber-800/60",
    hoverGlow: "group-hover:shadow-amber-500/20"
  }
];

const TrustAssurances = () => {
  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-slate-50/60 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background Decorative Ambient Radial Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-14">
        {/* 1. Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold tracking-wide border border-purple-200 dark:border-purple-800/50 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Peace of Mind Guaranteed</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Why You Can{" "}
            <span className="bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Trust DecorCraft
            </span>{" "}
            for Your Big Day
          </h2>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal">
            We eliminate event decoration hassles with strict quality checks, transparent pricing, and complete payment protection.
          </p>
        </div>

        {/* 2. 4-Pillar Trust Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const SecondaryIcon = pillar.secondaryIcon;
            return (
              <div
                key={pillar.id}
                className={`relative group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-purple-100/80 dark:border-purple-900/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden ${pillar.hoverGlow}`}
              >
                {/* Top Subtle Card Highlight Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${pillar.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  {/* Glowing Top Icon Container & Badge Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 bg-linear-to-br from-purple-100 via-indigo-50 to-amber-100 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-900 text-purple-700 dark:text-purple-300 rounded-2xl w-fit border border-purple-200/60 dark:border-purple-800/60 shadow-xs group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pillar.badgeText}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Assurance Indicator */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <SecondaryIcon className="w-4 h-4 text-emerald-500" />
                  <span>Verified Platform Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Bottom Trust Metric Banner */}
        <div className="relative rounded-2xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-purple-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="p-2.5 rounded-xl bg-purple-800/60 text-purple-300 border border-purple-700/50 shrink-0 hidden sm:block">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-purple-100">
              Over{" "}
              <span className="text-amber-400 font-extrabold">12,000+ events</span>{" "}
              successfully decorated with zero cancellation record.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold shrink-0">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Marketplace Security</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustAssurances;
