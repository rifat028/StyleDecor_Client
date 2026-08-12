import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  PartyPopper,
  Cake,
  Building2,
  Baby,
  Tent,
} from "lucide-react";

// ==========================================
// Image Imports for Left Showcase Component
// ==========================================
import cat1_a from "../../../assets/images/categories/img-01.png";
import cat1_b from "../../../assets/images/categories/img-02.png";
import cat2_a from "../../../assets/images/categories/img-03.png";
import cat2_b from "../../../assets/images/categories/img-04.png";
import cat3_a from "../../../assets/images/categories/img-05.png";
import cat3_b from "../../../assets/images/categories/img-06.png";

// ==========================================
// Category Mock Data Configuration
// ==========================================
// List of all decoration categories displayed in the right infinite scrolling marquees
const categories = [
  {
    id: 1,
    title: "Wedding & Reception",
    subtitle: "Royal floral & lighting setup",
    icon: HeartHandshake,
  },
  {
    id: 2,
    title: "Pre-Wedding & Haldi", // cspell:disable-line
    subtitle: "Traditional & colorful themes",
    icon: PartyPopper,
  },
  {
    id: 3,
    title: "Birthday & Anniversary",
    subtitle: "Custom 3D & minimalist designs",
    icon: Cake,
  },
  {
    id: 4,
    title: "Corporate Events",
    subtitle: "Professional stages & galas",
    icon: Building2,
  },
  {
    id: 5,
    title: "Baby Shower",
    subtitle: "Pastel themes & photo booths",
    icon: Baby,
  },
  {
    id: 6,
    title: "Cultural & Religious",
    subtitle: "Festive home & event decors",
    icon: Tent,
  },
];

// Split category list into 2 columns for dual-direction marquee animation
const col1 = categories.slice(0, 3); // Displays in Column 1 (Downward Scroll)
const col2 = categories.slice(3, 6); // Displays in Column 2 (Upward Scroll)

// =========================================================================
// Sub-Component: SingleImageSwapCard
// Renders a single card displaying 1 image at a time.
// Every 3 seconds (3000ms), the current image fades out and the next fades in.
// Counter-rotates by -45deg to offset initial rotation, and stays upright.
// =========================================================================
const SingleImageSwapCard = ({ images }) => {
  // State tracking active image index (0 or 1) for the 3-second transition loop
  const [activeIndex, setActiveIndex] = useState(0);

  // Hook setting up the 3000ms timer interval to toggle activeIndex
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-2xl sm:rounded-4xl overflow-hidden shadow-2xl bg-white/80 dark:bg-base-200/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/30 animate-spin-slow-reverse z-10 flex items-center justify-center">
      {/* Image A */}
      <img
        src={images[0]}
        alt="Showcase Image A"
        className={`absolute inset-0 w-full h-full object-cover -rotate-60 transition-all duration-1000 ease-in-out ${
          activeIndex === 0 ? "opacity-100 scale-150" : "opacity-0 scale-135"
        }`}
      />
      {/* Image B */}
      <img
        src={images[1]}
        alt="Showcase Image B"
        className={`absolute inset-0 w-full h-full object-cover -rotate-60 transition-all duration-1000 ease-in-out ${
          activeIndex === 1 ? "opacity-100 scale-150" : "opacity-0 scale-100"
        }`}
      />
    </div>
  );
};

// =========================================================================
// Sub-Component: CategoryCard
// Renders individual category cards used inside the infinite scrolling marquee columns.
// Features icon, title, subtitle, glassmorphic design, and interactive hover effects.
// =========================================================================
const CategoryCard = ({ data }) => {
  const Icon = data.icon;
  return (
    <div className="bg-white/80 dark:bg-base-200/80 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 dark:border-purple-900/30 flex items-center gap-4 group hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer relative overflow-hidden">
      {/* Category Icon Container */}
      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 z-10 shrink-0">
        <Icon className="w-6 h-6" />
      </div>

      {/* Category Text Content */}
      <div className="z-10">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
          {data.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {data.subtitle}
        </p>
      </div>

      {/* Interactive Background Gradient Glow Effect on Hover */}
      <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 z-0"></div>
    </div>
  );
};

// =========================================================================
// Main Component: Categories
// Displays the overall section layout with Header, Left Animated Showcase,
// and Right Infinite Marquee columns.
// =========================================================================
const Categories = () => {
  return (
    <section className="min-h-screen py-20 bg-base-100 flex items-center justify-center overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ------------------------------------------------------------- */}
        {/* Section Header (Title & Subtitle)                             */}
        {/* ------------------------------------------------------------- */}
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500">
              Our Categories
            </span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover a world of breathtaking setups designed for your special
            moments.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Main 3-Column Responsive Grid Layout                         */}
        {/* ------------------------------------------------------------- */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* =========================================================== */}
          {/* Left Section: 1 Column (33% width)                          */}
          {/* 45-Degree Rotated Outer Container with 3 SingleImageSwapCards*/}
          {/* Arranged in a Pyramid Shape                                  */}
          {/* =========================================================== */}
          <div className="lg:col-span-1 flex justify-center items-center max-h-100 ">
            {/* Spinning Master Container rotated by 45 degrees */}
            <div className="relative flex flex-col items-center gap-4 rotate-45 animate-spin-slow">
              {/* Pyramid Line 1: Top SingleImageSwapCard */}
              <SingleImageSwapCard images={[cat1_a, cat1_b]} />

              {/* Pyramid Line 2: Bottom 2 SingleImageSwapCards side-by-side */}
              <div className="flex gap-4">
                <SingleImageSwapCard images={[cat2_a, cat2_b]} />
                <SingleImageSwapCard images={[cat3_a, cat3_b]} />
              </div>
            </div>
          </div>

          {/* =========================================================== */}
          {/* Right Section: 2 Columns (66% width)                         */}
          {/* Dual Vertical Infinite Scrolling Category Cards              */}
          {/* =========================================================== */}
          <div
            className="lg:col-span-2 max-h-100 overflow-hidden relative"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full pt-4">
              {/* Marquee Column 1: Infinite Downward Scroll Animation */}
              <div className="flex flex-col gap-6 animate-marquee-down">
                {[...col1, ...col1, ...col1, ...col1].map((cat, i) => (
                  <CategoryCard key={`col1-${i}`} data={cat} />
                ))}
              </div>

              {/* Marquee Column 2: Infinite Upward Scroll Animation */}
              <div className="flex flex-col gap-6 animate-marquee-up">
                {[...col2, ...col2, ...col2, ...col2].map((cat, i) => (
                  <CategoryCard key={`col2-${i}`} data={cat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
