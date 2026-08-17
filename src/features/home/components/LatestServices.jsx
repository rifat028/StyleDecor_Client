import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Sparkles,
  Tag,
  PackageOpen,
  CheckCircle2,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import RatingBadge from "../../../components/ui/RatingBadge";
import EmptyState from "../../../components/ui/EmptyState";
import { formatCurrency } from "../../../lib/format";

import img1 from "../../../assets/images/categories/img-01.png";
import img2 from "../../../assets/images/categories/img-02.png";
import img3 from "../../../assets/images/categories/img-03.png";
import img4 from "../../../assets/images/categories/img-04.png";
import img5 from "../../../assets/images/categories/img-05.png";
import img6 from "../../../assets/images/categories/img-06.png";

const DEFAULT_SERVICE_PRICE = 20000;

// Fallback Mock Data Configuration
const fallbackServices = [
  {
    _id: "srv-1",
    title: "Royal Floral Wedding Stage",
    category: "Wedding & Pre-Wedding",
    pricing: { discountedPrice: 25000, basePrice: 28000 },
    metrics: { rating: 4.9, reviewCount: 48 },
    shortDescription:
      "Exquisite royal stage decoration featuring fresh roses, crystal chandeliers, and warm ambient spotlighting.",
    decorator: { businessName: "DreamCraft Events & Decors", contactInfo: { city: "Dhaka" } },
    coverImage: img1,
  },
  {
    _id: "srv-2",
    title: "Vibrant Haldi & Mehendi Canopy",
    category: "Wedding & Pre-Wedding",
    pricing: { discountedPrice: 15000, basePrice: 18000 },
    metrics: { rating: 4.8, reviewCount: 32 },
    shortDescription:
      "Traditional marigold floral drapes, colorful seating cushions, and festive photo backdrop for Haldi ceremony.",
    decorator: { businessName: "Royal Touch Wedding & Events", contactInfo: { city: "Dhaka" } },
    coverImage: img2,
  },
  {
    _id: "srv-3",
    title: "Minimalist Pastel Birthday Theme",
    category: "Birthday & Milestone",
    pricing: { discountedPrice: 12000, basePrice: 15000 },
    metrics: { rating: 4.9, reviewCount: 29 },
    shortDescription:
      "Modern 3D arch cutouts, pastel balloon garlands, LED neon sign, and custom cake table arrangement.",
    decorator: { businessName: "Kiddos & Confetti Birthday Planners", contactInfo: { city: "Dhaka" } },
    coverImage: img3,
  },
  {
    _id: "srv-4",
    title: "Corporate Gala & Award Night Stage",
    category: "Corporate & Commercial",
    pricing: { discountedPrice: 45000, basePrice: 50000 },
    metrics: { rating: 4.9, reviewCount: 54 },
    shortDescription:
      "Sleek professional seminar stage backdrop, brand podiums, executive lounge, and intelligent truss lighting.",
    decorator: { businessName: "Elite Corporate Stages & Expos", contactInfo: { city: "Dhaka" } },
    coverImage: img4,
  },
  {
    _id: "srv-5",
    title: "Grand Reception Entrance Walkway",
    category: "Wedding & Pre-Wedding",
    pricing: { discountedPrice: 30000, basePrice: 35000 },
    metrics: { rating: 4.8, reviewCount: 41 },
    shortDescription:
      "Fairy light tunnel walkway with plush velvet carpet and grand floral archway entrance for wedding guests.",
    decorator: { businessName: "Royal Touch Wedding & Events", contactInfo: { city: "Dhaka" } },
    coverImage: img5,
  },
  {
    _id: "srv-6",
    title: "Pastel Baby Shower Setup",
    category: "Birthday & Milestone",
    pricing: { discountedPrice: 18000, basePrice: 20000 },
    metrics: { rating: 4.7, reviewCount: 22 },
    shortDescription:
      "Cute baby block cutouts, organic balloon arches, pastel floral arrangements, and photo booth decor.",
    decorator: { businessName: "Bloom & Blossom Floral Decors", contactInfo: { city: "Chattogram" } },
    coverImage: img6,
  },
];

// Available filter categories
const filterCategories = [
  "All",
  "Wedding",
  "Birthday",
  "Corporate",
  "Home & Rooftop",
];

const LatestServices = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  // Fetch latest services from backend API endpoint
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/services/latest");
        const list = res.data?.data || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setServices(list);
        } else {
          setServices(fallbackServices);
        }
      } catch (error) {
        console.warn("Failed to load latest services, using fallback:", error);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [axiosSecure]);

  // Filter services according to category tab
  const filteredServices = services.filter((item) => {
    if (activeTab === "All") return true;
    const cat = (typeof item.category === "string" ? item.category : item.category?.name || item.serviceCategory || "").toLowerCase();
    const target = activeTab.toLowerCase();
    return cat.includes(target);
  });

  const displayedServices = filteredServices.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-base-100 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-base-content dark:text-white">
            <Sparkles className="w-8 h-8 text-amber-500" />
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">
              Trending Packages
            </span>
          </h2>
          <p className="text-sm md:text-base text-base-content/70 max-w-2xl mx-auto">
            Browse handpicked decoration packages designed for memorable weddings, milestones, and corporate celebrations.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105"
                    : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4 shadow-xs"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : displayedServices.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No Packages Found"
            message={`We couldn't find any packages under "${activeTab}".`}
            action={{
              label: "Show All Packages",
              onClick: () => setActiveTab("All"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((service, index) => {
              const serviceImg =
                service.coverImage ||
                service.images?.[0] ||
                service.image ||
                fallbackServices[index % fallbackServices.length].coverImage;

              const title = service.title || service.serviceName || "Celebration Decor Package";
              const catName = typeof service.category === "string" ? service.category : (service.category?.name || service.serviceCategory || "Decor Package");
              const price = service.pricing?.discountedPrice || service.pricing?.basePrice || service.cost || DEFAULT_SERVICE_PRICE;
              const vendorName = service.decorator?.businessName || service.vendor || "StyleDecor Verified Agency";
              const rating = service.metrics?.rating || service.rating || 4.9;
              const reviewsCount = service.metrics?.reviewCount || service.totalReviews || 28;
              const desc = service.shortDescription || service.description || "Bespoke event decoration setup with premium structural framing and ambient illumination.";

              return (
                <div
                  key={service._id || index}
                  onClick={() => navigate(`/services/${service._id}`)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Banner Image & Floating Badges */}
                  <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={serviceImg}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {catName}
                    </div>

                    {/* Price Tag Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 text-purple-700 dark:text-purple-300 text-xs font-black px-3.5 py-1 rounded-full backdrop-blur-md shadow-md border border-purple-200 dark:border-purple-800">
                      {formatCurrency(price)}
                    </div>
                  </div>

                  {/* Service Card Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Vendor Attribution & Rating */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate max-w-[160px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        {vendorName}
                      </span>

                      <RatingBadge value={rating} count={reviewsCount} />
                    </div>

                    {/* Action CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/services/${service._id}`);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all duration-300 cursor-pointer"
                    >
                      Book Package
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Services CTA Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/services")}
            className="px-8 py-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white border border-purple-200 dark:border-purple-800 font-bold text-sm transition-all duration-300 shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            Browse Complete Catalog ({services.length}+ Services)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestServices;
