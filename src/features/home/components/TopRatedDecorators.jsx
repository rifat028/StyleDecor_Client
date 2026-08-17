import React, { useState, useEffect, useRef, useCallback } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";
import RatingBadge from "../../../components/ui/RatingBadge";

// Fallback dummy decorators dataset in case server is starting up
const fallbackDecorators = [
  {
    _id: "dec-fallback-1",
    businessName: "DreamCraft Events & Decors",
    tagline: "Royal Weddings & Floral Wonders",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    metrics: { rating: 5.0, completedEvents: 142 },
    contactInfo: { city: "Dhaka" },
    verification: { isVerified: true },
  },
  {
    _id: "dec-fallback-2",
    businessName: "Royal Touch Wedding & Events",
    tagline: "Grand Wedding & Stage Specialists",
    logo: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
    metrics: { rating: 4.9, completedEvents: 128 },
    contactInfo: { city: "Dhaka" },
    verification: { isVerified: true },
  },
  {
    _id: "dec-fallback-3",
    businessName: "Bloom & Blossom Floral Decors",
    tagline: "Eco-Friendly Fresh Botanical Styling",
    logo: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400",
    metrics: { rating: 4.9, completedEvents: 95 },
    contactInfo: { city: "Chattogram" },
    verification: { isVerified: true },
  },
  {
    _id: "dec-fallback-4",
    businessName: "Kiddos & Confetti Birthday Planners",
    tagline: "Vibrant Children & Milestone Parties",
    logo: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
    metrics: { rating: 4.8, completedEvents: 84 },
    contactInfo: { city: "Dhaka" },
    verification: { isVerified: true },
  },
  {
    _id: "dec-fallback-5",
    businessName: "Elite Corporate Stages & Expos",
    tagline: "Corporate Galas & Tech Conventions",
    logo: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400",
    metrics: { rating: 4.9, completedEvents: 110 },
    contactInfo: { city: "Dhaka" },
    verification: { isVerified: true },
  },
  {
    _id: "dec-fallback-6",
    businessName: "Cozy Corner Home & Rooftop Decors",
    tagline: "Boutique Rooftop & Intimate Gatherings",
    logo: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400",
    metrics: { rating: 4.8, completedEvents: 67 },
    contactInfo: { city: "Sylhet" },
    verification: { isVerified: true },
  },
  {
    _id: "dec-fallback-7",
    businessName: "Lumina FX & Stage Lighting BD",
    tagline: "Intelligent Laser & Concert Ambience",
    logo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    metrics: { rating: 4.9, completedEvents: 92 },
    contactInfo: { city: "Dhaka" },
    verification: { isVerified: true },
  },
];

const getPlaceholderLogo = (name = "Decorator") => {
  const initials = encodeURIComponent(name || "Decorator");
  return `https://ui-avatars.com/api/?name=${initials}&background=7C3AED&color=ffffff&bold=true&size=200`;
};

// Top rated decorators 3D coverflow carousel
const TopRatedDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  // Fetch top rated decorators from backend API
  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/decorators/toprated?limit=8");
        const list = res.data?.data || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setDecorators(list);
        } else {
          setDecorators(fallbackDecorators);
        }
      } catch (error) {
        console.warn(
          "Failed to load top rated decorators from API, using fallback data:",
          error.message
        );
        setDecorators(fallbackDecorators);
      } finally {
        setLoading(false);
      }
    };

    loadTopRated();
  }, [axiosSecure]);

  // Ensure decorators array has at least 7 items for seamless coverflow
  const displayList =
    decorators.length >= 7
      ? decorators
      : [...decorators, ...fallbackDecorators].slice(0, 7);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + displayList.length) % displayList.length
    );
  }, [displayList.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % displayList.length);
  }, [displayList.length]);

  // Auto-pause when not visible in viewport using IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-shift carousel every 3500ms when visible and not hovered
  useEffect(() => {
    if (isHovered || !isVisible || displayList.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, isVisible, displayList.length, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Top Rated Decorators Carousel"
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden outline-none"
    >
      {/* Section Header */}
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-200 dark:border-purple-800">
          <Sparkles className="w-3.5 h-3.5" /> Elite Event Artisans
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Top Rated Decorators
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Partner with Bangladesh's most celebrated wedding planners, stage architects, and creative event stylists.
        </p>
      </div>

      {loading ? (
        /* Card Skeleton Loader */
        <div className="relative w-full max-w-5xl mx-auto h-[460px] flex items-center justify-center">
          <div className="w-72 md:w-80 h-[380px] bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col items-center justify-between shadow-lg">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="w-40 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ) : (
        /* 3D CoverFlow Carousel Container */
        <div
          className="relative w-full max-w-5xl mx-auto flex flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Buttons (Left & Right) */}
          <button
            onClick={handlePrev}
            aria-label="Previous decorator"
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white p-3 rounded-full shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 backdrop-blur-xs border border-slate-200 dark:border-slate-700 hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next decorator"
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white p-3 rounded-full shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 backdrop-blur-xs border border-slate-200 dark:border-slate-700 hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Viewport with 3D perspective */}
          <div
            className="relative w-full h-[460px] flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {displayList.map((item, index) => {
                const N = displayList.length;
                let diff = (index - activeIndex) % N;
                if (diff < 0) diff += N;
                if (diff > Math.floor(N / 2)) diff -= N;

                const isCenter = diff === 0;

                let translateX = 0;
                let translateY = 0;
                let scale = 1;
                let opacity = 1;
                let zIndex = 30;
                let rotateY = 0;
                let transitionStyle = "all 600ms cubic-bezier(0.25, 1, 0.5, 1)";

                if (diff === 0) {
                  translateX = 0;
                  translateY = 0;
                  scale = 1.05;
                  opacity = 1;
                  zIndex = 30;
                  rotateY = 0;
                } else if (diff === -1) {
                  translateX = -62;
                  translateY = 25;
                  scale = 0.88;
                  opacity = 0.85;
                  zIndex = 25;
                  rotateY = 18;
                } else if (diff === 1) {
                  translateX = 62;
                  translateY = 25;
                  scale = 0.88;
                  opacity = 0.85;
                  zIndex = 25;
                  rotateY = -18;
                } else if (diff === -2) {
                  translateX = -118;
                  translateY = 52;
                  scale = 0.78;
                  opacity = 0.6;
                  zIndex = 20;
                  rotateY = 32;
                } else if (diff === 2) {
                  translateX = 118;
                  translateY = 52;
                  scale = 0.78;
                  opacity = 0.6;
                  zIndex = 20;
                  rotateY = -32;
                } else if (diff === -3) {
                  translateX = -220;
                  translateY = 85;
                  scale = 0.55;
                  opacity = 0;
                  zIndex = 10;
                  rotateY = 45;
                  transitionStyle = "all 700ms ease-in-out";
                } else {
                  translateX = 220;
                  translateY = 85;
                  scale = 0.55;
                  opacity = 0;
                  zIndex = 10;
                  rotateY = -45;
                  transitionStyle = "none";
                }

                const businessName =
                  item.businessName || item.name || "Celebrated Decorator";
                const tagline =
                  item.tagline || item.specialization || "Luxury Event Styling";
                const rating = item.metrics?.rating || item.rating || 5.0;
                const eventsCount =
                  item.metrics?.completedEvents ||
                  item.taskCompleted ||
                  100;
                const city =
                  item.contactInfo?.city || item.location || "Dhaka";
                const isVerified =
                  item.verification?.isVerified ?? (item.verified ?? true);

                return (
                  <div
                    key={item._id || index}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => isCenter && setIsHovered(true)}
                    onMouseLeave={() => isCenter && setIsHovered(false)}
                    style={{
                      transform: `translateX(${translateX}%) translateY(${translateY}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      transition: transitionStyle,
                    }}
                    className={`absolute w-72 md:w-80 rounded-3xl p-6 flex flex-col items-center text-center cursor-pointer backdrop-blur-md transition-shadow duration-300 ${
                      isCenter
                        ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/30 bg-white dark:bg-slate-900"
                        : "border border-purple-200 dark:border-purple-900/40 shadow-lg bg-white/90 dark:bg-slate-900/90"
                    }`}
                  >
                    {/* Decorator Avatar / Logo */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-purple-500/30 p-1 bg-white dark:bg-slate-800 shadow-md">
                        <img
                          src={
                            item.logo ||
                            item.avatar ||
                            item.photo ||
                            getPlaceholderLogo(businessName)
                          }
                          alt={businessName}
                          onError={(e) => {
                            e.currentTarget.src = getPlaceholderLogo(businessName);
                          }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      {/* Verified Badge */}
                      {isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-1 shadow-md ring-2 ring-white dark:ring-slate-900">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Decorator Agency Name */}
                    <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                      {businessName}
                    </h3>

                    {/* Specialization Tag */}
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 mb-2 truncate max-w-[240px]">
                      {tagline}
                    </span>

                    {/* City Badge */}
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {city} Base
                    </span>

                    {/* Rating & Completed Events Summary */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-4 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-xl w-full justify-around">
                      <RatingBadge value={rating} showCount={false} />
                      <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>{eventsCount}+ Events</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/top-decorators");
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                        isCenter
                          ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      Explore Agency <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8 z-10 relative">
            {displayList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to decorator ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-8 bg-purple-600"
                    : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-purple-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopRatedDecorators;
