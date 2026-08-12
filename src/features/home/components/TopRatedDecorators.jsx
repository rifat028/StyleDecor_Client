import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import pic from "../../../assets/images/Avatar.jpg";

// ==========================================
// Fallback Mock Decorator Data Configuration
// ==========================================
const fallbackDecorators = [
  {
    _id: "dec-1",
    name: "Royal Touch Decorators",
    avatar: pic,
    rating: 4.9,
    experience: 8,
    taskCompleted: 140,
    specialization: "Luxury Weddings",
    verified: true,
  },
  {
    _id: "dec-2",
    name: "DreamCraft Events",
    avatar: pic,
    rating: 4.8,
    experience: 6,
    taskCompleted: 95,
    specialization: "Floral Specialist",
    verified: true,
  },
  {
    _id: "dec-3",
    name: "Elegance Decor & Lights",
    avatar: pic,
    rating: 4.9,
    experience: 10,
    taskCompleted: 210,
    specialization: "Royal Stage & Lighting",
    verified: true,
  },
  {
    _id: "dec-4",
    name: "Vibrant Haldi & Festives", // cspell:disable-line
    avatar: pic,
    rating: 4.7,
    experience: 5,
    taskCompleted: 80,
    specialization: "Traditional Themes",
    verified: true,
  },
  {
    _id: "dec-5",
    name: "Starlight Corporate Galas",
    avatar: pic,
    rating: 4.9,
    experience: 7,
    taskCompleted: 115,
    specialization: "Corporate Galas",
    verified: true,
  },
  {
    _id: "dec-6",
    name: "Blissful Moments Decor",
    avatar: pic,
    rating: 4.8,
    experience: 9,
    taskCompleted: 165,
    specialization: "Anniversary & Parties",
    verified: true,
  },
  {
    _id: "dec-7",
    name: "Golden Venue Creations",
    avatar: pic,
    rating: 4.9,
    experience: 11,
    taskCompleted: 190,
    specialization: "Royal Weddings & Galas",
    verified: true,
  },
];

// =========================================================================
// Main Component: TopRatedDecorators
// Renders a strictly 1-way rolling Pyramid 3D CoverFlow carousel.
// Cards move strictly from Right to Left. Left-most card exits off-screen left,
// teleports silently off-screen right, and enters smoothly from the right side.
// =========================================================================
const TopRatedDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch top rated decorators from backend API
  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/decorator/toprated");
        if (res.data && res.data.length > 0) {
          setDecorators(res.data);
        } else {
          setDecorators(fallbackDecorators);
        }
      } catch (error) {
        console.error(
          "Failed to load top rated decorators, using fallback data:",
          error,
        );
        setDecorators(fallbackDecorators);
      } finally {
        setLoading(false);
      }
    };

    loadTopRated();
  }, [axiosSecure]);

  // Ensure decorators array has at least 7 items for seamless 1-way rolling
  const displayList =
    decorators.length >= 7
      ? decorators
      : [...decorators, ...fallbackDecorators].slice(0, 7);

  // Auto-shift carousel right-to-left every 3000ms (3 seconds) unless hovered
  useEffect(() => {
    if (isHovered || displayList.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, displayList.length]);

  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + displayList.length) % displayList.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayList.length);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center gap-4">
        <span className="loading loading-spinner loading-lg text-purple-600" />
        <p className="text-sm text-base-content/70">
          Loading Top Decorators...
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-base-100 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2 text-base-content dark:text-white">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Top Rated{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500">
              Decorators
            </span>
            <Sparkles className="w-7 h-7 text-purple-600" />
          </h2>
          <p className="text-sm md:text-base text-base-content/70 dark:text-gray-300 max-w-xl mx-auto">
            Handpicked, highly rated decoration agencies with verified
            experience and outstanding customer reviews.
          </p>
        </div>

        {/* 3D Pyramid CoverFlow Carousel Container */}
        <div className="relative h-105 md:h-125 flex justify-center items-center perspective-[1200px] my-6 overflow-hidden">
          {/* Navigation Button: Previous (Left) */}
          <button
            onClick={handlePrev}
            aria-label="Previous Decorator"
            className="absolute left-2 md:left-8 z-50 p-3 rounded-full bg-white/80 dark:bg-base-200/80 backdrop-blur-md shadow-xl border border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Button: Next (Right) */}
          <button
            onClick={handleNext}
            aria-label="Next Decorator"
            className="absolute right-2 md:right-8 z-50 p-3 rounded-full bg-white/80 dark:bg-base-200/80 backdrop-blur-md shadow-xl border border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Render Cards in strictly 1-way Right-to-Left Pyramid flow */}
          <div className="relative w-full max-w-md h-full flex justify-center items-center">
            {displayList.map((item, index) => {
              // Calculate shortest relative offset diff from activeIndex for wrapping loop
              let diff = index - activeIndex;
              const total = displayList.length;
              const half = Math.floor(total / 2);

              if (diff > half) diff -= total;
              if (diff < -half) diff += total;

              const isCenter = diff === 0;

              // Compute 1-way Pyramid transform parameters
              let translateX = 0;
              let translateY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;
              let rotateY = 0;
              let transitionStyle = "all 700ms ease-in-out";

              if (diff === 0) {
                // Peak of Pyramid (Center Focus Card)
                translateX = 0;
                translateY = 0;
                scale = 1.15;
                opacity = 1;
                zIndex = 40;
                rotateY = 0;
              } else if (diff === -1) {
                // Left Tier 1 (Sloped down)
                translateX = -62;
                translateY = 24;
                scale = 0.92;
                opacity = 0.85;
                zIndex = 30;
                rotateY = 18;
              } else if (diff === 1) {
                // Right Tier 1 (Sloped down)
                translateX = 62;
                translateY = 24;
                scale = 0.92;
                opacity = 0.85;
                zIndex = 30;
                rotateY = -18;
              } else if (diff === -2) {
                // Left Tier 2 (Base corner of Pyramid)
                translateX = -118;
                translateY = 52;
                scale = 0.78;
                opacity = 0.6;
                zIndex = 20;
                rotateY = 32;
              } else if (diff === 2) {
                // Right Tier 2 (Base corner of Pyramid)
                translateX = 118;
                translateY = 52;
                scale = 0.78;
                opacity = 0.6;
                zIndex = 20;
                rotateY = -32;
              } else if (diff === -3) {
                // Exiting off-screen to the far Left (smooth slide out to left)
                translateX = -220;
                translateY = 85;
                scale = 0.55;
                opacity = 0;
                zIndex = 10;
                rotateY = 45;
                transitionStyle = "all 700ms ease-in-out";
              } else {
                // Entering off-screen from far Right (Instant repositioning without backward cross-screen slide)
                translateX = 220;
                translateY = 85;
                scale = 0.55;
                opacity = 0;
                zIndex = 10;
                rotateY = -45;
                transitionStyle = "none";
              }

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
                  className={`absolute w-72 md:w-80 rounded-3xl p-6 flex flex-col items-center text-center cursor-pointer backdrop-blur-md ${
                    isCenter
                      ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/30 bg-white dark:bg-base-200"
                      : "border border-purple-200 dark:border-purple-900/40 shadow-lg bg-white/90 dark:bg-base-200/90"
                  }`}
                >
                  {/* Decorator Avatar / Logo */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-purple-500/30 p-1 bg-white dark:bg-base-300">
                      <img
                        src={item.avatar || item.photo || pic}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    {/* Verified Badge */}
                    {(item.verified ?? true) && (
                      <div className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-1 shadow-md">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Decorator Agency Name */}
                  <h3 className="font-bold text-lg md:text-xl text-gray-800 dark:text-gray-100 line-clamp-1 mb-1">
                    {item.name}
                  </h3>

                  {/* Specialization Tag */}
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mb-3">
                    {item.specialization || "Event Decorator"}
                  </span>

                  {/* Rating & Completed Events Summary */}
                  <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-100 dark:bg-base-300/60 px-4 py-2 rounded-xl w-full justify-around">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">
                        {item.rating || 4.9}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>
                        {item.taskCompleted || item.completedEvents || 120}+ Events
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      isCenter
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30"
                        : "bg-gray-200 dark:bg-base-300 text-gray-700 dark:text-gray-200 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    View Profile
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
                  : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-purple-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedDecorators;
