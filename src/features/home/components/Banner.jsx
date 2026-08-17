import React from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Calendar,
  Users,
  Percent,
  Gift,
  Sparkles,
  Gem,
  Star,
  Heart,
  Crown,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const Banner = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-[#FAF9F6] dark:bg-slate-950 overflow-hidden font-sans min-h-[85vh] flex flex-col justify-center items-center py-20">
      {/* Background Animation & Glow */}
      <div className="absolute inset-0 bg-linear-to-b from-purple-100/60 via-indigo-50/30 to-transparent dark:from-purple-900/20 dark:via-indigo-900/10 pointer-events-none"></div>

      {/* Subtle Background Concentric Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 border border-purple-200/20 dark:border-purple-800/20 rounded-full pointer-events-none"></div>
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-150 h-150 border border-purple-300/20 dark:border-purple-700/20 rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-100 h-100 border border-purple-400/20 dark:border-purple-600/20 rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10 flex flex-col items-center text-center">
        {/* 1. Top Center Pill/Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs px-4 py-1.5 mb-8"
        >
          <div className="w-5 h-5 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider">
            DecorCraft NEXT LEVEL
          </span>
        </motion.div>

        {/* 2. Main Headline (H1) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl leading-[1.1]"
        >
          We Craft Industry's Top <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">
            Event Experiences
          </span>
        </motion.h1>

        {/* 3. Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-slate-600 dark:text-slate-400 text-sm md:text-base lg:text-lg mb-10 leading-relaxed font-medium px-4"
        >
          Book top decorators instantly with transparent packages. From lavish weddings to intimate birthdays, we connect you with 100% verified premium vendors in your city.
        </motion.p>

        {/* 4. CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Button 1 (Primary) */}
          <button
            onClick={() => navigate("/services")}
            className="w-full sm:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl px-8 py-3.5 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Book Decorator Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Button 2 (Secondary) */}
          <button
            onClick={() => navigate("/about")}
            className="w-full sm:w-auto border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-semibold rounded-xl px-8 py-3.5 transition-all duration-300 active:scale-95 bg-white/50 dark:bg-transparent backdrop-blur-sm cursor-pointer"
          >
            Explore Packages
          </button>
        </motion.div>

        {/* 5. Bottom Event Info Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-4xl mt-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-purple-100 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {/* Box 1 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Booking Open</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">Oct - Dec 2026</p>
            </div>
          </div>

          {/* Box 2 */}
          <div className="flex items-start gap-4 md:border-l md:border-slate-200 dark:border-slate-800 md:pl-6">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Active Slots</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">Only 45 Remaining</p>
            </div>
          </div>

          {/* Box 3 */}
          <div className="flex items-start gap-4 md:border-l md:border-slate-200 dark:border-slate-800 md:pl-6">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Season Special</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">Up to 25% Off</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. Floating Badges at Both Sides (3D Float Effect) */}

      {/* Left Side Floating Badges */}
      <div className="hidden lg:block absolute left-10 xl:left-24 top-[20%]">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -15, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-center transform -rotate-12"
        >
          <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
      </div>
      <div className="hidden lg:block absolute left-24 xl:left-40 top-[50%]">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -20, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-center transform rotate-6 scale-110"
        >
          <Heart className="w-10 h-10 fill-pink-500 text-pink-500" />
        </motion.div>
      </div>
      <div className="hidden lg:block absolute left-8 xl:left-16 bottom-[25%]">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 3.5, delay: 2, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-center transform -rotate-6"
        >
          <Sparkles className="w-8 h-8 text-purple-500" />
        </motion.div>
      </div>

      {/* Right Side Floating Badges */}
      <div className="hidden lg:block absolute right-12 xl:right-28 top-[25%]">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -20, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 4.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-center transform rotate-12"
        >
          <Star className="w-8 h-8 fill-amber-500 text-amber-500" />
        </motion.div>
      </div>
      <div className="hidden lg:block absolute right-24 xl:right-48 top-[55%]">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -15, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 3.8, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-center transform -rotate-6 scale-125"
        >
          <Gift className="w-10 h-10 fill-rose-100 text-rose-500 dark:fill-rose-950/40" />
        </motion.div>
      </div>
      <div className="hidden lg:block absolute right-8 xl:right-20 bottom-[15%]">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 3, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-center transform rotate-6"
        >
          <Gem className="w-8 h-8 fill-indigo-100 text-indigo-500 dark:fill-indigo-950/40" />
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
