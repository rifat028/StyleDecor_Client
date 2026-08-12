import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Star,
  ArrowRight,
  Sparkles,
  Tag,
  PackageOpen,
  CheckCircle2,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import img1 from "../../../assets/images/categories/img-01.png";
import img2 from "../../../assets/images/categories/img-02.png";
import img3 from "../../../assets/images/categories/img-03.png";
import img4 from "../../../assets/images/categories/img-04.png";
import img5 from "../../../assets/images/categories/img-05.png";
import img6 from "../../../assets/images/categories/img-06.png";

// ==========================================
// Fallback Mock Data Configuration
// Used if API endpoint is loading or returns empty
// ==========================================
const fallbackServices = [
  {
    _id: "srv-1",
    serviceName: "Royal Floral Wedding Stage",
    serviceCategory: "Wedding",
    cost: 25000,
    unit: "per event",
    rating: 4.9,
    totalReviews: 48,
    description:
      "Exquisite royal stage decoration featuring fresh roses, crystal chandeliers, and warm ambient spotlighting.",
    vendor: "DreamCraft Decorators",
    image: img1,
  },
  {
    _id: "srv-2",
    serviceName: "Vibrant Haldi & Mehendi Setup", // cspell:disable-line
    serviceCategory: "Haldi & Mehendi", // cspell:disable-line
    cost: 15000,
    unit: "per event",
    rating: 4.8,
    totalReviews: 32,
    description:
      "Traditional marigold floral drapes, colorful seating cushions, and festive photo backdrop for Haldi ceremony.",
    vendor: "Vibrant Festives",
    image: img2,
  },
  {
    _id: "srv-3",
    serviceName: "Minimalist Pastel Birthday Theme",
    serviceCategory: "Birthday",
    cost: 12000,
    unit: "per package",
    rating: 4.9,
    totalReviews: 29,
    description:
      "Modern 3D arch cutouts, pastel balloon garlands, LED neon sign, and custom cake table arrangement.",
    vendor: "Blissful Moments",
    image: img3,
  },
  {
    _id: "srv-4",
    serviceName: "Corporate Gala & Award Night Stage",
    serviceCategory: "Corporate",
    cost: 45000,
    unit: "per event",
    rating: 4.9,
    totalReviews: 54,
    description:
      "Sleek professional seminar stage backdrop, brand podiums, executive lounge, and intelligent truss lighting.",
    vendor: "Starlight Corporate Galas",
    image: img4,
  },
  {
    _id: "srv-5",
    serviceName: "Grand Reception Entrance Walkway",
    serviceCategory: "Wedding",
    cost: 30000,
    unit: "per event",
    rating: 4.8,
    totalReviews: 41,
    description:
      "Fairy light tunnel walkway with plush velvet carpet and grand floral archway entrance for wedding guests.",
    vendor: "Royal Touch Decorators",
    image: img5,
  },
  {
    _id: "srv-6",
    serviceName: "Pastel Baby Shower Setup",
    serviceCategory: "Birthday",
    cost: 18000,
    unit: "per package",
    rating: 4.7,
    totalReviews: 22,
    description:
      "Cute baby block cutouts, organic balloon arches, pastel floral arrangements, and photo booth decor.",
    vendor: "Elegance Decor & Lights",
    image: img6,
  },
];

// Available filter categories
const filterCategories = [
  "All",
  "Wedding",
  "Haldi & Mehendi", // cspell:disable-line
  "Birthday",
  "Corporate",
];

// =========================================================================
// Main Component: LatestServices
// Enterprise-grade trending decoration package showcase with category quick-tabs,
// skeletal loading, responsive card grid, and empty states.
// =========================================================================
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
        const res = await axiosSecure("/services/latest");
        if (res.data && res.data.length > 0) {
          setServices(res.data);
        } else {
          setServices(fallbackServices);
        }
      } catch (error) {
        console.error(
          "Failed to load latest services, using fallback data:",
          error,
        );
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [axiosSecure]);

  // Filter services array according to the active category tab
  const filteredServices = services.filter((item) => {
    if (activeTab === "All") return true;
    const itemCat = (item.serviceCategory || "").toLowerCase();
    const targetCat = activeTab.toLowerCase();
    if (targetCat.includes("haldi") || targetCat.includes("mehendi")) {
      return itemCat.includes("haldi") || itemCat.includes("mehendi");
    }
    return itemCat.includes(targetCat);
  });

  // Limit display to 6 primary cards on homepage
  const displayedServices = filteredServices.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-base-100 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ------------------------------------------------------------- */}
        {/* Section Header                                                */}
        {/* ------------------------------------------------------------- */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-base-content dark:text-white">
            <Sparkles className="w-8 h-8 text-amber-500" />
            Explore Our{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-500 via-purple-600 to-pink-500">
              Trending Decoration Packages
            </span>
            <Sparkles className="w-8 h-8 text-amber-500" />
          </h2>
          <p className="text-base md:text-lg text-base-content/70 dark:text-gray-300 max-w-2xl mx-auto">
            Discover handpicked, top-rated decoration setups tailored for your
            special occasions.
          </p>

          {/* ----------------------------------------------------------- */}
          {/* Dynamic Filter Quick-Tabs                                   */}
          {/* ----------------------------------------------------------- */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mt-8 flex-wrap">
            {filterCategories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105"
                      : "bg-white dark:bg-base-200 text-gray-700 dark:text-gray-300 hover:bg-amber-500/10 hover:text-amber-600 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <Tag
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-white" : "text-amber-500"
                    }`}
                  />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Skeletal Loading State (6 Pulse Loader Cards)                 */}
        {/* ------------------------------------------------------------- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-base-200 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-800 animate-pulse flex flex-col gap-4"
              >
                <div className="w-full h-48 bg-gray-200 dark:bg-base-300 rounded-xl" />
                <div className="h-6 bg-gray-200 dark:bg-base-300 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-base-300 rounded-md w-full" />
                <div className="h-4 bg-gray-200 dark:bg-base-300 rounded-md w-1/2" />
                <div className="h-10 bg-gray-200 dark:bg-base-300 rounded-xl w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : displayedServices.length === 0 ? (
          /* ----------------------------------------------------------- */
          /* Empty State Component                                        */
          /* ----------------------------------------------------------- */
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white/50 dark:bg-base-200/50 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 max-w-md mx-auto">
            <PackageOpen className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No Decoration Packages Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We couldn't find any packages under "{activeTab}". Try switching
              to another category tab.
            </p>
            <button
              onClick={() => setActiveTab("All")}
              className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors shadow-md cursor-pointer"
            >
              Show All Packages
            </button>
          </div>
        ) : (
          /* ----------------------------------------------------------- */
          /* Responsive Card Grid (6 Cards Limit)                        */
          /* ----------------------------------------------------------- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((service, index) => {
              // Select image from service object or assign fallback banner
              const serviceImg =
                service.image ||
                service.photo ||
                fallbackServices[index % fallbackServices.length].image;

              const vendorName =
                service.vendor ||
                service.decoratorName ||
                "DreamCraft Decorators";

              return (
                <div
                  key={service._id || index}
                  className="group bg-white dark:bg-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-purple-100 dark:border-purple-900/30 flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  {/* Banner Image & Floating Badges */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={serviceImg}
                      alt={service.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Top-Left Category Badge */}
                    <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {service.serviceCategory || "Special"}
                    </div>

                    {/* Top-Right Price Tag Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-base-300/90 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                      ৳{service.cost || "15,000"}
                    </div>
                  </div>

                  {/* Service Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-amber-600 transition-colors line-clamp-1 mb-2">
                      {service.serviceName}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {service.description ||
                        "Tailored decoration setup with elegant floral work, lighting arrangements, and custom photo backdrops."}
                    </p>

                    {/* Vendor Attribution & Rating */}
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        {vendorName}
                      </span>

                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {service.rating || 4.9}
                        </span>
                        <span>({service.totalReviews || 35})</span>
                      </div>
                    </div>

                    {/* Action CTA Button */}
                    <button
                      onClick={() => navigate(`/services/${service._id}`)}
                      className="mt-5 w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md group-hover:shadow-amber-600/30 transition-all duration-300 cursor-pointer"
                    >
                      Book Package
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Bottom CTA: Explore All Services                             */}
        {/* ------------------------------------------------------------- */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/services")}
            className="px-8 py-3.5 rounded-full bg-linear-to-r from-amber-600 to-purple-600 text-white font-bold text-base shadow-xl hover:shadow-amber-600/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            Explore All Services
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestServices;
