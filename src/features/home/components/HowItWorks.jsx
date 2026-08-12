import React from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Calendar,
  ShieldCheck,
  PartyPopper,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ==========================================
// How It Works Steps Data Configuration
// ==========================================
const steps = [
  {
    stepNumber: "01",
    title: "Discover & Compare",
    description:
      "Browse through hundreds of verified decoration packages by event category, budget, and location.",
    icon: Search,
  },
  {
    stepNumber: "02",
    title: "Customize & Choose Date",
    description:
      "Pick your preferred date slot, customize package details, and communicate your venue layout.",
    icon: Calendar,
  },
  {
    stepNumber: "03",
    title: "Secure Online Booking",
    description:
      "Confirm your booking with transparent pricing and secure online payment via instant processing.",
    icon: ShieldCheck,
  },
  {
    stepNumber: "04",
    title: "Celebrate Stress-Free",
    description:
      "Sit back and relax while our verified decorators set up your venue with perfection.",
    icon: PartyPopper,
  },
];

// =========================================================================
// Main Component: HowItWorks
// Displays a modern 4-step interactive timeline guide explaining how to book
// event decoration services on DecorCraft.
// =========================================================================
const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-base-100 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ------------------------------------------------------------- */}
        {/* Header Section                                                */}
        {/* ------------------------------------------------------------- */}
        <div className="text-center mb-16 relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Simple 4-Step Process
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-base-content dark:text-white">
            How{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500">
              DecorCraft
            </span>{" "}
            Works for You
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-base-content/70 dark:text-gray-300 max-w-2xl mx-auto">
            Booking your dream event setup is as easy as 1-2-3-4. Here is how we
            turn your vision into reality.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4-Step Interactive Timeline Grid                              */}
        {/* ------------------------------------------------------------- */}
        <div className="relative">
          {/* Connecting Progress Line (Visible on Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 border-t-2 border-dashed border-purple-200 dark:border-purple-800/60 -z-0 transform -translate-y-6" />

          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.stepNumber}
                  className="group bg-white/90 dark:bg-base-200/90 backdrop-blur-md rounded-2xl p-6 md:p-7 border border-purple-100 dark:border-purple-900/30 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Background Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  <div className="relative z-10">
                    {/* Top Row: Icon Badge & Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:scale-110">
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="text-4xl font-black text-purple-200/80 dark:text-purple-900/50 group-hover:text-purple-400/80 transition-colors">
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors mb-2">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Subtle Accent Bottom Line */}
                  <div className="mt-6 h-1 w-12 bg-purple-200 dark:bg-purple-900/40 rounded-full group-hover:w-full group-hover:bg-purple-600 transition-all duration-500 z-10" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Bottom CTA Widget Banner                                      */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-16 bg-linear-to-r from-purple-900/10 via-purple-600/10 to-pink-500/10 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-100 dark:border-purple-900/30 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="text-center sm:text-left">
            <h4 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              Ready to elevate your upcoming event?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore verified decoration setups with transparent pricing and
              instant booking.
            </p>
          </div>

          <button
            onClick={() => navigate("/services")}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0"
          >
            Browse Packages Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
