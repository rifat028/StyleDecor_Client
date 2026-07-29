import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

const categoriesData = [
  {
    id: 1,
    title: "Wedding & Reception",
    points: [
      "Backdrop",
      "Wedding Stage",
      "Entry Gate",
      "Lighting",
      "Royal Floral Setup",
    ],
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "Pre-Wedding & Haldi",
    points: [
      "Traditional & Colorful Theme",
      "Haldi Stage",
      "Seating Arrangement",
      "Floral Jewelry",
      "Photo Booth",
    ],
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 3,
    title: "Birthday & Anniversary",
    points: [
      "Kids Balloon Theme",
      "3D Cutouts",
      "Minimalist Adult Birthday",
      "Romantic Candlelight Setup",
    ],
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 4,
    title: "Corporate Events & Galas",
    points: [
      "Professional Seminar Stage",
      "Brand Podium",
      "Executive Lounge",
      "Award Night",
      "Product Launch Setup",
    ],
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: 5,
    title: "Baby Shower & Gender Reveal",
    points: [
      "Pastel Theme",
      "Balloon Arch",
      "Baby Block Cutout",
      "Photo Booth Decoration",
    ],
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: 6,
    title: "Cultural & Religious Festivals",
    points: [
      "Eid",
      "Puja",
      "New Year",
      "Family Get-Together",
      "Home Decoration Package",
    ],
    color: "from-red-500 to-rose-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Categories = () => {
  return (
    <div className="py-16 bg-base-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-2"
          >
            <Sparkles className="text-primary w-8 h-8" />
            Our Categories
            <Sparkles className="text-primary w-8 h-8" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
          >
            Discover our wide range of decoration services tailored to make your special moments unforgettable.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categoriesData.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-2xl shadow-xl bg-base-200 border border-base-300 group"
            >
              {/* Gradient Banner Top */}
              <div className={`h-2 w-full bg-gradient-to-r ${category.color}`}></div>

              <div className="px-5 py-4 md:px-6 md:py-5">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-base-content group-hover:text-primary transition-colors duration-300">
                  {category.title}
                </h3>
                <ul className="space-y-1.5">
                  {category.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-base-content/80">
                      <CheckCircle2 className={`w-4 h-4 mt-1 shrink-0 text-primary`} />
                      <span className="text-sm md:text-[15px] leading-tight">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subtle background glow effect on hover */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-2xl -z-10`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
