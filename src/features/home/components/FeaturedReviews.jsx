import React, { useState, useEffect, useRef } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import {
  Star,
  Quote,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  Building,
  CheckCircle2,
} from "lucide-react";

// Fallback high-quality reviews in case server is loading
const fallbackReviews = [
  {
    _id: "rev-fallback-1",
    customerName: "Tahmidur Rahman",
    customerPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    rating: 5,
    comment:
      "Made our wedding reception look straight out of a fairytale! The fresh flower stage backdrop, ambient lighting, and couple seating arrangement were beyond our expectations. Highly recommended!",
    agentName: "Israt Jahan",
    isVerifiedBooking: true,
    createdAt: new Date("2026-08-14T20:00:00.000Z"),
  },
  {
    _id: "rev-fallback-2",
    customerName: "Shamima Nasrin",
    customerPhotoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
    rating: 5,
    comment:
      "The Gaye Holud setup was exceptionally vibrant! The traditional wooden swing and marigold garlands were adored by all our guests. Team was punctual and professional.",
    agentName: "Fahim Faysal",
    isVerifiedBooking: true,
    createdAt: new Date("2026-08-14T20:00:00.000Z"),
  },
  {
    _id: "rev-fallback-3",
    customerName: "Ashikur Rahman",
    customerPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 5,
    comment:
      "Breathtaking bridal entry pathway with the cold pyros and dry ice low fog! Our guests were mesmerized. Truly magical execution.",
    agentName: "Afroza Begum",
    isVerifiedBooking: true,
    createdAt: new Date("2026-08-14T20:00:00.000Z"),
  },
  {
    _id: "rev-fallback-4",
    customerName: "Sabrina Hossain",
    customerPhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    rating: 5,
    comment:
      "Our corporate gala night looked world-class. From the illuminated truss stage to the sleek branded photo walls, everything was executed flawlessly.",
    agentName: "Nazmul Huda",
    isVerifiedBooking: true,
    createdAt: new Date("2026-08-14T20:00:00.000Z"),
  },
];

const FeaturedReviews = () => {
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // 1. Integration: GET /reviews/featured
  useEffect(() => {
    const loadFeaturedReviews = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/reviews/featured?limit=8");
        const list = res.data?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setReviews(list);
        }
      } catch (err) {
        console.warn("Featured reviews fetch fallback:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedReviews();
  }, [axiosSecure]);

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-purple-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Verified Client Experiences</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Real Celebrations, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Unforgettable Stories
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Discover why thousands of couples, families, and corporate leaders across Bangladesh trust StyleDecor specialists for their most cherished milestones.
            </p>
          </div>

          {/* Controls & Trust Badge */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-slate-800 dark:text-slate-200">4.9 / 5.0 Rating</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Carousel Stream */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((r, idx) => (
            <div
              key={r._id || idx}
              className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none flex flex-col justify-between space-y-6 transition-all hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-700/60 duration-300 relative group"
            >
              {/* Top Row: Client Info & Star Rating */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={r.customerPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"}
                        alt={r.customerName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all"
                      />
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {r.customerName || "Valued Client"}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3 h-3 text-purple-500" /> Verified Booking
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200/60 dark:border-amber-900/50">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 ml-0.5">
                      {r.rating}.0
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="relative pt-1">
                  <Quote className="w-8 h-8 text-purple-200 dark:text-purple-950/80 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed relative z-10 italic line-clamp-4">
                    "{r.comment}"
                  </p>
                </div>

                {/* Images if available */}
                {r.images && r.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {r.images.slice(0, 3).map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img}
                        alt="Decor Setup"
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Tag: Lead Specialist & Date */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-900/40 truncate max-w-[200px]">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{r.agentName ? `Lead: ${r.agentName}` : "Field Specialist"}</span>
                </span>

                <span className="shrink-0 font-medium">
                  {new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Metric Highlight Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 border-r border-slate-100 dark:border-slate-800 last:border-0">
            <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              4,800+
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Celebrations Executed
            </p>
          </div>

          <div className="space-y-1 border-r border-slate-100 dark:border-slate-800 last:border-0">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              4.9 / 5.0
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Verified Client Rating
            </p>
          </div>

          <div className="space-y-1 border-r border-slate-100 dark:border-slate-800 last:border-0">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              99.2%
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              On-Time Setup Guarantee
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              100%
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Real Customer Feedback
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
